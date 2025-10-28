import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";

const StackLayout = ()=>{
  return <Stack screenOptions={{headerShown:false}}>
  </Stack>;
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  )
}
