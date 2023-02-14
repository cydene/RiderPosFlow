// third-parties
import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash';

// Redux
import { ApplicationState } from ".."
import {
	authCredentials,
	SET_AUTH_EMAIL,
	SET_AUTH_COMPANY_NAME,
	SET_AUTH_PASSWORD,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	UPDATE_USER_PROFILE,
	UPDATE_USER_PROFILE_FAILURE,
	UPDATE_USER_PROFILE_SUCCESS,
	SET_AUTH_FULL_NAME,
	SET_USER_DETAILS,
	SIGN_UP_INDIVIDUAL,
	LOGOUT,
	SET_FCM_TOKEN,
	SET_PHONE_NUMBER,
	SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS,
	FETCH_MY_ORDERS,
	FETCH_MY_ORDERS_FAILURE,
	FETCH_MY_ORDERS_SUCCESS,
	FETCH_GAS_PRICE,
	FETCH_GAS_PRICE_FAILURE,
	FETCH_GAS_PRICE_SUCCESS,
	FETCH_BANKS,
	FETCH_BANKS_FAILURE,
	FETCH_BANKS_SUCCESS,
	FETCH_SETTINGS,
	FETCH_SETTINGS_FAILURE,
	FETCH_SETTINGS_SUCCESS,
	SET_DELIVERY_PRICE,
	ORDER_PRODUCT,
	ORDER_PRODUCT_FAILURE,
	ORDER_PRODUCT_SUCCESS,
	FETCH_WALLET,
	FETCH_WALLET_FAILURE,
	FETCH_WALLET_SUCCESS,
	WITHDRAW_FUNDS,
	WITHDRAW_FUNDS_FAILURE,
	WITHDRAW_FUNDS_SUCCESS,
	FETCH_NEW_ORDERS_SUCCESS,
	FETCH_NEW_ORDERS_FAILURE,
	FETCH_INPROGRESS_ORDERS_FAILURE,
	FETCH_INPROGRESS_ORDERS_SUCCESS,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_FAILURE,
	FORGOT_PASSWORD_SUCCESS,
	EDIT_PASSWORD,
	EDIT_PASSWORD_SUCCESS,
	EDIT_PASSWORD_FAILURE,
	START_TRIP,
	START_TRIP_FAILURE,
	START_TRIP_SUCCESS,
	UPDATE_USER_LOCATION,
	UPDATE_USER_LOCATION_FAILURE,
	UPDATE_USER_LOCATION_SUCCESS,
	COMPLETE_TRIP,
	COMPLETE_TRIP_FAILURE,
	COMPLETE_TRIP_SUCCESS,
	CANCEL_TRIP,
	CANCEL_TRIP_FAILURE,
	CANCEL_TRIP_SUCCESS,
	FETCH_WALLET_TRANSACTIONS,
	FETCH_WALLET_TRANSACTIONS_FAILURE,
	FETCH_WALLET_TRANSACTIONS_SUCCESS,
	FETCH_WALLET_BALANCE,
	FETCH_WALLET_BALANCE_FAILURE,
	FETCH_WALLET_BALANCE_SUCCESS,
	GET_ALL_PRODUCTS,
	GET_ALL_PRODUCTS_FAILURE,
	GET_ALL_PRODUCTS_SUCCESS,
	CREATE_PRODUCT,
	CREATE_PRODUCT_FAILURE,
	CREATE_PRODUCT_SUCCESS,
	GET_MY_PRODUCTS,
	GET_MY_PRODUCTS_FAILURE,
	GET_MY_PRODUCTS_SUCCESS,
} from "./auth.types";
import { notify } from "../startup";
import axios from 'axios'
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "@env"


