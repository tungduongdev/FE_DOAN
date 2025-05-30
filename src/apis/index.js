import { toast } from 'react-toastify'
import authorizeAxiosInstace from '~/utils/authorizeAxios'


// export const fetchBoardDetailsApi = async (boardId) => {
//   const response = await axios.get(`http://localhost:8011/v1/boards/${boardId}`)
//   //console.log(response.data)
//   //axios tra ket qua ve dang response.data
//   return response.data
// }

export const updateBoard = async (boardId, updatedata) => {
  const response = await authorizeAxiosInstace.put(`http://localhost:8011/v1/boards/${boardId}`, updatedata)
  //console.log(response.data)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const deleteBoard = async (boardId) => {
  const response = await authorizeAxiosInstace.delete(`http://localhost:8011/v1/boards/${boardId}`)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const moveCardToDifferentColumnApi = async (updatedata) => {
  const response = await authorizeAxiosInstace.put('http://localhost:8011/v1/boards/supports/moving_card', updatedata)
  //console.log(response.data)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const updateColumn = async (columnId, updatedata) => {
  const response = await authorizeAxiosInstace.put(`http://localhost:8011/v1/columns/${columnId}`, updatedata)
  //console.log(response.data)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const deleteColumn = async (columnId) => {
  const response = await authorizeAxiosInstace.delete(`http://localhost:8011/v1/columns/${columnId}`)
  //axios tra ket qua ve dang response.data
  console.log('🚀 ~ deleteColumn ~ response.data:', response.data)
  return response.data
}

export const createNewColumn = async (newColumnData) => {
  const response = await authorizeAxiosInstace.post('http://localhost:8011/v1/columns/', newColumnData)
  //console.log(response.data)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const createNewCard = async (newCardData) => {
  const response = await authorizeAxiosInstace.post('http://localhost:8011/v1/cards/', newCardData)
  //console.log(response.data)
  //axios tra ket qua ve dang response.data
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstace.post(
    'http://localhost:8011/v1/users/register', data
  )
  toast.success(
    'Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' }
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstace.put(
    'http://localhost:8011/v1/users/verify', data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' }
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstace.get(
    'http://localhost:8011/v1/users/refresh-token'
  )
  return response.data
}

export const fetchBoardsApi = async (searchPath) => {
  const response = await authorizeAxiosInstace.get(`http://localhost:8011/v1/boards/${searchPath}`)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const createNewBoardApi = async (newBoardData) => {
  const response = await authorizeAxiosInstace.post('http://localhost:8011/v1/boards/', newBoardData)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const updateCardDetailsApi = async (cardId, updatedata) => {
  const response = await authorizeAxiosInstace.put(`http://localhost:8011/v1/cards/${cardId}`, updatedata)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const deleteCardApi = async (cardId) => {
  const response = await authorizeAxiosInstace.delete(`http://localhost:8011/v1/cards/${cardId}`)
  //axios tra ket qua ve dang response.data
  return response.data
}

export const inviteUserToBoardApi = async (data) => {
  const response = await authorizeAxiosInstace.post('http://localhost:8011/v1/invitations/board', data)
  //axios tra ket qua ve dang response.data
  toast.success('Invitation sent successfully!', { theme: 'colored' })
  return response.data
}

// Board member management APIs
export const removeBoardMemberApi = async (boardId, userId) => {
  const response = await authorizeAxiosInstace.delete(`http://localhost:8011/v1/boards/${boardId}/members/${userId}`)
  return response.data
}

export const changeBoardMemberRoleApi = async (boardId, userId, newRole) => {
  const response = await authorizeAxiosInstace.put(`http://localhost:8011/v1/boards/${boardId}/members/${userId}/role`, {
    newRole
  })
  return response.data
}

/** Chat */
export const sendChatMessageApi = async (message) => {
  const response = await authorizeAxiosInstace.post('http://localhost:8011/v1/chat', { message })
  return response.data
}