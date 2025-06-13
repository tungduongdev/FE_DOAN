import { Box, Button } from '@mui/material'
import React from 'react'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { genaratePlaceholderCard } from '~/utils/formatter'
import { createNewColumn } from '~/apis/index'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Column title is required', {
        position: 'bottom-left'
      })
      return
    }
    //tạo mới column
    const newColumnData = {
      title: newColumnTitle
    }
    const createdColumn = await createNewColumn({ ...newColumnData, boardId: board._id })

    createdColumn.cards = [genaratePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [genaratePlaceholderCard(createdColumn)._id]

    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    dispatch(updateCurrentActiveBoard(newBoard))
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  //console.log('columns: ',columns)
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        px: 2,
        gap: 1,
        '&::-webkit-scrollbar': {
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          m: 2
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.5)'
          }
        }
      }}>
        {columns?.map(column => (
          <Column key={column._id} column={column} />
        ))}
        {!openNewColumnForm
          ? <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '280px',
              maxWidth: '280px',
              ml: 1,
              borderRadius: '12px',
              height: 'fit-content',
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.9)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '2px dashed rgba(255,255,255,0.2)'
                : '2px dashed rgba(0,82,204,0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.9)',
                border: (theme) => theme.palette.mode === 'dark'
                  ? '2px dashed rgba(255,255,255,0.4)'
                  : '2px dashed rgba(0,82,204,0.5)',
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(255,255,255,0.1)'
                  : '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Button sx={{
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.main',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }} startIcon={<NoteAddIcon />}>
              Add new column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '280px',
            maxWidth: '280px',
            ml: 1,
            borderRadius: '12px',
            padding: 2,
            height: 'fit-content',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: (theme) => theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(0,0,0,0.08)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <TextField
              label="Enter column title..."
              type='text'
              variant="outlined"
              size='small'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': {
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  fontSize: '0.875rem'
                },
                '& input': {
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  fontSize: '0.875rem'
                },
                '& label.Mui-focused': {
                  color: 'primary.main'
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className='interceptor-loading'
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: 1,
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                  }
                }}
                startIcon={<NoteAddIcon />}
              >
                Add Column
              </Button>
              <Box
                onClick={() => setOpenNewColumnForm(false)}
                sx={{
                  p: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.05)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </Box>
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns