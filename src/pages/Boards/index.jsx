import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import { Grid } from '@mui/material'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsApi, updateBoard, deleteBoard } from '~/apis'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { toast } from 'react-toastify'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'

import { styled } from '@mui/material/styles'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)
  const navigate = useNavigate()
  const confirm = useConfirm()
  const currentUser = useSelector(selectCurrentUser)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = (response) => {
    setBoards(response.boards || []),
      setTotalBoards(response.totalBoards || 0)
  }

  const afterCreateNewBoard = () => {
    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsApi(location.search).then(updateStateData)
  }

  const handleUpdateBoardTitle = (boardId, newTitle) => {
    // Call API to update board title
    updateBoard(boardId, { title: newTitle })
      .then(() => {
        // Update the local state with the new title
        const updatedBoards = boards.map(board => {
          if (board._id === boardId) {
            return { ...board, title: newTitle }
          }
          return board
        })
        setBoards(updatedBoards)
        toast.success('Board title updated successfully', { position: 'bottom-right' })
      })
      .catch(() => {
        toast.error('Failed to update board title. Please try again.', { position: 'bottom-right' })
      })
  }

  const handleDeleteBoard = (boardId, boardTitle) => {
    confirm({
      title: 'Delete Board',
      description: `Are you sure you want to delete the board "${boardTitle}"? This action cannot be undone.`,
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        deleteBoard(boardId)
          .then(() => {
            const updatedBoards = boards.filter(board => board._id !== boardId)
            setBoards(updatedBoards)
            setTotalBoards(totalBoards - 1)
            toast.success('Board deleted successfully', { position: 'bottom-right' })
          })
          .catch(() => {
            toast.error('Failed to delete board. Please try again.', { position: 'bottom-right' })
          })
      })
      .catch(() => {
        // User cancelled the deletion
      })
  }

  useEffect(() => {
    // // Fake tạm 16 cái item thay cho boards
    // // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i))
    // // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)

    console.log('🚀 ~ file: index.jsx ~ line 100 ~ useEffect ~ page', location.search)

    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsApi(location.search).then(updateStateData)
    // ...
  }, [location.search])

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ px: 2, mt: 4, overflow: 'hidden' }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Stack>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>

            {/* No Boards Found */}
            {boards?.length === 0 && (
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            {/* Render Boards */}
            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map((board) => (
                  <Grid item xs={12} sm={4} md={2.8} key={board._id}>
                    <Card sx={{ width: '100%', position: 'relative' }}>
                      {/* Delete Board Button - Only show for owners */}
                      {board?.owners?.some(owner => owner._id === currentUser?._id) && (
                        <IconButton
                          aria-label="delete board"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 8,
                            bgcolor: 'rgba(141, 235, 18, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              color: 'error.main'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBoard(board._id, board.title)
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}

                      {/* Board Cover */}
                      <Box sx={{ height: '40px', backgroundColor: randomColor() }}></Box>

                      {/* Board Content */}
                      <CardContent sx={{ p: 1.5 }}>
                        {/* Board Title - Editable only for owners */}
                        {board?.owners?.some(owner => owner._id === currentUser?._id) ? (
                          <ToggleFocusInput
                            value={board?.title || 'Board Title'}
                            onChangedValue={(newTitle) => handleUpdateBoardTitle(board._id, newTitle)}
                            inputFontSize="16px"
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-input': {
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1,
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {board?.title || 'Board Title'}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                        >
                          {board?.description || 'No description provided for this board.'}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${board._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}
                        >
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {totalBoards > 0 && (
              <Box
                sx={{
                  mt: 3,
                  pr: 5,
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>

  )
}

export default Boards
