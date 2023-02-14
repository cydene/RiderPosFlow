export const SET_FCM_TOKEN = "SET_FCM_TOKEN"
type SetFCMTokenAction = {
	type: typeof SET_FCM_TOKEN
	payload: string
}

export const SET_AUTH_FULL_NAME = "SET_AUTH_FULL_NAME"
type SetAuthFullNameAction = {
	type: typeof SET_AUTH_FULL_NAME
	payload: string
};

export const SET_AUTH_EMAIL = "SET_AUTH_EMAIL"
type SetAuthEmailAction = {
	type: typeof SET_AUTH_EMAIL
	payload: string
};

export const SET_AUTH_PASSWORD = "SET_AUTH_PASSWORD"
type SetAuthPasswordAction = {
	type: typeof SET_AUTH_PASSWORD
	payload: string
};

export const SET_PHONE_NUMBER = "SET_PHONE_NUMBER"
type SetPhoneNumberAction = {
	type: typeof SET_PHONE_NUMBER
	payload: string
};

export const SET_USER_DETAILS = "SET_USER_DETAILS"
type setUserDetails = {
	type: typeof SET_USER_DETAILS
	payload: IUser
}

export const SIGN_UP_INDIVIDUAL = "SIGN_UP_INDIVIDUAL"
type SignUpIndividualAction = {
	type: typeof SIGN_UP_INDIVIDUAL
}

export const SIGN_UP_INDIVIDUAL_FAILURE = "SIGN_UP_INDIVIDUAL_FAILURE"
type SignUpIndividualActionFailure = {
	type: typeof SIGN_UP_INDIVIDUAL_FAILURE
}

export const SIGN_UP_INDIVIDUAL_SUCCESS = "SIGN_UP_INDIVIDUAL_SUCCESS"
type SignUpIndividualActionSuccess = {
	type: typeof SIGN_UP_INDIVIDUAL_SUCCESS
}

export const SET_AUTH_COMPANY_NAME = "SET_AUTH_COMPANY_NAME"
type SetAuthCompanyNameAction = {
	type: typeof SET_AUTH_COMPANY_NAME
	payload: string
};

export const SIGN_IN_USER = "SIGN_IN_USER"
type SignInUser = {
	type: typeof SIGN_IN_USER
}

export const SIGN_IN_USER_FAILURE = "SIGN_IN_USER_FAILURE"
type SignInUserFailure = {
	type: typeof SIGN_IN_USER_FAILURE
}

export const SIGN_IN_USER_SUCCESS = "SIGN_IN_USER_SUCCESS"
type SignInUserSuccess = {
	type: typeof SIGN_IN_USER_SUCCESS
}

export const FETCH_MY_ORDERS = "FETCH_MY_ORDERS"
type FetchMyOrders = {
	type: typeof FETCH_MY_ORDERS
}

export const FETCH_MY_ORDERS_FAILURE = "FETCH_MY_ORDERS_FAILURE"
type FetchMyOrdersFailure = {
	type: typeof FETCH_MY_ORDERS_FAILURE
}

export const FETCH_MY_ORDERS_SUCCESS = "FETCH_MY_ORDERS_SUCCESS"
type FetchMyOrdersSuccess = {
	type: typeof FETCH_MY_ORDERS_SUCCESS,
	payload: any
}

export const FETCH_NEW_ORDERS_SUCCESS = "FETCH_NEW_ORDERS_SUCCESS"
type FetchNewOrdersSuccess = {
	type: typeof FETCH_NEW_ORDERS_SUCCESS,
	payload: any
}

export const FETCH_NEW_ORDERS_FAILURE= "FETCH_NEW_ORDERS_FAILURE"
type FetchNewOrdersFailure = {
	type: typeof FETCH_NEW_ORDERS_FAILURE
}

export const FETCH_INPROGRESS_ORDERS_SUCCESS = "FETCH_INPROGRESS_ORDERS_SUCCESS"
type FetchInProgressOrdersSuccess = {
	type: typeof FETCH_INPROGRESS_ORDERS_SUCCESS,
	payload: any
}

