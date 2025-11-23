'use client';

import Link from 'next/link';
import { Button } from './components/ui/Button';
import { Navigation } from './components/Navigation';
import {
  Scissors,
  Star,
  ArrowRight,
  CheckCircle,
  Download,
  Brain,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-24 overflow-hidden bg-surface">
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:p-8 lg:p-12 items-center px-4 sm:px-8 lg:px-24">
            {/* Left Side - Content */}
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="text-text-primary">Your Best</span>
                <br />
                <span className="text-accent">AI Homework Helper</span>
                <br />
                <span className="text-text-primary">Extension</span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">
                Snap a screenshot of any homework problem and get instant, step-by-step solutions powered by advanced AI. Join 100,000+ students getting better grades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="md" className="w-full sm:w-auto group whitespace-nowrap">
                    Add to Chrome - It's Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Video/Image Placeholder */}
            <div className="hidden lg:block">
              <div className="bg-white border border-border rounded-3xl aspect-video flex items-center justify-center relative overflow-hidden shadow-lg">
                <div className="text-center relative z-10">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-text-secondary">Video Display Area</p>
                  <p className="text-text-muted text-sm">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">1 Million+</div>
              <div className="text-text-secondary text-lg">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">98%</div>
              <div className="text-text-secondary text-lg">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-5xl md:text-6xl font-bold text-accent mb-2">
                4.9
                <Star className="w-10 h-10 fill-accent text-accent" />
              </div>
              <div className="text-text-secondary text-lg">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-text-secondary">Get started in under 60 seconds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:p-8 lg:p-12">
            <StepCard
              step="1"
              title="Install Extension"
              description="Add FratGPT to your Chrome browser with one click. It's completely free to install."
              icon={<Download className="w-8 h-8" />}
            />
            <StepCard
              step="2"
              title="Snap a Problem"
              description="Use snip mode to select a specific problem or screen mode to capture an entire page."
              icon={<Scissors className="w-8 h-8" />}
            />
            <StepCard
              step="3"
              title="Get Instant Solutions"
              description="Receive detailed step-by-step explanations powered by advanced AI in seconds."
              icon={<Brain className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Students Are Saying</h2>
            <p className="text-xl text-text-secondary">Real feedback from real students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah M."
              role="Computer Science Major"
              content="FratGPT has been a game-changer for my calculus homework. The step-by-step explanations help me actually understand the concepts!"
              rating={5}
            />
            <TestimonialCard
              name="Michael T."
              role="Engineering Student"
              content="I went from a C to an A in physics after using FratGPT. The explanations are clear and the extension is so easy to use."
              rating={5}
            />
            <TestimonialCard
              name="Emily R."
              role="Business Major"
              content="This tool saved me so much time on my statistics homework. I can finally focus on my other classes and still get good grades."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-24 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-text-secondary">Everything you need to know</p>
          </div>

          <div className="space-y-6">
            <FAQItem
              question="How does FratGPT work?"
              answer="FratGPT is a Chrome extension that uses advanced AI to solve homework problems. Simply take a screenshot of any problem using snip or screen mode, and our AI will provide detailed step-by-step solutions in seconds."
            />
            <FAQItem
              question="What subjects does FratGPT support?"
              answer="FratGPT supports all major subjects including Math, Physics, Chemistry, Biology, Computer Science, Economics, and more. Our AI is trained on millions of problems across all academic levels."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! You can install the extension for free and try it out. We offer a free trial period so you can experience the full power of FratGPT before subscribing."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Absolutely! You can cancel your subscription at any time from your account dashboard. No questions asked, no cancellation fees."
            />
            <FAQItem
              question="How accurate are the solutions?"
              answer="Our AI has a 98% accuracy rate across all subjects and problem types. We continuously improve our AI models to provide the most accurate and helpful solutions possible."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes, we take security very seriously. All your data is encrypted and we never share your information with third parties. Your privacy is our top priority."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-8 lg:px-24 relative bg-surface">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Ace Your Homework?</h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Join 100,000+ students who are already using FratGPT to get better grades and save time
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-10 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-accent">FratGPT</h3>
              <p className="text-text-secondary text-sm">AI-powered homework solver for students. Get instant solutions with step-by-step explanations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="#features" className="hover:text-text-primary transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link></li>
                <li><Link href="/login" className="hover:text-text-primary transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-text-primary transition-colors">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-text-muted text-sm border-t border-border pt-8">
            © 2025 FratGPT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ step, title, description, icon }: { step: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-md">
          <span className="text-2xl font-bold text-white">{step}</span>
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            {title}
            <span className="text-accent">{icon}</span>
          </h3>
          <p className="text-text-secondary text-lg leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, content, rating }: { name: string; role: string; content: string; rating: number }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-md transition-all duration-300 shadow-sm">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-text-secondary mb-4 italic">"{content}"</p>
      <div className="border-t border-border pt-4">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-text-muted">{role}</div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-md transition-all duration-300 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">{question}</h3>
      <p className="text-text-secondary leading-relaxed">{answer}</p>
    </div>
  );
}
