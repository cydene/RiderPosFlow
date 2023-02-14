import * as React from "react"
import { HeaderProps } from "./header.props"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ImageStyle, Platform, StatusBar
} from "react-native"
import { defaultTo } from "lodash"
import { SafeAreaView } from "react-navigation"
import { Icon } from "../icon"
import { Text } from "../text"
import { fonts, colors } from "../../theme"
import { translate } from "../../i18n/"

export const HEADER_HEIGHT = 64

const ROOT: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.background,
  alignItems: "center",
  justifyContent: "space-between",
  height: HEADER_HEIGHT,
  paddingBottom: 0,
  marginTop: Platform.OS === 'ios' ? 0 : 25
};

const TITLE: TextStyle = {
  textAlign: "center",
  fontFamily: fonts.TitilliumWebRegular,
  fontSize: 18,
  color: colors.black,
  marginTop: 10,
};

const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  bottom: 0,
  left: 0,
  zIndex: 1,
}

const SIDE: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
  height: 55,
  width: 55
}

const SIDE_LEFT: ViewStyle = {
  ...SIDE
}

const SIDE_TEXT: TextStyle = {
  fontFamily: fonts.TitilliumWebRegular,
  letterSpacing: 0.2,
  lineHeight: 16
}

const SIDE_RIGHT: ViewStyle = { ...SIDE }

const SIDE_ICON: ImageStyle = {
  height: 20,
  width: 20,
  // tintColor: colors.black,
  marginTop: Platform.OS === 'ios' ? 0 : 10,
}

const SIDE_ICON_CONTAINER: ImageStyle = {
  // paddingHorizontal: 5
}

const SIDE_BLANK: ViewStyle = {
  flex: 1
}

export class Header extends React.PureComponent<HeaderProps, {}> {
  renderLeft = () => {
    const {
      leftView,
      leftIcon,
      leftText,
      leftTx,
      leftBody,
      onLeftPress,
      leftIconStyle = {},
      navigation: { goBack }
    } = this.props

    if (leftView) {
      return leftView
    } else if (leftText || leftTx) {
      return (
        <TouchableOpacity
          onPress={onLeftPress ? onLeftPress : () => goBack()}
          style={SIDE_LEFT}
        >
          <Text
            text={leftTx ? translate(leftTx) : leftText}
            style={SIDE_TEXT}
            preset="link"
          />
        </TouchableOpacity>
      )
    } else if (leftIcon) {
      return (
        <TouchableOpacity
          onPress={onLeftPress ? onLeftPress : () => goBack()}
          style={leftBody || SIDE_LEFT}
        >
          <Icon
            icon={leftIcon}
            style={{ ...SIDE_ICON, ...leftIconStyle }}
            containerStyle={SIDE_ICON_CONTAINER}
          />
        </TouchableOpacity>
      )
    } else {
      return <View style={SIDE_BLANK} />
    }
  }

  renderRight = () => {
    const {
      rightView,
      rightIcon,
      rightText,
      rightTx,
      onRightPress,
      rightIconStyle = {}
    } = this.props

    if (rightView) {
      return rightView
    } else if (rightText || rightTx) {
      return (
        <TouchableOpacity onPress={onRightPress} style={SIDE_RIGHT}>
          <Text
            text={rightTx ? translate(rightTx) : rightText}
            style={SIDE_TEXT}
            preset="link"
          />
        </TouchableOpacity>
      )
    } else if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightPress} style={SIDE_RIGHT}>
          <Icon
            icon={rightIcon}
            style={{ ...SIDE_ICON, ...rightIconStyle }}
            containerStyle={SIDE_ICON_CONTAINER}
          />
        </TouchableOpacity>
      )
    } else {
      return <View style={SIDE_BLANK} />
    }
  }

  render() {
    const { titleTx, titleStyle } = this.props

    return (
      <SafeAreaView style={{ ...ROOT, ...this.props.style }}>
        <StatusBar barStyle={Platform.OS === "ios" ? "light-content" : "light-content"} translucent backgroundColor={colors.companyGreenTwo} />
        {this.renderLeft()}
  
        {Boolean(titleTx) && (
          <View style={TITLE_MIDDLE}>
            <Text
              style={{ ...TITLE, ...titleStyle }}
              text={translate(titleTx)}
            />
          </View>
        )}

        {this.renderRight()}
      </SafeAreaView>
    )
  }
}
