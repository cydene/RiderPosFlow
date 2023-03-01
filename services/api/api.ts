// a library to wrap and simplify api calls
import apisauce, { DEFAULT_HEADERS } from "apisauce"
import { RN_BASE_URL } from "@env"
import * as Types from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import {authCredentials, forgotPasswordFields} from "../../redux/auth";
import AsyncStorage from '@react-native-community/async-storage'
import { Header } from "react-native/Libraries/NewAppScreen";

const api = apisauce.create({
  // base URL is read from the "constructor"
  baseURL: RN_BASE_URL,
  // here are some default headers
  headers: {
    "Cache-Control": "no-cache",
    Accept: 'application/json',
    ContentType: 'application/json',
    // Authorization: `Bearer ${token}`
  },
  // 10 second timeout...
  timeout: 100000
})

/**
 * Process the api response
 */
const processResponse = async (response: any): Promise<any> => {
  // the typical ways to die when calling an api
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) {
      console.tron.error({ ...response, message: response.config.url })
      return problem
    }
  }

  // we're good
  // replace with `data` once api change is made.
  return { kind: "ok", data: response.data }
}

const withdrawFunds = async (token: string, values: any): Promise<
  Types.getResponse
  > => {
    await api.setHeaders({'Authorization': `Bearer ${token}`})
    const response = await api.post( `/wallet/withdraw?roles=Dispatcher`, values)
  return processResponse(response)
}


const signInUser = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  console.log(RN_BASE_URL)
  const response = await api.post( `/dispatchers/login`, {
    ...values
  })
  console.warn('testing signing new uses>>>',values) 
   console.warn('testing signing new uses>>> responseresponse',response)
  return processResponse(response)
}

const signUpIndividual = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/auth/register", {
    ...values
  })
  return processResponse(response)
}

const FetchWalletTransactions = async (userId: any, token: string): Promise<
  Types.getResponse
  > => {
    const userInfo = await AsyncStorage.getItem('user');
    
    const next=JSON.parse(userInfo)
    console.warn('next',next.wallet.id)

    const token1 = await AsyncStorage.getItem('token');
    const tt=JSON.parse(token1)
    console.warn('token1',tt)

  await api.setHeaders({'Authorization': `Bearer ${tt}`})
  const response = await api.get(`/wallet/${next.wallet.id}/transactions`)
  console.warn('response',response)
  // return processResponse(response)
}

const updateUserLocation = async (token: string, values: any): Promise<
  Types.getResponse
  > => {
    console.tron.log("VALUES FOR BACKEND:", values)
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.post( `/dispatchers/${values.id}/location`, values)
  return processResponse(response)
}

const fetchWallet = async (accountNumber: any, token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get(`/wallet/balance?accountNumber=${accountNumber}`)
  return processResponse(response)
}

const updateUser = async (values: authCredentials, userId: number): Promise<
  Types.getResponse
  > => {
    console.warn('tttt>>>>> chect this >>>',values)
    console.warn('payLoad',{
      "firstName": values.firstName,
      "lastName": values.lastName,
      "phone": values.phone,
      "photo": {
        "id": values.photo?.id,
        "url": values.photo?.url
      },
      "notificationId": values.photo?.id,
      "isOnline": values.isOnline,
      "bankName": values.bankName,
      "payoutNumber":  values.payoutNumber,
      "bankCode":values.bankCode
    })
    await api.setHeaders({'Authorization': `Bearer ${values.token}`})
    const response = await api.put(`/dispatchers/${userId}`, {
      "firstName": values.firstName,
      "lastName": values.lastName,
      "phone": values.phone,
      "photo": {
        "id": values.photo?.id,
        "url": values.photo?.url
      },
      "notificationId": values.photo?.id,
      "isOnline": values.isOnline,
      "bankName": values.bankName,
      "payoutNumber":  values.payoutNumber,
      "bankCode":values.bankCode
    })
    console.warn('user info bankcode>>>',values.bankCode)
    console.warn('this is the response after udating my user info>>>',response)
  return processResponse(response)
}

const fetchMyOrders = async (token: string, type: string, limit?: number): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get(`/orders?Type=${type}&Limit=${limit}`)
  return processResponse(response)
}

const fetchGasPrice = async (token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get("/products")
  return processResponse(response)
}

const fetchSettings = async (token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get(`/settings`)
  await api.setBaseURL(RN_BASE_URL)
  return processResponse(response)
}

const orderProduct = async (token: string, values: any): Promise<
  Types.getResponse
  > => {
    await api.setHeaders({'Authorization': `Bearer ${token}`})
    const response = await api.post( `/orders`, values)
  return processResponse(response)
}

const forgotPassword = async (email: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/dispatchers/forgot-password`, {
    email
  })
  return processResponse(response)
}

const createProduct = async (values: any): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${values.token}`})
  const response = await api.post(`/suppliers/${values.supplierId}/products`,  values.product)
  return processResponse(response)
}

