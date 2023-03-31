// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Platform, ScrollView, ImageStyle, ImageBackground, Text, TouchableOpacity, Image,
    ActivityIndicator, TextStyle, FlatList, RefreshControl,Linking, TextInput,KeyboardAvoidingView, Alert
} from "react-native";

// third-party
import firebase, {RNFirebase} from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import codePush from 'react-native-code-push';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDarkMode } from 'react-native-dark-mode'
import MapView, {
    MapViewProps,
    Marker
} from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "@env"
import Toast from 'react-native-simple-toast';
import axios from 'axios';
// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import { updateUserLocationAsync, authCredentials, fetchMyOrdersAsync, fetchWalletAsync, updateUserProfileAsync, startTripAsync, fetchWalletBalanceAsync,
     getAllProductsAsync, getMyProductsAsync,editAProductAsync } from "../../redux/auth";

// components
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { Map } from "../../components/map"
import Modal from 'react-native-modal';
import moment from 'moment'
// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Coords } from "../../redux/device";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TextField } from "../../components/text-field";

interface DispatchProps {
    notify: (message:string, type: string) => void
    fetchWalletAsync: (accountName: string) => void
	updateUserProfileAsync: (values: authCredentials) => void
	fetchMyOrdersAsync: (type: string) => void
    startTripAsync: (id: number) => void
    updateUserLocationAsync: (values: object) => void
	fetchWalletBalanceAsync: () => void
    getAllProductsAsync: () => void
    getMyProductsAsync: () => void
    editAProductAsync: (values: any) => void

}

interface StateProps {
	isLoading: boolean
	userName: string
	walletBalance: number
    isOnline: boolean
    firstName: string
    lastName: string
    phone: string
    userDetails: any
	notificationId: string
    newOrders: Array<any>
    inProgress: Array<any>
    currentCoords: Coords
    accountNumber: string
    myProducts: Array<any>
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height,
};

const IMAGE_VIEW: ImageStyle = {
    height: Layout.window.height > 700 ? Layout.window.height / 4 : Layout.window.height / 3.5,
	width: '100%',
	justifyContent: 'center',
	position: 'relative',
};

const WALLET: ViewStyle = {
	position: 'absolute',
	flexDirection: 'row',
	paddingHorizontal: 40,
	width: '100%',
  paddingVertical:40
}
const WALLET2: ViewStyle = {
	position: 'absolute',
	flexDirection: 'row',
	paddingHorizontal: 40,
	width: '100%',
  paddingVertical:40
}

const LunchWhatsapp = () => {
    Linking.openURL('https://wa.me/+2349081111104');
  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 150 : 0;

const USER_NAME = {
	color: colors.white,
	fontFamily: fonts.robotoLight,

}

const WALLET_VIEW: ViewStyle = {
	flexDirection: 'row'
}

const WALLET_VIEW2: ViewStyle = {
	flexDirection: 'row',
  // backgroundColor:'red',

}

const WALLET_VIEW3: ViewStyle = {
	flexDirection: 'row',
  // backgroundColor:'blue',

}

const WALET_BACKGROUND: ViewStyle = {
	marginHorizontal: 20,
	backgroundColor: colors.white,
	height: '70%',
	borderRadius: 10,
	opacity: 0.2,
	padding: 20,
}

const ACCOUNT_BALANCE = {
	color: colors.white,
	fontFamily: fonts.robotoLight,
	marginTop: 20,
	fontSize: 20,
}

const ACCOUNT_BALANCE2 = {
	color: colors.white,
	fontFamily: fonts.robotoLight,
	marginTop: 10,
	fontSize: 15,
}

const ACCOUNT_BALANCE3 = {
	color: colors.white,
	fontFamily: fonts.robotoLight,
	marginTop: 10,
	fontSize: 15,
}

const WALLET_BALANCE = {
	color: colors.white,
	fontFamily: fonts.robotoBold,
	marginTop: 10,
	marginLeft: Layout.window.width / 25,
	fontSize: 15,
}

const QUICK_LINKS_VIEW: ViewStyle = {
	flexDirection: 'row',
	paddingHorizontal: 20,
	paddingVertical: 10,
	justifyContent: 'space-between',
	alignItems: 'center',
}

const QUICK_LINK: ViewStyle = {
	width: Layout.window.width / 2.4,
	height: Layout.window.height / 7,
	backgroundColor: colors.white,
	shadowColor: colors.companyDarkGreen,
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.1,
	elevation: 2,
	borderRadius: 10,
	padding: 20,
	justifyContent: 'space-between',
}

const ICON_LINK: ImageStyle = {
	// width: 80,
	// height: 80
}

const QUICK_LINK_TEXT = {
	color: colors.companyDarkGreen,
	fontFamily: fonts.gilroyLight,
	marginTop: 10
}

const STATUS_TEXT = {
	color: colors.companyDarkGreen,
	fontFamily: fonts.gilroyLight,
	fontSize: 15
}

const EDIT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	// width: '30%',
	backgroundColor: colors.companyBlue,
    height: 30,
}

const EDIT_BUTTON_TEXT: TextStyle = {
	// fontSize: 14,
	fontFamily: fonts.robotoBold,
	color: colors.white
}


const BUTTON_FACEBOOK_DARK: ViewStyle = {
	width: Layout.window.width / 1.1,
	height: 50,
	backgroundColor: colors.white,
	borderWidth: 2,
	borderColor: '#fff',
	borderRadius: 8,
	marginVertical: 10,
    alignSelf: 'center'
}

const BUTTON_TEXT: TextStyle = {
	fontSize: 17,
	fontFamily: fonts.robotoBold,
    color: 'white'
}

const BUTTON_TEXT2: TextStyle = {
	fontSize: 17,
	fontFamily: fonts.robotoBold,
    color: colors.companyDarkGreen
}

const BUTTON_TEXT_GOOGLE: TextStyle = {
	...BUTTON_TEXT,
}

const BUTTON_GOOGLE: ViewStyle = {
	...BUTTON_FACEBOOK_DARK,
	backgroundColor: colors.companyDarkGreen

}


