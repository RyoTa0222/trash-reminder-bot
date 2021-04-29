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

const app = express();

const lineConfig: Config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

const router = express.Router();
router.get("/", (req, res) => res.send("Hello LINE BOT!(GET)"));
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
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text,
  });
};

app.use("/.netlify/functions/server", router);

// export default app;
export const handler = serverless(app);
