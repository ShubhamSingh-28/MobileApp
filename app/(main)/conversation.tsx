import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constant/theme'
import React from 'react'
import { StyleSheet } from 'react-native'

const conversation = () => {
  return (
    <ScreenWrapper>
      <Typo color={colors.white}>conversation</Typo>
    </ScreenWrapper>
  )
}

export default conversation

const styles = StyleSheet.create({})