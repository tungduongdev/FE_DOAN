
let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8011'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-web-pink-iota.vercel.app'
}

// let apiBackEnd = ''
// if (process.env.BUILD_MODE === 'dev') {
//   apiBackEnd = 'http://localhost:8011'
// }
// if (process.env.BUILD_MODE === 'production') {
//   apiBackEnd = 'https://trello-api-2-qe2l.onrender.com'
// }

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
export const API_ROOT = apiRoot
export const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const CARD_LABELS = {
  COMPLETED: 'Completed',
  INCOMPLETE: 'In Progress',
  DUE_SOON: 'Due Soon',
  OVERDUE: 'Overdue'
}
