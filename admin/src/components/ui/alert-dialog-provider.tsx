import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AlertDialogVariant = "default" | "destructive";

export type AlertDialogOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: AlertDialogVariant;
};

export type ConfirmDialogOptions = AlertDialogOptions & {
  cancelLabel?: string;
};

type DialogMode = "alert" | "confirm";

type DialogConfig = (AlertDialogOptions | ConfirmDialogOptions) & {
  mode: DialogMode;
};

type AlertDialogContextValue = {
  /** Informational alert — single OK button */
  alert: (options: AlertDialogOptions) => Promise<void>;
  /** Confirmation — returns true if confirmed, false if cancelled */
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const closeWith = useCallback((value: boolean) => {
    setOpen(false);
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setConfig(null);
    resolve?.(value);
  }, []);

  const alert = useCallback((options: AlertDialogOptions) => {
    return new Promise<void>((resolve) => {
      resolveRef.current = () => {
        resolve();
        return true;
      };
      setConfig({ ...options, mode: "alert" });
      setOpen(true);
    });
  }, []);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setConfig({ ...options, mode: "confirm" });
      setOpen(true);
    });
  }, []);

  const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  const isConfirm = config?.mode === "confirm";
  const confirmLabel = config?.confirmLabel ?? (isConfirm ? "Confirm" : "OK");
  const cancelLabel =
    config && "cancelLabel" in config && config.cancelLabel
      ? config.cancelLabel
      : "Cancel";
  const variant = config?.variant ?? (isConfirm ? "destructive" : "default");

  return (
    <AlertDialogContext.Provider value={value}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeWith(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config?.title}</AlertDialogTitle>
            {config?.description && (
              <AlertDialogDescription>
                {config.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isConfirm && (
              <AlertDialogCancel onClick={() => closeWith(false)}>
                {cancelLabel}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              className={cn(
                variant === "destructive" &&
                  buttonVariants({ variant: "destructive" }),
              )}
              onClick={() => closeWith(true)}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

export function useAlertDialog() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error(
      "useAlertDialog must be used within AlertDialogProvider",
    );
  }
  return ctx;
}
