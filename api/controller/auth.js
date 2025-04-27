import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/mail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

let pendingRegistrations = {}; // Temporary in-memory store

export const register = async (req, res) => {
  const { name, address, phone, email, password, role_id } = req.body;
  const profile = req.file?.filename || null; // If file uploaded, get filename

  try {
    // Check if user already exists
    const q = "SELECT * FROM `users` WHERE `email` = ?";
    db.query(q, [email], async (err, data) => {
      if (err)
        return res.status(500).json({ error: "Database error", details: err });
      if (data.length)
        return res
          .status(409)
          .json({ message: "User already exists.", success: 0 });

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Store all user data temporarily
      pendingRegistrations[email] = {
        name,
        address,
        phone,
        email,
        password: hashedPassword,
        role_id,
        profile,
        otp,
        createdAt: Date.now(), // Optional: to later expire old entries
      };

      console.log(profile, ":Profile");
      console.log(otp, ":OTP");

      // Send OTP
      await sendOtpEmail(email, otp);

      res.status(200).json({
        message: "OTP sent to your email for verification.",
        success: 1,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong.", details: error.message });
  }
};
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const registration = pendingRegistrations[email];

  if (!registration) {
    return res.status(404).json({ message: "No registration found." });
  }

  if (parseInt(otp) !== registration.otp) {
    return res.status(200).json({ message: "Invalid OTP.", success: 0 });
  }

  // Register the user
  // const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(registration.password, salt);
  const q =
    "INSERT INTO users (`name`, `address`, `phone`, `email`, `password`, `role_id`, `profile`) VALUE (?,?,?,?,?,?,?)";
  db.query(
    q,
    [
      registration.name,
      registration.address,
      registration.phone,
      registration.email,
      registration.password,
      registration.role_id,
      registration.profile,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      delete pendingRegistrations[email]; // Remove from temp store
      res.status(201).json({ message: "User registered successfully." });
    }
  );
};
export const requestPasswordReset = (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  const insertOtpQuery =
    "INSERT INTO password_reset_otps (email, otp, expires_at) VALUES (?, ?, ?)";
  db.query(insertOtpQuery, [email, otp, expiresAt], (err, result) => {
    if (err) return res.status(500).json(err);
    sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email.", success: 1 });
  });
};
export const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  const checkOtpQuery =
    "SELECT * FROM password_reset_otps WHERE email = ? ORDER BY id DESC LIMIT 1";
  db.query(checkOtpQuery, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length)
      return res.status(400).json({ message: "OTP not found." });

    const otpData = data[0];
    const now = new Date();

    if (otpData.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });
    if (now > otpData.expires_at)
      return res.status(400).json({ message: "OTP expired." });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updatePasswordQuery, [hashedPassword, email], (err, result) => {
      if (err) return res.status(500).json(err);

      const deleteOtpQuery = "DELETE FROM password_reset_otps WHERE email = ?";
      db.query(deleteOtpQuery, [email]); // optional: clean up

      res
        .status(200)
        .json({ message: "Password reset successfully.", success: 1 });
    });
  });
};

export const registerDoctor = (req, res) => {
  const { name, address, phone, email } = req.body;
  const profile = req.file?.filename || null; // store filename from upload
  console.log(profile, ":Profile");

  const q = "select * from `users` where `email` = ?";
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
  const otp = generateOTP();

  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res
        .status(201)
        .json({ message: "Doctor already exists.", success: 0 });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync("doctor@123", salt);
    const q =
      "insert into users (`name`, `address`, `phone`, `email`, `password`, `role_id`,`isVerified`, `profile`) value(?,?,?,?,?,?,?,?)";
    db.query(
      q,
      [name, address, phone, email, hashedPassword, 2, 1, profile],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({
          message: "Doctor added successfully.",
          success: 1,
        });
      }
    );
  });
};

export const login = (req, res) => {
  const q = "select * from `users` where `email` = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(201).json({ message: "User Not found.", success: 0 });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res
        .status(201)
        .json({ message: "Password not match", success: 0 });

    const token = jwt.sign(
      { id: data[0].id, role_id: data[0].role_id },
      "secretkey"
    );

    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: false,
      })
      .status(200)
      .json({ others, token, success: 1 });
  });
};

// export const verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(201).send({ message: "OTP is required", success: 0 });
//   }

//   const sql = "SELECT * FROM users WHERE email = ? AND otp = ?";

//   db.query(sql, [email, otp], (err, result) => {
//     if (err) {
//       return res.status(400).send(err);
//     }

//     if (result.length > 0) {
//       const updateSql = "UPDATE users SET isVerified = 1 WHERE email = ?";
//       db.query(updateSql, [email], (err, updateResult) => {
//         if (err) {
//           res.status(500).send("Failed to update verification status");
//         }
//         res.status(200).json({
//           message: "Email verified successfully",
//           data: updateResult,
//           success: 1,
//         });
//       });
//     } else {
//       res.status(201).send({ message: "OTP is invalid!!", success: 0 });
//     }
//   });
// };

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { sameSite: "none", secure: true })
    .status(200)
    .json("User has been logged out.");
};
