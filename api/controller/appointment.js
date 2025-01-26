import { db } from "../db/db.js";
export const bookAppointment = (req, res) => {
  const { date, service, user_id, doctor_id } = req.body;
  const q = "select * from appointment where date = ? and doctor_id = ?";
  db.query(q, [date], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length)
      return res.status(409).json("Appointment already exists.");
    const q =
      "insert into appointment (date, service, user_id, doctor_id) values(?, ?, ?, ?)";
    db.query(q, [date, service, user_id, doctor_id], (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({ message: "Appointment booked successfully.", result });
    });
  });
};

export const getAppointment = (req, res) => {
  const q = "select * from appointment";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

export const cancelAppointment = (req, res) => {
  const id = req.params.id;
  const q = "delete from appointment where id = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Appointment cancelled successfully.", result });
  });
};