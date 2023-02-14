// react
import React from 'react';

// react native
import { Text, View,PermissionsAndroid } from 'react-native';

// third-party libraries
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationScreenProps } from "react-navigation";
import * as Font from "expo-font";
import { Asset } from 'expo-asset';
import { Root } from "native-base";
import { eventEmitter, initialMode } from 'react-native-dark-mode';
import Geolocation from 'react-native-geolocation-service';

// redux
import DebugConfig from "./config/debug-config"
import { AppWithNavigationState } from "./navigation/redux-navigation"
import configureStore from "./redux/create-store"
import { startup, checkLocationPermissionAsync } from "./redux/startup"
import { colors } from './theme';

// store
export const { store, persistor } = configureStore();

type State = {
  isLoadingComplete: boolean
  onAnimationEnd: boolean
  hideSPlash: boolean
}

interface DispatchProps {
  startup: () => void
}

interface MyProps extends NavigationScreenProps {
  skipLoadingScreen: boolean
}

type Props = MyProps & DispatchProps


class App extends React.Component<Props, State> {
  state = {
    isLoadingComplete: false,
    onAnimationEnd: false,
    hideSPlash: false,
    autoBackgroundColor: initialMode
  };
  
  componentDidMount() {
    console.tron.log(initialMode, "INIT")
    this.loadResourcesAsync();
    store.dispatch(startup());
    //@ts-ignore (let's discuss adding a permission screen before authLanding page.)
    store.dispatch(checkLocationPermissionAsync())

    eventEmitter.on('currentModeChanged', newMode => {
      console.tron.log('Switched to', newMode, 'mode')
      this.setState({
        autoBackgroundColor: newMode
      })
    })


  }

  getLocation=async()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'Cydene needs to Access your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          async position => {
            console.warn('wokeeey');
            console.warn('position', position);
         
          },
          error => console.warn('error location', error.message),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );

        //To Check, If Permission is granted
        console.warn('great');
      } else {
        alert('Permission Denied turn');
      }
    } catch (err) {
      console.warn('err', err);
    }
  }
  
  
  render() {
    const { autoBackgroundColor } = this.state
    
    if (!this.state.isLoadingComplete) return null;
    
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Text> Loading... </Text>}>
          <View style={{ flex: 1, backgroundColor: autoBackgroundColor === 'dark' ? colors.companyDarkGreen : colors.white }}>
            <Root>
              <AppWithNavigationState />
            </Root>
          </View>
        </PersistGate>
      </Provider>
    )
  }
  
  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require("./assets/backgroundImage.png"),
        require("./assets/cydene-app-logo.png"),
        require("./assets/first_intro.png"),
        require("./assets/second_intro.png"),
        require("./assets/third_intro.png"),
        require("./assets/first_intro_dark.png"),
        require("./assets/second_intro_dark.png"),
        require("./assets/third_intro_dark.png"),
        require("./assets/dark_background.png"),
        require("./assets/light_background.png"),
        require("./assets/background_image.png"),
        require("./assets/cydene-icon-white.png"),
        require("./assets/cyden_logo_white.png"),
        require("./assets/cyden_logo_blue.png"),
        require("./assets/tab_app_log_blue.png"),
        require("./assets/tab_app_log_white.png"),
        require("./assets/tab_history_blue.png"),
        require("./assets/tab_history_white.png"),
        require("./assets/tab_wallet_white.png"),
        require("./assets/tab_wallet_blue.png"),
        require("./assets/load_wallet.png"),
        require("./assets/wallet_background.png"),
        require("./assets/wallet_icon.png"),
        require("./assets/view_transactions.png"),
        require("./assets/call_us.png"),
        require("./assets/email_us.png"),
        require("./assets/chat_with_us.png"),
        require("./assets/buy_gas.png"),
        require("./assets/profile_bk.png"),
        require("./assets/profile_bk_dark.png"),
        require("./assets/wallet.png"),
        require("./assets/settings.png"),
        require("./assets/information.png"),
        require("./assets/gas_tank.png"),
        require("./assets/oil_truck.png"),
        require("./assets/top_up_wallet.png"),
        require("./assets/history.png"),
        require("./assets/gas_tank_dark.png"),
        require("./assets/oil-truck_dark.png"),
        require("./assets/history_dark.png"),
        require("./assets/top_up_wallet_dark.png"),
        require("./assets/homeOnFocused.png"),
        require("./assets/histroyOnFocused.png"),
        require("./assets/walletOnFocused.png"),
        require("./assets/profileOnFocused.png"),
        require("./assets/tabProfileIcon.png"),
        require("./assets/profile_dark.png"),
        require("./assets/new_bk_light.png"),
        require("./assets/new_bk_dark.png"),
        require("./assets/play_button.png"),
        require("./assets/pausedButton.png"),
        require("./assets/cancel.png"),
        require("./assets/empty_transactions.png"),
        require("./assets/empty_transactions_dark.png"),
        require("./assets/edit_icon.png"),
        require("./assets/safe.png"),
        require("./assets/safe_dark.png"),
        require("./assets/wallet_load.png"),
        require("./assets/wallet_load_dark.png"),
        require("./assets/account_details.png"),
        require("./assets/transactions.png"),
        require("./assets/credit_card.png"),
        require("./assets/bank.png"),
        require("./assets/load_wallet_light.png"),
        require("./assets/load_wallet_dark.png"),
        require("./assets/online.png"),
        require("./assets/offline.png"),
      ]),
      Font.loadAsync({
        "Gilroy-Bold": require("./assets/fonts/Gilroy-ExtraBold.otf"),
        "Gilroy-Light": require("./assets/fonts/Gilroy-Light.otf"),
        "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
        "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf")
      }),
    ]);
    
    this.setState({ isLoadingComplete: true })
  };
}

// allow reactotron overlay for fast design in dev mode
//@ts-ignore
export default DebugConfig.useReactotron ? console.tron.overlay(App) : App
