import spacy

# Load spaCy model (ensure it's downloaded)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def chunk_text(text, chunk_size=500, overlap=50):
    """
    Chunks text into smaller segments using spaCy for sentence boundary detection.
    """
    doc = nlp(text)
    sentences = [sent.text for sent in doc.sents]
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= chunk_size:
            current_chunk += sentence + " "
        else:
            chunks.append(current_chunk.strip())
            # Simple overlap strategy: keep last 'overlap' characters (rough approximation)
            # Better: keep last N sentences, but for now simple sliding window of text
            current_chunk = sentence + " "
            
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks
