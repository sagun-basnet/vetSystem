import { db } from "../db/db.js";
export const bookAppointment = (req, res) => {
    const { date, service, user_id, doctor_id } = req.body;
    const doctorId = parseInt(doctor_id);
    console.log(doctorId);
    const q = "select * from appointment where date = ? and doctor_id = ?";
    db.query(q, [date, doctorId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length)
            return res.status(409).json("Appointment already exists.");
        const q =
            "insert into appointment (date, service, user_id, doctor_id) values(?, ?, ?, ?)";
        db.query(q, [date, service, user_id, doctorId], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({
                message: "Appointment booked successfully.",
                result,
            });
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
export const getAppointmentByUser = (req, res) => {
  const id = parseInt(req.params.id);  // user_id from the request parameter

  // Corrected SQL query with proper MySQL comments
  const q = `SELECT * from appointment where user_id = ?;`; 
  
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);  // Return the result of the query
  });
};



export const cancelAppointment = (req, res) => {
    const id = req.params.id;
    const q = "delete from appointment where id = ?";
    db.query(q, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({
            message: "Appointment cancelled successfully.",
            result,
        });
    });
};
