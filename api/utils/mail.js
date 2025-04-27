// utils/mail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: `"AgroHealth&Service Support" <${process.env.EMAIL_USER}>`,
    to,
    subject:
      "🔐 Your One-Time Password (OTP) for Account Verification AgroHealth&Services",
    html: `
     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <!-- Company logo placeholder -->
    <div style="font-size: 24px; font-weight: 600; color: #2c3e50;">AgroHealth&Service</div>
  </div>
  
  <h2 style="color: #2c3e50; font-size: 20px; font-weight: 500; margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Verify Your Account</h2>
  
  <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Hello,</p>
  
  <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Thank you for creating an account. To complete your registration, please use the verification code below:</p>
  
  <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; text-align: center; margin: 25px 0;">
    <div style="font-family: 'Courier New', monospace; font-size: 26px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otp}</div>
  </div>
  
  <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 10px;">This code will expire in <span style="font-weight: 500;">5 minutes</span>.</p>
  
  <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 30px;">If you didn't request this verification, please disregard this email or contact our support team.</p>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 30px;">
    <p style="color: #6c757d; font-size: 13px; margin-bottom: 5px;">For security reasons, never share this code with anyone.</p>
    <p style="color: #6c757d; font-size: 13px; margin-bottom: 0;">This is an automated message. Please do not reply to this email.</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
    <p style="color: #6c757d; font-size: 13px; margin-bottom: 5px;">© 2025 AgroHealth&Service. All rights reserved.</p>
  </div>
</div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
