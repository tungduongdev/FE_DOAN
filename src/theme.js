import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
const APP_BAR_HEIGHT = '58px'
const BOT_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOT_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'
// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#1565c0'
        }
      }
    },
    dark: {
      palette: {
        background: {
          default: '#2c3e50'
        }
      }
    }
  },
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    botBarHeight: BOT_BAR_HEIGHT,
    boardContentHeigh: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  }
  ,
  components: {
    // Name of the component
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            with: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '4px',
            backgroundColor: '#bdc3c7'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            borderRadius: '4px',
            backgroundColor: '#00b894'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            textTransform: 'none',
            borderwith: '0.5px',
            '&:hover': {
              borderwith: '1px'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => {
            return {
              // color: theme.palette.text.primary,
              fontSize: '0.875rem',
              // '.MuiOutlinedInput-notchedOutline': {
              //   borderColor: theme.palette.primary.light
              // },
              // '&:hover': {
              //   '.MuiOutlinedInput-notchedOutline': {
              //     borderColor: theme.palette.primary.main
              //   }
              // },
              '& fieldset': {
                borderwith: '0.5px !important'
              },
              '&:hover fieldset': {
                borderwith: '1px !important'
              },
              '&.Mui-focused fieldset': {
                borderwith: '1px !important'
              }
            }
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            '&.MuiTypography-body1 css-ahj2mt-MuiTypography-root': {
              fontSize: '0.875rem'
            }
          }
        }
      }
    }
  }
})
export default theme