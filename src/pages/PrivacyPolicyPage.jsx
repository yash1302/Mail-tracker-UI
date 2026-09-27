
import React from "react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: (
        <>
          <p>
            Welcome to MailTracker ("we", "our", or "us"). MailTracker is an
            email outreach and job application tracking platform that helps
            users manage email communications, follow-ups, and application
            activity.
          </p>
          <p>
            This Privacy Policy explains what information we collect, how we
            use and protect it, when it may be shared, and the choices
            available to you when using MailTracker.
          </p>
          <p>
            By using MailTracker, you acknowledge that you have read this
            Privacy Policy.
          </p>
        </>
      ),
    },
    {
      title: "2. Information We Collect",
      content: (
        <>
          <p>We may collect the following categories of information:</p>
          <h3 className="font-semibold mt-4 mb-2">
            A. Account Information
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name and email address provided through Google Sign-In.</li>
            <li>Google account identifiers required for authentication.</li>
            <li>Account preferences and application settings.</li>
          </ul>

          <h3 className="font-semibold mt-4 mb-2">
            B. Gmail Information
          </h3>
          <p>
            If you connect your Gmail account and authorize the requested
            permissions, MailTracker may access the following information,
            as needed for the features you use:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email addresses of recipients and senders.</li>
            <li>Email subjects and message content.</li>
            <li>Email thread and message identifiers.</li>
            <li>Email sending and reply information.</li>
            <li>Email drafts and attachments used by the application.</li>
            <li>
              Email engagement information, such as tracked opens and clicks,
              where tracking is enabled.
            </li>
          </ul>

          <h3 className="font-semibold mt-4 mb-2">
            C. Application Information
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email templates and saved drafts.</li>
            <li>Follow-up schedules and application statuses.</li>
            <li>Job application and recruiter information you provide.</li>
            <li>Usage information needed to operate and troubleshoot the service.</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Authenticate users and manage their accounts.</li>
            <li>Connect authorized Gmail accounts.</li>
            <li>Send emails using features explicitly requested by users.</li>
            <li>Display email threads, replies, and communication history.</li>
            <li>Schedule and manage email follow-ups.</li>
            <li>
              Track email opens and link clicks when the corresponding
              tracking features are enabled.
            </li>
            <li>Display application activity and analytics.</li>
            <li>Save drafts and email templates.</li>
            <li>Maintain, secure, and troubleshoot the application.</li>
          </ul>
          <p className="mt-3">
            We do not use Gmail data for purposes unrelated to the
            functionality of MailTracker.
          </p>
        </>
      ),
    },
    {
      title: "4. Google User Data and Gmail API",
      content: (
        <>
          <p>
            MailTracker uses Google OAuth and Google APIs to provide
            Gmail-related functionality. Access is granted only after you
            authorize the requested permissions.
          </p>
          <p>
            We use Google user data only to provide or improve features
            that are visible and relevant to users of MailTracker, in
            accordance with the Google API Services User Data Policy,
            including its Limited Use requirements.
          </p>
          <p>
            Specifically, authorized Gmail information may be used to
            support email sending, email management, follow-up functionality,
            and engagement tracking, depending on the features you use.
          </p>
          <p>
            We do not sell Google user data or use it to serve advertisements.
            We do not use Google user data to develop or train generalized
            artificial intelligence or machine learning models.
          </p>
          <p>
            We do not allow humans to read your Gmail content except where
            you have given explicit consent, where it is necessary for
            security purposes such as investigating abuse, where required
            by law, or where necessary to comply with applicable policies.
          </p>
          <p>
            Any transfer of Google user data to third parties is limited
            to what is necessary to provide the application's functionality,
            comply with applicable law, or protect against security issues,
            subject to the applicable Google user data requirements.
          </p>
        </>
      ),
    },
    {
      title: "5. Email Tracking",
      content: (
        <>
          <p>
            MailTracker provides email engagement tracking features.
            Depending on the features enabled, these may include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email open tracking using tracking pixels.</li>
            <li>Link click tracking using tracked links.</li>
            <li>Engagement statistics displayed in your dashboard.</li>
          </ul>
          <p className="mt-3">
            Open tracking may not accurately reflect whether a recipient
            has read an email. Email clients, privacy settings, and
            automatic image loading can affect tracking results.
          </p>
          <p>
            Similarly, automated link scanners may generate clicks that
            do not represent a person's actual interaction.
          </p>
        </>
      ),
    },
    {
      title: "6. Data Storage and Retention",
      content: (
        <>
          <p>
            MailTracker may store account information, authorized email
            information, drafts, follow-up details, and engagement
            statistics to provide its features.
          </p>
          <p>
            We retain information for as long as necessary to provide
            the service, maintain your account, fulfill the purposes
            described in this policy, or meet applicable legal
            requirements.
          </p>
          <p>
            You may request deletion of your account and associated
            information. Some information may be retained for a limited
            period where required by law or necessary to resolve disputes
            and maintain security.
          </p>
        </>
      ),
    },
    {
      title: "7. Data Sharing and Disclosure",
      content: (
        <>
          <p>
            We do not sell or rent your personal information or Google
            user data.
          </p>
          <p>
            We may share limited information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Service providers:</strong> With infrastructure,
              hosting, database, and other providers that help us operate
              MailTracker, subject to appropriate safeguards.
            </li>
            <li>
              <strong>Legal requirements:</strong> When disclosure is
              required by applicable law or a valid legal process.
            </li>
            <li>
              <strong>Security:</strong> When necessary to investigate
              fraud, abuse, or security incidents and protect the service
              and its users.
            </li>
            <li>
              <strong>With your direction:</strong> When you explicitly
              request or authorize a particular disclosure.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "8. Data Security",
      content: (
        <>
          <p>
            We take reasonable technical and organizational measures
            designed to protect information handled by MailTracker
            against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
          <p>
            However, no internet transmission or electronic storage
            method can be guaranteed to be completely secure. We
            cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      title: "9. Your Choices and Rights",
      content: (
        <>
          <p>You have several choices regarding your information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You can choose whether to connect your Google account
              and authorize Gmail permissions.
            </li>
            <li>
              You can revoke MailTracker's Google account access
              through your Google Account's third-party connections
              settings.
            </li>
            <li>
              You can request access to, correction of, or deletion
              of your personal information, subject to applicable law.
            </li>
            <li>
              You can stop using MailTracker at any time.
            </li>
          </ul>
          <p className="mt-3">
            Revoking Google access may prevent Gmail-related features
            from working.
          </p>
        </>
      ),
    },
    {
      title: "10. Children's Privacy",
      content: (
        <p>
          MailTracker is not intended for children under the age of
          13. We do not knowingly collect personal information from
          children under 13. If we become aware that such information
          has been collected, we will take appropriate steps to delete it.
        </p>
      ),
    },
    {
      title: "11. Changes to This Privacy Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our application, practices, or legal requirements.
          Any changes will be published on this page with an updated
          revision date.
        </p>
      ),
    },
    {
      title: "12. Contact Us",
      content: (
        <>
          <p>
            If you have questions about this Privacy Policy, your
            information, or a data deletion request, contact us at:
          </p>
          <p className="mt-3">
            <strong>MailTracker</strong>
            <br />
            Email:{" "}
            <a
              href="mailto:jadhavyash623@gmail.com"
              className="text-blue-600 underline"
            >
              jadhavyash623@gmail.com
            </a>
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: September 27, 2026
          </p>
          <p className="mt-4 leading-7 text-gray-700">
            This policy describes how MailTracker collects, uses,
            stores, and protects your information when you use our
            application.
          </p>
        </header>

        <div className="space-y-8 text-base leading-7 text-gray-700">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <div className="space-y-3">{section.content}</div>
            </section>
          ))}
        </div>

        <footer className="mt-10 border-t border-gray-200 pt-5 text-center text-sm text-gray-500">
          © 2026 MailTracker. All rights reserved.
        </footer>
      </article>
    </main>
  );
};

export default PrivacyPolicy;