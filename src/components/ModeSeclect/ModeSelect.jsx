import { Box, Container } from '@mui/material'
import {
  useColorScheme
} from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selected = event.target.value
    setMode(selected)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: '140px' }} size="small">
      <InputLabel sx={{
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 500,
        '&.Mui-focused': {
          color: 'white'
        }
      }} id="label-select-dark-light-mode">Theme</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Theme"
        onChange={handleChange}
        sx={{
          color: 'white',
          fontSize: '0.875rem',
          borderRadius: '8px',
          '& .MuiSelect-icon': {
            color: 'white'
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.3)',
            borderWidth: '1px'
          },
          '& .MuiSelect-selectMenu': {
            color: 'white'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
            borderWidth: '1px'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
            borderWidth: '2px'
          },
          '& .MuiSelect-select': {
            paddingY: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }
        }}
      >
        <MenuItem value='light' sx={{
          borderRadius: '6px',
          margin: '4px',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LightModeIcon fontSize='small' sx={{ color: 'orange' }} />
            <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Light</Box>
          </Box>
        </MenuItem>
        <MenuItem value='dark' sx={{
          borderRadius: '6px',
          margin: '4px',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DarkModeOutlinedIcon fontSize='small' sx={{ color: 'grey.600' }} />
            <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Dark</Box>
          </Box>
        </MenuItem>
        <MenuItem value='system' sx={{
          borderRadius: '6px',
          margin: '4px',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SystemUpdateAltIcon fontSize='small' sx={{ color: 'info.main' }} />
            <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>System</Box>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default ModeSelect