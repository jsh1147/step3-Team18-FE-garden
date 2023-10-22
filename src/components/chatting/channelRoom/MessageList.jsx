import { useQuery } from "@tanstack/react-query";
import ReceivedMessage from "./ReceivedMessage";
import { useAtomValue } from "jotai";
import {
  chattingRoomIdAtom,
  userIdAtom,
} from "../../../store/chatting/chatting";
import SentMessage from "./SentMessage";
import { getMessages } from "../../../apis/chatting/talkplus";

const MessageList = ({ channelId }) => {
  const userId = useAtomValue(userIdAtom);
  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery(["messages", channelId], () => getMessages(channelId), {
    enabled: !!channelId,
    initialData: [],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  console.log(userId);

  return (
    <div className="bg-white flex flex-col gap-2 px-4 w-full h-[36rem] overflow-y-scroll scrollbar-hide shadow-sm border-b-2">
      {messages.map((message) =>
        message.userId === userId ? (
          <SentMessage key={message.id} message={message} />
        ) : (
          <ReceivedMessage key={message.id} message={message} />
        )
      )}
    </div>
  );
};

export default MessageList;
