import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";
import { db } from "../db/db.js";

dotenv.config();

export const verifyEsewa = async (req, res) => {
  const uuid = uuidv4();
  const esewaSecret = process.env.ESEWASECRET;
  // console.log(esewaSecret);
  const message = `total_amount=${500},transaction_uuid=${uuid},product_code=EPAYTEST`;

  const hash = CryptoJS.HmacSHA256(message, esewaSecret);

  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return res.json({
    uuid: uuid,
    signature: hashInBase64,
  });
};

export const handleEsewaSuccess = async (req, res) => {
  const { data } = req.query;

  let decodedString = atob(data);
  decodedString = JSON.parse(decodedString);
  console.log(decodedString.total_amount, ":price");

  switch (decodedString.status) {
    // compare the signature once again for better security
    case "COMPLETE":
      try {
        const message = `total_amount=${decodedString.total_amount},transaction_uuid=${decodedString.transaction_uuid},product_code=${decodedString.product_code}`;

        const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        const result = hashInBase64 == decodedString.signature;
        // if (result == false) {
        //   throw "Hash value not matched";
        // }

        // After successfully inserting the order, send the redirect response
        res.redirect(`http://localhost:5173/user/success`);
      } catch (error) {
        console.log("error occoured", error);
      }
      break;

    case "PENDING":
      break;

    case "FULL_REFUND":
      break;

    case "CANCELED":
      break;
  }
};

//fineshed url
//http://localhost:5173/finished/${pid}
