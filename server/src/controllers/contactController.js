import transporter from "../config/mailer.js";

export async function sendContactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name is too long.",
      });
    }

    if (subject.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: "Subject is too long.",
      });
    }

    if (message.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long.",
      });
    }

    const safeSubject = subject.trim().replace(/[\r\n]+/g, " ");

    await transporter.sendMail({
      from: `"Job-Merket Contact" <${process.env.SMTP_USER}>`,

      to: process.env.CONTACT_RECEIVER_EMAIL,

      replyTo: email.trim(),

      subject: `[Job-Merket Contact] ${safeSubject}`,

      text: `
New message received from Job-Merket.

Name: ${name.trim()}
Email: ${email.trim()}
Subject: ${safeSubject}

Message:
${message.trim()}
      `.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again.",
    });
  }
}
