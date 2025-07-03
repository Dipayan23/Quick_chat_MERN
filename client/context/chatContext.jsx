import { Children, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider =({children})=>{

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const {socket,axios}=useContext(AuthContext);

    // Function to get all user for sidebar

    const getUsers =async()=>{
        try {
            const {data}=await axios.get("/api/messages/users")
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to get messages for selected user
    const getMessages = async(userID)=>{
        try {
            const {data}=await axios.get(`/api/messages/${userID}`)
            setMessages(data.messages)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to send messages to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data}=await axios.post(`api/messages/send/${selectedUser._id}`,messageData)
            
            
            setMessages((prevMessages)=>[...prevMessages,data.newMessage]);
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to subscribe to messages for selected user
    const subscribeToMessages = async ()=>{
        if(!socket)return;
        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderID===selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessages)=>[...prevMessages,newMessage])
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderID] : prevUnseenMessages[newMessage.senderID]?[newMessage.senderID]+1:1
                }))
            }
        })
    }

    // Function to unsuscribe messages
    const unsubscribeFromMessages=async()=>{
        if(socket)socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unsubscribeFromMessages()
    },[socket,selectedUser])
    
    const value={
        messages,users,selectedUser,getUsers,getMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}