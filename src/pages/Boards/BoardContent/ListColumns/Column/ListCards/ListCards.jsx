import { Box } from '@mui/material'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ cards, columnId }) {
  // Tạo card placeholder đơn giản khi column trống
  const placeholderCard = {
    _id: `${columnId}-placeholder-card`,
    columnId: columnId,
    FE_PlaceHoderCard: true
  }

  // Nếu không có card thật nào, thêm placeholder để có thể kéo thả
  const displayCards = (cards && cards.length > 0) ? cards : [placeholderCard]

  return (
    <SortableContext items={displayCards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box
        className="dnd-scrollable dnd-container"
        sx={{
          p: '0 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowY: 'auto',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeigh} - ${theme.trello.columnHeaderHeight} - ${theme.spacing(5)} - ${theme.trello.columnFooterHeight})`,
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px'
          }
        }}>
        {displayCards?.map(card => (
          <Card key={card._id} card={card} columnId={columnId} />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards