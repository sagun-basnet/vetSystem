import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../middleware/mail.js";

export const register = (req, res) => {
    const { name, address, phone, email, password, role_id } = req.body;
    const q = "select * from `users` where `email` = ?";
    const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
    const otp = generateOTP();
  
    db.query(q, [email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists.");
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const q =
        "insert into users (`name`, `address`, `phone`, `email`, `password`, `role_id`) value(?,?,?,?,?,?)";
      db.query(
        q,
        [name, address, phone, email, hashedPassword, role_id],
        (err, result) => {
          if (err) return res.status(500).json(err);
          res
            .status(200)
            .json({ message: "User added successfully.", success: 1 });
        }
        // const msg = `<div> <h1>Hi, ${email},This is your OTP: <span style="color:blue">${otp}</span> Please verify it on <a href="http://localhost:5173">AppName</a>.</h1>
        //                         </div>`;
  
        // sendMail({
        //   receiver: email,
        //   subject: "Mail Verification",
        //   text: "msg",
        //   html: msg,
        // })
        //   .then((messageId) => {
        //     console.log("Email sent successfully with Message ID:", messageId);
        //     const sql = "UPDATE users SET otp=? WHERE email=?";
        //     db.query(sql, [otp, email], (err, data) => {
        //       if (err) {
        //         res.status(500).send(err);
        //       } else {
        //         res.status(200).send({
        //           success: true,
        //           message: "User added successfully",
        //         });
        //       }
        //     });
        //   })
  
        // res.status(201).json({ message: "User created successfully.", result });
      );
    });
  };

export const registerDoctor = (req, res) => {
  const { name, address, phone, email } = req.body;

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
      "insert into users (`name`, `address`, `phone`, `email`, `password`, `role_id`,`isVerified`) value(?,?,?,?,?,?,?)";
    db.query(
      q,
      [name, address, phone, email, hashedPassword, 2, 1],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res
          .status(200)
          .json({ message: "Doctor added successfully.", success: 1 });
      }
    );
  });
};

export const login = (req, res) => {
  const q = "select * from `users` where `email` = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "User Not found." });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("Password not match");

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
      .json({ others, token });
  });
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("OTP is required");
  }

  const sql = "SELECT * FROM users WHERE email = ? AND otp = ?";

  db.query(sql, [email, otp], (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    if (result.length > 0) {
      const updateSql = "UPDATE users SET isVerified = 1 WHERE email = ?";
      db.query(updateSql, [email], (err, updateResult) => {
        if (err) {
          res.status(500).send("Failed to update verification status");
        }
        res.send({
          message: "Email verified successfully",
          data: updateResult,
          success: true,
        });
      });
    } else {
      res.status(400).send("OTP is invalid!!");
    }
  });
};
