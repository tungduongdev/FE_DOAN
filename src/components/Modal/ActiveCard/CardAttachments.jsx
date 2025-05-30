import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageIcon from '@mui/icons-material/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import ArchiveIcon from '@mui/icons-material/Archive'
import ArticleIcon from '@mui/icons-material/Article'
import TableChartIcon from '@mui/icons-material/TableChart'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useConfirm } from 'material-ui-confirm'

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to get file icon based on mime type
const getFileIcon = (mimeType) => {
  // Images
  if (mimeType.startsWith('image/')) return <ImageIcon color="primary" />

  // Videos
  if (mimeType.startsWith('video/')) return <VideoFileIcon color="secondary" />

  // Audio
  if (mimeType.startsWith('audio/')) return <AudioFileIcon color="info" />

  // PDF
  if (mimeType === 'application/pdf') return <PictureAsPdfIcon color="error" />

  // Microsoft Word
  if (mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return <ArticleIcon sx={{ color: '#2B579A' }} />
  }

  // Microsoft Excel  
  if (mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return <TableChartIcon sx={{ color: '#217346' }} />
  }

  // Microsoft PowerPoint
  if (mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    return <SlideshowIcon sx={{ color: '#D24726' }} />
  }

  // Archives
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
    return <ArchiveIcon color="warning" />
  }

  // Default
  return <InsertDriveFileIcon />
}

function CardAttachments({ cardAttachments = [], onAddAttachment, onRemoveAttachment }) {
  const [isUploading, setIsUploading] = useState(false)
  const confirm = useConfirm()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      event.target.value = ''
      return
    }

    setIsUploading(true)
    try {
      await onAddAttachment(file)
      toast.success('File uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleDeleteAttachment = (attachment) => {
    confirm({
      title: 'Delete Attachment',
      description: `Are you sure you want to delete "${attachment.originalName}"? This action cannot be undone.`,
      confirmationText: 'Delete',
      cancellationText: 'Cancel'
    }).then(() => {
      onRemoveAttachment(attachment._id).then(() => {
        toast.success('Attachment deleted successfully!')
      }).catch(() => {
        toast.error('Failed to delete attachment')
      })
    }).catch(() => {
      // User cancelled
    })
  }

  const handleDownload = (attachment) => {
    window.open(attachment.fileUrl, '_blank')
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
          <AttachFileIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Attachments ({cardAttachments.length})
        </Typography>

        <Button
          variant="outlined"
          component="label"
          size="small"
          startIcon={<AttachFileIcon />}
          disabled={isUploading}
          sx={{ textTransform: 'none' }}
        >
          {isUploading ? 'Uploading...' : 'Add Attachment'}
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept="*/*"
          />
        </Button>
      </Box>

      {cardAttachments.length === 0 ? (
        <Typography sx={{
          fontSize: '14px',
          color: 'text.secondary',
          fontStyle: 'italic',
          textAlign: 'center',
          py: 2
        }}>
          No attachments yet. Click "Add Attachment" to upload files.
        </Typography>
      ) : (
        <List dense>
          {cardAttachments.map((attachment) => (
            <ListItem
              key={attachment._id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {getFileIcon(attachment.mimeType)}
              </Box>

              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => handleDownload(attachment)}
                  >
                    {attachment.originalName}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(attachment.fileSize)} •
                      Uploaded by {attachment.uploadedBy.userDisplayName || attachment.uploadedBy.userEmail} •
                      {moment(attachment.uploadedAt).format('MMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Box>
                }
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleDownload(attachment)}
                  sx={{ mr: 1 }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleDeleteAttachment(attachment)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default CardAttachments 