// APIs
import {
	signUpIndividual as apiSignUpIndividual,
	deleteInventory as apiDeleteInventory,
	toggleInventory as apiToggleInventory,
	signInUser as apiSignInUser,
	forgotPassword as apiForgotPassword,
	editPassword as apiEditPassword,
	fetchPredictionsFromServer as apiFetchPredictionsFromServer,
	fetchSuggestionsFromServer as apiFetchSuggestionsFromServer,
	fetchSuggestionsFromPharmacy as apiFetchSuggestionsFromPharmacy,
	fetchSellingPharmaciesFromServer as apiFetchSellingPharmaciesFromServer,
	fetchSellingPharmacyFromServer as apiFetchSellingPharmacyFromServer,
	fetchPharmacies as apiFetchPharmacies,
	fetchLatitudeAndLongitudeFromServer as apiFetchLatitudeAndLongitudeFromServer,
	createTransactionFromServer as apiCreateTransactionFromServer,
	confirmPayment as apiConfirmPayment,
	fetchMyOrders as apiFetchMyOrders,
	fetchMyOrdersPharmacy as apiFetchMyOrdersPharmacy,
	updateOrderStatus as apiUpdateOrderStatus,
	userUpdateOrderStatus as apiUserUpdateOrderStatus,
	updateUser as apiUpdateUser,
	updateUserLocation as apiUpdateUserLocation,
	fetchWalletBalance as apiFetchWalletBalance,
	createProduct as apiCreateProduct,
	editProduct as apiEditProduct,
	editAProduct as apiEditAProduct,


	fetchGasPrice as apiFetchGasPrice,
	fetchSettings as apiFetchSettings,
	orderProduct as apiOrderProduct,
	fetchWallet as apiFetchWallet,
	withdrawFunds as apiWithdrawFunds,
	startOrder as apiStartOrder,
	completeOrder as apiCompleteOrder,
	cancelOrder as apiCancelOrder,
	FetchWalletTransactions as apiFetchWalletTransactions,
	getAllProducts as apiGetAllProducts,
	getMyProducts as apiGetMyProducts,

} from "../../services/api"
import { NavigationActions } from "react-navigation";
import { SAVE_LOCATION_NAME, SAVE_LOCATION_ADDRESS, SAVE_LOCATION_DETAILS, SAVE_LOCATION_GEOMETRY } from "../device";

export const setFCMToken = (payload: string) => ({
	type: SET_FCM_TOKEN,
	payload
})

export const setAuthFullName = (payload: string | undefined) => ({
	type: SET_AUTH_FULL_NAME,
	payload
})

export const setAuthEmail = (payload: string) => ({
	type: SET_AUTH_EMAIL,
	payload
})

export const setAuthPassword = (payload: string | undefined) => ({
	type: SET_AUTH_PASSWORD,
	payload
})

export const setAuthUserType = (payload: string | undefined) => ({
	type: SET_AUTH_USER_TYPE,
	payload
})

export const setAuthFolioNumber = (payload: string | undefined) => ({
	type: SET_AUTH_FOLIO_NUMBER,
	payload
})

export const signUpIndividual = () => ({
	type: SIGN_UP_INDIVIDUAL,
})

export const signUpIndividualFailure = () => ({
	type: SIGN_UP_INDIVIDUAL_FAILURE,
})

export const signUpIndividualSuccess = () => ({
	type: SIGN_UP_INDIVIDUAL_SUCCESS,
})

export const setUserDetails = (user: { details: any }) => ({ type: SET_USER_DETAILS, payload: user })

