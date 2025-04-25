import { db } from "../db/db.js";
import bcrypt from "bcryptjs";

export const getUser = (req, res) => {
  const q = "select * from `users` where `role_id` = 3";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

export const deleteUser = (req, res) => {
  const id = req.params.id;
  const q = "delete from `users` where `id` = ?";
  db.query(q, [parseInt(id)], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "User deleted successfully.", success: 1 });
  });
};
export const singleUser = (req, res) => {
  const id = req.params.id;
  const q = "select * from `users` where `id` = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "User fetch successfully.", result });
  });
};

export const updateUser = (req, res) => {
  const id = req.params.id;
  const { name, address, phone, email, password, role_id } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const q =
    "update `users` set `name` = ?, `address` = ?, `phone` = ?, `email` = ?, `password` = ?, `role_id` = ? where `id` = ?";
  db.query(
    q,
    [name, address, phone, email, hashedPassword, role_id, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(200)
        .json({ message: "User updated successfully.", success: 1 });
    }
  );
};
export const updateDoctor = (req, res) => {
  const id = req.params.id;
  const { name, address, phone, email } = req.body;
  const q =
    "update `users` set `name` = ?, `address` = ?, `phone` = ?, `email` = ? where `id` = ?";
  db.query(q, [name, address, phone, email, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res
      .status(200)
      .json({ message: "Doctor updated successfully.", success: 1 });
  });
};
export const getDoctors = (req, res) => {
  const q = "select * from `users` where `role_id` = 2";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

export const addUser = (req, res) => {
  const { name, address, phone, email } = req.body;

  const q = "select * from `users` where `email` = ?";
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
  const otp = generateOTP();

  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res
        .status(201)
        .json({ message: "User already exists.", success: 0 });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync("user@123", salt);
    const q =
      "insert into users (`name`, `address`, `phone`, `email`, `password`, `role_id`,`isVerified`) value(?,?,?,?,?,?,?)";
    db.query(
      q,
      [name, address, phone, email, hashedPassword, 3, 1],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({
          message: "User added successfully.",
          success: 1,
        });
      }
    );
  });
};
