import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'
import { selectActiveBoard, fetchBoardDetailsApi } from '~/redux/activeBoard/activeBoardSlice'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Dashboard from './DashboardComponent'
import TeamManagement from './TeamManagement'
import TaskAnalytics from './TaskAnalytics'
import { Paper, Fade, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} style={{ transitionDelay: value === index ? '250ms' : '0ms' }}>
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  }
}

function DashboardContainer() {
  const [tabValue, setTabValue] = useState(0)
  const currentUser = useSelector(selectCurrentUser)
  const activeBoard = useSelector(selectActiveBoard)
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (boardId && !activeBoard) {
      setLoading(true)
      dispatch(fetchBoardDetailsApi(boardId))
        .finally(() => {
          setLoading(false)
        })
    }
  }, [dispatch, boardId, activeBoard])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleBackToBoard = () => {
    navigate(`/boards/${boardId}`)
  }

  // Check if user is an owner
  const isOwner = activeBoard?.owners?.some(owner => owner._id === currentUser?._id)

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#90caf9' }} />
      </Container>
    )
  }

  if (!activeBoard) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#1e1e1e',
            color: '#e0e0e0'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Please select a board to view dashboard
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!isOwner) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#1e1e1e',
            color: '#e0e0e0'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Dashboard access is restricted to board owners
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Box sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 1, sm: 2, md: 3 },
      backgroundColor: '#121212',
      minHeight: 'calc(100vh - 64px)',
      overflow: 'hidden'
    }}>
      <Container maxWidth="xl">
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            backgroundColor: '#1a1a2e',
            backgroundImage: 'linear-gradient(to right, #16213e, #0f3460)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Back to board">
              <IconButton
                onClick={handleBackToBoard}
                sx={{
                  mr: 1,
                  color: '#e0e0e0',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#e0e0e0',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                mb: 0
              }}
            >
              <DashboardIcon sx={{ mr: 2, fontSize: 36 }} />
              {activeBoard.title} - Dashboard
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            backgroundColor: '#1e1e2f'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            variant="fullWidth"
            sx={{
              backgroundColor: '#1e1e2f',
              borderBottom: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiTab-root': {
                py: 2.5,
                color: '#a0a0a0',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                },
                '&.Mui-selected': {
                  fontWeight: 600,
                  color: '#90caf9'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#90caf9',
                height: 3
              }
            }}
          >
            <Tab
              label="Overview"
              icon={<DashboardIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label="Team Management"
              icon={<PeopleIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label="Task Analytics"
              icon={<AssessmentIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            />
          </Tabs>
        </Paper>

        <Box sx={{
          backgroundColor: '#1e1e2f',
          color: '#e0e0e0',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minHeight: '400px'
        }}>
          <TabPanel value={tabValue} index={0}>
            <Dashboard />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TeamManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TaskAnalytics />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  )
}

export default DashboardContainer
