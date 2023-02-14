// react
import React, { useEffect, useState, useRef } from "react"
import axios from 'axios';
// react-native
import {
	View, ViewStyle, StatusBar, Text, Platform, FlatList, Image, Keyboard, TextStyle, ActivityIndicator, ScrollView, RefreshControl,TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast';
// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import Modal from "react-native-modal";

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import Spinner from 'react-native-loading-spinner-overlay';
import {  } from "../../redux/startup"
import { fetchWalletBalanceAsync, withdrawFundsAsync } from "../../redux/auth";
import md5 from "react-native-md5";
// components
import { Button } from "../../components/button";

// styles
import CodeInput from 'react-native-confirmation-code-input';
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { translate } from "../../i18n";

import { Icon } from "../../components/icon";
import { TextField } from "../../components/text-field";

interface DispatchProps {
	notify: (message:string, type: string) => void
    withdrawFundsAsync: (amount: string, narration: string) => void
	fetchWalletBalanceAsync: () => void
}

interface StateProps {
	isLoading: boolean
    balance: number
    orders: Array<any>
}

interface MyFormValues {
	
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
    width: Layout.window.width,
    height: Layout.window.height,
};

const EDIT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	width: '70%',
	backgroundColor: colors.companyBlue,
    height: 50,
}

const EDIT_BUTTON_TEXT: TextStyle = {
	fontSize: 14,
	fontFamily: fonts.robotoBold,
	color: colors.white
}

