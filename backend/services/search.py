import os
import json
from rank_bm25 import BM25Okapi
from .vector_store import query_vectors, get_embeddings

def hybrid_search(query, all_documents, top_k=5, doc_id=None):
    """
    Perform hybrid search using Pinecone (Vector) and BM25 (Keyword).
    doc_id: Optional document ID to filter results and load specific corpus.
    """
    # 1. Vector Search
    query_embedding = get_embeddings(query)
    vector_results = []
    
    # Construct filter if doc_id is provided
    filter = {"doc_id": doc_id} if doc_id else None
    
    if query_embedding:
        print("DEBUG: Query embedding generated.")
        vector_res = query_vectors(query_embedding, top_k=top_k, filter=filter)
        if vector_res:
            # Store (text, score) tuples
            vector_results = [(match['metadata']['text'], match['score']) for match in vector_res['matches']]
            print(f"DEBUG: Retrieved {len(vector_results)} chunks from vector search.")
    else:
        print("DEBUG: Failed to generate query embedding.")

    # 2. Keyword Search (BM25)
    bm25_results = []
    if doc_id:
        try:
            chunks_path = os.path.join('uploads', f"{doc_id}.json")
            if os.path.exists(chunks_path):
                with open(chunks_path, 'r') as f:
                    corpus = json.load(f)
                
                tokenized_corpus = [doc.split(" ") for doc in corpus]
                bm25 = BM25Okapi(tokenized_corpus)
                tokenized_query = query.split(" ")
                
                # Get top-k BM25 results
                # We get all scores and sort them
                doc_scores = bm25.get_scores(tokenized_query)
                # Create (text, score) tuples
                bm25_scores = zip(corpus, doc_scores)
                sorted_bm25 = sorted(bm25_scores, key=lambda x: x[1], reverse=True)
                bm25_results = sorted_bm25[:top_k]
                print(f"DEBUG: Retrieved {len(bm25_results)} chunks from BM25 search.")
            else:
                print(f"DEBUG: Chunks file not found for doc_id: {doc_id}")
        except Exception as e:
            print(f"Error in BM25 search: {e}")

    # 3. Fusion (Simple Deduplication & Combination)
    # RRF is better but for now let's combine and deduplicate preserving order
    # We'll interleave results: Vector #1, BM25 #1, Vector #2, BM25 #2...
    
    final_results = []
    seen_texts = set()
    
    max_len = max(len(vector_results), len(bm25_results))
    for i in range(max_len):
        if i < len(vector_results):
            text = vector_results[i][0]
            if text not in seen_texts:
                final_results.append(text)
                seen_texts.add(text)
        
        if i < len(bm25_results):
            text = bm25_results[i][0]
            if text not in seen_texts:
                final_results.append(text)
                seen_texts.add(text)
                
    # Limit to top_k
    return final_results[:top_k]
