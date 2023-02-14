import { connect } from "react-redux"
import {
  createReduxContainer,
  createNavigationReducer,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers"

import { RootNavigator } from "./root-navigator"
import { ApplicationState } from "../redux"

export const navReducer = createNavigationReducer(RootNavigator);

// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
export const middleware = createReactNavigationReduxMiddleware(
  (state: ApplicationState) => state.nav
);

const App = createReduxContainer(RootNavigator);

const mapStateToProps = (state: ApplicationState) => ({
  state: state.nav
});

export const AppWithNavigationState = connect(mapStateToProps)(App);
