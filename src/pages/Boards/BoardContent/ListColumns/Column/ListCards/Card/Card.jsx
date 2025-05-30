import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveCard, ShowModalActiveCard } from '~/redux/activeCard/activeCardSlide'
import { selectActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { deleteCardApi, updateCardDetailsApi } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { useState } from 'react'
import dayjs from 'dayjs'
import "~/styles/filter.css"


function Card({ card, columnId }) {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)
  const confirm = useConfirm()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card?._id, data: card ? { ...card } : {} })
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px dashed #ccc' : '1px solid #ccc'
  }
  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const setActiveCard = () => {
    if (card?.FE_PlaceHoderCard) return
    dispatch(updateCurrentActiveCard(card))
    dispatch(ShowModalActiveCard())
  }

  const handleDeleteCard = (e) => {
    e.stopPropagation() // Prevent card click event

    if (card?.FE_PlaceHoderCard) return

    confirm({
      title: 'Delete Card',
      description: 'Are you sure you want to delete this card? This action cannot be undone.',
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        // Call API to delete the card
        deleteCardApi(card._id)
          .then(() => {
            // Update the board state after successful deletion
            const newBoard = cloneDeep(board)
            const targetColumn = newBoard.columns.find(col => col._id === card.columnId)

            if (targetColumn) {
              // Remove the card from column's cards array
              targetColumn.cards = targetColumn.cards.filter(c => c._id !== card._id)

              // Remove the card ID from column's cardOrderIds
              targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(id => id !== card._id)

              // If we removed the last card, add a placeholder card
              if (targetColumn.cards.length === 0) {
                const placeholderCard = {
                  _id: `${targetColumn._id}-placeholder-card`,
                  boardId: targetColumn.boardId,
                  columnId: targetColumn._id,
                  FE_PlaceholderCard: true
                }
                targetColumn.cards = [placeholderCard]
                targetColumn.cardOrderIds = [placeholderCard._id]
              }

              // Update the board in Redux
              dispatch(updateCurrentActiveBoard(newBoard))

              toast.success('Card deleted successfully', { position: 'bottom-right' })
            }
          })
          .catch(error => {
            console.error('Error deleting card:', error)
            toast.error('Failed to delete card. Please try again.', { position: 'bottom-right' })
          })
      })
      .catch(() => {
        // User cancelled the deletion
      })
  }

  const toggleCardCompletion = async (e) => {
    e.stopPropagation() // Prevent card click event

    if (card?.FE_PlaceHoderCard) return

    try {
      // Toggle the completion status
      const newCompletionStatus = !card.completed

      // Call API to update
      const updatedCard = await updateCardDetailsApi(card._id, { completed: newCompletionStatus })

      if (updatedCard) {
        // Update the board state to reflect changes
        const newBoard = cloneDeep(board)
        const targetColumn = newBoard.columns.find(col => col._id === card.columnId)

        if (targetColumn) {
          const targetCard = targetColumn.cards.find(c => c._id === card._id)
          if (targetCard) {
            targetCard.completed = newCompletionStatus
            dispatch(updateCurrentActiveBoard(newBoard))

            toast.success(
              newCompletionStatus ? 'Card marked as complete' : 'Card marked as incomplete',
              { position: 'bottom-right' }
            )
          }
        }
      }
    } catch (error) {
      console.error('Error updating card completion status:', error)
      toast.error('Failed to update card status', { position: 'bottom-right' })
    }
  }

  // Due date status and formatting
  const getDueDateStatus = () => {
    if (!card?.dueDate) return null

    const today = dayjs()
    const dueDate = dayjs(card.dueDate)
    const isPast = dueDate.isBefore(today, 'day')
    const isDueToday = dueDate.isSame(today, 'day')

    if (card.completed) {
      return { label: 'Complete', color: 'success' }
    } else if (isPast) {
      return { label: 'Overdue', color: 'error' }
    } else if (isDueToday) {
      return { label: 'Due today', color: 'warning' }
    } else {
      return { label: 'Due', color: 'primary' }
    }
  }

  const formatDueDate = (date) => {
    return dayjs(date).format('MMM D')
  }

  const dueDateStatus = getDueDateStatus()

  // Get CSS classes for card filtering
  const getCardStatusClasses = () => {
    const classes = ['trello-card']

    // Add placeholder class if needed
    if (card?.FE_PlaceHoderCard) {
      classes.push('card-placeholder')
      return classes.join(' ')
    }

    // Xác định trạng thái completed/incomplete
    if (card?.completed === true) {
      classes.push('card-completed')
    } else {
      // Nếu card không có trạng thái completed hoặc completed=false thì được coi là incomplete
      classes.push('card-incomplete')
    }

    // Add due date status
    if (card?.dueDate) {
      const today = dayjs()
      const dueDate = dayjs(card.dueDate)

      if (dueDate.isBefore(today, 'day') && !card?.completed) {
        classes.push('card-overdue')
      }

      // Due today
      if (dueDate.isSame(today, 'day') && !card?.completed) {
        classes.push('card-due-soon')
      }
    }

    return classes.join(' ')
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={getCardStatusClasses()}
      sx={{
        cursor: 'pointer',
        boxShadow: card?.FE_PlaceHoderCard ? 'unset' : '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        height: card?.FE_PlaceHoderCard ? '0px' : 'fit-content',
        opacity: card?.FE_PlaceHoderCard ? 0 : 1,
        position: 'relative',
        borderLeft: card?.completed ? '4px solid #4caf50' : 'none',
        transition: 'all 0.2s ease'
      }}>
      {/* Delete Button - visible only on hover */}
      {isHovered && !card?.FE_PlaceHoderCard && (
        <Box sx={{ position: 'absolute', top: '4px', right: '4px', zIndex: 1, display: 'flex', gap: '4px' }}>
          {/* Complete toggle button */}
          <IconButton
            size="small"
            color={card?.completed ? 'success' : 'default'}
            onClick={toggleCardCompletion}
            sx={{
              opacity: 0.8,
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                opacity: 1,
                backgroundColor: 'rgba(255,255,255,0.9)'
              },
              width: '24px',
              height: '24px'
            }}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>

          {/* Delete button */}
          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteCard}
            sx={{
              opacity: 0.8,
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                opacity: 1,
                backgroundColor: 'rgba(255,255,255,0.9)'
              },
              width: '24px',
              height: '24px'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {card?.cover && <CardMedia
        sx={{ height: 140 }}
        image={card?.cover}
        title="Card cover"
      />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 }, overflow: 'unset' }}>
        <Typography sx={{
          fontSize: '0.875rem',
          textDecoration: card?.completed ? 'line-through' : 'none',
          color: card?.completed ? 'text.secondary' : 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {card?.completed && <CheckCircleIcon fontSize="small" color="success" sx={{ opacity: 0.7 }} />}
          {card?.title}
        </Typography>

        {/* Due date chip */}
        {card?.dueDate && dueDateStatus && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<EventIcon fontSize="small" />}
              label={`${dueDateStatus.label}: ${formatDueDate(card.dueDate)}`}
              size="small"
              color={dueDateStatus.color}
              variant="outlined"
              sx={{ height: '20px', fontSize: '0.7rem' }}
            />
          </Box>
        )}
      </CardContent>
      {shouldShowCardActions() && <CardActions sx={{ p: '0 4px 8px 4px' }}>
        {!!card?.memberIds?.length && <Button startIcon={<GroupIcon />} size="small">{card?.memberIds?.length}</Button>}
        {!!card?.comments?.length && <Button startIcon={<CommentIcon />} size="small">{card?.comments?.length}</Button>}
        {!!card?.attachments?.length && <Button startIcon={<AttachmentIcon />} size="small">{card?.attachments?.length}</Button>}
      </CardActions>}
    </MuiCard>
  )
}

export default Card