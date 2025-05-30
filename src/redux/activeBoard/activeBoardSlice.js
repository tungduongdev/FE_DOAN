import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mapOrder } from '~/utils/sort'
import { genaratePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import authorizeAxiosInstace from '~/utils/authorizeAxios'

// các hành động gọi api hoặc xử lý dữ liệu không đồng bộ dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsApi = createAsyncThunk(
  'activeBoard/fetchActiveBoard',
  async (boardId) => {
    const response = await authorizeAxiosInstace.get(`http://localhost:8011/v1/boards/${boardId}`)
    return response.data
  }
)
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  // Khởi tạo giá trị state của slice
  initialState: {
    currentActiveBoard: null
  },
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Gán dữ liệu payload vào biến có ý nghĩa hơn
      const board = action.payload
      // Cập nhật state
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload
      const column = state.currentActiveBoard.columns.find((col) => col._id === incomingCard.columnId)
      if (column) {
        // Tìm vị trí của card trong cột
        const card = column.cards.find((card) => card._id === incomingCard._id)
        if (card) {
          // Update all card properties that might have changed
          card.title = incomingCard.title
          card.description = incomingCard.description
          card.cover = incomingCard.cover
          card.memberIds = incomingCard.memberIds
          card.comments = incomingCard.comments
          card.completed = incomingCard.completed
          card.dueDate = incomingCard.dueDate
        }
      }
    }
  },
  // Nơi xử lý dữ liệu không đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsApi.fulfilled, (state, action) => {
      const board = action.payload

      board.FE_allUsers = board.owners.concat(board.members)

      // Xử lý dữ liệu nếu cần thiết
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      // Duyệt qua từng cột
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          const placeholderCard = genaratePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Cập nhật state
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

//selector: lấy dữ liệu từ state trong redux để sử dụng
export const selectActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

//export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer