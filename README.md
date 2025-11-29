# DocuAI - Intelligent Document Assistant

DocuAI is a powerful Retrieval-Augmented Generation (RAG) application that allows users to chat with their documents (PDF, DOCX, PPTX, TXT) and analyze images using state-of-the-art AI models.

## 🚀 Features

-   **Document Chat (RAG)**: Upload documents and ask questions. The AI retrieves relevant context to provide accurate answers.
-   **Multimodal Analysis**: Upload images and ask questions about them using Google's Gemini Vision models.
-   **Voice Interaction**: Use your voice to ask questions (Speech-to-Text) for a hands-free experience.
-   **Context Isolation**: Chat is scoped to the currently active document, preventing confusion between different files.
-   **Local Embeddings**: Uses `sentence-transformers` locally for free, privacy-focused, and unlimited embedding generation.
-   **Premium UI**: Modern, glassmorphism-inspired interface built with React.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React 18 (Vite)
-   **Styling**: Custom CSS (Glassmorphism, Dark Mode)
-   **Libraries**: `react-markdown` (Rendering), Web Speech API (Voice)

### Backend
-   **Framework**: Flask (Python)
-   **Vector Database**: Pinecone (Serverless)
-   **NLP**: spaCy (Chunking)

### AI Models
-   **LLM (Chat)**: Groq API (`llama-3.3-70b-versatile`) - Ultra-fast inference.
-   **Vision (Images)**: Google Gemini API (`gemini-flash-latest`).
-   **Embeddings**: Local `all-MiniLM-L6-v2` (via `sentence-transformers`).

## 🏗️ Architecture

1.  **Ingestion**: Files are uploaded and text is extracted using specific libraries (`pypdf`, `python-docx`, etc.).
2.  **Chunking**: Text is split into semantic chunks using spaCy.
3.  **Embedding**: Chunks are converted into 384-dimensional vectors using the local model.
4.  **Storage**: Vectors + Metadata (Text, Doc ID) are stored in Pinecone.
5.  **Retrieval**: User queries are embedded and matched against Pinecone (filtered by Doc ID).
6.  **Generation**: Retrieved context is sent to Groq (Llama 3.3) to generate the final answer.

## 📝 Setup Instructions

### Prerequisites
-   Node.js & npm
-   Python 3.8+
-   API Keys:
    -   **Pinecone**: For vector storage.
    -   **Groq**: For text generation.
    -   **Google Gemini**: For image analysis.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rag-app
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENV=us-east-1
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate
python app.py
```
*Backend runs on `http://localhost:5001`*

### Start Frontend
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

## 🔍 Usage

1.  **Document Chat**: 
    - Upload a file (PDF, DOCX, PPTX, TXT) using the upload panel.
    - Wait for the success message.
    - Type your question in the chat box or use the microphone button to speak.
    - The AI will answer based *only* on the uploaded document.

2.  **Image Analysis**: 
    - Click the "Image Analysis" tab at the top.
    - Upload an image (JPG, PNG).
    - Ask a question about the image (e.g., "Describe this image").
