import { google } from "googleapis";
import fs from "fs";

// Load Google API credentials
const credentials = JSON.parse(
  fs.readFileSync("quiet-result-454404-c3-5c16958d6ae5.json", "utf-8")
);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export default auth;
