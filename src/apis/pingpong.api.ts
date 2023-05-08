import axios from "axios";
import { PINPONG_BASE_URL, PINPONG_KEY } from "../config/const.js";

const KEY = `Basic ${PINPONG_KEY}`;

interface ChatResponse {
  response:
    | {
        replies: {
          from: {
            score: 1.0;
            name: string;
            link: string;
            from: string;
          };
          type: string;
          text: string;
        }[];
      }
    | string;
  version: string;
}
export default class PingpongApi {
  private static instance = axios.create({
    baseURL: PINPONG_BASE_URL,
    headers: {
      Authorization: KEY,
    },
  });

  public static chat(msg: string, sender: string): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await PingpongApi.instance({
            method: "POST",
            url: `/${encodeURIComponent(sender)}`,
            data: {
              request: { query: msg },
            },
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}