export const FETCH_INPROGRESS_ORDERS_FAILURE = "FETCH_INPROGRESS_ORDERS_FAILURE"
type FetchInProgressOrdersFailure = {
	type: typeof FETCH_INPROGRESS_ORDERS_FAILURE
}

export const WITHDRAW_FUNDS = "WITHDRAW_FUNDS"
type WithdrawFunds = {
	type: typeof WITHDRAW_FUNDS
}

export const WITHDRAW_FUNDS_FAILURE = "WITHDRAW_FUNDS_FAILURE"
type WithdrawFundsFailure = {
	type: typeof WITHDRAW_FUNDS_FAILURE
}

export const WITHDRAW_FUNDS_SUCCESS = "WITHDRAW_FUNDS_SUCCESS"
type WithdrawFundsSuccess = {
	type: typeof WITHDRAW_FUNDS_SUCCESS
}

export const ORDER_PRODUCT = "ORDER_PRODUCT"
type OrderProduct = {
	type: typeof ORDER_PRODUCT
}

export const ORDER_PRODUCT_FAILURE = "ORDER_PRODUCT_FAILURE"
type OrderProductFailure = {
	type: typeof ORDER_PRODUCT_FAILURE
}

export const ORDER_PRODUCT_SUCCESS = "ORDER_PRODUCT_SUCCESS"
type OrderProductSuccess = {
	type: typeof ORDER_PRODUCT_SUCCESS,
	payload: any
}

export const FETCH_GAS_PRICE = "FETCH_GAS_PRICE"
type FetchGasPrice = {
	type: typeof FETCH_GAS_PRICE
}

export const FETCH_GAS_PRICE_FAILURE = "FETCH_GAS_PRICE_FAILURE"
type FetchGasPriceFailure = {
	type: typeof FETCH_GAS_PRICE_FAILURE
}

export const FETCH_GAS_PRICE_SUCCESS = "FETCH_GAS_PRICE_SUCCESS"
type FetchGasPriceSuccess = {
	type: typeof FETCH_GAS_PRICE_SUCCESS,
	payload: Array<any>
}

export const FETCH_SETTINGS = "FETCH_SETTINGS"
type FetchSettings = {
	type: typeof FETCH_SETTINGS
}

export const FETCH_SETTINGS_FAILURE = "FETCH_SETTINGS_FAILURE"
type FetchSettingsFailure = {
	type: typeof FETCH_SETTINGS_FAILURE
}

export const FETCH_SETTINGS_SUCCESS = "FETCH_SETTINGS_SUCCESS"
type FetchSettingsSuccess = {
	type: typeof FETCH_SETTINGS_SUCCESS,
	payload: Array<any>
}

export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS"
type GetAllProducts = {
	type: typeof GET_ALL_PRODUCTS
}

export const GET_ALL_PRODUCTS_FAILURE = "GET_ALL_PRODUCTS_FAILURE"
type GetAllProductsFailure = {
	type: typeof GET_ALL_PRODUCTS_FAILURE
}

export const GET_ALL_PRODUCTS_SUCCESS = "GET_ALL_PRODUCTS_SUCCESS"
type GetAllProductsSuccess = {
	type: typeof GET_ALL_PRODUCTS_SUCCESS,
	payload: Array<any>
}

export const GET_MY_PRODUCTS = "GET_MY_PRODUCTS"
type GetMyProducts = {
	type: typeof GET_MY_PRODUCTS
}

export const GET_MY_PRODUCTS_FAILURE = "GET_MY_PRODUCTS_FAILURE"
type GetMyProductsFailure = {
	type: typeof GET_MY_PRODUCTS_FAILURE
}

export const GET_MY_PRODUCTS_SUCCESS = "GET_MY_PRODUCTS_SUCCESS"
type GetMyProductsSuccess = {
	type: typeof GET_MY_PRODUCTS_SUCCESS,
	payload: Array<any>
}