export const signUpIndividualAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {

	dispatch(signUpIndividual())

	const newValues = {
		...values,
		phone: values.phone?.replace('+234', '0')
	}

	try {
		const result = await apiSignUpIndividual(newValues)
		const { kind, data } = result

		console.warn('this is the result',result)

		if (kind === "ok") {
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(signUpIndividualSuccess())
			dispatch(setUserDetails(data))
			dispatch(notify(`Success`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'Bvn' }))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(signUpIndividualFailure())
		}
	} catch ({ message }) {
		dispatch(signUpIndividualFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


const withdrawFunds = () => ({
	type: WITHDRAW_FUNDS
})

const withdrawFundsFailure = () => ({
	type: WITHDRAW_FUNDS_FAILURE
})

const withdrawFundsSuccess = () => ({
	type: WITHDRAW_FUNDS_SUCCESS
})

export const withdrawFundsAsync = (amount: string, narration: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(withdrawFunds())
	const userToken = getState().auth.user.token
	const userId = getState().auth.user.id
	const accountNumber = getState().auth.user.payoutNumber
	const email = getState().auth.user.email

	try {
		const result = await apiWithdrawFunds(userToken, {
			amount: parseInt(amount),
			narration,
			email
		})
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(withdrawFundsSuccess())
			dispatch(fetchWalletAsync(accountNumber))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(withdrawFundsFailure())
		}

	} catch ({ message }) {
		dispatch(withdrawFundsFailure())
	}
}


const fetchMyOrders = () => ({
	type: FETCH_MY_ORDERS
})

const fetchMyOrdersFailure = () => ({
	type: FETCH_MY_ORDERS_FAILURE
})

const fetchMyOrdersSuccess = (payload: Array<any>) => ({
	type: FETCH_MY_ORDERS_SUCCESS,
	payload
})

const fetchNewOrdersSuccess = (payload: Array<any>) => ({
	type: FETCH_NEW_ORDERS_SUCCESS,
	payload
})

const fetchNewOrdersFailure = () => ({
	type: FETCH_NEW_ORDERS_FAILURE
})

const fetchInProgressrdersSuccess = (payload: Array<any>) => ({
	type: FETCH_INPROGRESS_ORDERS_SUCCESS,
	payload
})

const fetchInProgressrdersFailure = () => ({
	type: FETCH_INPROGRESS_ORDERS_FAILURE
})

export const fetchMyOrdersAsync = (type: string, max?: number): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(fetchMyOrders())
	const userToken = getState().auth.user.token
	const limit = max || 10

	try {
		const result = await apiFetchMyOrders(userToken, type, limit)
		const { kind, data } = result

		if (kind === "ok") {
			if (Object.keys(data) !== undefined && Object.keys(data).length > 0) {
				const pending = data.filter(function (order: { status: string; }) {
					return order.status === "Assigned";
				});

				const inProgress = data.filter(function (order: { status: string; }) {
					return order.status === "EnRoute" || order.status === "Arrived";
				});

				const completed = data.filter(function (order: { status: string; }) {
					return order.status === "Completed" || order.status === "Canceled" || order.status === "Expired";
				});

				if (type === "New") dispatch(fetchNewOrdersSuccess(pending))
				if (type === "Old") dispatch(fetchMyOrdersSuccess(completed))
				if (type === "InProgress") dispatch(fetchInProgressrdersSuccess(inProgress))
			} else {
				if (type === "New") dispatch(fetchNewOrdersSuccess([]))
				if (type === "Old") dispatch(fetchMyOrdersSuccess([]))
				if (type === "InProgress") dispatch(fetchInProgressrdersSuccess([]))
			}
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
		}

	} catch ({ message }) {
		dispatch(fetchMyOrdersFailure())
	}
}

const orderProduct = () => ({
	type: ORDER_PRODUCT
})

const orderProductFailure = () => ({
	type: ORDER_PRODUCT_FAILURE
})

const orderProductSuccess = (payload: Array<any>) => ({
	type: ORDER_PRODUCT_SUCCESS,
	payload
})

export const orderProductAsync = (details: object): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	console.tron.log(details)
	const orderData = {
		deliveryAddress: getState().device.locationName,
		additionalInformation: "",
		deliveryLongitude: getState().device.location.coords.longitude,
		deliveryLatitude: getState().device.location.coords.latitude,
		cardId: 4,
		details
	}
	console.tron.log(orderData, "orderData")

	dispatch(orderProduct())
	const userToken = getState().auth.user.token

	try {
		const result = await apiOrderProduct(userToken, orderData)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(orderProductSuccess(data))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(orderProductFailure())
		}

	} catch ({ message }) {
		dispatch(orderProductFailure())
	}
}


const fetchGasPrice = () => ({
	type: FETCH_GAS_PRICE
})

const fetchGasPriceFailure = () => ({
	type: FETCH_GAS_PRICE_FAILURE
})

