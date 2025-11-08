import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("test");
    } else if(typeof payload == "function"){
        socket.on("test", payload);
    }else{
        socket.emit("test", payload);
    }
}

export const updateProfile = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("updateProfile");
    } else if(typeof payload == "function"){
        socket.on("updateProfile", payload);
    }else{
        socket.emit("updateProfile", payload);
    }
}

export const getContacts = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("getContacts");
    } else if(typeof payload == "function"){
        socket.on("getContacts", payload);
    }else{
        socket.emit("getContacts", payload);
    }
}

export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("newConversation");
    } else if(typeof payload == "function"){
        socket.on("newConversation", payload);
    }else{
        socket.emit("newConversation", payload);
    }
}

export const getConversations = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("getConversations");
    } else if(typeof payload == "function"){
        socket.on("getConversations", payload);
    }else{
        socket.emit("getConversations", payload);
    }
}

export const newMessage = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("newMessage");
    } else if(typeof payload == "function"){
        socket.on("newMessage", payload);
    }else{
        socket.emit("newMessage", payload);
    }
}