import { API_URL } from "@/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Socket,io } from "socket.io-client";


let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
    const token = await AsyncStorage.getItem("token");
    
    if(!token){
        throw new Error("No token found. User must login first");
    }
    if (!socket) {
        socket = io(API_URL,{
            auth:{token}
        })

        await new Promise((resolve)=>{
            socket?.on("connect",()=>{
                console.log("Socket connected", socket?.id);
                resolve(true);    
            })
        })
        socket.on("disconnect", () => {
            console.log("Socket disconnected:");
        });
    }
    return socket;
}

export function getSocket(): Socket | null {
    return socket;
}
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}