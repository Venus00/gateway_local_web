import type React from "react"
import { Dialog as ShadcnDialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type CustomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onClose?: () => void
}

export function CustomDialog({ open, onOpenChange, title, children, onClose }: CustomDialogProps) {
  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
        <DialogFooter className="mt-6">
          {/* <Button
            variant="outline"
            onClick={() => {
              onClose?.()
              onOpenChange(false)
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Close
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  )
}
