// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Platform, ScrollView, ImageStyle, ImageBackground, Text, TouchableOpacity, Image,
    ActivityIndicator, TextStyle, FlatList, RefreshControl
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'
import MapView, {
    MapViewProps,
    Marker
} from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "@env"


// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import { updateUserLocationAsync, authCredentials, fetchMyOrdersAsync, fetchWalletAsync, updateUserProfileAsync, startTripAsync } from "../../redux/auth";
import { 
    fetchUserLocationAsync
} from "../../redux/device";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { Map } from "../../components/map"

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Coords } from "../../redux/device";

interface DispatchProps {
    notify: (message:string, type: string) => void
	updateUserProfileAsync: (values: authCredentials) => void
	fetchMyOrdersAsync: (type: string) => void
    startTripAsync: (id: number) => void
    updateUserLocationAsync: (values: object) => void
    fetchUserLocationAsync: () => void
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
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height,
};

const IMAGE_VIEW: ImageStyle = {
    height: Layout.window.height / 5,
	width: '100%',
	justifyContent: 'center',
	position: 'relative',
};

const WALLET: ViewStyle = {
	position: 'absolute',
	flexDirection: 'row',
	paddingHorizontal: 40,
	width: '100%'
}

const USER_NAME = {
	color: colors.white,
	fontFamily: fonts.robotoLight,
}

const WALLET_VIEW: ViewStyle = {
	flexDirection: 'row'
}


const WALET_BACKGROUND: ViewStyle = {
	marginHorizontal: 20,
	backgroundColor: colors.white,
	height: '70%',
	borderRadius: 10,
	opacity: 0.2,
	padding: 20
}

const ACCOUNT_BALANCE = {
	color: colors.white,
	fontFamily: fonts.robotoLight,
	marginTop: 20,
	fontSize: 20,
}