export const SET_DELIVERY_PRICE = "SET_DELIVERY_PRICE"
type SetDeliveryPrice = {
	type: typeof SET_DELIVERY_PRICE,
	payload: string
}

export const FETCH_BANKS = "FETCH_BANKS"
type FetchBanks = {
	type: typeof FETCH_BANKS
}

export const FETCH_BANKS_FAILURE = "FETCH_BANKS_FAILURE"
type FetchBanksFailure = {
	type: typeof FETCH_BANKS_FAILURE
}

export const FETCH_BANKS_SUCCESS = "FETCH_BANKS_SUCCESS"
type FetchBanksSuccess = {
	type: typeof FETCH_BANKS_SUCCESS,
	payload: Array<any>
}

export const FETCH_WALLET_TRANSACTIONS= "FETCH_WALLET_TRANSACTIONS"
type FetchWalletTransactions = {
	type: typeof  FETCH_WALLET_TRANSACTIONS,
}

export const FETCH_WALLET_TRANSACTIONS_FAILURE = "FETCH_WALLET_TRANSACTIONS_FAILURE"
type FetchWalletTransactionsFailure = {
	type: typeof FETCH_WALLET_TRANSACTIONS_FAILURE,
}

export const FETCH_WALLET_TRANSACTIONS_SUCCESS = "FETCH_WALLET_TRANSACTIONS_SUCCESS"
type FetchWalletTransactionsSuccess = {
	type: typeof FETCH_WALLET_TRANSACTIONS_SUCCESS,
	payload: Array<any>
}

export const FETCH_WALLET_BALANCE= "FETCH_WALLET_BALANCE"
type FetchWalletBalance = {
	type: typeof  FETCH_WALLET_BALANCE,
}

export const FETCH_WALLET_BALANCE_FAILURE = "FETCH_WALLET_BALANCE_FAILURE"
type FetchWalletBalanceFailure = {
	type: typeof FETCH_WALLET_BALANCE_FAILURE,
}

export const FETCH_WALLET_BALANCE_SUCCESS = "FETCH_WALLET_BALANCE_SUCCESS"
type FetchWalletBalanceSuccess = {
	type: typeof FETCH_WALLET_BALANCE_SUCCESS,
}

export const FORGOT_PASSWORD = "FORGOT_PASSWORD"
type ForgotPassword = {
	type: typeof FORGOT_PASSWORD
}

export const FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE"
type ForgotPasswordFailure = {
	type: typeof FORGOT_PASSWORD_FAILURE
}

export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS"
type ForgotPasswordSuccess = {
	type: typeof FORGOT_PASSWORD_SUCCESS
}

export const CREATE_PRODUCT = "CREATE_PRODUCT"
type CreateProduct = {
	type: typeof CREATE_PRODUCT
}

export const CREATE_PRODUCT_FAILURE = "CREATE_PRODUCT_FAILURE"
type CreateProductFailure = {
	type: typeof CREATE_PRODUCT_FAILURE
}

export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS"
type CreateProductSuccess = {
	type: typeof CREATE_PRODUCT_SUCCESS
}

export const EDIT_PRODUCT = "EDIT_PRODUCT"
type EditProduct = {
	type: typeof EDIT_PRODUCT
}

export const EDIT_PRODUCT_FAILURE = "EDIT_PRODUCT_FAILURE"
type EditProductFailure = {
	type: typeof EDIT_PRODUCT_FAILURE
}

export const EDIT_PRODUCT_SUCCESS = "EDIT_PRODUCT_SUCCESS"
type EditProductSuccess = {
	type: typeof EDIT_PRODUCT_SUCCESS
}

export const EDIT_PASSWORD = "EDIT_PASSWORD"
type editPassword = {
	type: typeof EDIT_PASSWORD
}