const sliceAddress=(value)=>{
let  address= `${value}`;
if (value.length > 30) {
 value = `${value.slice(0, 30)}...`;
 return(
    value
 )
}
}
const Dashboard = (props: Props) => {
	const { fetchMyOrdersAsync, navigation, isLoading, fetchWalletAsync,
        notificationId, userDetails, firstName, lastName, phone, userName, walletBalance, isOnline, updateUserProfileAsync, newOrders,
        startTripAsync, inProgress, currentCoords, updateUserLocationAsync, accountNumber, fetchWalletBalanceAsync, getAllProductsAsync,
        getMyProductsAsync, myProducts
    } = props
    const [loading, setLoading] = useState(false)
    const [onMapReady, setMapReady] = useState(false)
    const [modal, setModal] = useState(false)
    const [updatePriceModal, setUpdatePriceModal] = useState(false)
    const [productAmount, setProductAmount] = useState('')
    const [gasAmount, setGasAmount] = useState('')
    const [dieselAmount, setDieselAmount] = useState('')
    const [people, setPeople] = useState(0)
    const [activeToggle, setActiveToggle] = useState('gas')
    const [id, setId] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [error, setError] = useState('');
    const [sucModal, setSucModal] = useState(false);
    const [validation, setValidation] = useState(false);
    const [gasValue, setGasValue] = useState(false)
    const [realTimeBalance, setRealTimeBalance] = useState('')
    const [dailyValidation, setDailyValidation] = useState('')
    const [amountNotValidated, setAmountNotValidated] = useState('')
    const [details, setDetails] = useState('')
    const [toggle, setToggle] = useState(false)
    const [code, setCode] = useState('')
	const isDarkMode = useDarkMode()
    let mapViewRef = useRef(null)

    console.log(myProducts, "<=== myProducts")
  
	useEffect(() => {
    UpdateBalance()
        setLoading(false)
        GetValidateToday()
        setShowModal(false)
        setValidation(false)
        console.warn('>>>>>getetete>>>>>>>>',userDetails)
    
        getUserNotiificationId()

        getUserDetail()
        updateBackground()
        fetchWalletAsync(accountNumber)
        fetchMyOrdersAsync('New')
        GetPeople()
        getAllProductsAsync()
        getMyProductsAsync()
       
    }, [])

      
	useEffect(() => {
    UpdateBalance()
    getUserNotiificationId()
       
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground()
        });
        updateBackground()

    }, [isDarkMode])


    const clicked=(id)=>{
       setId(id)
    setModal(true)

    }

    const clear=()=>{
      setDetails('')
      setToggle(false)
      setShowModal(false)
      setValidation(false)
    
      setErrorModal(false)
      
    }

    
    const  getAllMyProduct =async()=>{
      console.warn('i am hitting this function getAllMyProduct')
        setLoading(true)
        const token= await AsyncStorage.getItem('token');
        if (token !== null) {
          console.warn('userDetails',token)
          const userDetails=JSON.parse(token)
          console.warn('userDetails >>>>',userDetails)
        }
        try {
            const info= await AsyncStorage.getItem('user');
              console.warn('userDetails',info)
              const userInfo=JSON.parse(info)
              console.warn('userDetails >>>>333',userInfo)
              console.warn('userInfo.supplierId >>>>',userInfo.supplierId)
            let res = await axios({
              method: 'GET',
              url: `https://cydene-admin-prod.herokuapp.com/api/suppliers/${userInfo.supplierId}/products`,
              headers: {
                Authorization:`Bearer ${userDetails.token}`,
               
              },
            });
            if (res) {
              setLoading(false)
             
              console.warn('success getting >> all product',res.data)
         
if(res.data.length > 0){
    res.data.map((item,index)=>{
        if(item.productType=='Gas'){
            setGasValue(true)
            EditProduct(item ,gasAmount)
        }
        if(item.productType=='Diesel'){
            EditProduct(item,dieselAmount)
        }
     })


}else{
  console.warn('yessss',res)
  setUpdatePriceModal(false)
    // alert('You have no product created')
}
              setLoading(false)
            }
          } catch (err) {
            setUpdatePriceModal(false)
            setLoading(false)
       console.warn('getting my product',err) 
          }
      
    }



    
    const EditProduct=async(value,amount)=>{
       console.warn('ttt>>>>>',value)
       console.warn('Amount>>>>',amount)
        setLoading(true)
        const token= await AsyncStorage.getItem('token');
        if (token !== null) {
          console.warn('userDetails',token)
          const userDetails=JSON.parse(token)
          console.warn('userDetails >>>>',userDetails)
        }
        try {

            const payLoad={
                unitPrice: Number(amount)
              }
            const info= await AsyncStorage.getItem('user');
            console.warn('userDetails',info)
            const userInfo=JSON.parse(info)
            console.warn('userDetails >>>>333',userInfo)

            console.warn('payLoad>>>>',payLoad)
            console.warn('passing thing 1',userInfo.supplierId)
            console.warn('passing thing 2',value.id)
            let res = await axios({
              method: 'PUT',
              url: `https://cydene-admin-prod.herokuapp.com/api/suppliers/${userInfo.supplierId}/products/${value.id}`,
              data:payLoad,
              headers: {
                Authorization:`Bearer ${userDetails.token}`,
              },
      
            });
            if (res) {
              console.warn('success',res.data)
              if(res.data.message){
                Toast.show(`${res.data.message}`, Toast.LONG);
              }
            
              updateStatus()
              setUpdatePriceModal(false)
              setLoading(false) 
            }
          } catch (err) {
            setLoading(false)
            console.warn('call err>>>>>>>>>>>>>', err.response);
            Toast.show(`${err.response.data.message}`, Toast.LONG);
            
            
          }
      
    }


  const validate=async()=>{
  
    try {
        setLoading(true) 

        const payLoad={
            code:code
        }

        const info= await AsyncStorage.getItem('user');
        console.warn('userDetails',info)
        const userInfo=JSON.parse(info)
        console.warn('Payload>>',payLoad)
      
        console.warn('userDetails >>>>333token',userDetails.token)
        let res = await axios({
          method: 'POST',
          url: `https://cydene-admin-prod.herokuapp.com/api/agent/validate-code`,
          data:payLoad,
          headers: {
            Authorization:`Bearer ${userDetails.token}`,
          },
  
        });
        if (res) {
          console.warn('success>>>',res.data.date)

         

          console.warn('success>>> date from now',moment(res.data.date).fromNow())

          console.warn('success>>> Time>>>', moment(res.data.date, "HH:mm:ss").format("hh:mm A"))

        setToggle(true)
        setDetails(res.data)
          setLoading(false) 
          setLoading(false) 
        }
      } catch (err) {
     
        setLoading(false)
        setShowModal(false)
        console.warn('call err> validate func', err);
if(err.response){
  
  console.warn('call err>>>>>>>>>>>>>222', err.response);
  // Toast.show(`${err.response.data.message}`, Toast.LONG);
  setError(err.response.data.message)
  setErrorModal(true)
}

        
      }

 }

 const getUserNotiificationId=async()=>{
  
  try {
      setLoading(true) 

   

      const info= await AsyncStorage.getItem('user');
      console.warn('userDetails',info)
      const userInfo=JSON.parse(info)
      const notifyId= await AsyncStorage.getItem('fcmToken');
    
      console.warn('userDetails >>>>333token',userDetails.token)
      let res = await axios({
        method: 'GET',
        url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/profile`,
       
        headers: {
          Authorization:`Bearer ${userDetails.token}`,
        },

      });
      if (res) {
        console.warn('success>>>',res.data.notificationId)

        console.warn('\\ success>>>',res.data)

        if(notifyId != res.data.notificationId){
          permission()
        }

        if(res.data.notificationId==null){
          permission()
        }


        setLoading(false) 
      }
    } catch (err) {
      setLoading(false)
      setShowModal(false)
      console.warn('call err>>>>>>>>>>>>>', err);
if(err.response){
console.warn('call err>>>>>>>>>>>>>222', err.response);
Toast.show(`${err.response.data.message}`, Toast.LONG);
}

      
    }

}

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    // User has authorised
    await getToken();
  } catch (error) {
    // User has rejected permissions
    console.warn('permission rejected', error);
  }
};




const permission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    await getToken();
  } else {
    requestPermission();
  }
};

const getToken = async () => {
  try {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.warn('fcmToken:...>>>', fcmToken);
      Alert.alert(fcmToken)

      const infoSave= await AsyncStorage.setItem('fcmToken',fcmToken);
      console.warn('infoSave>>', infoSave);
    }
    updateNotiId(fcmToken);
    // console.warn('fcmToken:', fcmToken);
  } catch (e) {
    console.warn('error', e);
  }
};


const updateNotiId = async value => {
  try {
    const info= await AsyncStorage.getItem('user');
        console.warn('userDetails >>>>complete',info)
        const userInfo=JSON.parse(info)
        console.warn('userDetails >>>>complete',userInfo)
    const payLoad = {
      notificationId: value,
    };
    console.warn('payLoad-payLoad-payLoad',userInfo.id)

    let res = await axios({
      method: 'PUT',
      url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/${userInfo.id}`,
      data:payLoad,
      headers: {
        Authorization:`Bearer ${userDetails.token}`,
      },

    });
    if (res) {
      setLoading(false);
      if (res.er) {
        console.warn('error get userdb details33?>>>', res.er);
        console.warn('error get userdb details?>>>', res.er.response);
     
        setLoading(false);
      } else {
        console.warn('success>>>>> get contact>>>>>>>>', res.data);
        setLoading(false);
      }
    }
  } catch (e) {
    console.warn('erorr get contact ', e);
  }
};


 const complete=async()=>{
  console.warn('pppp>>complete')
 
    try {
      // setShowModal(true)
        const payLoad={
        code:code,
        reference:details.reference
          }
        const info= await AsyncStorage.getItem('user');
        console.warn('userDetails >>>>complete',info)
        const userInfo=JSON.parse(info)
        console.warn('userDetails >>>>333',userInfo)
        console.warn('Payload>>>>> complete validation',payLoad)
        let res = await axios({
          method: 'POST',
          url: `https://cydene-admin-prod.herokuapp.com/api/agent/complete-payment`,
          data:payLoad,
          headers: {
            Authorization:`Bearer ${userDetails.token}`,
          },
  
        });
        if (res) {
          console.warn('success>>>>> complete validation>>>>>>>>',res.data)
          setSucModal(true)
          setShowModal(false)
          setValidation(false)
          setDetails('')
          // clear();
          // Toast.show(`Successful`, Toast.LONG);
          setLoading(false) 
        }
      } catch (err) {
        setLoading(false)
        setValidation(false)
        setShowModal(false)
    
        console.warn('call err>>>>>>>>>>>>> complete validation', err.response);

        if(err){
        if( err.response){

          if( err.response.data){
            if( err.response.data.message){
              Toast.show(`${err.response.data.message}`, Toast.LONG);

              setError(response.data.message)
              setErrorModal(true)
            }
          }

        }
        }
      }

 }



    const cancelOrder=async(value)=>{
        console.warn('rrrddd ==id',id)
        setModal(false)
        setLoading(true)
        const token= await AsyncStorage.getItem('token');
        if (token !== null) {
          console.warn('userDetails',token)
          const userDetails=JSON.parse(token)
          console.warn('userDetails >>>>',userDetails)
        }

        console.warn('rrrddd ==token',userDetails.token)
        try {
     
    
            let res = await axios({
              method: 'PUT',
              url: `https://cydene-admin-prod.herokuapp.com/api/orders/${id}/cancel`,
              headers: {
                Authorization:`Bearer ${userDetails.token}`,
               
              },
            });
            if (res) {
             
              console.warn('success',res.data)
              
              setLoading(false)
              const getOrder=await fetchMyOrdersAsync('New')
             
            }
          } catch (err) {
            setLoading(false)
       
            console.warn('call err>>>>>>>>>>>>>', err.response);
            if(err.response.data.message){
                console.warn('call err', err.response.data.message);  
                Toast.show(`${err.response.data.message}`, Toast.LONG);
            }
     
     
           
          }
      
    }


    const GetValidateToday=async()=>{
       
      try {
        setLoading(true)
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          console.warn('userDetails yessss>>>>>>>>yess',value)
        }else(
          console.warn('nothing ooo')
        )
 
const payload={
date:new Date()
}
const next=JSON.parse(value)
console.warn('next>>>next>>NEXT',next)
console.warn('payLoad',payload)
const reFormat=moment(new Date()).format('YYYY-MM-DD'); 

console.warn(`https://cydene-admin-prod.herokuapp.com/api/agent/stats?date=${reFormat}`)
          let res = await axios({
            method: 'GET',
            url: `https://cydene-admin-prod.herokuapp.com/api/agent/stats?date=${reFormat}`,

            headers: {
              Authorization: `Bearer ${next}`,
            
            },
          });
          if (res) {
            console.warn('success >> details',res.data)
           
            console.warn('success >>setDailyValidation>>>',res.data.totalAmountNotValidated)
            setDailyValidation(res.data.totalAmount)
            setAmountNotValidated(res.data.totalAmountNotValidated)
            setLoading(false)
          
            console.warn(dailyValidation)
          }
        } catch (err) {
          setLoading(false)
          Toast.show(`${err.response.data.message}`, Toast.LONG);
          console.warn('any error 3333? see this>>', err.response);
      
   
         
        }
    
  }

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


    const GetPeople=async()=>{
       
            try {
          const data={
            longitude:currentCoords.longitude,
            latitude: currentCoords.latitude
          }
        console.warn('yesss',data)
                let res = await axios({
                  method: 'POST',
                  url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/total-users-within-location`,
      data:data
                 
                });
                if (res) {
                 
                  console.warn('success',res.data)
                  if(res.data){
                      setPeople(res.data)
                  }
                  setLoading(false)
                
                 
                }
              } catch (err) {
                setLoading(false)
           
                console.warn('call err>>>>>>>>>>>>>', err);
                if(err.response.data.message){
                    console.warn('call err', err.response.data.message);  
                    Toast.show(`${err.response.data.message}`, Toast.LONG);
                }
         
         
               
              }
          
        }


        const getUserDetail=async()=>{
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
              console.warn('userDetails',value)
              const userDetails=JSON.parse(value)
              console.warn('userDetaails >>>>',userDetails.wallet.address)
              if(userDetails.wallet){
                console.warn('have wallet',userDetails)
              }else{
                createWallet(userDetails)
              }
            }
        }

        const createWallet=async(userDetails)=>{

            try {
          const data={
            userId: userDetails.id,
            customerEmail:userDetails.email,
            customerName:userDetails.firstName,
            lastName:userDetails.lastName ,
            customerBvn: ""
          }
        console.warn('yesss',data)
                let res = await axios({
                  method: 'POST',
                  url: `http://cydene-admin-prod.herokuapp.com/api/wallet?roles=Dispatcher`,
      data:data
                 
                });
                if (res) {
                 
                  console.warn('success',res.data)
              
                  setLoading(false)
                
                 
                }
              } catch (err) {
                setLoading(false)
           
                console.warn('call err>>>>>>>>>>>>>', err);
                if(err.response.data.message){
                    console.warn('call err', err.response.data.message);  
                    Toast.show(`${err.response.data.message}`, Toast.LONG);
                }
         
         
               
              }
          
        }

    const updateBackground = () => {
        navigation.setParams({
            isDarkMode: isDarkMode
        })
        StatusBar.setBarStyle('light-content');
        Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyDarkGreen)
    }

    const updateProductPrice = async() =>{
       if(gasAmount!='' || dieselAmount!=''){
        getAllMyProduct()
       }else{
        alert('Enter product price')
       }
      
    }

