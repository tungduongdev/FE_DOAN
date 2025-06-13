import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { socketIoInstance } from '~/socketClient'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    if (!currentUser?._id) return

    // Lắng nghe thông báo card member
    const handleCardMemberUpdate = (memberUpdateData) => {
      const { cardId, cardTitle, memberAction, userId, updatedBy, timestamp } = memberUpdateData

      // Chỉ hiển thị thông báo cho người dùng được thêm/xóa (không phải người thực hiện hành động)
      if (userId === currentUser._id && updatedBy._id !== currentUser._id) {
        const actionText = memberAction === 'ADD' ? 'đã thêm bạn vào' : 'đã xóa bạn khỏi'
        const displayName = updatedBy.displayName || updatedBy.email || 'Someone'
        const toastMessage = `${displayName} ${actionText} thẻ "${cardTitle}"`

        // Hiển thị toast notification
        if (memberAction === 'ADD') {
          toast.success(toastMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        } else {
          toast.info(toastMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        }

        // Thêm vào danh sách thông báo
        const newNotification = {
          id: `${cardId}-${timestamp}`,
          cardId,
          cardTitle,
          memberAction,
          updatedBy,
          timestamp,
          read: false
        }

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Giữ tối đa 50 thông báo
      }
    }

    socketIoInstance.on('BE_CARD_MEMBER_UPDATED', handleCardMemberUpdate)

    return () => {
      socketIoInstance.off('BE_CARD_MEMBER_UPDATED', handleCardMemberUpdate)
    }
  }, [currentUser])

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
} 