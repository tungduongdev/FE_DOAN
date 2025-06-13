import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import NotificationsIcon from '@mui/icons-material/Notifications'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { fetchInvitationsAPI, selectCurrentNotifications, updateBoardInvitationAPI } from '~/redux/notifications/notificationsSlice'
import { addNotification } from '~/redux/notifications/notificationsSlice'
import { selectCurrentUser } from '~/redux/User/userSlide'
import { socketIoInstance } from '~/socketClient'
import { useNavigate } from 'react-router-dom'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function UnifiedNotifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [newBoardInvitations, setNewBoardInvitations] = useState(false)

  // Local state cho card notifications nếu Context không hoạt động
  const [cardNotifications, setCardNotifications] = useState([])

  // Board invitations từ Redux
  const boardInvitations = useSelector(selectCurrentNotifications) || []
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  // Try to use NotificationContext, fallback to local state
  let contextCardNotifications = []
  let contextUnreadCount = 0
  let markAsRead = (id) => {
    setCardNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }
  let markAllAsRead = () => {
    setCardNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }
  let clearNotifications = () => {
    setCardNotifications([])
  }

  try {
    // Import và sử dụng NotificationContext nếu có thể
    const { useNotification } = require('~/contexts/NotificationContext')
    const notificationContext = useNotification()
    contextCardNotifications = notificationContext.notifications || []
    contextUnreadCount = notificationContext.unreadCount || 0
    if (notificationContext.markAsRead) markAsRead = notificationContext.markAsRead
    if (notificationContext.markAllAsRead) markAllAsRead = notificationContext.markAllAsRead
    if (notificationContext.clearNotifications) clearNotifications = notificationContext.clearNotifications
  } catch (error) {
    // Sử dụng local state và socket listener
    console.warn('Using fallback notification system')
  }

  const finalCardNotifications = contextCardNotifications.length > 0 ? contextCardNotifications : cardNotifications
  const finalUnreadCount = contextUnreadCount > 0 ? contextUnreadCount : cardNotifications.filter(n => !n.read).length

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setNewBoardInvitations(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'unified-notification-popover' : undefined

  // Xử lý board invitations và card notifications
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchInvitationsAPI())

      const onReceiveNewInvitation = (invitation) => {
        if (invitation.inviteeId === currentUser._id) {
          dispatch(addNotification(invitation))
          setNewBoardInvitations(true)
        }
      }

      const onReceiveCardMemberUpdate = (memberUpdateData) => {
        const { cardId, cardTitle, memberAction, userId, updatedBy, timestamp } = memberUpdateData

        // Chỉ hiển thị thông báo cho người dùng được thêm/xóa (không phải người thực hiện hành động)
        if (userId === currentUser._id && updatedBy._id !== currentUser._id) {
          // Chỉ thêm vào danh sách thông báo local, không hiển thị toast
          // (Toast đã được xử lý bởi NotificationContext)
          const newNotification = {
            id: `${cardId}-${timestamp}`,
            cardId,
            cardTitle,
            memberAction,
            updatedBy,
            timestamp,
            read: false
          }

          setCardNotifications(prev => [newNotification, ...prev].slice(0, 50))
        }
      }

      socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
      socketIoInstance.on('BE_CARD_MEMBER_UPDATED', onReceiveCardMemberUpdate)

      return () => {
        socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
        socketIoInstance.off('BE_CARD_MEMBER_UPDATED', onReceiveCardMemberUpdate)
      }
    }
  }, [dispatch, currentUser?._id])

  const updateBoardInvitation = (status, notificationId) => {
    dispatch(updateBoardInvitationAPI({ status, notificationId })).then(res => {
      if (res.payload?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })
  }

  const handleCardNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  // Tính tổng số thông báo chưa đọc
  const pendingBoardInvitations = boardInvitations.filter(n =>
    n?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING
  ).length
  const totalUnreadCount = finalUnreadCount + pendingBoardInvitations

  // Gộp và sắp xếp tất cả thông báo theo thời gian
  const allNotifications = [
    ...finalCardNotifications.map(n => ({
      ...n,
      type: 'card',
      timestamp: n.timestamp,
      sortKey: n.timestamp
    })),
    ...boardInvitations.map(n => ({
      ...n,
      type: 'board',
      timestamp: new Date(n.createdAt).getTime(),
      sortKey: new Date(n.createdAt).getTime()
    }))
  ].sort((a, b) => b.sortKey - a.sortKey)

  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge
            badgeContent={totalUnreadCount}
            color="error"
            variant={totalUnreadCount > 0 ? 'standard' : 'dot'}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 520,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thông báo ({allNotifications.length})
            </Typography>
            {totalUnreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{ fontSize: '0.75rem' }}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </Box>

          {allNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Không có thông báo nào
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ p: 0, maxHeight: 360, overflow: 'auto' }}>
                {allNotifications.map((notification, index) => (
                  <Box key={`${notification.type}-${notification.id || notification._id}-${index}`}>
                    {notification.type === 'card' ? (
                      // Card member notification
                      <ListItem
                        onClick={() => handleCardNotificationClick(notification)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                          <Avatar
                            src={notification.updatedBy?.avatar}
                            sx={{ width: 32, height: 32, mr: 1.5, mt: 0.5 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              {notification.memberAction === 'ADD' ? (
                                <PersonAddIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                              ) : (
                                <PersonRemoveIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                              )}
                              {!notification.read && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    ml: 'auto'
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                              <strong>{notification.updatedBy?.displayName || notification.updatedBy?.email || 'Someone'}</strong>{' '}
                              {notification.memberAction === 'ADD' ? 'đã thêm bạn vào' : 'đã xóa bạn khỏi'}{' '}
                              thẻ "<strong>{notification.cardTitle}</strong>"
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {moment(notification.timestamp).fromNow()}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ) : (
                      // Board invitation notification  
                      <ListItem
                        sx={{
                          bgcolor: notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING ? 'rgba(255, 152, 0, 0.08)' : 'transparent',
                          borderRadius: 1,
                          mb: 0.5,
                          flexDirection: 'column',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                          <Avatar
                            src={notification.inviter?.avatar}
                            sx={{ width: 32, height: 32, mr: 1.5, mt: 0.5 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <GroupAddIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                              {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'warning.main',
                                    ml: 'auto'
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING ? 600 : 400 }}>
                              <strong>{notification.inviter?.displayName}</strong> đã mời bạn tham gia board{' '}
                              "<strong>{notification.board?.title}</strong>"
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {moment(notification.createdAt).fromNow()}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action buttons cho board invitation */}
                        {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING && (
                          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                            >
                              Chấp nhận
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        )}

                        {/* Status chip cho board invitation */}
                        {notification.boardInvitation?.status !== BOARD_INVITATION_STATUS.PENDING && (
                          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                            <Chip
                              icon={notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED ? <DoneIcon /> : <NotInterestedIcon />}
                              label={notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED ? 'Đã chấp nhận' : 'Đã từ chối'}
                              color={notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED ? 'success' : 'secondary'}
                              size="small"
                            />
                          </Box>
                        )}
                      </ListItem>
                    )}

                    {index < allNotifications.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </Box>
                ))}
              </List>

              {finalCardNotifications.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    fullWidth
                    size="small"
                    onClick={clearNotifications}
                    color="error"
                    variant="outlined"
                  >
                    Xóa thông báo card
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default UnifiedNotifications 