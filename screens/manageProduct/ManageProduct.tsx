// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, ScrollView, Image, ImageStyle, Text, TextStyle, StatusBar, ImageBackground, Platform, Keyboard,
    TouchableOpacity,
    Alert
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import * as Permissions from 'expo-permissions';
import firebase from "react-native-firebase";
import RNPickerSelect from "react-native-picker-select";

// redux
import { ApplicationState } from "../../redux";
import { checkLocationPermissionAsync, checkNotificationPermissionAsync, notify } from "../../redux/startup"
import { authCredentials, createProductAsync, forgotPasswordAsync, signInUserAsync  } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { TextField } from "../../components/text-field";
import { formatBVN, formatPhoneNumber } from "../../utils/formatters";
import Modal from "react-native-modal";

interface DispatchProps {
    notify: (message:string, type: string) => void
    signInUserAsync: (values: authCredentials) => void
    forgotPasswordAsync: (email: string) => void
	checkNotificationPermission: () => Permissions.PermissionStatus | any
	checkLocationPermissionAsync: () => Permissions.PermissionStatus | any
    createProductAsync: (values: any) => void
}

interface StateProps {
	isLoading: boolean
    allProducts: Array<any>
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height,
};

const BACKGROUND_IMAGE: ImageStyle = {
	height: Layout.window.height,
	width: Layout.window.width,
};

const GET_STARTED: TextStyle = {
	marginVertical: 20,
	color: colors.white,
	fontSize: 20,
	fontFamily: fonts.gilroyLight
};

const BUTTON_FACEBOOK_DARK: ViewStyle = {
	width: Layout.window.width / 1.4,
	height: 50,
	backgroundColor: colors.transparent,
	borderWidth: 2,
	borderColor: colors.white,
	borderRadius: 30,
	marginTop: Layout.window.height / 3,
    alignSelf: 'center'
}

const BUTTON_GOOGLE: ViewStyle = {
	...BUTTON_FACEBOOK_DARK,
	backgroundColor: colors.companyBlue

}

const BUTTON_TEXT: TextStyle = {
	fontSize: 17,
	fontFamily: fonts.robotoBold
}

const BUTTON_TEXT_GOOGLE: TextStyle = {
	...BUTTON_TEXT,
}

const BOTTOM_VIEW: ViewStyle = {
	marginVertical: Layout.window.height / 10
};

const TERMS: TextStyle = {
	fontSize: 15,
	color: colors.white,
	textAlign: 'center',
};

const FIELD: ViewStyle = {
    width: '83%',
    borderColor: colors.dotColor,
    borderWidth: 2,
    borderRadius: 10
}


const ManageProducts = (props: Props) => {
	const { navigation, isLoading, signInUserAsync, notify, forgotPasswordAsync, checkLocationPermissionAsync, checkNotificationPermission, allProducts, createProductAsync } = props
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [showResetEmail, setShowResetEmail] = useState(false)
    const [product, setProducts] = useState('')
    const [productList, setProductList] = useState([])
    const [price, setPrice] = useState('')

    var productInput = useRef(null)

    let phoneInput = useRef()
    let passwordInput = useRef()
    let emailInput = useRef()



	const isDarkMode = useDarkMode()

    const placeholderstate = {
		label: "Choose Product",
		value: '',
		color: "#565F62"
	};


	useEffect(() => {
		StatusBar.setBarStyle('light-content')
		Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyBlue)
	})

    useEffect(() => {
        let products: any = []

		allProducts  && allProducts.map((product) => {
            console.log(product)
            const { Key } = product
            let newObject = {
                value: Key,
                label: Key
            }
            products.push(newObject)
        })

        console.log(products)
        setProductList(products)
	}, [])

	const showAlert = (title: string, body: string | undefined) => {
		Alert.alert(
			title, body,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}

	return (

            <View
                style={ROOT}
            >
                <ScrollView>
                    <View
                        style={BACKGROUND_IMAGE}
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
                            titleTx={'dashboard.edit'}
                            leftIcon={"arrowBackWhite"}
                            leftIconStyle={{
                                tintColor:isDarkMode ? colors.white : colors.companyDarkGreen
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('createProduct', {
                                type: "create"
                            })}
                            style={{
                                margin: 20,
                                padding: 20,
                                shadowColor: isDarkMode ? colors.white : colors.companyBlue,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: isDarkMode ? colors.white : colors.companyBlue,
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                }}
                            >
                                {translate('dashboard.createProduct')}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                }}
                            >
                                {translate('dashboard.createProductDetails')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('editProducts')}
                            style={{
                                margin: 20,
                                padding: 20,
                                shadowColor: isDarkMode ? colors.white : colors.companyBlue,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: isDarkMode ? colors.white : colors.companyBlue,
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                }}
                            >
                                {translate('dashboard.editProduct')}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                }}
                            >
                                {translate('dashboard.editProductDetails')}
                            </Text>
                        </TouchableOpacity>



                    </View>

                </ScrollView>
            </View>

	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    signInUserAsync: (values: authCredentials) => dispatch(signInUserAsync(values)),
    forgotPasswordAsync: (email: string) => dispatch(forgotPasswordAsync(email)),
    checkNotificationPermission: () => dispatch(checkNotificationPermissionAsync()),
	checkLocationPermissionAsync: () => dispatch(checkLocationPermissionAsync()),
	createProductAsync: (values: any) => dispatch(createProductAsync(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	allProducts: state.auth.allProducts,
});

export const ManageProductsScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ManageProducts);
