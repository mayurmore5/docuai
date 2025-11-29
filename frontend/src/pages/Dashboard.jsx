import React, { useState } from 'react';
import Upload from '../components/Upload';
import Chat from '../components/Chat';
import ImageChat from '../components/ImageChat';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, UploadCloud, Cpu, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';

const Dashboard = () => {
    const [docId, setDocId] = useState(null);
    const [activeTab, setActiveTab] = useState('document'); // 'document' or 'image'
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleUploadComplete = (id) => {
        setDocId(id);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-bg-gradient" />

            <header className="dashboard-header">
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'document' ? 'active' : ''}`}
                        onClick={() => setActiveTab('document')}
                    >
                        <FileText size={18} />
                        <span>Document Chat</span>
                        {activeTab === 'document' && <motion.div layoutId="tab-indicator" className="tab-indicator" />}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
                        onClick={() => setActiveTab('image')}
                    >
                        <Image size={18} />
                        <span>Image Analysis</span>
                        {activeTab === 'image' && <motion.div layoutId="tab-indicator" className="tab-indicator" />}
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'document' ? (
                        <motion.div
                            key="document"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="split-view"
                        >
                            <motion.div
                                className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
                                animate={{ width: isSidebarOpen ? 320 : 60 }}
                            >
                                <button
                                    className="sidebar-toggle"
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                >
                                    {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                </button>

                                <div className="sidebar-content">
                                    {isSidebarOpen ? (
                                        <>
                                            <div className="upload-section">
                                                <h2>Upload Document</h2>
                                                <Upload onUploadComplete={handleUploadComplete} />
                                            </div>

                                            <div className="info-section glass-panel">
                                                <h3>How it works</h3>
                                                <div className="step-list">
                                                    <div className="step-item">
                                                        <div className="step-icon"><UploadCloud size={20} /></div>
                                                        <div className="step-text">
                                                            <strong>Upload</strong>
                                                            <p>PDF, DOCX, PPTX, TXT</p>
                                                        </div>
                                                    </div>
                                                    <div className="step-item">
                                                        <div className="step-icon"><Cpu size={20} /></div>
                                                        <div className="step-text">
                                                            <strong>Process</strong>
                                                            <p>AI extracts & indexes</p>
                                                        </div>
                                                    </div>
                                                    <div className="step-item">
                                                        <div className="step-icon"><MessageSquare size={20} /></div>
                                                        <div className="step-text">
                                                            <strong>Chat</strong>
                                                            <p>Ask anything!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="sidebar-collapsed-icons">
                                            <div className="icon-wrapper" title="Upload"><UploadCloud /></div>
                                            <div className="icon-wrapper" title="Process"><Cpu /></div>
                                            <div className="icon-wrapper" title="Chat"><MessageSquare /></div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <div className="main-panel">
                                <Chat docId={docId} />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="full-view"
                        >
                            <ImageChat />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
