// react
import React, { useEffect, useState, useRef } from "react"

// react-native
// import {
// 	View, ViewStyle, StatusBar, Text, Platform, Keyboard, FlatList, ActivityIndicator, ScrollView, RefreshControl
// } from "react-native";
import {
	View, ViewStyle, StatusBar, Platform, ScrollView, ImageStyle, ImageBackground, Text, TouchableOpacity, Image,
    ActivityIndicator, TextStyle, FlatList, RefreshControl,Linking, TextInput,KeyboardAvoidingView
} from "react-native";
// third-party
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import Clipboard from '@react-native-community/clipboard'
import Modal from "react-native-modal";

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {  } from "../../redux/startup"
import { fetchBanksAsync, FetchWalletTransactionsAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { translate } from "../../i18n";

import { Icon } from "../../components/icon";
import { formatAmount } from "../../utils/formatters";
import moment from "moment";
import axios from "axios";

interface DispatchProps {
	notify: (message:string, type: string) => void
    fetchBanksAsync: () => void
    // FetchWalletTransactionsAsync: () => void
}

interface StateProps {
	isLoading: boolean
    transactions: Array<any>
}

interface MyFormValues {
	
}

interface TransactionsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & TransactionsScreenProps

const ROOT: ViewStyle = {
    width: Layout.window.width,
    height: Layout.window.height,
};

const Transactions = (props: Props) => {
    const { 
         navigation, notify, FetchWalletTransactionsAsync
    } = props
    const isDarkMode = useDarkMode()
    const [detailsToggle, setDetailsToggle] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [selectedDetails, setSelectedDetails] = useState('')
    useEffect(() => {
        updateBackground()
        getTransaction()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
            // FetchWalletTransactionsAsync()
        });  
        updateBackground() 
        
        
    }, [isDarkMode])


    const getTransaction=async()=>{
       
        try {
        //   setLoading(true)
        setIsLoading(true)
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
    console.warn('next>>>userModifyT',userModify.wallet.id)
    
    
 
            let res = await axios({
              method: 'GET',
              url: `https://cydene-admin-prod.herokuapp.com/api/wallet/${userModify.wallet.id}/transactions`,
    
              headers: {
                Authorization: `Bearer ${next}`,
              
              },
            });
            if (res) {
                setIsLoading(false)
              console.warn('retrieve user info ',res)
              setTransactions(res.data)

            }
          } catch (err) {
            setIsLoading(false)
            // setLoading(false)
            // Toast.show(`${err.response.data.message}`, Toast.LONG);
            console.warn('any error ? see this>>', err);
        
     
           
          }
      
    }

    const detailsManipulation=(value)=>{
        setSelectedDetails(value)
        console.warn('details>>>manipulation>>',value)
        setDetailsToggle(true)
    }

    const updateBackground = () => {
		StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        navigation.setParams({
            isDarkMode: isDarkMode
        })
		Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen)
	}

    const returnBkColorLight = (index: number) => {
        return index ? colors.settingsSubView : colors.companyDarkGreen
    }

    const returnTextColorLight = (index: number) => {
        return index ? colors.success : colors.error
    }

    const renderItem = ({ item, index }: any) => {
        const { transactionRef, transactionMethod, isCredit, transactionDate, settlementAmount,amount } = item
        console.tron.log(item, "GOT HERE")


        return (
            <TouchableOpacity onPress={()=> detailsManipulation(item)}>
            <View
                key={index}
                style={{
                    marginTop: 10,
                    width: '100%',
                    height: 60,
                    backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.settingsSubView,
                    justifyContent: 'center',
                    borderRadius: 10,
                    paddingHorizontal: 10
                }}
            >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            // alignItems: 'center'
                        }}
                    >

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                // fontSize: 20
                                width: '30%'
                            }}
                        >
                            {`${moment(transactionDate).format('MMMM Do YYYY')}`}
                        </Text>

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                // fontSize: 20,
                                // textAlign: 'center',s
                                width: '50%'
                            }}
                        >
                            {/* {transactionMethod} */}
                            {transactionMethod=='AgentPayment'? 'Payment via App':transactionMethod=='CreditWallet'?'Payment via transfer':transactionMethod=='WithdrawFromWallet'?'Withdraw From Wallet':transactionMethod}
                        
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                // setShowModal(true)
                                // setSeletedUssdTemplate(ussdTemplate)
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : returnTextColorLight(isCredit),
                                    // fontFamily: fonts.robotoBold,
                                    // marginBottom: 10
                                    // width: '100%',
                                    // textAlign: 'right'
                                }}
                            >
                                {translate('transactions.amount', {
                                    amount: amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                })}
                            </Text> 
                        </TouchableOpacity>

                    </View>
                
            </View>
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
                        getTransaction()
                    }}
                />
            }
		>

            <Header
                leftIcon="arrowBackWhite"
                navigation={navigation}
                onLeftPress={() => navigation.navigate('wallet')}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'transactions.headerText'}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

            {
                isLoading && (
                    <View
                        style={{
                                marginTop: Layout.window.height / 3.5
                            }}
                    >
                        <ActivityIndicator
                            size={"large"}
                            color={isDarkMode ? colors.white : colors.companyDarkGreen}
                        />
                    </View>
                )
            }

           {
               !isLoading && (
                    <View
                        style={{
                            marginTop: 20,
                            paddingHorizontal: 20,
                        }}
                    >
                        {console.warn('iiii',transactions)}
                        {
                            transactions !== undefined && transactions.length > 0 && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={transactions}
                                renderItem={renderItem}
                                contentContainerStyle={{
                                    paddingBottom: '70%'
                                }}
                            />
                            )
                        }
                    </View>
               )
           }

            {
                    transactions === undefined || transactions.length < 1 && !isLoading && (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '50%'
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('transactions.empty')} 
                            </Text>
                        </View>
                    )
                }