const Wallet = (props: Props) => {
    const { isLoading, navigation, balance, withdrawFundsAsync, orders, fetchWalletBalanceAsync } = props
    const isDarkMode = useDarkMode()
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [transactionPin, setTransactionPin] = useState('')
    const [amountValue, setAmountValue] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [resetModal, setResetModal] = useState(false)
    const [showPinModal, setShowPinModal] = useState(false)
    const [narration, setNarration] = useState('')
    const [otp, setOtp] = useState('')
    const [realTimeBalance, setRealTimeBalance] = useState('')
    const [newPin, setNewPin] = useState('')
    const [confirmNewPin, setConfirmNewPin] = useState('')
    const [sendMoneyModal, setSendMoneyModal] = useState(false)
    const [userNameModal, setUserNameModal] = useState(false)
    const [pin, setPin] = useState('')
    const [address, setAddress] = useState('tststst')
    const [reference, setReference] = useState('');
    const [userAddress, setUserAddress] = useState('')
    var amountInput = useRef(null)
    var narrationInput = useRef(null)

    const walletFeatures = [
        {
            title: translate('wallet.walletTransactions'), 
            key: 'item3',
            action: ''
        },
        {
            title: translate('wallet.accountDetails'), 
            key: 'item0',
            action: 'transactions'
        },   {
            title: 'Send Money', 
            key: 'item1',
            action: ''
        },
        {
            title: 'Change User Name', 
            key: 'item3',
            action: ''
        },
        {
            title: 'Reset Pin', 
            key: 'item0',
            action: ''
        }
        
    ]

    useEffect(() => {
        UpdateBalance()
        // CheckForPin()
        // updateBackground()
        // getUserDetails()
        // getUserToken()
    }, [])

    const onFulfill = async code => {
        setTransactionPin(code)
        console.warn(code);
      };


    const onFulfillCode = async code => {
      
        console.warn('PPPP>L>>>',code);
      };


      
      const UpdateBalance=async()=>{
       
        try {
          setLoading(true)
          const value = await AsyncStorage.getItem('token');
          if (value !== null) {
            console.warn('userDetails yessss>>>>>>>>yess',value)
          }else(
            console.warn('nothing ooo')
          )
    
          const userInfo = await AsyncStorage.getItem('user');
    
    const next=JSON.parse(value)
    console.warn('next>>>next>>NEXT',next)
    const userModify=JSON.parse(userInfo)
    console.warn('next>>>userModifyT',userModify.id)
    
    
    console.warn(`https://cydene-admin-prod.herokuapp.com/api/dispatchers/${userModify.id}`)
            let res = await axios({
              method: 'GET',
              url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/${userModify.id}`,
    
              headers: {
                Authorization: `Bearer ${next}`,
              
              },
            });
            if (res) {
              console.warn('retrieve user info ',res)
             
              console.warn('retrieve user info more>>>',res.data.walletBalance)
              setRealTimeBalance(res.data.walletBalance)
          
              setLoading(false)
      
            }
          } catch (err) {
            setLoading(false)
            Toast.show(`${err.response.data.message}`, Toast.LONG);
            console.warn('any error ? see this>>', err);
        
     
           
          }
      
    }

    const CheckForPin=async()=>{ 
            try {
                const token = await AsyncStorage.getItem('token');
                const userToken=JSON.parse(token)
                console.warn('call >>>>>>>', userToken);
                let res = await axios({
                  method: 'GET',
                  url: `https://cydene-admin-prod.herokuapp.com/api/wallet`,
                  headers: {Authorization: `Bearer ${userToken}`},
                });
                if (res) {
                  console.warn('success',res)
                  if(res.data.hasPin==false){
                    setShowPinModal(true)
                    console.warn('you need to set transaction pin now'); 
                  }
                  setLoading(false)
                }
              } catch (err) {
                setLoading(false)
                console.warn('call err', err);
              } 
        }

        const SetPin=async()=>{ 
         if(transactionPin){
            let hex_md5v = md5.hex_md5(transactionPin)
            try {
                const payLoad={
                    pin: hex_md5v,  
                }
                console.warn('payload',payLoad)
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('user');
                const userToken=JSON.parse(token)
                const userDetails=JSON.parse(user)
                console.warn('call >>>>>>>', userDetails.wallet.id);
                let res = await axios({
                  method: 'PUT',
                  url: `https://cydene-admin-prod.herokuapp.com/api/wallet/${userDetails.wallet.id}/create-pin`,
                  data: payLoad,
                  headers: {Authorization: `Bearer ${userToken}`},
                });
                if (res) {
                  console.warn('success',res)
                 setShowPinModal(false)
                 Toast.show(`Transaction Pin set successfully`, Toast.LONG);
                  setLoading(false)
                }
              } catch (err) {
                setLoading(false)
                console.warn('call err', err);
              } 
            }else{
                Toast.show('Enter transaction pin', Toast.LONG);
            }
        }

        const SendToUser=async()=>{ 
           
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');
            const userToken=JSON.parse(token)
            const userDetails=JSON.parse(user)
            console.warn('call >>>>>>>', userDetails.wallet.address);
            if(transactionPin){
if(userDetails.wallet.address==null){
    Toast.show(`You need to create your user address`, Toast.LONG);
}else{
    setLoading(true)
               let hex_md5v = md5.hex_md5(transactionPin)
               try {
                const payLoad={
                        fromAddress:userDetails.wallet.address,
                        toAddress: address,
                        amount: Number(amount),
                        pin: hex_md5v   
                }
                   
                   console.warn('payload',payLoad)
                  
                   let res = await axios({
                     method: 'POST',
                     url: `https://cydene-admin-prod.herokuapp.com/api/wallet/peer`,
                     data: payLoad,
                     headers: {Authorization: `Bearer ${userToken}`},
                   });
                   if (res) {
                     console.warn('success',res)
                  setSendMoneyModal(false)
                    Toast.show(`Transaction Successful`, Toast.LONG);
                     setLoading(false)
                   }
                 } catch (err) {
                   setLoading(false)
                   console.warn('call err', err.response.data.message);
                   Toast.show(`${err.response.data.message}`, Toast.LONG);
                 } 
                }
               }else{
                   Toast.show('Enter transaction pin', Toast.LONG);
               }
           }


           const updateLocalStorage = async () => {
            const user = await AsyncStorage.getItem('user');
            const userDetails=JSON.parse(user)
           
        
    
            userDetails.wallet.address = userAddress;
        
            console.warn('after updating', userDetails);
            console.warn('after updating hasPin',  userDetails.wallet.address );
        
            const user2 = await AsyncStorage.setItem('user',JSON.stringify(userDetails))
        
          
            console.warn('saved', user2);
          
          };


           const SaveAddress=async()=>{ 
           
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');
            const userToken=JSON.parse(token)
            const userDetails=JSON.parse(user)
            console.warn('call >>>>>>>Addresss', userDetails.email);
            console.warn('call >>>>>>>Addresss444', userAddress);
            console.warn('call >>>>>>>token', userToken);
            if(address){

    setLoading(true)
               let hex_md5v = md5.hex_md5(transactionPin)
               try {
                const payLoad={
                       address:address
                }
                   
                   console.warn('payload',payLoad)
                  
                   let res = await axios({
                     method: 'PUT',
                     url: `https://cydene-admin-prod.herokuapp.com/api/wallet/${userDetails.email}/update-address`,
                     data: payLoad,
                     headers: {Authorization: `Bearer ${userToken}`},
                   });
                   if (res) {
                    updateLocalStorage()
                     console.warn('success',res)
                  setSendMoneyModal(false)
                    Toast.show(`Address set successfuly`, Toast.LONG);
                     setLoading(false)
                     setUserNameModal(false)
                   }
                 } catch (err) {
                   setLoading(false)
                   console.warn('call err???', err.response);
                   Toast.show(`${err.response.data.message}`, Toast.LONG);
                 } 
                
               }else{
                   Toast.show('Enter user name', Toast.LONG);
               }
           }

          

    const getUserDetails=async()=>{
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
              console.warn('userDetails',value)
              const userDetails=JSON.parse(value)
              console.warn('userDetails >>>>',userDetails.wallet.address)
            }
          } catch (e) {
            console.warn('userDetails error',e)
          }
    }

    const getUserToken=async()=>{
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
              console.warn('userToken',value)
            }
          } catch (e) {
            console.warn('userToken error',e)
          }
    }

    
