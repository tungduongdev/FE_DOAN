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
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 4px 8px rgba(0,0,0,0.3)'
                    : '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
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
      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
      borderRadius: '12px',
      p: 3,
      mb: 2,
      boxShadow: (theme) => theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.3)'
        : '0 2px 8px rgba(0,0,0,0.1)',
      border: (theme) => theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.1)'
        : '1px solid rgba(0,0,0,0.05)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="div" sx={{
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <FilterListIcon color="primary" />
          Filter Cards
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsExpanded(false)}
          sx={{
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.05)',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.1)',
              transform: 'rotate(90deg)'
            }
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {/* All Cards */}
        <Chip
          label="All Cards"
          onClick={() => handleFilterChange(FILTER_OPTIONS.ALL)}
          variant={activeFilter === FILTER_OPTIONS.ALL ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.ALL ? 'primary' : 'default'}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />

        {/* Completed */}
        <Chip
          icon={<CheckCircleIcon />}
          label="Completed"
          onClick={() => handleFilterChange(FILTER_OPTIONS.COMPLETED)}
          variant={activeFilter === FILTER_OPTIONS.COMPLETED ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.COMPLETED ? 'success' : 'default'}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />

        {/* Incomplete */}
        <Chip
          icon={<PendingIcon />}
          label="In Progress"
          onClick={() => handleFilterChange(FILTER_OPTIONS.INCOMPLETE)}
          variant={activeFilter === FILTER_OPTIONS.INCOMPLETE ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.INCOMPLETE ? 'primary' : 'default'}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />

        {/* Due Soon */}
        <Chip
          icon={<AccessTimeIcon />}
          label="Due Soon"
          onClick={() => handleFilterChange(FILTER_OPTIONS.DUE_SOON)}
          variant={activeFilter === FILTER_OPTIONS.DUE_SOON ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.DUE_SOON ? 'warning' : 'default'}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />

        {/* Overdue */}
        <Chip
          icon={<AccessTimeIcon />}
          label="Overdue"
          onClick={() => handleFilterChange(FILTER_OPTIONS.OVERDUE)}
          variant={activeFilter === FILTER_OPTIONS.OVERDUE ? 'filled' : 'outlined'}
          color={activeFilter === FILTER_OPTIONS.OVERDUE ? 'error' : 'default'}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        />

        {/* Clear Filter Button - Only show if filter is active */}
        {activeFilter !== FILTER_OPTIONS.ALL && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilter}
            startIcon={<ClearIcon />}
            sx={{
              ml: 'auto',
              borderRadius: '8px',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          >
            Clear Filter
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default BoardFilterBar 