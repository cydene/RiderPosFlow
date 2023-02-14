// react
import React, { useEffect, useState, useRef } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Text, Platform, Image, FlatList, ScrollView, Keyboard, TextStyle
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import { MONIFY_API_KEY, MONNIFY_CONTRACT } from "@env"
import Modal from "react-native-modal";


// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {  } from "../../redux/startup"
import {  } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { color } from "react-native-reanimated";
import { translate } from "../../i18n";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../components/icon";

// import RNMonnify from '@monnify/react-native-sdk';

// RNMonnify.initialize({
//   apiKey: MONIFY_API_KEY,
//   contractCode: MONNIFY_CONTRACT,
//   applicationMode: 'TEST'
// });

interface DispatchProps {
	notify: (message:string, type: string) => void
}

interface StateProps {
	isLoading: boolean
    userName: string
	userEmail: string
}

interface MyFormValues {
	
}

interface PaymentOptionScreenScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & PaymentOptionScreenScreenProps

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

const PaymentOption = (props: Props) => {
    const { isLoading, navigation, userName, userEmail } = props
    const isDarkMode = useDarkMode()
    const [amount, setAmount] = useState('')
    const [amountValue, setAmountValue] = useState('')
    const [showModal, setShowModal] = useState(false)
    var amountInput = useRef(null)

    const walletFeatures = [
        {
            title: translate('paymentOptions.card'),  
            key: 'item1',
            action: ''
        },
        {
            title: translate('paymentOptions.ussd'), 
            key: 'item2',
            action: 'ussd'
        }
    ]

    const resetAmount = () => {
        setShowModal(false)
        setAmount('')
        setAmountValue('')
    }
    
    useEffect(() => {
        updateBackground()

        
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
        });  
        updateBackground() 
        
    }, [isDarkMode])

    const updateBackground = () => {
		StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        navigation.setParams({
            isDarkMode: isDarkMode
        })
		Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen)
	}

    const loadWithCard = () => {
        const generatedId = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
        const cydeneRef = `cydene_${generatedId}`;
        console.tron.log(cydeneRef, "cydeneRef")

        setShowModal(false)

        // RNMonnify.initializePayment({
        //     amount: parseInt(amount),
        //     customerName: userName,
        //     customerEmail: userEmail,
        //     paymentReference: cydeneRef,
        //     paymentDescription: `${translate('paymentOptions.paymentDescription')}`,
        //     currencyCode: 'NGN',
        //     incomeSplitConfig: [],
        // })
        // .then(response => {
        //     resetAmount()
        //     console.log(response); // card charged successfully, get reference here
        // })
        // .catch(error => {
        //     console.log(error); // error is a javascript Error object
        //     console.log(error.message);
        //     console.log(error.code);
        //     resetAmount()
	    // })
    }

    const returnWalletIcon = (name: string) => {
        if(name === translate('paymentOptions.bank')) return images.bank
        if(name === translate('paymentOptions.card')) return images.cardPayment
        if(name === translate('paymentOptions.ussd')) return images.transactions
    }

    const renderItem = ({ item }: any, index: any) => {
        const { title, key, action } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    if (title === translate('paymentOptions.card')) {
                        setShowModal(true)
                        // loadWithCard()
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

                         <Text
                            style={{
                                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                fontFamily: fonts.robotoBold,
                                marginVertical: 10
                            }}
                        >
                            {translate('ussd.enterAmount', {
                                amountValue
                            })} 
                        </Text>

                        <TextField
                            name="amount"
                            keyboardType="default"
                            value={amount}
                            onChangeText={(fName) => {
                                setAmount(fName.replace(/[^\d]/g, ""))
                                setAmountValue(fName.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                            }}
                            autoCapitalize="words"
                            returnKeyType="next"
                            placeholder={`${translate('ussd.placeholder')}`}
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

                                    setTimeout(() => {
                                        loadWithCard()
                                    }, 2000)
                                }}
                                tx={`paymentOptions.proceed`}
                                disabled={parseInt(amount) < 1000 || amount.length < 1}
                            />

                        </View>
                    </View>
                    
                </Modal>
                
            </TouchableOpacity>
        )
    }

	return (
		<ScrollView
			style={[ROOT, {
				backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
            }]}
		>

            <Header
                rightIcon="cancelIcon"
                navigation={navigation}
                onRightPress={() => navigation.goBack()}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'paymentOptions.headerText'}
                rightIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

            <View
                style={{
                    width: '100%',
                    height: '100%',
                    padding: 20,
                }}
            >
                <Image 
                    source={isDarkMode ? images.loadWalletDark : images.loadWalletLight}
                    resizeMode="center"
                    resizeMethod="auto"
                    style={{
                        height: Layout.window.height / 2.5,
                        width: Layout.window.width / 1.5,
                        alignSelf: 'center'
                    }}
                />

                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontSize: 20,
                        fontFamily: fonts.robotoBold
                    }}
                >
                    {translate('paymentOptions.selectOption')} 
                </Text>
                
                <View
                    style={{
                        marginTop: 20
                    }}
                >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={walletFeatures}
                        renderItem={renderItem}
                    />
                </View>
                


            </View>

        
        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    userName: `${state.auth.user.firstName} ${state.auth.user.lastName}`,
	userEmail: `${state.auth.user.email}`,
});

export const PaymentOptionScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(PaymentOption);
