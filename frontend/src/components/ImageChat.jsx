import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';


const ImageChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am DocuAI Vision. Upload an image and I can analyze it for you.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMessages(prev => [...prev, { role: 'user', content: `[Uploaded Image: ${file.name}]` }]);
        }
    };

    const handleSend = async () => {
        if (!selectedImage) {
            alert("Please upload an image first.");
            return;
        }

        const query = input.trim() || "Describe this image";
        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('query', query);

        try {
            const response = await fetch('http://localhost:5001/analyze-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container glass-panel">
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.role}`}>
                        <div className={`message-bubble ${msg.role}`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div className="message-wrapper assistant"><div className="message-bubble assistant typing">Analyzing Image...</div></div>}
                <div ref={messagesEndRef} />
            </div>

            <div className="image-upload-area" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxHeight: '100px', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'white' }} />
            </div>

            <div className="input-area">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the image..."
                    rows="1"
                />
                <button onClick={handleSend} disabled={loading || !selectedImage} className="send-btn">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ImageChat;
