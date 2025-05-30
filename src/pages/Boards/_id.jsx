import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsApi,
  selectActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import "~/styles/filter.css"
import "~/styles/filter-fix.css"

// Filter options - giống với BoardBar.jsx
const FILTER_OPTIONS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  DUE_SOON: 'due-soon',
  OVERDUE: 'overdue'
}

function Board() {
  const dispatch = useDispatch()
  //const [board, setBoard] = useState(null)
  const board = useSelector(selectActiveBoard)
  const { boardId } = useParams()
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterClassName, setFilterClassName] = useState('')

  useEffect(() => {
    //const boardId = '66eafb099b9b35d4c77ba8c7'
    //call api
    dispatch(fetchBoardDetailsApi(boardId))
  }, [dispatch, boardId])

  // Cập nhật className dựa trên bộ lọc đang hoạt động
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)

    // Đặt class CSS phù hợp dựa trên loại lọc
    if (filter === FILTER_OPTIONS.ALL) {
      setFilterClassName('')
      console.log("Đã xóa bộ lọc - hiển thị tất cả")
    } else {
      let className = 'filter-active '

      switch (filter) {
        case FILTER_OPTIONS.COMPLETED:
          className += 'filter-completed-active'
          console.log("Đã áp dụng bộ lọc: Completed")
          break
        case FILTER_OPTIONS.INCOMPLETE:
          className += 'filter-incomplete-active'
          console.log("Đã áp dụng bộ lọc: In Progress")
          break
        case FILTER_OPTIONS.DUE_SOON:
          className += 'filter-due-soon-active'
          console.log("Đã áp dụng bộ lọc: Due Soon")
          break
        case FILTER_OPTIONS.OVERDUE:
          className += 'filter-overdue-active'
          console.log("Đã áp dụng bộ lọc: Overdue")
          break
        default:
          className = ''
      }

      setFilterClassName(className)
    }
  }

  if (!board) {
    return (
      <PageLoadingSpinner caption='Loading board...' />
    )
  }

  console.log("Current filter class:", filterClassName)

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }} className={filterClassName}>
      <ActiveCard></ActiveCard>
      <AppBar></AppBar>
      <BoardBar board={board} onFilterChange={handleFilterChange} />
      <BoardContent />
    </Container>
  )
}

export default Board