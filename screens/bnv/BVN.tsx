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
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
// import Toast from 'react-native-toast-message';

// redux
import { ApplicationState } from "../../redux";
import { checkLocationPermissionAsync, checkNotificationPermissionAsync, notify } from "../../redux/startup"
import { authCredentials, forgotPasswordAsync, signInUserAsync  } from "../../redux/auth";

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
import Toast from 'react-native-simple-toast';

interface DispatchProps {
    notify: (message:string, type: string) => void
    signInUserAsync: (values: authCredentials) => void
    forgotPasswordAsync: (email: string) => void
	checkNotificationPermission: () => Permissions.PermissionStatus | any
	checkLocationPermissionAsync: () => Permissions.PermissionStatus | any
}

interface StateProps {
	isLoading: boolean
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height,
};

const BACKGROUND_IMAGE: ImageStyle = {
	height: Layout.window.height,
	width: Layout.window.width
};

const GET_STARTED: TextStyle = {
	marginVertical: 13,
    marginLeft:200,
	color: colors.white,
	fontSize: 10,
	fontFamily: fonts.gilroyLight
};


const GET_STARTED2: TextStyle = {
	marginVertical: 20,
	color: colors.white,
	fontSize: 15,
	fontFamily: fonts.gilroyLight
};

const GET_STARTED3: TextStyle = {
	marginVertical: 20,
	color: colors.white,
	fontSize: 20,
    textAlign:'center',
    marginTop:20,
	fontFamily: fonts.gilroyLight
};

