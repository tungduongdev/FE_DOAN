
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
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}>
        {columns?.map(column => (
          <Column key={column._id} column={column} ></Column>
        ))}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1,
            }} startIcon={<NoteAddIcon></NoteAddIcon>}>Add new column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            padding: 1,
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
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
                minWidth: '120px',
                maxWidth: '250px',
                '& label': {
                  color: 'white'
                },
                '& input': {
                  color: 'white'
                },
                '& label.Mui-focused': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  }
                }
              }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button className='interceptor-loading' onClick={addNewColumn} variant='contained' color='success' size='small' sx={{
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: (theme) => theme.palette.success.main,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.success.main
                }
              }} startIcon={<NoteAddIcon></NoteAddIcon>}>Add column</Button>
              <CloseIcon onClick={() => setOpenNewColumnForm(false)}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    color: (theme) => theme.palette.warning.light
                  }
                }} />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns