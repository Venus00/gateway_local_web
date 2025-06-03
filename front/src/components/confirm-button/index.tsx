import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CircleAlertIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface ConfirmButtonProps extends ButtonProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  toastMessage: string;
  action?: () => void | Promise<void>;
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

export function ConfirmButton({
  title = "Confirm",
  message = "This action is irreversible, are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  action = () => {},
  toastMessage,
  open: externalOpen,
  setOpen: setExternalOpen,
  ...props
}: ConfirmButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [disabled, setDisabled] = useState(true);
  const open = externalOpen ?? false;
  const setOpen = setExternalOpen ?? (() => {});

  const handleClose = () => setOpen(false);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (open) {
      console.log("open is", open);
      setDisabled(true);
      setCountdown(2);
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        setDisabled(false);
        clearInterval(interval);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log("deleting...");
      await action();
      handleClose();
      toast({
        title: "Delete",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button {...props} />
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle className="mb-4 flex items-center gap-2">
            <span>{title}</span>
            <CircleAlertIcon />
          </DialogTitle>
          <DialogDescription className="mt-4">{message}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 py-4"
        >
          <div className="mt-auto flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {cancelText}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex items-center gap-2"
              disabled={disabled}
            >
              {disabled ? `Wait ${countdown} seconds` : confirmText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
