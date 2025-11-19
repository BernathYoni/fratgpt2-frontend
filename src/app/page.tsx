'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FratGPT 2.0</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Homework Like a <span className="text-blue-600">Frat Bro</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered homework help that actually gets you. Screenshot your problem,
          get instant answers and explanations.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-lg"
          >
            Start Free <ArrowRight size={20} />
          </Link>
          <a
            href="#pricing"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg"
          >
            See Pricing
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Get answers in seconds with our Fast mode, or deep explanations with Regular mode
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Consensus</h3>
            <p className="text-gray-600">
              Expert mode uses 3 AI models and creates a consensus answer for ultimate accuracy
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Chrome Extension</h3>
            <p className="text-gray-600">
              Screenshot or snip any homework problem directly from your browser
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="border-2 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-gray-600">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>20 solves per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All 3 modes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Chat history</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Get Started
            </Link>
          </div>

          {/* Basic */}
          <div className="border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-4">Basic</h3>
            <div className="text-4xl font-bold mb-4">$9<span className="text-lg text-gray-600">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>50 solves per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All 3 modes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Upgrade Now
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <div className="text-4xl font-bold mb-4">$19<span className="text-lg text-gray-600">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited solves</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All 3 modes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Premium support</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 FratGPT. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
