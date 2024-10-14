'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { API_KEY } from '../../../config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatbotPage: React.FC = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `/api/chatbot/${id}`,
        { message: input },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
          },
        }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const getChatTitle = (chatId: string | string[]) => {
    switch (chatId) {
      case '1':
        return 'WZ 320';
      case '2':
        return 'WZ 321';
      default:
        return `Assistant ${chatId}`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Chat with {getChatTitle(id)}</h1>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg shadow-md max-w-xs md:max-w-md lg:max-w-lg ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'
              }`}
            >
              <ReactMarkdown className="prose text-inherit">{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="w-full bg-white p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;
