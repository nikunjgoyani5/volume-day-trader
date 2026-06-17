import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardHeaderActionsContextValue = {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
};

const DashboardHeaderActionsContext =
  createContext<DashboardHeaderActionsContextValue | null>(null);

export function DashboardHeaderActionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [actions, setActions] = useState<ReactNode>(null);
  const value = useMemo(() => ({ actions, setActions }), [actions]);

  return (
    <DashboardHeaderActionsContext.Provider value={value}>
      {children}
    </DashboardHeaderActionsContext.Provider>
  );
}

export function useDashboardHeaderActions() {
  const ctx = useContext(DashboardHeaderActionsContext);
  if (!ctx) {
    throw new Error(
      "useDashboardHeaderActions must be used within DashboardHeaderActionsProvider",
    );
  }
  return ctx;
}