const openToggle=()=>{
if(!isOnline==true){
    setUpdatePriceModal(true)
}else{
    updateStatus()  
}

}

    const updateStatus = () =>{
        updateUserProfileAsync({
            "firstName": userDetails.firstName,
			"lastName": userDetails.lastName,
			"phone": userDetails.phone,
			"photo": {
			  "id": userDetails.photo?userDetails.photo.id?userDetails.photo.id:'':'',
			  "url": userDetails.photo?userDetails.photo.url?userDetails.photo.url:'':''
			},
			"notificationId": notificationId,
            "isOnline": !isOnline
        })
    }

    const returnNewOrders =  ({ item }: any, index: any) => {
        console.tron.log(item)

        const { client, deliveryLocation, id } = item
        const { firstName, photo } = client

        return (
            
            <View
                style={{
                    // height: Layout.window.height / 5,
                    backgroundColor: colors.white,
                    shadowColor: colors.companyDarkGreen,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    elevation: 2,
                    borderRadius: 10,
                    padding: 10,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    marginVertical: 2,
                    marginTop:15
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Image
                            source={{ uri: photo?photo.url?`${photo.url}`:'https://res.cloudinary.com/cydene-express/image/upload/v1643835956/uploads/kkytpkeeuwoaazfzra96.png':'https://res.cloudinary.com/cydene-express/image/upload/v1643835956/uploads/kkytpkeeuwoaazfzra96.png'}}
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25
                            }}
                            resizeMethod="auto"
                        />

                        <View
                            style={{
                                marginLeft: 10,
                                marginTop: 5,
                                width: '58%',
                            
                            }}
                        >
                            <Text
                                style={{
                                  
                                    color: isDarkMode ?colors.companyDarkGreen : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {firstName}
                            </Text>

                            <Text
                                style={{
                                    // color: isDarkMode ? colors.white : returnStatusColor(status),
                                    fontFamily: fonts.robotoBold,
                                    marginTop: 3,
                                }}
                            >
                             {sliceAddress(deliveryLocation)}
                            </Text>
                        </View>
<View >
                        <Button
                            style={[EDIT_BUTTON, { backgroundColor: colors.online }]}
                            textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                            onPress={() => {
                                startTripAsync(id)
                            }}
                            loading={isLoading}
                            // disabled={isLoading}
                            tx={`dashboard.start`}
                        />
                       <TouchableOpacity style={{width:80,marginTop:20,justifyContent:'center',alignItems:'center'}} onPress={()=>clicked(item.id)}>
                         <Text style={{fontWeight:'bold'}} >Cancel</Text>
                         </TouchableOpacity>
                    </View>
                    </View>

{/* <View style={{height:'10%',width:'90%',backgroundColor:'black' , flexDirection:'row'}}>
<View style={{height:'10%',width:'70%' }}>


</View>
<View style={{height:'10%',width:'20%' }}>

<TouchableOpacity style={{height:'90%',width:'90%',backgroundColor:colors.companyBlue,justifyContent:'center',alignItems:'center'}}>
<Text style={{color:'white'}}>'Refresh</Text>
</TouchableOpacity>
</View>
</View> */}


                </View>

            </View>
        )
    }

	return (
        <ScrollView
			style={[ROOT, {
				backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
			}]}
			bounces={false}
			showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={() => {
                      // UpdateBalance()
                        // fetchMyOrdersAsync('New')
                        console.warn('>>>>>getetete>>>>>>>>',userDetails)
                        // fetchWalletBalanceAsync()
                        GetValidateToday()
                        // getUserNotiificationId()
                        // getAllProductsAsync()
                       
                        // getMyProductsAsync()
                    }}
                />
            }
		>

            <ImageBackground
                source={images.newBkDark}
                style={IMAGE_VIEW}
                resizeMethod="auto"
            >

                <View
                    style={WALET_BACKGROUND}
                />

                <View
                    style={WALLET2}
                >

                    <View>
                        <Text
                            style={USER_NAME}
                        >
                            {translate('landing.greetings', {
                                name: userName
                            })}
               
                        </Text>

                        <View
                            style={WALLET_VIEW3}
                        >
                            <Text
                                style={ACCOUNT_BALANCE2}
                            >
                                {translate('landing.available')}
                            </Text>

                            <Text
                                style={WALLET_BALANCE}
                            >

                          {translate('landing.amount', {
                                    amount: realTimeBalance ? realTimeBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'
                                })}
                            </Text>
                        </View>
                        <View
                            style={WALLET_VIEW2}
                        >
                            <Text
                                style={ACCOUNT_BALANCE3}
                            >
                              Validated Today :
                            </Text>

                            <Text
                                style={WALLET_BALANCE}
                            >

                                {translate('landing.amount', {
                                    amount: dailyValidation ? dailyValidation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'
                                })}
                  
                            </Text>
                        </View>

                        <View
                            style={WALLET_VIEW2}
                        >
                            <Text
                                style={ACCOUNT_BALANCE3}
                            >
                            Pending Validation :
                            </Text>

                            <Text
                                style={WALLET_BALANCE}
                            >

                                {translate('landing.amount', {
                                    amount: amountNotValidated ?amountNotValidated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'
                                })}
                  
                            </Text>
                        </View>
                    </View>

                </View>

            </ImageBackground>


            <View
                style={{
                    margin: 20,
                    // width: Layout.window.width / 2.4,
                    height: Layout.window.height / 10,
                    backgroundColor: colors.white,
                    shadowColor: colors.companyDarkGreen,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    elevation: 2,
                    borderRadius: 10,
                    padding: 20,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <Text
                        style={STATUS_TEXT}
                    >

                        {translate('dashboard.myStatus')}
                    </Text>

                    <Text
                        style={[STATUS_TEXT, {
                            color: isOnline ? colors.online : colors.offline,
                            fontFamily: fonts.robotoBold
                        }]}
                    >

                        {  isOnline ? translate('dashboard.online') : translate('dashboard.offline')}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>openToggle()}
                    style={{
                        flexDirection: 'row'
                    }}
                >

                    <Image
                        source={isOnline ? images.online : images.offline}
                        resizeMethod="auto"
                        resizeMode="center"
                    />

                </TouchableOpacity>
            </View>

            <View style={{height:60,width:'90%',backgroundColor:'black' , flexDirection:'row',borderRadius:10,marginLeft:'5%'}}>
<View style={{height:60,width:'70%' ,justifyContent:'center',alignItems:'center',paddingLeft:9}}>

<Text style={{color:'white',fontSize:12}}>{ userName}, you have {people} potential customers within a 3km radius of your location.</Text>
</View>
<View style={{height:60,width:'25%',justifyContent:'center',alignItems:'center',borderRadius:10,marginLeft:5 }}>

<TouchableOpacity style={{height:35,width:'100%',backgroundColor:colors.companyDarkGreen,justifyContent:'center',alignItems:'center',borderRadius:5}} onPress={()=>GetPeople()}>
<Text style={{color:'white'}}>Refresh</Text>
</TouchableOpacity>
</View>
</View>

            {
                newOrders !== undefined && newOrders.length > 0 && (
                    <View>
                        <FlatList
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            data={newOrders}
                            renderItem={returnNewOrders}
                        />
                    </View>
                )
            }




            <View>
                <View
                    style={QUICK_LINKS_VIEW}
                >

                    <TouchableOpacity
                        onPress={() => navigation.navigate('history')}
                        style={QUICK_LINK}
                    >

                        <Image
                            source={images.knowMore}
                            style={ICON_LINK}
                            resizeMethod="auto"
                        />

                        <Text
                            style={QUICK_LINK_TEXT}
                        >

                            {translate('dashboard.newOrder')}
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('oldOrders')}
                        style={QUICK_LINK}
                    >

                        <Image
                            source={images.viewTransactions}
                            style={ICON_LINK}
                            resizeMethod="auto"
                        />

                        <Text
                            style={QUICK_LINK_TEXT}
                        >
                            {translate('dashboard.previousOrder')}
                        </Text>

                    </TouchableOpacity>

                </View>

                <View
                    style={QUICK_LINKS_VIEW}
                >

                    <TouchableOpacity
                        onPress={() => navigation.navigate('wallet')}
                        style={QUICK_LINK}
                    >

                        <Image
                            source={images.walletIcon}
                            style={ICON_LINK}
                            resizeMethod="auto"
                        />

                        <Text
                            style={QUICK_LINK_TEXT}
                        >

                            {translate('dashboard.wallet')}
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('profile')}
                        style={QUICK_LINK}
                    >

                        <Image
                            source={images.tabProfileIcon}
                            style={ICON_LINK}
                            resizeMethod="auto"
                        />

                        <Text
                            style={QUICK_LINK_TEXT}
                        >
                            {translate('dashboard.settings')}
                        </Text>

                    </TouchableOpacity>

                </View>
                <View style={{height:60,width:'90%',backgroundColor:'black' , flexDirection:'row',borderRadius:10,marginLeft:'5%'}}>
<View style={{height:60,width:'50%' ,justifyContent:'center',alignItems:'center',paddingLeft:9}}>

<Text style={{color:'white',fontSize:12}}></Text>
</View>
<View style={{height:60,width:'45%',justifyContent:'center',alignItems:'center',borderRadius:10,marginLeft:5 }}>

<TouchableOpacity style={{height:35,width:'100%',backgroundColor:colors.companyDarkGreen,justifyContent:'center',alignItems:'center',borderRadius:5}}   onPress={() => setShowModal(true)}>
<Text style={{color:'white'}}>Validate Payment</Text>
</TouchableOpacity>
</View>
</View>

                <View
                    style={{
                        // flexDirection: 'row',
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                   

                    <TouchableOpacity
                        onPress={() => navigation.navigate('fullScreen')}
                        style={{
                            width: Layout.window.width/ 1.1,
	                        height: Layout.window.height / 5,
                            backgroundColor: colors.white,
                            shadowColor: colors.companyDarkGreen,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            elevation: 2,
                            borderRadius: 10,
                            justifyContent: 'space-between',
                        }}
                    >

                       <View
                            style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                            }}
                       >
                        <MapView
                            ref={mapViewRef}
                            followsUserLocation
                            provider={'google'}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                            showsUserLocation
                            showsMyLocationButton
                            initialRegion={{
                                longitude: Number(currentCoords.longitude),
                                // longitude: 3.4796523,
                                latitude: Number(currentCoords.latitude),
                                // latitude: 6.4420772,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421
                            }}
                            onUserLocationChange={(region) => {
                                // console.log(region.nativeEvent, "onUserLocationChange")
                                const locationDetails = {
                                    // "longitude": 3.4796523,
                                    "longitude": region.nativeEvent.coordinate.longitude,
                                    // "latitude": 6.4420772,
                                    "latitude": region.nativeEvent.coordinate.latitude,
                                    "estimatedDistance": "string",
                                    "estimatedTime": "string"

                                }
                                updateUserLocationAsync(locationDetails)
                            }}

                        >

                            {
                                inProgress !== undefined && inProgress.length > 0 && onMapReady && inProgress.map((order) => {
                                    console.log(order)
                                    const { deliveryCoordinates } = order

                                    const origin = {
                                        longitude: Number(currentCoords.longitude),
                                        // longitude: 3.4796523,
                                        latitude: Number(currentCoords.latitude),
                                        // latitude: 6.4420772,
                                    };

                                    const destination = {
                                        latitude: deliveryCoordinates.latitude,
                                        longitude: deliveryCoordinates.longitude
                                    };

                                    return (
                                        <MapViewDirections
                                            mode="DRIVING"
                                            strokeColor={colors.companyDarkGreen}
                                            // strokeColor="#F8A765"
                                            strokeWidth={10}
                                            // lineDashPattern={[2, 2, 2]}
                                            lineCap="round"
                                            lineJoin="round"
                                            origin={origin}
                                            destination={destination}
                                            apikey={RN_GOOGLE_MAPS_IOS_API_KEY}
                                            // onReady={this.onMapDirectionsReady}
                                            onReady={result => {
                                                mapViewRef.current.fitToCoordinates(result.coordinates, {
                                                    edgePadding: {
                                                        right: Layout.window.width / 20,
                                                        bottom: Layout.window.height / 20,
                                                        left: Layout.window.width / 20,
                                                        top: Layout.window.height / 20
                                                    }
                                                });
                                            }}
                                        />
                                    )
                                })
                            }

                            {
                                inProgress !== undefined && inProgress.length > 0 && inProgress.map((order) => {
                                    console.log(order)
                                    const { deliveryCoordinates, productType } = order

                                    const origin = {
                                        longitude: Number(currentCoords.longitude),
                                        // longitude: 3.4796523,
                                        latitude: Number(currentCoords.latitude),
                                        // latitude: 6.4420772,
                                    };

                                    const destination = {
                                        latitude: deliveryCoordinates.latitude,
                                        longitude: deliveryCoordinates.longitude
                                    };

                                    return (
                                        <Marker
                                            coordinate={{
                                                latitude: deliveryCoordinates.latitude,
                                                longitude: deliveryCoordinates.longitude,
                                            }}
                                            >
                                            <Image
                                                source={productType === "Gas" ? images.gasTank : images.oilTruck}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                }}
                                                resizeMethod="auto"
                                            />
                                        </Marker>
                                    )
                                })
                            }

                        </MapView>
                       </View>

                    </TouchableOpacity>



                </View>
            </View>

            <Button
                style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                textStyle={isDarkMode ?BUTTON_TEXT2:BUTTON_TEXT_GOOGLE}
                loading={isLoading || loading}
                disabled={isLoading || loading}
                onPress={() => {
                    navigation.navigate('manageProducts')
                }}
                tx={'dashboard.edit'}
                loadingTextX={'dashboard.edit'}
            />

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

