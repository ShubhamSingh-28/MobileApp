import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {jwtDecode} from "jwt-decode";
import { connectSocket, disconnectSocket } from "@/sockets/socket";

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    token: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();

    useEffect(()=>{
        loadToken();
    },[])

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem('token');
        if(storedToken){
            try {
                const decodedToken = jwtDecode<DecodedTokenProps>(storedToken);
                if(decodedToken.exp && decodedToken.exp < Date.now()/1000){
                    await AsyncStorage.removeItem('token');
                    gotoWelcomePage();
                    return;
                }
                setToken(storedToken);
                await connectSocket();
                setUser(decodedToken.user);
                gotoHomePage();
            } catch (error) {
                gotoWelcomePage();
                console.log('Failed to decode token',error);
            }
        } else{
            gotoWelcomePage();
        }
    }
    const gotoHomePage = () => {
        setTimeout(()=>{
            router.replace('/(main)/home');
        },1500)
    }
    const gotoWelcomePage = () => {
        setTimeout(()=>{
            router.replace('/(auth)/welcome');
        },1500)
    }

    const updateToken = async (token: string) => {
        if(token){
            setToken(token);
            await AsyncStorage.setItem('token', token);
            const decodedToken = jwtDecode<DecodedTokenProps>(token);
            console.log(decodedToken);
            setUser(decodedToken.user);
        }
    }
    const signIn = async (email:string, password:string) => {
        const response = await login(email, password);
        await updateToken(response.token);
        await connectSocket();
        router.replace('/(main)/home')
    }
    const signUp = async (email:string, password:string,name:string,avatar?: string | null) => {
        // Implement sign-up logic here
        const response = await register(email, password,name,avatar??null);
        console.log(response); 
        await updateToken(response.token);
        await connectSocket();
        router.replace('/(auth)/login')
    }

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('token');
        disconnectSocket();
        router.replace('/(auth)/welcome')
    }

    return(
        <AuthContext.Provider value={{ user, token, signIn, signUp, signOut, updateToken}} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =() => useContext(AuthContext);