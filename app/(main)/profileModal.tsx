import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constant/theme'
import { useAuth } from '@/contexts/authContext'
import { uploadFileToCloudinary } from '@/services/imageSevice'
import { updateProfile } from '@/sockets/socketEvents'
import { UserDataProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const profileModal = () => {
  const { user,signOut,updateToken } = useAuth();
  const [loading,setLoading] = useState(false);
  const router= useRouter();
  const [userData,setUserData] = useState<UserDataProps>({
    name:"",
    email:"",
    avatar:null,
  });
  const onPickImage= async()=>{
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images','videos'],
      aspect:[4,3],
      quality:0.5,
    })
    console.log('result',result);
    
    if(!result.canceled){
      setUserData({...userData,avatar:result.assets[0]});
    }
  }
  useEffect(()=>{
    updateProfile(processUpdateProfile);
    return()=>(
      updateProfile(processUpdateProfile,true)
    );
  },[])

  const processUpdateProfile=(res:any)=>{
    console.log('got res',res);
    setLoading(false);
    if(res.success){
      updateToken(res.data.token);
      router.back();
    }
    else if(res?.error){
      Alert.alert("Update Profile",res.msg);
      return;
    }
  }

  useEffect(()=>{
    setUserData({
      name:user?.name||'',
      email:user?.email||'',
      avatar:user?.avatar,
    })
  },[user])

  const handleLogout = async () => {
    router.back();
    await signOut();
  }

  const onSubmit= async()=>{
    let {name,avatar} = userData;
    if(!name.trim()){
      Alert.alert("User","please enter your name");
      return;
    }
    let data={
      name,
      avatar
    }
    if(avatar && avatar?.uri){
      setLoading(true);
      const res = await uploadFileToCloudinary(avatar,'profiles');
      console.log("res",res);
      
      if(res.success){
        data.avatar= res.data;
      } else{
        Alert.alert("User",res.msg);
        setLoading(false);
        return;
      }
    }
    
    updateProfile(data)
  }

  const showLogoutAlert=()=>{
    Alert.alert("Confirm Logout","Are you sure you want to logout?",[
      {
        text:"Cancel",
        onPress:()=>{},
        style:"cancel"
      },
      {
        text:"Logout",
        onPress:()=>handleLogout(),
        style:"destructive"
      }
    ])
  }
  return (
    <ScreenWrapper isModal={true} >
      <View style={styles.container}>
        <Header title={"Update Profile"}
        leftIcon={Platform.OS=='android' && <BackButton color={colors.black} />}
        style={{marginVertical:spacingY._15}}
        />
        {/* Form Content */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Avatar uri={userData.avatar} size={170}/>
            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icons.Pencil size={verticalScale(20)} color={colors.neutral800}/>
            </TouchableOpacity>
          </View>
          <View style={{gap:spacingY._20}}>
            <View style={styles.inputContainer}>
              <Typo style={{paddingLeft:spacingX._10}}>Email</Typo>
              <Input value={userData.email}  containerStyle={{
                borderColor:colors.neutral350,
                paddingLeft:spacingX._20,
                backgroundColor:colors.neutral300
              }} editable={false} />
            </View>
            <View style={styles.inputContainer}>
              <Typo style={{paddingLeft:spacingX._10}}>Name</Typo>
              <Input value={userData.name}  containerStyle={{
                borderColor:colors.neutral350,
                paddingLeft:spacingX._20,
              }} onChangeText={(value)=>setUserData({...userData,name:value})} />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {
          !loading &&(
            <Button
            onPress={showLogoutAlert}
             style={{
          backgroundColor:colors.rose,
          height:verticalScale(56),
          width:verticalScale(56),
        }}>
          <Icons.SignOutIcon 
          size={verticalScale(30)}
          color={colors.white}
          weight='bold'
          />
        </Button>
          )
        }
        <Button style={{flex:1}} onPress={onSubmit} loading={loading}>
          <Typo color={colors.black} fontWeight={"700"}>Update</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default profileModal

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:spacingY._20,
    justifyContent:'space-between',
  },
  footer:{
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center',
    gap:scale(12),
    paddingHorizontal:spacingX._20,
    paddingTop:spacingY._15,
    borderTopWidth:1,
    borderTopColor:colors.neutral200,
    marginBottom:spacingY._10,
  },
  form:{
    gap:spacingY._30,
    marginTop:spacingY._15,
  },
  avatarContainer:{
    position:'relative',
    alignSelf:'center',
  },
  avatar:{
    alignSelf:'center',
    backgroundColor:colors.neutral300,
    width:verticalScale(135),
    height:verticalScale(135),
    borderRadius:200,
    borderWidth:1,
    borderColor:colors.neutral500,
  },
  editIcon:{
    position:'absolute',
    bottom:spacingY._5,
    right:spacingY._7,
    borderRadius:100,
    backgroundColor:colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius:10,
    elevation: 4,
    padding:spacingY._7,
  },
  inputContainer:{
    gap:spacingY._7,
  }
})