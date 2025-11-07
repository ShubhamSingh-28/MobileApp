import { colors, spacingX, spacingY } from '@/constant/theme'
import moment from 'moment'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Avatar from './Avatar'
import Typo from './Typo'
import { ConversationListItemProps } from '@/types'
import { useAuth } from '@/contexts/authContext'

const ConversationItem = ({item,router,showDivider}:ConversationListItemProps) => {
    const openConversation=()=>{}

    const {user:currentUser} = useAuth();
    console.log("Conversation item", item);
    
    const lastMessage:any = item.lastMessage;
    const isDirectMessage = item.type === 'direct';
    let avatar =item.avatar;
    const otherParticipant = isDirectMessage ? item.participants.find(p => p._id !== currentUser?.id) : null;

    if (isDirectMessage && otherParticipant) {
        avatar = otherParticipant?.avatar;
        //item.avatar = otherParticipant.avatar;
    }

    const getLastMessageText=()=>{
        if (!lastMessage) return "Say hi 🖐️";

        return lastMessage?.attachment ? "Image" : lastMessage.content;
    }

    const getLastMessageDate=()=>{
       if (!lastMessage?.createdAt) return null;

       const messageDate = moment(lastMessage.createdAt);

       const today = moment();

       if (messageDate.isSame(today, 'day')) {
           return messageDate.format('h:mm A');
       }
       if (messageDate.isSame(today, 'year')) {
           return messageDate.format('MMM D');
       }
       return messageDate.format('MMM D, YYYY');
    }
  return (
    <View>
      <TouchableOpacity style={styles.ConversationItem} onPress={openConversation}>
        <View>
            <Avatar uri={avatar} size={47} isGroup={item.type == 'group'} />
        </View>
        <View style={{flex:1}}>
            <View style={styles.row}>
                <Typo size={17} fontWeight={"600"}>{isDirectMessage ? otherParticipant?.name : item?.name}</Typo>
                {
                    item.lastMessage && <Typo size={15} style={{marginLeft:'auto',color:'gray'}}>{getLastMessageDate()}</Typo>  
                }
            </View>
            <Typo size={15} color={colors.neutral600} textProps={{numberOfLines:1}}>{getLastMessageText()}</Typo>
        </View>
      </TouchableOpacity>
      { showDivider && <View style={styles.divider} /> }
    </View>
  )
}

export default ConversationItem

const styles = StyleSheet.create({
    ConversationItem:{
        gap:spacingX._10,
        marginVertical:spacingY._12,
        flexDirection:'row',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    divider:{
        height:1,
        width:'95%',
        alignSelf:'center',
        backgroundColor:'rgba(0,0,0,0.07)',
    }
})