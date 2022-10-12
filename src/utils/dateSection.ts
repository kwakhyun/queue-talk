import dayjs from "dayjs";
import { IChat, IDM } from "../typings/db";

export const dateSection = (chatList: (IDM | IChat)[]) => {
  const sections: { [key: string]: (IDM | IChat)[] } = {};

  chatList?.forEach((chat) => {
    const date = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[date])) {
      sections[date].push(chat);
    } else {
      sections[date] = [chat];
    }
  });

  return sections;
};
