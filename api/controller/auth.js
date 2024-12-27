import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  //   console.log(req.body);
  const { name, address, phone, email, password, role_id } = req.body;
  const q = "select * from `users` where `email` = ?";
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
        res.status(201).json({ message: "User created successfully.", result });
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
        httpOnly: true,
      })
      .status(200)
      .json({ others, token });
  });
};
