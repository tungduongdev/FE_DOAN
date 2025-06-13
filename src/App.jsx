import Board from '~/pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import AcountVerification from './pages/Auth/AcountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'
import Settings from '~/pages/Settings/Settings.jsx'
import Boards from '~/pages/Boards/index.jsx'
import DashboardContainer from '~/pages/Dashboard/index.jsx'
import { NotificationProvider } from '~/contexts/NotificationContext'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

function App() {

  const currentUser = useSelector(selectCurrentUser)

  return (
    <NotificationProvider>
      <Routes>
        {/* react router dom */}
        <Route path='/' element={
          // ở đây cần replace={true} để thay thế đường dẫn hiện tại, có thể hiểu là route sẽ không còn nằm trong history của trình duyệt nữa
          // nếu không có replace={true} thì khi click vào nút back của trình duyệt, sẽ quay lại trang trước đó, không phải là trang trắng
          <Navigate to='/boards' replace={true} />} />
        {/* protected routes chỉ cho phép người dùng truy cập khi đã đăng nhập */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          <Route path='/boards/:boardId' element={<Board />} />
          <Route path='/boards' element={<Boards />} />
          <Route path='/boards/:boardId/dashboard' element={<DashboardContainer />} />
          { }
          <Route path='/settings/account' element={<Settings />} />
          <Route path='/settings/security' element={<Settings />} />
        </Route>
        {/* Authentication */}
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<AcountVerification />} />
        {/* 404 not found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </NotificationProvider>
  )
}

export default App
