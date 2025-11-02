import Avatar from '@/components/Avatar';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constant/theme';
import { useAuth } from '@/contexts/authContext';
import { uploadFileToCloudinary } from '@/services/imageSevice';
import { getContacts, newConversation } from '@/sockets/socketEvents';
import { verticalScale } from '@/utils/styling';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const newConversationModel = () => {
  const {isGroup} = useLocalSearchParams();
  const isGroupMode = isGroup =='1';
  //console.log(isGroupMode);
  
  const router = useRouter();
  const [groupAvatar,setGroupAvatar]=useState<{uri:string} | null>(null);
  const [groupName,setGroupName]=useState('');
  const [selectedParticipants,setSelectedParticipants]=useState<String[]>([]);
  const {user: currentUser} = useAuth();
  const [isLoading,setIsLoading]=useState(false);
  const [contacts,setContacts]=useState([]);

  useEffect(()=>{
    // Fetch contacts from your API or data source
    getContacts(processGetContacts);
    newConversation(processNewConversations);
    getContacts(null)
    return ()=>{
      getContacts(processGetContacts,true);
      newConversation(processNewConversations,true);
    }
  },[])

  const processGetContacts= (res:any)=>{
    if (res.success) {
      setContacts(res.data);
    }
  }
  const processNewConversations= (res:any)=>{
    console.log("new conversation res",res.data.participants);
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: '/(main)/conversation',
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        }
      })
    }else{
      Alert.alert('Error',res.msg);
    }
    
  }

  const createGroup =async()=>{
    if(!groupName.trim() || selectedParticipants.length<2){
      return;
    }
    setIsLoading(true);
    // Call your API to create the group
    try {
      let avatar = null;
      if(groupAvatar){
        const uploadResult = await uploadFileToCloudinary(groupAvatar,"group-avatars");
        if(uploadResult.success){
          avatar = uploadResult.data;
        }
      }
      newConversation({
        type:"group",
        name:groupName,
        avatar,
        participants: [currentUser?.id, ...selectedParticipants],
      });
    } catch (error:any) {
      console.log("Error",error);
      Alert.alert('Error',error.message || 'Failed to create group.');
    }finally{
      setIsLoading(false);
    }
  }

   const onPickImage= async()=>{
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:['images','videos'],
        aspect:[4,3],
        quality:0.5,
      })
      console.log('result',result);

      if(!result.canceled){
        setGroupAvatar(result.assets[0]);
      }
    }
    const toggleParticipant= (user:any)=>{
      setSelectedParticipants((prev:any)=>{
        if(prev.includes(user._id)){
          return prev.filter((id:any)=>id !== user._id);
        }
        return [...prev, user._id];
      })
    }
    const onSelectUser= (user:any)=>{
      if (!currentUser) {
        Alert.alert('Authentication', 'You must be logged in to start a conversation.');
        return;
      }
      if(isGroupMode){
        toggleParticipant(user)
      } else{
        newConversation({
          type:"direct",
          participants:[currentUser.id, user._id],
        });
      }
    }

  // const contacts=[
  //   {
  //     id:'1',
  //     name:'John Doe',
  //     avatar:'https://i.pravatar.cc/150?img=1'
  //   },
  //   {
  //     id:'2',
  //     name:'Jane Smith',
  //     avatar:'https://i.pravatar.cc/150?img=2'
  //   },
  //   {
  //     id:'3',
  //     name:'Alice Johnson',
  //     avatar:'https://i.pravatar.cc/150?img=3'
  //   },
  //   {
  //     id:'4',
  //     name:'Bob Brown',
  //     avatar:'https://i.pravatar.cc/150?img=4'
  //   }
  // ]
  return (
    <ScreenWrapper isModal={true} >
      <View style={styles.container}>
        <Header title={isGroupMode ? 'New Group' : 'Select User'} leftIcon={<BackButton color={colors.black} />} />
        {isGroupMode && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={onPickImage}>
                <Avatar uri={groupAvatar?.uri || null} size={100} isGroup={true} />
              </TouchableOpacity>
            </View>
            <View style={styles.groupNameContainer}>
              <Input placeholder='Group Name' value={groupName} onChangeText={setGroupName} />
            </View>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contactList}>
          {contacts.map((user:any ,index)=>{
            const isSelected = selectedParticipants.includes(user._id);
            return (
              <TouchableOpacity onPress={() => onSelectUser(user)} key={index} style={[ styles.contactRow, isSelected && styles.selectedContact ]}>
                <Avatar uri={user.avatar} size={45} />
              <Typo fontWeight={"500"}>{user.name}</Typo>
              {isGroupMode && (
                <View style={styles.selectionIndicator}>
                  <View style={[styles.checkbox, isSelected && styles.checked]} />
                </View>
              )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        {
          isGroupMode && selectedParticipants.length>=2 && (
            <View style={styles.createGroupButton}>
              <Button
                onPress={createGroup}
                disabled={!groupName.trim()}
                loading={isLoading}
                >
                  <Typo fontWeight={"bold"} size={17}>Create Group</Typo>
                </Button>
            </View>
          )
        }
      </View>
    </ScreenWrapper>
  )
}

export default newConversationModel

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginHorizontal: spacingX._15,
  },
  groupInfoContainer:{
    alignItems:'center',
    marginTop: spacingY._10,
  },
  avatarContainer:{
    marginBottom: spacingY._10,
  },
  groupNameContainer:{
    width:'100%',
  },
  contactRow:{
    flexDirection:'row',
    alignItems:'center',
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact:{
    backgroundColor: colors.neutral100,
    borderRadius:radius._15
  },
  contactList:{
    gap: spacingY._12,
    marginTop: spacingY._10,
    padding: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectionIndicator:{
    marginLeft:"auto",
    marginRight: spacingX._10,
  },
  checkbox:{
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked:{
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.white,
    padding: spacingX._15,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  }
})