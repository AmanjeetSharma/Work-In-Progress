import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { FiSend, FiLoader, FiX, FiCode, FiMessageSquare } from 'react-icons/fi';

export default function AIModal({ onClose }) {
    const { askAI } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const handleAsk = async (e) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const answer = await askAI(input);
            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Error: Could not connect to the AI service. Please try again later.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formatMessage = (content) => {
        // Format code blocks with syntax highlighting
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
        const formatted = content
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br />');

        return formatted.replace(codeBlockRegex, (match, language, code) => {
            return `<pre class="language-${language || 'text'}"><code>${code}</code></pre>`;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-2xl flex flex-col w-full max-w-2xl h-[80vh] max-h-[700px] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-800/50">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 8, 
                                ease: "linear",
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }
                            }}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </motion.div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Assistant</h2>
                    </div>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <FiX className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-20 h-20 bg-blue-100/50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
                            >
                                <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </motion.div>
                            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">How can I help you today?</h3>
                            <p className="max-w-md text-gray-500 dark:text-gray-400 mb-6">Ask me anything about our products, features, or get recommendations.</p>
                            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                                <motion.button
                                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-left"
                                >
                                    <div className="flex items-center space-x-2">
                                        <FiCode className="text-blue-500" />
                                        <span>Explain this code...</span>
                                    </div>
                                </motion.button>
                                <motion.button
                                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-left"
                                >
                                    <div className="flex items-center space-x-2">
                                        <FiMessageSquare className="text-indigo-500" />
                                        <span>Write a message...</span>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <motion.div
                                whileHover={{ scale: message.role === 'user' ? 1.02 : 1.01 }}
                                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none shadow-blue-500/20'
                                    : 'bg-white/80 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-gray-500/10 dark:shadow-gray-900/50 border border-gray-100/50 dark:border-gray-700/30'}`}
                            >
                                {message.role === 'assistant' ? (
                                    <div
                                        className="prose dark:prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                    />
                                ) : (
                                    <p>{message.content}</p>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/80 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none p-4 max-w-[85%] shadow-sm border border-gray-100/50 dark:border-gray-700/30">
                                <div className="flex space-x-2 items-center">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
                    <form onSubmit={handleAsk} className="relative">
                        <motion.div
                            animate={{
                                boxShadow: input.trim() ? "0 0 0 2px rgba(99, 102, 241, 0.5)" : "none"
                            }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl overflow-hidden"
                        >
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows="1"
                                placeholder="Message AI Assistant..."
                                className="w-full p-4 pr-16 bg-white/80 dark:bg-gray-800/90 focus:outline-none resize-none transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAsk(e);
                                    }
                                }}
                                style={{ minHeight: '60px', maxHeight: '150px' }}
                            />
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`absolute right-3 bottom-3 p-2 rounded-full ${loading || !input.trim()
                                ? 'bg-gray-300/80 dark:bg-gray-600/80 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'} text-white transition-all`}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <FiLoader className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <FiSend className="w-5 h-5" />
                            )}
                        </motion.button>
                    </form>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center"
                    >
                        AI Assistant may produce inaccurate information. Consider verifying important details.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}