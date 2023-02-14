import { ThunkAction } from "redux-thunk"
import * as Location from "expo-location"
import { Action } from "redux"
import {
  SET_ONLINE,
  LocationNode,
  REQUEST_LOCATION,
  REQUEST_LOCATION_SUCCESS,
  FETCH_LOCATION_FROM_SERVER,
  FETCH_LOCATION_FROM_SERVER_FAILURE,
  FETCH_LOCATION_FROM_SERVER_SUCCESS,
  SAVE_LOCATION_NAME,
  SAVE_LOCATION_ADDRESS,
  SAVE_LOCATION_DETAILS,
  SAVE_LOCATION_GEOMETRY
} from "./device.types"
import { ApplicationState } from ".."
import { NavigationActions } from "react-navigation";
import { store } from "../../App";
import { notify } from "../startup";
import axios from 'axios'
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "@env"

// APIs
import {
	fetchLocationFromServer as apiFetchLocationFromServer,
} from "../../services/api"

/**
 *  Actions
 */

export const setOnline = (isOnline: boolean) => ({
  type: SET_ONLINE,
  payload: isOnline
})

export const requestLocation = () => ({
  type: REQUEST_LOCATION
})
const fetchUserLocationSuccess = (payload: LocationNode) => ({
  type: REQUEST_LOCATION_SUCCESS,
  payload
})

/**
 * Thunks
 */
export const fetchUserLocationAsync = (): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
> => async (dispatch, getState) => {
  dispatch(requestLocation())
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: 0,
      distanceInterval: 0,
      timeInterval: 0,
      timeout: 5000
    })
    console.tron.log("locationlocation")
    console.tron.log(location)
    dispatch(fetchUserLocationSuccess(location))
    dispatch(fetchUserLocationAPIAsync())
  } catch (error) {}
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

export const fetchLocationFromServer = () => ({
	type: FETCH_LOCATION_FROM_SERVER,
})

export const fetchLocationFromServerFailure = () => ({
	type: FETCH_LOCATION_FROM_SERVER_FAILURE,
})

export const fetchLocationFromServerSuccess = () => ({
	type: FETCH_LOCATION_FROM_SERVER_SUCCESS,
})

export const getLocationFromAddressUsingServer = (location): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
  // dispatch(fetchLocationFromServer())

  
	// try {
	// 	const result = await apiFetchLocationFromServer(location)
	// 	const { status, message, data } = result.data
	// 	console.tron.log(data)

	// 	if (status) {
  //     dispatch(fetchLocationFromServerSuccess())
	// 		dispatch(saveUserLocationAddress(data[0].formattedAddress))
	// 		dispatch(saveUserLocationName(data[0].formattedAddress))
	// 		dispatch(saveUserLocationDetails(data[0]))
	// 	} else {
  //     dispatch(fetchLocationFromServerFailure())
	// 		dispatch(notify(`${message}`, 'danger'))
	// 	}
	// } catch ({ message }) {
  //   dispatch(fetchLocationFromServerFailure())
	// 	dispatch(notify(`${message}`, 'danger'))
	// }
}

export const fetchUserLocationAPIAsync = (location?: object): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
  > => async (dispatch, getState) => {
  dispatch(fetchLocationFromServer())
  if(location){
  console.warn(location, "<==== LOCATION333")
  
  const state = getState()
  const coords = state.device.location.coords
  const latitude = location.latitude || coords.latitude
  const longitude = location.longitude || coords.longitude
  }
  
  try {

    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=${RN_GOOGLE_MAPS_IOS_API_KEY}`)
      .then((response) => {
        console.tron.log(response, '<=== Success')
        dispatch(saveUserLocationAddress(response.data.results[0].formatted_address))
        dispatch(saveUserLocationName(response.data.results[0].formatted_address))
        dispatch(saveUserLocationDetails(response.data.results[0]))
        dispatch(fetchLocationFromServerSuccess())

      })
      .catch(err => {
        console.tron.log(err, '<==== ERROR')
        console.tron.log(err.response.data.error)
        dispatch(fetchLocationFromServerFailure())
      })
  } catch (error) {
  
  }
}


export const goBack = (): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
  > => async (dispatch, getState) => {
  
  store.dispatch(NavigationActions.navigate({ routeName: 'home' }))
}