export const EDIT_PASSWORD_FAILURE = "EDIT_PASSWORD_FAILURE"
type editPasswordFailure = {
	type: typeof EDIT_PASSWORD_FAILURE
}

export const EDIT_PASSWORD_SUCCESS = "EDIT_PASSWORD_SUCCESS"
type editPasswordSuccess = {
	type: typeof EDIT_PASSWORD_SUCCESS
}


export const START_TRIP = "START_TRIP"
type startTrip = {
	type: typeof START_TRIP
}

export const START_TRIP_FAILURE = "START_TRIP_FAILURE"
type startTripFailure = {
	type: typeof START_TRIP_FAILURE
}

export const START_TRIP_SUCCESS = "START_TRIP_SUCCESS"
type startTripSuccess = {
	type: typeof START_TRIP_SUCCESS
}

export const COMPLETE_TRIP = "COMPLETE_TRIP"
type completeTrip = {
	type: typeof COMPLETE_TRIP
}

export const COMPLETE_TRIP_FAILURE = "COMPLETE_TRIP_FAILURE"
type completeTripFailure = {
	type: typeof COMPLETE_TRIP_FAILURE
}

export const COMPLETE_TRIP_SUCCESS = "COMPLETE_TRIP_SUCCESS"
type completeTripSuccess = {
	type: typeof COMPLETE_TRIP_SUCCESS
}


export const CANCEL_TRIP = "CANCEL_TRIP"
type cancleTrip = {
	type: typeof CANCEL_TRIP
}

export const CANCEL_TRIP_FAILURE = "CANCEL_TRIP_FAILURE"
type cancleTripFailure = {
	type: typeof CANCEL_TRIP_FAILURE
}

export const CANCEL_TRIP_SUCCESS = "CANCEL_TRIP_SUCCESS"
type cancleTripSuccess = {
	type: typeof CANCEL_TRIP_SUCCESS
}

export const UPDATE_USER_LOCATION= "UPDATE_USER_LOCATION"
type UpdateUserLocation = {
	type: typeof  UPDATE_USER_LOCATION,
}

export const UPDATE_USER_LOCATION_FAILURE = "UPDATE_USER_LOCATION_FAILURE"
type UpdateUserLocationFailure = {
	type: typeof UPDATE_USER_LOCATION_FAILURE,
}

export const UPDATE_USER_LOCATION_SUCCESS = "UPDATE_USER_LOCATION_SUCCESS"
type UpdateUserLocationSuccess = {
	type: typeof UPDATE_USER_LOCATION_SUCCESS,
}




export const UPDATE_USER_PROFILE= "UPDATE_USER_PROFILE"
type UpdateUserProfilePicture = {
	type: typeof  UPDATE_USER_PROFILE,
}

export const UPDATE_USER_PROFILE_FAILURE = "UPDATE_USER_PROFILE_FAILURE"
type UpdateUserProfilePictureFailure = {
	type: typeof UPDATE_USER_PROFILE_FAILURE,
}

export const UPDATE_USER_PROFILE_SUCCESS = "UPDATE_USER_PROFILE_SUCCESS"
type UpdateUserProfilePictureSuccess = {
	type: typeof UPDATE_USER_PROFILE_SUCCESS,
}

export const FETCH_WALLET= "FETCH_WALLET"
type FetchWallet = {
	type: typeof  FETCH_WALLET,
}

export const FETCH_WALLET_FAILURE = "FETCH_WALLET_FAILURE"
type FetchWalletFailure = {
	type: typeof FETCH_WALLET_FAILURE,
}

export const FETCH_WALLET_SUCCESS = "FETCH_WALLET_SUCCESS"
type FetchWalletSuccess = {
	type: typeof FETCH_WALLET_SUCCESS,
}

export const LOGOUT = "LOGOUT"
type LogOut = {
	type: typeof LOGOUT
}