const WALLET_BALANCE = {
	color: colors.white,
	fontFamily: fonts.robotoBold,
	marginTop: 20,
	marginLeft: Layout.window.width / 25,
	fontSize: 20,
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

const FullMap = (props: Props) => {
	const { fetchMyOrdersAsync, navigation, isLoading, fetchWalletAsync,
        notificationId, userDetails, firstName, lastName, phone, userName, walletBalance, isOnline, updateUserProfileAsync, newOrders,
        startTripAsync, inProgress, currentCoords, updateUserLocationAsync, fetchUserLocationAsync
    } = props
    const [loading, setLoading] = useState(false)
    const [onMapReady, setMapReady] = useState(false)
	const isDarkMode = useDarkMode()
    let mapViewRef = useRef(null)

    console.log(inProgress !== undefined && inProgress.length > 0, "inProgress")
    console.log(inProgress[0], "FOUNDIT")


	useEffect(() => {
        updateBackground()
        fetchMyOrdersAsync('New')
        fetchMyOrdersAsync('Old')
        fetchMyOrdersAsync('InProgress')
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground() 
        });  
        updateBackground() 
        
    }, [isDarkMode])

    const updateBackground = () => {
        navigation.setParams({
            isDarkMode: isDarkMode
        })  
        StatusBar.setBarStyle('light-content');
        Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyDarkGreen)
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
                        fetchMyOrdersAsync('New')
                        fetchMyOrdersAsync('Old')
                        fetchMyOrdersAsync('InProgress')
                    }}
                />
            }
		>
            <View
				style={{ flex: 1 }}
			>

                <MapView
                    ref={mapViewRef}
                    followsUserLocation
                    provider={'google'}
                    style={{
                        width: Layout.window.width/ 1,
						height: Layout.window.height / 1,
						borderRadius: 10,
						flex: 1
                    }}
                    showsUserLocation
                    initialRegion={{
                        longitude: Number(currentCoords.longitude),
                        // longitude: 3.4796523,
                        latitude: Number(currentCoords.latitude),
                        // latitude: 6.4420772,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                    onUserLocationChange={(region) => {
                        console.log(region.nativeEvent, "onUserLocationChange")
                        const locationDetails = {
                            "longitude": region.nativeEvent.coordinate.longitude,
                            "latitude": region.nativeEvent.coordinate.latitude,
                            "estimatedDistance": "string",
                            "estimatedTime": "string"

                        }
                        updateUserLocationAsync(locationDetails)
                        fetchUserLocationAsync()
                    }}
                    
                >


                    {
                        inProgress !== undefined && inProgress.length > 0 && (
                            <MapViewDirections
                                mode="DRIVING"
                                strokeColor={isDarkMode ? colors.white :  colors.companyDarkGreen}
                                strokeWidth={5}
                                lineCap="round"
                                lineJoin="round"
                                origin={{ 
                                    longitude: Number(currentCoords.longitude),
                                    latitude: Number(currentCoords.latitude),
                                }}
                                destination={{
                                    latitude: inProgress[0].deliveryCoordinates.latitude, 
                                    longitude: inProgress[0].deliveryCoordinates.longitude
                                }}
                                apikey={RN_GOOGLE_MAPS_IOS_API_KEY}
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
                    }

                    

                    {
                        inProgress !== undefined && inProgress.length > 0 && inProgress.map((order) => {
                            console.log(order)
                            const { deliveryCoordinates, productType, client, status } = order 
                            const { firstName, lastName, photo } = client

                            return (
                                <Marker
                                    coordinate={{
                                        latitude: deliveryCoordinates.latitude,
                                        longitude: deliveryCoordinates.longitude,
                                    }}
                                    >

                                    <View>
                                        <View
                                            style={{
                                                backgroundColor: colors.white,
                                                shadowColor: colors.companyDarkGreen,
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.1,
                                                elevation: 2,
                                                borderRadius: 10,
                                                padding: 20,
                                                justifyContent: 'space-between',
                                                marginHorizontal: 2,
                                            }}
                                        >

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'

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
                                                                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                                                                fontFamily: fonts.robotoLight
                                                            }}
                                                        >
                                                            {firstName}
                                                        </Text>

                                                        <Text
                                                            style={{
                                                                color: colors.companyDarkPurple,
                                                                fontFamily: fonts.robotoBold,
                                                                marginTop: 3
                                                            }}
                                                        >
                                                            {status}
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                            </View>

                                            
                                            
                                        </View>
                                    </View>
                                </Marker>
                            )
                        })
                    }

                    <Marker
                        coordinate={{
                            longitude: Number(currentCoords.longitude),
                            latitude: Number(currentCoords.latitude),
                        }}
                    />

                </MapView>

                {/* <Header
                    leftIcon="arrowBackWhite"
                    navigation={navigation}
                    onLeftPress={() => navigation.navigate('dashboard')}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                    titleStyle={{
                        color: colors.companyDarkGreen
                    }}
                    leftIconStyle={{
                        tintColor: colors.companyDarkGreen
                    }}
                    titleTx={'dashboard.map'}
                /> */}

                <View
					style={{
						position: 'absolute',//use absolute position to show button on top of the map
						// top: '50%', //for center align
						// alignSelf: 'flex-end' //for align to right
						left: 20
					}}
				>
					<Header
						leftIcon="arrowBackWhite"
						navigation={navigation}
						onLeftPress={() => navigation.navigate('dashboard')}
						style={{
							backgroundColor: 'transparent'
						}}
						titleStyle={{
							color: colors.companyDarkGreen
						}}
						leftIconStyle={{
							tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
                            marginBottom: Platform.OS === "android" ? 10 : 0
						}}
						leftBody={{
							backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
							height: 40,
							width: 40,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 20
						}}
					/>
				</View>
            </View>

        </ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
	updateUserProfileAsync: (values: authCredentials) => dispatch(updateUserProfileAsync(values)),
	fetchMyOrdersAsync: (type: string) => dispatch(fetchMyOrdersAsync(type)),
    startTripAsync: (id: number) => dispatch(startTripAsync(id)),
    updateUserLocationAsync: (values: object) => dispatch(updateUserLocationAsync(values)),
    fetchUserLocationAsync: () => dispatch(fetchUserLocationAsync())
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
    currentCoords: state.device.location.coords
});

export const FullMapScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(FullMap);
