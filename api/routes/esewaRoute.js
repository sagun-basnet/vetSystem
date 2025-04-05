import express from "express";
import { verifyEsewa, handleEsewaSuccess } from "../controller/esewa.js";

const router = express.Router();

router.get("/verifyEsewa", verifyEsewa);
router.get("/success", handleEsewaSuccess);

export default router;
