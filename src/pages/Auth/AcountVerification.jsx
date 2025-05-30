import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis/index'

function AcountVerification() {
  // lấy giá trị email va token từ url
  let [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  console.log('🚀 ~ file: AcountVerification.jsx ~ line 33 ~ AcountVerification ~ token', token)

  // tạo 1 biến để lưu trạng thái xác thực tài khoản
  const [isVerified, setIsVerified] = React.useState(false)

  // gọi api xác thực tài khoản
  React.useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => {
          setIsVerified(true)
        })
        .catch(() => {
          setIsVerified(false)
        })
    }
  }, [email, token])
  //nếu url có vấn đề thì bắn ra trang 404
  if (!email || !token) {
    return <Navigate to='/404' replace={true} />
  }
  // nếu đang xác thực thì hiển thị loading
  if (!isVerified) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }
  return <Navigate to= {`/login?verifiedEmail=${email}`} />
}

export default AcountVerification