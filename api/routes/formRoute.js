import express from "express";
import { getGoogleFormData } from "../controller/form.js";

const router = express.Router();

// Route to fetch Google Form responses
router.get("/form-data", getGoogleFormData);

export default router;
