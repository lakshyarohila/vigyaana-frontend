import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. How can I help you with your courses today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Add your Gemini API key here
  const GEMINI_API_KEY = 'AIzaSyATbRun2qXFfYcbcHIq2bzXhJgH6bbyq-0'; // Replace with your actual API key

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response for demo purposes (fallback)
    const simulateResponse = () => {
      setTimeout(() => {
        const responses = [
          "That's a great question! For online learning, I recommend starting with small, manageable goals and creating a consistent study schedule.",
          "Vigyaana offers a variety of courses across different subjects. What specific area are you interested in learning about?",
          "To get the most out of your courses, try to engage actively with the material - take notes, pause to reflect, and practice what you learn.",
          "Learning at your own pace is one of the biggest advantages of online education. Don't rush - focus on understanding each concept thoroughly.",
          "Have you considered joining study groups or discussion forums? Connecting with other learners can greatly enhance your understanding.",
          "Great question! I'd be happy to help you find the right course. What are your current skill level and learning goals?",
          "Remember, consistency is key in learning. Even 15-20 minutes of daily study can lead to significant progress over time."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: randomResponse
        }]);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000);
    };

    try {
      // Check if API key exists
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        console.warn('No Gemini API key found, using simulated responses');
        simulateResponse();
        return;
      }

      // Build conversation history for Gemini
      const conversationHistory = currentMessages
        .slice(0, -1) // Exclude the current user message
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: inputMessage }]
            }
          ],
          systemInstruction: {
            parts: [{ 
              text: 'You are a helpful AI assistant for Vigyaana, an online learning platform. Help users with course-related questions, learning tips, and general educational guidance. Keep responses concise, friendly, and encouraging. Focus on providing practical advice for online learning success.'
            }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error:', response.status, errorData);
        
        if (response.status === 429) {
          console.warn('Rate limit hit, falling back to simulated responses');
          simulateResponse();
          return;
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key or permission denied. Using simulated responses instead.');
        } else {
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Invalid response format from Gemini API');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chatbot Error:', error);
      
      // Fallback to simulated response on any error
      console.warn('API failed, using simulated response');
      simulateResponse();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#e17100] hover:bg-[#c5610a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-[#1c4645] text-white p-4 rounded-t-lg flex items-center space-x-3">
            <div className="p-2 bg-[#e17100] rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Vigyaana AI Assistant</h3>
              <p className="text-sm text-gray-200">Online • Ready to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-[#e17100]' : 'bg-gray-200'}`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-[#e17100] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="p-2 rounded-full bg-gray-200">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about learning..."
                className="flex-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e17100] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-[#e17100] hover:bg-[#c5610a] disabled:bg-gray-300 cursor-pointer text-white p-3 rounded-lg transition-colors duration-200"
              >
                <Send className="h-5 w-5 text-[#e17100]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;