const BUTTON_FACEBOOK_DARK: ViewStyle = {
	width: Layout.window.width / 1.4,
	height: 50,
	backgroundColor: colors.transparent,
	borderWidth: 2,
	borderColor: colors.white,
	borderRadius: 30,
	marginTop: 20
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



const BVN = (props: Props) => {
	const { navigation, isLoading, signInUserAsync, notify, forgotPasswordAsync, checkLocationPermissionAsync, checkNotificationPermission } = props
    const [loading, setLoading] = useState(false)
    const [referredBy, setReferredBy] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [showResetEmail, setShowResetEmail] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [phoneRegister, setPhoneRegister] = useState('')
    const [emailRegister, setEmailRegister] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [passwordRegister, setPasswordRegister] = useState('')

    let phoneInput = useRef()
    let passwordInput = useRef()
    let emailInput = useRef()


	const isDarkMode = useDarkMode()

	useEffect(() => {
		StatusBar.setBarStyle('light-content')
		Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyBlue)
	})

    useEffect(() => {
		checkLocationPermissionAsync()
		checkNotificationPermission()
		createNotificationListeners(); //add this line
	})


const SignUp=async()=>{
if(firstName !='' || lastName !='' || phoneRegister !='' || emailRegister !=''){
    setLoading(true)
    var noSpacesPhone = phoneRegister.replace(/ /g, '');
    var noSpacesEmail = emailRegister.replace(/ /g, '');
    try {
       const data={
        firstName: firstName ,
        lastName: lastName,
        phone: noSpacesPhone ,
        email:noSpacesEmail ,
        password:passwordRegister,
        referredBy:referredBy
       }
       console.warn('>>>>>>>>??>>>>',data)

        let res = await axios({
          method: 'POST',
          url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/create`,
          data: data,
         
        });
        if (res) {
            setShowRegister(false)
          console.warn('success',res)
          setLoading(false)
          Toast.show('Registration Successful', Toast.LONG);
         
        }
      } catch (err) {
        setLoading(false)
        // setShowRegister(false)
        console.warn('call err>>>>>>>>>>>>>', err);
        if(err.response.data.message){
            console.warn('call err', err.response.data.message);  
            Toast.show(`${err.response.data.message}`, Toast.LONG);
        }
    //     console.warn('call err', err.response.data.message);
    Toast.show(`${err.response.data.message}`, Toast.LONG);
       
      }
    }else{


    }
}

    const createNotificationListeners = async () => {
		console.log('createNotificationListeners',"CA")
		/*
		* Triggered when a particular notification has been received in foreground
		* */
		// @ts-ignore
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body } = notification;
			showAlert(title, body);
			console.log('notificationListener')
		});
		
		/*
		* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		* */
		// @ts-ignore
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body } = notificationOpen.notification;
			showAlert(title, body)
			console.log('notificationOpenedListener');
		});
		
		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			showAlert(title, body);
			console.log('notificationOpen');
		}

		/*
		* Triggered for data only payload in foreground
		* */
		// @ts-ignore
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message
			console.log(JSON.stringify(message));
		});
	}

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            style={{
                flex: 1
            }}
        >


            <Modal 
                isVisible={showResetEmail}
                onBackButtonPress={() => {
                    setShowResetEmail(false)
                }}
                onBackdropPress={() => {
                    setShowResetEmail(false)
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
                        padding: 20,
                        backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                        justifyContent: 'center',
                        borderRadius: 10,
                        alignSelf: 'center'
                    }}  
                >
                    
                    <Text
                        style={[GET_STARTED, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                    >
                        {translate('bvn.enterEmail')}
                    </Text>

                    <TextField
                        name="email"
                        keyboardType="email-address"
                        value={resetEmail}
                        onChangeText={(userEmail) => setResetEmail(userEmail)}
                        autoCapitalize="none"
                        returnKeyType="done"
                        placeholder={`${translate('bvn.enterRegistered')}`}
                        placeholderTextColor={colors.dotColor}
                        // onSubmitEditing={() => passwordInput.current.focus()}
                        forwardedRef={emailInput}
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />

                    <Button
                        style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                        textStyle={BUTTON_TEXT_GOOGLE}
                        loading={isLoading || loading}
                        disabled={isLoading || loading}
                        onPress={() => {
                            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(re.test(String(resetEmail).toLowerCase())) {
                                forgotPasswordAsync(resetEmail)
                            } else {
                                notify('Invalid email', 'danger')
                            }
                        }}
                        tx={'bvn.buttonText'}
                        loadingTextX={'bvn.saving'}
                    />

                </View>
                
            </Modal>


            <View
                style={ROOT}
            >
                <ScrollView>
                    <ImageBackground
                        source={isDarkMode ? images.darkBackground : images.backgroundImage}
                        style={BACKGROUND_IMAGE}
                    >
                        
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image 
                                source={isDarkMode ? images.appLogoWhite: images.appLogoBlue}
                                style={{
                                    marginTop: Layout.window.height / 5
                                }}
                            />

                            <Text
                                style={[GET_STARTED, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                            >
                                {translate('auth.getStarted')}
                            </Text>

                            <TextField
                                name="phone"
                                keyboardType="phone-pad"
                                value={phone}
                                maxLength={11}
                                onChangeText={(userPhone) =>setPhone(userPhone)}
                                autoCapitalize="none"
                                returnKeyType="next"
                                placeholder={`${translate('bvn.phonePlaceholder')}`}
                                placeholderTextColor={colors.dotColor}
                                // onSubmitEditing={() => passwordInput.current.focus()}
                                forwardedRef={phoneInput}
                                style={{
                                    borderColor: isDarkMode ? colors.white : colors.companyBlue
                                }}
                            />

                            <TextField
                                name="password"
                                keyboardType="default"
                                value={password}
                                onChangeText={(userPassword) => setPassword(userPassword)}
                                autoCapitalize="none"
                                returnKeyType="done"
                                placeholder={`${translate('bvn.passwordPlaceholder')}`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={passwordInput}
                                style={{
                                    borderColor: isDarkMode ? colors.white : colors.companyBlue,
                                }}
                                secureTextEntry
                            />
                               <TouchableOpacity
                                onPress={() => setShowResetEmail(true)}
                            >
                                <Text
                                    style={[GET_STARTED, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                                >
                                    {translate('bvn.forgotPassword')}
                                </Text>
                            </TouchableOpacity>

                            <Button
                                style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                                textStyle={BUTTON_TEXT_GOOGLE}
                                loading={isLoading || loading}
                                disabled={isLoading || loading || phone.length !== 11 || password.length < 6}
                                onPress={() =>phone.length==11 ?  signInUserAsync({
                                    
                                    phone: phone,
                                    password
                                }):alert('Invalid phone number')}
                                // onPress={()=>console.warn('gg',phone.includes(''))}
                                tx={'bvn.buttonText'}
                                loadingTextX={'bvn.saving'}
                            />

                         
<TouchableOpacity
                                onPress={() => setShowRegister(true)}
                            >
                                <Text
                                    style={[GET_STARTED2, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                                >
                                    {translate('bvn.signUp')}
                                </Text>
                            </TouchableOpacity>
                        
                        </View>
                            
                    </ImageBackground>
            
                </ScrollView>
            </View>
            
            <Modal isVisible={showRegister}  onBackButtonPress={()=>setShowRegister(false)} style={{backgroundColor:'white'}}>
        <View style={{ flex: 1 }}>

        <Text
                        style={[GET_STARTED3, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                    >
                       Register as a new Rider
                    </Text>
        <View
                    style={{
                        padding: 20,
                        paddingTop:10,
                        backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
                        justifyContent: 'center',
                        borderRadius: 10,
                        alignSelf: 'center'
                    }}  
                >
                    
                    

                    <TextField
                        name="firstName"
            
                        value={firstName}
                        onChangeText={(fullName) => setFirstName(fullName)}
                        autoCapitalize="none"
                        returnKeyType="done"
                        placeholder={`${translate('bvn.firstName')}`}
                        placeholderTextColor={colors.dotColor}
                        // onSubmitEditing={() => passwordInput.current.focus()}
                  
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />



<TextField
                        name="lastName"

                        value={lastName}

                      
                      
                        onChangeText={(fullName) => setLastName(fullName)}
                        autoCapitalize="none"
                        returnKeyType="done"
                        placeholder={`${translate('bvn.lastName')}`}
                        placeholderTextColor={colors.dotColor}
        
   
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />



<TextField
                        name="email"
                        keyboardType="email-address"
                        value={emailRegister}
                        onChangeText={(userEmail) => setEmailRegister(userEmail)}
                        autoCapitalize="none"
                        returnKeyType="done"
                        placeholder={`${translate('bvn.enterEmail2')}`}
                        placeholderTextColor={colors.dotColor}
                        // onSubmitEditing={() => passwordInput.current.focus()}
                        forwardedRef={emailInput}
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />

<TextField
                        name="phone"
                        keyboardType="numeric"
                        value={phoneRegister}

                
                        onChangeText={(value) => setPhoneRegister(value)}
                        autoCapitalize="none"
                        returnKeyType="done"
                        placeholder={`${translate('bvn.phonePlaceholder')}`}
                        placeholderTextColor={colors.dotColor}
                        // onSubmitEditing={() => passwordInput.current.focus()}
                
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />



<TextField
                        name="passwordRegister"
                        secureTextEntry={true}
                        value={passwordRegister}
                        onChangeText={(value) => setPasswordRegister(value)}   
                      
                        returnKeyType="done"
                        placeholder={`${translate('bvn.passwordPlaceholder')}`}
                        placeholderTextColor={colors.dotColor}
                       
                      
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />
                    

                    <TextField
                        name="referredBy"
                        secureTextEntry={false}
                        value={referredBy}
                        onChangeText={(value) => setReferredBy(value)}   
                      
                        returnKeyType="done"
                        placeholder={`Referral Username (optional)`}
                        placeholderTextColor={colors.dotColor}
                       
                      
                        style={{
                            borderColor: isDarkMode ? colors.white : colors.companyBlue
                        }}
                    />
                    <Button
                        style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                        textStyle={BUTTON_TEXT_GOOGLE}
                        loading={isLoading || loading}
                        disabled={isLoading || loading}
                        onPress={() => {
                            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(re.test(String(emailRegister).toLowerCase())) {
                              SignUp()
                            } else {
                                Toast.show('Invalid Email Address', Toast.LONG);
                            }
                        }}
                        tx={'bvn.buttonText'}
                        loadingTextX={'bvn.saving'}
                    />

                </View>
               
        </View>
      </Modal>
    
      <Spinner visible={loading} color={'#0054C1'} />

        </KeyboardAvoidingView>
		
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    signInUserAsync: (values: authCredentials) => dispatch(signInUserAsync(values)),
    forgotPasswordAsync: (email: string) => dispatch(forgotPasswordAsync(email)),
    checkNotificationPermission: () => dispatch(checkNotificationPermissionAsync()),
	checkLocationPermissionAsync: () => dispatch(checkLocationPermissionAsync()),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
});

export const BVNScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(BVN);
