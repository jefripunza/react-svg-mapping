import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DialogDirection =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const DialogHeaderContext = React.createContext<React.JSX.Element | null>(null);
const DialogFooterContext = React.createContext<React.JSX.Element | null>(null);
const DialogHeightContext = React.createContext<number>(500);
const DialogWidthContext = React.createContext<number>(500);
const DialogDirectionContext = React.createContext<DialogDirection>("center");
const DialogOverlayContext = React.createContext<boolean>(true);

interface DialogProps extends DialogPrimitive.DialogProps {
  header?: React.JSX.Element | null;
  footer?: React.JSX.Element | null;
  useOverlay?: boolean;
  direction?: DialogDirection;
  height?: number;
  width?: number;
}

const Dialog = ({
  onOpenChange,
  header = null,
  footer = null,
  useOverlay = true,
  direction = "center",
  height = 500,
  width = 500,
  children,
  ...props
}: DialogProps) => {
  return (
    <DialogHeaderContext.Provider value={header}>
      <DialogFooterContext.Provider value={footer}>
        <DialogHeightContext.Provider value={height}>
          <DialogWidthContext.Provider value={width}>
            <DialogOverlayContext.Provider value={useOverlay}>
              <DialogDirectionContext.Provider value={direction}>
                <DialogPrimitive.Root
                  onOpenChange={onOpenChange}
                  modal={true}
                  {...props}
                >
                  {children}
                </DialogPrimitive.Root>
              </DialogDirectionContext.Provider>
            </DialogOverlayContext.Provider>
          </DialogWidthContext.Provider>
        </DialogHeightContext.Provider>
      </DialogFooterContext.Provider>
    </DialogHeaderContext.Provider>
  );
};

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  hideX?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, hideX, ...props }, ref) => {
  // Get the values from context
  const header = React.useContext(DialogHeaderContext);
  const footer = React.useContext(DialogFooterContext);
  const useOverlay = React.useContext(DialogOverlayContext);
  const direction = React.useContext(DialogDirectionContext);
  const height = React.useContext(DialogHeightContext);
  const width = React.useContext(DialogWidthContext);

  // Create a wrapper to prevent event propagation
  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent click events from bubbling up to the dialog root
    e.stopPropagation();
  };

  // Function to get position styles based on direction
  const getPositionStyles = () => {
    switch (direction) {
      case "center":
        return "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]";
      case "top":
        return "left-[50%] top-[5%] translate-x-[-50%] translate-y-0";
      case "bottom":
        return "left-[50%] bottom-[5%] translate-x-[-50%] translate-y-0";
      case "left":
        return "left-[5%] top-[50%] translate-x-0 translate-y-[-50%]";
      case "right":
        return "right-[5%] top-[50%] translate-x-0 translate-y-[-50%]";
      case "top-left":
        return "left-[5%] top-[5%] translate-x-0 translate-y-0";
      case "top-right":
        return "right-[5%] top-[5%] translate-x-0 translate-y-0";
      case "bottom-left":
        return "left-[5%] bottom-[5%] translate-x-0 translate-y-0";
      case "bottom-right":
        return "right-[5%] bottom-[5%] translate-x-0 translate-y-0";
      default:
        return "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]";
    }
  };

  // Get animation styles based on direction
  const getAnimationStyles = () => {
    switch (direction) {
      case "top":
      case "top-left":
      case "top-right":
        return "data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-2";
      case "bottom":
      case "bottom-left":
      case "bottom-right":
        return "data-[state=closed]:slide-out-to-bottom-0 data-[state=open]:slide-in-from-bottom-2";
      case "left":
        return "data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-2";
      case "right":
        return "data-[state=closed]:slide-out-to-right-0 data-[state=open]:slide-in-from-right-2";
      default:
        return "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]";
    }
  };

  const positionStyles = getPositionStyles();
  const animationStyles = getAnimationStyles();

  // Create style object for dynamic height and width with responsive handling
  const sizeStyles = {
    height: height ? `min(${height}px, 90vh)` : undefined,
    width: width ? `min(${width}px, 90vw)` : undefined,
    maxWidth: width ? `min(${width}px, 90vw)` : undefined,
    maxHeight: height ? `min(${height}px, 90vh)` : undefined,
    overflow: 'auto',
  };

  return (
    <DialogPortal>
      {useOverlay && <DialogOverlay />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-9999 flex flex-col border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
          positionStyles,
          animationStyles,
          className
        )}
        style={sizeStyles}
        onPointerDownOutside={(e) => useOverlay && e.preventDefault()}
        onInteractOutside={(e) => useOverlay && e.preventDefault()}
        onClick={handleContentClick}
        onMouseDown={(e) => useOverlay && e.stopPropagation()}
        onPointerDown={(e) => useOverlay && e.stopPropagation()}
        {...props}
      >
        {!hideX && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
        
        {/* Header - Always at top */}
        {header && <div className="mb-4">{header}</div>}
        
        {/* Content - Fills available space */}
        <div className="flex-1 overflow-y-auto bg-white">
          {children}
        </div>
        
        {/* Footer - Always at bottom */}
        {footer && <div className="mt-4">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight mb-4",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
