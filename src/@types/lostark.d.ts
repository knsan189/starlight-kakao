interface GuardianRaid {
  Name: string;
  Description: string;
  MinCharacterLevel: number;
  MinItemLevel: number;
  RequiredClearRaid: string;
  StartTime: string;
  EndTime: string;
  Image: string;
}

interface RewardItem {
  ExpeditionItemLevel: number;
}

interface Abyss {
  Name: string;
  Description: string;
  MinCharacterLevel: number;
  MinItemLevel: number;
  AreaName: string;
  StartTime: string;
  EndTime: string;
  Image: string;
}

interface Calendar {
  CategoryName: string;
  ContentsName: string;
  ContentsIcon: string;
  MinItemLevel: number;
  StartTimes: string[];
  Location: string;
  RewardItems: {
    Name: string;
    Icon: string;
    Grade: string;
    StartTimes: string[] | null;
  }[];
}

interface Profile {
  CharacterImage: string;
  ExpeditionLevel: number;
  PvpGradeName: string;
  TownLevel: number | null;
  TownName: string | null;
  Title: string;
  GuildMemberGrade: string;
  GuildName: string;
  UsingSkillPoint: number;
  TotalSkillPoint: number;
  Stats:
    | [
        {
          Type: string;
          Value: string;
          Tooltip: string[];
        },
      ]
    | null;
  Tendencies: [
    {
      Type: string;
      Point: number;
      MaxPoint: number;
    },
  ];
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
}

interface Equipment {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string;
}

interface Engraving {
  Slot: number;
  Name: string;
  Icon: string;
  Tooltip: string;
}

interface Gem {
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  Grade: string;
  Tooltip: string;
}

interface Card {
  Slot: number;
  Name: string;
  Icon: string;
  AwakeCount: string;
  AwakeTotal: string;
  Grade: string;
  Tooltip: string;
}

interface Effect {
  Name: string;
  Description: string;
}

interface AuctionItem {
  Name: string;
  Grade: string;
  Tier: number;
  Level: number | null;
  Icon: string;
  GradeQuality: number | null;
  AuctionInfo: {
    StartPrice: number;
    BuyPrice: number | null;
    BidPrice: number;
    EndDate: string;
    BidCount: number;
    /** 입찰가 */
    BidStartPrice: number;
    IsCompetitive: boolean;
    TradeAllowCount: number;
  };
  Options: [
    {
      Type: string;
      OptionName: string;
      OptionNameTripod: string;
      Value: number;
      IsPenalty: false;
      ClassName: string;
    },
  ];
}

interface MarketItem {
  Id: number;
  Name: string;
  Grade: string;
  Icon: string;
  BundleCount: number;
  TradeRemainCount: number | null;
  YDayAvgPrice: number;
  RecentPrice: number;
  CurrentMinPrice: number;
}
