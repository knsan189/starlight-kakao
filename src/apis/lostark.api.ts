import axios from "axios";
import { API_SERVER_URL } from "../config/const.js";

interface GetGuardiansRepsonse {
  Raids: GuardianRaid[];
  RewardItems: RewardItem[];
}

type GetAbyssResponse = Abyss[];
type GetCalendarResponse = Calendar[];

interface GetUserResponse {
  profile: Profile | null;
  equipment: Equipment[] | null;
  engravings: { Engravings: Engraving[]; Effects: Effect[] } | null;
  gems: { Gems: Gem[]; Effects: Effect[] } | null;
  cards: { Cards: Card[]; Effects: Effect[] } | null;
}

interface SearchAuctionResponse {
  PageNo: number;
  PageSize: number;
  Items: AuctionItem[] | null;
}
export default class LostArkApi {
  private static instance = axios.create({
    baseURL: `${API_SERVER_URL}/lostark`,
  });

  public static getGuardians(): Promise<GetGuardiansRepsonse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "GET",
            url: "/guardian",
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static getAbyss(): Promise<GetAbyssResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "GET",
            url: "/abyss",
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static getCalendar(): Promise<GetCalendarResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "GET",
            url: "/calendar",
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static getUser(userName: string): Promise<GetUserResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "GET",
            url: "/user",
            params: {
              userName,
            },
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static searchMarket(keyword: string): Promise<MarketItem[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "POST",
            url: "/market",
            data: {
              keyword,
            },
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  public static searchAuction(keyword: string): Promise<SearchAuctionResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await LostArkApi.instance({
            method: "POST",
            url: "/auction",
            data: {
              keyword,
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
