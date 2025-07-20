import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dialogVariants = cva("", {
  variants: {
    maxWidth: {
      xs: "max-w-[400px]",
      sm: "max-w-[600px]",
      md: "max-w-[900px]",
      lg: "max-w-[1200px]",
      xl: "max-w-[1536px]",
      "2xl": "max-w-[1600px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    maxWidth: "md",
  },
});

interface SimpleDialogProps extends VariantProps<typeof dialogVariants> {
  open: boolean;
  setOpen: (open: boolean) => void;
  Trigger?: React.ForwardRefExoticComponent<any>;
  closeButton?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  loading?: boolean;
}

function SimpleDialog({
  open,
  setOpen,
  Trigger,
  closeButton,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  maxWidth,
}: SimpleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {Trigger && (
        <DialogTrigger asChild>
          <Trigger />
        </DialogTrigger>
      )}
      {open && (
        <>
          <DialogContent
            className={cn(dialogVariants({ maxWidth }), "w-full")}
            showCloseButton={showCloseButton}
          >
            {(title || description) && (
              <DialogHeader>
                {title && (
                  <DialogTitle className="flex items-center gap-2">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {children}
            {(footer || closeButton) && (
              <DialogFooter>
                <DialogClose asChild>{closeButton}</DialogClose>
                {footer}
              </DialogFooter>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}

export default SimpleDialog;
