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