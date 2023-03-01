// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, ScrollView, Image, ImageStyle, Text, TextStyle, StatusBar, ImageBackground, Platform, Keyboard,
    KeyboardAvoidingView,
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
import { authCredentials, createProductAsync, editAProductAsync, forgotPasswordAsync, signInUserAsync  } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { TextField } from "../../components/text-field";
import { formatBVN, formatPhoneNumber } from "../../utils/formatters";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";


interface DispatchProps {
    notify: (message:string, type: string) => void
    signInUserAsync: (values: authCredentials) => void
    forgotPasswordAsync: (email: string) => void
	checkNotificationPermission: () => Permissions.PermissionStatus | any
	checkLocationPermissionAsync: () => Permissions.PermissionStatus | any
    createProductAsync: (values: any) => void
    editAProductAsync: (values: any) => void
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


const CreateProduct = (props: Props) => {
	const { navigation, isLoading, signInUserAsync, notify, forgotPasswordAsync, checkLocationPermissionAsync, checkNotificationPermission, allProducts, createProductAsync, editAProductAsync } = props
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [showResetEmail, setShowResetEmail] = useState(false)
    const [product, setProducts] = useState('')
    const [productList, setProductList] = useState([])
    const [price, setPrice] = useState('')
    const [productName, setProductName] = useState('')
    const [productDetails, setProductDetails] = useState('')

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
        // @ts-ignore
        if (navigation.state.params.type === "edit") {
            console.log(navigation.state.params, "CHECKENK")
            setProductDetails(navigation.state.params.item)
            setProductName(navigation.state.params.item.productType)
        }
	}, [])

    useEffect(() => {
        let products: any = []
console.warn('thee item')
		allProducts  && allProducts.map((product) => {
            console.warn('thee item',product)
            console.log(product)
            // const { Key } = product
            let newObject = {
                value:product.key,
                label: product.key
            }
            products.push(newObject)
        })

        console.warn('now',products)
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
                            onLeftPress={() => navigation.navigate('manageProducts')}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                            titleStyle={{
                                color: isDarkMode ? colors.white : colors.companyDarkGreen
                            }}
                            titleTx={'dashboard.product'}
                            leftIcon={"arrowBackWhite"}
                            leftIconStyle={{
                                tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                            }}
                        />

                        <View
                            style={{
                                marginHorizontal: 20
                            }}
                        >
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                    fontFamily: fonts.robotoLight,
                                    fontSize: 20
                                }}
                            >
                                {translate('dashboard.product')}
                            </Text>

                            <View
                                style={{
                                    marginTop: 20
                                }}
                            >
                                <RNPickerSelect
                                    items={productList}
                                    onValueChange={value => {
                                        if (productList.filter(e => e.value === value).length > 0) {
											setProducts(value)
										}
                                    }}
                                    value={product}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{
                                        color: colors.companyDarkGreen,
                                        fontFamily: fonts.gilroyLight,
                                    }}
                                    placeholder={placeholderstate}
                                    style={{
                                        borderColor: 'white',
                                        borderWidth: 100
                                    }}
                                >

                                    <TextField
                                        editable={productName === ""}
                                        name="Bank Name"
                                        keyboardType="default"
                                        value={productName || product}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        placeholder={translate('dashboard.enterProduct')}
                                        placeholderTextColor={colors.dotColor}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        forwardedRef={productInput}
                                        inputStyle={{
                                            width: '100%',
                                        }}
                                        style={{
                                            borderColor: isDarkMode ? colors.white : colors.companyBlue,
                                            borderWidth: 1
                                        }}
                                    />

                                </RNPickerSelect>
                            </View>
                        </View>

                        <Text
                            style={{
                                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                fontFamily: fonts.robotoLight,
                                fontSize: 20,
                                marginLeft: 20
                            }}
                        >
                            {translate('dashboard.price')}
                        </Text>

                        <TextField
                            name="Bank Name"
                            keyboardType="phone-pad"
                            value={price}
                            autoCapitalize="none"
                            returnKeyType="done"
                            placeholder={'Enter Price'}
                            placeholderTextColor={colors.dotColor}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            forwardedRef={productInput}
                            inputStyle={{
                                width: '100%',
                            }}
                            style={{
                                borderColor: isDarkMode ? colors.white : colors.companyBlue,
                                borderWidth: 1,
                                margin: 20
                            }}
                            onChangeText={setPrice}
                        />

                        <Button
                            style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                            textStyle={BUTTON_TEXT_GOOGLE}
                            loading={isLoading || loading}
                            disabled={isLoading || loading || price.length < 2}
                            onPress={() => {
                                if (productName === "") {
                                    if (product !== "") {
                                        createProductAsync({
                                            name: product,
                                            price
                                        })
                                    } else {
                                        notify('Select a product type', 'error')
                                    }
                                } else {
                                    console.log("dsdsd")
                                    editAProductAsync({
                                        name: product,
                                        price,
                                        id: productDetails.id
                                    })
                                }
                            }}
                            tx={productName === "" ? 'dashboard.createProduct' : 'dashboard.save'}
                            loadingTextX={'bvn.saving'}
                        />


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
	editAProductAsync: (values: any) => dispatch(editAProductAsync(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	allProducts: state.auth.allProducts,
});

export const CreateProductScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(CreateProduct);