<TouchableOpacity
                        onPress={() => LunchWhatsapp()}
                        style={{height:60,width:60,marginLeft:'75%',marginTop:'-15%',zIndex:100,justifyContent:'center',alignItems:'center'
                    }}
                    >

                        <Image
                            source={images.ttpod}
                            style={{height:'170%',width:'170%'}}
                            resizeMethod="auto"
                        />

                      

                    </TouchableOpacity>
                    <Modal style={{justifyContent:'center',alignItems:'center'}} isVisible={modal}>
      <View style={{height:'22%',width:'80%',backgroundColor:'white', paddingHorizontal:'8%',alignItems:'center', borderRadius:15}}>
<Text style={{fontWeight:'bold', fontSize:18, marginTop:10}}>Are you sure you want to</Text>
<Text style={{fontWeight:'bold', fontSize:18,}}>cancel this Order </Text>
<View style={{flexDirection:'row', width:'100%', marginTop:40, justifyContent:'space-between'}}>
<TouchableOpacity style={{justifyContent:'center',alignItems:'center', backgroundColor:'#0EAD69', height:35, width:100, borderRadius:8}} onPress={()=>cancelOrder()}>
<Text style={{fontWeight:'bold', fontSize:15, color:'white'}}>confirm</Text>
</TouchableOpacity>
<TouchableOpacity style={{justifyContent:'center',alignItems:'center', backgroundColor:'#FFE8E9', height:35, width:100, borderRadius:8}} onPress={()=>setModal(false)}>
<Text style={{fontWeight:'bold', fontSize:15, color:'#FF4C54'}}>cancel</Text>
</TouchableOpacity>

