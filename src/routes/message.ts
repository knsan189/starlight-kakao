import { Router } from "express";
import pkg from "lodash";
import log4js from "log4js";

declare global {
  interface String {
    format: (...args: string[]) => string;
  }
}

const MessageRouter = Router();
const logger = log4js.getLogger("message");

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

MessageRouter.post("/", async (req, res) => {
  try {
    const { msg, sender, imageDB }: MessageRequest = req.body;

    return res.send();
  } catch (error) {
    logger.error(error);
    return res.send({ status: "error", reply: "에러났어요 ㅠ" + error });
  }
});

export default MessageRouter;
