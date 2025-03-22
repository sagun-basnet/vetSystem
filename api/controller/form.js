import { google } from "googleapis";
import auth from "../config/googleAuth.js";
import dotenv from "dotenv";

dotenv.config();

export const getGoogleFormData = async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const sheetId = process.env.SHEET_ID;
    const range = "Form responses 1!A:H"; // Adjust based on your sheet structure

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    const headers = rows[0]; // First row as headers
    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || ""; // Assign values, handle empty fields
      });
      return obj;
    });

    return res.json({ success: true, formResponses: data });
  } catch (error) {
    console.error("Error fetching Google Form data:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
