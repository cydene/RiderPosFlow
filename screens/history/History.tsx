// react
import React, { useEffect, useState } from "react"

// react-native
import {
	View, TouchableOpacity,  ViewStyle, StatusBar, Text, Image, FlatList,TextStyle, ScrollView, RefreshControl, Linking,Platform, PermissionsAndroid, ToastAndroid
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Geolocation from 'react-native-geolocation-service';
import { useDarkMode } from 'react-native-dark-mode'
import moment from 'moment'

import Modal from "react-native-modal";
import Spinner from 'react-native-loading-spinner-overlay';

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {  } from "../../redux/startup"
import { cancelTripAsync, completeTripAsync, fetchMyOrdersAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";



interface DispatchProps {
	notify: (message:string, type: string) => void
    fetchMyOrdersAsync: (type: string) => void
    completeTripAsync: (id: number) => void
    cancelTripAsync: (id: number) => void
}

interface StateProps {
	isLoading: boolean
    myOrders: Array<any>
    pending: Array<any>
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
	width: '30%',
	backgroundColor: colors.companyBlue,
    // height: 30,
}

const EDIT_BUTTON_TEXT: TextStyle = {
	// fontSize: 14,
	fontFamily: fonts.robotoBold,
	color: colors.white
}


const History = (props: Props) => {
    const { isLoading, navigation, fetchMyOrdersAsync, cancelTripAsync, myOrders, pending, completeTripAsync } = props
    const isDarkMode = useDarkMode()
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState([])
    const [myLoc, setMyLoc] = useState({});
    const [loading, setLoading] = useState(false)
    const [locationModal, setLocationModal] = useState(false);
    console.log(selectedOrder, "MY ORDERS!!!")

    useEffect(() => {
        updateBackground()
        getLocation()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
            // fetchMyOrdersTypeAsync('New')
            // fetchMyOrdersTypeAsync('Old')
            // fetchMyOrdersTypeAsync('Inprogress')
        });  
        updateBackground() 
        
    }, [isDarkMode])

    const updateBackground = () => {
        // fetchMyOrdersAsync('New')
        // fetchMyOrdersAsync('Old')
        // fetchMyOrdersAsync('InProgress')
		StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        navigation.setParams({
            isDarkMode: isDarkMode
        })
		Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen)
	}

    const returnRow = (text1: string, text2: string) => {
        return (
            <View
                style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
            >
                
                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontFamily: fonts.robotoLight,
                    }}
                >
                    {text1}
                </Text>

                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontFamily: fonts.robotoBold,
                        textAlign: 'right',
                        width: '60%'
                    }}
                >
                    {text2}
                </Text>

            </View>
        )
    }

    const getLocation = async (value) => {
      
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse'); // or "always"
          console.warn('status check', status);
          Geolocation.getCurrentPosition(
            async position => {
              console.warn('wokeeey');
              console.warn('position', position);
              const sort={
                Long:position.coords.longitude ,
                lat:position.coords.latitude,
              }
          setMyLoc(sort)
          if(value){
            setLoading(true)
            getDistance(sort,selectedOrder.deliveryCoordinates,value)
        }
            },
            error => console.warn('error', error.message),
            {enableHighAccuracy: false, timeout: 200000},
          );
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'Cydene needs to Access your location',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              Geolocation.getCurrentPosition(
                async position => {
                  console.warn('wokeeey');
                  console.warn('position>>>>>>>', position.coords.longitude);
                  const sort={
                    long:position.coords.longitude ,
                    lat:position.coords.latitude,
                  }
                  setMyLoc(sort)

                console.warn('state sorted >>>',sort);
if(value){
    setLoading(true)
    getDistance(sort,selectedOrder.deliveryCoordinates,value)
}
                
                // console.warn('userLocation>>',selectedOrder.deliveryCoordinates);
                },
                error => console.warn('error location', error.message),
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
              );
    
              //To Check, If Permission is granted
              console.warn('great');
            } else {
              alert('Permission Denied turn');
            }
          } catch (err) {
            console.warn('err', err);
          }
        }
      };
      const rad = function (x) {
        return (x * Math.PI) / 180;
      };

      const getDistance = function (p1, p2,check) {
        setShowCheckoutModal(false)
        try{
            setLoading(true)
        console.warn('checkkkkkkkkk', check);
        console.warn('p1>>>>>>>>>> rider', p1);
        console.warn('p2 >>>>> user', p2);
        let R = 6378.137; // Earth’s mean radius in km
        console.warn('Number(p2.lat)', Number(p2.latitude));
        console.warn('Number(p1.latitude)', Number(p1.lat));
        let dLat = rad(Number(p2.latitude) - Number(p1.lat));
    
        console.warn('>>>dLat', dLat);
        console.warn('p2.longitude>>>', p2.longitude);
        console.warn('p1.long>>>', p1.long);
        let dLong = rad(Number(p2.longitude) - Number(p1.long));
        console.warn('>>> dLong ', dLong);
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.lat)) *
            Math.cos(rad(p2.latitude)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        console.warn('aaaa', a);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        console.warn('cccc', c);
        console.warn('R', R);
        let d = R * c;
        console.warn('the get distance d', d.toFixed(2));
        setLoading(false)
        if(check=='yes'){
            
if( d < 0.7){
    //sum
    completeTripAsync(selectedOrder.id)
}else{
// alert('You cannot complete this order until you drop off at delivery location')
setLocationModal(true)

}

        }
    
        return d.toFixed(2);
    
    }catch(e){
        console.warn('PPPPP error',e)
    }
        //  returns the distance in km
      };

    const renderItem = ({ item }: any, index: any) => {
		console.tron.log(item)

		const {  
            productType, totalCost, deliveryLocation, requestTime, quantity, deliveryFee, 
            cydeneFee, merchantPrice, client, status
        } = item
        const { firstName, lastName, photo, phone } = client
		console.tron.log(client, "DATE")

        return (
			<View
                // onPress={() => navigation.navigate('orderDetails', {
                //     item
                // })}
            >
           
        

                <View
                    style={{
                        // width: Layout.window.width / 1.15,
                        // height: Layout.window.height / 8,
                        backgroundColor: colors.white,
                        shadowColor: colors.companyDarkGreen,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        elevation: 2,
                        borderRadius: 10,
                        padding: 20,
                        justifyContent: 'space-between',
                        marginHorizontal: 2,
                        marginVertical: 10,
                        // borderWidth: 0.5,
                        // borderColor: isDarkMode ? colors.white : returnStatusColor(status),
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
                                    marginTop: 5
                                }}
                            >
                                <Text
                                    style={{
                                        color: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen,
                                        fontFamily: fonts.robotoLight
                                    }}
                                >
                                    {firstName}
                                </Text>

                                <Text
                                    style={{
                                        color: isDarkMode ? colors.companyDarkGreen : returnStatusColor(status),
                                        fontFamily: fonts.robotoBold,
                                        marginTop: 3
                                    }}
                                >
                                    Current: {status}
                                </Text>
                            </View>
                        </View>

                        <Button
                            style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                            textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                            onPress={() => {
                                setSelectedOrder(item)
                                setShowCheckoutModal(true)
                            }}
                            tx={`transactions.view`}
                        />


                    </View>

                </View>


                
            </View>
		)
	};

    const returnStatusColor = (status: string) => {
        if (status === "Created") return colors.companyBlue
        if (status === "Accepted") return colors.companyDarkPurple
        if (status === "Assigned") return colors.companyDarkPurple
        if (status === "EnRoute") return colors.success
        if (status === "Completed") return colors.success
        if (status === "Canceled" || status === "Expired") return colors.error
        return colors.success
    }

    const returnEmptyOrder = (transactionName: string) => {
        return (
            <View
                style={{
                    justifyContent:'center',
                    alignItems: 'center',
                    height: '70%',
                    width: '100%'
                }}
            >
               

                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontFamily: fonts.robotoBold,
                    }}
                >
                    {translate('history.empty', {
                        transactionName
                    })}
                </Text>

                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontFamily: fonts.robotoLight,
                        marginTop: Layout.window.height / 20
                    }}
                >
                    {translate('history.showUp')}
                </Text>
            </View> 
        )
    }

	return (
		<ScrollView
			contentContainerStyle={[ROOT, {
                backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white
            }]}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={() => {
                        fetchMyOrdersAsync('InProgress')
                    }}
                />
            }
		>

            <Header
                navigation={navigation}
                onLeftPress={() => navigation.navigate('dashboard')}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'history.headerText'}
                leftIcon={"arrowBackWhite"}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                }}
            />

            {
                pending !== undefined && pending.length > 0 && (
                    <View
                        style={{
                            marginHorizontal: 20,
                            height: '100%'
                        }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={pending}
                            renderItem={renderItem}
                        />
                    </View>
                )
            }

            {pending.length < 1 && returnEmptyOrder(`${translate('transactions.headerText')}`)}

            <View
				style={{
					marginHorizontal: 20,
					marginBottom: 20,
					backgroundColor: isDarkMode ? colors.transparent : colors.white,
					borderRadius: 10,
					paddingHorizontal: 20,
					paddingTop: 10,
					// height: '75%'
				}}
			>

                <Modal 
                    isVisible={showCheckoutModal}
                    onBackButtonPress={() => {
                        setShowCheckoutModal(false)
                    }}
                    onBackdropPress={() => {
                        setShowCheckoutModal(false)
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
                            paddingTop: 10,
                            backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                            justifyContent: 'center',
                            borderRadius: 10
                        }}  
                    >
                 

                        <Button
                            onPress={() => {
                                setShowCheckoutModal(false)
                            }}
                            style={{
								justifyContent: 'flex-end',
							}}
                            tx={`transactions.track`}
                            loading={isLoading}
                            disabled={isLoading}
                        >

                            <Image
                                source={images.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                }}
                                resizeMethod="auto"
                                resizeMode="center"
                            />

                        </Button>

                        {
                            selectedOrder ? (
                                <View
                                    style={{
                                        padding: 20,
                                    }}
                                >
                                    {returnRow(`${selectedOrder.productType} ${selectedOrder.productType === 'Gas' ? '(kg)' : '(litres)'}`, `${translate('landing.amount', {
                                        amount: (selectedOrder.merchantPrice ? selectedOrder.merchantPrice : 0.00).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    })}`)}

                                    {returnRow(`${translate('transactions.deliveryFee')}`, `${translate('landing.amount', {
                                        amount: selectedOrder.deliveryFee ? selectedOrder.deliveryFee: ''.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    })}`)}

                                    {returnRow(`${translate('transactions.total')}`, `${translate('landing.amount', {
                                        amount: selectedOrder.totalCost ? selectedOrder.totalCost : ''.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    })}`)}

                                    {returnRow(`${translate('transactions.deliveryLocation')}`, `${selectedOrder.deliveryLocation}`)}

                                    {returnRow(`${translate('transactions.requestTime')}`, `${moment(selectedOrder.requestTime).format('MMMM Do YYYY hh:mm:ss')}`)}

                                </View>
                            ) : <View></View>
                        }
                        {/* <View
                            style={{
                                width: '100%',
                                backgroundColor: colors.dotColor,
                                height: 0.5,
                                marginVertical: 10
                            }}
                        /> */}

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                                padding: 20,
                            }}
                        >
                            <Button
                                style={[EDIT_BUTTON, { backgroundColor: isDarkMode ? colors.white : colors.settingsSubView, marginTop: 30, width: '45%' }]}
                                textStyle={[EDIT_BUTTON_TEXT, { color: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen }]}
                                onPress={() => {
                                    cancelTripAsync(selectedOrder.id)
                                }}
                                tx={`transactions.cancel`}
                                loading={isLoading}
                                disabled={isLoading}
                            />
                            <Button
                                style={[EDIT_BUTTON, { backgroundColor: isDarkMode ? colors.white : colors.companyDarkGreen, marginTop: 30, width: '45%' }]}
                                textStyle={[EDIT_BUTTON_TEXT, { color: isDarkMode ? colors.companyDarkGreen : colors.white }]}
                                onPress={() => {
                                    getLocation('yes')  
                                }}
                                tx={`transactions.track`}
                                loading={isLoading}
                                disabled={isLoading}
                            />
                        </View>

                        {
                            selectedOrder && selectedOrder.client ? (
                                <Button
                                    style={[EDIT_BUTTON, { backgroundColor: isDarkMode ? colors.white : colors.settingsSubView, width: 60, alignSelf: 'center', marginVertical: 30, height: 60, borderRadius: 30 }]}
                                    textStyle={[EDIT_BUTTON_TEXT, { color: isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen }]}
                                    onPress={() => {
                                        Linking.openURL(`tel:${selectedOrder.client.phone}`)
                                    }}
                                    text={`Call`}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    <Image
                                        source={images.callUser}
                                        style={{
                                            height: 25,
                                            width: 25,
                                            marginVertical: 10,
                                            alignSelf: 'center'
                                        }}
                                        resizeMethod="auto"
                                        resizeMode="center"
                                    />
                                </Button>
                            ) : <View></View>
                        }
                    </View>

                </Modal>


                <Modal 
                    isVisible={locationModal}
                    onBackButtonPress={() => {
                       setLocationModal(false)
                    }}
                    onBackdropPress={() => {
                        setLocationModal(false)
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
                         height:'40%',
                         width:'90%',
                         backgroundColor:'white',
                         marginLeft:'5%',
                         borderRadius:20
                        }}  
                    >
                 

                 <View
                        style={{
                         height:'35%',
                         width:'90%',
                
                         marginLeft:'5%',
                         justifyContent:'center', 
                         alignItems:'center'
                        }}  
                    >
                 

       

                 <Image
                           source={images.loca}
                                style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 25
                                }}
                                resizeMethod="auto"
                            />

                      
                    </View>
                    <View
                        style={{
                         height:'25%',
                         width:'90%',
                       
                         marginLeft:'5%',
                         justifyContent:'center', 
                         alignItems:'center'
                        }}  
                    >
                 
                 <Text style={{color:'black', fontWeight:'bold', fontSize:15}}>You cannot complete this order until you</Text>
                 <Text style={{color:'black', fontWeight:'bold', fontSize:15}}>drop off at delivery location</Text>
                   
