import { TextMessage, FlexMessage, FlexBubble } from "@line/bot-sdk";
import { DayOfWeek } from "../types/interface";

const DEFAULT_MESSAGE: TextMessage = {
  type: "text",
  text:
    "ゴミのカレンダーをご覧ください\n https://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/higashinada/mikagetsukamachi.html",
};

const CHART_MESSAGE: FlexMessage = {
  type: "flex",
  altText: "早見表",
  contents: {
    type: "bubble",
    hero: {
      type: "image",
      url: "https://github.com/RyoTa0222/trash-reminder-bot/blob/main/src/public/images/chart.png?raw=true",
      size: "full",
      aspectRatio: "5:2.4",
      backgroundColor: "#000000"
    }
  }
}

const TRASH_LIST: Record<DayOfWeek, string> = {
  月曜日: "燃えるゴミ",
  火曜日: "燃えないゴミ・カセットボンベ・スプレー缶",
  水曜日: "缶・びん・ペットボトル",
  木曜日: "燃えるゴミ",
  金曜日: "容器包装プラスチックと毎月第２・第４金曜日は紙ゴミ",
};

export { DEFAULT_MESSAGE, TRASH_LIST, CHART_MESSAGE };
