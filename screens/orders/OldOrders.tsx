// react
import React, { useEffect, useState, useRef } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Text, Platform, RefreshControl, FlatList, ActivityIndicator, Image
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import Clipboard from '@react-native-community/clipboard'
import Modal from "react-native-modal";
import moment from 'moment';

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {  } from "../../redux/startup"
import { fetchBanksAsync, fetchMyOrdersAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { translate } from "../../i18n";
import { TouchableOpacity } from "react-native-gesture-handler";

interface DispatchProps {
	notify: (message:string, type: string) => void
    fetchBanksAsync: () => void
    fetchMyOrdersAsync: (type: string, limit?: number) => void
}

interface StateProps {
	isLoading: boolean
    banks: Array<any>
    orders: Array<any>
}

interface MyFormValues {
	
}

interface OldOrdersScreenScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & OldOrdersScreenScreenProps

const ROOT: ViewStyle = {
    // width: Layout.window.width,
    // height: Layout.window.height,
};

const EDIT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	width: '90%',
	backgroundColor: colors.companyBlue,
    height: 50,
}

const EDIT_BUTTON_TEXT: TextStyle = {
	fontSize: 14,
	fontFamily: fonts.robotoBOldOrders,
	color: colors.white
}

const OldOrders = (props: Props) => {
    const { 
        isLoading, navigation, fetchBanksAsync, banks, notify, orders, fetchMyOrdersAsync } = props
    const isDarkMode = useDarkMode()

    const [copiedText, setCopiedText] = useState('')
    const [amount, setAmount] = useState('')
    const [amountValue, setAmountValue] = useState('')
    const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
    var amountInput = useRef(null)
    const [seletedOldOrdersTemplate, setSeletedOldOrdersTemplate] = useState('')

    const [ordersCount, setCordersCount] = useState(20)

    console.tron.log(orders, "ORDERSS")

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString()
        setCopiedText(text)
        console.tron.log(text, "WHAT I COPIED")
        setShowModal(false)
    }
    
    useEffect(() => {
        updateBackground()
        fetchMyOrdersAsync('Old', ordersCount)
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
        });  
        updateBackground() 
        
        
    }, [isDarkMode])

    const updateBackground = () => {
        // fetchBanksAsync()
		StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        navigation.setParams({
            isDarkMode: isDarkMode
        })
		Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen)
	}

    const returnBkColorLight = (index: number) => {
        return index % 2 === 0 ? colors.settingsSubView : colors.companyDarkGreen
    }

    const returnTextColorLight = (index: number) => {
        return index % 2 === 0 ? colors.companyDarkGreen : colors.settingsSubView
    }

    const resetAmount = () => {
        setShowModal(false)
        setAmount('')
        setAmountValue('')
    }

    const renderItem = ({ item, index }: any) => {
        const { client, completionTime, cancelationTime } = item
        const { firstName } = client
        console.tron.log(item)

        return (
            <View
                key={index}
                style={{
                    marginTop: 10,
                    width: '100%',
                    height: 60,
                    backgroundColor: isDarkMode ? colors.companyDarkGreen : returnBkColorLight(index),
                    justifyContent: 'center',
                    borderRadius: 10,
                    paddingHorizontal: 10
                }}
            >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '95%'
                            // alignItems: 'center'
                        }}
                    >

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : returnTextColorLight(index),
                                // fontSize: 20
                                // width: '30%'
                            }}
                        >
                            {firstName}
                        </Text>

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : returnTextColorLight(index),
                                // fontSize: 20,
                                // textAlign: 'center',s
                                // width: '30%'
                            }}
                        >
                            {completionTime ? moment(completionTime).format('MMMM Do YYYY') : moment(cancelationTime).format('MMMM Do YYYY')}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true)
                                setSeletedOldOrdersTemplate(item)
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : returnTextColorLight(index),
                                    fontFamily: fonts.robotoBOldOrders,
                                    // marginBottom: 10
                                    // width: '100%',
                                    textAlign: 'left'
                                }}
                            >
                                {translate('oldOrders.view')} 
                            </Text> 
                        </TouchableOpacity>

                    </View>
                
            </View>
        )
    }

	return (
		<View
			style={[ROOT, {
				backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
            }]}
		>

            <Header
                leftIcon="arrowLeft"
                navigation={navigation}
                onLeftPress={() => navigation.navigate('dashboard')}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'oldOrders.headerText'}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

            <View
                style={{
                    width: '100%',
                    height: '100%',
                    // backgroundColor: 'red',
                    // justifyContent: 'flex-end',
                    padding: 20,
                }}
            >
                
                <Modal 
                    isVisible={showModal}
                    onBackButtonPress={() => resetAmount()}
                    onBackdropPress={() => resetAmount()}
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


                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.product')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {seletedOldOrdersTemplate.productType} 
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.quantity')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {seletedOldOrdersTemplate.quantity} 
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.status')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {seletedOldOrdersTemplate.status} 
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                             {translate('oldOrders.requestTime')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {moment(seletedOldOrdersTemplate.requestTime).format('MMMM Do YYYY')}

                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.deploymentTime')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {moment(seletedOldOrdersTemplate.deploymentTime).format('MMMM Do YYYY')}
                            </Text>
                        </View>

                        {/* <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.arrivalTime')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {seletedOldOrdersTemplate.arrivalTime ? moment(seletedOldOrdersTemplate.arrivalTime).format('MMMM Do YYYY') : `${seletedOldOrdersTemplate.status}`}
                            </Text>
                        </View> */}

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.completionTime')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight
                                }}
                            >
                                {seletedOldOrdersTemplate.completionTime ? moment(seletedOldOrdersTemplate.completionTime).format('MMMM Do YYYY') : 'N/A'}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    // fontSize: 0,
                                    fontFamily: fonts.robotoBold
                                }}
                            >
                                {translate('oldOrders.deliveryTime')} 
                            </Text>

                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    marginLeft: 10,
                                    fontFamily: fonts.robotoLight,
                                    width: '63%'
                                }}
                            >
                                {seletedOldOrdersTemplate.deliveryLocation}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                                marginTop: 30
                            }}
                        >

                            <Button
                                style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
                                textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
                                onPress={() => setShowModal(false)}
                                tx={`oldOrders.close`}
                            />

                        </View>

                    </View>
                    
                </Modal>


                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        width: '90%'
                    }}
                >
                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            // fontSize: 0,
                            fontFamily: fonts.robotoBOldOrders
                        }}
                    >
                        {translate('oldOrders.bankName')} 
                    </Text>

                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            // fontSize: 0,
                            fontFamily: fonts.robotoBOldOrders
                        }}
                    >
                        {translate('oldOrders.bankCode')} 
                    </Text>

                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            // fontSize: 0,
                            fontFamily: fonts.robotoBOldOrders
                        }}
                    >
                        {translate('oldOrders.copy')} 
                    </Text>
                </View>
                
                <View
                    style={{
                        marginTop: 20
                    }}
                >
                   {
                       orders !== undefined && orders.length > 0 && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={orders}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                paddingBottom: '70%'
                            }}
                            onEndReachedThreshold={0.8}
                            onEndReached={() => {
                                setCordersCount(ordersCount + 10)
                                fetchMyOrdersAsync('Old', ordersCount)
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={() => {
                                        setCordersCount(ordersCount + 10)
                                        fetchMyOrdersAsync('Old', ordersCount)
                                    }}
                                />
                            }
                        />
                       )
                   }
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

                {
                    orders === undefined || orders.length < 1 && (
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
                                    fontFamily: fonts.robotoBOldOrders
                                }}
                            >
                                {translate('oldOrders.banks')} 
                            </Text>
                        </View>
                    )
                }
                


            </View>

        
        </View>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    fetchBanksAsync: () => dispatch(fetchBanksAsync()),
    fetchMyOrdersAsync: (type: string, limit?: number) => dispatch(fetchMyOrdersAsync(type, limit)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    banks: state.auth.banks,
    orders: state.auth.orders
});

export const OldOrdersScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(OldOrders);
