import React from 'react'
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native'

const logo = require('../assets/logo.png')

interface BrandLogoProps {
  size?: number
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
}

export function BrandLogo({ size = 48, style, imageStyle }: BrandLogoProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={logo}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.22,
          },
          imageStyle,
        ]}
        resizeMode="cover"
        accessibilityLabel="Gray Space"
      />
    </View>
  )
}

export const BRAND_LOGO = logo
