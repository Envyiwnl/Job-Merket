import { Mail, MapPin, MessageSquareText } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send your message.");
      }

      setSuccess(data.message || "Your message has been sent successfully.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setError(error.message || "Failed to send your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#F8F9FA]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Contact Us
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            We'd be happy to hear from you
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Have a question, feedback, or need help with Job-Merket? Reach out
            and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="space-y-5">
          <ContactCard
            icon={Mail}
            title="Email"
            text="support@job-merket.com"
          />

          <ContactCard icon={MapPin} title="Location" text="India" />

          <ContactCard
            icon={MessageSquareText}
            title="Support"
            text="For account, job posting, application, or platform-related questions."
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Send us a message
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fill out the form below and we'll respond when possible.
          </p>

          <form
            className="mt-6 space-y-5"
            aria-label="Contact Job-Merket"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                <span className="ml-1 text-red-500" aria-hidden="true">
                  *
                </span>
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="name"
                maxLength={100}
                placeholder="Your name"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                <span className="ml-1 text-red-500" aria-hidden="true">
                  *
                </span>
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="text-sm font-medium text-slate-700"
              >
                <span className="ml-1 text-red-500" aria-hidden="true">
                  *
                </span>
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
                aria-required="true"
                maxLength={150}
                placeholder="How can we help?"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-sm font-medium text-slate-700"
              >
                <span className="ml-1 text-red-500" aria-hidden="true">
                  *
                </span>
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                maxLength={3000}
                placeholder="Write your message..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl bg-[#08C8B7]/10 px-4 py-3 text-sm font-medium text-[#059F92]"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#08C8B7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08C8B7]/10">
        <Icon className="h-5 w-5 text-[#08C8B7]" />
      </div>

      <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