</View>
      </View>
      </Modal>

      <Modal style={{justifyContent:'center',alignItems:'center'}} isVisible={updatePriceModal}>
      <View style={{height:350,width:'100%',backgroundColor:'white',alignItems:'center', borderRadius:15}}>
      <View style={{width:'100%',alignItems:'center',marginTop:25}}>
<Text style={{color:'black',fontWeight:'bold',fontSize:20}}>Set product prices</Text>
</View>

<View style={{height:'15%',width:'90%',marginTop:20,flexDirection:'row'}}>
<TouchableOpacity style={{height:'90%',width:'50%',alignItems:'center',justifyContent:'center',borderBottomWidth:activeToggle=='gas'? 2:0,
borderBottomColor:colors.companyDarkGreen}} onPress={()=>setActiveToggle('gas')}>
<Text style={{color:'black',fontWeight:'bold',fontSize:13}}>Gas</Text>
</TouchableOpacity>
<TouchableOpacity style={{height:'90%',width:'50%',alignItems:'center',justifyContent:'center',
borderBottomWidth:activeToggle!='gas'? 2:0,borderBottomColor:colors.companyDarkGreen}} onPress={()=>setActiveToggle('diesel')}>
<Text style={{color:'black',fontWeight:'bold',fontSize:13}}>Diesel</Text>
</TouchableOpacity>
</View>

