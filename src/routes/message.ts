/* eslint-disable no-console */
import { Router } from "express";
import DiscordApi from "../apis/discord.api.js";
import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko/index.js";
import LostArkApi from "../apis/lostark.api.js";
import FortuneApi from "../apis/fortune.api.js";
import RaidApi from "../apis/raid.api.js";

declare global {
  interface String {
    format: (...args: string[]) => string;
  }
}

const prefix = "/";
const MessageRouter = Router();
const tagRegex = /<[^>]*>?/g;

const FortuneMap = new Map<string, Fortune>();
let timestamp = new Date();

function getParsedSender(sender: string) {
  return sender.split("/")[0].trim();
}

String.prototype.format = function (...args: string[]) {
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] === "undefined" ? match : args[index];
  });
};

function parseElilxer(text: string) {
  return text
    .replace(tagRegex, "")
    .replace(/\[(.*?)\]/g, "")
    .trim();
}

const MSG_REACTION = ["안녕", "좋은 아침", "좋은아침", "굿모", "굳모"];
const MSG_COMMAND_LIST = ["/명령어", "/도움말", "/?"];

const formatDateTime = (dateString: string) =>
  format(new Date(dateString), "MM-dd(eee) HH시 mm분", {
    locale: ko,
  });

MessageRouter.post("/", async (req, res) => {
  try {
    const { msg, sender }: MessageRequest = req.body;

    console.log(`[${new Date().toLocaleString()}] ${sender} : ${msg}`);

    if (MSG_REACTION.some((item) => msg.includes(item))) {
      const parsedSender = sender.split("/")[0].trim();
      return res.send({ repley: `${parsedSender}님 안녕안녕하세요 !` });
    }

    if (msg.includes("승호") && msg.includes("언제")) {
      const member: DiscordMember = await DiscordApi.getMember("승호");

      const { lastJoinedTime, lastLeaveTime } = member;

      if (!lastJoinedTime || !lastLeaveTime) {
        return;
      }

      if (new Date(lastJoinedTime).getTime() > new Date(lastLeaveTime).getTime()) {
        const date = formatDistanceToNow(new Date(lastJoinedTime), {
          addSuffix: true,
          locale: ko,
        });

        return res.send({
          reply: `지금 접속중이신걸요 ???`,
          secondReply: `${date}에 접속하셔서 아직 계십니담. 또 언제 사라지실지는 모르겠지만요`,
        });
      }

      const date = formatDistanceToNow(new Date(lastLeaveTime), {
        addSuffix: true,
        locale: ko,
      });

      return res.send({ reply: `디코 ${date}에 마지막으로 접속하시구 다시 안오셨어요 ㅠㅠ` });
    }

    if (msg.includes("디코") && msg.includes("누구")) {
      const members = await DiscordApi.getMembers();
      const currentUser: DiscordMember[] = [];
      members.forEach((member) => {
        if (member.lastLeaveTime && member.lastJoinedTime) {
          const joinTime = new Date(member.lastJoinedTime).getTime();
          const leaveTime = new Date(member.lastLeaveTime).getTime();
          if (joinTime > leaveTime) {
            currentUser.push(member);
          }
        } else {
          currentUser.push(member);
        }
      });

      if (currentUser.length === 0) {
        return res.send({ reply: `지금 아무도 접속 안하고 있는거 같아요 ! 아마두요` });
      }

      let message = "지금 ";
      currentUser.forEach((member) => {
        message += `${getParsedSender(member.nickname)}님 `;
      });
      message += "접속해 계시는거 같아요 !";
      return res.send({ reply: message });
    }

    if (!msg.startsWith(prefix)) return;
    const args = msg.split(" ");
    const cmd = args.shift()?.slice(prefix.length);
    let parsedSender = getParsedSender(sender);
    if (parsedSender.length > 2) {
      parsedSender = parsedSender.substring(1);
    }

    if (cmd === "도가토") {
      const { Raids } = await LostArkApi.getGuardians();
      return res.send({
        reply: `👾 이번주 도전 가디언 토벌은\n${Raids.map((r) => r.Name).join(", ")}입니다.`,
      });
    }

    if (cmd === "도비스") {
      const abyss = await LostArkApi.getAbyss();
      return res.send({ reply: `🚩 이번주 도전 어비스 지역은\n${abyss[0].AreaName}입니다.` });
    }

    if (cmd === "운세") {
      if (timestamp.getDate() !== new Date().getDate()) {
        timestamp = new Date();
        FortuneMap.clear();
      }

      let response = FortuneMap.get(parsedSender);

      if (!response) {
        response = await FortuneApi.getFortune();
        FortuneMap.set(parsedSender, response);
      }

      return res.send({
        reply: response.fortune.format(parsedSender),
        secondReply: response?.msg?.format(parsedSender),
        delayTime: response.delayTime,
      });
    }

    if (cmd === "오늘모험섬" || cmd === "모험섬") {
      const calender = await LostArkApi.getCalendar();
      const time = calender[0].StartTimes.find((t) => new Date().getTime() < new Date(t).getTime());

      if (!time) {
        return res.send({ reply: "오늘 모험섬 입장은 끝났습니다. 내일 다시 시도해주세요 찡긋" });
      }

      let message = "🏝 오늘의 모험섬이에요.";
      message += `\n`;
      message += `\n [입장 가능 시간] : ${format(new Date(time), "kk시 mm분")}`;
      message += `\n`;

      calender.forEach((island) => {
        let icon: string;
        let itemName = island.RewardItems[0]?.Name;
        if (itemName) {
          if (itemName === "실링") {
            icon = "💲";
          } else if (itemName.includes("카드 팩")) {
            itemName = "카드 팩";
            icon = "🃏";
          } else if (itemName === "골드") {
            icon = "💰";
          } else {
            icon = "⛵";
          }
          message += `\n- ${island.ContentsName} (${icon} ${itemName})`;
        }
      });

      message += `\n\n`;

      return res.send({ reply: message });
    }

    if (cmd === "유저") {
      const userName = args.shift();

      if (!userName) {
        return res.send({ reply: "❌ 유저 이름을 입력해주세요" });
      }

      const { engravings, equipment, gems, profile } = await LostArkApi.getUser(userName);

      if (!profile) {
        return res.send({ reply: "❌ 해당 유저 정보가 존재하지 않는데요?" });
      }

      const tooltips = equipment?.map((eq) => {
        const target = JSON.parse(eq.Tooltip).Element_008?.value.Element_000?.contentStr;
        if (target) {
          return [
            parseElilxer(target.Element_000?.contentStr.split("<br>")[0] || ""),
            parseElilxer(target.Element_001?.contentStr.split("<br>")[0] || ""),
          ];
        } else {
          return undefined;
        }
      });

      let message = "";
      message += `@${profile.CharacterName} / ${profile.GuildName}\n`;
      message += `${profile.CharacterClassName} / 💎 Lv ${profile.ItemMaxLevel} (${profile.CharacterLevel})\n`;
      message += `\n`;
      message += `⚡ [ 각인 ] ⚡\n`;
      engravings?.Effects.forEach((ef) => {
        message += ` - ${ef.Name}\n`;
      });
      message += `\n`;
      message += `🎲 [ 특성 ] 🎲\n`;
      profile.Stats?.sort((a, b) => Number(b.Value) - Number(a.Value));
      profile.Stats?.forEach((stat) => {
        if (stat.Type !== "인내" && stat.Type !== "숙련" && stat.Type !== "제압") {
          message += ` - ${stat.Type} : ${Number(stat.Value).toLocaleString()}\n`;
        }
      });
      message += `\n`;
      message += `⚔ [ 장비 ] ⚔\n`;
      equipment?.forEach((item, index) => {
        if (
          item.Type === "무기" ||
          item.Type === "투구" ||
          item.Type === "상의" ||
          item.Type === "하의" ||
          item.Type === "장갑" ||
          item.Type === "어깨"
        ) {
          const Elixir = tooltips?.[index];
          message += `${item.Name}`;
          if (Elixir && item.Type !== "무기") {
            message += `\n ${Elixir[0]}`;
            if (Elixir[1]) {
              message += `, ${Elixir[1]}`;
            }
          }
          message += "\n";
        }
      });
      message += `\n`;
      message += `💎 [ 보석 ] 💎\n`;
      gems?.Gems.forEach((gem, index) => {
        message += ` - ${gem.Name.replace(/<[^>]*>?/g, "").replace("의 보석", "")}`;
        if ((index + 1) % 2 === 0) {
          message += `\n`;
        }
      });
      return res.send({ reply: message });
    }

    if (cmd === "거래소") {
      const keyword = msg.replace("/거래소", "").trim();
      const response = await LostArkApi.searchMarket(keyword);

      let message = "";

      if (response.length === 0) {
        return res.send("해당 검색어에 대한 결과를 찾을 수 없습니다.");
      }

      response.forEach((item, index) => {
        message += `${index + 1}. ${item.Name} - ${item.Grade}\n`;
        message += `- 전일 : ${item.YDayAvgPrice.toLocaleString()}골드, 최저 : ${item.CurrentMinPrice.toLocaleString()}골드`;
        if (index !== response.length - 1) {
          message += "\n\n";
        }
      });

      return res.send({ reply: message });
    }

    if (cmd === "경매장") {
      const keyword = msg.replace("/경매장", "").trim();
      const response = await LostArkApi.searchAuction(keyword);

      let message = "";

      if (!response.Items || response.Items.length === 0) {
        return res.send("해당 검색어에 대한 결과를 찾을 수 없습니다.");
      }

      response.Items.forEach((item, index, array) => {
        if (index < 5) {
          message += `${index + 1}. ${item.Name}\n`;
          message += `- 즉구 : ${item.AuctionInfo.BuyPrice?.toLocaleString()}, 입찰 : ${item.AuctionInfo.StartPrice.toLocaleString()}`;
          if (index !== array.length - 1 && index !== 4) {
            message += `\n\n`;
          }
        }
      });
      return res.send({ reply: message });
    }

    if (cmd === "사이트") {
      return res.send({
        reply: "별빛노을.com 에서 길드 레이드 신청하시면. 길마님이 소원들어 주신대요",
        secondReply: "아 잘 들어주시기만 하신대요 😪 ",
      });
    }

    if (cmd === "레이드목록" || cmd === "레이드일정") {
      const response = await RaidApi.getRaidList();
      let reply = "📌 이번주 레이드 일정입니다 \n";
      response.forEach((raid) => {
        reply += "\n";
        reply += `${raid.rds_no}. ${raid.rade_title}(${raid.rade_participants}/${raid.rade_people})\n`;
        reply += `출발 : ${formatDateTime(`${raid.rade_date} ${raid.rade_time}`)}\n`;
      });
      return res.send({ reply });
    }

    if (cmd === "레이드상세") {
      const raidNum = Number(msg.replace("/레이드상세", "").trim());

      if (!raidNum) {
        return res.send({ reply: "레이드상세 조회는 숫자로만 할수 있어용. 찡긋" });
      }

      const response = await RaidApi.getRaidDetail(raidNum);

      if (!response.data || !response.rade_date) {
        const parsedSender = sender.split("/")[0].trim();
        return res.send({
          reply: `레이드번호 ${raidNum}는 등록 안된 레이드인거 같은데요? 지금 절 시험하시는건가요. ${parsedSender}님!? 😪`,
        });
      }

      let reply = `${raidNum}. ${response.rade_title} 레이드 인원입니다.\n`;
      reply += `출발일정 : ${formatDateTime(`${response.rade_date} ${response.rade_time}`)}\n`;

      response.data.forEach((user) => {
        reply += "\n";
        reply += `[${user.chartor_job}] ${user.chartor_name} (${user.chartor_itemlevel})`;
      });

      if (reply.includes("로즈")) {
        return res.send({
          reply,
          secondReply:
            "호오.. 승호님이 포함되어있는 레이드 같아보이는군요.. 공대원 분들 힘내세요 ! 😪",
        });
      }

      if (reply.includes("폰")) {
        return res.send({
          reply,
          secondReply: "아만지부장님이 참가하시는 레이드입니다. 다들 조심하세요 !",
        });
      }

      if (reply.includes("랑가")) {
        return res.send({
          reply,
          secondReply: "별빛노을의 💎박보검💎과 함께하는 레이드입니다. 싸인 받을 준비는 되셨나요?",
        });
      }

      if (reply.includes("토끼")) {
        return res.send({
          reply,
          secondReply:
            "희진님 아이스 아메리카노 따뜻하게 한잔 부탁드려용. 아니면 차가운 핫초코 한잔이요",
        });
      }

      return res.send({ reply });
    }

    if (cmd && (cmd.length >= 2 || MSG_COMMAND_LIST.some((msg) => msg.includes(cmd)))) {
      const message =
        "⌨ 현재 사용 가능한 명령어는" +
        `\n 1. /유저 닉네임` +
        "\n - 유저정보를 가지고 옵니다." +
        `\n 2. /운세` +
        "\n - 오늘 나의 게임 운을 확인해 볼 수 있어요." +
        `\n 3. /명령어, /?` +
        "\n - 전체 명령어를 확인합니다." +
        `\n 4. /도비스` +
        "\n - 이번주 도전 어비스 던전을 확인 할 수 있어요." +
        `\n 5. /도가토` +
        "\n - 이번주 도전 가디언 토벌을 확인 할수 있어요." +
        `\n 6. /거래소 아이템이름` +
        "\n - 거래소에 등록되어 있는 아이템의 가격을 확인 할 수 있어요. " +
        "\n ※ ex) /거래소 원한 각인서" +
        `\n 7. /경매장 아이템이름` +
        "\n - 거래소에 등록되어 있는 아이템의 가격을 확인 할 수 있어요. 현재는 보석만 확인 가능해요." +
        "\n ※ ex) /거래소 10레벨 멸화" +
        `\n 8. 디코 누구` +
        "\n - 현재 디스코드방에 접속중인 길드원 목록을 확인 할 수 있어요." +
        `\n 9. /레이드목록, /레이드일정` +
        "\n - 현재 레이드 게시판에 등록되어있는 레이드 목록을 확인 할 수 있어요" +
        `\n 10. /레이드상세 번호` +
        "\n - 해당 레이드의 참가 인원을 확인해 볼 수 있어요" +
        `\n 11. /사이트` +
        "\n - 별빛노을.com 에서 레이드 신청하세요." +
        `\n` +
        `\n 📌 주의사항` +
        `\n 너무 자주 쓰시면 카카오에서 절 쫓아낼수도 있어요. 😪`;

      return res.send({
        reply: message,
      });
    }

    return res.send("success");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.send({ status: "error", reply: "에러났어요 ㅠ" + error });
  }
});

export default MessageRouter;
