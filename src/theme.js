import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
const APP_BAR_HEIGHT = '58px'
const BOT_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOT_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

// Create a theme instance with enhanced colors and modern styling
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0052cc',
          light: '#2684ff',
          dark: '#003884',
          contrastText: '#ffffff'
        },
        secondary: {
          main: '#ff5722',
          light: '#ff8a50',
          dark: '#c41c00'
        },
        background: {
          default: '#fafbfc',
          paper: '#ffffff'
        },
        grey: {
          50: '#fafbfc',
          100: '#f4f5f7',
          200: '#ebecf0',
          300: '#dfe1e6',
          400: '#b3bac5',
          500: '#8993a4',
          600: '#6b778c',
          700: '#5e6c84',
          800: '#42526e',
          900: '#253858'
        },
        text: {
          primary: '#172b4d',
          secondary: '#5e6c84',
          disabled: '#b3bac5'
        },
        success: {
          main: '#36b37e',
          light: '#57d9a3',
          dark: '#006644'
        },
        warning: {
          main: '#ffab00',
          light: '#ffc400',
          dark: '#ff8b00'
        },
        error: {
          main: '#de350b',
          light: '#ff5630',
          dark: '#bf2600'
        },
        info: {
          main: '#0065ff',
          light: '#2684ff',
          dark: '#0747a6'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#4a9eff',
          light: '#7bb3ff',
          dark: '#1976d2',
          contrastText: '#ffffff'
        },
        secondary: {
          main: '#f50057',
          light: '#ff5983',
          dark: '#bb002f'
        },
        background: {
          default: '#1a1d23',
          paper: '#282c34'
        },
        grey: {
          50: '#fafbfc',
          100: '#f4f5f7',
          200: '#e4e6ea',
          300: '#ddd',
          400: '#b3bac5',
          500: '#8c9bab',
          600: '#5e6c84',
          700: '#42526e',
          800: '#253858',
          900: '#172b4d'
        },
        success: {
          main: '#4caf50',
          light: '#81c784',
          dark: '#2e7d32'
        },
        warning: {
          main: '#ff9800',
          light: '#ffb74d',
          dark: '#f57c00'
        },
        error: {
          main: '#f44336',
          light: '#ef5350',
          dark: '#d32f2f'
        }
      }
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 8
  },
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    botBarHeight: BOT_BAR_HEIGHT,
    boardContentHeigh: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  components: {
    // Enhanced component styling
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
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
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px',
          fontWeight: 500,
          borderRadius: '6px',
          '&:hover': {
            borderWidth: '1px',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            fontSize: '0.875rem',
            borderRadius: '6px',
            '& fieldset': {
              borderWidth: '1px !important',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
            },
            '&:hover fieldset': {
              borderWidth: '1px !important',
              borderColor: theme.palette.primary.main
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px !important',
              borderColor: theme.palette.primary.main
            }
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    }
  }
})

export default theme