'use client'
import React from 'react';
import { BookOpen, Zap, Users, Target, Brain, Rocket, Award, Globe, ArrowRight, CheckCircle, Star, } from 'lucide-react';
import ContactForm from '@/compoenets/ContactForm';


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-[#1c4645] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs font-medium">
                <Star className="w-3 h-3 mr-2 text-yellow-500" />
                Leading AI Education Platform
              </div>
              
              <h1 className="text-4xl font-bold leading-tight">
                Welcome to
                <span className="block text-[#1c4645]">
                  Vigyaana
                </span>
              </h1>
              
              <p className="text-base text-gray-600 leading-relaxed max-w-lg">
                Empowering minds through AI education and intelligent workflow solutions. 
                Transform your career with cutting-edge artificial intelligence skills.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <Brain className="w-16 h-16 mb-4 text-[#1c4645]" />
                <h3 className="text-xl font-bold mb-3">AI-Powered Learning</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Interactive courses designed to make AI accessible and practical for everyone, 
                  from beginners to advanced professionals.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    Hands-on Projects
                  </div>
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    Expert Mentorship
                  </div>
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    Industry Certification
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-4">
              Revolutionizing Work Through AI
            </h2>
            <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Vigyaana, we believe artificial intelligence should make work simpler, faster, and more meaningful. 
              We're an innovative education platform dedicated to teaching individuals and organizations how to 
              harness the power of AI to transform their workflows and boost productivity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-[#1c4645] rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Rocket className="w-12 h-12 mx-auto text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1c4645] mb-3">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To create a world where AI empowers every individual to achieve more with less effort, 
                making complex tasks simple and accessible.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-[#1c4645] rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Award className="w-12 h-12 mx-auto text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1c4645] mb-3">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Democratizing AI education by providing practical, hands-on learning experiences 
                that translate directly into workplace productivity gains.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-[#1c4645] rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-12 h-12 mx-auto text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1c4645] mb-3">Our Impact</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Building a global community of AI-literate professionals who can leverage 
                intelligent automation to focus on creative and strategic work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-4">What We Offer</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI education and practical tools to streamline your work processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#1c4645] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#1c4645] rounded-lg p-3 w-fit mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1c4645] mb-3">AI Fundamentals</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Master the basics of artificial intelligence and machine learning concepts through interactive lessons
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#1c4645] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#1c4645] rounded-lg p-3 w-fit mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1c4645] mb-3">Workflow Automation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Learn to automate repetitive tasks and optimize your daily workflows with AI-powered tools
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#1c4645] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#1c4645] rounded-lg p-3 w-fit mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1c4645] mb-3">Team Training</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Corporate training programs to upskill entire teams in AI applications and best practices
              </p>
            </div>
            
            <div className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#1c4645] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-[#1c4645] rounded-lg p-3 w-fit mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1c4645] mb-3">Practical Projects</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hands-on projects that apply AI solutions to real-world challenges and industry scenarios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-3">Our Impact in Numbers</h2>
            <p className="text-base text-gray-600">
              Trusted by thousands of learners and organizations worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-[#1c4645] mb-1">10K+</div>
              <div className="text-gray-600 text-sm font-medium">Students Trained</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-[#1c4645] mb-1">500+</div>
              <div className="text-gray-600 text-sm font-medium">Companies Served</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-[#1c4645] mb-1">95%</div>
              <div className="text-gray-600 text-sm font-medium">Success Rate</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-[#1c4645] mb-1">24/7</div>
              <div className="text-gray-600 text-sm font-medium">Learning Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1c4645] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Work?</h2>
          <p className="text-base mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have already revolutionized their workflows with AI. 
            Start your journey today and unlock your potential.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1c4645] mb-4">Get in Touch</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Have questions about our courses or want to discuss custom training for your organization? 
              We'd love to hear from you.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
           <ContactForm/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;