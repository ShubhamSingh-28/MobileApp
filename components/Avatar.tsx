import { colors, radius } from '@/constant/theme'
import { getAvatarPath } from '@/services/imageSevice'
import { AvatarProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Avatar = ({uri,size=40,style,isGroup=false}:AvatarProps) => {
  return (
    <View style={[styles.avatar,{width:verticalScale(size),height:verticalScale(size)},style]}>
      <Image style={{flex:1}} source={getAvatarPath(uri,isGroup)} contentFit='cover'transition={100}/>
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    alignSelf:'center',
    backgroundColor:colors.neutral200,
    width:verticalScale(47),
    height:verticalScale(47),
    borderRadius:radius.full,
    borderWidth:1,
    borderColor:colors.neutral100,
    overflow:'hidden',
  }
})