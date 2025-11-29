import React, { useState } from 'react';
import Upload from './components/Upload';
import Chat from './components/Chat';
import ImageChat from './components/ImageChat';
import './index.css';

function App() {
  const [docId, setDocId] = useState(null);
  const [activeTab, setActiveTab] = useState('document'); // 'document' or 'image'

  const handleUploadComplete = (id) => {
    setDocId(id);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DocuAI</h1>
        <p>Your Intelligent Document Assistant</p>
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'document' ? 'active' : ''}`}
            onClick={() => setActiveTab('document')}
          >
            Document Chat
          </button>
          <button
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            Image Analysis
          </button>
        </div>
      </header>
      <main className="app-main">
        {activeTab === 'document' ? (
          <>
            <div className="left-panel">
              <Upload onUploadComplete={handleUploadComplete} />
              <div className="info-panel glass-panel">
                <h3>How it works</h3>
                <ol>
                  <li>Upload a PDF, DOCX, PPTX, or TXT file.</li>
                  <li>Wait for processing (extraction & indexing).</li>
                  <li>Ask questions in the chat or use voice!</li>
                </ol>
              </div>
            </div>
            <div className="right-panel">
              <Chat docId={docId} />
            </div>
          </>
        ) : (
          <div className="right-panel" style={{ flex: 1 }}>
            <ImageChat />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
