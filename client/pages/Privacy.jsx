export default function Privacy() {
  return (
    <main className="bg-[#F8F9FA]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Legal
          </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 9, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="space-y-10">
            <PolicySection title="1. Introduction">
              <p>
                Job-Merket respects your privacy and is committed to protecting
                the personal information you provide while using our job and
                internship platform.
              </p>

              <p>
                This Privacy Policy explains what information we collect, how we
                use it, and the choices available to you.
              </p>
            </PolicySection>

            <PolicySection title="2. Information We Collect">
              <p>
                Depending on how you use Job-Merket, we may collect information
                such as your name, email address, phone number, location,
                professional experience, skills, profile information, and other
                details you voluntarily provide.
              </p>

              <p>
                Candidates may also upload resumes and submit applications for
                jobs. Recruiters may provide company information, company logos,
                job postings, and hiring-related information.
              </p>
            </PolicySection>

            <PolicySection title="3. Account and Authentication Information">
              <p>
                Job-Merket uses Firebase Authentication to manage account
                registration and sign-in, including supported email/password and
                Google authentication methods.
              </p>

              <p>
                Authentication credentials are handled by the authentication
                provider and are not stored as plain-text passwords in
                Job-Merket's database.
              </p>
            </PolicySection>

            <PolicySection title="4. Resume and File Storage">
              <p>
                Candidate resumes and recruiter-uploaded company logos may be
                stored using private cloud storage. Access to private files is
                controlled through Job-Merket's backend services.
              </p>

              <p>
                Recruiters are only permitted to access application resumes
                associated with jobs they are authorized to manage.
              </p>
            </PolicySection>

            <PolicySection title="5. How We Use Your Information">
              <p>We may use your information to:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>Create and maintain your account.</li>
                <li>Provide candidate and recruiter features.</li>
                <li>Process and manage job applications.</li>
                <li>Allow recruiters to manage job postings and applicants.</li>
                <li>Improve the functionality and security of Job-Merket.</li>
                <li>Respond to support requests and contact messages.</li>
              </ul>
            </PolicySection>

            <PolicySection title="6. Sharing of Information">
              <p>We do not sell your personal information.</p>

              <p>
                Information may be shared when necessary to provide platform
                functionality, such as allowing a recruiter to review
                information submitted by a candidate who applies for that
                recruiter's job.
              </p>
            </PolicySection>

            <PolicySection title="7. Third-Party Services">
              <p>
                Job-Merket may rely on third-party services such as Firebase,
                cloud file storage, email delivery services, database hosting,
                and application hosting providers.
              </p>

              <p>
                These services may process information according to their own
                privacy policies and security practices.
              </p>
            </PolicySection>

            <PolicySection title="8. Data Security">
              <p>
                We use reasonable technical measures to protect information,
                including authenticated API access, authorization checks, and
                restricted access to private files.
              </p>

              <p>
                However, no method of transmission or electronic storage can be
                guaranteed to be completely secure.
              </p>
            </PolicySection>

            <PolicySection title="9. Your Choices">
              <p>
                You may update certain profile information through your account.
                You may also contact us regarding questions about your personal
                information or account.
              </p>
            </PolicySection>

            <PolicySection title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy when the platform or its data
                practices change. The updated date shown at the top of this page
                will indicate the latest revision.
              </p>
            </PolicySection>

            <PolicySection title="11. Contact Us">
              <p>
                If you have questions or concerns about this Privacy Policy,
                please use the Contact Us page to reach Job-Merket.
              </p>
            </PolicySection>
          </div>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}
