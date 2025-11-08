import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MessageProps } from '@/types'
import { useAuth } from '@/contexts/authContext';
import { verticalScale } from '@/utils/styling';
import { colors, radius, spacingX, spacingY } from '@/constant/theme';
import Avatar from './Avatar';
import Typo from './Typo';

const MessageItem = ({item, isDirect}:{item:MessageProps, isDirect:boolean}) => {
      const { user:currentUser } = useAuth();
      const isMe = item.isMe
  return (
    <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
      {
        !isMe && !isDirect && (
            <Avatar size={30} uri={null} style={styles.messageAvatar} />
        )
      }
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
            {!isMe && !isDirect && (
                <Typo color={colors.neutral900} fontWeight={'600'}>{item.sender.name}</Typo>
            )}
            {item.content && <Typo size={15}>{item.content}</Typo>}
            <Typo color={colors.neutral600} fontWeight={'500'} size={11} style={{alignSelf:"flex-end"}}>{item.createdAt}</Typo>
        </View>
    </View>
  )
}

export default MessageItem

const styles = StyleSheet.create({
    messageContainer:{
        flexDirection:"row",
        gap:spacingX._7,
        maxWidth:"80%",
    },
    myMessage:{
        alignSelf:"flex-end",
    },
    theirMessage:{
        alignSelf:"flex-start",
    },
    messageAvatar:{
        alignSelf:'flex-end'
    },
    attachment:{
        height:verticalScale(100),
        width:verticalScale(100),
        borderRadius:radius._10
    },
    messageBubble:{
        padding:spacingX._10,
        borderRadius:radius._15,
        gap:spacingY._5
    },
    myBubble:{
        backgroundColor:colors.myBubble,
    },
    theirBubble:{
        backgroundColor:colors.otherBubble
    }
})