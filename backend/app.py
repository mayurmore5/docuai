import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

from services.ingestion import extract_text_from_file
from services.chunking import chunk_text
from services.vector_store import get_embeddings, upsert_vectors
from services.search import hybrid_search
from services.rag import generate_answer

load_dotenv()

app = Flask(__name__)
CORS(app) # Allow all origins by default

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "DocuAI Backend"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # 1. Extract Text
            text = extract_text_from_file(file_path)
            
            # 2. Chunk Text
            chunks = chunk_text(text)
            
            # 3. Embed and Upsert
            vectors = []
            doc_id = str(uuid.uuid4())
            for i, chunk in enumerate(chunks):
                embedding = get_embeddings(chunk)
                if embedding:
                    vectors.append({
                        "id": f"{doc_id}_{i}",
                        "values": embedding,
                        "metadata": {
                            "text": chunk,
                            "source": filename,
                            "doc_id": doc_id
                        }
                    })
            
            if vectors:
                upsert_vectors(vectors)
            
            # Save chunks to JSON for BM25
            import json
            chunks_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{doc_id}.json")
            with open(chunks_path, 'w') as f:
                json.dump(chunks, f)
                
            return jsonify({"message": "File processed successfully", "chunks": len(chunks), "doc_id": doc_id}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

from services.translation import translate_to_english, translate_to_target

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    original_query = data.get('query')
    doc_id = data.get('doc_id')
    
    if not original_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # 1. Translate to English
        english_query, source_language = translate_to_english(original_query)
        print(f"DEBUG: Original: '{original_query}' ({source_language}) -> English: '{english_query}'")

        # 2. Retrieve Context (using English query)
        context_chunks = hybrid_search(english_query, [], top_k=5, doc_id=doc_id)
        
        # 3. Generate Answer (in English)
        english_answer = generate_answer(english_query, context_chunks)
        
        # 4. Translate Answer back to Source Language
        final_answer = translate_to_target(english_answer, source_language)
        
        return jsonify({
            "answer": final_answer, 
            "context": context_chunks,
            "detected_language": source_language
        }), 200
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500

from services.vision import analyze_image

@app.route('/analyze-image', methods=['POST'])
def analyze_image_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    query = request.form.get('query', 'Describe this image')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Analyze Image
            print(f"DEBUG: Analyzing image {filename} with query: {query}")
            analysis = analyze_image(file_path, query)
            print(f"DEBUG: Analysis result: {analysis}")
            
            return jsonify({
                "answer": analysis
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
