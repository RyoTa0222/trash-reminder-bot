import express from "express";
import {
  Config,
  MiddlewareConfig,
  ClientConfig,
  WebhookEvent,
  Client,
  middleware,
} from "@line/bot-sdk";
import serverless from "serverless-http";
import { DEFAULT_MESSAGE, TRASH_LIST, CHART_MESSAGE } from "./consts/config";
import { DateTime } from "luxon";
import { DayOfWeek } from "./types/interface";
import DateJP from "./utils/date" 

const app = express();

const lineConfig: Config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello LINE BOT!(GET)")
});
router.post(
  "/webhook",
  middleware(lineConfig as MiddlewareConfig),
  (req, res) => {
    console.log(JSON.stringify(req.body));
    if (req.body.events.length === 0) {
      res.send("test");
      return;
    }
    Promise.all(req.body.events.map(eventHandler)).then((result) =>
      res.json(result)
    );
  }
);

const client = new Client(lineConfig as ClientConfig);

const eventHandler = (event: WebhookEvent) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  // 月曜日の場合
  if (event.message.text.indexOf("月曜") !== -1) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST["月曜日"],
    });
  }
  // 火曜日の場合
  if (event.message.text.indexOf("火曜") !== -1) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST["火曜日"],
    });
  }
  // 水曜日の場合
  if (event.message.text.indexOf("水曜") !== -1) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST["水曜日"],
    });
  }
  // 木曜日の場合
  if (event.message.text.indexOf("木曜") !== -1) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST["木曜日"],
    });
  }
  // 金曜日の場合
  if (event.message.text.indexOf("金曜") !== -1) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST["金曜日"],
    });
  }
  // 今日
  if (event.message.text.indexOf("今日") !== -1) {
    const todayOfWeek = DateTime.local().setZone("Asia/Tokyo").toFormat("EEEE");
    if (["土曜日", "日曜日"].includes(todayOfWeek)) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text:
          "ゴミの収集は平日のみです。\nhttps://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/higashinada/mikagetsukamachi.html",
      });
    }
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST[todayOfWeek as DayOfWeek],
    });
  }
  // 明日
  if (event.message.text.indexOf("明日") !== -1) {
    const tomorrowOfWeek = DateTime.local()
      .plus({ day: 1 })
      .setZone("Asia/Tokyo")
      .toFormat("EEEE");
    if (["土曜日", "日曜日"].includes(tomorrowOfWeek)) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text:
          "ゴミの収集は平日のみです。\nhttps://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/higashinada/mikagetsukamachi.html",
      });
    }
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: TRASH_LIST[tomorrowOfWeek as DayOfWeek],
    });
  }
  // 紙ごみ
  const result =
    event.message.text.includes("紙ごみ") ||
    event.message.text.includes("紙ゴミ") ||
    event.message.text.includes("新聞") ||
    event.message.text.includes("雑誌") ||
    event.message.text.includes("段ボール") ||
    event.message.text.includes("ダンボール");
  const date = new DateJP()
  const nextTrashDay = date.getMatchedDateAfterToday()
  let text = "毎月第2・第4金曜日、午前6時から9時の間に出してください。"
  if (nextTrashDay) {
    text += `\n次回のゴミ捨ての日は${nextTrashDay.toFormat('M月d日')}です。`
  } else {
    text += `\n今月のゴミ捨ての日はありません。来月お試しください。`
  }
  if (result) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text,
    });
  }
  // 早見表
  if (event.message.text.indexOf("早見表") !== -1) {
    return client.replyMessage(event.replyToken, CHART_MESSAGE);
  }
  return client.replyMessage(event.replyToken, DEFAULT_MESSAGE);
};

app.use("/.netlify/functions/server", router);

// export default app;
export const handler = serverless(app);
