import axios from "axios";
import { API_SERVER_URL } from "../config/const.js";

export default class DiscordApi {
  private static instance = axios.create({
    baseURL: `${API_SERVER_URL}/members`,
  });

  public static getMembers(): Promise<DiscordMember[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await DiscordApi.instance({
            method: "GET",
            url: "/list",
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static getMember(nickname: string): Promise<DiscordMember> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await DiscordApi.instance({
            method: "GET",
            url: `/list/${nickname}`,
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}
