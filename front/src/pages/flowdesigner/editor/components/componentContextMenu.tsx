"use client"
/* eslint-disable */
import { useEffect, useRef, useState } from "react"
import { Info, Edit, Copy, Clipboard, Share2, Trash } from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  component: any
  onClose: () => void
  onDelete: (componentId: string) => void
  onEdit?: (componentId: string) => void
  onClone?: (component: any) => void
  onCopySource?: (component: any) => void
  onPublish?: (component: any) => void
  onReadInfo?: (component: any) => void
}

export function ComponentContextMenu({
  x,
  y,
  component,
  onClose,
  onDelete,
  onEdit,
  onClone,
  onCopySource,
  onPublish,
  onReadInfo,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const [adjustedPosition, setAdjustedPosition] = useState({ x, y })

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + menuRect.width > viewportWidth) {
        adjustedX = viewportWidth - menuRect.width - 10
      }

      if (y + menuRect.height > viewportHeight) {
        adjustedY = viewportHeight - menuRect.height - 10
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY })
    }
  }, [x, y])

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white  border dark:bg-gray-800  border-gray-200 dark:border-gray-600 shadow-lg rounded-md py-1 text-black dark:text-gray-100 w-64 overflow-hidden"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      <div className="p-2 border-b hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium">{component.name}</div>
      <div className="divide-y divide-gray-100">
        {onReadInfo && (
          <button
            onClick={() => onReadInfo(component)}
            className="flex items-center w-full px-4 py-2 text-sm text-left  hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Read information
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(component.id)}
            className="flex items-center w-full px-4 py-2 text-sm text-left  hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4 mr-2  hover:bg-gray-100 dark:hover:bg-gray-700" />
            Edit
          </button>
        )}

        {onClone && (
          <button
            onClick={() => onClone(component)}
            className="flex items-center w-full px-4 py-2 text-sm text-left  hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy className="h-4 w-4 mr-2  hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white" />
            Clone
          </button>
        )}

        {onCopySource && (
          <button
            onClick={() => onCopySource(component)}
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Clipboard className="h-4 w-4 mr-2   hover:bg-gray-100 dark:hover:bg-gray-700" />
            Copy source-code
          </button>
        )}

        {onPublish && (
          <button
            onClick={() => onPublish(component)}
            className="flex items-center w-full px-4 py-2 text-sm text-left  hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Share2 className="h-4 w-4 mr-2  hover:bg-gray-100 dark:hover:bg-gray-700" />
            Publish to the community
          </button>
        )}
      </div>

      <div className="border-t border-gray-200  hover:bg-gray-100 dark:hover:bg-gray-700">
        <button
          onClick={() => onDelete(component.id)}
          className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600  hover:bg-gray-100 dark:hover:bg-gray-700  dark:text-red-400"
        >
          <Trash className="h-4 w-4 mr-2 text-red-600 " />
          Remove
        </button>
      </div>
    </div>
  )
}
