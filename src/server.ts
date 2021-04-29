import express from "express";
import line, {
  MessageEvent,
  WebhookEvent,
  ClientConfig,
  MiddlewareConfig,
  TextEventMessage,
  Config,
} from "@line/bot-sdk";
import serverless from "serverless-http";
import { DEFAULT_MESSAGE } from "./consts/config";

const app = express();

const lineConfig: Config = {
  channelSecret: process.env.ACCESS_TOKEN,
  channelAccessToken: process.env.CHANNEL_SECRET,
};

console.log(`config: ${JSON.stringify(lineConfig)}`);

const router = express.Router();
router.get("/", (req, res) => res.send("Hello LINE BOT!(GET)"));
router.post(
  "/webhook",
  line.middleware(lineConfig as MiddlewareConfig),
  (req, res) => {
    Promise.all(req.body.events.map(eventHandler)).then((result) =>
      res.json(result)
    );
  }
);

const client = new line.Client(lineConfig as ClientConfig);

const eventHandler = (event: WebhookEvent) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return client.replyMessage(
      (event as MessageEvent).replyToken,
      DEFAULT_MESSAGE
    );
  }
  return client.replyMessage((event as MessageEvent).replyToken, {
    type: "text",
    text: ((event as MessageEvent).message as TextEventMessage).text,
  });
};

app.use("/.netlify/functions/server", router);
module.exports = app;
module.exports.handler = serverless(app);
