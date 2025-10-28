import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constant/theme'
import { verticalScale } from '@/utils/styling'

const Input = (props:InputProps) => {
    const [isFocused, setIsFocused] = useState(false)
  return (
    <View style={[
        styles.container,
        props.containerStyle && props.containerStyle,
        isFocused && styles.primaryBorder
        ]} >
      {props.icon && props.icon}
      <TextInput 
      style={[styles.input, props.inputStyle ]}
      placeholderTextColor={colors.neutral400}
      ref={props.inputRef && props.inputRef}
      onFocus={()=>setIsFocused(true)}
        onBlur={()=>setIsFocused(false)}
        {...props}
       />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        height:verticalScale(56),
        borderWidth:1,
        borderColor:colors.neutral200,
        borderRadius:radius.full,
        justifyContent:'center',
        borderCurve:'continuous',
        paddingHorizontal:spacingX._15,
        backgroundColor:colors.neutral100,
        gap:spacingX._10,
    },
    input:{
        flex:1,
       // paddingHorizontal:spacingX._12,
        fontSize:verticalScale(14),
        color:colors.text
    },
    primaryBorder:{
        borderColor:colors.primary
    }
})