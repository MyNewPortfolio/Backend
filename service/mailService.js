const { sendEmail } = require("../config/mail");
const Contact = require("../models/mail");

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  // 🛡️ Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 💾 Save message to DB
    await Contact.create({ name, email, message });

    // 🧼 Sanitize user input
    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // ✉️ Email details
    const subject = `📩 New Message from ${safeName}`;
    const htmlContent = `
      <div style="
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background: #f4f6f8;
        padding: 40px 0;
        color: #2d3748;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        ">
          <div style="
            background: linear-gradient(90deg, #465697, #5a67b1);
            color: white;
            padding: 20px 30px;
            text-align: center;
          ">
            <h1 style="margin: 0; font-size: 22px;">💬 New Contact Message</h1>
          </div>

          <div style="padding: 25px 30px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              You’ve received a new message from your <strong>portfolio contact form</strong> 🚀
            </p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #465697;">👤 Name</td>
                <td style="padding: 10px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #465697;">📧 Email</td>
                <td style="padding: 10px 0;">${safeEmail}</td>
              </tr>
            </table>

            <div style="
              margin-top: 20px;
              background: #f9fafb;
              border-left: 4px solid #ffb347;
              padding: 15px 20px;
              border-radius: 8px;
              font-size: 15px;
              line-height: 1.6;
              color: #2d3748;
            ">
              ${safeMessage}
            </div>

            <p style="margin-top: 25px; font-size: 14px; color: #718096;">
              🕒 Sent on: ${new Date().toLocaleString()}
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />

            <p style="font-size: 13px; text-align: center; color: #a0aec0;">
              This message was sent via your portfolio’s contact form.<br />
              <a href="https://biplab-biswas.netlify.app/" target="_blank" style="color: #465697; text-decoration: none;">View Portfolio</a>
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("📤 Sending contact email to:", "bbiplab165@gmail.com");

    const result = await sendEmail(
      "bbiplab165@gmail.com",
      subject,
      htmlContent
    );
    console.log("✅ Contact email result:", result);

    return res.status(200).json({
      message: "✅ Message sent & stored successfully!",
    });
  } catch (error) {
    console.error("❌ Error in contact controller:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const notifyVisit = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"] || "Unknown device";
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "Unknown IP";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; border-radius: 10px;">
        <h2 style="color: #465697;">🌐 Portfolio Visited</h2>
        <p><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>📍 IP Address:</strong> ${ip}</p>
        <p><strong>💻 Device Info:</strong> ${userAgent}</p>
        <p style="margin-top:10px; color:#555;">Someone just opened your portfolio!</p>
        <hr style="margin:20px 0; border:none; border-top:1px solid #e2e8f0;" />
        <p style="font-size:13px; color:#777;">This is an automated notification from your portfolio backend.</p>
      </div>
    `;

    await sendEmail(
      "bbiplab165@gmail.com",
      "👀 Your Portfolio Was Opened",
      htmlContent
    );

    return res
      .status(200)
      .json({ message: "Notification sent successfully ✅" });
  } catch (error) {
    console.error("❌ Error notifying visit:", error);
    return res
      .status(500)
      .json({ message: "Failed to send visit notification" });
  }
};
module.exports = { contact, notifyVisit };
