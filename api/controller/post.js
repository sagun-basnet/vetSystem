export const createPost = (req, res) => {
  const { data } = req.body;
  const image = req.file;
  res.send({ image, data });
};
