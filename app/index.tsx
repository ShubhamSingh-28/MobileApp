import { colors } from "@/constant/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme,Text, View ,StyleSheet, StatusBar } from "react-native";
import Animated,{FadeInDown} from "react-native-reanimated";
export default function SplashScreen() {
  //const router= useRouter();
  // useEffect(()=>{
  //  setTimeout(()=>{
  //     router.replace("/(auth)/welcome");
  //   },1500);
  // },[router]);
  
const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <StatusBar  barStyle={scheme === "dark" ? "light-content" : "dark-content"} backgroundColor={scheme === "dark" ? colors.neutral900 : "#fff"}
/>
      <Animated.Image
        source={require("../assets/images/splashImage.png")}
        entering={FadeInDown.duration(700).springify()}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold' }}>
        Welcome to MyApp
      </Text>
    </View>
  );
}

const styles= StyleSheet.create({
  container :{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:colors.neutral900
  },
  logo:{
    height:"23%",
    aspectRatio:1,
  }
})
 