<View style={{width:'100%',marginTop:40,justifyContent:'center',alignItems:'center'}}>

    {activeToggle=='gas'?(<TextField
                        name="referredBy"
                        secureTextEntry={false}
                        value={gasAmount}
                        onChangeText={(value) => setGasAmount(value)}   
                      
                        returnKeyType="done"
                        placeholder={activeToggle=='gas'?`Enter amount per Kg`:'Enter amount per liter'}
                        placeholderTextColor={colors.companyDarkGreen}
                       keyboardType={"numeric"}
                      
                        style={{
                            borderColor: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen,
                            width:'90%'
                        }}
                    />) :(<TextField
                        name="referredBy"
                        secureTextEntry={false}
                        value={dieselAmount}
                        onChangeText={(value) =>setDieselAmount(value)}   
                      
                        returnKeyType="done"
                        placeholder={activeToggle=='gas'?`Enter amount per Kg`:'Enter amount per liter'}
                        placeholderTextColor={colors.companyDarkGreen}
                       keyboardType={"numeric"}
                      
                        style={{
                            borderColor: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen,
                            width:'90%'
                        }}
                    />)}
{/* <TextField
                        name="referredBy"
                        secureTextEntry={false}
                        // value={referredBy}
                        onChangeText={(value) =>activeToggle=='gas'?  setGasAmount(value):setDieselAmount(value)}   
                      
                        returnKeyType="done"
                        placeholder={activeToggle=='gas'?`Enter amount per Kg`:'Enter amount per liter'}
                        placeholderTextColor={colors.companyDarkGreen}
                       keyboardType={"numeric"}
                      
                        style={{
                            borderColor: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen,
                            width:'90%'
                        }}
                    /> */}
