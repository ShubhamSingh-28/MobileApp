import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constant/theme';
import Button from '@/components/Button';
import { testSocket } from '@/sockets/socketEvents';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import { useRouter } from 'expo-router';

const home = () => {
  const { user:currentUser,signOut } = useAuth();
const router= useRouter();
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

        </View>
      </View>
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