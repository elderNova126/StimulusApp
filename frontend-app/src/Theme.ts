import { extendTheme } from '@chakra-ui/react';
import { createTheme } from '@material-ui/core';

const poppinsFontFamily = {
  fontFamily: '"Poppins"',
};

const robotoFontFamily = {
  fontFamily: '"Roboto"',
};

const StimulusTheme = createTheme({
  typography: {
    fontFamily: '"Poppins","Roboto"',
    h1: poppinsFontFamily,
    h2: poppinsFontFamily,
    h3: poppinsFontFamily,
    h4: poppinsFontFamily,
    h5: poppinsFontFamily,
    h6: poppinsFontFamily,
    subtitle1: poppinsFontFamily,
    subtitle2: robotoFontFamily,
    body1: robotoFontFamily,
    body2: robotoFontFamily,
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#1BB062',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  overrides: {
    MuiContainer: {
      maxWidthXl: {
        paddingLeft: '64px',
        paddingRight: '64px',
      },
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiSlider: {
      thumb: { color: '#C2C2C2' },
      track: { color: 'black' },
      rail: { color: '#DBDBDB' },
    },
    MuiMenuItem: {
      root: {
        '&$selected': {
          backgroundColor: '#158048',
        },
      },
    },
    MuiInputBase: {
      root: {
        maxHeight: '2.5rem',
      },
    },
  },
});

export const StimulusChakraTheme = extendTheme({
  shadows: {
    stimLight: '0px 0px 3.1px 0px #00000033',
    stimMedium: '0px 0px 4px #00000040',
    stimDark: '-2px -2px 4px rgba(0, 6, 36, 0.2),2px  2px 4px rgba(0, 0, 0, 0.2)',
  },
  colors: {
    primary: '#2A2A28',
    secondary: '#C62F40',
    event: {
      red: '#BCE6CE',
      green: '#EB496933',
      gray: '#F1F1F1',
    },
    alert: {
      red: '#C62F40',
      green: '#E9F8ED',
      yellow: '#FFF8E5',
    },
    green: {
      100: '#C7EBD9',
      200: '#B0E2C8',
      300: '#8AD5AE',
      400: '#5FC891',
      500: '#15844B',
      600: '#12814B',
    },
    ambient: {
      100: '#F9FEFB',
      200: '#FAFBF3',
      300: '#F1F1E8',
      400: '#F5F5D9',
      500: '#D2D7BB',
    },
    gray: {
      100: '#919482',
      200: '#7A7D72',
      300: '#666A5F',
      400: '#4D4F4A',
      500: '#2A2A28',
      600: '#1F1F1E',
      700: '#1A1A19',
    },
    lightgray: {
      100: '#D5D5D5',
    },
    pink: { 100: '#E6949E' },
    blue: {
      100: '#E9F3F3',
      200: '#11B2BC',
      300: '#11B2BC',
    },
    gradient: {
      iconbutton:
        'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%), #FFFFFF',
      border: 'linear-gradient(90deg, #F4F4F4 0%, rgba(249, 249, 249, 0) 95%)',
      stimPrimary: 'linear-gradient(180deg, #12814B 100%, #115B35 100%)',
      stimAccent: 'linear-gradient(180deg, #4C6EFF 100%, #273C75 100%)',
      stimNeutral: 'linear-gradient(180deg, #171717 100%, #595959 100%)',
    },
    menu: {
      company_category: '#E9F8ED',
    },
    stimPrimary: {
      light: '#69B792',
      base: '#12814B',
      dark: '#115B35',
    },
    stimSecondary: {
      accent1: '#4C6EFF',
      accent2: '#273C75',
    },
    stimNeutral: {
      black: '#171717',
      white: '#FFFFFF',
      lightGray: '#D9D9D9',
      mediumGray: '#A3A3A3',
      darkGray: '#595959',
    },
    stimSemantic: {
      success: '#29A971',
      error: '#D5293D',
      errorLight: '#E8122B',
      darkDark: '#B91528',
      warning: '#F4B62A',
      warningLight: '#FFB100',
      warningDark: '#EFAE1C',
    },
    stimOverlay: {
      light: '#17171780',
      dark: '#17171799',
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  textStyles: {
    h1: {
      fontSize: ['34px', '34px'],
      fontWeight: '500',
      lineHeight: '51px',
      color: 'primary',
    },
    h1_profile: {
      fontSize: ['28px', '28px'],
      fontWeight: '500',
      lineHeight: '42px',
      color: 'primary',
    },
    h2: {
      fontSize: ['18px', '18px'],
      fontWeight: 400,
      lineHeight: '27px',
      color: 'primary',
    },
    h3: {
      fontSize: ['16px', '16px'],
      fontWeight: 400,
      lineHeight: '24px',
      color: '#002739',
    },
    h4: {
      fontSize: ['14px', '14px'],
      fontWeight: 600,
      lineHeight: '21px',
      color: 'primary',
    },
    h5: {
      fontSize: ['12px', '12px'],
      fontWeight: 600,
      lineHeight: '18px',
      color: 'primary',
    },
    h6: {
      fontSize: ['11px', '11px'],
      fontWeight: 600,
      lineHeight: '16px',
      color: '#666666',
    },
    body: {
      fontSize: ['14px', '14px'],
      fontWeight: 400,
      lineHeight: '21px',
      color: 'primary',
    },
    fieldHelperText: {
      fontWeight: 400,
      fontSize: ['13px', '13px'],
      lineHeight: '19px',
      color: '#5C5C5C',
    },
    circleBgNumbers: {
      fontWeight: 400,
      color: '#5C5C5C',
      mr: '5px',
      bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%), #FFFFFF',
      p: '5px',
      fontSize: '11px',
      borderRadius: '50%',
      w: '24px',
      h: '24px',
      lineHeight: '15px',
      textAlign: 'center',
    },
    inRowTooltip: {
      fontWeight: 400,
      fontSize: ['11px', '11px'],
      lineHeight: '15px',
      letterSpacing: '-0.25px',
      color: 'primary',
    },
    filterFieldHeading: {
      fontWeight: 400,
      fontSize: ['12px', '12px'],
      lineHeight: '18px',
      color: 'primary',
    },
    searchTagLinks: {
      fontWeight: 600,
      fontSize: ['13px', '13px'],
      lineHeight: '19px',
      textDecorationLine: 'underline',
    },
    miniTextLink: {
      fontWeight: 400,
      fontSize: ['11px', '11px'],
      lineHeight: '15px',
      textDecorationLine: 'underline',
      color: '#666666',
    },
    tableSubInfo: {
      fontWeight: 600,
      fontSize: ['12px', '12px'],
      lineHeight: '18px',
      color: 'primary',
    },
    tableSubInfoSecondary: {
      fontWeight: 400,
      fontSize: ['12px', '12px'],
      lineHeight: '18px',
      color: 'primary',
    },
    textLink: {
      fontWeight: 500,
      fontSize: ['13px', '13px'],
      lineHeight: '19px',
      textDecorationLine: 'underline',
      color: 'primary',
      cursor: 'pointer',
    },
    horizontalTabs: {
      fontSize: ['16px', '16px'],
      lineHeight: '24px',
      fontWeight: 600,
    },
    verticalTabs: {
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '22px',
    },
    pagination: {
      fontSize: ['11px', '11px'],
      fontWeight: 300,
      lineHeight: '15px',
      color: 'primary',
    },
    squareSolidActive: {
      fontWeight: 600,
      fontSize: '13px',
      lineHeight: '19px',
      color: '#12814B',
    },
    squareGradient: {
      fontWeight: 600,
      fontSize: '13px',
      lineHeight: '19px',
    },
    sidenavCategory: {
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '22px',
      color: 'primary',
    },
    sidenavParent: {
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '18px',
    },
    sidenavChild: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '18px',
      color: 'primary',
    },
  },
  components: {
    Checkbox: {
      variants: {
        stimulus: {
          control: {
            border: '1px solid black',
            _checked: {
              bg: '#2A2A28',
              border: '1px solid black',
            },
          },
        },
      },
    },
    Button: {
      variants: {
        active: {
          color: 'primary',
          bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%), #FFFFFF',
        },
        rounded: {
          color: 'primary',
          fontWeight: 600,
          borderRadius: '28px',
          bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%), #FFFFFF',
        },
        quickAction: {
          maxHeight: '26px',
          bg: 'gradient.iconbutton',
          borderRadius: '15px',
          fontWeight: '600',
          fontSize: '11px',
          lineHeight: '16px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: 'primary',
        },
        stimPrimary: {
          bg: 'stimPrimary.base',
          color: 'white',
          _hover: {
            bg: 'stimSecondary.accent1',
            _disabled: {
              bg: 'stimNeutral.lightGray',
            },
          },
          _focus: {
            bg: 'stimPrimary.light',
          },
          _active: {
            bg: 'stimSecondary.accent2',
          },
          _disabled: {
            bg: 'stimNeutral.lightGray',
          },
        },
        stimTextButton: {
          bg: 'transparent',
          color: 'stimPrimary.base',
          textDecoration: 'underline solid',
          _hover: {
            color: 'stimSecondary.accent1',
            _disabled: {
              color: 'stimNeutral.lightGray',
            },
          },
          _focus: {
            color: 'stimPrimary.light',
          },
          _active: {
            color: 'stimSecondary.accent2',
          },
          _disabled: {
            color: 'stimNeutral.lightGray',
          },
        },
        stimOutline: {
          border: '1px solid',
          borderColor: 'stimPrimary.base',
          color: 'stimPrimary.base',
          bg: 'transparent',
          _hover: {
            bg: 'stimPrimary.light',
            borderColor: 'stimPrimary.light',
            color: 'white',
            _disabled: {
              bg: 'stimNeutral.mediumGray',
              borderColor: 'stimNeutral.lightGray',
              color: 'stimNeutral.darkGray',
            },
          },
          _focus: {
            bg: 'stimPrimary.light',
            borderColor: 'stimPrimary.light',
            color: 'white',
          },
          _active: {
            bg: 'stimPrimary.dark',
            borderColor: 'stimPrimary.dark',
            color: 'white',
          },
          _disabled: {
            bg: 'stimNeutral.mediumGray',
            borderColor: 'stimNeutral.lightGray',
            color: 'stimNeutral.darkGray',
          },
        },
        stimDestructive: {
          bg: 'stimSemantic.error',
          color: 'white',
          _hover: {
            bg: 'stimSemantic.errorLight',
            _disabled: {
              bg: 'stimNeutral.lightGray',
            },
          },
          _active: {
            bg: 'stimSemantic.darkDark',
          },
          _disabled: {
            bg: 'stimNeutral.lightGray',
            color: 'stimNeutral.mediumGray',
          },
          _loading: {
            _hover: {
              bg: 'stimSemantic.darkDark',
            },
          },
        },
        stimWarning: {
          bg: 'stimSemantic.warning',
          color: 'white',
          _hover: {
            bg: 'stimSemantic.warningLight',
          },
          _active: {
            bg: 'stimSemantic.warningDark',
          },
        },
        stimReset: {
          bg: 'stimNeutral.darkGray',
          color: 'white',
          _hover: {
            bg: 'stimNeutral.mediumGray',
          },
          _active: {
            bg: 'stimNeutral.black',
          },
        },
      },
      sizes: {
        stimSmall: {
          fontSize: '12px',
          lineHeight: '22px',
          fontWeight: '500',
          px: ['16px', '16px', '14px', '12px'],
          py: ['10px', '10px', '8px', '6px'],
          width: 'fit-content',
          borderRadius: '4px',
          boxSizing: 'border-box',
        },
        stimMedium: {
          fontSize: '14px',
          lineHeight: '24px',
          fontWeight: '500',
          px: ['24px', '24px', '22px', '20px'],
          py: ['16px', '16px', '14px', '12px'],
          width: 'fit-content',
          borderRadius: '4px',
          boxSizing: 'border-box',
        },
        stimLarge: {
          fontSize: '16px',
          lineHeight: '26px',
          fontWeight: '500',
          px: ['28px', '28px', '26px', '24px'],
          py: ['20px', '20px', '18px', '16px'],
          width: 'fit-content',
          borderRadius: '4px',
          boxSizing: 'border-box',
        },
      },
    },
    Text: {
      variants: {
        detailslink: {
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '11px',
          lineHeight: '16px',
          textDecorationLine: 'underline',
          color: '#666666',
        },
        stimH1: {
          fontSize: ['48px', '48px', '64px'],
          fontWeight: 600,
          lineHeight: '80px',
          color: 'stimNeutral.black',
        },
        stimH2: {
          fontSize: ['32px', '32px', '48px'],
          fontWeight: 600,
          lineHeight: '64px',
          color: 'stimNeutral.black',
        },
        stimH3: {
          fontSize: ['24px', '24px', '32px'],
          fontWeight: 600,
          lineHeight: '48px',
          color: 'stimNeutral.black',
        },
        stimH4: {
          fontSize: ['20px', '20px', '24px'],
          fontWeight: 600,
          lineHeight: '36px',
          color: 'stimNeutral.black',
        },
        stimH5: {
          fontSize: ['18px', '18px', '20px'],
          fontWeight: 600,
          lineHeight: '30px',
          color: 'stimNeutral.black',
        },
        stimH6: {
          fontSize: ['16px', '16px', '18px'],
          fontWeight: 600,
          lineHeight: '28px',
          color: 'stimNeutral.black',
        },
        stimH7: {
          fontSize: ['14px', '14px', '16px'],
          fontWeight: 600,
          lineHeight: '28px',
          color: 'stimNeutral.black',
        },
        stimSubtitle1: {
          fontSize: ['14px', '14px', '16px'],
          fontWeight: 600,
          lineHeight: '24px',
          color: 'stimNeutral.black',
        },
        stimSubtitle2: {
          fontSize: ['12px', '12px', '14px'],
          fontWeight: 600,
          lineHeight: '22px',
          color: 'stimNeutral.black',
        },
        stimBody1: {
          fontSize: ['14px', '14px', '16px'],
          fontWeight: 500,
          lineHeight: '24px',
          color: 'stimNeutral.black',
        },
        stimBody2: {
          fontSize: ['12px', '12px', '14px'],
          fontWeight: 500,
          lineHeight: '22px',
          color: 'stimNeutral.black',
        },
        stimCaption: {
          fontSize: ['10px', '10px', '12px'],
          fontWeight: 400,
          lineHeight: '18px',
          color: 'stimNeutral.black',
        },
        stimSmallCaption: {
          fontSize: ['9px', '10px', '10px'],
          fontWeight: 400,
          lineHeight: '18px',
          color: 'stimNeutral.black',
        },
        stimOverline: {
          fontSize: ['10px', '10px', '12px'],
          fontWeight: 700,
          lineHeight: '18px',
          letterSpacing: '1.2',
          color: 'stimNeutral.black',
        },
      },
    },
    Input: {
      variants: {
        stimInput: {
          field: {
            borderColor: 'primary',
            boxShadow: 'stimLight',
            borderRadius: '4px',
            _hover: {
              boxShadow: 'stimMedium',
            },
            _focus: {
              borderColor: 'stimNeutral.darkGray',
              border: '1px solid',
            },
            _invalid: {
              borderColor: 'stimSemantic.error',
              border: '1px solid',
            },
          },
        },
      },
      sizes: {
        stimSmall: {
          field: {
            fontSize: '12px',
            py: ['8px', '8px', '8px'],
            px: ['10px', '12px', '12px'],
            h: ['36px', '38px', '40px'],
          },
        },
        stimMedium: {
          field: {
            fontSize: '14px',
            py: ['10px', '10px', '12px'],
            px: ['14px', '14px', '16px'],
            h: ['42px', '44px', '48px'],
          },
        },
        stimLarge: {
          field: {
            fontSize: '18px',
            px: ['12px', '14px', '16px'],
            py: ['16px', '18px', '20px'],
            h: ['50px', '52px', '56px'],
          },
        },
      },
    },
    Switch: {
      variants: {
        stimulus: {
          thumb: {
            border: '1px solid black',
            mt: '-2px',
            w: '18px',
            h: '18px',
            ml: '-2px',
            _checked: {
              ml: '4px !important',
            },
          },
          track: {
            bg: '#FFFFFF',
            border: '1px solid black',
            w: '34px',
            h: '14px',
            _checked: {
              bg: '#2A2A28',
            },
          },
        },
      },
    },
  },
});
export default StimulusTheme;
