import { useCallback } from "react";
import { io, Socket } from "socket.io-client";

const socket: { [key: string]: Socket } = {};

const baseUrl = `${process.env.REACT_APP_SERVER_URL}`;

export const useSocket = (
  talkspace?: string
): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (talkspace) {
      socket[talkspace].disconnect();
      delete socket[talkspace];
    }
  }, [talkspace]);

  if (!talkspace) {
    return [undefined, disconnect];
  }

  if (!socket[talkspace]) {
    socket[talkspace] = io(`${baseUrl}/ws-${talkspace}`, {
      transports: ["websocket"],
    });
  }

  // socket[talkspace].emit("message", "Hello World");

  // socket[talkspace].on("onlineList", (onlineList: number[]) => {
  //   console.log(onlineList);
  // });

  // socket[talkspace].on("message", (channelMessage: IChat) => {
  //   console.log(channelMessage);
  // });

  // socket[talkspace].on("dm", (directMessage: IDM) => {
  //   console.log(directMessage);
  // });

  return [socket[talkspace], disconnect];
};
