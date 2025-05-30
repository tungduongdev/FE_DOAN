import { Box, Tooltip, Typography } from '@mui/material'
import theme from '~/theme'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import FilterListIcon from '@mui/icons-material/FilterList'
import BoltIcon from '@mui/icons-material/Bolt'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateBoard, deleteBoard } from '~/apis'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ClearIcon from '@mui/icons-material/Clear'
import BarChartIcon from '@mui/icons-material/BarChart'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiChip-icon': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  '.MuiSvgIcon-root': {
    color: 'white'
  }
}

// Filter options
const FILTER_OPTIONS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  DUE_SOON: 'due-soon',
  OVERDUE: 'overdue'
}

function BoardBar({ board, onFilterChange }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const filterMenuOpen = Boolean(filterAnchorEl)
  const currentUser = useSelector(selectCurrentUser)

  // Check if the current user is a board owner
  const isOwner = board?.owners?.some(owner => owner._id === currentUser?._id)

  const onUpdateBoardTitle = (newTitle) => {
    // Call API to update board title
    updateBoard(board._id, { title: newTitle })
      .then((updatedBoard) => {
        const newBoard = cloneDeep(board)
        newBoard.title = updatedBoard.title
        dispatch(updateCurrentActiveBoard(newBoard))
        toast.success('Board title updated successfully', { position: 'bottom-right' })
      })
      .catch(() => {
        toast.error('Failed to update board title. Please try again.', { position: 'bottom-right' })
      })
  }

  const handleDeleteBoard = () => {
    confirm({
      title: 'Delete Board',
      description: `Are you sure you want to delete the board "${board.title}"? This action cannot be undone and will delete all columns and cards within this board.`,
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        deleteBoard(board._id)
          .then(() => {
            toast.success('Board deleted successfully', { position: 'bottom-right' })
            // Redirect to boards list page after successful deletion
            navigate('/boards')
          })
          .catch(() => {
            toast.error('Failed to delete board. Please try again.', { position: 'bottom-right' })
          })
      })
      .catch(() => {
        // User cancelled the deletion
      })
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    onFilterChange(filter)
    handleFilterClose()
  }

  const clearFilter = () => {
    setActiveFilter(FILTER_OPTIONS.ALL)
    onFilterChange(FILTER_OPTIONS.ALL)
    handleFilterClose()
  }

  // Get appropriate label for filter button
  const getFilterLabel = () => {
    switch (activeFilter) {
      case FILTER_OPTIONS.COMPLETED:
        return 'Filter: Completed'
      case FILTER_OPTIONS.INCOMPLETE:
        return 'Filter: In Progress'
      case FILTER_OPTIONS.DUE_SOON:
        return 'Filter: Due Soon'
      case FILTER_OPTIONS.OVERDUE:
        return 'Filter: Overdue'
      default:
        return 'Filter'
    }
  }

  const navigateToDashboard = () => {
    navigate(`/boards/${board._id}/dashboard`)
  }

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.default,
      width: '100%',
      height: () => theme.trello.botBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon sx={{ color: 'white' }} />
          <Tooltip title={board?.description}>
            <Box>
              {/* Board Title - Editable only for owners */}
              {isOwner ? (
                <ToggleFocusInput
                  value={board?.title}
                  onChangedValue={onUpdateBoardTitle}
                  inputFontSize='16px'
                  sx={{
                    minWidth: '120px',
                    '& .MuiOutlinedInput-input': { color: 'white', fontWeight: 'bold' }
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: '120px',
                    fontSize: '16px'
                  }}
                >
                  {board?.title}
                </Typography>
              )}
            </Box>
          </Tooltip>
        </Box>
        <Chip sx={
          MENU_STYLE
        } icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        {isOwner && (
          <Chip sx={
            MENU_STYLE
          } icon={<BarChartIcon />}
            label="Dashboard"
            clickable
            onClick={navigateToDashboard}
          />
        )}
        <Chip sx={
          MENU_STYLE
        } icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip sx={
          MENU_STYLE

        } icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip sx={
          MENU_STYLE
        } icon={<FilterListIcon />}
          label={getFilterLabel()}
          clickable
          onClick={handleFilterClick}
          color={activeFilter !== 'all' ? 'primary' : 'default'}
        />
        <Menu
          anchorEl={filterAnchorEl}
          open={filterMenuOpen}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem
            selected={activeFilter === FILTER_OPTIONS.ALL}
            onClick={() => handleFilterChange(FILTER_OPTIONS.ALL)}
          >
            <ListItemIcon>
              <FilterListIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>All Cards</ListItemText>
          </MenuItem>

          <MenuItem
            selected={activeFilter === FILTER_OPTIONS.COMPLETED}
            onClick={() => handleFilterChange(FILTER_OPTIONS.COMPLETED)}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Completed Cards</ListItemText>
          </MenuItem>

          <MenuItem
            selected={activeFilter === FILTER_OPTIONS.INCOMPLETE}
            onClick={() => handleFilterChange(FILTER_OPTIONS.INCOMPLETE)}
          >
            <ListItemIcon>
              <PendingIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>In Progress Cards</ListItemText>
          </MenuItem>

          <MenuItem
            selected={activeFilter === FILTER_OPTIONS.DUE_SOON}
            onClick={() => handleFilterChange(FILTER_OPTIONS.DUE_SOON)}
          >
            <ListItemIcon>
              <AccessTimeIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Due Soon</ListItemText>
          </MenuItem>

          <MenuItem
            selected={activeFilter === FILTER_OPTIONS.OVERDUE}
            onClick={() => handleFilterChange(FILTER_OPTIONS.OVERDUE)}
          >
            <ListItemIcon>
              <AccessTimeIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Overdue</ListItemText>
          </MenuItem>

          {activeFilter !== FILTER_OPTIONS.ALL && (
            <MenuItem onClick={clearFilter}>
              <ListItemIcon>
                <ClearIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clear Filter</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isOwner && (
          <Tooltip title="Delete this board">
            <IconButton
              color="error"
              onClick={handleDeleteBoard}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup limit={5} boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar