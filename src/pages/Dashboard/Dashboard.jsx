import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/User/userSlide'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Container, Paper, Divider, Avatar, AvatarGroup, List, ListItem, ListItemAvatar, ListItemText, LinearProgress, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

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

function Dashboard() {
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

  if (!activeBoard) {
    return null;
  }

  const completionPercentage = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <Grid container spacing={3}>
      {/* Overview Stats Cards */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
          Overview
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <StyledCard>
            <Box sx={{
              height: 8,
              backgroundColor: '#3f51b5'
            }} />
            <StyledCardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Total Tasks
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#3c4858', my: 1 }}>
                  {stats.totalTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(63, 81, 181, 0.1)', width: 56, height: 56 }}>
                  <AssignmentIcon sx={{ color: '#3f51b5', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="textSecondary">
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
              <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Completed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#3c4858', my: 1 }}>
                  {stats.completedTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', width: 56, height: 56 }}>
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 1, mb: 0 }}>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'inline' }}>
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
              <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                In Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#3c4858', my: 1 }}>
                  {stats.inProgressTasks}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', width: 56, height: 56 }}>
                  <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="textSecondary">
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
              <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Team Members
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#3c4858', my: 1 }}>
                  {stats.totalMembers}
                </Typography>
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', width: 56, height: 56 }}>
                  <PeopleIcon sx={{ color: '#2196f3', fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Working on this board
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Zoom>
      </Grid>

      {/* Task Progress */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#3c4858' }}>
          Task Progress
        </Typography>
      </Grid>

      {/* Task Distribution */}
      <Grid item xs={12} md={6}>
        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <StyledCard sx={{ height: 400 }}>
            <StyledCardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center' }}>
                <BusinessCenterIcon sx={{ mr: 1, color: '#fff' }} />
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
                    <Tooltip
                      formatter={(value, name) => [`${value} tasks`, name]}
                      contentStyle={{
                        borderRadius: 8,
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
                <TrendingUpIcon sx={{ mr: 1, color: '#fff' }} />
                Weekly Progress
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyProgressData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Tasks Completed"
                      stroke="#4caf50"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name="Tasks Created"
                      stroke="#2196f3"
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
        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#3c4858' }}>
          Team Members
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Zoom in={true} style={{ transitionDelay: '700ms' }}>
          <StyledCard>
            <StyledCardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ mr: 1, color: '#fff' }} />
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
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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
                            border: '2px solid #fff',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                          }}
                        >
                          {!member.avatar && (member.displayName?.charAt(0) || 'U')}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#3c4858' }}>
                            {member.displayName || 'Unknown User'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
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
                              'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                            color: activeBoard.owners.some(owner => owner._id === member._id) ?
                              '#2196f3' : '#4caf50',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {activeBoard.owners.some(owner => owner._id === member._id) ? 'Owner' : 'Member'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ width: '90px', color: '#3c4858', fontWeight: 500 }}>Progress:</Typography>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={50 + (index * 10) % 50} // Placeholder - replace with actual data
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '40px' }}>
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

export default Dashboard 