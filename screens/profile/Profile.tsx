// react
import React, { useState, useEffect } from "react";

// react-native
import {
	View, ViewStyle, StatusBar, Image, ImageBackground, Text, ScrollView, PermissionsAndroid, Platform
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from 'react-native-dark-mode';
// import * as ImagePicker from 'expo-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import { authCredentials, logOut, updateUserProfileAsync } from "../../redux/auth";
import {  } from "../../redux/auth";

// components
import { Button } from "../../components/button";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { CLOUDINARY_URL } from "@env"
import { Header } from "../../components/header";
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';


interface DispatchProps {
	notify: (message:string, type: string) => void
	updateUserProfileAsync: (values: authCredentials) => void
	logOut: () => void
}

interface StateProps {
	isLoading: boolean
	userPicture: string
	userName: string
	userEmail: string
	userPhone: string
	userDetails: any
	notificationId: string
	bankName: string
	accountNumber: string
	walletBalance: number
}

interface MyFormValues {

}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	// height: Layout.window.height,
};

const USER_NAME = {
	color: colors.black,
	fontFamily: fonts.robotoBold,
	fontSize: 20,
}

const ACCOUNT_BALANCE = {
	color: colors.profileBK,
	fontFamily: fonts.gilroyLight,
	marginTop: 5,
}

const EDIT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	width: '48%',
	backgroundColor: colors.companyBlue,
	height: 50
}

const LOG_OUT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	width: '80%',
	backgroundColor: colors.companyBlue,
	height: 50,
	marginBottom: 20
}

const EDIT_BUTTON_TEXT: TextStyle = {
	fontSize: 14,
	fontFamily: fonts.robotoBold,
	color: colors.white
}

const UPLOAD_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 8,
	width: '48%',
	backgroundColor: colors.white,
	height: 50,
	borderWidth: 1,
	borderColor: colors.dotColor
}

const UPLOAD_BUTTON_TEXT: TextStyle = {
	fontSize: 14,
	fontFamily: fonts.gilroyLight,
	color: colors.black
}

const SETTINGS_HEADER = {
	color: colors.black,
	fontFamily: fonts.robotoBold,
}

const SETTINGS_TITLE = {
	color: colors.profileBK,
	fontFamily: fonts.gilroyBold,
	marginVertical: 10,
}

