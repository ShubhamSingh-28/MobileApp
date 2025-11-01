import { colors } from '@/constant/theme';
import { ScreenWrapperProps } from '@/types';
import React from 'react';
import { Dimensions, ImageBackground, Platform, StatusBar, useColorScheme, View } from 'react-native';

const {height} = Dimensions.get('window');

const ScreenWrapper = ({
    style,
    children,
    showPattern=false,
    isModal=false,
    bgOpacity=1,
}: ScreenWrapperProps) => {
     let paddingTop = Platform.OS==='android' ? 40 : height * 0.06;
     let paddingBottom = 0;

     if(isModal){
        paddingTop =  Platform.OS==='android' ? 45 : height * 0.02;
        paddingBottom = height * 0.02;
     }
     const scheme = useColorScheme();
  return (
    <ImageBackground style={{
        flex:1,
        backgroundColor: isModal? colors.white :colors.neutral900,
    }}
    imageStyle={{ opacity:showPattern ? bgOpacity : 0 }}
    source={require('../assets/images/bgPattern.png')}
    >
      <View
      style={[
        {
        paddingTop,
        paddingBottom,
        flex:1,
      },
        style
      ]}>
        <StatusBar  barStyle={scheme === "dark" ? "light-content" : "dark-content"} backgroundColor={scheme === "dark" ? colors.neutral900 : "#fff"}
/>
        {children}
      </View>
    </ImageBackground>
  )
}

export default ScreenWrapper