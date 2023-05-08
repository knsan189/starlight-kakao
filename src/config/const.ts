import dotenv from "dotenv";

dotenv.config();

export const API_SERVER_URL = "http://localhost:3003/api";
export const PINPONG_KEY = `${process.env.PINGPONG_API_KEY}`;
export const PINPONG_BASE_URL = `${process.env.PINGPONG_BASE_URL}`;

export default {};
