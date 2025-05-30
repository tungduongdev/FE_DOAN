
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
    <FormControl sx={{ m: 1, minWidth:'120px' }} size="small">
      <InputLabel sx={{
        color: 'white',
        '&.Mui-focused': {
          color: 'white'
        }
      }
      } id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={ {
          color: 'white',
          '& .MuiSelect-icon': {
            color: 'white'
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '& .MuiSelect-selectMenu': {
            color: 'white'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '&.Mui-focusted .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          }
        } }
      >
        <MenuItem value='light'>
          <Box style={{ display:'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small'/>
          Light
          </Box>
        </MenuItem>
        <MenuItem value='dark'>
          <Box style={{ display:'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize='small'/>
          Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box display='flex' alignItems='center' gap={1}>
            <SystemUpdateAltIcon fontSize='small'/>
          System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default ModeSelect