const Profile = (props: Props) => {
	const {
		notify, isLoading, notificationId, userPicture, userName, userPhone, userEmail, navigation, updateUserProfileAsync, userDetails, logOut,
		bankName, accountNumber, walletBalance
	} = props
	const [selectedImage, setSelectedImage] = useState({})
	const [photo, setPhoto] = useState('')
	const [loading, setLoading] = useState(false)
    const isDarkMode = useDarkMode()

	const [userDataDB, setuserDataDB] = useState(null)

	console.tron.log(userDetails)

	useEffect(() => {
        updateBackground()
		console.warn('lllll',userDetails)
		getUserData();
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('didFocus', () => {
            updateBackground()
        });
        updateBackground()

    }, [isDarkMode])

	const getUserData = async () =>{
		setLoading(true);
		try {
			  const info = await AsyncStorage.getItem("user");
			  console.warn("userDetails", info);
		
			  console.warn("userDetails >>>>333token", userDetails.token);
			  let res = await axios({
			      method: 'GET',
			      url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/profile`,
		
			      headers: {
			      Authorization:`Bearer ${userDetails.token}`,
			      },
		
			  });
			  if (res) {
				  console.warn('\\ success UserData>>>',res.data)
				  setuserDataDB(res.data)
				  setLoading(false)
			  }
			} catch (err) {
			  setLoading(false);
			  console.warn("call err>>>>>>>>>>>>>", err);
			}
			
	}

	const updatePhotoDb = async (url: string) =>{
		console.log('<<<<<<<<PHOTO URL>>>>>>>', url);
		try {
			  setLoading(true);
			  const info = await AsyncStorage.getItem("user");
			  console.warn("userDetails", info);
		
			  console.warn("userDetails >>>>333token", userDetails.token);
			let res = await axios({
				method: 'PUT',
				url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/${userDetails.id}`,
		
				headers: {
				Authorization:`Bearer ${userDetails.token}`,
				},
				data:{
					"photoUrl": url,
				}
			});
			  if (res) {
				  console.warn('\\ success PHOTOUPDATE>>>',res.data)
				  await getUserData();
				  setLoading(false)
			  }
			} catch (err) {
			  setLoading(false);
			  console.warn("call err>>>>>>>>>>>>>", err);
			}
	}




	const PickImage = () => {
		ImagePicker.openPicker({
		  width: 300,
		  height: 400,
		  borderRadius: 200,
		  cropping: true,
		  freeStyleCropEnabled: true,
		  compressImageQuality: 0.1,
		})
		  .then(response => {
			console.warn('jjjjjj', response);
	
			const uri = response.path;
			const type = response.mime;
			const name = response.modificationDate;
	
			const source = {
			  uri,
			  type,
			  name,
			};
	
			console.warn('sourceeeee', source);
			uploadAvatar(source);
			
			console.warn('Photo selected');
		  })
		  .catch(e => {
			console.warn('cancel');
			console.warn(e);
		  });
	  };

	  const uploadAvatar = async value => {
		setLoading(true);
	
		console.warn('<<<PHOTO>>>', value);
		const data = new FormData();
	
		data.append('file', value);
		data.append('upload_preset', 'rleqlg89');
		data.append('cloud_name', 'cydene-express');
		var url = 'https://api.cloudinary.com/v1_1/cydene-express/upload';
		const con = {
		  headers: {'X-Requested-With': 'XMLHttpRequest'},
		};
	
		console.log({data});
	
		fetch('https://api.cloudinary.com/v1_1/cydene-express/upload', {
		  method: 'post',
		  body: data,
		})
		  .then(res => res.json())
		  .then(async dat => {
			setLoading(false);
		
			console.warn('<<<<<<<<response done>>>>>>>', dat.secure_url);
			setPhoto(dat.secure_url);

		
			updateUserProfileAsync({
				"photo": {
				"id":userDetails.photo? userDetails.photo.id?userDetails.photo.id:'':'',
				"url": dat.secure_url
				},
			})
			await updatePhotoDb(dat.secure_url);
			setPhoto(dat.secure_url);
		  })
		  .catch(err => {
			setLoading(false);
			console.warn('An Error Occured While Uploading', err);
		  });
	  };
	


    const updateBackground = () => {
        navigation.setParams({
            isDarkMode: isDarkMode
        })
        StatusBar.setBarStyle('light-content');
        Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyDarkGreen)
    }

	const askForPerminssions = async () => {
		if (Platform.OS === 'android') {
			try {
			  const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				{
				  title: 'External Storage Write Permission',
				  message: 'App needs access to Storage data',
				},
			  );
			  return granted === PermissionsAndroid.RESULTS.GRANTED;
			} catch (err) {
			  notify('Write permission err', 'danger');
			  return false;
			}
		} else {
			return true;
		}
	}

// 	const openImagePickerAsync = async () => {
// 		setLoading(true)
// try{
// 		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
// 		if (permissionResult.granted === false) {
// 			setLoading(false)
// 			notify('Permission to access camera roll is required!', 'danger');
// 		  return;
// 		}

// 		let pickerResult = await ImagePicker.launchImageLibraryAsync({
// 		  allowsEditing: true,
// 		  aspect: [4, 3],
// 		  base64: true
// 		});

// 		if (pickerResult.cancelled === true) {
// 			setLoading(false)
// 		  	return;
// 		}

// 		setSelectedImage({ localUri: pickerResult.uri });

// 		let base64Img = `data:image/jpg;base64,${pickerResult.base64}`;

// 		let data = {
// 		  "file": base64Img,
// 		  "upload_preset": "rleqlg89",
// 		}
// 		//bcbccbcb

// 		fetch(CLOUDINARY_URL, {
// 		  body: JSON.stringify(data),
// 		  headers: {
// 			'content-type': 'application/json'
// 		  },
// 		  method: 'POST',
// 		}).then(async r => {
// 			let data = await r.json()
// 			setLoading(false)
// 			setPhoto(data.secure_url);
// 			updateUserProfileAsync({
// 				"photo": {
// 				"id":userDetails.photo? userDetails.photo.id?userDetails.photo.id:'':'',
// 				"url": data.secure_url
// 				},
// 			})
// 		}).catch(err => {
// 			console.warn('error1',err)
			
