import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import { io } from "socket.io-client"

export const ChatContext = createContext()
export const ChatContextProvider = ({ children, user }) => {

    const [userChats, setUserChat] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChat] = useState([])

    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [ismessagesLoading, setIsmessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)

    const [sendTextMessagesError, setSendTextMessagesError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io("https://socket-backend-aarw.onrender.com")
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [user])

    //add online user

    useEffect(() => {
        if (socket === null) return
        socket.emit("addNewUser", user?._id)
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res)
        })
        return () => {
            socket.off("getOnlineUsers")
        }
    }, [socket])


    //send message
    useEffect(() => {
        if (socket === null) return
        const recipientId = currentChat?.members?.find((id) => id !== user?._id)
        socket.emit("sendMessage", { ...newMessage, recipientId })

    }, [newMessage])


    //recieve message and notification

    useEffect(() => {
        if (socket === null) return
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return
            setMessages((prev) => [...prev, res])
        })

        return () => {
            socket.off("getMessage")

        }

    }, [socket, currentChat])





    useEffect(() => {
        const getUser = async () => {
            const response = await getRequest(`${baseUrl}/users`)
            if (response.error) {
                return console.log("Error Fetching User", response)
            }
            const pChat = response.filter((u) => {
                let isChatCreated = false
                if (user?._id == u._id) return false;
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                return !isChatCreated

            })
            setPotentialChat(pChat)
        }
        getUser()
    }, [userChats])

    useEffect(() => {
        const getUserChat = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true)
                setUserChat(null)
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false)

                if (response.error) {
                    return setUserChatsError(response)
                }
                setUserChat(response)
            }
        }
        getUserChat()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            setIsmessagesLoading(true)
            setMessagesError(null)
            console.log(currentChat)
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)

            setIsmessagesLoading(false)

            if (response.error) {
                return setUserChatsError(response)
            }
            setMessages(response)
        }
        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Must type something")
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage

        }))
        if (response.error) {
            return setSendTextMessagesError(response)
        }
        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage("")



    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const creatchat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(

            `${baseUrl}/chats`,
            JSON.stringify({ firstId, secondId })
        )
        if (response.error) {
            return console.log("Error creating chat", response)
        }
        setUserChat((prev) => [...prev, response])
    }, [])




    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                creatchat,
                updateCurrentChat,
                messages,
                messagesError,
                ismessagesLoading,
                currentChat,
                sendTextMessage,
                onlineUsers,
             
            }}
        >
            {children}
            {userChatsError && userChatsError.error && (
                <p>{userChatsError.error}</p>
            )}
        </ChatContext.Provider>
    );



}