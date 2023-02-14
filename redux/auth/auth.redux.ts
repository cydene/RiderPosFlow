import {
	AuthAction,
	AuthState,
	EDIT_PASSWORD,
	EDIT_PASSWORD_FAILURE,
	EDIT_PASSWORD_SUCCESS,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_FAILURE,
	FORGOT_PASSWORD_SUCCESS,
	SET_AUTH_COMPANY_NAME,
	SET_AUTH_EMAIL,
	SET_AUTH_FULL_NAME,
	SET_AUTH_PASSWORD,
	SET_FCM_TOKEN,
	SET_USER_DETAILS,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	UPDATE_USER_PROFILE,
	UPDATE_USER_PROFILE_FAILURE,
	UPDATE_USER_PROFILE_SUCCESS,
	SET_PHONE_NUMBER,
	LOGOUT,
	SIGN_UP_INDIVIDUAL,
	SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS,
	FETCH_MY_ORDERS_SUCCESS,
	FETCH_GAS_PRICE_SUCCESS,
	FETCH_BANKS_SUCCESS,
	FETCH_SETTINGS_SUCCESS,
	SET_DELIVERY_PRICE,
	ORDER_PRODUCT_SUCCESS,
	ORDER_PRODUCT,
	ORDER_PRODUCT_FAILURE,
	CREATE_WALLET,
	CREATE_WALLET_FAILURE,
	CREATE_WALLET_SUCCESS,
	FETCH_NEW_ORDERS_SUCCESS,
	FETCH_INPROGRESS_ORDERS_SUCCESS,
	WITHDRAW_FUNDS,
	WITHDRAW_FUNDS_FAILURE,
	WITHDRAW_FUNDS_SUCCESS,
	START_TRIP,
	START_TRIP_FAILURE,
	START_TRIP_SUCCESS,
	COMPLETE_TRIP,
	COMPLETE_TRIP_FAILURE,
	COMPLETE_TRIP_SUCCESS,
	CANCEL_TRIP,
	CANCEL_TRIP_FAILURE,
	CANCEL_TRIP_SUCCESS,
	GET_ALL_PRODUCTS,
	GET_ALL_PRODUCTS_FAILURE,
	GET_ALL_PRODUCTS_SUCCESS,
	GET_MY_PRODUCTS,
	GET_MY_PRODUCTS_FAILURE,
	GET_MY_PRODUCTS_SUCCESS
} from "./auth.types"

const initialState: AuthState = {
	companyName: "",
	email: "",
	password: "",
	notificationId: "",
	loading: false,
	user: [],
	phoneNumber: '',
	isLoggedIn: false,
	orders: [],
	gasPrices: [],
	settings: [],
	banks: [],
	deliveryPrice: '',
	order: [],
	hasOrder: false,
	newOrder: [],
	inProgress: [],
	allProducts: [],
	myProducts: []
}

export function authReducer(
	state = initialState,
	action: AuthAction
): AuthState {
	switch (action.type) {

		case SET_AUTH_EMAIL:
			return {
				...state,
				email: action.payload
			}


		case SIGN_IN_USER:
		case FORGOT_PASSWORD:
		case EDIT_PASSWORD:
		case UPDATE_USER_PROFILE:
		case SIGN_UP_INDIVIDUAL:
		case ORDER_PRODUCT:
		case CREATE_WALLET:
		case WITHDRAW_FUNDS:
		case START_TRIP:
		case COMPLETE_TRIP:
		case CANCEL_TRIP:
		case GET_ALL_PRODUCTS:
		case GET_MY_PRODUCTS:
			return {
				...state,
				loading: true
			}


		case SIGN_IN_USER_FAILURE:
		case SIGN_IN_USER_SUCCESS:
		case FORGOT_PASSWORD_FAILURE:
		case FORGOT_PASSWORD_SUCCESS:
		case EDIT_PASSWORD_FAILURE:
		case EDIT_PASSWORD_SUCCESS:
		case UPDATE_USER_PROFILE_FAILURE:
		case UPDATE_USER_PROFILE_SUCCESS:
		case SIGN_UP_INDIVIDUAL_FAILURE:
		case SIGN_UP_INDIVIDUAL_SUCCESS:
		case ORDER_PRODUCT_FAILURE:
		case CREATE_WALLET_SUCCESS:
		case CREATE_WALLET_FAILURE:
		case WITHDRAW_FUNDS_FAILURE:
		case WITHDRAW_FUNDS_SUCCESS:
		case START_TRIP_FAILURE:
		case START_TRIP_SUCCESS:
		case COMPLETE_TRIP_SUCCESS:
		case COMPLETE_TRIP_FAILURE:
		case CANCEL_TRIP_FAILURE:
		case CANCEL_TRIP_SUCCESS:
		case GET_ALL_PRODUCTS_FAILURE:
		case GET_MY_PRODUCTS_FAILURE:
			return {
				...state,
				loading: false
			}

		case SET_USER_DETAILS:
			return {
				...state,
				user: action.payload,
				isLoggedIn: true
			}

		case SET_FCM_TOKEN:
			return {
				...state,
				notificationId: action.payload
			}

		case SET_AUTH_COMPANY_NAME:
			return {
				...state,
				companyName: action.payload
			}

		case SET_PHONE_NUMBER:
			return {
				...state,
				phoneNumber: action.payload
			}


		case SET_AUTH_PASSWORD:
			return {
				...state,
				password: action.payload
			}

		case FETCH_MY_ORDERS_SUCCESS:
			return {
				...state,
				orders: action.payload,
			}

		case FETCH_NEW_ORDERS_SUCCESS:
			return {
				...state,
				newOrder: action.payload,
			}

		case FETCH_INPROGRESS_ORDERS_SUCCESS:
			return {
				...state,
				inProgress: action.payload,
			}

		case ORDER_PRODUCT_SUCCESS:
			return {
				...state,
				order: action.payload,
				loading: false,
				hasOrder: true
			}

		case FETCH_GAS_PRICE_SUCCESS:
			return {
				...state,
				gasPrices: action.payload,
			}

		case GET_ALL_PRODUCTS_SUCCESS:
			return {
				...state,
				allProducts: action.payload,
				loading: false
			}

		case GET_MY_PRODUCTS_SUCCESS:
			return {
				...state,
				myProducts: action.payload,
				loading: false
			}

		case FETCH_SETTINGS_SUCCESS:
			return {
				...state,
				settings: action.payload,
			}

		case SET_DELIVERY_PRICE:
			return {
				...state,
				deliveryPrice: action.payload,
			}

		case FETCH_BANKS_SUCCESS:
			return {
				...state,
				banks: action.payload,
			}

		case LOGOUT:
			return initialState

		default:
			return state
	}
}