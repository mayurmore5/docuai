import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';


const Chat = ({ docId }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am DocuAI. Upload a document and ask me anything about it.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userMessage.content,
                    doc_id: docId
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }]);
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

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Web Speech API is not supported in this browser. Try Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            stopListening();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            stopListening();
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
        window.recognition = recognition; // Store to stop later
    };

    const stopListening = () => {
        if (window.recognition) {
            window.recognition.stop();
            setIsListening(false);
        }
    };

    return (
        <div className="chat-container glass-panel">
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-content">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="sources">
                                    <small>Sources:</small>
                                    <ul>
                                        {msg.sources.map((src, i) => (
                                            <li key={i}>{src.substring(0, 100)}...</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="message assistant"><div className="message-content typing">Thinking...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <button onClick={toggleListening} className={`mic-btn ${isListening ? 'listening' : ''}`}>
                    {isListening ? '🛑' : '🎤'}
                </button>
                <textarea
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    rows="1"
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default Chat;
