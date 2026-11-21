import { Link } from "@/lib/router/compat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

type Cta = { label: string; to: string; variant?: "default" | "outline" | "secondary" };

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  hints?: string[];
  primary?: Cta;
  secondary?: Cta;
};

export function EmptyState({ icon: Icon, title, description, hints, primary, secondary }: Props) {
  return (
    <Card className="border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardContent className="py-10 px-6 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 grid place-items-center">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-1 max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {hints && hints.length > 0 && (
          <ul className="text-xs text-muted-foreground max-w-md mx-auto space-y-1">
            {hints.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-left">
                <span className="text-primary mt-0.5">›</span><span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        {(primary || secondary) && (
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {primary && (
              <Button asChild>
                <Link to={primary.to}>{primary.label}<ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            )}
            {secondary && (
              <Button asChild variant={secondary.variant ?? "outline"}>
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
