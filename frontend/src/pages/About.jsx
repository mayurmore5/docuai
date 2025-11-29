import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="about-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="about-content"
            >
                <h1>About <span className="gradient-text">DocuAI</span></h1>
                <p className="lead">
                    DocuAI is an advanced Retrieval-Augmented Generation (RAG) platform designed to bridge the gap between static documents and interactive intelligence.
                </p>

                <div className="tech-stack">
                    <h2>Tech Stack</h2>
                    <div className="stack-grid">
                        <div className="stack-item">
                            <h3>Frontend</h3>
                            <p>React, Vite, Framer Motion, Lucide Icons</p>
                        </div>
                        <div className="stack-item">
                            <h3>Backend</h3>
                            <p>Flask, Python, LangChain</p>
                        </div>
                        <div className="stack-item">
                            <h3>AI Models</h3>
                            <p>Groq (Llama 3), Google Gemini (Vision), Sentence Transformers</p>
                        </div>
                        <div className="stack-item">
                            <h3>Database</h3>
                            <p>Pinecone (Vector DB)</p>
                        </div>
                    </div>
                </div>

                <div className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        To make information accessible and interactive. Whether it's a complex legal contract, a research paper, or a diagram, DocuAI helps you understand it better and faster.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
