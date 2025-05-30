
import { Box, InputAdornment, Typography } from '@mui/material'
import ModeSelect from '../ModeSeclect/ModeSelect'
import theme from '~/theme'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
//import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import WorkSpeces from './Menus/WorkSpeces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  const [search, setSearch] = useState('')
  return (
    <Box sx={{
      width: '100%', height: () => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.primary.main,
      gap: 2,
      paddingX: 2,
      color: '#fff'
    }}>
      <Box sx={{ display: 'flex', gap: '2', alignItems: 'center' }}>
        <Link to="/boards">
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>
        <Link to='/'>
          <Box sx={{ display: 'flex', gap: '0.5', alignItems: 'center' }}>
            <SvgIcon sx={{ color: 'white' }} inheritViewBox />
            <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
        </Link>
        <Box sx={{
          display: { xs: 'none', md: 'flex', gap: 1, color: 'white' }
        }}>
          <WorkSpeces></WorkSpeces>
          <Recent></Recent>
          <Started></Started>
          <Templates></Templates>
          <Box>
            <Button variant="outlined" startIcon={<AddBoxIcon />} sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }}>Create</Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{
          display: 'flex',
          gap: '5',
          alignItems: 'center'
        }}>
          <AutoCompleteSearchBoard/>
          <ModeSelect></ModeSelect>
          
          <Notifications />

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ marginLeft: '1rem' }}></HelpOutlineIcon>
          </Tooltip>
          <Profiles></Profiles>
        </Box>
      </Box>
    </Box>
  )
}

export default AppBar