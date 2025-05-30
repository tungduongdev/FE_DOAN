import React, { useState } from 'react'
import {
  Box,
  Toolbar,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PendingIcon from '@mui/icons-material/Pending'
import ClearIcon from '@mui/icons-material/Clear'
import dayjs from 'dayjs'

// Card completion filter options
const FILTER_OPTIONS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  DUE_SOON: 'due-soon',
  OVERDUE: 'overdue'
}

const BoardFilterBar = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS.ALL)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter)
    onFilterChange(newFilter)
  }

  const clearFilter = () => {
    setActiveFilter(FILTER_OPTIONS.ALL)
    onFilterChange(FILTER_OPTIONS.ALL)
  }

  // Count for filter badge - will be set by the parent component
  const getFilterCount = () => {
    // This is just a placeholder for now
    return activeFilter !== FILTER_OPTIONS.ALL ? 1 : 0
  }

  if (!isExpanded) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        py: 1,
        px: 2,
        mb: 1
      }}>
        <Tooltip title="Filter cards">
          <Badge badgeContent={getFilterCount()} color="primary">
            <IconButton
              onClick={() => setIsExpanded(true)}
              color={activeFilter !== FILTER_OPTIONS.ALL ? "primary" : "default"}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 1,
      p: 2,
      mb: 2,
      boxShadow: 1
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Filter Cards
        </Typography>
        <IconButton size="small" onClick={() => setIsExpanded(false)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* All Cards */}
        <Chip
          label="All Cards"
          onClick={() => handleFilterChange(FILTER_OPTIONS.ALL)}
          variant={activeFilter === FILTER_OPTIONS.ALL ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.ALL ? 'primary' : 'default'}
        />

        {/* Completed */}
        <Chip
          icon={<CheckCircleIcon />}
          label="Completed"
          onClick={() => handleFilterChange(FILTER_OPTIONS.COMPLETED)}
          variant={activeFilter === FILTER_OPTIONS.COMPLETED ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.COMPLETED ? 'success' : 'default'}
        />

        {/* Incomplete */}
        <Chip
          icon={<PendingIcon />}
          label="In Progress"
          onClick={() => handleFilterChange(FILTER_OPTIONS.INCOMPLETE)}
          variant={activeFilter === FILTER_OPTIONS.INCOMPLETE ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.INCOMPLETE ? 'primary' : 'default'}
        />

        {/* Due Soon */}
        <Chip
          icon={<AccessTimeIcon />}
          label="Due Soon"
          onClick={() => handleFilterChange(FILTER_OPTIONS.DUE_SOON)}
          variant={activeFilter === FILTER_OPTIONS.DUE_SOON ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.DUE_SOON ? 'warning' : 'default'}
        />

        {/* Overdue */}
        <Chip
          icon={<AccessTimeIcon />}
          label="Overdue"
          onClick={() => handleFilterChange(FILTER_OPTIONS.OVERDUE)}
          variant={activeFilter === FILTER_OPTIONS.OVERDUE ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.OVERDUE ? 'error' : 'default'}
        />

        {/* Clear Filter Button - Only show if filter is active */}
        {activeFilter !== FILTER_OPTIONS.ALL && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilter}
            startIcon={<ClearIcon />}
            sx={{ ml: 'auto' }}
          >
            Clear Filter
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default BoardFilterBar 