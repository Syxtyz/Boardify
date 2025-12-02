import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { List, Card } from "@/lib/objects/data";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DndContext, PointerSensor, KeyboardSensor, useSensors, useSensor, closestCenter, closestCorners, DragOverlay, useDroppable } from "@dnd-kit/core";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useState, useEffect, useCallback, memo } from "react";
import { useReorderListMutation } from "@/lib/hooks/useList";
import { useReorderCardMutation } from "@/lib/hooks/useCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import { ListStore } from "@/lib/stores/listStore";
import { ListMenu } from "./listMenu";
import { CSS } from "@dnd-kit/utilities";
import BoardMenu from "./boardMenu/boardMenu";
import CreateCard from "./modal/createCard";
import CreateList from "./createList";
import ActivityFeed from "./activity/activityFeed";
import ModalView from "./modal/modalView";

export default function BoardView() {
  const selectedBoard = BoardStore((s) => s.selectedBoard);
  const fetchListById = ListStore((s) => s.fetchListById);
  const fetchCardById = CardStore((s) => s.fetchCardById);

  const [modalOpen, setModalOpen] = useState(false);
  const [creatingCardState, setCreatingCardState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lists, setLists] = useState<List[]>(selectedBoard?.lists || []);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const reorderListsMutation = useReorderListMutation(selectedBoard?.id || 0);
  const reorderCardsMutation = useReorderCardMutation(selectedBoard?.id || 0);

  useEffect(() => {
    if (selectedBoard) setLists(selectedBoard.lists);
  }, [selectedBoard]);

  useEffect(() => {
    if (!modalOpen) {
      CardStore.getState().clearSelectedCard();
      ListStore.getState().clearSelectedList();
      setCreatingCardState(false);
      setIsEditing(false);
    }
  }, [modalOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleListDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!active || !over) return;
      const oldIndex = lists.findIndex((l) => l.id === Number(active.id));
      const newIndex = lists.findIndex((l) => l.id === Number(over.id));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const newLists = arrayMove(lists, oldIndex, newIndex);
      setLists(newLists);
      setActiveListId(null);
      reorderListsMutation.mutate(
        newLists.map((l, index) => ({ id: l.id, order: index }))
      );
      BoardStore.setState((state) => ({
        selectedBoard: state.selectedBoard
          ? { ...state.selectedBoard, lists: newLists }
          : state.selectedBoard,
      }));
    },
    [lists, reorderListsMutation]
  );

  const handleCardDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      if (!active) return;
      const id = Number(active.id);
      if (lists.some((l) => l.id === id)) {
        setActiveListId(id);
        setActiveCardId(null);
      } else {
        setActiveCardId(id);
        setActiveListId(null);
      }
    },
    [lists]
  );

  const handleCardDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!active || !over) return;
      const activeId = Number(active.id);
      const overId = over.id;
      const sourceListIdx = lists.findIndex((l) =>
        l.cards.some((c) => c.id === activeId)
      );
      const sourceCardIdx = lists[sourceListIdx].cards.findIndex(
        (c) => c.id === activeId
      );
      let targetListIdx: number;
      let targetCardIdx: number;
      if (typeof overId === "string" && overId.startsWith("list-")) {
        targetListIdx = lists.findIndex((l) => `list-${l.id}` === overId);
        targetCardIdx = lists[targetListIdx].cards.length;
      } else {
        const overIdNum = Number(overId);
        targetListIdx = lists.findIndex((l) =>
          l.cards.some((c) => c.id === overIdNum)
        );
        targetCardIdx = lists[targetListIdx].cards.findIndex(
          (c) => c.id === overIdNum
        );
      }
      if (sourceListIdx === targetListIdx && sourceCardIdx === targetCardIdx) {
        setActiveCardId(null);
        return;
      }
      const newLists = lists.map((l) => ({ ...l, cards: [...l.cards] }));
      const [moved] = newLists[sourceListIdx].cards.splice(sourceCardIdx, 1);
      newLists[targetListIdx].cards.splice(targetCardIdx, 0, moved);
      setLists(newLists);
      setActiveCardId(null);
      reorderCardsMutation.mutate(
        newLists.flatMap((list) =>
          list.cards.map((c, i) => ({ id: c.id, list: list.id, order: i }))
        )
      );
      BoardStore.setState((state) => ({
        selectedBoard: state.selectedBoard
          ? { ...state.selectedBoard, lists: newLists }
          : state.selectedBoard,
      }));
    },
    [lists, reorderCardsMutation]
  );

  // ✅ CUSTOM COLLISION DETECTION FOR LISTS AND CARDS
  const customCollisionDetection = useCallback(
    ({ active, droppableContainers, ...args }: any) => {
      const activeId = Number(active.id)
      const isList = lists.some(l => l.id === activeId)

      if (isList) {
        // LIST COLLISION: only consider other lists
        const listContainers = droppableContainers.filter((c: any) =>
          lists.some(l => l.id === Number(c.id))
        )
        return closestCenter({ ...args, active, droppableContainers: listContainers })
      } else {
        // CARD COLLISION: only consider card containers (not lists)
        const cardContainers = droppableContainers.filter((c: any) =>
          !lists.some(l => l.id === Number(c.id))
        )
        return closestCorners({ ...args, active, droppableContainers: cardContainers })
      }
    },
    [lists]
  )


  const openListModal = useCallback(
    async (listId: number) => {
      if (!selectedBoard) return;
      await fetchListById(selectedBoard.id, listId);
      setCreatingCardState(false);
      setIsEditing(false);
      setModalOpen(true);
    },
    [selectedBoard?.id, fetchListById]
  );

  const openCardModal = useCallback(
    async (listId: number, cardId: number) => {
      if (!selectedBoard) return;
      await fetchCardById(selectedBoard.id, listId, cardId);
      await fetchListById(selectedBoard.id, listId);
      setCreatingCardState(false);
      setIsEditing(false);
      setModalOpen(true);
    },
    [selectedBoard?.id, fetchCardById, fetchListById]
  );

  const createNewCard = useCallback(
    async (listId: number) => {
      if (!selectedBoard) return;
      await fetchListById(selectedBoard.id, listId);
      setCreatingCardState(true);
      setIsEditing(false);
      setModalOpen(true);
    },
    [selectedBoard?.id, fetchListById]
  );

  const DroppableList = ({
    list,
    children,
  }: {
    list: List;
    children: React.ReactNode;
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `list-${list.id}` });
    return (
      <div
        ref={setNodeRef}
        className={`w-64 flex flex-col p-2 rounded bg-gray-100 dark:bg-zinc-900 ${isOver ? "bg-gray-300 dark:bg-zinc-700" : ""
          }`}
      >
        {children}
      </div>
    );
  };

  const SortableList = memo(
    ({ list, children }: { list: List; children: React.ReactNode }) => {
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({ id: list.id });

      return (
        <div
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.8 : 1,
            zIndex: isDragging ? 50 : "auto",
          }}
          className="flex flex-col"
        >
          <div className="flex items-center justify-between">
            <div
              {...attributes}
              {...listeners}
              className="cursor-pointer bg-gray-200 dark:bg-zinc-800 rounded py-2 font-bold mb-2 pl-3 w-64"
              onClick={(e) => {
                e.stopPropagation();
                openListModal(list.id);
              }}
            >
              <p className="pr-8 truncate">{list.title}</p>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <ListMenu list={list} />
            </div>
          </div>

          <DroppableList list={list}>{children}</DroppableList>
        </div>
      );
    },
    (prev, next) => prev.list === next.list
  );

  const CardItem = memo(
    ({ card, listId }: { card: Card; listId: number }) => {
      const { attributes, listeners, setNodeRef, transform, isDragging } =
        useSortable({ id: card.id });
      const finished = card.checkbox_items.filter(
        (item) => item.checked
      ).length;
      const total = card.checkbox_items.length;

      return (
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="flex flex-col bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-800 dark:hover:border-zinc-300 mb-2 mx-1 p-2 text-sm sm:text-base"
          style={{
            transform: CSS.Transform.toString(transform),
            opacity: isDragging ? 0.5 : 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            openCardModal(listId, card.id);
          }}
        >
          <p className="font-medium break-all w-52 truncate">{card.title}</p>
          <p className="text-sm text-gray-500 w-52 truncate">
            {card.description}
          </p>
          {card.card_type === "checkbox" && card.checkbox_items?.length && (
            <div className="items-center inline-flex gap-1 mt-1">
              <CheckBoxOutlinedIcon fontSize="small" />
              <span className="text-sm">
                {finished} / {total}
              </span>
            </div>
          )}
        </div>
      );
    },
    (prev, next) => prev.card === next.card
  );

  return (
    <>
      <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:justify-between items-center font-bold text-2xl sm:p-4 sm:px-6">
        {selectedBoard?.title}
        <div className="flex items-center space-x-2">
          <BoardMenu />
          <ActivityFeed />
        </div>
      </div>


      <ScrollArea className="h-[calc(100vh-7.25rem)]">
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleCardDragStart}
          onDragEnd={(evt) => {
            const { active } = evt;
            if (!active) return;
            if (lists.some((l) => l.id === Number(active.id)))
              handleListDragEnd(evt);
            else handleCardDragEnd(evt);
          }}
        >
          <SortableContext
            items={lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-row items-start mx-4 sm:mx-6 gap-6 justify-start mt-1">
              {lists.map((list) => (
                <SortableList key={list.id} list={list}>
                  <ScrollArea className="max-h-[70.5vh] overflow-y-auto flex flex-col">
                    <SortableContext
                      items={list.cards.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col">
                        {list.cards.map((card) => (
                          <CardItem
                            key={card.id}
                            card={card}
                            listId={list.id}
                          />
                        ))}
                        <CreateCard onClick={() => createNewCard(list.id)} />
                      </div>
                    </SortableContext>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </SortableList>
              ))}
              <CreateList />
            </div>
          </SortableContext>

          <DragOverlay>
            {activeCardId != null ? (
              (() => {
                const card = lists
                  .flatMap((l) => l.cards)
                  .find((c) => c.id === activeCardId);
                if (!card) return null;

                return (
                  <div className="w-56 p-2 bg-zinc-200 dark:bg-zinc-800 rounded shadow-lg cursor-grabbing flex flex-col">
                    <p className="font-medium break-all w-52 truncate">
                      {card.title}
                    </p>
                    <p className="text-sm text-gray-500 w-52 truncate">
                      {card.description}
                    </p>
                  </div>
                );
              })()
            ) : activeListId != null ? (
              <div className="w-64 p-2 bg-gray-200 dark:bg-zinc-900 rounded shadow-lg cursor-grabbing font-bold">
                {lists.find((l) => l.id === activeListId)?.title ?? ""}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ModalView
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        creatingCardState={creatingCardState}
        isEditing={isEditing}
        setCreatingCardState={setCreatingCardState}
        setIsEditing={setIsEditing}
      />
    </>
  );
}