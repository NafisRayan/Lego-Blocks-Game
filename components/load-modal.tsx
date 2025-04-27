"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Clock, RefreshCw } from "lucide-react"
import { getCreations } from "@/lib/actions/get-creations"
import { deleteCreation } from "@/lib/actions/delete-creation"
import type { SavedCreation } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LoadModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (creation: SavedCreation) => void
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, onLoad }) => {
  const [creations, setCreations] = useState<SavedCreation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadCreations()
    }
  }, [isOpen])

  const loadCreations = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await getCreations(20, 0)

      if (result.success) {
        setCreations(result.creations || [])
      } else {
        setError(result.message || "Failed to load creations")
      }
    } catch (error) {
      setError("An error occurred while loading creations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (isDeleting) return

    if (!confirm("Are you sure you want to delete this creation?")) {
      return
    }

    setIsDeleting(id)

    try {
      const result = await deleteCreation(id)

      if (result.success) {
        // Remove from local state
        setCreations(creations.filter((c) => c.id !== id))
      } else {
        alert(result.message || "Failed to delete creation")
      }
    } catch (error) {
      alert("An error occurred while deleting the creation")
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Skeleton loading component
  const CreationSkeleton = () => (
    <div className="p-4 border border-gray-200 rounded-xl animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Load Creation</DialogTitle>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600">Select a creation to load</p>
            <Button
              onClick={loadCreations}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 stroke-[1.5] ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>}

        <div className="overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {/* Show only two skeleton rows */}
              <CreationSkeleton />
              <CreationSkeleton />
            </div>
          ) : creations.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No saved creations found</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {creations.map((creation) => (
                <div
                  key={creation.id}
                  onClick={() => onLoad(creation)}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{creation.name}</h3>
                    <button
                      onClick={(e) => handleDelete(creation.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isDeleting === creation.id}
                      aria-label="Delete creation"
                    >
                      {isDeleting === creation.id ? (
                        <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                      ) : (
                        <Trash2 className="w-5 h-5 stroke-[1.5]" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Updated: {formatDate(creation.updatedAt)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {creation.bricks.length} {creation.bricks.length === 1 ? "brick" : "bricks"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