const WithdralFunds=async()=>{
    let hex_md5v = md5.hex_md5(pin)
    const token = await AsyncStorage.getItem('token');
    const userToken=JSON.parse(token)

    const user = await AsyncStorage.getItem('user');
    const userdetails=JSON.parse(user);
    console.warn('userdetails',userdetails.email)
    if(amount =='' || pin=='' ){
        Toast.show('Amount and pin required', Toast.LONG);
    }else{

const payLoad={
    email:userdetails.email,
    narration:narration,
    amount: Number(amount),
    pin: hex_md5v,
 
    
}
setLoading(true)

console.warn('payload',payLoad)

    try {
        let res = await axios({
          method: 'POST',
          url: 'https://cydene-admin-prod.herokuapp.com/api/wallet/withdraw?roles=Dispatcher',
          data: payLoad,
          headers: {Authorization: `Bearer ${userToken}`},
        });
        if (res) {
            setLoading(false)
          console.warn('yes successs >>>>', res);
          Toast.show(`Withdrawal Successful`, Toast.LONG);
          setShowModal(false)
        }
      } catch (err) {
        setLoading(false)
        console.warn('call err1', err);
        console.warn('call err1', err.response);
        setShowModal(false)
        if(err.response){
            Toast.show(`${err.response.data.message}`, Toast.LONG);
        }
       
      }

    }
}

// const TestMode=()=>{
//     alert('hhh')
// }


const autoHarshPin=async()=>{
    let hex_md5v = md5.hex_md5('0111')
    console.warn('.....>>>>', hex_md5v)

const payLoad={
bankCode:hex_md5v
}
    try {
        let res = await axios({
          method: 'PUT',
          url: `https://cydene-admin-prod.herokuapp.com/api/wallet/temp-update-pin-code/${80}`,
          data: payLoad,
         
        });
        if (res) {
            setLoading(false)
          console.warn('yes successs >>>>', res);
          
        }
      } catch (err) {
        setLoading(false)
        console.warn('call err1', err);
        console.warn('call err1', err.response);
      }  

}


const SendCode=async()=>{
  setResetModal(true)
    const token = await AsyncStorage.getItem('token');
    const userToken=JSON.parse(token)

    const user = await AsyncStorage.getItem('user');
    const userdetails=JSON.parse(user);
    console.warn('userdetails',userdetails.phone)
  

const payLoad={

    name: userdetails.wallet.accountName,
    email: userdetails.email,
    phone: userdetails.phone,
   
    
    
}
setLoading(true)

console.warn('payload',payLoad)

    try {
        let res = await axios({
          method: 'POST',
          url: 'https://cydene-admin-prod.herokuapp.com/api/wallet/dispatch-send-otp',
          data: payLoad,
          headers: {Authorization: `Bearer ${userToken}`},
        });
        if (res) {
            setLoading(false)
          console.warn('yes successs >>>>', res.data.reference);
          setReference(res.data.reference);
          Toast.show(`Verification code sent already`, Toast.LONG);
       
        }
      } catch (err) {
        setLoading(false)
        console.warn('call err1', err);
        console.warn('call err1', err.response);

        if(err.response){
            Toast.show(`${err.response.data.message}`, Toast.LONG);
        }
       
      }

    
}

