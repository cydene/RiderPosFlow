import {
  DeviceState,
  DeviceAction,
  SET_ONLINE,
  REQUEST_LOCATION_SUCCESS,
  SAVE_LOCATION_ADDRESS,
  SAVE_LOCATION_DETAILS,
  SAVE_LOCATION_GEOMETRY,
  SAVE_LOCATION_NAME
} from "./device.types"

const initialState: DeviceState = {
  isOnline: false,
  location: {
    coords: {
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: null
  },
  locationName: '',
	locationAddress: '',
	locationDetails: [],
}

export function deviceReducer(
  state: DeviceState = initialState,
  action: DeviceAction
): DeviceState {
  switch (action.type) {
    case SET_ONLINE:
      return {
        ...state,
        isOnline: action.payload
      }

    case REQUEST_LOCATION_SUCCESS:
      return {
        ...state,
        location: action.payload
      }
    
      case SAVE_LOCATION_NAME:
			return {
				...state,
				locationName: action.payload
			}
		
		case SAVE_LOCATION_ADDRESS:
			return {
				...state,
				locationAddress: action.payload
			}
		
		case SAVE_LOCATION_GEOMETRY:
			return {
				...state,
				locationGeometry: action.payload
			}
		
		case SAVE_LOCATION_DETAILS:
			return {
				...state,
				locationDetails: action.payload
			}

    default:
      return state
  }
}
