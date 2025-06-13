import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAxiosInstace from '~/utils/authorizeAxios'

const API_BE_URL = 'https://be-doan-8bvg.onrender.com/'
// const API_BE_URL = 'http://localhost:8011/'

// các hành động gọi api hoặc xử lý dữ liệu không đồng bộ dùng middleware createAsyncThunk đi kèm với extraReducers
export const loginUserApi = createAsyncThunk(
  'currentUser/loginUserApi',
  async (data) => {
    const response = await authorizeAxiosInstace.post(`${API_BE_URL}v1/users/login`, data)
    return response.data
  }
)

export const logoutUserApi = createAsyncThunk(
  'user/logoutUserApi',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstace.delete(`${API_BE_URL}v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully')
    }
    return response.data
  }
)

export const updateUserInfoApi = createAsyncThunk(
  'currentUser/updateUserInfoApi',
  async (data) => {
    const response = await authorizeAxiosInstace.put(`${API_BE_URL}v1/users/update`, data)
    console.log('response.data', response.data)
    return response.data
  }
)

export const activeUserSlice = createSlice({
  name: 'currentUser',
  // Khởi tạo giá trị state của slice
  initialState: {
    currentUser: null
  },
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // Nơi xử lý dữ liệu không đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
      const user = action.payload
      // Cập nhật state
      state.currentUser = user
    })
    builder.addCase(logoutUserApi.fulfilled, (state) => {
      // clear thông tin user trong redux
      // kết hợp với protected route để đẩy về trang login
      state.currentUser = null
    })
    builder.addCase(updateUserInfoApi.fulfilled, (state, action) => {
      const user = action.payload
      // Cập nhật state
      state.currentUser = user
      toast.success('Update successfully')
    })
  }
})


//selector: lấy dữ liệu từ state trong redux để sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = activeUserSlice.reducer