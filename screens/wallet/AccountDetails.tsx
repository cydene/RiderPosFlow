// react
import React, { useEffect, useState } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Text, Platform, Image
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import Clipboard from '@react-native-community/clipboard'

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {  } from "../../redux/startup"
import {  } from "../../redux/auth";

// components
import { Button } from "../../components/button";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { color } from "react-native-reanimated";
import { translate } from "../../i18n";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../components/icon";

interface DispatchProps {
	notify: (message:string, type: string) => void
}

interface StateProps {
	isLoading: boolean
    currencyCode: string
    bankName: string
    accountName: string
    accountNumber: string
    status: string
}

interface MyFormValues {
	
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
    width: Layout.window.width,
    height: Layout.window.height,
};

const AccountDetails = (props: Props) => {
    const { isLoading, navigation, currencyCode, bankName, accountName, accountNumber, status } = props
    const isDarkMode = useDarkMode()

    const walletFeatures = [
        {
            title: 'Account Details', 
            key: 'item0',
            action: 'accountDetails'
        },
        {
            title: 'Schedule Recharge', 
            key: 'item1',
            action: 'accountDetails'
        },
        {
            title: 'Load Wallet', 
            key: 'item2',
            action: 'accountDetails'
        },  
        {
            title: 'Wallet Transactions', 
            key: 'item3',
            action: 'accountDetails'
        }
    ]

    const [copiedText, setCopiedText] = useState('')

    const copyToClipboard = (text: string) => {
        Clipboard.setString(text)
        fetchCopiedText()
    }

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString()
        setCopiedText(text)
        console.tron.log(text, "WHAT I COPIED")
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
		StatusBar.setBarStyle('light-content');
        navigation.setParams({
            isDarkMode: isDarkMode
        })
		Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen)
	}

    const returnRow = (title: string, body: string) => {
        return (
            <View

            >
                <Text
                    style={{
                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                        fontFamily: fonts.robotoLight,
                        marginBottom: 10
                    }}
                >
                    {title} 
                </Text> 

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text
                        style={{
                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                            fontFamily: fonts.robotoBold,
                            marginBottom: 10
                        }}
                    >
                        {body} 
                    </Text> 

                    {
                        title !== "Currency" && title !== "Status" && (
                            <TouchableOpacity
                                onPress={() => copyToClipboard(body)}
                            >
                                <Text
                                    style={{
                                        color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                        fontFamily: fonts.robotoBold,
                                        marginBottom: 10
                                    }}
                                >
                                    {translate('accountDetails.copy')} 
                                </Text> 
                            </TouchableOpacity>
                        )
                    }
                </View> 

                <View 
                    style={{
                        backgroundColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                        height: 0.5,
                        width: '100%',
                        marginBottom: 20,
                    }}
                />
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
                leftIcon="arrowBackWhite"
                navigation={navigation}
                onLeftPress={() => navigation.goBack()}
                style={{
                    backgroundColor: 'transparent'
                }}
                titleStyle={{
                    color: isDarkMode ? colors.white : colors.companyDarkGreen
                }}
                titleTx={'accountDetails.headerText'}
                leftIconStyle={{
                    tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                    marginTop: 15,
                    marginLeft: 3
                }}
            />

            <View
                style={{
                    margin: 20
                }}
            >
                {returnRow(`${translate('accountDetails.currencyCode')}`, currencyCode)}
                {returnRow(`${translate('accountDetails.bankName')}`, bankName)}
                {returnRow(`${translate('accountDetails.accountName')}`, accountName)}
                {returnRow(`${translate('accountDetails.accountNumber')}`, accountNumber)}
                {returnRow(`${translate('accountDetails.status')}`, `${status ? translate('paymentOptions.active') : translate('paymentOptions.inActive')}`)}

            </View>

        
        </View>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	currencyCode: '₦',
    bankName: state.auth.user.bankName,
    accountName: state.auth.user.payoutName,
    accountNumber: state.auth.user.payoutNumber,
    status: 'Active',

});

export const AccountDetailsScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(AccountDetails);
