export const theme = {
  layout: {
    desktopWidth: "80%",
    mobileWidth: "95%",
    mainContentPadding: 24,
  },
  header: {
    height: 56,
  },
  mediaQueries: {
    mobileBreakpoint: "48rem",
    mobilePixel: 768,
    desktopPixel: 1024,
    mobileSmallPixel: 320,
    footerMinWidth: "50rem",
  },
  fontFamily: {
    regular: "roboto-regular",
    italic: "roboto-italic",
    bold: "roboto-bold",
    boldItalic: "roboto-bold-italic",
  },
  macroFont: {
    tinyBold: "normal normal bold 16px/20px roboto-bold",
    smallBold: "normal normal bold 24px/28px roboto-bold",
    mediumBold: "normal normal bold 30px/36px roboto-bold",
    highBold: "normal normal bold 32px/38px roboto-bold",
    tinyRegular: "normal normal bold 16px/21px roboto-regular",
    mediumRegular: "normal normal bold 24px/32px roboto-regular",
  },
  colors: {
    primary: "#0F054C",
    popupColor: "#251D64",
    error: "#DB2828",
    black: "#212121",
    border: "#ECEBEC",
    white: "#FFFFFF",
  },
  backgroundGradient: `transparent
      radial-gradient(
        closest-side at 51% 50%,
        #2b237c 0%,
        #251c72 31%,
        #0f054c 100%
      )
      0% 0% no-repeat padding-box !important;`,

  boxshadow: "0px 2px 6px #0000001A",
  boxshadowLogin: " 0px 4px 56px #8383833D",

  inputTokenWidth: 78,
  inputSelectButtonWidth: 81,
  buttonBackgroundGradient: "transparent",
};

export default theme;
