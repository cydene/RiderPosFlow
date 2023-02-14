import { PermissionStatus } from "expo-permissions"
import {
  StartupAction,
  StartupState,
  CHECK_LOCATION_PERMISSION_SUCCESS,
  ASK_LOCATION_PERMISSION_SUCCESS
} from "./startup.types"

const initialState: StartupState = {
  location: PermissionStatus.UNDETERMINED
}

export function startupReducer(
  state = initialState,
  action: StartupAction
): StartupState {
  switch (action.type) {
    case CHECK_LOCATION_PERMISSION_SUCCESS:
      return {
        ...state,
        location: action.payload
      }
    case ASK_LOCATION_PERMISSION_SUCCESS:
      return {
        ...state,
        location: action.payload
      }
    default:
      return state
  }
}
