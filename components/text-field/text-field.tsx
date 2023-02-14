import * as React from "react"
import {View, TextInput, TextStyle, ViewStyle, Image} from "react-native"
import {colors, fonts, images} from "../../theme"
import { translate } from "../../i18n"
import { Text } from "../text"
import { TextFieldProps } from "./text-field.props"
import { mergeAll, flatten } from "lodash/fp"
import {Layout} from "../../constants";

// the base styling for the container
const CONTAINER = (
  isInvalid: boolean = false,
  hasBorder: boolean = true
): ViewStyle => ({
  borderWidth: hasBorder ? 2 : 0,
  borderColor: isInvalid ? colors.red : colors.textFieldBDColor,
  // width: Layout.window.width / 1.3,
  borderRadius: 10,
  flexDirection: 'row',
  backgroundColor: colors.white,
  alignItems: "center",
  justifyContent: "center",
})

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: fonts.PoppinsRegular,
  color: colors.darkGreen,
  paddingHorizontal: 18,
  // paddingVertical: 16,
  backgroundColor: colors.textFieldBGColor,
  height: 50,
  // lineHeight: 10,
  borderRadius: 10,
  borderColor: colors.textFieldBDColor,
  width: Layout.window.width / 1.35,
  // fontSize: 15
}

const FIELD_VALIDATION = (
  isInvalid: boolean = false,
  showRightAway: boolean = true
): TextStyle => ({
  // marginTop: 4,
  paddingLeft: 18,
  // marginBottom: 6,
  opacity: isInvalid ? 1 : 0,
  display: showRightAway ? "flex" : isInvalid ? "flex" : "none"
})

const LABEL: TextStyle = {
  marginBottom: 4,
  color: colors.darkPurple,
  fontFamily: fonts.PoppinsRegular,
  textAlign: 'left'
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {}
}

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]))
}

interface State {}

/**
 * A component which has a label and an input together.
 */
export class TextField extends React.Component<TextFieldProps, State> {
  render() {
    const {
      placeholderTx,
      placeholder,
      labelTx,
      labelTxOptions,
      textContentType,
      label,
      preset = "default",
      style: styleOverride,
      inputStyle: inputStyleOverride,
      forwardedRef,
      isInvalid,
      fieldError,
      padFieldForError = true,
      extraComponent,
      topComponent,
      multiline,
      numberOfLines,
      onTouchEnd,
      keyboardType,
      ...rest
    } = this.props

    const shouldInvalid = isInvalid && !!fieldError

    let containerStyle: ViewStyle = {
      ...CONTAINER(shouldInvalid),
      ...PRESETS[preset]
    }
    containerStyle = enhance(containerStyle, styleOverride)

    let inputStyle: TextStyle = INPUT
    inputStyle = enhance(inputStyle, inputStyleOverride)
    const placeholderText = placeholderTx
      ? translate(placeholderTx)
      : placeholder

    const labelText = labelTx ? translate(labelTx,labelTxOptions) : label

    return (
      <>
        <View
          style={{
            width: '77%'
          }}
        >
          {Boolean(labelText) && (
            <Text preset="fieldLabel" text={labelText} style={LABEL} />
          )}
        </View>

        <View style={containerStyle}>
          {Boolean(topComponent) ? topComponent : null}
          <TextInput
            clearButtonMode={"while-editing"}
            placeholder={placeholderText}
            placeholderTextColor={colors.textFieldColor}
            underlineColorAndroid={colors.transparent}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            multiline={multiline}
            style={inputStyle}
            ref={forwardedRef}
            {...rest}
            numberOfLines={numberOfLines}
            autoCorrect={false}
            textContentType={textContentType}
            onTouchEnd={onTouchEnd}
            keyboardType={keyboardType || "default"}
          />

          {Boolean(extraComponent) ? extraComponent : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignSelf: 'flex-start',
            marginLeft: 35
          }}
        >
          {
            shouldInvalid && (
              <Image
                source={images.errorIcon}
                style={{
                  marginBottom: 5
                }}
              />
            )
          }
          
          <Text
            preset="fieldError"
            tx={shouldInvalid ? fieldError : null}
            style={FIELD_VALIDATION(isInvalid, padFieldForError)}
          />
          
        </View>
      </>
    )
  }
}
