import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Image, Mic, ArrowRight } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: FileText,
            title: "Document Chat",
            description: "Upload PDF, DOCX, or TXT files and chat with them instantly using advanced RAG technology."
        },
        {
            icon: Image,
            title: "Multimodal Analysis",
            description: "Upload images and get detailed insights powered by Google Gemini Vision."
        },
        {
            icon: Search,
            title: "Hybrid Search",
            description: "Combines vector similarity with keyword matching for precise information retrieval."
        },
        {
            icon: Mic,
            title: "Voice Interaction",
            description: "Speak to your documents and listen to the answers for a hands-free experience."
        }
    ];

    return (
        <div className="home-page">
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <h1>Chat with your <span className="gradient-text">Documents</span> & <span className="gradient-text">Images</span></h1>
                    <p>Unlock the power of your data with DocuAI. The intelligent assistant for all your files.</p>
                    <Link to="/dashboard" className="cta-button">
                        Get Started <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>

            <section className="features">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="feature-card"
                    >
                        <feature.icon size={40} className="feature-icon" />
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

export default Home;