<View style={{
                         justifyContent:'center', 
                         alignItems:'center',
                         marginTop:'3%',
                         marginBottom:'2%'
                        }}   >
<Text style={{color:'black', fontWeight:'bold', fontSize:15}}>Or</Text> 
</View>

                   <View   style={{
                         height:'25%',
                         width:'90%',
                       
                         marginLeft:'5%',
                         justifyContent:'center', 
                         alignItems:'center',
                         marginTop:'10%'
                        }}  >

<Text style={{color:'black', fontWeight:'bold', fontSize:15}}>If you have delivered the order</Text>
                 <Text style={{color:'black', fontWeight:'bold', fontSize:15}}>call the user to complete the orders</Text>

                   </View>

                       

                      
                    </View>

                    <View
                        style={{
                         height:'10%',
                         width:'90%',
                   
                         marginLeft:'5%',
                         justifyContent:'center', 
                         alignItems:'center'
                        }}  
                    >
                 
                 {/* <Text style={{color:'black', fontWeight:'bold', fontSize:15}}>Estimated Arrival time: 1 hour</Text> */}
                     
                   

                       

                      
                    </View>
                     

                    <View
                        style={{
                         height:'20%',
                         width:'90%',
                       
                         marginLeft:'5%',
                         justifyContent:'center', 
                         alignItems:'center',
                         marginTop:'5%'
                         
                        }}  
                    >
                 <TouchableOpacity style={{width:'45%', height:35, borderRadius:10, backgroundColor:'#00506A', justifyContent:'center', alignItems:'center'}} onPress={()=>  setLocationModal(false)}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:15}}>Cancel</Text>

                 </TouchableOpacity>

                     
                   

                       

                      
                    </View>
                   

                       

                      
                    </View>

                </Modal>
								
			</View>
            <Spinner visible={loading} color={'#0054C1'} />
        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    fetchMyOrdersAsync: (type: string) => dispatch(fetchMyOrdersAsync(type)),
    completeTripAsync: (id: number) => dispatch(completeTripAsync(id)),
    cancelTripAsync: (id: number) => dispatch(cancelTripAsync(id)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    myOrders: state.auth.orders,
    pending: state.auth.inProgress,
});

export const HistoryScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(History);
