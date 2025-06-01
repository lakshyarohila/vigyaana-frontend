import React from 'react';
import { BookOpen, Zap, Users, Target, Brain, Rocket, Award, Globe, ArrowRight, CheckCircle, Star, } from 'lucide-react';
import ContactForm from '@/compoenets/ContactForm';
import Link from 'next/link';
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f302f] via-[#1c4645] to-[#2a5a58] text-white overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Leading AI Education Platform
              </div>
              
              <h1 className="text-6xl font-bold leading-tight">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Vigyaana
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Empowering minds through AI education and intelligent workflow solutions. 
                Transform your career with cutting-edge artificial intelligence skills.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href='/'>
                <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                </Link>
                
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <Brain className="w-20 h-20 mb-6 text-yellow-400" />
                <h3 className="text-2xl font-bold mb-4">AI-Powered Learning</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Interactive courses designed to make AI accessible and practical for everyone, 
                  from beginners to advanced professionals.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    Hands-on Projects
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    Expert Mentorship
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    Industry Certification
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1c4645] mb-6">
              Revolutionizing Work Through AI
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Vigyaana, we believe artificial intelligence should make work simpler, faster, and more meaningful. 
              We're an innovative education platform dedicated to teaching individuals and organizations how to 
              harness the power of AI to transform their workflows and boost productivity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Rocket className="w-16 h-16 mx-auto text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1c4645] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a world where AI empowers every individual to achieve more with less effort, 
                making complex tasks simple and accessible.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Award className="w-16 h-16 mx-auto text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1c4645] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Democratizing AI education by providing practical, hands-on learning experiences 
                that translate directly into workplace productivity gains.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-16 h-16 mx-auto text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1c4645] mb-4">Our Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Building a global community of AI-literate professionals who can leverage 
                intelligent automation to focus on creative and strategic work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1c4645] mb-6">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI education and practical tools to streamline your work processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-[#1c4645] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 w-fit mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1c4645] mb-4">AI Fundamentals</h3>
              <p className="text-gray-600 leading-relaxed">
                Master the basics of artificial intelligence and machine learning concepts through interactive lessons
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-[#1c4645] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 w-fit mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1c4645] mb-4">Workflow Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn to automate repetitive tasks and optimize your daily workflows with AI-powered tools
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-[#1c4645] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 w-fit mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1c4645] mb-4">Team Training</h3>
              <p className="text-gray-600 leading-relaxed">
                Corporate training programs to upskill entire teams in AI applications and best practices
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-[#1c4645] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 w-fit mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1c4645] mb-4">Practical Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Hands-on projects that apply AI solutions to real-world challenges and industry scenarios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1c4645] mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of learners and organizations worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">10K+</div>
              <div className="text-gray-600 text-lg font-medium">Students Trained</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">500+</div>
              <div className="text-gray-600 text-lg font-medium">Companies Served</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">95%</div>
              <div className="text-gray-600 text-lg font-medium">Success Rate</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">24/7</div>
              <div className="text-gray-600 text-lg font-medium">Learning Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1c4645] via-[#2a5a58] to-[#1c4645] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Work?</h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have already revolutionized their workflows with AI. 
            Start your journey today and unlock your potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href={'/'}>
            <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Start Learning Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            </Link>
          
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1c4645] mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our courses or want to discuss custom training for your organization? 
              We'd love to hear from you.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;