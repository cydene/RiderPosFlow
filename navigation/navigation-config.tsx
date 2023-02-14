import * as React from "react"
import {Image, ImageBackground, TouchableOpacity, View} from "react-native"
import {
  StackNavigatorConfig,
  TabNavigatorConfig,
  DrawerNavigatorConfig,
  BottomTabNavigatorConfig
} from "react-navigation"

import { DynamicStyleSheet, DynamicValue, useDarkModeContext, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors, images } from "../theme";
import { load, loadString } from "../lib/storage";
import { eventEmitter, initialMode } from 'react-native-dark-mode'
import { color } from "react-native-reanimated";
import { AsyncStorage } from "react-native";


// const isDarkMode = useDarkMode()

/**
 * The default stack navigator config for this app.
 */
export const DEFAULT_STACK_NAVIGATOR_CONFIG: StackNavigatorConfig = {
  headerMode: "screen",
  defaultNavigationOptions: {
    header: null,
    gesturesEnabled: false,
    headerTitleAllowFontScaling: false,
  },
}

/**
 * The default stack navigator config for this app.
 */
export const DEFAULT_CART_STACK_NAVIGATOR_CONFIG: StackNavigatorConfig = {
  navigationOptions: ({ navigation }: any) =>  {
    
    const { state } = navigation;
    // console.tron.log(state.routes[state.index].params, 'state.routes[state.index].params')
    
    return {
      tabBarVisible: state.routes[state.index].routeName !== "payment"
    }
  }
}

/**
 * The default stack navigator config for this app.
 */
export const COMPANY_BOTTOM_NAVIGATION: BottomTabNavigatorConfig = {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let image: any
      if (routeName === 'dashboard') {
        image = focused ? images.homeOnFocused : images.homeIconTrue;
      } if (routeName === 'records') {
        image = focused ? images.recordsIconTrue : images.records;
      } if (routeName === 'addInventory') {
        image = focused ? images.addIconTrue : images.addIconFalse;
      } if (routeName === 'notifications') {
        image = focused ? images.notificationIconTrue : images.notifications
      } if (routeName === 'account') {
        image = focused ? images.accountIconTrue : images.accountIcon
      }
      
      return focused
        ?
        <Image
          source={image}
          resizeMethod={'auto'}
          resizeMode='cover'
        />
      
      :
        <Image
          source={image}
          resizeMethod={'auto'}
          resizeMode='cover'
        />
      
    },
  }),
  tabBarOptions: {
    activeTintColor: '#3a203b',
    inactiveTintColor: '#566176',
    style: {
      backgroundColor: '#fff',
      borderColor: 'red'
    },
    showLabel: false,
  },
}

let outsideDark = initialMode

let userPicture = ''

const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('photoURL');
    if (value !== null) {
      // We have data!!
      userPicture = value
    }
  } catch (error) {
    // Error retrieving data
  }
};


/**
 * The default stack navigator config for this app.
 */
export const DEFAULT_BOTTOM_NAVIGATION: BottomTabNavigatorConfig = {
  defaultNavigationOptions: ({ navigation, screenProps, theme }) => ({
    tabBarIcon: ({ focused }) => {

      const { routeName } = navigation.state;
      let image: any

      let darkMode = () => eventEmitter.on('currentModeChanged', newMode => {
        // console.tron.log('Switched to', newMode, 'mode')
        return newMode
      })

      outsideDark = darkMode().currentMode

      let tint: string = ''


      if (routeName === 'dashboard') {
        if (focused) {
          image = outsideDark === 'dark' ? images.homeOnFocused : images.homeOnFocused
        } else {
          image = outsideDark === 'dark' ? images.tabAppLogoWhite : images.tabAppLogoBlue
          tint = outsideDark === 'dark' ? colors.white : colors.companyDarkGreen
        }
      }

      if (routeName === 'history') {
        if (focused) {
          image = outsideDark === 'dark' ? images.histroyOnFocused : images.histroyOnFocused
        } else {
          image = images.tabHistoryWhite 
          tint = outsideDark === 'dark' ? colors.white : colors.companyDarkGreen
        }
      }

      if (routeName === 'wallet') {
        if (focused) {
          image = outsideDark === 'dark' ? images.walletOnFocused : images.walletOnFocused
        } else {
          image = outsideDark === 'dark' ? images.tabWalletIcon : images.tabWalletIcon
          tint = outsideDark === 'dark' ? colors.white : colors.companyDarkGreen
        }
      }

      if(routeName === 'profile') {

        if (focused) {
          image = outsideDark === 'dark' ? images.profileOnFocused : images.profileOnFocused
        } else {
          image = outsideDark === 'dark' ? images.tabProfileIcon : images.tabProfileIcon
          tint = outsideDark === 'dark' ? colors.white : colors.companyDarkGreen
        }
      

        // let picture = _retrieveData()
      
        
        // image = outsideDark === 'dark' ? images.tabAppLogoWhite : images.tabAppLogoBlue

        // return <View
        //   style={{
        //     height: '100%',
        //     width: '100%',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     borderWidth: 0,
        //     backgroundColor: outsideDark === 'dark' ? colors.companyDarkGreen : colors.white
        //   }}
        // >
        //   <Image
        //     source={{ 
        //       uri: userPicture
        //     }}
        //     style={{
        //       width: 22, 
        //       height: 22,
        //       borderRadius: 10,
        //     }}
        //     resizeMethod={'auto'}
        //     resizeMode='cover'
        //   />
        // </View>
      }

      return <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0,
          // backgroundColor: outsideDark === 'dark' ? colors.companyDarkGreen : colors.white
        }}
      >
        <Image
          source={image}
          resizeMethod={'auto'}
          resizeMode='cover'
          style={{
            // marginTop: 5,
            marginLeft: routeName === 'profile' ? 0 : 5,
            marginRight: routeName === 'profile' ? 5 : 0,
            tintColor: tint
          }}
        />
      </View>
      
    },
  }),
  tabBarOptions: ({
    style: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    showLabel: false,
  }),
}

/**
 * The default tab navigator config for this app.
 */
export const DEFAULT_TAB_NAVIGATOR_CONFIG: TabNavigatorConfig = {}

/**
 * The default drawer navigator config for this app.
 */
export const DEFAULT_DRAWER_NAVIGATOR_CONFIG: DrawerNavigatorConfig = {
  hideStatusBar: false,
  // drawerBackgroundColor: colors.background,
  style: {
    // paddingTop: 40,
    borderTopWidth: 1
  },
  contentOptions: {
    // inactiveTintColor: colors.white,
    // activeTintColor: colors.palette.primaryPink,
    // activeBackgroundColor: colors.background,
    // inactiveBackgroundColor: colors.background,
    
    labelStyle: {
      // fontSize: 23,
      // fontFamily: fonts.dinLight,
      textTransform: "capitalize",
      // marginVertical: 10,
      // paddingVertical: 10,
      // borderBottomWidth: 1,
      // borderBottomColor: colors.dustyGray,
      // width: "90%"
    }
  }
}