</View>

<TouchableOpacity style={{height:50,width:'90%',alignItems:'center',justifyContent:'center',
backgroundColor:colors.companyDarkGreen,marginTop:30,borderRadius:10}} onPress={()=>updateProductPrice()}>
<Text style={{color:'white',fontWeight:'bold',fontSize:13}}>Submit</Text>
</TouchableOpacity>
      </View>
      </Modal>

      <Modal
        isVisible={showModal}
        onBackButtonPress={() =>clear()}
        onSwipeComplete={() => clear()}
        onBackdropPress={() => clear()}
        style={{
          height: '100%',
          width: '100%',
          marginLeft: '-0%',

        }}>
                  <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={keyboardVerticalOffset}>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%',
            height: toggle?'62%':'40%',
            marginTop:toggle?'68%':'130%',
            paddingTop: 10,
          }}>
          <View
            style={{
              marginTop: 10,
              height: 2,
              width: '20%',
              backgroundColor: '#C4C4C4',
              alignSelf: 'center',
            }}></View>

          <View style={{ paddingHorizontal: 20 }}>
            <View style={{height:40,width:'100%',justifyContent:'center'}}>
            
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#00506A',
              
              }}>
              Payment
            </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
                borderBottomWidth: toggle?1.5:0,
                borderColor: '#C4C4C4',
                paddingBottom: 30,
              }}>
              <View
                borderColor={'#D4E5EA'}
                height={50}
                width="60%"
                borderWidth={0.8}
       
                borderRadius={5}>
           
                <TextInput
                //   height={'100%'}
                //   width={'100%'}
                //   borderBottomWidth={0}
                //   maxLength={11}
                  keyboardType={'phone-pad'}
                //   borderRadius={5}
           
                //   borderColor={'#D4E5EA'}
                  color={'black'}
                  maxLength={6}
                  placeholderTextColor={'grey'}
                  placeholder={'Enter Code'}
                  style={{height:'100%',width:'100%',borderRadius:7, borderColor:'#D4E5EA',paddingLeft:10 }}
                  onChangeText={(value)=>setCode(value)}
                />
              </View>

              <TouchableOpacity
                onPress={() => validate()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: code.length===6 ? colors.companyDarkGreen:'#EEEEEE',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 10,
                  width: '30%',
                }}
                disabled={code.length===6 ? false:true}
                >

                
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color:code.length===6 ? 'white': '#979797',
                  }}>
                  Validate
                </Text>
              </TouchableOpacity>
            </View>

            

            {toggle?(  <View>

<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  }}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: 'pink',
      }}>
        <Image source={{uri: details.pictureUrl}}
       style={{  width: 60,
        height: 60,
        borderRadius: 50}} />



{/* pictureUrl */}
      </View>
    <View style={{ paddingLeft: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
        ₦{details.amount}
      </Text>
      <Text style={{ fontSize: 14 }}>{moment(details.date).fromNow()}</Text>
    </View>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setShowModal(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF6E5',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 14,

            color: '#FFB92D',
          }}>
            {details.status}
    
        </Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, color: '#000000' }}>
       {details.customerName}
      </Text>
    </View>
  </View>
</View>

{details.status=='Completed'?null:(<TouchableOpacity
  onPress={() => setValidation(true)}
  style={{
    alignSelf: 'center',
    backgroundColor: '#00506A',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  }}>
  <Text
    style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
    Validate Payment
  </Text>
</TouchableOpacity>)}

