import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


export async function SendOTP(email: string, OTP: string) {
  await transporter.sendMail({
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Delivery OTP Verification",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <h2 style="color: #2563eb; margin-bottom: 10px;">
          🔐 Delivery OTP
        </h2>

        <p style="color: #555; font-size: 14px;">
          Use the OTP below to verify your delivery. This OTP is valid for a limited time.
        </p>

        <div style="margin: 20px 0;">
          <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #111; background: #f1f5f9; padding: 10px 20px; border-radius: 8px; display: inline-block;">
            ${OTP}
          </span>
        </div>

        <p style="font-size: 13px; color: #888;">
          ⚠️ Do not share this OTP with anyone for security reasons.
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa;">
          If you did not request this, please ignore this email.
        </p>

        <p style="font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Your Company
        </p>

      </div>
    </div>
    `,
  });
}
