// react
import React, { useEffect, useState, useRef } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Text, Platform, Keyboard, FlatList
} from "react-native";

// third-party
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
import { fetchBanksAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { translate } from "../../i18n";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../components/icon";
import { formatAmount } from "../../utils/formatters";

interface DispatchProps {
	notify: (message:string, type: string) => void
    fetchBanksAsync: () => void
}

interface StateProps {
	isLoading: boolean
    banks: Array<any>
    accountNumber: string
}

interface MyFormValues {
	
}

interface USSDScreenScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & USSDScreenScreenProps

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
	fontFamily: fonts.robotoBold,
	color: colors.white
}

const USSD = (props: Props) => {
    const { isLoading, navigation, fetchBanksAsync, banks, notify, accountNumber } = props
    const isDarkMode = useDarkMode()

    const [copiedText, setCopiedText] = useState('')
    const [amount, setAmount] = useState('')
    const [amountValue, setAmountValue] = useState('')
    const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
    var amountInput = useRef(null)
    const [seletedUssdTemplate, setSeletedUssdTemplate] = useState('')


    const copyToClipboard = () => {
        Clipboard.setString(seletedUssdTemplate.replace("Amount", amount).replace("AccountNumber", accountNumber))
        fetchCopiedText()
        notify(`${translate('ussd.copiedToClipBoard')}`, 'success')
        resetAmount()
    }

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString()
        setCopiedText(text)
        console.tron.log(text, "WHAT I COPIED")
        setShowModal(false)
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
        fetchBanksAsync()
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
        const { name, code, ussdTemplate } = item
        // console.tron.log(item)

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
                            width: '90%'
                            // alignItems: 'center'
                        }}
                    >

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : returnTextColorLight(index),
                                // fontSize: 20
                                width: '30%'
                            }}
                        >
                            {name}
                        </Text>

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : returnTextColorLight(index),
                                // fontSize: 20,
                                // textAlign: 'center',s
                                // width: '30%'
                            }}
                        >
                            {code} 
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true)
                                setSeletedUssdTemplate(ussdTemplate)
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : returnTextColorLight(index),
                                    fontFamily: fonts.robotoBold,
                                    // marginBottom: 10
                                    // width: '100%',
                                    textAlign: 'right'
                                }}
                            >
                                {translate('accountDetails.copy')} 
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
                rightIcon="cancelIcon"
                navigation={navigation}
                onRightPress={() => navigation.goBack()}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'ussd.headerText'}
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
                    // backgroundColor: 'red',
                    // justifyContent: 'flex-end',
                    padding: 20,
                }}
            >
                {/* <Image 
                    source={isDarkMode ? images.loadWalletDark : images.loadWalletLight}
                    resizeMode="center"
                    resizeMethod="auto"
                    style={{
                        height: Layout.window.height / 2.5,
                        width: Layout.window.width / 1.5,
                        alignSelf: 'center'
                    }}
                /> */}

                {/* <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontSize: 20,
                        fontFamily: fonts.robotoBold
                    }}
                >
                    {translate('ussd.copyCode')} 
                </Text> */}

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
                                onPress={() => copyToClipboard()}
                                tx={`ussd.copyToClipBoard`}
                                disabled={parseInt(amount) < 1000 || amount.length < 1}
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
                            fontFamily: fonts.robotoBold
                        }}
                    >
                        {translate('ussd.bankName')} 
                    </Text>

                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            // fontSize: 0,
                            fontFamily: fonts.robotoBold
                        }}
                    >
                        {translate('ussd.bankCode')} 
                    </Text>

                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            // fontSize: 0,
                            fontFamily: fonts.robotoBold
                        }}
                    >
                        {translate('ussd.copy')} 
                    </Text>
                </View>
                
                <View
                    style={{
                        marginTop: 20
                    }}
                >
                   {
                       banks !== undefined && banks.length > 0 && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={banks}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                paddingBottom: '70%'
                            }}
                        />
                       )
                   }
                </View>


                {
                    banks === undefined || banks.length < 1 && (
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
                                {translate('ussd.banks')} 
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
    fetchBanksAsync: () => dispatch(fetchBanksAsync())
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
    banks: state.auth.banks,
    accountNumber: state.auth.user.payoutNumber,
});

export const USSDScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(USSD);
