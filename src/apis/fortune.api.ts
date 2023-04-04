import axios from "axios";
import { API_SERVER_URL } from "../config/const.js";

export default class FortuneApi {
  private static instance = axios.create({
    baseURL: `${API_SERVER_URL}/fortune`,
  });

  public static getFortune(): Promise<Fortune> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await FortuneApi.instance({
            method: "GET",
            url: "/random",
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}
