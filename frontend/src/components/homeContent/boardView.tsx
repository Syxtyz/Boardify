import { useState } from "react"
import { BoardStore } from "@/lib/stores/boardStore"
import { CardStore } from "@/lib/stores/cardStore"
import { ListStore } from "@/lib/stores/listStore"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import ListModal from "./listModal"
import CreateCard from "./createCard"
import CreateList from "./createList"
import { ListMenu } from "./listMenu"
import BoardMenu from "./boardMenu"

export default function BoardView() {
  const { selectedBoard } = BoardStore()
  const { fetchCardById, setCreatingCard } = CardStore()
  const { fetchListById } = ListStore()

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="flex justify-center items-center h-12 font-bold text-lg sm:text-xl md:text-2xl px-2 text-center relative">
        {selectedBoard?.title}
        <div className="absolute right-2">
          <BoardMenu/>
        </div>
      </div> 

      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="flex flex-row flex-wrap md:flex-nowrap items-start mx-2 gap-3 md:gap-4 justify-center md:justify-start mt-0.5">
          {selectedBoard?.lists.map((list) => (
            <div
              key={list.id}
              className="w-full sm:w-[18rem] flex flex-col bg-gray-100 dark:bg-zinc-900 font-bold py-2 pl-2 rounded transition-transform hover:scale-[1.01]"
              onClick={async () => {
                await fetchListById(selectedBoard.id, list.id)
                setModalOpen(true)
              }}
            >
              <div className="relative">
                <div className="text-base sm:text-lg mb-1 truncate ml-1">{list.title}</div>
                <div className="absolute top-0 right-2.5" onClick={(e) => {e.stopPropagation(), fetchListById(selectedBoard.id, list.id)}}><ListMenu/></div>
              </div>
              <ScrollArea className="max-h-[77.5vh] overflow-y-auto flex flex-col pr-2">
                <div className="flex flex-col">
                  {list.cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={async (e) => {
                        e.stopPropagation()
                        await fetchCardById(selectedBoard.id, list.id, card.id)
                        await fetchListById(selectedBoard.id, list.id)
                        setModalOpen(true)
                      }}
                      className="flex flex-col bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-800 dark:hover:border-zinc-300 my-1 mx-1 p-2 text-sm sm:text-base"
                    >
                      <p className="font-medium break-all">{card.title}</p>
                      <p className="text-sm text-gray-500 w-62 truncate">{card.description}</p>
                    </div>
                  ))}
                  <CreateCard onClick={async () => {await fetchListById(selectedBoard.id, list.id), setCreatingCard(true), setModalOpen(true)}}/>
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          ))}
          <CreateList/>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ListModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
