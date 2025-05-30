import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'
import { refreshTokenAPI } from '~/apis/index'
import { logoutUserApi } from '~/redux/User/userSlide'
//không thể import { store } from '~/redux/store' được giải pháp ở đây là dùng inject store
//hiểu đơn giản là khi ứng dụng chạy thì file đầu tiên chạy vào là main.jsx từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến main store vào trong file này
let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}
//khởi tạo 1 đối tượng axios
let authorizeAxiosInstace = axios.create()
// thời gian tối đa của 1 request là 10p
authorizeAxiosInstace.defaults.timeout = 1000 * 60 * 10
// withCredentials: sẽ cho phép axios gửi cookie trong request lên BE(phục vụ cho việc lưu JWT )
authorizeAxiosInstace.defaults.withCredentials = true

// Add a request interceptor
authorizeAxiosInstace.interceptors.request.use(function (config) {
  // Do something before request is sent
  // kỹ thuật chăn user click nhiều lần
  interceptorLoadingElements(true)
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
//khởi tạo 1 cái promise cho việc refresh token
//mục đích tạo promise này là để khi nào gọi api refresh-token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null


// Add a response interceptor
authorizeAxiosInstace.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // kỹ thuật chăn user click nhiều lần
  interceptorLoadingElements(false)
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // kỹ thuật chăn user click nhiều lần
  interceptorLoadingElements(false)

  // quan trọng khi xử lí refresh token tự động
  // trường hợp 1: khi nhận mã 401 từ be, thì gọi api đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserApi(false))
  }
  // trường hợp 2: khi nhận mã 410 từ be, thì gọi api refresh token để làm mới lại accessToken
  // đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  console.log('🚀 ~ originalRequests:', originalRequests)
  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    // kiểm tra nếu chưua có refreshTokenPromise thì thực hiện việc gán refreshTokenPromise = refreshTokenAPI()
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          //đồng thời accessToken đã nằm trong httpOnly cookie xử lí ở BE
          return data?.accessToken
        })
        .catch(() => {
          //nếu nhận bất kỳ lỗi nào từ api refresh token thì gọi api đăng xuất
          axiosReduxStore.dispatch(logoutUserApi(false))
        })
        .finally(() => {
          // dù api có lỗi hay thành công chúng ta đều gán refreshTokenPromise = null để cho lần sau gọi lại
          refreshTokenPromise = null
        })
    }
    // cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then((accessToken) => {
      //bước 1: trường hợp dự án lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code sử lí ở đây
      //vd: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      //hiện tại không cần sử lí bước 1 vì chúng ta đã đưa access token vào cookie
      //bước 2: bước quan trọng: return lại axios instace của chúng ta kết hợp các originalRequest để gọi lại nhưng api ban đầu
      return authorizeAxiosInstace(originalRequests)
    })
  }

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})


export default authorizeAxiosInstace