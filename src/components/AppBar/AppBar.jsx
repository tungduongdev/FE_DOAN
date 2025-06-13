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
import UnifiedNotifications from './UnifiedNotifications/UnifiedNotifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  const [search, setSearch] = useState('')
  return (
    <Box sx={{
      width: '100%',
      height: () => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'primary.main',
      background: (theme) => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
        : 'linear-gradient(135deg, #0052cc 0%, #2684ff 50%, #0065ff 100%)',
      gap: 2,
      paddingX: 3,
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderBottom: (theme) => theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.1)'
        : 'none'
    }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Link to="/boards">
          <Tooltip title="Board List">
            <AppsIcon sx={{
              color: 'white',
              verticalAlign: 'middle',
              fontSize: '28px',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                filter: 'brightness(1.2)'
              }
            }} />
          </Tooltip>
        </Link>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}>
            <SvgIcon sx={{ color: 'white', fontSize: '32px' }} inheritViewBox />
            <Typography variant='h5' sx={{
              fontWeight: 'bold',
              color: 'white',
              fontFamily: '"Segoe UI", sans-serif',
              letterSpacing: '0.5px'
            }}>
              Trello
            </Typography>
          </Box>
        </Link>
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          gap: 1,
          color: 'white',
          ml: 2
        }}>
          <WorkSpeces />
          <Recent />
          <Started />
          <Templates />
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddBoxIcon />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}>
          <AutoCompleteSearchBoard />
          <ModeSelect />
          <UnifiedNotifications />
          <Tooltip title="Help">
            <HelpOutlineIcon sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                filter: 'brightness(1.2)'
              }
            }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBar