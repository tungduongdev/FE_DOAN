import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/User/userSlide'
import { removeBoardMemberApi, changeBoardMemberRoleApi } from '~/apis'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade,
  Zoom,
  styled,
  Badge,
  Divider,
  Grid
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px'
  },
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      borderBottom: 'none',
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600,
      padding: '16px'
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  boxShadow: '0 3px 5px 0 rgba(0,0,0,0.02)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: '#fff',
  '& .MuiTableCell-root': {
    border: 'none',
    borderColor: theme.palette.divider,
    padding: '16px',
    fontSize: '0.875rem',
    '&:first-of-type': {
      borderTopLeftRadius: '12px',
      borderBottomLeftRadius: '12px'
    },
    '&:last-of-type': {
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px'
    }
  },
  '&:hover': {
    backgroundColor: '#f9fafc',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px 0 rgba(0,0,0,0.05)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  boxShadow: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.05)',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)'
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  '& .MuiDialogTitle-root': {
    padding: '24px 24px 16px 24px',
    fontSize: '1.25rem',
    fontWeight: 600
  },
  '& .MuiDialogContent-root': {
    padding: '0 24px 24px 24px'
  },
  '& .MuiDialogActions-root': {
    padding: '16px 24px 24px 24px'
  }
}));

function TeamManagement() {
  const dispatch = useDispatch()
  const activeBoard = useSelector(selectActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  // Check if current user is owner
  const isCurrentUserOwner = activeBoard?.owners?.some(owner => owner._id === currentUser?._id)

  // Handle invite dialog
  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true)
  }

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false)
    setInviteEmail('')
    setInviteRole('member')
  }

  const handleInviteMember = () => {
    // Here you would integrate with your API to invite a new member
    console.log('Inviting:', inviteEmail, 'as', inviteRole)
    handleCloseInviteDialog()
    // Call your API endpoint to send invitation
  }

  // Handle edit dialog
  const handleOpenEditDialog = (member) => {
    setSelectedMember(member)
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedMember(null)
  }

  const handleUpdateMemberRole = async () => {
    try {
      const newRole = selectedMember.role === 'OWNER' ? 'MEMBER' : 'OWNER'
      await changeBoardMemberRoleApi(activeBoard._id, selectedMember._id, newRole)

      // Update board in Redux
      const newBoard = cloneDeep(activeBoard)
      const user = [...(newBoard.owners || []), ...(newBoard.members || [])].find(u => u._id === selectedMember._id)

      if (user) {
        if (newRole === 'OWNER') {
          // Move from members to owners
          newBoard.members = newBoard.members?.filter(member => member._id !== selectedMember._id) || []
          newBoard.owners = [...(newBoard.owners || []), user]
        } else {
          // Move from owners to members
          newBoard.owners = newBoard.owners?.filter(owner => owner._id !== selectedMember._id) || []
          newBoard.members = [...(newBoard.members || []), user]
        }
      }

      dispatch(updateCurrentActiveBoard(newBoard))
      toast.success(`${selectedMember.displayName} role updated successfully`)
      handleCloseEditDialog()
    } catch (error) {
      toast.error('Failed to update member role')
      console.error('Change role error:', error)
    }
  }

  // Handle delete dialog
  const handleOpenDeleteDialog = (member) => {
    setSelectedMember(member)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedMember(null)
  }

  const handleRemoveMember = async () => {
    try {
      await removeBoardMemberApi(activeBoard._id, selectedMember._id)

      // Update board in Redux
      const newBoard = cloneDeep(activeBoard)
      newBoard.owners = newBoard.owners?.filter(owner => owner._id !== selectedMember._id) || []
      newBoard.members = newBoard.members?.filter(member => member._id !== selectedMember._id) || []
      dispatch(updateCurrentActiveBoard(newBoard))

      toast.success(`${selectedMember.displayName} has been removed from the board`)
      handleCloseDeleteDialog()
    } catch (error) {
      toast.error('Failed to remove member')
      console.error('Remove member error:', error)
    }
  }

  if (!activeBoard) {
    return null
  }

  // Combine owners and members for display
  const allMembers = [
    ...(activeBoard.owners || []).map(user => ({ ...user, role: 'OWNER' })),
    ...(activeBoard.members || []).map(user => ({ ...user, role: 'MEMBER' }))
  ]

  return (
    <>
      {/* Header with stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#3c4858', display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1, color: '#000' }} />
            Team Management
          </Typography>
          {isCurrentUserOwner && (
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenInviteDialog}
              sx={{
                backgroundColor: '#000',
                '&:hover': {
                  backgroundColor: '#1976d2'
                }
              }}
            >
              Invite Member
            </StyledButton>
          )}
        </Box>

        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Box sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: '#f9f9fd',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            mb: 3
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(33, 150, 243, 0.08)'
                }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <AdminPanelSettingsIcon sx={{ color: '#000', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                    }
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#000',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                        {activeBoard.owners?.length || 0}
                      </Typography>
                    </Avatar>
                  </Badge>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: '#3c4858' }}>
                    Owners
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Have full control
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.08)'
                }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <PeopleIcon sx={{ color: '#4caf50', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                    }
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#4caf50',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                        {activeBoard.members?.length || 0}
                      </Typography>
                    </Avatar>
                  </Badge>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: '#3c4858' }}>
                    Members
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Can view and edit
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 152, 0, 0.08)'
                }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <CheckCircleIcon sx={{ color: '#ff9800', backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} />
                    }
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#ff9800',
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                        {allMembers.length}
                      </Typography>
                    </Avatar>
                  </Badge>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: '#3c4858' }}>
                    Total Users
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active on this board
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Zoom>
      </Box>

      {/* Team Members Table */}
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <StyledTableContainer component={Paper}>
          <Table aria-label="team members table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMembers.map((member, index) => (
                <Fade key={member._id || index} in={true} style={{ transitionDelay: `${200 + index * 50}ms` }}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={member.avatar}
                          alt={member.displayName || 'User'}
                          sx={{
                            mr: 2,
                            width: 40,
                            height: 40,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid white'
                          }}
                        >
                          {!member.avatar && (member.displayName?.charAt(0) || 'U')}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#3c4858' }}>
                            {member.displayName || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Joined {new Date().toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MailOutlineIcon sx={{ mr: 1, color: '#607d8b', fontSize: 16 }} />
                        <Typography color="textSecondary">{member.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={member.role === 'OWNER' ? <AdminPanelSettingsIcon /> : <PeopleIcon />}
                        label={member.role === 'OWNER' ? 'Owner' : 'Member'}
                        color={member.role === 'OWNER' ? 'primary' : 'default'}
                        variant={member.role === 'OWNER' ? 'filled' : 'outlined'}
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 500,
                          '& .MuiChip-icon': {
                            color: member.role === 'OWNER' ? 'inherit' : '#4caf50'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Active"
                        color="success"
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 500,
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          color: '#4caf50',
                          '& .MuiChip-icon': {
                            color: '#4caf50'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {/* Only show actions if current user is owner and not acting on themselves */}
                        {isCurrentUserOwner && member._id !== currentUser?._id && (
                          <>
                            <Tooltip title="Edit Role" arrow>
                              <StyledIconButton
                                color="primary"
                                onClick={() => handleOpenEditDialog(member)}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                  color: '#000'
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </StyledIconButton>
                            </Tooltip>
                            <Tooltip title="Remove from Board" arrow>
                              <StyledIconButton
                                color="error"
                                onClick={() => handleOpenDeleteDialog(member)}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                  color: '#f44336'
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </StyledIconButton>
                            </Tooltip>
                          </>
                        )}
                        {/* Show "You" label if it's current user */}
                        {member._id === currentUser?._id && (
                          <Chip
                            label="You"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Zoom>

      {/* Invite New Member Dialog */}
      <StyledDialog open={openInviteDialog} onClose={handleCloseInviteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAddIcon sx={{ mr: 1.5, color: '#000' }} />
            Invite New Member
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3, color: 'text.secondary' }}>
            Enter the email address of the person you'd like to invite to this board.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={inviteRole}
              label="Role"
              onChange={(e) => setInviteRole(e.target.value)}
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="member" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon fontSize="small" sx={{ color: '#4caf50' }} />
                <Box>
                  <Typography>Member</Typography>
                  <Typography variant="caption" color="textSecondary">Can view and edit cards</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="owner" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#000' }} />
                <Box>
                  <Typography>Owner</Typography>
                  <Typography variant="caption" color="textSecondary">Full control of board</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleInviteMember}
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Edit Member Role Dialog */}
      <StyledDialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1.5, color: '#000' }} />
            Edit Member Role
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedMember.avatar}
                  alt={selectedMember.displayName || 'User'}
                  sx={{
                    width: 50,
                    height: 50,
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid white'
                  }}
                >
                  {!selectedMember.avatar && (selectedMember.displayName?.charAt(0) || 'U')}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedMember.displayName || selectedMember.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedMember.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <FormControl fullWidth>
                <InputLabel id="edit-role-select-label">Role</InputLabel>
                <Select
                  labelId="edit-role-select-label"
                  id="edit-role-select"
                  value={selectedMember?.role || 'member'}
                  label="Role"
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                >
                  <MenuItem value="member" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon fontSize="small" sx={{ color: '#4caf50' }} />
                    <Box>
                      <Typography>Member</Typography>
                      <Typography variant="caption" color="textSecondary">Can view and edit cards</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="owner" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#000' }} />
                    <Box>
                      <Typography>Owner</Typography>
                      <Typography variant="caption" color="textSecondary">Full control of board</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleUpdateMemberRole}
            variant="contained"
            startIcon={selectedMember?.role === 'owner' ? <LockIcon /> : <LockOpenIcon />}
            color={selectedMember?.role === 'owner' ? 'primary' : 'success'}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Update to {selectedMember?.role === 'owner' ? 'Owner' : 'Member'}
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Remove Member Dialog */}
      <StyledDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#f44336' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ mr: 1.5, color: '#f44336' }} />
            Remove Member
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedMember.avatar}
                  alt={selectedMember.displayName || 'User'}
                  sx={{
                    width: 50,
                    height: 50,
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid white'
                  }}
                >
                  {!selectedMember.avatar && (selectedMember.displayName?.charAt(0) || 'U')}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedMember.displayName || selectedMember.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedMember.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Are you sure you want to remove this user from the board?
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This action cannot be undone. The user will lose access to this board and all its contents.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
            startIcon={<PersonRemoveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Remove Member
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  )
}

export default TeamManagement 