</View>):null}
          

          </View>
        </View>


        

        <Modal
          isVisible={validation}
          onBackButtonPress={() =>clear()}
          onBackdropPress={() => clear()}
          onSwipeComplete={() => clear()}
          style={{
            height: '100%',
            width: '100%',
            marginLeft: '-0%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              width: '80%',
              paddingVertical: 35,
              alignSelf: 'center',
              paddingTop: 20,
            }}>
            <View
              style={{
                marginTop: 10,
                borderBottomWidth: 1,
                borderColor: '#C4C4C4',
                paddingBottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 18 }}>Sure You Want to Validate ?</Text>


            </View>

            <View style={{ paddingHorizontal: 30 }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  {/* <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                      backgroundColor: 'pink',
                    }}></View> */}

            <View
               style={{
               width: 60,
               height: 60,
               borderRadius: 50,
               backgroundColor: 'pink',
           }}>
        <Image source={{uri: details.pictureUrl}}
       style={{  width: 60,
        height: 60,
        borderRadius: 50}} />



{/* pictureUrl */}
      </View>


                  <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                      ₦{details.amount}
                    </Text>
                    <Text style={{ fontSize: 14 }}>{moment(details.date).fromNow()}</Text>
                    <Text style={{ fontSize: 12, color: '#000000' }}>
                      by {details.customerName}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => setValidation(false)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFE8E9',
                    paddingVertical: 10,
                    borderRadius: 10,
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#FF4C54',
                    }}>
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => complete()}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#58C06F',
                    paddingVertical: 10,
                    borderRadius: 10,
                    width: '45%',
                  }}>


{loading?( <ActivityIndicator size="large" color="#00ff00" />):( <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                    }}>
                    Validate
                  </Text>)}

                 
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        </KeyboardAvoidingView>
      </Modal>

      <Spinner visible={loading} color={'#0054C1'} />

      <Modal
          isVisible={errorModal}
          onBackButtonPress={() =>clear()}
          onBackdropPress={() => clear()}
          onSwipeComplete={() => clear()}
          style={{
            height: '100%',
            width: '100%',
            marginLeft: '-0%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              height: '40%',
              width: '70%',
              paddingVertical: 35,
              alignSelf: 'center',
              paddingTop: 20,
              alignItems:'center'
            }}>
           <View style={{height:'30%',width:'80%',marginTop:5,justifyContent:'center',alignItems:'center' }}>
           <MaterialIcons name="error" size={50} color={'red'} />
           </View>

           <View style={{marginTop:10}}>
            <Text style={{color:'gray',fontSize:20}}>Error</Text>
           </View>

           <View style={{marginTop:20}}>
            <Text>{error}</Text>
           </View>

           <View style={{marginTop:25,width:'90%',alignItems:'center'}}>
            <TouchableOpacity style={{height:'44%',width:'90%',backgroundColor:colors.companyDarkGreen,justifyContent:'center',alignItems:'center',borderRadius:7}} onPress={()=>setErrorModal(false)}>
              <Text style={{color:'white'}}>Close</Text>
            </TouchableOpacity>
           </View>
         
          </View>
        </Modal>



        <Modal
          isVisible={sucModal}
          onBackButtonPress={() =>clear()}
          onBackdropPress={() => clear()}
          onSwipeComplete={() => clear()}
          style={{
            height: '100%',
            width: '100%',
            marginLeft: '-0%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              height: '40%',
              width: '70%',
              paddingVertical: 35,
              alignSelf: 'center',
              paddingTop: 20,
              alignItems:'center'
            }}>
           <View style={{height:'30%',width:'80%',marginTop:5,justifyContent:'center',alignItems:'center' }}>
           <Ionicons name="checkmark-circle" size={50} color={'#FFB92D'} />
           </View>

           <View style={{marginTop:10}}>
            <Text style={{color:'gray',fontSize:20}}>Success</Text>
           </View>

           <View style={{marginTop:20}}>
            <Text>Validation Successful</Text>
           </View>

           <View style={{marginTop:25,width:'90%',alignItems:'center'}}>
            <TouchableOpacity style={{height:'44%',width:'90%',backgroundColor:colors.companyDarkGreen,justifyContent:'center',alignItems:'center',borderRadius:7}} onPress={()=>setSucModal(false)}>
              <Text style={{color:'white'}}>Close</Text>
            </TouchableOpacity>
           </View>
         
          </View>
        </Modal>

{/*         
        <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              height: '50%',
              width: '80%',
              paddingVertical: 35,
              alignSelf: 'center',
              paddingTop: 20,
              alignItems:'center'
            }}>
           <View style={{backgroundColor:'yellow',height:'30%',width:'80%',marginTop:25}}>

           </View>

           <View style={{marginTop:10}}>
            <Text style={{color:'gray',fontSize:20}}>Success</Text>
           </View>

           <View style={{marginTop:25}}>
            <Text>Transaction Successful</Text>
           </View>

           <View style={{marginTop:25}}>
            <TouchableOpacity style={{height:'41%',width:290,backgroundColor:'blue',justifyContent:'center',alignItems:'center',borderRadius:7}}>
              <Text style={{color:'white'}}>Close</Text>
            </TouchableOpacity>
           </View>
         
          </View> */}




        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    fetchWalletAsync: (accountNumber: string) => dispatch(fetchWalletAsync(accountNumber)),
	updateUserProfileAsync: (values: authCredentials) => dispatch(updateUserProfileAsync(values)),
	fetchMyOrdersAsync: (type: string) => dispatch(fetchMyOrdersAsync(type)),
	getAllProductsAsync: () => dispatch(getAllProductsAsync()),
    startTripAsync: (id: number) => dispatch(startTripAsync(id)),
    updateUserLocationAsync: (values: object) => dispatch(updateUserLocationAsync(values)),
	fetchWalletBalanceAsync: () => dispatch(fetchWalletBalanceAsync()),
    getMyProductsAsync: () => dispatch(getMyProductsAsync()),

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	userName: `${state.auth.user.firstName} ${state.auth.user.lastName}`,
    walletBalance: state.auth.user.wallet ? state.auth.user.wallet.availableBalance : 'N/A',
    isOnline: state.auth.user.isOnline,
    firstName: state.auth.user.firstName || '',
    lastName: state.auth.user.lastName || '',
    phone: state.auth.user.phone || '',
    userDetails: state.auth.user,
	notificationId: state.auth.notificationId,
    newOrders: state.auth.newOrder,
    inProgress: state.auth.inProgress,
    currentCoords: state.device.location.coords,
    accountNumber: state.auth.user.payoutNumber,
    myProducts: state.auth.myProducts
});
// let codePushOptions = {
//     checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//     installMode: codePush.InstallMode.ON_NEXT_RESTART,
//   };
  
export const DashboardScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);
