import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">Terms of Service</h1>
      <p className="text-sm text-ink/50 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose-sm max-w-none space-y-6 text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">1. Acceptance of terms</h2>
          <p>
            By creating an account or using Sol Tutoring And Coding Academy ("STCA", "we", "us"),
            you agree to these Terms of Service. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">2. Accounts</h2>
          <p>
            You must provide accurate information when registering and are responsible for keeping
            your login credentials confidential. You are responsible for all activity under your
            account.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">3. Courses and enrollment</h2>
          <p>
            Enrolling in a paid course requires successful payment through Chapa. Access to course
            content is granted upon confirmed payment and remains available for as long as your
            account is active, unless otherwise stated for a specific course.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">4. Payments and refunds</h2>
          <p>
            All prices are listed in Ethiopian Birr (ETB). Payments are processed securely by
            Chapa — including via Telebirr, CBE Birr, HelloCash, and card — and STCA does not store
            your payment or mobile money details. Refund requests are handled on a case-by-case
            basis — contact solash5156@gmail.com within 7 days of purchase if you believe you are
            eligible for a refund.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">5. Tutoring services</h2>
          <p>
            Online and offline tutoring sessions are scheduled directly with our team. Cancellations
            or rescheduling should be requested at least 24 hours in advance where possible.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">6. Acceptable use</h2>
          <p>
            You agree not to share your account, redistribute course content, or use the platform for
            any unlawful purpose. We reserve the right to suspend accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">7. Intellectual property</h2>
          <p>
            All course materials, videos, and content on STCA are owned by STCA or its instructors and
            are provided for your personal, non-commercial learning use only.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">8. Limitation of liability</h2>
          <p>
            STCA provides its platform and services "as is." We are not liable for indirect or
            incidental damages arising from your use of the platform, to the extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">9. Changes to these terms</h2>
          <p>We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">10. Contact</h2>
          <p>Questions about these terms? Email us at solash5156@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