// 			setLoading(false)
// 		})
// 	}catch(e){
// 		console.warn('error',e)
// 	}
// 	  };

	return (
		<ScrollView
			bounces={false}
			showsVerticalScrollIndicator={false}
		>
			<ImageBackground
				source={isDarkMode? images.profileDark : images.profileBkDark}
				style={ROOT}
				resizeMethod="auto"
				resizeMode="stretch"
			>

				<View
                    style={{
                        backgroundColor: colors.companyDarkGreen
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
                            color: colors.white
                        }}
                        titleTx={'profile.headerText'}
                    />
                </View>

				<View
					style={{
						backgroundColor: isDarkMode ? colors.settingsSubView : colors.white,
						width: Layout.window.width / 1.15,
						padding: 20,
						marginTop: 10,
						borderRadius: 16,
						elevation: 10,
						shadowColor: colors.companyDarkGreen,
						shadowOffset: { width: 0, height: 10 },
						shadowOpacity: 0.1,
						alignSelf: 'center'
					}}
				>

					<View
						style={{
							flexDirection: 'row',
							
						}}
					>
						<Image
							source={{ uri: userDataDB !== null ? userDataDB.photo : userPicture? `${userPicture}`:photo?photo:userDetails.photo
								 }}
							style={{
								width: Layout.window.width / 4,
								height: Layout.window.height / 8,
								borderRadius: 16
							}}
							resizeMethod={'auto'}
						/>

						<View
							style={{
								marginLeft: 20
							}}
						>
							<Text
								style={[USER_NAME, {
									color: colors.black,
									width: Layout.window.width * 0.5,

								}]}
							>
								{userName}
							</Text>

							<Text
								style={ACCOUNT_BALANCE}
							>
								{translate('profile.userType')}
							</Text>

							<View
								style={{
									padding: 20,
									width: Layout.window.width / 2.1,
									backgroundColor: isDarkMode ? colors.white : colors.settingsSubView,
									marginTop: 20,
									borderRadius: 8
								}}
							>
								<Text
									style={{
										color: colors.companyDarkGreen,
										fontFamily: fonts.gilroyBold,
									}}
								>
									{translate('profile.walletBalance', {
										walletBalance:  userDataDB !== null ? userDataDB?.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  : walletBalance ? walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'
									})}
								</Text>

							</View>

						</View>
					</View>

					<View>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginTop: 20
							}}
						>
							<Button
								loading={loading || isLoading}
								disabled={loading || isLoading}
								style={[UPLOAD_BUTTON, { backgroundColor: isDarkMode ? colors.white : colors.white }]}
								textStyle={[UPLOAD_BUTTON_TEXT, { color: colors.companyDarkGreen }]}
								onPress={() => PickImage()}
								// onPress={() =>console.warn('test')}
								tx={`profile.upload`}
								loadingTextX={'profile.loading'}
							/>

							<Button
								style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
								textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
								onPress={() => navigation.navigate('editProfile')}
								tx={`profile.edit`}
								disabled={loading || isLoading}
								loadingTextX={'profile.edit'}
							/>
						</View>

					</View>

				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginTop: 40,
						flexDirection: 'row'
					}}
				>
					<View
						style={{
							backgroundColor: isDarkMode ? colors.white : colors.companyDarkGreen,
							padding: 12,
							borderRadius: 8
						}}
					>
						<Image
							source={images.settings}
							style={{
								tintColor: isDarkMode ? colors.companyDarkGreen : colors.white
							}}
						/>
					</View>

					<View
						style={{
							marginLeft: 20
						}}
					>
						<Text
							style={[SETTINGS_HEADER, {
								color: isDarkMode ? colors.white : colors.black
							}]}
						>
							{translate('profile.account')}
						</Text>

						<Text
							style={[ACCOUNT_BALANCE, {
								color: isDarkMode ? colors.white : colors.profileBK
							}]}
						>
							{translate('profile.editAccount')}
						</Text>
					</View>
				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginTop: 20,
						backgroundColor: colors.settingsSubView,
						paddingHorizontal: 20,
						paddingVertical: 15,
						borderRadius: 16,
						justifyContent: 'space-between'
					}}
				>
					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.email')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						{userEmail}
					</Text>

					<View
						style={{
							height: 1,
							width: '100%',
							backgroundColor: colors.dotColor,
							marginVertical: 15
						}}
					/>

					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.phone')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						{userPhone || translate('profile.emptyPhone')}
					</Text>

				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginTop: 40,
						flexDirection: 'row'
					}}
				>
					<View
						style={{
							backgroundColor: isDarkMode ? colors.white : colors.companyDarkGreen,
							padding: 12,
							borderRadius: 8
						}}
					>
						<Image
							source={images.wallet}
							style={{
								tintColor: isDarkMode ? colors.companyDarkGreen : colors.white
							}}
						/>
					</View>

					<View
						style={{
							marginLeft: 20
						}}
					>
						<Text
							style={[SETTINGS_HEADER, {
								color: isDarkMode ? colors.white : colors.black
							}]}
						>
							{translate('profile.wallet')}
						</Text>

						<Text
							style={[ACCOUNT_BALANCE, {
								color: isDarkMode ? colors.white : colors.profileBK
							}]}
						>
							{translate('profile.walletBody')}
						</Text>
					</View>
				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginTop: 20,
						backgroundColor: colors.settingsSubView,
						paddingHorizontal: 20,
						paddingVertical: 15,
						borderRadius: 16,
						justifyContent: 'space-between'
					}}
				>
					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.bankName')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						{/* {bankName} */}
						{userDataDB !== null ? userDataDB?.bankName : bankName}
					</Text>

					<View
						style={{
							height: 1,
							width: '100%',
							backgroundColor: colors.dotColor,
							marginVertical: 15
						}}
					/>

					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.accounNumber')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						{userDataDB !== null ? userDataDB?.payoutNumber : accountNumber}
					</Text>

				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginTop: 40,
						flexDirection: 'row'
					}}
				>
					<View
						style={{
							backgroundColor: isDarkMode ? colors.white : colors.companyDarkGreen,
							padding: 12,
							borderRadius: 8
						}}
					>
						<Image
							source={images.information}
							style={{
								tintColor: isDarkMode ? colors.companyDarkGreen : colors.white
							}}
						/>
					</View>

					<View
						style={{
							marginLeft: 20
						}}
					>
						<Text
							style={[SETTINGS_HEADER, {
								color: isDarkMode ? colors.white : colors.black
							}]}
						>
							{translate('profile.help')}
						</Text>

						<Text
							style={[ACCOUNT_BALANCE, {
								color: isDarkMode ? colors.white : colors.profileBK
							}]}
						>
							{translate('profile.helpBody')}
						</Text>
					</View>
				</View>

				<View
					style={{
						width: Layout.window.width / 1.15,
						alignSelf: 'center',
						marginVertical: 20,
						backgroundColor: colors.settingsSubView,
						paddingHorizontal: 20,
						paddingVertical: 15,
						borderRadius: 16,
						justifyContent: 'space-between'
					}}
				>
					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.phoneVersion')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						1.0.1
					</Text>

					<View
						style={{
							height: 1,
							width: '100%',
							backgroundColor: colors.dotColor,
							marginVertical: 15
						}}
					/>

					<Text
						style={SETTINGS_TITLE}
					>
						{translate('profile.about')}
					</Text>

					<Text
						style={SETTINGS_HEADER}
					>
						cydene.com
					</Text>

				</View>

				<Button
					style={[LOG_OUT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
					textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
					onPress={() => {
						// logOut()
						navigation.navigate('Bvn')
					}}
					tx={`profile.logOut`}
				/>



			</ImageBackground>

		</ScrollView>
	)
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	notify: (message:string, type: string) => dispatch(notify(message, type)),
	updateUserProfileAsync: (values: authCredentials) => dispatch(updateUserProfileAsync(values)),
	logOut: () => dispatch(logOut())
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	isLoading: state.auth.loading,
	userPicture: state.auth.user.photo ? state.auth.user.photo.url : '',
	userName: `${state.auth.user.firstName} ${state.auth.user.lastName}`,
	userEmail: `${state.auth.user.email}`,
	userPhone: state.auth.user.phone || '',
	userDetails: state.auth.user,
	notificationId: state.auth.notificationId,
	bankName: state.auth.user.bankName,
	accountNumber: state.auth.user.payoutNumber,
    walletBalance: state.auth.user.wallet ? state.auth.user.wallet.availableBalance : 'N/A'
});

export const ProfileScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Profile);
