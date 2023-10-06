import axios, { AxiosResponse } from "axios";

interface Raid {
  rds_no: string;
  rade_title: string;
  rade_participants: string;
  rade_people: string;
  rade_date: string;
  rade_time: string;
}

interface GetRaidListResponse {
  message: string;
  data: Raid[];
}

interface RaidUser {
  rds_no: number;
  chartor_job: string;
  chartor_deal: string;
  chartor_itemlevel: string;
  chartor_name: string;
}

interface RaidDetail {
  rade_title: string;
  rade_date: string;
  rade_time: string;
  data: RaidUser[];
}

const instance = axios.create({
  baseURL: `http://xn--o80b67s58az0s.com/api`,
});

export default class RaidApi {
  public static getRaidList(): Promise<Raid[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response: AxiosResponse<GetRaidListResponse> = await instance({
            method: "GET",
            url: "/rade.php",
          });
          resolve(response.data.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static getRaidDetail(raidNum: number): Promise<RaidDetail> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await instance({
            method: "GET",
            url: "/rade.php",
            params: {
              rds_no: raidNum,
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
