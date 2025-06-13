import { useState } from 'react'
import {
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  TextField
} from '@mui/material'
import { refreshTokenAPI, logoutUserAPI } from '~/apis'
import { useDispatch } from 'react-redux'
import { logoutUserApi } from '~/redux/User/userSlide'
import { toast } from 'react-toastify'

function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState(null)
  const dispatch = useDispatch()

  const handleRefreshToken = async () => {
    try {
      console.log('🔄 Manual refresh token attempt...')
      const response = await refreshTokenAPI()
      console.log('✅ Manual refresh success:', response.data)
      toast.success('Refresh token thành công!')
      setDebugInfo(prev => ({
        ...prev,
        lastRefresh: new Date().toLocaleString(),
        refreshStatus: 'SUCCESS'
      }))
    } catch (error) {
      console.error('❌ Manual refresh failed:', error)
      toast.error('Refresh token thất bại!')
      setDebugInfo(prev => ({
        ...prev,
        lastRefresh: new Date().toLocaleString(),
        refreshStatus: 'FAILED',
        error: error.message
      }))
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUserAPI()
      dispatch(logoutUserApi(true))
      toast.success('Đăng xuất thành công!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Lỗi khi đăng xuất!')
    }
  }

  const handleClearCookies = () => {
    // Clear all cookies for this domain
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    })
    toast.success('Đã xóa tất cả cookies!')
    setDebugInfo(prev => ({
      ...prev,
      cookiesCleared: new Date().toLocaleString()
    }))
  }

  const checkCookies = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=')
      acc[name] = value
      return acc
    }, {})

    console.log('🍪 Current cookies:', cookies)

    setDebugInfo({
      cookies,
      hasAccessToken: !!cookies.accessToken,
      hasRefreshToken: !!cookies.refreshToken,
      accessTokenLength: cookies.accessToken?.length || 0,
      refreshTokenLength: cookies.refreshToken?.length || 0,
      timestamp: new Date().toLocaleString()
    })
  }

  const testAuthenticatedRequest = async () => {
    try {
      console.log('🧪 Testing authenticated request...')
      // Test với một API yêu cầu authentication
      const response = await fetch('/api/v1/users/update', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('🧪 Test response status:', response.status)

      if (response.status === 200) {
        toast.success('Test request thành công!')
        setDebugInfo(prev => ({
          ...prev,
          testRequest: 'SUCCESS',
          testTime: new Date().toLocaleString()
        }))
      } else {
        toast.error(`Test request thất bại! Status: ${response.status}`)
        setDebugInfo(prev => ({
          ...prev,
          testRequest: `FAILED - ${response.status}`,
          testTime: new Date().toLocaleString()
        }))
      }
    } catch (error) {
      console.error('🧪 Test request error:', error)
      toast.error('Test request có lỗi!')
      setDebugInfo(prev => ({
        ...prev,
        testRequest: `ERROR - ${error.message}`,
        testTime: new Date().toLocaleString()
      }))
    }
  }

  if (import.meta.env.VITE_BUILD_MODE !== 'dev') {
    return null
  }

  return (
    <Paper sx={{ p: 2, maxWidth: 600, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔧 Debug Authentication
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={checkCookies}>
            Check Cookies
          </Button>
          <Button variant="outlined" onClick={handleRefreshToken}>
            Manual Refresh
          </Button>
          <Button variant="outlined" onClick={testAuthenticatedRequest}>
            Test Auth Request
          </Button>
          <Button variant="outlined" color="warning" onClick={handleClearCookies}>
            Clear Cookies
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>

        {debugInfo && (
          <>
            <Divider />
            <Alert severity={debugInfo.hasAccessToken ? "success" : "error"}>
              <Typography variant="body2">
                <strong>Access Token:</strong> {debugInfo.hasAccessToken ? 'Present' : 'Missing'}
                {debugInfo.accessTokenLength > 0 && ` (${debugInfo.accessTokenLength} chars)`}
              </Typography>
              <Typography variant="body2">
                <strong>Refresh Token:</strong> {debugInfo.hasRefreshToken ? 'Present' : 'Missing'}
                {debugInfo.refreshTokenLength > 0 && ` (${debugInfo.refreshTokenLength} chars)`}
              </Typography>
              <Typography variant="body2">
                <strong>Checked at:</strong> {debugInfo.timestamp}
              </Typography>
            </Alert>

            {debugInfo.refreshStatus && (
              <Alert severity={debugInfo.refreshStatus === 'SUCCESS' ? "success" : "error"}>
                <Typography variant="body2">
                  <strong>Last Refresh:</strong> {debugInfo.refreshStatus} at {debugInfo.lastRefresh}
                </Typography>
                {debugInfo.error && (
                  <Typography variant="body2" color="error">
                    <strong>Error:</strong> {debugInfo.error}
                  </Typography>
                )}
              </Alert>
            )}

            {debugInfo.testRequest && (
              <Alert severity={debugInfo.testRequest === 'SUCCESS' ? "success" : "error"}>
                <Typography variant="body2">
                  <strong>Test Request:</strong> {debugInfo.testRequest} at {debugInfo.testTime}
                </Typography>
              </Alert>
            )}

            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <strong>All Cookies:</strong>
              <pre>{JSON.stringify(debugInfo.cookies, null, 2)}</pre>
            </Typography>
          </>
        )}
      </Stack>
    </Paper>
  )
}

export default DebugAuth 