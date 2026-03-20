import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, CheckCircle } from "lucide-react";
import type { Nonprofit } from "@shared/schema";

interface NonprofitCardProps {
  nonprofit: Nonprofit;
}

export function NonprofitCard({ nonprofit }: NonprofitCardProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Card
      className="overflow-visible hover-elevate active-elevate-2 transition-shadow duration-200 flex flex-col"
      data-testid={`card-nonprofit-${nonprofit.id}`}
    >
      <div className="aspect-video relative bg-muted overflow-hidden rounded-t-md">
        {nonprofit.coverImageUrl ? (
          <img
            src={nonprofit.coverImageUrl}
            alt={nonprofit.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Heart className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {nonprofit.isVerified && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur">
              <CheckCircle className="h-3 w-3 text-primary" />
              <span className="text-xs">Verified</span>
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold line-clamp-1">{nonprofit.name}</h3>
        </div>
        <Badge variant="outline" className="mb-3">
          {nonprofit.category}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {nonprofit.mission}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{nonprofit.donorCount || 0} donors</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{formatCurrency(nonprofit.totalRaised || 0)} raised</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/nonprofit/${nonprofit.slug}`} className="w-full">
          <Button className="w-full" data-testid={`button-donate-${nonprofit.id}`}>
            Donate Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
