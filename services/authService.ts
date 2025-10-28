import { API_URL } from '@/constant';
import axios from 'axios';
export const login = async (email: string, password: string):Promise<{token:string}> => {
    try {
        const res= await axios.post(`${API_URL}/api/auth/login`, { email, password });
        return res.data;
    } catch (error:any) {
        console.log("got error",error);
        const msg = error?.response?.data?.message || "Login Failed";
        throw new Error(msg);
    }
}

export const register = async ( email: string, password: string,name: string, avatar: String | null):Promise<{token:string}> => {
    try {
        const res= await axios.post(`${API_URL}/api/auth/register`, {  email, password,name, avatar });
        console.log(res);
        return res.data
    } catch (error:any) {
        console.log("got error",error);
        const msg = error?.response?.data?.message || "Registration Failed";
        throw new Error(msg);
    }
}