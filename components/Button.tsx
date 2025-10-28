import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { ButtonProps } from '@/types'
import { colors, radius } from '@/constant/theme'
import { verticalScale } from '@/utils/styling'
import Loading from './Loading'

const Button = ({
    style,
    children,
    onPress,
    loading=false
}:ButtonProps) => {
    if(loading){
        return (
            <View style={[styles.button, style,{backgroundColor:'transparent'}]}>
                <Loading />
            </View>
        )
    }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        {children}
    </TouchableOpacity>
  )
}

export default Button
const styles = StyleSheet.create({
    button: {
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        borderCurve:"continuous",
        alignItems: 'center',
        justifyContent: 'center',
        height:verticalScale(56)
    },
})