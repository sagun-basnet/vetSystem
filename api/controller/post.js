import { db } from "../db/db.js";
export const createPost = (req, res) => {
  const data = req.body;
  const image = req.file;
  console.log(image, ":Image");

  const q = "insert into post(title, description, image) values(?, ?, ?)";
  db.query(q, [data.title, data.description, image.filename], (err, result) => {
    if (err) return res.status(500).send(err);
    res
      .status(201)
      .send({ message: "Post created sucessfully", result, success: 1 });
  });
};

export const deletePost = (req, res) => {
  const id = req.params.id;
  const q = "delete from post where id = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Post deleted sucessfully", result });
  });
};

export const updatePost = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const image = req.file;
  const q =
    "update post set title = ?, description = ?, image = ? where id = ?";
  db.query(q, [data.title, data.description, image.path, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Post updated sucessfully", result });
  });
};

export const getPosts = (req, res) => {
  const q = "select * from post";
  db.query(q, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};
