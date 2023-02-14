// react
import React, { useState, useEffect, useRef } from "react"

// react-native
import {
	View, ViewStyle, ScrollView, Image, ImageStyle, Text, TextStyle, StatusBar, ImageBackground, Platform, Keyboard,
    KeyboardAvoidingView
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode'


// redux
import { ApplicationState } from "../../redux";
import {notify} from "../../redux/startup";
import { authCredentials, createWalletAsync, resetPasswordAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { TextField } from "../../components/text-field";
import { formatResetPassword, formatPhoneNumber, formatResetCode } from "../../utils/formatters";
import { TouchableOpacity } from "react-native-gesture-handler";

interface DispatchProps {
    notify: (message:string, type: string) => void,
    createWalletAsync: (bvn: string) => void
    resetPasswordAsync: (values: authCredentials) => void
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


const ResetPassword = (props: Props) => {
	const { navigation, isLoading, resetPasswordAsync } = props
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [resetCode, setResetCode] = useState('')
    const [password, setPassword] = useState('')

    console.tron.log(navigation.state.params.email)

    let resetCodeInput = useRef()
    let passwordInput = useRef()

	const isDarkMode = useDarkMode()

	useEffect(() => {
		StatusBar.setBarStyle('light-content')
		Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyBlue)
	})

	return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            style={{
                flex: 1
            }}
        >

            <View
                style={ROOT}
            >
                <ScrollView>
                    <ImageBackground
                        source={isDarkMode ? images.darkBackground : images.backgroundImage}
                        style={BACKGROUND_IMAGE}
                    >
                        <Header
                            leftIcon="arrowBackWhite"
                            navigation={navigation}
                            onLeftPress={() => navigation.navigate('Bvn')}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                        />
                        
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image 
                                source={isDarkMode ? images.appLogoWhite: images.appLogoBlue}
                                style={{
                                    marginTop: Layout.window.height / 10
                                }}
                            />

                            <Text
                                style={[GET_STARTED, { color: isDarkMode ? colors.white : colors.companyBlue }]}
                            >
                                {translate('bvn.reset')}
                            </Text>

                            <TextField
                                name="resetCode"
                                keyboardType="phone-pad"
                                value={resetCode}
                                onChangeText={(reset) => setResetCode(formatResetCode(reset))}
                                autoCapitalize="none"
                                returnKeyType="next"
                                placeholder={`${translate('bvn.enterCode')}`}
                                placeholderTextColor={colors.dotColor}
                                // onSubmitEditing={() => passwordInput.current.focus()}
                                forwardedRef={resetCodeInput}
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
                                placeholder={`${translate('bvn.newPassword')}`}
                                placeholderTextColor={colors.dotColor}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                forwardedRef={passwordInput}
                                style={{
                                    borderColor: isDarkMode ? colors.white : colors.companyBlue,
                                }}
                                secureTextEntry
                            />

                            <Button
                                style={isDarkMode ? BUTTON_FACEBOOK_DARK : BUTTON_GOOGLE}
                                textStyle={BUTTON_TEXT_GOOGLE}
                                loading={isLoading || loading}
                                disabled={isLoading || loading || resetCode.length !== 11 }
                                onPress={() => {
                                    resetPasswordAsync({
                                        email: navigation.state.params.email,
                                        resetCode: resetCode.replace(/\D/g,''),
                                        password
                                    })
                                }}
                                tx={'bvn.buttonText'}
                                loadingTextX={'bvn.saving'}
                            />

                        
                        </View>
                            
                    </ImageBackground>
            
                </ScrollView>
            </View>
            
        </KeyboardAvoidingView>
		
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	createWalletAsync: (bvn: string) => dispatch(createWalletAsync(bvn)),
	notify: (message:string, type: string) => dispatch(notify(message, type)),
    resetPasswordAsync: (values: authCredentials) => dispatch(resetPasswordAsync(values))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
});

export const ResetPasswordScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ResetPassword);
