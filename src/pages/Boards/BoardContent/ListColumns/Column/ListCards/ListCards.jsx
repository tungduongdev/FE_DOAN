import { Box } from '@mui/material'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ cards, columnId }) {
  //console.log(cards.length)
  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
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
        {cards?.map(card => (
          <Card key={card._id} card={card} columnId={columnId} />
        ))}
        {/* Only render this placeholder for empty column display */}
        {!cards || cards.length === 0 ? (
          <Card temporartHideMedia columnId={columnId} />
        ) : null}
      </Box>
    </SortableContext>
  )
}

export default ListCards