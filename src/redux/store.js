import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from '~/redux/User/userSlide'
import { activeCardReducer } from './activeCard/activeCardSlide'

import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'// defaults to localStorage for web
import { notificationsReducer } from './notifications/notificationsSlice'

// cấu hình persist
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'] // chỉ lưu lại user
}

// combine các reducer
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

// persist reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)
export const store = configureStore({
  reducer: persistedReducer,
  // fix lỗi devtool redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})