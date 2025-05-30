import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { styled } from '@mui/system'
import { sendChatMessageApi } from '~/apis'
import { toast } from 'react-toastify'

const ChatContainer = styled(Box)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '380px',
  backgroundColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
  zIndex: 1000,
  overflow: 'hidden',
  border: '1px solid #e0e0e0'
})

const ChatHeader = styled(Box)({
  padding: '15px 20px',
  backgroundColor: '#2196f3',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: '500',
  fontSize: '16px',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
})

const ChatMessages = styled(Box)({
  height: '400px',
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  backgroundColor: '#f8f9fa',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '3px',
    '&:hover': {
      background: '#a8a8a8'
    }
  }
})

const MessageContainer = styled(Box)(({ isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  flexDirection: isUser ? 'row-reverse' : 'row'
}))

const MessageAvatar = styled(Box)({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e3f2fd',
  color: '#2196f3'
})

const Message = styled(Box)(({ isUser }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '15px',
  backgroundColor: isUser ? '#2196f3' : '#ffffff',
  color: isUser ? '#ffffff' : '#000000',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  fontSize: '14px',
  lineHeight: '1.5',
  position: 'relative'
}))

const ChatInput = styled(Box)({
  padding: '15px',
  display: 'flex',
  gap: '10px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#ffffff'
})

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: '#f8f9fa',
    '& fieldset': {
      borderColor: '#e0e0e0'
    },
    '&:hover fieldset': {
      borderColor: '#2196f3'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196f3'
    }
  },
  '& .MuiInputBase-input': {
    color: '#000000',
    padding: '10px 15px'
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#757575',
    opacity: 1
  }
})

const ChatButton = styled(IconButton)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#2196f3',
  color: 'white',
  padding: '15px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: '#1976d2'
  }
})

const SendButton = styled(IconButton)({
  backgroundColor: '#2196f3',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1976d2'
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e'
  }
})

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setIsLoading(true)

    try {
      const response = await sendChatMessageApi(userMessage)
      setMessages(prev => [...prev, { text: response.reply, isUser: false }])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Sorry, something went wrong. Please try again.')
      setMessages(prev => [...prev, {
        text: 'Sorry, something went wrong. Please try again.',
        isUser: false
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <ChatButton onClick={() => setIsOpen(true)}>
        <ChatIcon />
      </ChatButton>
    )
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon />
          <span>Chat Assistant</span>
        </Box>
        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </ChatHeader>

      <ChatMessages>
        {messages.map((message, index) => (
          <MessageContainer key={index} isUser={message.isUser}>
            <MessageAvatar>
              {message.isUser ? <AccountCircleIcon /> : <SmartToyIcon />}
            </MessageAvatar>
            <Message isUser={message.isUser}>
              {message.text}
            </Message>
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInput>
        <StyledTextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          disabled={isLoading}
        />
        <SendButton
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <SendIcon />
        </SendButton>
      </ChatInput>
    </ChatContainer>
  )
}

export default ChatBot 