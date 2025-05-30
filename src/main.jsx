import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import theme from '~/theme.js'

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'
//redux configuration
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// Date picker provider
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/en'

//react configuration
import { BrowserRouter } from 'react-router-dom'

// cấu hình persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistor = persistStore(store)

// kỹ thuật inject store vào axios
import { injectStore } from '~/utils/authorizeAxios'
import ChatBot from '~/components/ChatBot/ChatBot'




injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <ConfirmProvider>
              <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
              <CssBaseline />
              <App />
              <ChatBot />
              <ToastContainer position="bottom-right" />
            </ConfirmProvider>
          </LocalizationProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
