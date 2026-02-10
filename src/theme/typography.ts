import { TextStyle } from 'react-native';

export const fontFamilies = {
  heading: 'PlayfairDisplay_700Bold',
  headingMedium: 'PlayfairDisplay_500Medium',
  headingRegular: 'PlayfairDisplay_400Regular',
  headingItalic: 'PlayfairDisplay_700Bold_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_700Bold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  // Headings - Playfair Display
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: 32,
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    lineHeight: 36,
  } as TextStyle,
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,
  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,
  h5: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  // Body - DM Sans
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  bodyXSmall: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    lineHeight: 14,
  } as TextStyle,

  // Medium weight body
  bodyLargeMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmallMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // SemiBold weight body
  bodyLargeSemiBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  bodySemiBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmallSemiBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // Bold weight body
  bodyLargeBold: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  bodyBold: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmallBold: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // Special
  price: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,
  stat: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    lineHeight: 36,
  } as TextStyle,
  badge: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  } as TextStyle,
  tabLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
  } as TextStyle,
} as const;
