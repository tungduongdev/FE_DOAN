import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import EventIcon from '@mui/icons-material/Event'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import { useState } from 'react'

// Date picker components
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'

import { useDispatch, useSelector } from 'react-redux'
import { clearAndHideCurrentActiveCard, selectCurrentActiveCard, updateCurrentActiveCard, selectIsShowModalActiveCard } from '~/redux/activeCard/activeCardSlide'
import { updateCardDetailsApi } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/User/userSlide'


import { styled } from '@mui/material/styles'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

// Due Date badge component
const DueDateBadge = ({ dueDate, completed }) => {
  if (!dueDate) return null

  const today = dayjs()
  const dueDateObj = dayjs(dueDate)
  const isPast = dueDateObj.isBefore(today, 'day')
  const isDueToday = dueDateObj.isSame(today, 'day')

  let bgColor = 'primary.light'
  let textColor = 'primary.dark'

  if (completed) {
    bgColor = 'success.light'
    textColor = 'success.dark'
  } else if (isPast) {
    bgColor = 'error.light'
    textColor = 'error.dark'
  } else if (isDueToday) {
    bgColor = 'warning.light'
    textColor = 'warning.dark'
  }

  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: bgColor,
      color: textColor,
      px: 1,
      py: 0.5,
      borderRadius: 1,
      fontSize: '0.8rem',
      fontWeight: 'medium',
      ml: 1
    }}>
      <EventIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
      {dueDateObj.format('MMM D, YYYY')}
      {completed && (
        <CheckCircleIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} />
      )}
    </Box>
  )
}

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callApiUpdateCardDetails = async (reqData) => {
    const updatedCard = await updateCardDetailsApi(activeCard._id, reqData)
    if (updatedCard) {
      dispatch(updateCurrentActiveCard(updatedCard))
      dispatch(updateCardInBoard(updatedCard))
      toast.success('Update card successfully!')
    } else {
      toast.error('Update card failed!')
    }
    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    console.log(newTitle.trim())
    // Gọi API...
    callApiUpdateCardDetails({ title: newTitle.trim() })
  }
  const onUpdateCardDescription = (newDescription) => {
    // Gọi API...
    callApiUpdateCardDetails({ description: newDescription })
  }

  const currentUser = useSelector(selectCurrentUser)

  const onUploadCardCover = (event) => {
    console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(callApiUpdateCardDetails(reqData).finally(() =>
      event.target.value = ''
    ), {
      pending: 'Uploading card cover...'
    }).then(res => {
      if (!res) {
        toast.error('Upload card cover failed!')
      }
    })
  }

  const onUpdateCardComment = async (commentToAdd) => {
    // Gọi API...
    await callApiUpdateCardDetails({ commentToAdd })
    if (!commentToAdd) {
      toast.error('Add comment failed!')
    }
  }

  const onUpdateCardMember = async (incomingMemberInfor) => {
    // Gọi API...
    await callApiUpdateCardDetails({ incomingMemberInfor })
    if (!incomingMemberInfor) {
      toast.error('Update card member failed!')
    }
  }

  const toggleCardCompletion = async () => {
    // Toggle the completion status
    const newCompletionStatus = !activeCard.completed
    // Call API to update
    await callApiUpdateCardDetails({ completed: newCompletionStatus })
  }

  const handleDueDateChange = async (newDate) => {
    if (!newDate || !newDate.isValid()) {
      await callApiUpdateCardDetails({ dueDate: null })
      toast.success('Due date removed')
    } else {
      await callApiUpdateCardDetails({ dueDate: newDate.toISOString() })
    }
    setIsDatePickerOpen(false)
  }

  const removeDueDate = async () => {
    await callApiUpdateCardDetails({ dueDate: null })
    setIsDatePickerOpen(false)
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard} // Sử dụng true để mở Modal
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 1200,
        maxWidth: 1200,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover && <Box sx={{ mb: 4 }}>
          <img
            style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
            src={activeCard?.cover}
            alt="card-cover"
          />
        </Box>}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />

          {/* Completed status indicator */}
          <Box
            onClick={toggleCardCompletion}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              ml: 20,
              color: activeCard?.completed ? 'success.main' : 'text.secondary',
              '&:hover': {
                color: activeCard?.completed ? 'success.dark' : 'primary.main'
              }
            }}
          >
            {activeCard?.completed ?
              <CheckCircleIcon color="inherit" /> :
              <CheckCircleOutlineIcon color="inherit" />
            }
            <Typography sx={{ ml: 1, fontWeight: activeCard?.completed ? 'bold' : 'normal' }}>
              {activeCard?.completed ? 'Completed' : 'Mark as complete'}
            </Typography>
          </Box>

          {/* Due date badge */}
          {activeCard?.dueDate && (
            <DueDateBadge dueDate={activeCard.dueDate} completed={activeCard.completed} />
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMember={onUpdateCardMember}
              />
            </Box>

            {/* Due date picker section */}
            {isDatePickerOpen && (
              <Box sx={{ mb: 3, border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
                <Typography sx={{ fontWeight: '600', mb: 2 }}>Due Date</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <DateTimePicker
                    label="Select due date"
                    defaultValue={activeCard?.dueDate ? dayjs(activeCard.dueDate) : null}
                    onChange={handleDueDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        size: 'small'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {activeCard?.dueDate && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={removeDueDate}
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description || ''}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onUpdateCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds?.includes(currentUser._id) && (
                <SidebarItem className="active" onClick={() => onUpdateCardMember({
                  userId: currentUser._id,
                  action: 'ADD'
                })}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              )}
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem><AttachFileOutlinedIcon fontSize="small" />Attachment</SidebarItem>
              <SidebarItem><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>
              <SidebarItem><TaskAltOutlinedIcon fontSize="small" />Checklist</SidebarItem>
              {/* Feature: Due Date */}
              <SidebarItem
                className="active"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
