import os
import pinecone
from pinecone import Pinecone, ServerlessSpec
import requests
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone
pc = None
index = None

try:
    api_key = os.getenv("PINECONE_API_KEY")
    if api_key and api_key != "your_pinecone_api_key":
        pc = Pinecone(api_key=api_key)
        index_name = "docuai-index-v3"

        # Create index if not exists
        if index_name not in pc.list_indexes().names():
            pc.create_index(
                name=index_name,
                dimension=384, # all-MiniLM-L6-v2 dimension
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
        index = pc.Index(index_name)
    else:
        print("Warning: PINECONE_API_KEY not set or invalid. Vector storage will not work.")
except Exception as e:
    print(f"Error initializing Pinecone: {e}")

# Initialize Local Embedding Model
try:
    from sentence_transformers import SentenceTransformer
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("DEBUG: Loaded local embedding model: all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error loading sentence-transformers: {e}")
    embedding_model = None

def get_embeddings(text):
    """
    Generate embeddings using local SentenceTransformer (free, robust).
    Dimension: 384
    """
    if not embedding_model:
        print("Embedding model not loaded.")
        return None
        
    try:
        # Generate embedding
        embedding = embedding_model.encode(text).tolist()
        print(f"DEBUG: Generated embedding of length {len(embedding)}")
        return embedding
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None

def upsert_vectors(vectors):
    """
    Upsert vectors to Pinecone.
    vectors: list of (id, embedding, metadata) tuples
    """
    if not index:
        print("Pinecone index not initialized.")
        return

    try:
        print(f"DEBUG: Upserting {len(vectors)} vectors to Pinecone...")
        index.upsert(vectors=vectors)
        print("DEBUG: Upsert successful.")
    except Exception as e:
        print(f"Error upserting vectors: {e}")

def query_vectors(query_embedding, top_k=5, filter=None):
    """
    Query Pinecone index.
    """
    if not index:
        print("Pinecone index not initialized.")
        return None

    try:
        print(f"DEBUG: Querying Pinecone with filter: {filter}")
        results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True, filter=filter)
        print(f"DEBUG: Found {len(results['matches'])} matches.")
        return results
    except Exception as e:
        print(f"Error querying vectors: {e}")
        return None
