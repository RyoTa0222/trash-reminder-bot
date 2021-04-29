// import express from "express";
// import line, {
//   MessageEvent,
//   WebhookEvent,
//   ClientConfig,
//   MiddlewareConfig,
//   TextEventMessage,
//   Config,
// } from "@line/bot-sdk";
// import serverless from "serverless-http";
const express = require("express");
const line = require("@line/bot-sdk");
const serverless = require("serverless-http");
import { DEFAULT_MESSAGE } from "./consts/config";

const app = express();

const lineConfig = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

const router = express.Router();
router.get("/", (req, res) => res.send("Hello LINE BOT!(GET)"));
router.post("/webhook", line.middleware(lineConfig), (req, res) => {
  console.log(req.body.events);
  //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
  if (
    req.body.events[0].replyToken === "00000000000000000000000000000000" &&
    req.body.events[1].replyToken === "ffffffffffffffffffffffffffffffff"
  ) {
    res.send("Hello LINE BOT!(POST)");
    console.log("疎通確認用");
    return;
  }
  Promise.all(req.body.events.map(eventHandler)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(lineConfig);

const eventHandler = (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return client.replyMessage(event.replyToken, DEFAULT_MESSAGE);
  }
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text,
  });
};

app.use("/.netlify/functions/server", router);
module.exports = app;
module.exports.handler = serverless(app);