const fetchGasPriceSuccess = (payload: Array<any>) => ({
	type: FETCH_GAS_PRICE_SUCCESS,
	payload
})

export const fetchGasPriceAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(fetchGasPrice())
	const userToken = getState().auth.user.token

	try {
		const result = await apiFetchGasPrice(userToken)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(fetchGasPriceSuccess(data))
			dispatch(apiFetchSettingsAsync())
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(fetchGasPriceFailure())
		}

	} catch ({ message }) {
		dispatch(fetchGasPriceFailure())
	}
}

const fetchSettings = () => ({
	type: FETCH_SETTINGS
})

const fetchSettingsFailure = () => ({
	type: FETCH_SETTINGS_FAILURE
})

const fetchSettingsSuccess = (payload: Array<any>) => ({
	type: FETCH_SETTINGS_SUCCESS,
	payload
})

const setDeliveryPrice = (payload: string) => ({
	type: SET_DELIVERY_PRICE,
	payload
})

export const apiFetchSettingsAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(fetchSettings())
	const userToken = getState().auth.user.token

	try {
		const result = await apiFetchSettings(userToken)
		const { kind, data } = result

		console.tron.log(result.data)

		if (kind === "ok") {
			let baseFare = result.data[5].value
			let amountPerDistance = result.data[4].value
			let amountPerTime = result.data[3].value
			let deliveryPrice = (parseInt(baseFare) + parseInt(amountPerDistance)) * parseInt(amountPerTime)

			console.tron.log(baseFare, 'baseFare')
			console.tron.log(amountPerDistance, 'amountPerDistance')
			console.tron.log(amountPerTime, 'amountPerTime')
			console.tron.log(deliveryPrice, 'deliveryPrice')


			dispatch(fetchSettingsSuccess(data))
			dispatch(setDeliveryPrice(deliveryPrice.toString()))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(fetchSettingsFailure())
		}

	} catch ({ message }) {
		dispatch(fetchSettingsFailure())
	}
}


const fetchBanks = () => ({
	type: FETCH_BANKS
})

const fetchBanksFailure = () => ({
	type: FETCH_BANKS_FAILURE
})

const fetchBanksSuccess = (payload: Array<any>) => ({
	type: FETCH_BANKS_SUCCESS,
	payload
})

export const fetchBanksAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(fetchBanks())

	try {
		await axios.get(`https://sandbox.monnify.com/api/v1/sdk/transactions/banks`)
			.then((response) => {
				const { data } = response
				console.tron.log(response)
				if (data.requestSuccessful) {
					dispatch(fetchBanksSuccess(data.responseBody))
				} else {
					dispatch(fetchBanksFailure())
				}
			})
			.catch(err => {
				dispatch(fetchBanksFailure())
			})
	} catch (error) {
		dispatch(fetchBanksFailure())
	}
}


export const FetchWalletTransactions = () => ({
	type: FETCH_WALLET_TRANSACTIONS
})

export const FetchWalletTransactionsFailure = () => ({
	type: FETCH_WALLET_TRANSACTIONS_FAILURE
})

export const FetchWalletTransactionsSuccess = (payload: Array<any>) => ({
	type: FETCH_WALLET_TRANSACTIONS_SUCCESS,
	payload
})