<Modal
          isVisible={detailsToggle}
          onBackButtonPress={() =>setDetailsToggle(false)}
          onBackdropPress={() =>setDetailsToggle(false)}
          onSwipeComplete={() =>setDetailsToggle(false)}
          style={{
            height: '100%',
            width: '100%',
            marginLeft: '-0%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>


            {/* start */}
           <View
            style={{
              backgroundColor: 'white',
              width: '90%',
     height: '90%',



            }}> 
<View style={{width:'100%'}}>
<Header
                leftIcon="arrowBackWhite"
                navigation={navigation}
                onLeftPress={() => setDetailsToggle(false)}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'transactions.headerText2'}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

</View>

<ScrollView>
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>


      <View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


      <Text style={{fontSize:15}}> Account Name : </Text>


       </View>

       <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



       <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transferAccountName?selectedDetails.transferAccountName:'':''} </Text>

       </View>

</View>
           

<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Account Email : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transferAccountNumber?selectedDetails.transferAccountNumber:'':''}</Text>

 </View>

</View>

{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Account Phone number : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transferAccountNumber?selectedDetails.transferAccountNumber:'':''}</Text>

 </View>

</View>
 {/* box closed */}


{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Amount : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



  <Text style={{fontSize:15,textAlign:'right'}}>₦ {selectedDetails?selectedDetails.amount?selectedDetails.amount:'':''}</Text>

 </View>

</View>
 {/* box closed */}

{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'40%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Reference : </Text>


 </View>

 <View style={{height:'100%',width:'60%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transactionRef?selectedDetails.transactionRef:'':''}</Text>

 </View>

</View>
 {/* box closed */}
 
 
 {/* box closed */}

{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Session Id : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.id?selectedDetails.id:'':''}</Text>

 </View>

</View>
 {/* box closed */}


{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Time : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transactionDate ? `${moment(selectedDetails.transactionDate).format('hh:mm:ss')}`:'':''}</Text>

 </View>

</View>
 {/* box closed */}

{/* box */}
<View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Date : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transactionDate ? `${moment(selectedDetails.transactionDate).format('MMMM Do YYYY')}`:'':''}</Text>

 </View>
 
</View>
 {/* box closed */}
 </ScrollView>






          </View>


          {/* finish */}
        </Modal>

        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    fetchBanksAsync: () => dispatch(fetchBanksAsync()),
    // FetchWalletTransactionsAsync: () => dispatch(FetchWalletTransactionsAsync()),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    transactions: state.auth.myWalletTransactions ? state.auth.myWalletTransactions : []
});

export const TransactionsScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Transactions);
