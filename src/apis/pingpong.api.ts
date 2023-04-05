import axios from "axios";

const KEY = `Basic a2V5OjkxZjYwNWE3ZWM1ZjcxNTg3NDZmMjY3MjNlNTZlM2Qz`;

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
    baseURL:
      "https://builder.pingpong.us/api/builder/62b50ccce4b0d7787e95ffa7/integration/v0.2/custom",
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
