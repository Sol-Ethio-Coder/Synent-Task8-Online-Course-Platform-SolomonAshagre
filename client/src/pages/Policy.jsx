import React from 'react';

export default function Policy() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink/50 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose-sm max-w-none space-y-6 text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">1. Introduction</h2>
          <p>
            Sol Tutoring And Coding Academy ("STCA", "we", "us") provides online and offline coding
            courses and tutoring services. This policy explains what information we collect through
            our platform, how we use it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">2. Information we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> name, email address, and a securely hashed password.</li>
            <li><strong>Course activity:</strong> courses you enroll in, lessons you complete, and your progress percentage.</li>
            <li><strong>Payment information:</strong> we do not store your card, Telebirr, or bank details. Payments are processed by Chapa, and we retain only the transaction reference and amount for our records.</li>
            <li><strong>Communications:</strong> emails we send you for registration, verification, password resets, and enrollment confirmations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">3. How we use your information</h2>
          <p>We use your information to create and secure your account, deliver course content and track your learning progress, process enrollments and payments, send essential account and enrollment emails, and improve our courses and platform.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">4. Data sharing</h2>
          <p>
            We do not sell your personal data. We share information only with service providers
            necessary to run the platform — such as Chapa for payment processing and our email
            provider for transactional emails — and only to the extent required for them to perform
            those services.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">5. Data security</h2>
          <p>
            Passwords are hashed and never stored in plain text. Access to your account is protected
            by JWT-based authentication. While we take reasonable technical measures to protect your
            data, no online system can be guaranteed 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">6. Your choices</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data by contacting
            us at solash5156@gmail.com. You may also unsubscribe from non-essential communications
            at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">7. Changes to this policy</h2>
          <p>We may update this policy from time to time. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">8. Contact</h2>
          <p>Questions about this policy? Email us at solash5156@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
