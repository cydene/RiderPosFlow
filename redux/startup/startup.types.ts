import { PermissionStatus } from "expo-permissions"

export const STARTUP = "STARTUP"
type SetStartupAction = {
  type: typeof STARTUP
}

export const CHECK_LOCATION_PERMISSION = "CHECK_LOCATION_PERMISSION"
export const ASK_LOCATION_PERMISSION = "ASK_LOCATION_PERMISSION"
export const CHECK_LOCATION_PERMISSION_SUCCESS =
  "CHECK_LOCATION_PERMISSION_SUCCESS"
export const ASK_LOCATION_PERMISSION_SUCCESS = "ASK_LOCATION_PERMISSION_SUCCESS"
type CheckLocationPermissionAction = {
  type: typeof CHECK_LOCATION_PERMISSION
}
type AskLocationPermissionAction = {
  type: typeof ASK_LOCATION_PERMISSION
}
type CheckLocationPermissionSuccessAction = {
  type: typeof CHECK_LOCATION_PERMISSION_SUCCESS
  payload: PermissionStatus
}
type AskLocationPermissionSuccessAction = {
  type: typeof ASK_LOCATION_PERMISSION_SUCCESS
  payload: PermissionStatus
}

export type StartupState = {
  location: PermissionStatus
}

export const OPEN_SETTINGS = "OPEN_SETTINGS"
type OpenSettingsAction = {
  type: typeof OPEN_SETTINGS
}

export type StartupAction =
  | SetStartupAction
  | CheckLocationPermissionAction
  | AskLocationPermissionAction
  | CheckLocationPermissionSuccessAction
  | AskLocationPermissionSuccessAction
  | OpenSettingsAction