export type IUser = {
	id: number
	fullName: string
	email: string
	password: string
	phoneNumber: string
	notificationId?: string
	grapePharmId: string
	pictureURL: string
	address: string
	city: string
	state: string
	country: string
	ratings: number
	gender: string
	cart: Array<any>
	latitude: string
	longitude: string
	DOB: string
	cardDetails: Array<any>
	status: string
	userType:string
	suspensionReason: string
	updatedAt: string
	createdAt: string
	licenseRegNumber: string
	annualPractisingLicense: string
	approvedBy: string
}

export type IPhoto = {
	id: string
	url: string
}

export type authCredentials = {
	firstName?: string
	lastName?: string
	provider?: string
	token?: string
	userId?: string
	email?: string
	photo?: IPhoto
	phone?: string
	notificationId?: string
	password?: string
	isOnline?: boolean
	bankCode?: string
	payoutNumber?: string
	bankName?: string
	resetCode?: string
}

export type forgotPasswordFields = {
	code: string
	password?: string
	confirmPassword?: string
	userType?: string
	email?: string
}

export type AuthState = {
	companyName: string
	email: string
	password: string
	notificationId: string
	loading: boolean
	user: IUser | []
	phoneNumber: string
	isLoggedIn: boolean
	orders: Array<any>
	gasPrices: Array<any>
	settings: Array<any>
	banks: Array<any>
	deliveryPrice: string
	order: Array<any>
	hasOrder: boolean
	inProgress: Array<any>
	newOrder: Array<any>
	allProducts: Array<any>
	myProducts: Array<any>
}

export type AuthAction =
	| SetAuthFullNameAction
	| SetAuthEmailAction
	| setUserDetails
	| SetAuthCompanyNameAction
	| SetAuthPasswordAction
	| SignInUser
	| SignInUserFailure
	| SignInUserSuccess
	| FetchMyOrders
	| FetchMyOrdersSuccess
	| FetchNewOrdersSuccess
	| FetchNewOrdersFailure
	| FetchInProgressOrdersSuccess
	| FetchInProgressOrdersFailure
	| FetchMyOrdersFailure
	| WithdrawFunds
	| WithdrawFundsSuccess
	| WithdrawFundsFailure
	| OrderProduct
	| OrderProductSuccess
	| OrderProductFailure
	| FetchGasPrice
	| FetchGasPriceSuccess
	| FetchGasPriceFailure
	| FetchSettings
	| FetchSettingsSuccess
	| FetchSettingsFailure
	| GetAllProducts
	| GetAllProductsSuccess
	| GetAllProductsFailure
	| GetMyProducts
	| GetMyProductsSuccess
	| GetMyProductsFailure
	| FetchBanks
	| FetchBanksSuccess
	| FetchBanksFailure
	| SetDeliveryPrice
	| UpdateUserProfilePicture
	| UpdateUserProfilePictureFailure
	| UpdateUserProfilePictureSuccess
	| UpdateUserLocation
	| UpdateUserLocationFailure
	| UpdateUserLocationSuccess
	| FetchWallet
	| FetchWalletFailure
	| FetchWalletSuccess
	| ForgotPassword
	| ForgotPasswordFailure
	| ForgotPasswordSuccess
	| CreateProduct
	| CreateProductFailure
	| CreateProductSuccess
	| EditProduct
	| EditProductFailure
	| EditProductSuccess
	| editPassword
	| editPasswordFailure
	| editPasswordSuccess
	| startTrip
	| startTripFailure
	| startTripSuccess
	| completeTrip
	| completeTripFailure
	| completeTripSuccess
	| cancleTrip
	| cancleTripFailure
	| cancleTripSuccess
	| FetchWalletTransactions
	| FetchWalletTransactionsFailure
	| FetchWalletTransactionsSuccess
	| FetchWalletBalance
	| FetchWalletBalanceFailure
	| FetchWalletBalanceSuccess
	| SetPhoneNumberAction
	| LogOut
	| SetFCMTokenAction
	| SignUpIndividualAction
	| SignUpIndividualActionFailure
	| SignUpIndividualActionSuccess