export const FetchWalletTransactionsAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token
	const userId = getState().auth.user.id

	console.tron.log(getState().auth.user)


	dispatch(FetchWalletTransactions())

	try {
		const result = await apiFetchWalletTransactions(userId, userToken)
		const { kind, data } = result
		console.tron.log(data)

		if (kind === "ok") {
			dispatch(FetchWalletTransactionsSuccess(data))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(FetchWalletTransactionsFailure())
		}
	} catch ({ message }) {
		dispatch(FetchWalletTransactionsFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const fetchWalletBalance = () => ({
	type: FETCH_WALLET_BALANCE
})

export const fetchWalletBalanceFailure = () => ({
	type: FETCH_WALLET_BALANCE_FAILURE
})

export const fetchWalletBalanceSuccess = () => ({
	type: FETCH_WALLET_BALANCE_SUCCESS
})

export const fetchWalletBalanceAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token
	const accountNumber = getState().auth.user.payoutNumber
	const user = getState().auth.user
	const wallet = getState().auth.user.wallet

	console.tron.log(getState().auth.user, "<=== USER")
	console.log(user, "<=== WALLET")
	console.log(accountNumber, "<=== accountNumber")


	dispatch(fetchWalletBalance())

	try {
		const result = await apiFetchWalletBalance(accountNumber, userToken)
		const { kind, data } = result
		console.tron.log(data)

		if (kind === "ok") {
			dispatch(fetchWalletBalanceSuccess())
			const userObject = {
				...getState().auth.user,
				wallet: {
					...data
				}
			}

			console.log(userObject, "userObject")
			// @ts-ignore
			dispatch(setUserDetails(userObject))
			console.log(getState().auth.user, "userObjectII")

		} else {
			// dispatch(notify(`${data.message}`, 'danger'))
			dispatch(fetchWalletBalanceFailure())
		}
	} catch ({ message }) {
		dispatch(fetchWalletBalanceFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}



export const setAuthCompanyName = (payload: string | undefined) => ({
	type: SET_AUTH_COMPANY_NAME,
	payload
})

export const setPhoneNumber = (payload: string | undefined) => ({
	type: SET_PHONE_NUMBER,
	payload
})

export const signInUser = () => ({
	type: SIGN_IN_USER,
})

export const signInUserFailure = () => ({
	type: SIGN_IN_USER_FAILURE,
})

export const signInUserSuccess = () => ({
	type: SIGN_IN_USER_SUCCESS,
})

const SaveUser = async (data) => {
	try {
		await AsyncStorage.setItem('user', JSON.stringify(data));
		console.warn('saved user>>>', data)
	} catch (e) {
		console.warn('error user', e)
	}
}
const SaveToken = async (data) => {
	try {
		await AsyncStorage.setItem('token', JSON.stringify(data));
		console.warn('saved token', data)
	} catch (e) {
		console.warn('error token', data)
	}
}


export const signInUserAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const notificationId = getState().auth.notificationId

	const newValues = {
		...values,
		notificationId
	}

	console.warn("VALUES ===> pls check this well should have noty id", newValues)


	dispatch(signInUser())

	try {
		const result = await apiSignInUser({ ...newValues })
		const { kind, data } = result

		console.warn('loggin in', result)
		SaveUser(data)
		if(data.token){
			SaveToken(data.token)
		}
	

		if (kind === "ok") {
			dispatch(signInUserSuccess())
			dispatch(setUserDetails({
				...data,
				wallet: {
					availableBalance: data.wallet.balance
				}
			}))
			console.warn('data>>>>', data)
			// dispatch(notify(`Success`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'dashboard' }))
			dispatch(updateUserProfileAsync({
				"firstName": data.firstName,
				"lastName": data.lastName,
				"phone": data.phone,
				"photo": {
					"id": data.photo.id,
					"url": data.photo.url
				},
				"isOnline": data.isOnline,
			}))
		} else {
			if(result.data.message){
				dispatch(notify(`${result.data.message}`, 'danger'))
			}else{
				console.warn('thisssss>>>>',result)
				dispatch(notify(`Login Failed`, 'danger'))
			}
			
			dispatch(signInUserFailure())
		}
	} catch ({ message }) {
		dispatch(signInUserFailure())
		// dispatch(notify(`${message}Login Failed2`, 'danger'))
	}
}


export const forgotPassword = () => ({
	type: FORGOT_PASSWORD,
})

export const forgotPasswordFailure = () => ({
	type: FORGOT_PASSWORD_FAILURE,
})

export const forgotPasswordSuccess = () => ({
	type: FORGOT_PASSWORD_SUCCESS,
})

export const forgotPasswordAsync = (email: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	console.tron.log("VALUES ===>", email)
	dispatch(forgotPassword())

	try {
		const result = await apiForgotPassword(email)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(forgotPasswordSuccess())
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(NavigationActions.navigate({
				routeName: 'resetPassword', params: {
					email
				}
			}))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(forgotPasswordFailure())
		}
	} catch ({ message }) {
		dispatch(forgotPasswordFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const resetPassword = () => ({
	type: EDIT_PASSWORD,
})

export const resetPasswordFailure = () => ({
	type: EDIT_PASSWORD_FAILURE,
})

export const resetPasswordSuccess = () => ({
	type: EDIT_PASSWORD_SUCCESS,
})

export const resetPasswordAsync = (values: object): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	console.tron.log("VALUES ===>", values)
	dispatch(resetPassword())

	try {
		const result = await apiEditPassword(values)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(resetPasswordSuccess())
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'Bvn' }))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(resetPasswordFailure())
		}
	} catch ({ message }) {
		dispatch(resetPasswordFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const startTrip = () => ({
	type: START_TRIP,
})

export const startTripFailure = () => ({
	type: START_TRIP_FAILURE,
})

export const startTripSuccess = () => ({
	type: START_TRIP_SUCCESS,
})

export const startTripAsync = (id: number): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token

	dispatch(startTrip())

	try {
		const result = await apiStartOrder(id, userToken)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(startTripSuccess())
			dispatch(notify(`Success`, 'success'))
			dispatch(fetchMyOrdersAsync('New', 50))
			dispatch(fetchMyOrdersAsync('InProgress', 50))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(startTripFailure())
		}
	} catch ({ message }) {
		dispatch(startTripFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}



export const completeTrip = () => ({
	type: COMPLETE_TRIP,
})

export const completeTripFailure = () => ({
	type: COMPLETE_TRIP_FAILURE,
})

export const completeTripSuccess = () => ({
	type: COMPLETE_TRIP_SUCCESS,
})

export const completeTripAsync = (id: number): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token

	dispatch(completeTrip())

	try {
		const result = await apiCompleteOrder(id, userToken)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(completeTripSuccess())
			dispatch(notify(`Success`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'dashboard' }))
			dispatch(fetchMyOrdersAsync('New', 50))
			dispatch(fetchMyOrdersAsync('InProgress', 50))
			dispatch(fetchMyOrdersAsync('Old', 50))
			dispatch(fetchWalletBalanceAsync())
			dispatch(FetchWalletTransactionsAsync())
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(completeTripFailure())
		}
	} catch ({ message }) {
		dispatch(completeTripFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const cancelTrip = () => ({
	type: CANCEL_TRIP,
})

export const cancelTripFailure = () => ({
	type: CANCEL_TRIP_FAILURE,
})

export const cancelTripSuccess = () => ({
	type: CANCEL_TRIP_SUCCESS,
})

export const cancelTripAsync = (id: number): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token

	dispatch(cancelTrip())

	try {
		const result = await apiCancelOrder(id, userToken)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(cancelTripSuccess())
			dispatch(notify(`Success`, 'success'))
			dispatch(fetchMyOrdersAsync('New', 50))
			dispatch(fetchMyOrdersAsync('InProgress', 50))
			dispatch(fetchMyOrdersAsync('Old', 50))
			dispatch(NavigationActions.navigate({ routeName: 'dashboard' }))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(cancelTripFailure())
		}
	} catch ({ message }) {
		dispatch(cancelTripFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const updateUserProfile = () => ({
	type: UPDATE_USER_PROFILE
})

export const updateUserProfileFailure = () => ({
	type: UPDATE_USER_PROFILE_FAILURE
})

export const updateUserProfileSuccess = () => ({
	type: UPDATE_USER_PROFILE_SUCCESS
})

export const updateUserProfileAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {

	const userDetails = {
		...getState().auth.user,
		...values
	}

	console.warn(userDetails, "<==== check here!!!")

	dispatch(updateUserProfile())

	try {
		const result = await apiUpdateUser(userDetails, getState().auth.user.id)
		const { kind, data } = result

		console.tron.log(result, "<==== updateUserProfileAsync")

		if (kind === "ok") {
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(updateUserProfileSuccess())
			dispatch(notify(`Success`, 'success'))
			dispatch(setUserDetails({
				...getState().auth.user,
				...data
			}))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(updateUserProfileFailure())
		}
	} catch ({ message }) {
		dispatch(updateUserProfileFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const updateUserLocation = () => ({
	type: UPDATE_USER_LOCATION
})

export const updateUserLocationFailure = () => ({
	type: UPDATE_USER_LOCATION_FAILURE
})

export const updateUserLocationSuccess = () => ({
	type: UPDATE_USER_LOCATION_SUCCESS
})

export const updateUserLocationAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {

	const userDetails = {
		...getState().auth.user,
		...values
	}
	const userToken = getState().auth.user.token

	console.tron.log(userDetails, "<==== check here!!!")

	dispatch(updateUserLocation())

	try {
		const result = await apiUpdateUserLocation(userToken, userDetails)
		const { kind, data } = result

		if (kind === "ok") {
			dispatch(updateUserLocationSuccess())
		} else {
			
			dispatch(updateUserLocationFailure())
		}
	} catch ({ message }) {
		dispatch(updateUserLocationFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const fetchWallet = () => ({
	type: FETCH_WALLET
})

export const fetchWalletFailure = () => ({
	type: FETCH_WALLET_FAILURE
})

export const fetchWalletSuccess = () => ({
	type: FETCH_WALLET_SUCCESS
})

export const fetchWalletAsync = (accountNumber: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const user = getState().auth.user
	const userToken = getState().auth.user.token

	dispatch(fetchWallet())

	try {
		const result = await apiFetchWallet(accountNumber, userToken)
		const { kind, data } = result

		console.tron.log(result)

		if (kind === "ok") {
			dispatch(fetchWalletSuccess())
			dispatch(setUserDetails({
				...user,
				wallet: {
					...data
				}
			}))
		} else {
			// dispatch(notify(`${data.message}`, 'danger'))
			dispatch(fetchWalletFailure())
		}
	} catch ({ message }) {
		console.warn('this is the error',message)
		dispatch(fetchWalletFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


const saveUserLocationName = (payload: string) => ({
	type: SAVE_LOCATION_NAME,
	payload
})

const saveUserLocationAddress = (payload: string) => ({
	type: SAVE_LOCATION_ADDRESS,
	payload
})

const saveUserLocationDetails = (payload: Array<any>) => ({
	type: SAVE_LOCATION_DETAILS,
	payload
})

const saveUserLocationGeometry = (payload: Array<any>) => ({
	type: SAVE_LOCATION_GEOMETRY,
	payload
})

export const getLatLngFromAddress = (description: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	console.tron.log(description)

	try {
		await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${description.replace(' ', '%')}&sensor=false&key=${RN_GOOGLE_MAPS_IOS_API_KEY}`)
			.then((response) => {
				dispatch(clearPredictions())
				dispatch(saveUserLocationAddress(response.data.results[0].formatted_address))
				dispatch(saveUserLocationName(response.data.results[0].formatted_address))
				dispatch(saveUserLocationDetails(response.data.results[0]))
				dispatch(saveUserLocationGeometry(response.data.results[0].geometry.location))
			})
			.catch(err => {
				console.tron.log(err)
				console.tron.log(err.response.data.error)
			})
	} catch (error) {
		console.tron.log(error)
	}
}

export const getLatLngFromAddressUsingServer = (searchKey: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	try {
		const result = await apiFetchLatitudeAndLongitudeFromServer(searchKey)
		const { status, message, data } = result.data
		console.tron.log(data[0])

		if (status) {
			dispatch(saveUserLocationAddress(data[0].formattedAddress))
			dispatch(saveUserLocationName(data[0].formattedAddress))
			dispatch(saveUserLocationDetails(data[0]))
		} else {
			// dispatch(notify(`${message}`, 'danger'))
			dispatch(fetchPredictionsFromServerFailure())
		}
	} catch ({ message }) {
		dispatch(fetchPredictionsFromServerFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

const getAllProducts = () => ({
	type: GET_ALL_PRODUCTS
})

const getAllProductsFailure = () => ({
	type: GET_ALL_PRODUCTS_FAILURE
})

const getAllProductsSuccess = (payload: Array<any>) => ({
	type: GET_ALL_PRODUCTS_SUCCESS,
	payload
})

export const getAllProductsAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userToken = getState().auth.user.token
	dispatch(getAllProducts())

	try {
		const result = await apiGetAllProducts(userToken)

		console.log(result, "<=== getAllProductsAsync")

		const { kind, data } = result

		if (kind === "ok") {
			dispatch(getAllProductsSuccess(data))
		} else {
			dispatch(getAllProductsFailure())
		}
	} catch ({ message }) {
		dispatch(getAllProductsFailure())
	}
}

export const createProduct = () => ({
	type: CREATE_PRODUCT,
})

export const createProductFailure = () => ({
	type: CREATE_PRODUCT_FAILURE,
})

export const createProductSuccess = () => ({
	type: CREATE_PRODUCT_SUCCESS,
})

export const createProductAsync = (values: any): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const state = getState().auth.user
	const { name, price } = values
	console.log(getState().auth.user)
	const paylaod = {
		token: state.token,
		supplierId: state.supplierId,
		product: {
			"productTypes": [
				name
			]
		},
		price
	}

	console.log(paylaod, "payload")
	dispatch(createProduct())
	try {
		const result = await apiCreateProduct(paylaod)
		const { kind, data } = result

		console.log(result)

		if (kind === "ok") {
			dispatch(createProductSuccess())
			dispatch(editProductAsync({
				...paylaod,
				data
			}))
			dispatch(getMyProductsAsync())
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(createProductFailure())
		}
	} catch ({ message }) {
		dispatch(createProductFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const editProduct = () => ({
	type: CREATE_PRODUCT,
})

export const editProductFailure = () => ({
	type: CREATE_PRODUCT_FAILURE,
})

export const editProductSuccess = () => ({
	type: CREATE_PRODUCT_SUCCESS,
})

export const editProductAsync = (paylaod: any): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	console.log(paylaod, "paylaod")

	dispatch(editProduct())
	try {
		const result = await apiEditProduct(paylaod)
		const { kind, data } = result

		console.log(result, "result")

		if (kind === "ok") {
			dispatch(editProductSuccess())
			dispatch(getMyProductsAsync())
			dispatch(notify(`Success`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'editProducts' }))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(editProductFailure())
		}
	} catch ({ message }) {
		dispatch(editProductFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const editAProductAsync = (values: any): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const state = getState().auth.user
	const { name, price, id } = values
	console.log(getState().auth.user)
	const paylaod = {
		token: state.token,
		supplierId: state.supplierId,
		price,
		id
	}

	console.log(paylaod, "<=== editAProductAsync")

	dispatch(editProduct())
	try {
		const result = await apiEditAProduct(paylaod)
		const { kind, data } = result

		console.log(result, "result")

		if (kind === "ok") {
			dispatch(getMyProductsAsync())
			dispatch(editProductSuccess())
			dispatch(notify(`Success`, 'success'))
			dispatch(NavigationActions.navigate({ routeName: 'editProducts' }))
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(editProductFailure())
		}
	} catch ({ message }) {
		dispatch(editProductFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

const getMyProducts = () => ({
	type: GET_MY_PRODUCTS
})

const getMyProductsFailure = () => ({
	type: GET_MY_PRODUCTS_FAILURE
})

const getMyProductsSuccess = (payload: Array<any>) => ({
	type: GET_MY_PRODUCTS_SUCCESS,
	payload
})

export const getMyProductsAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	dispatch(getMyProducts())
	const state = getState().auth.user

	const payload = {
		token: state.token,
		supplierId: state.supplierId,
	}

	try {
		const result = await apiGetMyProducts(payload)
		console.log(result, "<=== getMyProductsAsync")

		const { kind, data } = result

		if (kind === "ok") {
			dispatch(getMyProductsSuccess(data))
		} else {
			dispatch(getMyProductsFailure())
		}
	} catch ({ message }) {
		dispatch(getMyProductsFailure())
	}
}
