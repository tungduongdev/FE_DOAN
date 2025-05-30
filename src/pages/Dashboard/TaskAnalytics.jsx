import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Zoom,
  Fade,
  styled
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import TimelineIcon from '@mui/icons-material/Timeline'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 50px -12px rgba(0,0,0,0.25)'
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  '& .MuiTableHead-root': {
    backgroundColor: '#f9fafc',
    '& .MuiTableCell-root': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: '16px'
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  '& .MuiTableCell-root': {
    padding: '16px'
  }
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    borderRadius: 10,
    padding: '6px 16px',
    border: 'none',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
    }
  }
}));

function TaskAnalytics() {
  const activeBoard = useSelector(selectActiveBoard)
  const [timeRange, setTimeRange] = useState('week')
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  })
  const [columnStats, setColumnStats] = useState([])
  const [memberStats, setMemberStats] = useState([])

  // Mock weekly progress data
  const weeklyProgressData = [
    { day: 'Mon', completed: 5, created: 7 },
    { day: 'Tue', completed: 7, created: 4 },
    { day: 'Wed', completed: 8, created: 6 },
    { day: 'Thu', completed: 6, created: 9 },
    { day: 'Fri', completed: 9, created: 5 },
    { day: 'Sat', completed: 3, created: 2 },
    { day: 'Sun', completed: 2, created: 3 }
  ]

  // Mock monthly progress data
  const monthlyProgressData = [
    { name: 'Week 1', completed: 22, created: 27 },
    { name: 'Week 2', completed: 31, created: 28 },
    { name: 'Week 3', completed: 27, created: 24 },
    { name: 'Week 4', completed: 19, created: 22 }
  ]

  useEffect(() => {
    if (activeBoard) {
      let total = 0
      let completed = 0
      let inProgress = 0
      let pending = 0
      let overdue = 0
      const columnData = []
      const memberTaskMap = {}

      // Initialize member stats
      activeBoard.FE_allUsers?.forEach(member => {
        memberTaskMap[member._id] = {
          _id: member._id,
          displayName: member.displayName || 'Unknown User',
          email: member.email,
          avatar: member.avatar,
          assigned: 0,
          completed: 0
        }
      })

      // Calculate task stats
      activeBoard.columns.forEach(column => {
        // Filter out placeholder cards
        const realCards = column.cards.filter(card => !card.FE_PlaceholderCard)

        const columnTotal = realCards.length
        total += columnTotal

        // Count cards based on column type
        let columnCompletedCount = 0

        if (column.title.toLowerCase().includes('done')) {
          columnCompletedCount = columnTotal
          completed += columnTotal
        } else if (column.title.toLowerCase().includes('doing') || column.title.toLowerCase().includes('in progress')) {
          inProgress += columnTotal
        } else {
          pending += columnTotal
        }

        // Add column stats
        columnData.push({
          id: column._id,
          name: column.title,
          total: columnTotal,
          completed: columnCompletedCount,
          percentage: columnTotal ? (columnCompletedCount / columnTotal) * 100 : 0
        })

        // Count member assignments and completion
        realCards.forEach(card => {
          // Count cards with due dates that have passed but aren't complete
          const dueDate = new Date(card.dueDate)
          const isOverdue = card.dueDate && !card.completed && dueDate < new Date()
          if (isOverdue) {
            overdue++
          }

          // Count member assignments
          card.memberIds?.forEach(memberId => {
            if (memberTaskMap[memberId]) {
              memberTaskMap[memberId].assigned++
              if (card.completed || column.title.toLowerCase().includes('done')) {
                memberTaskMap[memberId].completed++
              }
            }
          })
        })
      })

      // Set stats
      setTaskStats({
        total,
        completed,
        inProgress,
        pending,
        overdue
      })

      // Set column stats
      setColumnStats(columnData)

      // Set member stats - convert map to array and sort by assigned tasks
      const memberStatsList = Object.values(memberTaskMap).sort((a, b) => b.assigned - a.assigned)
      setMemberStats(memberStatsList)
    }
  }, [activeBoard])

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange)
    }
  }

  if (!activeBoard) {
    return null
  }

  const completionRate = taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#3c4858', display: 'flex', alignItems: 'center', mb: 3 }}>
          <AssessmentIcon sx={{ mr: 1, color: '#1976d2' }} />
          Task Analytics
          <Box sx={{ ml: 'auto' }}>
            <StyledToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
              size="small"
            >
              <ToggleButton value="week" aria-label="week">
                <TimelineIcon sx={{ mr: 0.5 }} fontSize="small" />
                Weekly
              </ToggleButton>
              <ToggleButton value="month" aria-label="month">
                <EqualizerIcon sx={{ mr: 0.5 }} fontSize="small" />
                Monthly
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        </Typography>

        {/* Task Overview Summary */}
        <Box sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
                Task Completion Rate: {completionRate}%
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                {taskStats.completed} of {taskStats.total} tasks completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  },
                  mb: 1
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`${taskStats.completed} Completed`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${taskStats.inProgress} In Progress`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<AssignmentIcon />}
                  label={`${taskStats.pending} To Do`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`${taskStats.overdue} Overdue`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: taskStats.completed || 1 },
                        { name: 'In Progress', value: taskStats.inProgress || 1 },
                        { name: 'To Do', value: taskStats.pending || 1 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Completed', value: taskStats.completed },
                        { name: 'In Progress', value: taskStats.inProgress },
                        { name: 'To Do', value: taskStats.pending }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#ffffff', '#b9f6ca', '#e8f5e9'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} tasks`, name]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 8,
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Task Distribution */}
        <Grid item xs={12} md={6}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <StyledCard>
              <StyledCardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3c4858', display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon sx={{ mr: 1, color: '#3f51b5' }} />
                  Task Distribution
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: taskStats.completed || 1 },
                          { name: 'In Progress', value: taskStats.inProgress || 1 },
                          { name: 'To Do', value: taskStats.pending || 1 }
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
                          { name: 'Completed', value: taskStats.completed },
                          { name: 'In Progress', value: taskStats.inProgress },
                          { name: 'To Do', value: taskStats.pending }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} tasks`, name]}
                        contentStyle={{
                          borderRadius: 8,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
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

        {/* Progress Chart */}
        <Grid item xs={12} md={6}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <StyledCard>
              <StyledCardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3c4858', display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1, color: '#2196f3' }} />
                  {timeRange === 'week' ? 'Weekly Progress' : 'Monthly Progress'}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeRange === 'week' ? weeklyProgressData : monthlyProgressData}
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis
                        dataKey={timeRange === 'week' ? 'day' : 'name'}
                        tick={{ fill: '#607d8b', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#607d8b', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={40}
                        formatter={(value) => <span style={{ color: '#3c4858', fontWeight: 500 }}>{value}</span>}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        name="Tasks Completed"
                        stroke="#4caf50"
                        activeDot={{ r: 8 }}
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="created"
                        name="Tasks Created"
                        stroke="#2196f3"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Zoom>
        </Grid>
      </Grid>

      {/* Task Status by Column */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#3c4858', mb: 3, mt: 4 }}>
        Task Status by Column
      </Typography>
      <Zoom in={true} style={{ transitionDelay: '400ms' }}>
        <StyledTableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="column status table">
            <TableHead>
              <TableRow>
                <TableCell>Column</TableCell>
                <TableCell align="right">Tasks</TableCell>
                <TableCell align="right">Completed</TableCell>
                <TableCell align="right">Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {columnStats.map((column, index) => (
                <Fade key={column.id} in={true} style={{ transitionDelay: `${400 + index * 50}ms` }}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: COLORS[index % COLORS.length],
                            mr: 2
                          }}
                        />
                        <Typography sx={{ fontWeight: 500, color: '#3c4858' }}>
                          {column.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{column.total}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#4caf50' }}>{column.completed}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: '70%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={column.percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: COLORS[index % COLORS.length]
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '40px' }}>
                          {column.percentage.toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Zoom>

      {/* Member Task Assignment */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#3c4858', mb: 3 }}>
        Task Assignment by Member
      </Typography>
      <Zoom in={true} style={{ transitionDelay: '600ms' }}>
        <StyledTableContainer component={Paper}>
          <Table aria-label="member task table">
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell align="right">Assigned Tasks</TableCell>
                <TableCell align="right">Completed Tasks</TableCell>
                <TableCell align="right">Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberStats.map((member, index) => (
                <Fade key={member._id} in={true} style={{ transitionDelay: `${600 + index * 50}ms` }}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={member.avatar}
                          alt={member.displayName}
                          sx={{
                            mr: 2,
                            width: 40,
                            height: 40,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid white'
                          }}
                        >
                          {!member.avatar && member.displayName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500, color: '#3c4858' }}>
                            {member.displayName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={member.assigned}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          color: '#2196f3'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={member.completed}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: '70%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={member.assigned ? (member.completed / member.assigned) * 100 : 0}
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
                          {member.assigned ? ((member.completed / member.assigned) * 100).toFixed(0) : 0}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Zoom>
    </>
  )
}

export default TaskAnalytics 