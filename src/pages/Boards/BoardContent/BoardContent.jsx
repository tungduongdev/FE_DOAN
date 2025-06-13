import ListColumns from './ListColumns/ListColumns'
import { Box } from '@mui/material'
import { genaratePlaceholderCard } from '~/utils/formatter'
import {
  DndContext,
  useSensor,
  useSensors,
  //MouseSensor,
  //TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndkitSensors'
import React from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'
import { useCallback, useMemo } from 'react'
import { updateBoard, updateColumn } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { moveCardToDifferentColumnApi } from '~/apis/index'


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent() {
  //console.log('moveColumns', moveColumns)
  //Yêu cầu sử dụng PointerSensor khi chuot di chuyển 10px
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 0 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 0 } })
  const sensor = useSensors(mouseSensor, touchSensor)

  const [oderedColumns, setOderedColumn] = React.useState([])
  const [activeDragItemId, setActiveDragItemId] = React.useState(null)
  const [activeDragItemType, setActiveDragItemType] = React.useState(null)
  const [activeDragItemData, setActiveDragItemData] = React.useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = React.useState(null)

  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)

  //diem va cham cuoi cung xu li thuat toan phat hien va cham
  const lastOverId = React.useRef(null)
  React.useEffect(() => {
    //console.log('board', board)
    setOderedColumn(board.columns)
    //console.log('oderedColumns', oderedColumns)
  }, [board])
  //tim column theo cardId - optimized with useMemo
  const findColumnByCardId = useCallback((cardId) => {
    //doan nay nen dung card that vi cardId vi o buoc handleDragOver chung ta
    //se lam du lieu cho card hoan chinh truoc roi moi tao ra cardIds moi
    return oderedColumns.find(c => c?.cards?.map(card => card._id)?.includes(cardId))
  }, [oderedColumns])
  const moveCardBetWeenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOderedColumn(prevColumns => {
      //lay ra vi tri cua overCARD TRONG COLUMN DICH SAP DC KEP THA
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      let newCardIndex
      //logic trong thu vien tu choi hieu :V
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      const prevColumnId = nextActiveColumn._id
      const nextColumnId = nextOverColumn._id
      const currentCardId = activeDraggingCardId
      //column cu
      if (nextActiveColumn) {
        //xoa card cu trong column
        nextActiveColumn.cards = nextActiveColumn.cards.filter(c => c._id !== activeDraggingCardId)
        if (nextActiveColumn.cards.length === 0) {
          console.log('card cuoi cung')
          nextActiveColumn.cards = [genaratePlaceholderCard(nextActiveColumn)]
        }
        //cap nhat lai cardIds
        nextActiveColumn.cardIds = nextActiveColumn.cards.map(c => c._id)
      }
      //column moi
      if (nextOverColumn) {
        //kiem tra xem card da ton tai trong column chua
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)
        //doi voi keo tha giua cac column thi can phai cap nhat lai columnId
        const rebuild_activeDraggingCardData = { ...activeDraggingCardData, columnId: nextActiveColumn._id }
        //them card vao vi tri moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //cap nhat lai cardIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
      }
      //neu function nay đuoc gọi api khi da keo tha xong
      if (triggerFrom === 'handleDragEnd') {
        const dndOrderedCardsIds = nextColumns.map(c => c._id)
        const newBoard = cloneDeep(board)
        newBoard.columns = nextColumns
        newBoard.columnOrderIds = dndOrderedCardsIds
        dispatch(updateCurrentActiveBoard(newBoard))

        // ẩn card placeholder ở front-end để dữ liệu không bị lỗi khi thêm vào backend
        let prevCardOrderIds = nextColumns.find(column => column._id === oldColumnWhenDraggingCard._id)?.cardOrderIds || []
        if (prevCardOrderIds[0].includes('-placeholder-card')) prevCardOrderIds = []

        let nextCardOrderIds = nextColumns.find(column => column._id === nextOverColumn._id)?.cardOrderIds
        nextCardOrderIds = nextCardOrderIds.filter(id => !id.includes('-placeholder-card'))

        moveCardToDifferentColumnApi({
          currentCardId,
          prevColumnId,
          prevCardOrderIds,
          nextColumnId,
          nextCardOrderIds
        })
      }
      return nextColumns
    })
  }
  const handleDragStart = (e) => {
    setActiveDragItemId(e.active?.id)
    setActiveDragItemType(e.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e.active?.data?.current)
    //neu nhu la keo tha card thi luu lai column cu
    if (e.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e.active?.id))
    }
  }

  //trigger trong qua trinh keo tha
  const handleDragOver = (e) => {
    const { active, over } = e
    //neu nhu la keo tha column thi khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //console.log('activeColumn', activeColumn)
    //console.log('overColumn', overColumn)

    //neu nhu khong tim thay column nao thi khong lam gi ca
    if (!activeColumn || !overColumn) return
    //neu nhu keo tha o 2 colmn khac nhau code chay vao day
    if (activeColumn._id !== overColumn._id) {
      moveCardBetWeenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }
  const handleDragEnd = (e) => {
    const { active, over } = e
    if (!active || !over) return
    //xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //neu nhu khong tim thay column nao thi khong lam gi ca
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetWeenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        //hanh dong keo tha caed giua cung 1 column
        // Lấy vị trí cũ tu thang oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lấy vị trí mới tu thang over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        //logic tuong tu keo tha column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

        setOderedColumn(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          //tim ra column can cap nhat
          const tagetColumn = nextColumns.find(c => c._id === overColumn._id)
          //cap nhat lại 2 gia tri card va cardorderIds
          tagetColumn.cards = dndOrderedCards
          tagetColumn.cardOrderIds = dndOrderedCardIds
          return nextColumns
        })
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(column => column._id === overColumn._id)
        if (columnToUpdate) {
          columnToUpdate.cards = dndOrderedCards
          columnToUpdate.cardOrderIds = dndOrderedCardIds
        }
        dispatch(updateCurrentActiveBoard(newBoard))
        updateColumn(overColumn._id, { cardOrderIds: dndOrderedCardIds })
      }
    }
    //xu ly keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active?.id !== over.id) {
        // Lấy vị trí cũ
        const oldColumnIndex = oderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí mới
        const newColumnIndex = oderedColumns.findIndex(c => c._id === over.id)
        // Sửa: Khai báo dndOrderedColumns trước khi sử dụng
        const dndOrderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // Cập nhật trạng thái sau khi keo tha
        setOderedColumn(dndOrderedColumns)
        const dndOrderedCardsIds = dndOrderedColumns.map(c => c._id)
        const newBoard = cloneDeep(board)
        newBoard.columns = dndOrderedColumns
        newBoard.columnOrderIds = dndOrderedCardsIds
        dispatch(updateCurrentActiveBoard(newBoard))
        updateBoard(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
      }
    }
    //xu ly keo tha column
    // neu vi tri keo th khac vi tri moi
    //nhung du lieu cua card se duoc cap nhat ve null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    duration: 200,
    easing: 'ease-out',
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.6,
          transform: 'scale(1.02)'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Sử dụng pointerWithin để có độ chính xác cao hơn
    const pointerIntersection = pointerWithin(args)

    if (!pointerIntersection?.length) {
      // Fallback to rect intersection if no pointer intersection
      const rectIntersections = rectIntersection(args)
      return rectIntersections?.length ? rectIntersections : (lastOverId.current ? [{ id: lastOverId.current }] : [])
    }

    // Tìm overId đầu tiên trong mảng va chạm
    let overId = getFirstCollision(pointerIntersection, 'id')

    if (overId) {
      const checkColumn = oderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // Chỉ tìm trong các cards của column này
        const cardsInColumn = args.droppableContainers.filter(container =>
          container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
        )

        if (cardsInColumn.length > 0) {
          const closestCard = closestCenter({
            ...args,
            droppableContainers: cardsInColumn
          })
          overId = closestCard[0]?.id || overId
        }
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, oderedColumns])
  return (
    <DndContext
      sensors={sensor}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={activeDragItemId ? "dnd-active" : ""}>
        <Box sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1d23 0%, #2c3e50 100%)'
            : 'linear-gradient(135deg, #fafbfc 0%, #ebecf0 100%)',
          backgroundImage: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1d23 0%, #2c3e50 100%)'
            : 'linear-gradient(135deg, #fafbfc 0%, #f4f5f7 50%, #dfe1e6 100%)',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeigh,
          p: '10px 0',
          minHeight: '100vh',
          overflow: 'hidden'
        }}>
          <ListColumns columns={oderedColumns} />
          <DragOverlay dropAnimation={dropAnimation}>
            {!activeDragItemType && null}
            {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
            {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
          </DragOverlay>
        </Box>
      </div>
    </DndContext>
  )
}

export default BoardContent
