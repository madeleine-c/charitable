import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NonprofitCard } from "@/components/nonprofit-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { 
  Heart, 
  Search, 
  CreditCard, 
  ArrowRight, 
  Users, 
  DollarSign, 
  Clock,
  Shield,
  Lock,
  CheckCircle
} from "lucide-react";
import type { Nonprofit } from "@shared/schema";

export default function Home() {
  const { data: nonprofits, isLoading } = useQuery<Nonprofit[]>({
    queryKey: ["/api/nonprofits"],
  });

  const featuredNonprofits = nonprofits?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Direct Giving Made{" "}
                <span className="text-primary">Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                Support the causes you care about with secure, transparent donations. 
                100% of your contribution goes directly to nonprofits — no middlemen, no hassle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/browse">
                  <Button size="lg" className="gap-2" data-testid="button-browse-nonprofits">
                    Browse Nonprofits
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/for-nonprofits">
                  <Button size="lg" variant="outline" data-testid="button-register-nonprofit">
                    Register Your Nonprofit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-stat-nonprofits">
                    {nonprofits?.length || 0}+
                  </p>
                  <p className="text-sm text-muted-foreground">Nonprofits Served</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-stat-donated">$0</p>
                  <p className="text-sm text-muted-foreground">Total Donated</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-stat-time">&lt; 2 min</p>
                  <p className="text-sm text-muted-foreground">Average Donation Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Supporting nonprofits has never been easier. Three simple steps to make a difference.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Find a Cause</h3>
                  <p className="text-muted-foreground">
                    Browse our directory of verified nonprofits and find organizations that align with your values.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. Donate Securely</h3>
                  <p className="text-muted-foreground">
                    Make a secure donation with any major credit card. Your payment is protected by Stripe.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. Make an Impact</h3>
                  <p className="text-muted-foreground">
                    100% of your donation goes directly to the nonprofit. Funds arrive in 2-3 business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {featuredNonprofits.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Featured Nonprofits</h2>
                  <p className="text-muted-foreground">
                    Discover organizations making a real difference.
                  </p>
                </div>
                <Link href="/browse" className="hidden sm:block">
                  <Button variant="outline" className="gap-2" data-testid="button-view-all">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted" />
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  featuredNonprofits.map((nonprofit) => (
                    <NonprofitCard key={nonprofit.id} nonprofit={nonprofit} />
                  ))
                )}
              </div>

              <div className="mt-8 sm:hidden text-center">
                <Link href="/browse">
                  <Button variant="outline" className="gap-2">
                    View All Nonprofits
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Are You a Nonprofit?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join our platform and start receiving digital donations today. 
                  No technical expertise required — we handle everything for you.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Simple onboarding in under 10 minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Funds deposited directly to your bank account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>No monthly fees or hidden charges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Easy-to-use dashboard to track donations</span>
                  </li>
                </ul>
                <Link href="/nonprofit/onboarding">
                  <Button size="lg" data-testid="button-get-started-nonprofit">
                    Get Started
                  </Button>
                </Link>
              </div>

              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="text-center space-y-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Ready to grow?</h3>
                      <p className="text-muted-foreground">
                        Reach more donors and receive contributions digitally.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Trusted & Secure</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-5 w-5" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span>Powered by Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5" />
                <span>Tax-Deductible Receipts</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
