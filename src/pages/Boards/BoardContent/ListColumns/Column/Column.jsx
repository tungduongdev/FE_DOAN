import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Box, styled } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { deleteColumn, createNewCard, updateColumn } from '~/apis/index'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
/**
 * 
 * sort dung du lieu nguyen thuy nhu mang de lam viec neu la obj canmap ra roi dung
 */
function Column({ column }) {
  //console.log('column: ', column)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column?._id, data: { ...column } })
  const dndKitClumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : transition,
    height: '100%',
    opacity: isDragging ? 0.7 : undefined,
    scale: isDragging ? 1.02 : 1,
    rotate: isDragging ? '1deg' : '0deg',
    zIndex: isDragging ? 998 : 'auto',
    boxShadow: isDragging
      ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15)'
      : undefined
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // delete column
  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)
  const confirmDeleteColmn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColmn({
      title: 'Delete this column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      allowClose: false
    })
      .then(() => {
        const columnIdToDelete = column._id;// Lưu _id của cột cần xóa
        const newBoard = cloneDeep(board)

        // Xóa cột trong danh sách columns
        newBoard.columns = newBoard.columns.filter(col => col._id !== columnIdToDelete)

        // Xóa _id của cột khỏi columnOrderIds
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(columnId => columnId !== columnIdToDelete)

        // Cập nhật lại Redux store
        dispatch(updateCurrentActiveBoard(newBoard))
        // Xóa cột trong API
        deleteColumn(columnIdToDelete).then(() => {
          toast.success('Column deleted successfully')
        }).catch(() => {
          toast.error('Failed to delete column. Please try again.')
        });
      })
      .catch(() => {
        // Xử lý nếu người dùng hủy xác nhận xóa
        toast.info('Delete action cancelled.')
      })
  }

  //console.log('Column cards:', column?.cards)
  //console.log('Column cardOrderIds:', column?.cardOrderIds)
  const orderCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Card title is required')
      return
    }

    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    const createdCard = await createNewCard({ ...newCardData, boardId: board._id })
    //console.log('createdCard:', createdCard)
    //đoạn này dính lỗi object is not extensible trong redux toolkit const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnAddNewCard = newBoard.columns.find(column => {
      return column._id === newCardData.columnId
    })
    if (columnAddNewCard) {
      if (columnAddNewCard.cards.some(card => card.FE_PlaceHoderCard)) {
        columnAddNewCard.cards = [createdCard]
        columnAddNewCard.cardOrderIds = [createdCard._id]
      } else {
        columnAddNewCard.cards.push(createdCard)
        columnAddNewCard.cardOrderIds.push(createdCard._id)
      }
    }

    dispatch(updateCurrentActiveBoard(newBoard))


    toggleOpenNewCardForm()
    setNewCardTitle('')
  }
  const onUpdateColumnTitle = (newTitle) => {
    //gọi api update column
    updateColumn(column._id, { title: newTitle }).then((updatedColumn) => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(col => col._id === updatedColumn._id)
      if (columnToUpdate) {
        columnToUpdate.title = updatedColumn.title
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    }).catch(() => {
      toast.error('Failed to update column. Please try again.')
    })
  }
  return (
    <div ref={setNodeRef} style={dndKitClumnStyles} {...attributes} className="trello-column">
      <Box {...listeners} sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
        ml: 2,
        borderRadius: '12px',
        height: 'fit-content',
        maxHeight: (theme) => `calc(${theme.trello.boardContentHeigh} - ${theme.spacing(5)})`,
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 4px 6px rgba(0, 0, 0, 0.3)'
          : '0 2px 12px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 82, 204, 0.08)',
        border: (theme) => theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 6px 20px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 82, 204, 0.12)'
        }
      }}>
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: (theme) => theme.palette.mode === 'dark'
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(0,0,0,0.08)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.02)'
        }}>
          {/* <Typography sx={{
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>{column?.title}
          </Typography> */}
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={(onUpdateColumnTitle)}
            data-no-dnd='true'
          />
          <Box>
            <Tooltip title="More Option">
              <ExpandMoreIcon sx={{
                color: 'text.primary',
                cursor: 'pointer'
              }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}>

              </ExpandMoreIcon>
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              aria-labelledby="basic-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.success.light
                  }
                }}
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon><ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon><ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon><ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon><ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.error.light
                  }
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderCards} />
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Button className='interceptor-loading' onClick={toggleOpenNewCardForm} startIcon={<AddCardIcon></AddCardIcon>}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{
                  color: 'text.primary',
                  cursor: 'pointer'
                }}></DragHandleIcon>
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}>
              <TextField
                label="Enter card title..."
                type='text'
                variant="outlined"
                size='small'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': {
                    color: 'text.primary'
                  },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => theme.palette.primary.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button onClick={addNewCard} variant='contained' color='success' size='small' sx={{
                  boxShadow: 'none',
                  marginLeft: '5px',
                  padding: '8px 0',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.success.main
                  }
                }}>Add</Button>
                <CloseIcon onClick={() => setOpenNewCardForm(false)}
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }} />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column