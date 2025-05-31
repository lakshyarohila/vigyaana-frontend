import React from 'react';
import { BookOpen, Zap, Users, Target, Brain, Rocket, Award, Globe } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header Section */}
      <header className="bg-[#1c4645] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Vigyaana</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Empowering minds through AI education and intelligent workflow solutions
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1c4645] mb-6">
                Revolutionizing Work Through AI
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At Vigyaana, we believe artificial intelligence should make work simpler, faster, and more meaningful. 
                We're an innovative education platform dedicated to teaching individuals and organizations how to 
                harness the power of AI to transform their workflows and boost productivity.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to bridge the gap between complex AI technology and practical, everyday applications 
                that can revolutionize how you work, think, and create.
              </p>
            </div>
            <div className="bg-[#1c4645] rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
              <Brain className="w-16 h-16 mb-6 text-white opacity-90" />
              <h3 className="text-2xl font-semibold mb-4">Smart Learning</h3>
              <p className="text-lg opacity-90">
                Interactive courses designed to make AI accessible and practical for everyone, 
                from beginners to advanced professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1c4645] mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI education and practical tools to streamline your work processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gray-50 rounded-xl p-8 hover:bg-[#1c4645] hover:text-white transition-all duration-300 transform hover:-translate-y-2">
              <BookOpen className="w-12 h-12 text-[#1c4645] group-hover:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-4">AI Fundamentals</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Master the basics of artificial intelligence and machine learning concepts
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-8 hover:bg-[#1c4645] hover:text-white transition-all duration-300 transform hover:-translate-y-2">
              <Zap className="w-12 h-12 text-[#1c4645] group-hover:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-4">Workflow Automation</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Learn to automate repetitive tasks and optimize your daily workflows
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-8 hover:bg-[#1c4645] hover:text-white transition-all duration-300 transform hover:-translate-y-2">
              <Users className="w-12 h-12 text-[#1c4645] group-hover:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-4">Team Training</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Corporate training programs to upskill entire teams in AI applications
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-8 hover:bg-[#1c4645] hover:text-white transition-all duration-300 transform hover:-translate-y-2">
              <Target className="w-12 h-12 text-[#1c4645] group-hover:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-4">Practical Projects</h3>
              <p className="text-gray-600 group-hover:text-gray-200">
                Hands-on projects that apply AI solutions to real-world challenges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-[#1c4645] to-[#2a5a58]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 text-white">
            <div className="text-center">
              <Rocket className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-lg opacity-90">
                To create a world where AI empowers every individual to achieve more with less effort, 
                making complex tasks simple and accessible.
              </p>
            </div>
            
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-lg opacity-90">
                Democratizing AI education by providing practical, hands-on learning experiences 
                that translate directly into workplace productivity gains.
              </p>
            </div>
            
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-2xl font-semibold mb-4">Our Impact</h3>
              <p className="text-lg opacity-90">
                Building a global community of AI-literate professionals who can leverage 
                intelligent automation to focus on creative and strategic work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-[#1c4645] mb-2">10K+</div>
              <div className="text-gray-600 text-lg">Students Trained</div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-[#1c4645] mb-2">500+</div>
              <div className="text-gray-600 text-lg">Companies Served</div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-[#1c4645] mb-2">95%</div>
              <div className="text-gray-600 text-lg">Success Rate</div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl font-bold text-[#1c4645] mb-2">24/7</div>
              <div className="text-gray-600 text-lg">Learning Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1c4645]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Work?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have already revolutionized their workflows with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#1c4645] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
              Start Learning Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1c4645] transition-all duration-300 transform hover:scale-105">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    
    </div>
  );
};

export default AboutUs;