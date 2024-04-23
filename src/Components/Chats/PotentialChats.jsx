import { useContext } from "react"
import { ChatContext } from "../../Context/chatContext"
import { AuthContext } from "../../Context/AuthContext"

const PotentialChats = () => {
    const { user } = useContext(AuthContext)
    const { potentialChats, creatchat, onlineUsers } = useContext(ChatContext)

    // console.log("potentialChat", potentialChats)

    return <>
        <div className="all-users">
            {potentialChats && potentialChats.map((u, index) => {
                return (
                    <div className="single-user" key={index} onClick={() => creatchat(user._id, u._id)}>
                        {u.name}
                        <span className={
                            onlineUsers?.some((user) => user?.userId == u?._id)
                                ? "user-online" : ""}></span>
                    </div>
                )

            })}
        </div>
    </>
}
export default PotentialChats