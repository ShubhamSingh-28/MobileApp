import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constant/theme'
import { useAuth } from '@/contexts/authContext'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import * as Icons from 'phosphor-react-native';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MessageItem from '@/components/MessageItem'
import Input from '@/components/Input'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import Loading from '@/components/Loading'
import { uploadFileToCloudinary } from '@/services/imageSevice'
import { newMessage } from '@/sockets/socketEvents'
import { ResponseProps } from '@/types'

const conversation = () => {
  const { user:currentUser } = useAuth();
  const { id, name, avatar, type, participants:stringifyParticipants } = useLocalSearchParams()
  //console.log('data', data)
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);
const [selectedFile, setselectedFile] = useState<{uri:string} | null>(null);
  const participants = JSON.parse(stringifyParticipants as string);
  let conversationAvatar=avatar
  let isDirectMessage = type=='direct';
  const otherParticipants = isDirectMessage? participants.find((p: any) => p._id != currentUser?.id): null ;

  if (isDirectMessage && otherParticipants) conversationAvatar = otherParticipants.avatar;

  let conversationName = isDirectMessage ? otherParticipants.name : name;

  useEffect(() => {
    newMessage(newMessageHandler);
    return () => {
      newMessage(newMessageHandler, true); // Unsubscribe from the event on cleanup
    };
  }, [])
  const newMessageHandler = (data: ResponseProps) => {
    setLoading(false);
    setMessage('');
    // Here you can update your state or perform any action when a new message is received
  }
  
  const dummyMessages=[ 
    {
      id: 'msg_10',
      content:'Hello!',
      sender: {
        id:"user_2",
        name:"Jane",
        avatar:null
      },
      isMe:false,
      createdAt :"10:42 AM"
    },
     {
      id: 'msg_9',
      content:'What happend!',
      sender: {
        id:"me",
        name:"me",
        avatar:null
      },
      isMe:true,
      createdAt :"10:41 AM"
    },
  ]
   const onPickFile= async()=>{
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:['images','videos'],
        aspect:[4,3],
        quality:0.5,
      })
      //console.log('result',result);
      
      if(!result.canceled){
        setselectedFile(result.assets[0]);
      }
    }
    const onSend= async()=>{
      if(!message.trim() && !selectedFile) return;
      if(!currentUser) return;
      setLoading(true);
      try {
        let attachment = null;
        if(selectedFile){
          const uploadResult= await uploadFileToCloudinary(selectedFile,"message-attachments");
          
          if(uploadResult.success){
            attachment = uploadResult.data;
          } else{
            setLoading(false);
            Alert.alert("Error","Could not send the image.");            
          }
        }
        
        newMessage({
          conversationId: id,
          sender: {
            id: currentUser?.id,
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          content: message.trim(),
          attachment
        })
        setMessage('');
        setselectedFile(null);
      } catch (error) {
        console.log("Error Sending message",error);
        Alert.alert("Error","Failed to send message.");
      }finally{
        setLoading(false);
      }
    }
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Header 
          style={styles.header} 
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar size={40} uri={conversationAvatar as string} isGroup={type == 'group'} />
              <Typo color={colors.white} fontWeight={"500"} size={22} >{conversationName}</Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity style={{marginBottom:verticalScale(7)}}>
              <Icons.DotsThreeOutlineVerticalIcon weight='fill' color={colors.white} />
            </TouchableOpacity>
          }
        />

        <View style={styles.content}>
          <FlatList data={dummyMessages} inverted={true} showsVerticalScrollIndicator={false} contentContainerStyle={styles.messageContent}
            renderItem={({item})=>(
            <MessageItem item={item} isDirect={isDirectMessage}/>
          )}
            keyExtractor={(item)=>item.id}
          />
          <View style={styles.footer}>
            <Input value={message} onChangeText={setMessage} containerStyle={{paddingLeft:spacingX._10,paddingRight:scale(65),borderWidth:0}} placeholder='Type message' icon={
              <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                <Icons.Plus weight='bold' size={verticalScale(22)} color={colors.black} />
                {selectedFile && selectedFile.uri && (
                  <Image source={{ uri: selectedFile.uri }} style={styles.selectedFile} />
                )}
              </TouchableOpacity>
             } 
            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity onPress={onSend} style={styles.inputIcon}>
                {loading ? (<Loading size="small" color={colors.black} />):(
                  <Icons.PaperPlaneTilt weight='fill' size={verticalScale(22)} color={colors.black} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default conversation

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    paddingTop:spacingX._15,
    paddingBottom:spacingY._10,
    paddingHorizontal:spacingY._15,
  },
  headerLeft:{
    flexDirection:'row',
    alignItems:'center',
    gap:spacingX._12,
  },
  inputRightIcon:{
    position:'absolute',
    right:scale(10),
    top:verticalScale(15),
    paddingLeft:spacingX._12,
    borderLeftWidth:1.5,
    borderLeftColor:colors.neutral300
  },
  selectedFile:{
    position:'absolute',
    height:verticalScale(38),
    width:verticalScale(38),
    borderRadius:radius.full,
    alignItems:'center',
  },
  content:{
    flex:1,
    backgroundColor:colors.white,
    borderTopLeftRadius:radius._50,
    borderTopRightRadius:radius._50,
    borderCurve:"continuous",
    overflow:'hidden',
    paddingHorizontal:spacingY._15,
  },
  inputIcon:{
    backgroundColor:colors.primary,
    borderRadius:radius.full,
    padding:8
  },
  footer:{
    paddingBottom:verticalScale(22),
    paddingTop:spacingY._7,
  },
  messageContainer:{
    flex:1
  },
  messageContent:{
    paddingBottom:spacingY._10,
    paddingTop:spacingY._20,
    gap:spacingY._12
  },
  plusIcon:{
    backgroundColor:colors.primary,
    borderRadius:radius.full,
    padding:8
  }
})