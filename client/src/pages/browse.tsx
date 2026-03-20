import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NonprofitCard } from "@/components/nonprofit-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Heart } from "lucide-react";
import type { Nonprofit } from "@shared/schema";
import { nonprofitCategories } from "@shared/schema";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: nonprofits, isLoading } = useQuery<Nonprofit[]>({
    queryKey: ["/api/nonprofits"],
  });

  const filteredNonprofits = nonprofits?.filter((nonprofit) => {
    const matchesSearch =
      !searchQuery ||
      nonprofit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nonprofit.mission.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      !selectedCategory || nonprofit.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Browse Nonprofits
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover amazing organizations making a difference in communities around the world.
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search nonprofits by name or mission..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="button-filter-all"
              >
                All
              </Button>
              {nonprofitCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                      <div className="h-10 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNonprofits.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNonprofits.map((nonprofit) => (
                  <NonprofitCard key={nonprofit.id} nonprofit={nonprofit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No nonprofits found</h2>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search or filter criteria."
                    : "Be the first to register your nonprofit!"}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {filteredNonprofits.length > 0 && (
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Showing {filteredNonprofits.length} nonprofit{filteredNonprofits.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
