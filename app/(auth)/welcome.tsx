import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constant/theme'
import Animated, { FadeIn } from 'react-native-reanimated'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'

export default function welcome() {
  const router = useRouter()
  return (
    <ScreenWrapper showPattern={true} >
      <View style={styles.container}>
        <View style={{alignItems:'center'}}>
          <Typo size={43} color={colors.white} fontWeight='900'>
            Bubbly
          </Typo>
      </View>
      <Animated.Image
        entering={FadeIn.duration(700).springify()}
        source={require('@/assets/images/welcome.png')}
        style={styles.welcomeImage}
        resizeMode={'contain'}
      />
      <View>
        <Typo size={33} color={colors.white} fontWeight={'800'}>
          Stay Connected
        </Typo>
        <Typo size={33} color={colors.white} fontWeight={'800'}>
          with your friends
        </Typo>
        <Typo size={33} color={colors.white} fontWeight={'800'}>
          and family
        </Typo>
      </View>
      <Button onPress={() => router.push("/(auth)/register")} style={{backgroundColor:colors.white}}>
        <Typo size={23} fontWeight={"bold"} >
          Get Started
        </Typo>
      </Button>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal:spacingX._20,
    marginVertical:spacingY._10
  },
  background:{
    flex:1,
    backgroundColor:colors.neutral900
  },
  welcomeImage:{
    height:verticalScale(300),
    aspectRatio:1,
    alignSelf:'center'
  }
})