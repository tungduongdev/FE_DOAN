import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Container, Paper, Divider, Avatar, AvatarGroup, List, ListItem, ListItemAvatar, ListItemText, LinearProgress, Zoom, Button, Tooltip, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

// Sample data for weekly progress
const weeklyProgressData = [
  { day: 'Mon', completed: 5, created: 7 },
  { day: 'Tue', completed: 7, created: 4 },
  { day: 'Wed', completed: 8, created: 6 },
  { day: 'Thu', completed: 6, created: 9 },
  { day: 'Fri', completed: 9, created: 5 },
  { day: 'Sat', completed: 3, created: 2 },
  { day: 'Sun', completed: 2, created: 3 }
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
  backgroundColor: '#2c2c42',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 50px -12px rgba(0,0,0,0.25)'
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

// Custom gradient card backgrounds
const cardGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #23a6d5 0%, #23d5ab 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
];

function DashboardComponent() {
  const currentUser = useSelector(selectCurrentUser)
  const activeBoard = useSelector(selectActiveBoard)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalMembers: 0
  })

  useEffect(() => {
    // Calculate stats from activeBoard data
    if (activeBoard) {
      let totalTasks = 0
      let completedTasks = 0
      let inProgressTasks = 0
      let pendingTasks = 0

      activeBoard.columns.forEach(column => {
        // Exclude placeholder cards
        const realCards = column.cards.filter(card => !card.FE_PlaceholderCard)

        totalTasks += realCards.length

        // Count based on column type or card status
        if (column.title.toLowerCase().includes('done')) {
          completedTasks += realCards.length
        } else if (column.title.toLowerCase().includes('doing') || column.title.toLowerCase().includes('in progress')) {
          inProgressTasks += realCards.length
        } else {
          pendingTasks += realCards.length
        }
      })

      setStats({
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        totalMembers: activeBoard.members.length + activeBoard.owners.length
      })
    }
  }, [activeBoard])

  // Function to export dashboard data to Excel
  const exportDashboardToExcel = () => {
    try {
      // Create CSV format data
      const csvData = []

      // Header
      csvData.push([`Dashboard Report - ${activeBoard.title}`, '', '', ''])
      csvData.push([`Generated on: ${dayjs().format('DD/MM/YYYY HH:mm')}`, '', '', ''])
      csvData.push(['', '', '', ''])

      // Overview Summary
      csvData.push(['Overview Summary', '', '', ''])
      csvData.push(['Total Tasks', stats.totalTasks, '', ''])
      csvData.push(['Completed Tasks', stats.completedTasks, '', ''])
      csvData.push(['In Progress Tasks', stats.inProgressTasks, '', ''])
      csvData.push(['Pending Tasks', stats.pendingTasks, '', ''])
      csvData.push(['Team Members', stats.totalMembers, '', ''])
      csvData.push(['Completion Rate', `${completionPercentage}%`, '', ''])
      csvData.push(['', '', '', ''])

      // Column Details
      csvData.push(['Column Details', '', '', ''])
      csvData.push(['Column Name', 'Total Cards', 'Order', 'Created Date'])
      activeBoard.columns.forEach((column, index) => {
        const realCards = column.cards.filter(card => !card.FE_PlaceholderCard)
        csvData.push([
          column.title,
          realCards.length,
          index + 1,
          dayjs(column.createdAt).format('DD/MM/YYYY')
        ])
      })
      csvData.push(['', '', '', ''])

      // All Tasks Details
      csvData.push(['All Tasks Details', '', '', ''])
      csvData.push(['Task Title', 'Column', 'Description', 'Due Date', 'Assigned Members', 'Created Date'])

      activeBoard.columns.forEach(column => {
        const realCards = column.cards.filter(card => !card.FE_PlaceholderCard)
        realCards.forEach(card => {
          const memberNames = card.memberIds?.map(memberId => {
            const member = activeBoard.FE_allUsers?.find(user => user._id === memberId)
            return member?.displayName || 'Unknown User'
          }).join(', ') || 'Unassigned'

          csvData.push([
            card.title,
            column.title,
            card.description?.replace(/\n/g, ' ') || 'No description',
            card.dueDate ? dayjs(card.dueDate).format('DD/MM/YYYY') : 'No due date',
            memberNames,
            dayjs(card.createdAt).format('DD/MM/YYYY')
          ])
        })
      })
      csvData.push(['', '', '', ''])

      // Team Members Details
      csvData.push(['Team Members', '', '', ''])
      csvData.push(['Name', 'Email', 'Role', 'Join Date'])

      // Add owners
      activeBoard.owners.forEach(owner => {
        csvData.push([
          owner.displayName || 'Unknown User',
          owner.email,
          'Owner',
          dayjs(owner.createdAt).format('DD/MM/YYYY')
        ])
      })

      // Add members
      activeBoard.members.forEach(member => {
        csvData.push([
          member.displayName || 'Unknown User',
          member.email,
          'Member',
          dayjs(member.createdAt).format('DD/MM/YYYY')
        ])
      })

      // Convert to CSV string
      const csvContent = csvData.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n')

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `Dashboard_${activeBoard.title}_${dayjs().format('YYYY-MM-DD')}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Dashboard exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export dashboard')
    }
  }

  if (!activeBoard) {
    return null;
  }

  const completionPercentage = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <Grid container spacing={3}>
      {/* Overview Stats Cards */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff' }}>
            Overview
          </Typography>
          <Tooltip title="Export dashboard to Excel">
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={exportDashboardToExcel}
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 4px 8px 3px rgba(33, 150, 243, .3)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Export Dashboard
            </Button>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <StyledCard>
            <Box sx={{
              height: 8,
              backgroundColor: '#3f51b5'
            }} />
            <StyledCardContent>
              <Typography color="rgba(255,255,255,0.7)" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Total Tasks
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#fff', my: 1 }}>
                  {stats.totalTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(63, 81, 181, 0.3)', width: 56, height: 56 }}>
                  <AssignmentIcon sx={{ color: '#90caf9', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Across all columns
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <StyledCard>
            <Box sx={{
              height: 8,
              backgroundColor: '#4caf50'
            }} />
            <StyledCardContent>
              <Typography color="rgba(255,255,255,0.7)" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Completed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#fff', my: 1 }}>
                  {stats.completedTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.3)', width: 56, height: 56 }}>
                  <CheckCircleIcon sx={{ color: '#81c784', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 1, mb: 0 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ display: 'inline' }}>
                  {completionPercentage}% completion rate
                </Typography>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <StyledCard>
            <Box sx={{
              height: 8,
              backgroundColor: '#ff9800'
            }} />
            <StyledCardContent>
              <Typography color="rgba(255,255,255,0.7)" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                In Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#fff', my: 1 }}>
                  {stats.inProgressTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.3)', width: 56, height: 56 }}>
                  <AccessTimeIcon sx={{ color: '#ffb74d', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Active tasks being worked on
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: '400ms' }}>
          <StyledCard>
            <Box sx={{
              height: 8,
              backgroundColor: '#2196f3'
            }} />
            <StyledCardContent>
              <Typography color="rgba(255,255,255,0.7)" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Team Members
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#fff', my: 1 }}>
                  {stats.totalMembers}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.3)', width: 56, height: 56 }}>
                  <PeopleIcon sx={{ color: '#64b5f6', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                Working on this board
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>

      {/* Task Progress */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
          Task Progress
        </Typography>
      </Grid>

      {/* Task Distribution */}
      <Grid item xs={12} md={6}>
        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <StyledCard sx={{ height: 400 }}>
            <StyledCardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center' }}>
                <BusinessCenterIcon sx={{ mr: 1, color: '#90caf9' }} />
                Task Distribution
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: stats.completedTasks || 1 },
                        { name: 'In Progress', value: stats.inProgressTasks || 1 },
                        { name: 'To Do', value: stats.pendingTasks || 1 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Completed', value: stats.completedTasks },
                        { name: 'In Progress', value: stats.inProgressTasks },
                        { name: 'To Do', value: stats.pendingTasks }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name) => [`${value} tasks`, name]}
                      contentStyle={{
                        borderRadius: 8,
                        backgroundColor: 'rgba(40, 44, 52, 0.9)',
                        color: '#fff',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>

      {/* Weekly Progress */}
      <Grid item xs={12} md={6}>
        <Zoom in={true} style={{ transitionDelay: '600ms' }}>
          <StyledCard sx={{ height: 400 }}>
            <StyledCardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: '#81c784' }} />
                Weekly Progress
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyProgressData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 8,
                        backgroundColor: 'rgba(40, 44, 52, 0.9)',
                        color: '#fff',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Tasks Completed"
                      stroke="#81c784"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name="Tasks Created"
                      stroke="#64b5f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>

      {/* Team Member Performance */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
          Team Members
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Zoom in={true} style={{ transitionDelay: '700ms' }}>
          <StyledCard>
            <StyledCardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ mr: 1, color: '#64b5f6' }} />
                Team Member Performance
              </Typography>
              <Grid container spacing={3}>
                {activeBoard.FE_allUsers && activeBoard.FE_allUsers.map((member, index) => (
                  <Grid item xs={12} md={6} key={member._id || index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={member.avatar}
                          alt={member.displayName || 'User'}
                          sx={{
                            mr: 2,
                            width: 50,
                            height: 50,
                            border: '2px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                          }}
                        >
                          {!member.avatar && (member.displayName?.charAt(0) || 'U')}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>
                            {member.displayName || 'Unknown User'}
                          </Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.6)">
                            {member.email}
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: activeBoard.owners.some(owner => owner._id === member._id) ?
                              'rgba(33, 150, 243, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                            color: activeBoard.owners.some(owner => owner._id === member._id) ?
                              '#64b5f6' : '#81c784',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {activeBoard.owners.some(owner => owner._id === member._id) ? 'Owner' : 'Member'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ width: '90px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Progress:</Typography>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={50 + (index * 10) % 50} // Placeholder - replace with actual data
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '40px', color: '#fff' }}>
                          {50 + (index * 10) % 50}%
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>
    </Grid>
  )
}

export default DashboardComponent 