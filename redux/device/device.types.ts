export interface Coords {
  latitude: number | null
  longitude: number | null
  altitude: number | null
  accuracy: number | null
  altitudeAccuracy?: number | null
  heading: number | null
  speed: number | null
}
export interface LocationNode {
  coords: Coords
  timestamp: number
}

export type DeviceState = {
  isOnline: boolean
  location: LocationNode,
  locationName: string
	locationAddress: string
	locationDetails: Array<any>
}

export const SET_ONLINE = "SET_ONLINE"
export type SetOnline = {
  type: typeof SET_ONLINE
  payload: boolean
}

export const REQUEST_LOCATION = "REQUEST_LOCATION"
export const REQUEST_LOCATION_SUCCESS = "REQUEST_LOCATION_SUCCESS"
export type RequestLocation = {
  type: typeof REQUEST_LOCATION
}
export type RequestLocationSuccess = {
  type: typeof REQUEST_LOCATION_SUCCESS
  payload: LocationNode
}

export const FETCH_LOCATION_FROM_SERVER = "FETCH_LOCATION_FROM_SERVER"
type fetchLocationFromServer = {
	type: typeof FETCH_LOCATION_FROM_SERVER
}

export const FETCH_LOCATION_FROM_SERVER_FAILURE = "FETCH_LOCATION_FROM_SERVER_FAILURE"
type fetchLocationFromServerFailure = {
	type: typeof FETCH_LOCATION_FROM_SERVER_FAILURE
}

export const FETCH_LOCATION_FROM_SERVER_SUCCESS = "FETCH_LOCATION_FROM_SERVER_SUCCESS"
type fetchLocationFromServerSuccess = {
  type: typeof FETCH_LOCATION_FROM_SERVER_SUCCESS,
  payload: any
}

export const SAVE_LOCATION_ADDRESS = "SAVE_LOCATION_ADDRESS"
type SaveLocationAddress = {
	type: typeof SAVE_LOCATION_ADDRESS
	payload: string
}

export const SAVE_LOCATION_NAME = "SAVE_LOCATION_NAME"
type SaveLocationName = {
	type: typeof SAVE_LOCATION_NAME
	payload: string
}

export const SAVE_LOCATION_DETAILS = "SAVE_LOCATION_DETAILS"
type SaveLocationDetails = {
	type: typeof SAVE_LOCATION_DETAILS
	payload: Array<any>
}

export const SAVE_LOCATION_GEOMETRY = "SAVE_LOCATION_GEOMETRY"
type SaveLocationGeometry = {
	type: typeof SAVE_LOCATION_GEOMETRY
	payload: Array<any>
}

export type DeviceAction = SetOnline 
| RequestLocation 
| RequestLocationSuccess
| fetchLocationFromServer
| fetchLocationFromServerFailure
| fetchLocationFromServerSuccess
| SaveLocationName
| SaveLocationAddress
| SaveLocationDetails
| SaveLocationGeometry
