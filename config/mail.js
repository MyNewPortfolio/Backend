const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: "My Portfolio <onboarding@resend.dev>", // You can replace with your verified domain sender
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }

    console.log("✅ Email sent:", data?.id || "No ID returned");
    return data;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
