import Button from '@/components/Button';
import ConversationItem from '@/components/ConversationItem';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constant/theme';
import { useAuth } from '@/contexts/authContext';
import { getConversations, newConversation, newMessage } from '@/sockets/socketEvents';
import { ConversationProps, ResponseProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const home = () => {
  const { user:currentUser,signOut } = useAuth();
const router= useRouter();
const [selectedTab, setSelectedTab] = useState(0);
const [loading, setLoading] = useState(false);
const [conversations, setConversations] = useState<ConversationProps[]>([]);

useEffect(()=>{
  getConversations(processConversations);
  newConversation(newConvHandler);

  newMessage(newMessageHandler);

  getConversations(null)
  return()=>{
    getConversations(processConversations,true);
    newConversation(newConvHandler,true);
    newMessage(newMessageHandler,true);
  }
},[])

const newMessageHandler=(data:ResponseProps)=>{
  if(data.success){
    let conversationId = data.data.conversationId;
    setConversations((prev)=>{
      let updated = prev.map((conv)=>{
        if(conv._id == conversationId){
          conv.lastMessage = data.data;
        }
        return conv;
      })
      return updated;
    })
  }
}
const newConvHandler=(data:ResponseProps)=>{
  console.log("got new conversation data: ",data);
  if(data.success && data.data?.isNew){
    setConversations(prev=>[data.data,...prev]);
  }
}

const processConversations=(data:ResponseProps)=>{
  //console.log("got conversations data: ",data);
  if(data.success){
    setConversations(data.data);
  }
}

  // useEffect(()=>{
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return()=>{
  //     testSocket(testSocketCallbackHandler,true);
  //   }
  // },[])

  // const testSocketCallbackHandler=(data:any)=>{
  //   console.log("got Data from testSocket event: ",data);
  // }

  // const conversations =[
  //   {
  //     name:'John Doe',
  //     type:'direct',
  //     lastMessage:{
  //       senderName:'John Doe',
  //       content:'Hey! How are you?',
  //       createdAt:"2025-01-01T14:30:00Z"
  //     },
  //   },
  //   {
  //     name:'Jane Smith',
  //     type:'direct',
  //     lastMessage:{
  //       senderName:'Jane Smith',
  //       content:'Let\'s catch up later.',
  //       createdAt:"2025-01-06T14:30:00Z"
  //     },
  //   },
  //   {
  //     name:'Mike Johnson',
  //     type:'direct',
  //     lastMessage:{
  //       senderName:'Mike Johnson',
  //       content:'Did you see the game?',
  //       createdAt:"2025-01-03T14:30:00Z"
  //     },
  //   },
  //   {
  //     name:'Project Team',
  //     type:'group',
  //     lastMessage:{
  //       senderName:'Mike Johnson',
  //       content:'Did you see the game?',
  //       createdAt:"2025-01-01T14:30:00Z"
  //     },
  //   }
  // ]

  let directMessages = conversations.filter((c:ConversationProps)=>c.type=='direct').sort((a:ConversationProps,b:ConversationProps)=>{
    const dateA = a?.lastMessage?.createdAt || a.createdAt;
    const dateB = b?.lastMessage?.createdAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  let groupChats = conversations.filter((c:ConversationProps)=>c.type=='group').sort((a:ConversationProps,b:ConversationProps)=>{
    const dateA = a?.lastMessage?.createdAt || a.createdAt;
    const dateB = b?.lastMessage?.createdAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const handleLogout = async () => {
    await signOut();
  }
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex:1}}>
            <Typo 
            color={colors.neutral200} 
            size={19} 
            textProps={{numberOfLines: 1}}
            >
              Welcome back,{" "}
              <Typo size={20} color={colors.neutral200} fontWeight={'800'}>
                {currentUser?.name}
              </Typo>{" "}
              🤙
            </Typo>
          </View>
          <TouchableOpacity style={styles.settingIcon} onPress={()=>router.push('/(main)/profileModal')}>
            <Icons.GearSixIcon color={colors.white} weight='fill' size={verticalScale(22)} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical:spacingY._20}}>
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity onPress={()=>setSelectedTab(0)} style={[styles.tabStyle, selectedTab == 0 && styles.activeTabStyle]}>
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedTab(1)} style={[styles.tabStyle, selectedTab == 1 && styles.activeTabStyle]}>
                  <Typo>Group Chats</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.conversationList}>
              {
              selectedTab == 0 && directMessages.map((conversation:ConversationProps, index)=>{
                return (
                  <ConversationItem key={index} item={conversation} router={router} showDivider={directMessages.length !== index + 1} />
                )
              })
              }
              {
              selectedTab == 1 && groupChats.map((conversation:ConversationProps, index)=>{
                return (
                  <ConversationItem key={index} item={conversation} router={router} showDivider={groupChats.length !== index + 1} />
                )
              })
              }
            </View>
            {
              !loading && directMessages.length == 0 && selectedTab == 0 && (
                <Typo style={{textAlign:'center'}}>You don't have any Messages.</Typo>
              )
            }
            {
              !loading && groupChats.length == 0 && selectedTab == 1 && (
                <Typo style={{textAlign:'center'}}>You haven't joined any groups.</Typo>
              )
            }
            {
              loading && <Loading/>
            }
          </ScrollView>
        </View>
      </View>
      <Button style={styles.floatingButton} onPress={()=>router.push({pathname:'/(main)/newConversationModel',params:{isGroup:selectedTab}})}>
        <Icons.PlusIcon color={colors.black} weight='bold' size={verticalScale(24)} />
      </Button>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:spacingX._20,
    gap:spacingY._15,
    paddingTop:spacingY._15,
    paddingBottom:spacingY._20,
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  content:{
    flex:1,
    backgroundColor:colors.white,
    borderTopLeftRadius:radius._50,
    borderTopRightRadius:radius._50,
    borderCurve:'continuous',
    overflow:'hidden',
    paddingHorizontal:spacingX._10,
  },
  navBar:{
    flexDirection:'row',
    gap:spacingX._15,
    alignItems:'center',
    paddingHorizontal:spacingX._10,
  },
  tabs:{
    flexDirection:'row',
    gap:spacingX._10,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  tabStyle:{
    paddingVertical:spacingY._10,
    paddingHorizontal:spacingX._20,
    borderRadius:radius.full,
    backgroundColor:colors.neutral100,
  },
  activeTabStyle:{
    backgroundColor:colors.primaryLight
  },
  conversationList:{
    paddingVertical:spacingY._20,
  },
  settingIcon:{
    padding:spacingY._10,
    backgroundColor:colors.neutral700,
    borderRadius:radius.full,
  },
  floatingButton:{
    height:verticalScale(50),
    width:verticalScale(50),
    borderRadius:100,
    position:'absolute',
    bottom:verticalScale(30),
    right:verticalScale(30),
  }
})