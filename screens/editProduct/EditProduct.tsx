// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, ScrollView, Image, ImageStyle, Text, TextStyle, StatusBar, FlatList, Platform, RefreshControl,
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
import Swipeout from 'react-native-swipeout';

// redux
import { ApplicationState } from "../../redux";
import { checkLocationPermissionAsync, checkNotificationPermissionAsync, notify } from "../../redux/startup"
import { authCredentials, createProductAsync, forgotPasswordAsync, getMyProductsAsync, signInUserAsync  } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { TextField } from "../../components/text-field";
import { formatAmount, formatBVN, formatPhoneNumber } from "../../utils/formatters";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";

interface DispatchProps {
    notify: (message:string, type: string) => void
    signInUserAsync: (values: authCredentials) => void
    forgotPasswordAsync: (email: string) => void
	checkNotificationPermission: () => Permissions.PermissionStatus | any
	checkLocationPermissionAsync: () => Permissions.PermissionStatus | any
    createProductAsync: (values: any) => void
    getMyProductsAsync: () => void
}

interface StateProps {
	isLoading: boolean
    allProducts: Array<any>
    myProducts: Array<any>
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


const EditProducts = (props: Props) => {
	const { getMyProductsAsync, navigation, isLoading, myProducts, signInUserAsync, notify, forgotPasswordAsync, checkLocationPermissionAsync, checkNotificationPermission, allProducts, createProductAsync } = props
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
    const [swipeRefs, setSwipeRefs] = useState([])




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

    const renderProducts = ({ item, index }: any) => {

        const { productType, unitCost } = item
        console.log(item)



        return (
            <View
                style={{
                    // marginTop: 18,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.03,
                    elevation: 1,
                    alignItems: 'center',
                    padding: 15,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    height: 80,
                    marginBottom: 20,
                    // marginRight: 10,
                    width: Layout.window.width / 1.1,
                    marginLeft: 20
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >

                    <View
                        style={{
                            marginLeft: 20,
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                // fontFamily: fonts.FilsonProBold,
                                // color: colors.greyThree
                            }}
                        >
                            {productType}
                        </Text>

                        <Text
                            style={{
                                marginTop: 5,
                                // color: colors.greyTwo
                            }}
                        >
                            {`Amount: ₦ ${formatAmount(unitCost)}`}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('createProduct', {
                        type: "edit",
                        item
                    })}
                >
                    <Image
                        source={images.editIcon}
                    />
                </TouchableOpacity>
            </View>

        )
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

                        <FlatList
                            data={myProducts}
                            renderItem={renderProducts}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    progressBackgroundColor={colors.companyDarkGreen}
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                    }}
                                    onRefresh={() => {
                                        getMyProductsAsync()
                                    }}
                                />
                            }
                            style={{
                                paddingVertical: 20,
                                height: Layout.window.height / 1.8,
                            }}
                            bounces={false}
                            contentContainerStyle={{
                                paddingBottom: 20
                            }}
                            ListEmptyComponent={
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <Text
                                        style={{
                                            color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                            fontSize: 14,
                                            marginTop: 100
                                        }}
                                    >
                                        {translate('dashboard.empty')}
                                    </Text>
                                </View>
                            }
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
	getMyProductsAsync: (values: any) => dispatch(getMyProductsAsync(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	allProducts: state.auth.allProducts,
	myProducts: state.auth.myProducts,
});

export const EditProductsScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(EditProducts);
