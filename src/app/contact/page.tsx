import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-accent hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Contact & Support</h1>

        <div className="space-y-8">
          <section className="bg-surface border border-border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-text-secondary mb-6">
              Have questions, feedback, or need help? We're here for you!
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <a
                  href="mailto:support@fratgpt.com"
                  className="text-accent hover:underline text-lg"
                >
                  support@fratgpt.com
                </a>
                <p className="text-text-muted text-sm mt-1">
                  We typically respond within 24 hours
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                <p className="text-text-secondary">
                  Monday - Friday: Within 12 hours<br />
                  Weekends: Within 24 hours
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How do I cancel my subscription?</h3>
                <p className="text-text-secondary">
                  Log in to your dashboard and go to Billing → Manage Subscription.
                  You can cancel anytime with no questions asked.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">I forgot my password. What do I do?</h3>
                <p className="text-text-secondary">
                  Contact us at support@fratgpt.com with your registered email,
                  and we'll help you reset your password.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">The extension isn't working. Help!</h3>
                <p className="text-text-secondary">
                  First, try refreshing the page or restarting your browser.
                  If the issue persists, email us with details about what's happening,
                  and we'll troubleshoot with you.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I get a refund?</h3>
                <p className="text-text-secondary">
                  Yes! We offer a 7-day money-back guarantee for first-time subscribers.
                  Email us within 7 days of your first payment for a full refund.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Report a Bug</h2>
            <p className="text-text-secondary mb-4">
              Found a bug or something not working as expected? Let us know!
            </p>
            <p className="text-text-secondary">
              Email: <a href="mailto:support@fratgpt.com" className="text-accent hover:underline">
                support@fratgpt.com
              </a>
            </p>
            <p className="text-text-muted text-sm mt-2">
              Please include: What you were trying to do, what happened instead,
              and your browser/OS version if possible.
            </p>
          </section>

          <section className="bg-surface border border-border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Feature Requests</h2>
            <p className="text-text-secondary">
              Have an idea to make FratGPT better? We'd love to hear it!
              Email your suggestions to support@fratgpt.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
