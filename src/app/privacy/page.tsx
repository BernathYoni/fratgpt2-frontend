import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            FratGPT 2.0
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address and password for account creation</li>
              <li>Payment information processed through Stripe</li>
              <li>Screenshots and images you upload for homework help</li>
              <li>Chat history and conversations with our AI</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your payments and manage subscriptions</li>
              <li>Generate AI responses to your homework questions</li>
              <li>Send you technical notices and support messages</li>
              <li>Monitor and analyze usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Storage and Retention</h2>
            <p>
              Your data is stored securely on our servers. We automatically delete:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Images:</strong> Automatically deleted after 5 days</li>
              <li><strong>Chat history:</strong> Retained for your account access</li>
              <li><strong>Account data:</strong> Retained until you delete your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Google Gemini:</strong> AI responses</li>
              <li><strong>OpenAI:</strong> AI responses (Expert mode)</li>
              <li><strong>Anthropic:</strong> AI responses (Expert mode)</li>
              <li><strong>Railway:</strong> Hosting and infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your chat history</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@fratgpt.com" className="text-blue-600 hover:underline">
                privacy@fratgpt.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
