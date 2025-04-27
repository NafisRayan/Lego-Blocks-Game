"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ClearModalProps {
  isOpen: boolean
  onClose: () => void
  onClear: () => void
}

export const ClearModal: React.FC<ClearModalProps> = ({ isOpen, onClose, onClear }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Clear Set</DialogTitle>
          <DialogDescription className="text-gray-700">
            Are you sure you want to clear the entire set? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose} variant="outline" className="rounded-full">
            Cancel
          </Button>
          <Button onClick={onClear} variant="destructive" className="rounded-full">
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
