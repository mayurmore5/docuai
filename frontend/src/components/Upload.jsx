import React, { useState } from 'react';


const Upload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message} (ID: ${data.doc_id})`);
        if (onUploadComplete) onUploadComplete(data.doc_id);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container glass-panel">
      <h2>Upload Document</h2>
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.txt" id="file-upload" className="file-input" />
        <label htmlFor="file-upload" className="file-label">
          {file ? file.name : "Choose a file..."}
        </label>
      </div>
      <button onClick={handleUpload} disabled={uploading || !file} className="primary-btn">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default Upload;
