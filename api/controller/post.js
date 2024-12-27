import { db } from "../db/db.js";
export const createPost = (req, res) => {
  const data = req.body;
  const image = req.file;
  const q = "insert into post(title, description, image) values(?, ?, ?)";
  db.query(q, [data.title, data.description, image.path], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: "Post created sucessfully", result });
  });
};