const editProduct = async (values: any): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${values.token}`})
  const response = await api.put(`/suppliers/${values.supplierId}/products/${values.data[values.data.length -1].id}`,  {
    unitPrice: parseFloat(values.price)
  })
  return processResponse(response)
}

const editAProduct = async (values: any): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${values.token}`})
  const response = await api.put(`/suppliers/${values.supplierId}/products/${values.id}`,  {
    unitPrice: parseFloat(values.price)
  })
  console.warn('>>>edit product>> testing 1234',values)
  return processResponse(response)
}

const editPassword = async (values: forgotPasswordFields): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/dispatchers/reset-password`, {
    ...values
  })
  return processResponse(response)
}

const startOrder = async (id: number, token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.put( `/orders/${id}/start`)
  return processResponse(response)
}

const completeOrder = async (id: number, token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.put( `/orders/${id}/complete`)
  return processResponse(response)
}

const cancelOrder = async (id: number, token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.put( `/orders/${id}/cancel`)
  return processResponse(response)
}

const fetchPredictionsFromServer = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/google/search`, {
    searchKey
  })
  return processResponse(response)
}

const fetchSuggestionsFromServer = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/inventory/search`, {
    searchKey
  })
  return processResponse(response)
}

const fetchSuggestionsFromPharmacy = async (searchKey: string, companyId: number): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/inventory/company/search`, {
    searchKey,
    companyId
  })
  return processResponse(response)
}

const fetchLatitudeAndLongitudeFromServer = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/google/geocode`, {
    searchKey
  })
  return processResponse(response)
}


const fetchLocationFromServer = async (location): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/google/location`, {
    location
  })
  return processResponse(response)
}

const addInventory = async (values: any): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/add/inventory", {
    ...values
  })
  return processResponse(response)
}

const deleteInventory = async (values: any): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/delete/inventory", {
    ...values
  })
  return processResponse(response)
}

const toggleInventory = async (values: any): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/update/inventory", {
    ...values
  })
  return processResponse(response)
}

const fetchCompanies = async (userLatAndLong): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company", {
    ...userLatAndLong
  })
  return processResponse(response)
}

const fetchSellingPharmaciesFromServer = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/selling", {
    ...values,
  })
  return processResponse(response)
}

const fetchSellingPharmacyFromServer = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/selling/pharmcy", {
    ...values,
  })
  return processResponse(response)
}

const fetchPharmacies = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/companies", {
    searchKey,
  })
  return processResponse(response)
}

const createTransactionFromServer = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/individual/transaction", {
    ...values,
  })
  return processResponse(response)
}

const confirmPayment = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/individual/confirm/transaction", {
    ...values,
  })
  return processResponse(response)
}

const fetchMyOrdersPharmacy = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/orders", {
    ...values,
  })
  return processResponse(response)
}

const updateOrderStatus = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/orders/update", {
    ...values,
  })
  return processResponse(response)
}

const getAllProducts = async (token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get("/products")
  return processResponse(response)
}

const getMyProducts = async (values: any): Promise<
  Types.getResponse
  > => {
  console.log(values, "<=== values")
  await api.setHeaders({'Authorization': `Bearer ${values.token}`})
  const response = await api.get(`/suppliers/${values.supplierId}/products`)
  return processResponse(response)
}

const userUpdateOrderStatus = async (values): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/individual/orders/update", {
    ...values,
  })
  return processResponse(response)
}

const fetchWalletBalance = async (accountNumber: any, token: string): Promise<
  Types.getResponse
  > => {
  await api.setHeaders({'Authorization': `Bearer ${token}`})
  const response = await api.get(`/wallet/balance?accountNumber=${accountNumber}`)
  return processResponse(response)
}

export {
  updateUser,
  signUpIndividual,
  signInUser,
  fetchMyOrders,
  fetchGasPrice,
  fetchSettings,
  orderProduct,
  fetchWallet,
  withdrawFunds,
  startOrder,
  updateUserLocation,
  completeOrder,
  cancelOrder,
  FetchWalletTransactions,
  fetchWalletBalance,
  createProduct,
  getAllProducts,
  getMyProducts,

  forgotPassword,
  editPassword,
  fetchPredictionsFromServer,
  fetchLatitudeAndLongitudeFromServer,
  addInventory,
  deleteInventory,
  toggleInventory,
  fetchCompanies,
  fetchSuggestionsFromServer,
  fetchSellingPharmaciesFromServer,
  createTransactionFromServer,
  confirmPayment,
  fetchLocationFromServer,
  fetchSuggestionsFromPharmacy,
  fetchSellingPharmacyFromServer,
  fetchPharmacies,
  fetchMyOrdersPharmacy,
  updateOrderStatus,
  userUpdateOrderStatus,
  editProduct,
  editAProduct
}
