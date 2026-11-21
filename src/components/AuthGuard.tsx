import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@/lib/router/compat";
import { Loader2 } from "lucide-react";
import { currentDataGateStatus } from "@/lib/runtime/dataGate";

interface AuthGuardProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

export default function AuthGuard({ children, requirePremium = false }: AuthGuardProps) {
  const { user, loading, isPremium } = useAuth();
  const isSyntheticMode = currentDataGateStatus.requestedMode === "synthetic";

  if (loading && !isSyntheticMode) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user && !isSyntheticMode) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePremium && !isPremium && !isSyntheticMode) {
    return <Navigate to="/planos" replace />;
  }

  return <>{children}</>;
}

