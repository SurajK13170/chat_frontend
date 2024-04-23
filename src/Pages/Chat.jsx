import { useContext } from "react";
import { ChatContext } from "../Context/chatContext";
import {Container, Stack} from "react-bootstrap"
import UserChat from "../Components/Chats/UserChat";
import { AuthContext } from "../Context/AuthContext";
import PotentialChats from "../Components/Chats/PotentialChats";
import ChatBox from "../Components/Chats/ChatBox";

const Chat = () => {
  const { user} = useContext(AuthContext)

  const { userChats,
    isUserChatsLoading,
    updateCurrentChat } = useContext(ChatContext)
  // console.log("Userchat", userChats)
  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null:(
      <Stack direction="horizontal" gap={4} className="align-items-start">
        <Stack className="message-box flex-grow-0 pe-3">
          {isUserChatsLoading && <p>Loading Chats...</p>}
          {userChats?.map((chat, index)=>{
            return (
              <div key={index} onClick={()=>updateCurrentChat(chat)}>
                <UserChat chat={chat} user={user} />
              </div>
            )
          })}
        </Stack>
      <ChatBox />
      </Stack>
    )}

    </Container>
  );
}

export default Chat;