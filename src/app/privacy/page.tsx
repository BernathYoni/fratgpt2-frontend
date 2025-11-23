import Link from 'next/link';
import { Navigation } from '../components/Navigation';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="px-24 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-text-muted text-lg">Effective Date: January 1, 2025</p>
            <p className="text-text-muted text-lg">Last Updated: January 1, 2025</p>
          </div>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Introduction</h2>
              <p className="mb-4">
                This Privacy Policy ("Policy") describes how FratGPT ("Company," "we," "us," or "our") collects, uses, discloses, and protects information about users ("you" or "your") of our educational AI assistance service, including our website and Chrome browser extension (collectively, the "Service").
              </p>
              <p>
                By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Policy, you must not access or use the Service.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">1. Information We Collect</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Email address, password (encrypted), and account preferences</li>
                <li><strong>Payment Information:</strong> Billing information processed securely through Stripe (we do not store credit card numbers)</li>
                <li><strong>Content Data:</strong> Screenshots, images, or text you submit for AI analysis</li>
                <li><strong>Communications:</strong> Messages, feedback, or inquiries you send to us</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">1.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Usage Data:</strong> Number of problems solved, features used, session duration, and interaction patterns</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address</li>
                <li><strong>Cookies and Similar Technologies:</strong> Session tokens, preferences, and analytics data</li>
                <li><strong>Log Data:</strong> Timestamps, error logs, and performance metrics</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>

              <p className="mb-4">We use the collected information for the following purposes:</p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.1 Service Provision</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Process and analyze submitted problems using AI technology</li>
                <li>Generate step-by-step explanations and solutions</li>
                <li>Maintain your solve history and user preferences</li>
                <li>Authenticate your account and manage access</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.2 Service Improvement</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Analyze usage patterns to improve AI accuracy and performance</li>
                <li>Develop new features and enhance user experience</li>
                <li>Monitor and prevent technical issues or service disruptions</li>
                <li>Conduct research and analytics (using aggregated, de-identified data)</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.3 Communication</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Send service-related notifications, updates, and security alerts</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send marketing communications (you may opt-out at any time)</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.4 Legal and Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with legal obligations and enforce our Terms of Service</li>
                <li>Detect, prevent, and address fraud, security breaches, or technical issues</li>
                <li>Protect the rights, property, and safety of our users and the public</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">3. Information Sharing and Disclosure</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.1 Third-Party Service Providers</h3>
              <p className="mb-4">We share information with trusted third-party service providers who assist in operating our Service:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Google (Gemini API):</strong> Processes submitted images and text to generate AI-powered solutions. Subject to Google's Privacy Policy.</li>
                <li><strong>Stripe:</strong> Processes payment transactions securely. Subject to Stripe's Privacy Policy.</li>
                <li><strong>Railway:</strong> Hosts our application and database infrastructure. Subject to Railway's Privacy Policy.</li>
                <li><strong>Analytics Providers:</strong> Help us understand service usage and performance.</li>
              </ul>
              <p className="mb-4">
                These service providers are contractually obligated to use your information only to perform services on our behalf and to protect your information with appropriate security measures.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.2 Business Transfers</h3>
              <p className="mb-4">
                In the event of a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred to the acquiring entity. We will notify you via email and/or prominent notice on our Service before your information becomes subject to a different privacy policy.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.3 Legal Requirements</h3>
              <p className="mb-4">We may disclose your information if required by law or in good faith belief that such action is necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Comply with legal obligations, court orders, or government requests</li>
                <li>Enforce our Terms of Service and investigate violations</li>
                <li>Protect against fraud, security threats, or illegal activities</li>
                <li>Protect the rights, property, or safety of our users or the public</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.4 With Your Consent</h3>
              <p>We may share your information with third parties when you have given us explicit consent to do so.</p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">4. Data Security</h2>

              <p className="mb-4">
                We implement industry-standard technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Encryption:</strong> All data transmissions use TLS/SSL encryption (HTTPS)</li>
                <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with salt</li>
                <li><strong>Access Controls:</strong> Restricted access to personal information on a need-to-know basis</li>
                <li><strong>Regular Security Audits:</strong> Periodic reviews of our security practices and infrastructure</li>
                <li><strong>Secure Infrastructure:</strong> Data hosted on SOC 2-compliant cloud providers</li>
              </ul>
              <p className="mb-4">
                However, no method of electronic transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">5. Data Retention</h2>

              <p className="mb-4">
                We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after account deletion</li>
                <li><strong>Solve History:</strong> Retained while your account is active; deleted upon account deletion</li>
                <li><strong>Payment Records:</strong> Retained for 7 years to comply with financial regulations</li>
                <li><strong>Log Data:</strong> Typically retained for 90 days for security and troubleshooting purposes</li>
              </ul>
              <p>
                After the retention period, we will securely delete or anonymize your information. Some information may be retained in backup systems for an additional period but will be deleted in due course.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">6. Your Privacy Rights</h2>

              <p className="mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.1 Access and Portability</h3>
              <p className="mb-4">
                You have the right to request a copy of the personal information we hold about you. You can export your solve history through your account dashboard.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.2 Correction</h3>
              <p className="mb-4">
                You have the right to correct inaccurate or incomplete personal information. You can update your email address and preferences in your account settings.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.3 Deletion</h3>
              <p className="mb-4">
                You have the right to request deletion of your personal information. You can delete your account through your account settings or by contacting us at privacy@fratgpt.com. Please note that some information may be retained as required by law or for legitimate business purposes.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.4 Objection and Restriction</h3>
              <p className="mb-4">
                You have the right to object to or request restriction of certain processing of your personal information, including marketing communications.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.5 Withdraw Consent</h3>
              <p className="mb-4">
                Where processing is based on your consent, you have the right to withdraw that consent at any time.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.6 Lodge a Complaint</h3>
              <p className="mb-4">
                You have the right to lodge a complaint with a supervisory authority if you believe we have violated your privacy rights.
              </p>

              <p className="mt-6">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@fratgpt.com" className="text-pink-500 hover:text-orange-500 transition-colors">privacy@fratgpt.com</a>. We will respond to your request within 30 days.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">7. Children's Privacy</h2>

              <p className="mb-4">
                Our Service is intended for users who are at least 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@fratgpt.com.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">8. International Data Transfers</h2>

              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country.
              </p>
              <p className="mb-4">
                We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Using service providers that comply with international data protection frameworks</li>
                <li>Implementing standard contractual clauses approved by regulatory authorities</li>
                <li>Ensuring adequate security measures are in place to protect your information</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">9. California Privacy Rights (CCPA)</h2>

              <p className="mb-4">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Right to Know:</strong> You can request information about the categories and specific pieces of personal information we have collected, the sources, purposes, and third parties with whom we share it.</li>
                <li><strong>Right to Delete:</strong> You can request deletion of your personal information, subject to certain exceptions.</li>
                <li><strong>Right to Opt-Out:</strong> We do not sell personal information. If our practices change, we will update this Policy and provide an opt-out mechanism.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
              </ul>
              <p>
                To exercise these rights, contact us at privacy@fratgpt.com or call us at [PHONE NUMBER]. We may require verification of your identity before processing your request.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">10. European Privacy Rights (GDPR)</h2>

              <p className="mb-4">
                If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Right of access, rectification, erasure, and restriction of processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="mb-4">
                The legal basis for processing your personal information includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contractual Necessity:</strong> To provide the Service you have subscribed to</li>
                <li><strong>Legitimate Interests:</strong> To improve our Service, prevent fraud, and ensure security</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">11. Cookies and Tracking Technologies</h2>

              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p>
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of the Service.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">12. Changes to This Privacy Policy</h2>

              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Posting the updated Policy on our website with a new "Last Updated" date</li>
                <li>Sending an email notification to the address associated with your account</li>
                <li>Displaying a prominent notice on our Service</li>
              </ul>
              <p>
                Your continued use of the Service after changes become effective constitutes acceptance of the revised Policy. We encourage you to review this Policy periodically.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">13. Contact Us</h2>

              <p className="mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-background border border-border rounded-xl p-6 mb-4">
                <p className="mb-2"><strong>Email:</strong> <a href="mailto:privacy@fratgpt.com" className="text-pink-500 hover:text-orange-500 transition-colors">privacy@fratgpt.com</a></p>
                <p className="mb-2"><strong>Support:</strong> <a href="mailto:support@fratgpt.com" className="text-pink-500 hover:text-orange-500 transition-colors">support@fratgpt.com</a></p>
                <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 30 days.</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/" className="text-pink-500 hover:text-orange-500 transition-colors text-lg">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
