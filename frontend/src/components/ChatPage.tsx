import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useUserData } from '../context/UserDataContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const MAX_THREADS = 3;  // Maximum number of conversation threads to maintain

const ChatPage = () => {
  const { userData } = useUserData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Get last 3 messages for context
    const recentMessages = messages.slice(-MAX_THREADS * 2).map(msg => ({
      text: msg.text,
      sender: msg.sender
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          conversation_history: recentMessages,  // Send recent context
          max_length: 150,  // Request shorter responses
          birth_details: userData ? {
            year: userData.year,
            month: userData.month,
            day: userData.day,
            hour: userData.hour,
            minute: userData.minute,
            city: userData.city,
            country: userData.country,
            gender: userData.gender
          } : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const formatMessageText = (text: string) => {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        return sentences.reduce((formatted, sentence, index) => {
          if (index % 2 === 0) {
            formatted += sentence.trim();
          } else {
            formatted += ' ' + sentence.trim() + '\n\n';
          }
          return formatted;
        }, '');
      };

      const botMessage: Message = {
        id: Date.now().toString(),
        text: formatMessageText(data.response),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => {
        // Keep only the last 3 threads (6 messages - 3 user + 3 bot)
        const updatedMessages = [...prev, botMessage];
        if (updatedMessages.length > MAX_THREADS * 2) {
          return updatedMessages.slice(-MAX_THREADS * 2);
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
          {userData ? 'Your Personal Spiritual Guide' : 'Spiritual Guidance Chat'}
        </h1>
        <p className="text-xl text-gray-300 font-poppins">
          {userData 
            ? 'Get personalized spiritual guidance based on your birth chart and energy.'
            : 'Fill out your birth details to receive more personalized spiritual guidance.'}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                {userData 
                  ? "Ask anything about your spiritual journey, and I'll provide guidance based on your birth chart."
                  : "Ask any spiritual question, and I'll do my best to guide you."}
              </div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
              >
                <div
                  className={`max-w-[90%] rounded-3xl px-8 py-6 shadow-xl ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-br from-gray-800/70 to-gray-900/70 text-gray-100 backdrop-blur-sm'
                  }`}
                  style={{ lineHeight: '1.8' }}
                >
                  {message.sender === 'user' ? (
                    <p className="text-lg font-light">{message.text}</p>
                  ) : (
                    <ReactMarkdown 
                      className="prose prose-invert prose-lg max-w-none"
                      components={{
                        p: ({node, ...props}) => <p className="text-lg font-light tracking-wide mb-4 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-3 font-light" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-3 font-light" {...props} />,
                        li: ({node, ...props}) => <li className="mb-2 leading-relaxed" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-2xl font-medium mb-4 text-purple-200" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-medium mb-3 text-purple-200" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2 text-purple-200" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-medium text-purple-200" {...props} />,
                        em: ({node, ...props}) => <em className="italic text-purple-100" {...props} />,
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-2 border-purple-400/50 pl-4 my-4 italic text-gray-300/90" {...props} />
                        ),
                        code: ({node, inline, ...props}) => (
                          inline 
                            ? <code className="bg-purple-900/20 rounded px-1.5 py-0.5 font-mono text-sm" {...props} />
                            : <code className="block bg-purple-900/20 rounded-lg p-4 font-mono text-sm my-4 overflow-x-auto" {...props} />
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-2 text-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-3 px-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={userData ? "Ask about your spiritual journey..." : "Ask for spiritual guidance..."}
              className="flex-1 input bg-black/50 h-12 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary px-6 h-12"
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 