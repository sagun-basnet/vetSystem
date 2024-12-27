import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
export const deleteDoctor = (req, res) => {
  const id = req.params.id;
  const q = "delete from `users` where `id` = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Doctor deleted successfully.", result });
  });
};

export const updateDoctor = (req, res) => {
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
      res.status(200).json({ message: "Doctor updated successfully.", result });
    }
  );
};

export const getDoctors = (req, res) => {
  const q = "select * from `users` where `role_id` = 2";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};
