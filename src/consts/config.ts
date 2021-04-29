import { TextMessage } from "@line/bot-sdk";
import { DayOfWeek } from "../types/interface";

const DEFAULT_MESSAGE: TextMessage = {
  type: "text",
  text:
    "ゴミのカレンダーをご覧ください\n https://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/higashinada/mikagetsukamachi.html",
};

const TRASH_LIST: Record<DayOfWeek, string> = {
  月曜日: "燃えるゴミ",
  火曜日: "燃えないゴミ・カセットボンベ・スプレー缶",
  水曜日: "缶・びん・ペットボトル",
  木曜日: "燃えるゴミ",
  金曜日: "容器包装プラスチック",
};

export { DEFAULT_MESSAGE, TRASH_LIST };
