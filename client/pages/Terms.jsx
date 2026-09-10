export default function Terms() {
  return (
    <main className="bg-[#F8F9FA]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Legal
          </p>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 9, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="space-y-10">
            <TermsSection title="1. Acceptance of Terms">
              <p>
                By accessing or using Job-Merket, you agree to these Terms &
                Conditions. If you do not agree with these terms, you should not
                use the platform.
              </p>
            </TermsSection>

            <TermsSection title="2. About Job-Merket">
              <p>
                Job-Merket is a job and internship platform that connects
                candidates with recruiters and employers.
              </p>

              <p>
                The platform provides features including job discovery, saved
                jobs, job applications, candidate profiles, recruiter company
                profiles, job posting, applicant management, and hiring-related
                tools.
              </p>
            </TermsSection>

            <TermsSection title="3. User Accounts">
              <p>
                Certain features require an account. You are responsible for
                providing accurate information and for maintaining appropriate
                access to your account.
              </p>

              <p>
                You must not use another person's account, impersonate another
                person or organization, or attempt to gain unauthorized access
                to Job-Merket.
              </p>
            </TermsSection>

            <TermsSection title="4. Candidate Responsibilities">
              <p>
                Candidates are responsible for ensuring that profile
                information, resumes, skills, experience, and application
                information they provide are accurate and not misleading.
              </p>

              <p>
                Candidates should only apply to opportunities they genuinely
                intend to pursue.
              </p>
            </TermsSection>

            <TermsSection title="5. Recruiter Responsibilities">
              <p>
                Recruiters are responsible for ensuring that company information
                and job listings they publish are accurate, legitimate, and
                lawful.
              </p>

              <p>
                Recruiters must not post fraudulent, misleading, discriminatory,
                deceptive, or otherwise unlawful job opportunities.
              </p>

              <p>
                Candidate information and resumes accessed through Job-Merket
                must only be used for legitimate recruitment and hiring
                purposes.
              </p>
            </TermsSection>

            <TermsSection title="6. Job Listings and Applications">
              <p>
                Job-Merket provides tools that allow recruiters to publish job
                opportunities and candidates to apply for them.
              </p>

              <p>
                Job-Merket does not guarantee that a candidate will receive an
                interview, offer, or employment, and does not guarantee that a
                recruiter will successfully hire a candidate.
              </p>
            </TermsSection>

            <TermsSection title="7. Prohibited Use">
              <p>You must not use Job-Merket to:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>Post fraudulent or misleading job opportunities.</li>
                <li>Submit false or intentionally misleading information.</li>
                <li>Harass, threaten, abuse, or impersonate other users.</li>
                <li>
                  Attempt to access accounts, files, systems, or data without
                  authorization.
                </li>
                <li>
                  Upload malicious software or interfere with the operation of
                  the platform.
                </li>
                <li>
                  Collect or misuse candidate or recruiter information for
                  unauthorized purposes.
                </li>
                <li>
                  Use the platform in violation of applicable laws or
                  regulations.
                </li>
              </ul>
            </TermsSection>

            <TermsSection title="8. Resume and Candidate Information">
              <p>
                When a candidate submits an application, relevant profile and
                resume information may become accessible to the recruiter
                responsible for that job.
              </p>

              <p>
                Recruiters must treat candidate information responsibly and must
                not distribute, sell, or misuse candidate data.
              </p>
            </TermsSection>

            <TermsSection title="9. Platform Availability">
              <p>
                We aim to keep Job-Merket available and reliable, but we do not
                guarantee uninterrupted or error-free operation.
              </p>

              <p>
                Features may occasionally be unavailable due to maintenance,
                technical issues, third-party services, or other circumstances.
              </p>
            </TermsSection>

            <TermsSection title="10. Third-Party Services">
              <p>
                Job-Merket may use third-party providers for authentication,
                database hosting, file storage, email delivery, and application
                hosting.
              </p>

              <p>
                We are not responsible for outages or failures caused by
                third-party services outside our reasonable control.
              </p>
            </TermsSection>

            <TermsSection title="11. Limitation of Liability">
              <p>
                Job-Merket acts as a platform connecting candidates and
                recruiters. We are not a party to employment agreements or
                hiring decisions made between users.
              </p>

              <p>
                To the extent permitted by applicable law, Job-Merket is not
                responsible for losses resulting from user-provided information,
                hiring decisions, employment disputes, or misuse of the platform
                by other users.
              </p>
            </TermsSection>

            <TermsSection title="12. Account or Content Restrictions">
              <p>
                We may restrict access to the platform or remove content that
                violates these Terms, threatens platform security, or is
                fraudulent, abusive, or unlawful.
              </p>
            </TermsSection>

            <TermsSection title="13. Privacy">
              <p>
                Your use of Job-Merket is also subject to our Privacy Policy,
                which explains how information may be collected, used, stored,
                and protected.
              </p>
            </TermsSection>

            <TermsSection title="14. Changes to These Terms">
              <p>
                These Terms may be updated as Job-Merket evolves. The updated
                date displayed at the top of this page indicates the latest
                revision.
              </p>
            </TermsSection>

            <TermsSection title="15. Contact">
              <p>
                If you have questions about these Terms & Conditions, please use
                the Contact Us page to reach Job-Merket.
              </p>
            </TermsSection>
          </div>
        </div>
      </section>
    </main>
  );
}

function TermsSection({ title, children }) {
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
