import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Image as ImageIcon, MessageSquare, Loader2, Plus } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../lib/utils.js';

export function AiAssistant({ onInsertText, onInsertImage, className }) {
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'image'
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Chat state
    const [chatHistory, setChatHistory] = useState([]); // { role: 'user' | 'ai', content: string }
    const [isTyping, setIsTyping] = useState(false);
    const chatScrollRef = useRef(null);

    // Image state
    const [generatedImage, setGeneratedImage] = useState(null);

    const API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY;

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [chatHistory, isTyping]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading || isTyping) return;

        const userMsg = prompt.trim();
        setPrompt('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const encodedPrompt = encodeURIComponent(userMsg);
            const response = await axios.get(`https://gen.pollinations.ai/text/${encodedPrompt}`, {
                params: {
                    model: 'openai-large'
                },
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            const textResponse = response.data;

            // Simulate word-by-word streaming for nicer UX
            setIsLoading(false);
            setIsTyping(true);

            // Add an empty message placeholder first
            setChatHistory(prev => [...prev, { role: 'ai', content: '' }]);

            const words = textResponse.split(' ');
            let currentWordIndex = 0;

            const typeInterval = setInterval(() => {
                if (currentWordIndex < words.length) {
                    const word = words[currentWordIndex];

                    setChatHistory(prev => {
                        const newHistory = [...prev];
                        const lastMsg = newHistory[newHistory.length - 1];

                        // Overwrite cleanly instead of appending, to prevent React Strict mode doubling issue
                        // We rebuild the string from the words array up to the current index
                        lastMsg.content = words.slice(0, currentWordIndex + 1).join(' ');

                        return newHistory;
                    });

                    currentWordIndex++;
                } else {
                    clearInterval(typeInterval);
                    setIsTyping(false);
                }
            }, 50); // Fast typing speed

        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error processing your request.' }]);
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const encodedPrompt = encodeURIComponent(prompt.trim());

            const response = await axios.get(`https://gen.pollinations.ai/image/${encodedPrompt}`, {
                params: {
                    model: 'gptimage'
                },
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                },
                responseType: 'blob'
            });

            const blob = response.data;
            const base64data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            setGeneratedImage(base64data);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = activeTab === 'chat' ? handleChatSubmit : handleImageSubmit;

    return (
        <div className={cn("flex flex-col h-full bg-surface border-r border-custom w-full max-w-[320px] shrink-0", className)}>

            {/* Header Tabs */}
            <div className="flex items-center p-4 border-b border-custom shrink-0 space-x-2">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors",
                        activeTab === 'chat' ? "bg-accent/10 text-accent" : "text-muted hover:bg-elevated hover:text-primary"
                    )}
                >
                    <MessageSquare size={16} /> Chat
                </button>
                <button
                    onClick={() => setActiveTab('image')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors",
                        activeTab === 'image' ? "bg-accent/10 text-accent" : "text-muted hover:bg-elevated hover:text-primary"
                    )}
                >
                    <ImageIcon size={16} /> Image
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">

                {activeTab === 'chat' && (
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" ref={chatScrollRef}>
                        {chatHistory.length === 0 && (
                            <div className="text-center text-muted text-sm mt-10">
                                <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                                <p>Ask me to rewrite, summarize, or brainstorm ideas for your note.</p>
                            </div>
                        )}

                        {chatHistory.map((msg, i) => (
                            <div key={i} className={cn(
                                "max-w-[85%] rounded-[14px] p-3 text-sm",
                                msg.role === 'user'
                                    ? "bg-accent text-white self-end rounded-br-sm"
                                    : "bg-elevated border border-custom text-primary self-start rounded-bl-sm"
                            )}>
                                {msg.content}
                                {msg.role === 'ai' && msg.content && !isTyping && i === chatHistory.length - 1 && (
                                    <button
                                        onClick={() => onInsertText(msg.content)}
                                        className="mt-2 text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        <Plus size={12} /> Insert to Note
                                    </button>
                                )}
                            </div>
                        ))}

                        {isLoading && activeTab === 'chat' && (
                            <div className="bg-elevated border border-custom rounded-[14px] rounded-bl-sm p-4 self-start max-w-[85%]">
                                <Loader2 className="animate-spin text-accent" size={16} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'image' && (
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-3 text-muted">
                                <Loader2 className="animate-spin text-accent" size={32} />
                                <p className="text-sm font-medium animate-pulse">Painting pixels...</p>
                            </div>
                        ) : generatedImage ? (
                            <div className="w-full flex justify-center group flex-col items-center gap-4">
                                <img
                                    src={generatedImage}
                                    alt="Generated"
                                    className="max-w-full rounded-lg border border-custom shadow-sm"
                                />
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => onInsertImage(generatedImage)}
                                >
                                    <Plus size={16} className="mr-2" /> Insert into Note
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center text-muted text-sm">
                                <ImageIcon size={32} className="mx-auto mb-3 opacity-20" />
                                <p>Describe an image to generate (using GPT Image 1 Mini model).</p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-custom bg-surface shrink-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={activeTab === 'chat' ? "Ask AI..." : "Describe an image..."}
                        className="w-full bg-elevated border border-custom text-primary text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                        disabled={isLoading || isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isLoading || isTyping}
                        className="absolute right-1.5 w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-muted transition-colors hover:bg-accent-hover"
                    >
                        {isLoading && activeTab === 'image' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                    </button>
                </div>
            </form>

        </div>
    );
}
