import Link from 'next/link';
import { Navigation } from '../components/Navigation';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="px-24 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-text-muted text-lg">Effective Date: January 1, 2025</p>
            <p className="text-text-muted text-lg">Last Updated: January 1, 2025</p>
          </div>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Introduction</h2>
              <p className="mb-4">
                These Terms of Service ("Terms," "Agreement") constitute a legally binding agreement between you ("User," "you," or "your") and FratGPT ("Company," "we," "us," or "our") governing your access to and use of the FratGPT educational AI assistance service, including our website, Chrome extension, and all related services (collectively, the "Service").
              </p>
              <p className="mb-4">
                BY ACCESSING OR USING THE SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of the Service following any changes constitutes acceptance of those changes.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">1. Description of Service</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">1.1 Service Overview</h3>
              <p className="mb-4">
                FratGPT is an AI-powered educational assistance platform that analyzes screenshots, images, or text of academic problems and provides step-by-step solutions and explanations. The Service is delivered through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>A Chrome browser extension for capturing and submitting problems</li>
                <li>A web-based platform for account management and solve history</li>
                <li>Cloud-based AI processing using Google's Gemini API</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">1.2 Educational Purpose</h3>
              <p className="mb-4">
                The Service is designed as an educational tool to help students understand academic concepts through detailed explanations. It is NOT intended to replace learning, enable academic dishonesty, or complete assignments on behalf of students.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">1.3 Service Modifications</h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We are not liable for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">2. User Eligibility and Account Registration</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.1 Age Requirement</h3>
              <p className="mb-4">
                You must be at least 13 years of age to use the Service. Users under 18 must have parental or guardian consent to use the Service and enter into this Agreement.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.2 Account Creation</h3>
              <p className="mb-4">
                To access certain features, you must create an account by providing:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>A valid email address</li>
                <li>A secure password</li>
                <li>Acceptance of these Terms and our Privacy Policy</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.3 Account Security</h3>
              <p className="mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Immediately notifying us of any unauthorized use of your account</li>
                <li>Using a strong, unique password and enabling available security features</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">2.4 One Account Per User</h3>
              <p>
                Each user is permitted one account. Creating multiple accounts to circumvent usage limits or for any other purpose is strictly prohibited and may result in termination of all associated accounts.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">3. Acceptable Use Policy</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.1 Permitted Uses</h3>
              <p className="mb-4">You may use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Receive explanations and solutions to academic problems for learning purposes</li>
                <li>Understand concepts and methodologies through step-by-step guidance</li>
                <li>Review and study your solve history</li>
                <li>Access educational resources and support</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.2 Prohibited Uses</h3>
              <p className="mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Use the Service to cheat on exams, tests, or graded assessments</li>
                <li>Submit work generated by the Service as your own without proper attribution</li>
                <li>Violate any academic integrity policies or honor codes of your educational institution</li>
                <li>Share your account credentials with others or allow unauthorized access</li>
                <li>Attempt to circumvent usage limits, payment requirements, or access controls</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
                <li>Use automated systems (bots, scripts, crawlers) to access the Service</li>
                <li>Submit content that is illegal, harmful, threatening, abusive, harassing, or otherwise objectionable</li>
                <li>Submit content that infringes intellectual property rights or violates privacy rights</li>
                <li>Attempt to gain unauthorized access to our systems, networks, or user accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service for any commercial purpose without our prior written consent</li>
                <li>Collect or harvest personal information about other users</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">3.3 Academic Integrity</h3>
              <p>
                Users are solely responsible for ensuring their use of the Service complies with all applicable academic integrity policies, honor codes, and regulations of their educational institutions. We strongly encourage using the Service as a learning tool, not a means to complete assignments or assessments dishonestly.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">4. Subscription Plans and Payment</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">4.1 Plan Options</h3>
              <p className="mb-4">We offer the following subscription plans:</p>
              <div className="bg-background border border-border rounded-xl p-6 mb-4">
                <p className="mb-3"><strong className="text-text-primary">Free Plan:</strong> $0/month</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>3 snips/screens per day</li>
                  <li>Snip & Screen modes</li>
                  <li>Step-by-step explanations</li>
                  <li>Basic support</li>
                </ul>

                <p className="mb-3"><strong className="text-text-primary">Basic Plan:</strong> $5/month</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>50 snips/screens per day</li>
                  <li>Snip & Screen modes</li>
                  <li>Step-by-step explanations</li>
                  <li>Follow-up questions</li>
                  <li>Solve history</li>
                </ul>

                <p className="mb-3"><strong className="text-text-primary">Pro Plan:</strong> $20/month</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Unlimited snips/screens</li>
                  <li>Snip & Screen modes</li>
                  <li>Step-by-step explanations</li>
                  <li>Follow-up questions</li>
                  <li>Solve history</li>
                  <li>Priority support</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">4.2 Payment Processing</h3>
              <p className="mb-4">
                All payments are processed securely through Stripe, our third-party payment processor. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring monthly basis.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">4.3 Automatic Renewal</h3>
              <p className="mb-4">
                Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date. You will be charged the then-current subscription fee for your plan.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">4.4 Price Changes</h3>
              <p className="mb-4">
                We reserve the right to change our subscription prices at any time. Price changes will be communicated at least 30 days in advance and will take effect at your next renewal. If you do not accept the price change, you may cancel your subscription.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">4.5 Taxes</h3>
              <p>
                All fees are exclusive of applicable taxes, which will be added to your invoice as required by law.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">5. Cancellation, Refunds, and Downgrades</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">5.1 Cancellation</h3>
              <p className="mb-4">
                You may cancel your subscription at any time through your account dashboard or by contacting support@fratgpt.com. Cancellations take effect at the end of your current billing period. You will retain access to paid features until that date.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">5.2 Refund Policy</h3>
              <p className="mb-4">
                We offer a 7-day money-back guarantee for first-time subscribers. If you are not satisfied with the Service within 7 days of your initial subscription, contact support@fratgpt.com for a full refund.
              </p>
              <p className="mb-4">
                After the 7-day period, all payments are non-refundable. We do not provide refunds or credits for partial months or unused solves.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">5.3 Plan Changes</h3>
              <p className="mb-4">
                You may upgrade or downgrade your plan at any time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Upgrades:</strong> Take effect immediately and you will be charged a prorated amount for the remainder of the billing period</li>
                <li><strong>Downgrades:</strong> Take effect at the start of your next billing period</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">6. Intellectual Property Rights</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.1 Our Intellectual Property</h3>
              <p className="mb-4">
                The Service, including but not limited to its software, design, text, graphics, logos, icons, images, audio clips, data compilations, and underlying technology, is owned by or licensed to FratGPT and is protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.2 License to Use</h3>
              <p className="mb-4">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial use.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.3 User Content</h3>
              <p className="mb-4">
                By submitting content (screenshots, text, images) to the Service, you grant us a worldwide, non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Process your content to provide the Service</li>
                <li>Store your content for the duration specified in our Privacy Policy</li>
                <li>Use de-identified, aggregated data derived from your content to improve our AI models and Service</li>
              </ul>
              <p className="mb-4">
                You retain all ownership rights to your submitted content. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own or have the right to submit all content you provide</li>
                <li>Your content does not infringe any third-party intellectual property rights</li>
                <li>Your content does not violate any applicable laws or regulations</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">6.4 Trademarks</h3>
              <p>
                "FratGPT" and our logo are trademarks of FratGPT. You may not use these trademarks without our prior written consent.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">7. Disclaimers and Limitations of Liability</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">7.1 Service "As Is"</h3>
              <p className="mb-4 uppercase font-semibold">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">7.2 No Guarantee of Accuracy</h3>
              <p className="mb-4">
                While we strive for accuracy, we do not guarantee that the solutions, explanations, or other content provided by our AI are accurate, complete, or error-free. The Service is intended as an educational aid, not an authoritative source. Users must independently verify all solutions and explanations.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">7.3 No Warranty of Availability</h3>
              <p className="mb-4">
                We do not guarantee that the Service will be available at all times or that it will be uninterrupted, timely, secure, or error-free. We may suspend access for maintenance, updates, or other reasons.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">7.4 Limitation of Liability</h3>
              <p className="mb-4 uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FRATGPT, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Errors, mistakes, or inaccuracies in content provided by the Service</li>
                <li>Personal injury or property damage resulting from your use of the Service</li>
              </ul>
              <p className="mb-4 uppercase font-semibold">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">7.5 Academic Consequences</h3>
              <p>
                We are not responsible for any academic consequences, disciplinary actions, grade penalties, or other sanctions resulting from your use of the Service. You are solely responsible for complying with your institution's academic integrity policies.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">8. Indemnification</h2>

              <p>
                You agree to indemnify, defend, and hold harmless FratGPT, its officers, directors, employees, agents, licensors, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party, including intellectual property rights</li>
                <li>Any content you submit to the Service</li>
                <li>Your violation of any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">9. Termination</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">9.1 Termination by You</h3>
              <p className="mb-4">
                You may terminate your account at any time by deleting your account through your account settings or by contacting support@fratgpt.com.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">9.2 Termination by Us</h3>
              <p className="mb-4">
                We reserve the right to suspend or terminate your account and access to the Service, with or without notice, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Prolonged inactivity</li>
                <li>Failure to pay applicable fees</li>
                <li>At our sole discretion for any other reason</li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">9.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service will immediately cease. We may delete your account and all associated data in accordance with our Privacy Policy. Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, indemnification, and limitations of liability.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">10. Dispute Resolution and Arbitration</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">10.1 Informal Resolution</h3>
              <p className="mb-4">
                Before initiating any formal dispute resolution, you agree to contact us at legal@fratgpt.com to attempt to resolve the dispute informally. We will attempt to resolve the dispute within 60 days.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">10.2 Binding Arbitration</h3>
              <p className="mb-4">
                If we cannot resolve the dispute informally, any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be conducted in [YOUR STATE/LOCATION], and judgment on the arbitration award may be entered in any court having jurisdiction.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">10.3 Class Action Waiver</h3>
              <p className="mb-4 uppercase font-semibold">
                YOU AND FRATGPT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">10.4 Exceptions</h3>
              <p>
                Either party may bring a lawsuit in court solely for injunctive relief to stop unauthorized use or abuse of the Service or infringement of intellectual property rights without first engaging in arbitration.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">11. General Provisions</h2>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.1 Governing Law</h3>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of [YOUR STATE], United States, without regard to its conflict of law provisions.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.2 Entire Agreement</h3>
              <p className="mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and FratGPT regarding the Service and supersede all prior agreements and understandings.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.3 Severability</h3>
              <p className="mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.4 Waiver</h3>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.5 Assignment</h3>
              <p className="mb-4">
                You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.6 Force Majeure</h3>
              <p className="mb-4">
                We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, network infrastructure failures, strikes, or shortages of transportation, fuel, energy, labor, or materials.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mt-6 mb-3">11.7 Export Control</h3>
              <p>
                You agree to comply with all applicable export and re-export control laws and regulations, including the Export Administration Regulations maintained by the U.S. Department of Commerce.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">12. Changes to These Terms</h2>

              <p className="mb-4">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Posting the updated Terms on our website with a new "Last Updated" date</li>
                <li>Sending an email notification to the address associated with your account</li>
                <li>Displaying a prominent notice on the Service</li>
              </ul>
              <p className="mb-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Service and may cancel your account.
              </p>
            </section>

            <section className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">13. Contact Information</h2>

              <p className="mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-background border border-border rounded-xl p-6 mb-4">
                <p className="mb-2"><strong>Email:</strong> <a href="mailto:legal@fratgpt.com" className="text-pink-500 hover:text-orange-500 transition-colors">legal@fratgpt.com</a></p>
                <p className="mb-2"><strong>Support:</strong> <a href="mailto:support@fratgpt.com" className="text-pink-500 hover:text-orange-500 transition-colors">support@fratgpt.com</a></p>
                <p><strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.</p>
              </div>
            </section>

            <div className="bg-surface border border-orange-500 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Acknowledgment</h3>
              <p className="mb-4">
                BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU ARE NOT AUTHORIZED TO USE THE SERVICE.
              </p>
              <p>
                You further acknowledge that these Terms, together with our Privacy Policy, constitute the complete and exclusive agreement between you and FratGPT regarding the Service, and supersede any prior agreements, communications, or understandings, whether oral or written.
              </p>
            </div>

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
