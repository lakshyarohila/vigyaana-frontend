import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. I can help you with Vigyaana courses, general learning questions, and much more. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Your Gemini API key
  const GEMINI_API_KEY = 'AIzaSyATbRun2qXFfYcbcHIq2bzXhJgH6bbyq-0';

  // Internal knowledge base for Vigyaana
  const internalKnowledge = [
    {
      "question": "What is Vigyaana?",
      "answer": "Vigyaana is an online education platform that offers high-quality, practical courses in technology, data science, AI, and programming. We focus on making complex topics accessible to learners at all levels."
    },
    {
      "question": "What courses do you offer?",
      "answer": "We offer a variety of courses including Python BootCamp, Operating System, Data Science, Prompt Engineering, 100x Speed With AI, and Learn to Use AI Tools."
    },
    {
      "question": "Tell me about the Python BootCamp course.",
      "answer": "The Python BootCamp teaches you how to use Python to build websites and tools that help others. It's designed for beginners to intermediate learners and includes hands-on projects."
    },
    {
      "question": "How much does the Python BootCamp course cost?",
      "answer": "The Python BootCamp course costs ₹2000."
    },
    {
      "question": "What is the Operating System course about?",
      "answer": "The Operating System course teaches the basics of computers and operating systems — how they work, and how computers manage resources. Perfect for understanding computer fundamentals."
    },
    {
      "question": "How much is the Operating System course?",
      "answer": "The Operating System course costs ₹299."
    },
    {
      "question": "What is the Data Science course?",
      "answer": "The Data Science course helps you analyze, visualize, and interpret complex data using Python, R, and SQL. You'll also learn machine learning, predictive analytics, and real-world case studies."
    },
    {
      "question": "What is the price of the Data Science course?",
      "answer": "The Data Science course is available for ₹4999."
    },
    {
      "question": "What is covered in the Prompt Engineering course?",
      "answer": "Prompt Engineering teaches you how to craft effective prompts to optimize AI responses. It covers NLP fundamentals, prompt tuning, and real-world use cases for better AI interaction."
    },
    {
      "question": "What is the cost of the Prompt Engineering course?",
      "answer": "The Prompt Engineering course costs ₹599."
    },
    {
      "question": "What is the 100x Speed With AI course about?",
      "answer": "This course teaches you how to use AI tools to automate tasks, boost productivity, and work smarter. Learn how to use AI in content creation, coding, and decision-making to dramatically increase your efficiency."
    },
    {
      "question": "How much is the 100x Speed With AI course?",
      "answer": "The 100x Speed With AI course is priced at ₹100."
    },
    {
      "question": "What will I learn in the Learn To Use AI Tools course?",
      "answer": "You'll learn how to use various AI tools like chatbots, image generators, and text processors for automation and productivity. It also covers AI ethics and prompt engineering basics."
    },
    {
      "question": "How much does the Learn To Use AI Tools course cost?",
      "answer": "This course is priced at ₹899."
    },
    {
      "question": "Are the courses suitable for beginners?",
      "answer": "Yes, most courses are designed for beginners with no prior experience. You'll learn step-by-step with practical exercises and clear explanations."
    },
    {
      "question": "Do your courses include certification?",
      "answer": "Yes, you will receive a certificate of completion for each course you finish. These certificates can be shared on LinkedIn and added to your resume."
    },
    {
      "question": "Do you offer refunds?",
      "answer": "Currently, we do not offer refunds. Please read course descriptions carefully before purchasing and feel free to contact us if you have questions."
    },
    {
      "question": "How can I enroll in a course?",
      "answer": "You can enroll in any course directly through our website by selecting the course and completing the payment process. The enrollment is instant after successful payment."
    },
    {
      "question": "Are there any discounts available?",
      "answer": "We occasionally run discounts on selected courses. Follow us on social media or check the website for updates on special offers and seasonal discounts."
    },
    {
      "question": "Do you provide support if I get stuck in a course?",
      "answer": "Yes, each course comes with access to community support and occasional live doubt-clearing sessions. You can also reach out to our support team for technical issues."
    },
    {
      "question": "What payment methods do you accept?",
      "answer": "We accept multiple payment options including credit cards, debit cards, net banking, UPI, and popular e-wallets like Paytm, PhonePe, and Google Pay for your convenience."
    },
    {
      "question": "How long do I have access to a course after purchasing?",
      "answer": "Once you purchase a course, you get lifetime access to all course materials, including any future updates or additional content added to the course."
    },
    {
      "question": "Can I access courses on mobile devices?",
      "answer": "Yes, all our courses are mobile-friendly and can be accessed on smartphones, tablets, laptops, and desktop computers. Learn anytime, anywhere."
    },
    {
      "question": "Do you offer live classes or are all courses pre-recorded?",
      "answer": "Our courses are primarily self-paced with pre-recorded content, but we also conduct live doubt-clearing sessions and occasionally offer live workshops for enrolled students."
    },
    {
      "question": "What prerequisites do I need for your courses?",
      "answer": "Most courses are beginner-friendly with no specific prerequisites. However, some advanced courses may require basic computer knowledge. Check individual course descriptions for specific requirements."
    },
    {
      "question": "How long does it take to complete a course?",
      "answer": "Course duration varies depending on the complexity and your learning pace. Generally, courses range from 4-12 weeks if you dedicate 2-3 hours per week. You can learn at your own speed."
    },
    {
      "question": "Do you provide job placement assistance?",
      "answer": "While we don't guarantee job placement, our courses are designed with industry-relevant skills and practical projects that enhance your employability. We also provide career guidance and portfolio building tips."
    },
    {
      "question": "Can I get a demo or preview of the course content?",
      "answer": "Yes, most courses have free preview lessons available. You can watch these sample videos on our website to get a feel for the teaching style and content quality before purchasing."
    },
    {
      "question": "Are the course materials downloadable?",
      "answer": "Selected course materials like PDFs, code files, and resources are downloadable. However, video content is streamed online to ensure the latest version and prevent unauthorized distribution."
    },
    {
      "question": "Do you offer group discounts or corporate training?",
      "answer": "Yes, we offer special pricing for bulk purchases and corporate training programs. Contact our support team for customized packages for teams and organizations."
    },
    {
      "question": "What if I'm not satisfied with a course?",
      "answer": "While we don't offer refunds, we're committed to your learning success. If you're facing issues, please contact our support team and we'll do our best to help you get the most out of your course."
    },
    {
      "question": "How do I track my progress in a course?",
      "answer": "Our platform includes a progress tracking system that shows your completion percentage, completed lessons, and upcoming topics. You can easily see how much you've accomplished and what's next."
    },
    {
      "question": "Can I pause and resume my learning?",
      "answer": "Absolutely! Since you have lifetime access, you can pause your learning anytime and resume from where you left off. The platform remembers your progress automatically."
    },
    {
      "question": "Do you update course content regularly?",
      "answer": "Yes, we regularly update our courses to keep up with industry changes and technological advancements. All updates are included free for enrolled students."
    },
    {
      "question": "Is there a community or forum for students?",
      "answer": "Yes, we have an active student community where you can connect with fellow learners, share projects, ask questions, and participate in discussions related to your courses."
    },
    {
      "question": "What makes Vigyaana different from other online learning platforms?",
      "answer": "Vigyaana focuses on practical, hands-on learning with real-world projects. Our courses are designed by industry experts, offer lifetime access, and provide ongoing community support at affordable prices."
    },
    {
      "question": "Do you offer any free courses or content?",
      "answer": "While our main courses are premium, we occasionally offer free workshops, webinars, and sample lessons. Follow our social media channels for announcements about free learning opportunities."
    },
    {
      "question": "How can I contact customer support?",
      "answer": "You can reach our customer support team through the contact form on our website, email, or our social media channels. We typically respond within 24 hours during business days."
    },
    {
      "question": "Can I switch between different courses?",
      "answer": "Yes, if you've enrolled in multiple courses, you can easily switch between them using your dashboard. Each course maintains its own progress tracking independently."
    },
    {
      "question": "Are there any age restrictions for enrolling in courses?",
      "answer": "There are no specific age restrictions, but our courses are designed for learners aged 16 and above. Younger students should have parental guidance, especially for payment and account management."
    },
    {
      "question": "Do you provide internship opportunities?",
      "answer": "While we don't directly offer internships, we help connect our top-performing students with potential opportunities in our network and provide guidance on finding relevant internships in your field."
    },
    {
      "question": "Can I share my course access with others?",
      "answer": "Course access is individual and non-transferable. Sharing login credentials violates our terms of service. Each person should have their own enrollment for the best learning experience."
    },
    {
      "question": "What technical requirements do I need to access the courses?",
      "answer": "You need a stable internet connection and a modern web browser. For programming courses, you may need to install specific software, but we provide detailed setup instructions for everything required."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to calculate similarity between two strings
  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / Math.max(words1.length, words2.length);
  };

  // Function to search internal knowledge base
  const searchInternalKnowledge = (query) => {
    const bestMatch = internalKnowledge.reduce((best, item) => {
      const questionSimilarity = calculateSimilarity(query, item.question);
      const answerSimilarity = calculateSimilarity(query, item.answer) * 0.5; // Weight answer similarity less
      const totalSimilarity = questionSimilarity + answerSimilarity;
      
      return totalSimilarity > best.similarity ? 
        { ...item, similarity: totalSimilarity } : best;
    }, { similarity: 0 });

    // Return answer if similarity is above threshold
    return bestMatch.similarity > 0.3 ? bestMatch.answer : null;
  };

  // Function to check if query is about Vigyaana/internal topics
  const isInternalQuery = (query) => {
    const internalKeywords = [
      'vigyaana', 'course', 'courses', 'python', 'bootcamp', 'data science', 
      'operating system', 'prompt engineering', 'ai tools', 'price', 'cost', 
      'enroll', 'enrollment', 'certificate', 'refund', 'payment', 'access',
      'mobile', 'support', 'preview', 'demo', 'discount', 'beginner',
      'prerequisite', 'duration', 'job placement', 'community', 'update',
      'internship', 'technical requirements', 'progress', 'download'
    ];
    
    const queryLower = query.toLowerCase();
    return internalKeywords.some(keyword => queryLower.includes(keyword));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // First, try to find answer in internal knowledge base
      const internalAnswer = searchInternalKnowledge(currentInput);
      
      if (internalAnswer && isInternalQuery(currentInput)) {
        // Use internal knowledge
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: internalAnswer
          }]);
          setIsLoading(false);
        }, 500);
        return;
      }

      // If not found in internal knowledge or not an internal query, use Gemini API
      const conversationHistory = currentMessages
        .slice(-6) // Keep last 6 messages for context
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
            ...conversationHistory.slice(0, -1),
            {
              role: 'user',
              parts: [{ text: currentInput }]
            }
          ],
          systemInstruction: {
            parts: [{ 
              text: `You are a helpful AI assistant for Vigyaana, an online learning platform. 

IMPORTANT: If someone asks about Vigyaana courses, pricing, enrollment, or platform-specific questions, politely let them know that you can help with those topics and encourage them to ask specific questions about Vigyaana courses.

For general questions, provide helpful, concise, and encouraging responses. Focus on:
- Educational guidance and learning tips
- Technology and programming concepts
- Career advice in tech fields
- Study strategies and productivity tips

Keep responses friendly, practical, and under 150 words unless more detail is specifically requested.`
            }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
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
        throw new Error(`API Error: ${response.status}`);
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
      
      // Fallback response
      const fallbackResponses = [
        "I apologize, but I'm having trouble connecting right now. For questions about Vigyaana courses, pricing, or enrollment, I'd be happy to help with those topics specifically!",
        "I'm experiencing some technical difficulties at the moment. Please try asking about our courses, pricing, or any learning-related questions, and I'll do my best to assist you!",
        "Sorry for the inconvenience! While I'm having connectivity issues, I can still help with questions about Vigyaana's courses, features, and learning resources.",
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: randomFallback
        }]);
        setIsLoading(false);
      }, 1000);
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
                placeholder="Ask about courses, pricing, or anything else..."
                className="flex-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e17100] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-[#e17100] hover:bg-[#e17100] disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200"
              >
                <Send className="h-5 w-5 text-black"  />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;