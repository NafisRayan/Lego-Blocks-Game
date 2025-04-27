"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"

interface IntegrationCheckDialogProps {
  isOpen: boolean
  onClose: () => void
  actionType: "save" | "load"
}

export const IntegrationCheckDialog: React.FC<IntegrationCheckDialogProps> = ({ isOpen, onClose, actionType }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[28px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Enable Upstash Integration</DialogTitle>
          <DialogDescription>To {actionType} creations, enable the Upstash integration.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-semibold mb-2">Follow these steps:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click Project Settings</li>
            <li>Click the "+" button next to "Integrations"</li>
            <li>Click "Add" next to "Upstash for Redis"</li>
          </ol>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Link
            href="https://upstash.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">Powered by</span>
            <Image src="https://upstash.com/static/logo/logo-light.svg" alt="Upstash Logo" width={100} height={30} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
