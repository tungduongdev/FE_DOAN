import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { HexColorPicker } from 'react-colorful'

// Predefined colors cho quick selection
const PREDEFINED_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1',
  '#F1FF33', '#FF8C33', '#8C33FF', '#33FF8C', '#F133FF',
  '#FFB833', '#33B8FF', '#B833FF', '#FF3333', '#33FFFF'
]

function CardLabels({ cardLabels = [], onAddLabel, onRemoveLabel }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('#FF5733')
  const confirm = useConfirm()

  useEffect(() => {
    console.log('CardLabels component - cardLabels prop changed:', cardLabels)
  }, [cardLabels])

  const handleAddLabel = async () => {
    if (!labelName.trim()) {
      toast.error('Please enter label name')
      return
    }

    setIsAdding(true)
    try {
      console.log('Adding label:', { name: labelName.trim(), color: labelColor })
      const result = await onAddLabel({
        name: labelName.trim(),
        color: labelColor
      })
      console.log('Add label result:', result)
      toast.success('Label added successfully!')
      setLabelName('')
      setLabelColor('#FF5733')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Add label error:', error)
      toast.error('Failed to add label')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveLabel = (label) => {
    confirm({
      title: 'Remove Label',
      description: `Are you sure you want to remove the label "${label.name}"?`,
      confirmationText: 'Remove',
      cancellationText: 'Cancel'
    }).then(() => {
      console.log('Removing label:', label._id)
      onRemoveLabel(label._id).then((result) => {
        console.log('Remove label result:', result)
        toast.success('Label removed successfully!')
      }).catch((error) => {
        console.error('Remove label error:', error)
        toast.error('Failed to remove label')
      })
    }).catch(() => {
      // User cancelled
    })
  }

  const handlePredefinedColorClick = (color) => {
    setLabelColor(color)
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
          <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Labels ({cardLabels.length})
        </Typography>

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ textTransform: 'none' }}
        >
          Add Label
        </Button>
      </Box>

      {cardLabels.length === 0 ? (
        <Typography sx={{
          fontSize: '14px',
          color: 'text.secondary',
          fontStyle: 'italic',
          textAlign: 'center',
          py: 2
        }}>
          No labels yet. Click "Add Label" to create labels.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cardLabels.map((label) => (
            <Chip
              key={label._id}
              label={label.name}
              size="medium"
              sx={{
                backgroundColor: label.color,
                color: '#fff',
                fontWeight: 'bold',
                '& .MuiChip-deleteIcon': {
                  color: '#fff',
                  '&:hover': {
                    color: '#f0f0f0'
                  }
                }
              }}
              onDelete={() => handleRemoveLabel(label)}
              deleteIcon={<DeleteIcon />}
            />
          ))}
        </Box>
      )}

      {/* Add Label Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Label</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Label Name"
            fullWidth
            variant="outlined"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            inputProps={{ maxLength: 30 }}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Choose Color:
          </Typography>

          {/* Predefined Colors */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Quick Colors:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PREDEFINED_COLORS.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: color,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: labelColor === color ? '3px solid #333' : '1px solid #ddd',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                  onClick={() => handlePredefinedColorClick(color)}
                />
              ))}
            </Box>
          </Box>

          {/* Custom Color Picker */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Custom Color:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HexColorPicker color={labelColor} onChange={setLabelColor} />
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: labelColor,
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    mb: 1
                  }}
                />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {labelColor}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Preview */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preview:
            </Typography>
            <Chip
              label={labelName || 'Sample Label'}
              sx={{
                backgroundColor: labelColor,
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddLabel}
            variant="contained"
            disabled={isAdding || !labelName.trim()}
          >
            {isAdding ? 'Adding...' : 'Add Label'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CardLabels 