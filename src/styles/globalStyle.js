import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *, *:before, *:after {
      -webkit-box-sizing: inherit;
      -moz-box-sizing: inherit;
      box-sizing: inherit;
    }

    *:focus {
      outline: none;
    }

    html {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    };

    body {
      margin: 0;
      width: 100%;
      height: 100%;
      line-height: inherit;
      overflow: auto;
      min-width: 0;
      font-family: roboto-regular;
      color: ${({ theme: { colors } }) => colors.primary};
      background: transparent radial-gradient(closest-side at 51% 50%, #2B237C 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box;
      opacity: 1;
      background-size: cover;
      background-repeat: no-repeat;
    };

    #root {
      height: 100%;

      & > div:first-child {
        display: flex;
        flex-flow: column;
        height: 100%;
      }
    }

    .ui.input>input {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
      border-radius: 4px;
    }

    .ui.input>input:active, .ui.input>input:focus {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
    }

    .ui.disabled.button {
      opacity: 1 !important;
    }

    .desktop-none {
      @media (min-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.mobilePixel + 1}px`}) {
        display: none !important;
      }
    }

    .mobile-none {
      @media (max-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.mobilePixel}px`}) {
        display: none !important;
      }
    }

  .ui.dropdown{
    font-size: 18px;
    color: #ffffff!important;
    background: transparent !important;
    border-radius: 5px;
    font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  }

  .ui.selection.visible.dropdown{
      background:  ${({ theme: { colors } }) => colors.primary} !important;
  }
  
  .ui.selection.visible.dropdown>.text:not(.default){
    color: #ffffff !important;
  }

  .ui.selection.visible.dropdown .menu{
    border: 1px solid #ffffff !important;
    border-top: none !important;
  }

  .ui.selection.dropdown .menu>.item{
    background:  ${({ theme: { colors } }) => colors.primary};
    color:#ffffff;
    border: none;
    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
        font-size: 12px;
    }
  }

  .sender-dropdown.ui.dropdown{
    font-size: 18px;
    border: 1px solid #ffffff !important ;
    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
        font-size: 12px;
  }
}

  .receiver-dropdown.ui.dropdown{
    font-size: 18px;
    min-width: 7.5em !important;
    border: none !important;

    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
        font-size: 12px !important;
        min-width: 3.5em !important;
    }

    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel}px`}) {
        min-width: 7.5em !important;
    }

  }

  .ui.input {
    border: 1px solid #ffffff;
    border-radius: 5px;
    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
        font-size: 12px !important;
        min-width: 4.5em !important;
    }
}


`;