const ResetPin=async()=>{
    let hex_md5v = md5.hex_md5(newPin)
    if( newPin=='' || otp=='' || confirmNewPin==''){
        Toast.show(`All feilds required`, Toast.LONG);
    }else{


if(newPin !=confirmNewPin){
    Toast.show(`Pin mismatch`, Toast.LONG);
}
else{
    setResetModal(true)
      const token = await AsyncStorage.getItem('token');
      const userToken=JSON.parse(token)
  
      const user = await AsyncStorage.getItem('user');
      const userdetails=JSON.parse(user);
      console.warn('userdetails',userdetails.wallet.id)
    
  
  const payLoad={
  
    newPIN:hex_md5v,
    otpValidation: {
      otp: otp,
      reference: reference
    }
         
  }

  
  console.warn('payload',payLoad)
  
      try {
        setLoading(true)
          let res = await axios({
            method: 'PUT',
            url: `https://cydene-admin-prod.herokuapp.com/api/wallet/${userdetails.wallet.id}/reset-pin`,
            data: payLoad,
            headers: {Authorization: `Bearer ${userToken}`},
          });
          if (res) {
              setLoading(false)
            console.warn('yes successs >>>>', res);
    setResetModal(false)
            Toast.show(`Pin Reset Successful`, Toast.LONG);
         
          }
        } catch (err) {
          setLoading(false)
          console.warn('call err1', err);
          console.warn('call err1', err.response);
  
          if(err.response){
              Toast.show(`${err.response.data.message}`, Toast.LONG);
          }
         
        }
    }
    }
  }
  


    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
            update()
           
        });  
        update()
        updateBackground() 
        
    }, [isDarkMode])


    const update=async()=>{
        const user = await AsyncStorage.getItem('user');
        const userdetails=JSON.parse(user);
        console.warn('userdetails>>>>>>>',userdetails.wallet.address)
        setAddress(userdetails.wallet.address)
        // setUserAddress()

    }

    const updateBackground = () => {
        navigation.setParams({
            isDarkMode: isDarkMode
        })  
        StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyDarkGreen)
    }

    const returnWalletIcon = (name: string) => {
        if(name === translate('wallet.loadWallet')) return images.accountDetails
        if(name === translate('wallet.accountDetails')) return images.accountDetails
        if(name === translate('wallet.walletTransactions')) return images.walletLoad
        if(name === 'Send Money') return images.transactions
        if(name === 'Reset Pin') return images.transactions
        if(name === 'Change User Name') return images.tabProfileIcon
    }

    const renderItem = ({ item }: any, index: any) => {
        const { title, key, action } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    if (title === translate('wallet.walletTransactions')) {
                        setShowModal(true)
                        // loadWithCard()
                    }else if(title=== 'Send Money'){
                      console.warn('send money')  
                      setSendMoneyModal(true)
                    }else if(title=== 'Reset Pin'){
                        console.warn('Reset Pin???')  
                        SendCode()
                    }else if(title=== 'Change User Name'){
                        console.warn('Change User Name')  
                        setUserNameModal(true)
                    }


                    navigation.navigate(action)
                }}
                key={key}
                style={{
                    marginTop: 10,
                    width: '100%',
                    height: 70,
                    paddingLeft: 20,
                    backgroundColor: isDarkMode ? colors.white : colors.settingsSubView,
                    justifyContent: 'center',
                    borderRadius: 10
                }}
            >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={returnWalletIcon(title)}
                                style={{
                                    height: 20,
                                    width: 20,
                                }}
                                resizeMethod="auto"
                                resizeMode="center"
                            />

                            <Text
                                style={{
                                color: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen,
                                // fontSize: 20,
                                marginLeft: 20
                                }}
                            >
                                {title} 
                            </Text>
                        </View>

                        <TouchableOpacity>
                            <Icon
                                icon={"angleRight"}
                                style={{ 
                                    tintColor: isDarkMode ? colors.settingsSubView : colors.companyDarkGreen, 
                                    marginRight: 10
                                }}
                                containerStyle={{
                                    
                                }}
                            />
                        </TouchableOpacity>
                                

                        

                    </View>

                    <Modal 
                        isVisible={showModal}
                        onBackButtonPress={() => {
                            setShowModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        onBackdropPress={() => {
                            setShowModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        hasBackdrop={true}
                        animationIn="slideInUp"
                        animationInTiming={350}
                        coverScreen={true}
                        animationOut="slideOutDown"
                        useNativeDriver={true}
                    >

                        <View
                            style={{
                                padding: 20,
                                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                                justifyContent: 'center',
                                borderRadius: 10
                            }}  
                        >

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10
                                }}
                            >
                                {translate('wallet.enterAmount', {
                                    amountValue
                                })} 
                            </Text>

                            <TextField
                                name="amount"
                               
                                value={amount}
                                onChangeText={(fName) => {
                                    setAmount(fName.replace(/[^\d]/g, ""))
                                    setAmountValue(fName.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                keyboardType={'number-pad'}
                                placeholder={`Enter the amount to withdraw`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={amountInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />
                            {amount.length>0?
                            
                            amount>=100?null:(
                                <View style={{paddingLeft:2,marginTop:-15,marginBottom:20}}>
  <Text
  style={{
      color: 'red',
      fontFamily: fonts.robotoBold,
      marginVertical: 0
  }}
>
 You cant withdraw less than 100 naira
</Text>
</View>

                            ):null}


<TextField
                                name="Enter Pin"
                               
                                value={pin}
                                onChangeText={(pin) => {
                                    setPin(pin)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                secureTextEntry={true}
                                placeholder={`Enter Pin`}
                                maxLength={4}
                                keyboardType={'number-pad'}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={narrationInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

                            <TextField
                                name="narration"
                                keyboardType="default"
                                value={narration}
                                onChangeText={(fName) => {
                                    setNarration(fName)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                placeholder={`${translate('wallet.enterNarration')}`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={narrationInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center'
                                }}
                            >

                                {/* <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                       
                                        WithdralFunds()
                                        // withdrawFundsAsync(amount, narration)
                                        // setAmount('')
                                        // setNarration('')
                                    }}
                                    tx={`paymentOptions.proceed`}
                                    disabled={parseInt(amount) < 100 || amount.length < 1}
                                /> */}

                            </View>
<View
 style={{
 flexDirection: 'row',
   justifyContent: 'space-between',
                                    alignSelf: 'center'
                                }}
                            >

                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                       
                                        WithdralFunds()
                                        // withdrawFundsAsync(amount, narration)
                                        // setAmount('')
                                        // setNarration('')
                                    }}
                                    tx={`paymentOptions.proceedW`}
                         
                                    disabled={parseInt(amount) < 100 || amount.length < 1}
                                />

                            </View>
                            
                        </View>
                        
                    </Modal>



{/* resetPin */}

<Modal 
                        isVisible={resetModal}
                        onBackButtonPress={() => {
                            setResetModal(false)
                          
                        }}
                        onBackdropPress={() => {
                            setResetModal(false)
                          
                        }}
                        hasBackdrop={true}
                        animationIn="slideInUp"
                        animationInTiming={350}
                        coverScreen={true}
                        animationOut="slideOutDown"
                        useNativeDriver={true}
                    >

                        <View
                            style={{
                                padding: 20,
                                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                                justifyContent: 'center',
                                borderRadius: 10,
                                paddingVertical:10,
                                paddingBottom:30
                                
                            }}  
                        >

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyBlue,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10,
                                    textAlign:'center',
                                    fontSize:20
                                }}
                            >
                          Enter the verification code sent to you
                            </Text>

                       
     <View style={{marginTop:10}}> 


<TextField
                                name="narration"
                                keyboardType="numeric"
                                value={otp}
                                onChangeText={(otp) => {
                                  setOtp(otp)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"

                                placeholder={`Enter OTP`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={narrationInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

               


</View>      
        


        <TextField
                                        name="narration"
                                        keyboardType="numeric"
                                        value={newPin}
                                        maxLength={4}
                                        onChangeText={(newPin) => {
                                            setNewPin(newPin)
                                        }}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        placeholder={`New Pin`}
                                        placeholderTextColor={colors.dotColor}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        forwardedRef={narrationInput}
                                        style={{
                                            borderColor: colors.settingsSubView
                                        }}
                                        inputStyle={{
                                            color: colors.companyDarkGreen
                                        }}
                                    />


<TextField
                                        name="narration"
                                        keyboardType="numeric"
                                        value={confirmNewPin}
                                        onChangeText={(confirmNewPin) => {
                                            setConfirmNewPin(confirmNewPin)
                                        }}
                                        maxLength={4}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        placeholder={`Confirm new pin`}
                                        placeholderTextColor={colors.dotColor}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        forwardedRef={narrationInput}
                                        style={{
                                            borderColor: colors.settingsSubView
                                        }}
                                        inputStyle={{
                                            color: colors.companyDarkGreen
                                        }}
                                    />
        
                     

                       

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center',
                                    marginBottom:-20
                                }}
                            >

                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyBlue }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                        ResetPin()
                                    }}
                                    tx={`paymentOptions.submit`}
                                   
                                />



                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center',
                                    marginTop:35
                                }}
                            >

<TouchableOpacity onPress={()=>SendCode()}> 
      <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyBlue,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10,
                                    textAlign:'center'
                                }}
                            >Didn`t get a verifdication code ? Resend</Text>
                                     </TouchableOpacity>

                                

                            </View>
                       
                        </View>
                        
                    </Modal>

                    <Modal 
                        isVisible={showPinModal}
                        onBackButtonPress={() => {
                            setShowPinModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        onBackdropPress={() => {
                            setShowPinModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        hasBackdrop={true}
                        animationIn="slideInUp"
                        animationInTiming={350}
                        coverScreen={true}
                        animationOut="slideOutDown"
                        useNativeDriver={true}
                    >

                        <View
                            style={{
                                padding: 20,
                                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                                justifyContent: 'center',
                                borderRadius: 10
                            }}  
                        >

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyBlue,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10,
                                    textAlign:'center'
                                }}
                            >
                           For payment security, you need to set up your transaction pin
                            </Text>

                            <View style={{height:100,marginBottom:3}}>
                            <CodeInput
          //ref="codeInputRef2"
          secureTextEntry
          value={pin}
          keyboardType="numeric"
          //compareWithCode='AsDW2'
          activeColor={colors.companyBlue}
          inactiveColor={colors.black}
          autoFocus={false}
          codeLength={4}
          inputPosition="center"
          size={50}
          onFulfill={code => onFulfill(code)}
          codeInputStyle={{borderBottomWidth: 2.5}}
          cellBorderWidth={0}
        />

                            </View>

                       

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center'
                                }}
                            >

                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyBlue }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                        setShowPinModal(false)
                                        SetPin()
                                        setAmount('')
                                        setNarration('')
                                    }}
                                    tx={`paymentOptions.setPin`}
                                    disabled={transactionPin==''}
                                />

                            </View>
                        </View>
                        
                    </Modal>
                    {/* send money modal */}

                    <Modal 
                        isVisible={sendMoneyModal}
                        onBackButtonPress={() => {
                            setSendMoneyModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        onBackdropPress={() => {
                            setSendMoneyModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        hasBackdrop={true}
                        animationIn="slideInUp"
                        animationInTiming={350}
                        coverScreen={true}
                        animationOut="slideOutDown"
                        useNativeDriver={true}
                    >

                        <View
                            style={{
                                padding: 20,
                                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                                justifyContent: 'center',
                                borderRadius: 10
                            }}  
                        >

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10
                                }}
                            >
                             Enter amount to send to Cydene User
                            </Text>

                            <TextField
                                name="amount"
                               
                                value={amount}
                                onChangeText={(value) => {
                                   setAmount(value)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                keyboardType={'number-pad'}
                                placeholder={`Enter amount to send`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={amountInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

<Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10
                                }}
                            >
                             Enter a custom address
                            </Text>

                            <TextField
                                name="amount"
                               
                                value={address}
                                onChangeText={(handle) => {
                                   setAddress(handle)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                placeholder={`@address`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={amountInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />



<Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10
                                }}
                            >
                             Enter Transaction Pin
                            </Text>

                            <TextField
                                name="amount"
                               
                                value={transactionPin}
                                onChangeText={(pin) => {
                                    setTransactionPin(pin)
                                 
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                keyboardType={'number-pad'}
                                placeholder={`Enter Pin`}
                                maxLength={4}
                                secureTextEntry={true}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={amountInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

                          

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center'
                                }}
                            >

                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                        setShowModal(false)
                                        SendToUser()
                                      
                                    }}
                         
                                    tx={`paymentOptions.proceed`}
                                    disabled={amount=='' || address=='' || transactionPin==''}
                                />

                            </View>
                        </View>
                        
                    </Modal>

{/* send handle modal */}

<Modal 
                        isVisible={userNameModal}
                        onBackButtonPress={() => {
                            setUserNameModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        onBackdropPress={() => {
                            setUserNameModal(false)
                            setAmount('')
                            setAmountValue('')
                        }}
                        hasBackdrop={true}
                        animationIn="slideInUp"
                        animationInTiming={350}
                        coverScreen={true}
                        animationOut="slideOutDown"
                        useNativeDriver={true}
                    >

                        <View
                            style={{
                                padding: 20,
                                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                                justifyContent: 'center',
                                borderRadius: 10
                            }}  
                        >

                          
<Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoBold,
                                    marginVertical: 10
                                }}
                            >
                                {address?`Change your user name , present user name : ${address}`:`Set your user name`}
           

                            </Text>

                            <TextField
                                name="amount"
                               
                                value={address}
                                onChangeText={(handle) => {
                                   setAddress(handle)
                                }}
                                autoCapitalize="words"
                                returnKeyType="next"
                                placeholder={`@address`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={amountInput}
                                style={{
                                    borderColor: colors.settingsSubView
                                }}
                                inputStyle={{
                                    color: colors.companyDarkGreen
                                }}
                            />

                          

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center'
                                }}
                            >

                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                    onPress={() => {
                                        setShowModal(false)
                                        SaveAddress()
                                      
                                    }}
                                    tx={`paymentOptions.enter`}
                                    disabled={address==''}
                                />

                            </View>
                        </View>
                        
                    </Modal>
                    
                
            </TouchableOpacity>
        )
    }

	return (
		<ScrollView
			contentContainerStyle={[ROOT, {
				backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
            }]}

            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={() => {
                        UpdateBalance()
                        fetchWalletBalanceAsync()

                    }}
                />
            }
		>

            <Header
                leftIcon="arrowBackWhite"
                navigation={navigation}
                onLeftPress={() => navigation.navigate('dashboard')}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'wallet.headerText'}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

            <View
                style={{
                    height: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop:-50
                }}
            >
                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontSize: 20,
                    }}
                >
                    Available Balance
                </Text>

                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontSize: 30,
                        fontFamily: fonts.robotoBold
                    }}
                >
                    {translate('landing.amount', {
                        // amount: balance === 0 ? '0.00' : balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        amount: realTimeBalance && realTimeBalance > 0 ?  realTimeBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'

                    })}
                </Text>
            </View>

            <View
                style={{
                    margin: 10
                }}
            >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={walletFeatures}
                    renderItem={renderItem}
                />
            </View>

            {
                isLoading && (
                    <ActivityIndicator
                        color={colors.companyDarkGreen}
                        size="large"
                        style={{
                            marginTop: 20
                        }}
                    />
                )
            }
              <Spinner visible={loading} color={'#0054C1'} />
        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    withdrawFundsAsync: (amount: string, narration: string) => dispatch(withdrawFundsAsync(amount, narration)),
	fetchWalletBalanceAsync: () => dispatch(fetchWalletBalanceAsync())

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    balance: state.auth.user.wallet ? state.auth.user.wallet.availableBalance : 'N/A',
    orders: state.auth.orders
});

export const WalletScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Wallet);
