interface Fortune {
  id: number;
  msg?: string | null;
  fortune: string;
  delayTime: number;
}

interface DiscordMember {
  nickname: string;
  id: number;
  lastJoinedTime?: Date;
  lastLeaveTime?: Date;
}
