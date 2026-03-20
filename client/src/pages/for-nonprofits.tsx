import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  ArrowRight,
  Heart,
  CreditCard,
  BarChart3,
  Clock,
  Shield,
  Users,
} from "lucide-react";

export default function ForNonprofits() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Accept Digital Donations the{" "}
                  <span className="text-primary">Easy Way</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  No more mailing checks. No technical expertise required. Get set up in
                  under 10 minutes and start receiving donations directly to your bank account.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/nonprofit/onboarding">
                    <Button size="lg" className="gap-2" data-testid="button-get-started">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="p-8">
                <CardContent className="p-0 space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      Built for nonprofits like yours
                    </h2>
                    <p className="text-muted-foreground">
                      Whether you're a small scholarship fund or a community
                      organization, we make digital giving accessible.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We handle the technology so you can focus on your mission.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <CreditCard className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Direct Bank Deposits
                  </h3>
                  <p className="text-muted-foreground">
                    Donations go straight to your bank account. No separate payment
                    account needed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <BarChart3 className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Simple Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Track donations, view donor information, and monitor payouts
                    in one easy-to-use dashboard.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fast Payouts</h3>
                  <p className="text-muted-foreground">
                    Receive funds within 2-3 business days. No waiting for checks
                    to clear.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Secure & Trusted</h3>
                  <p className="text-muted-foreground">
                    Built on Stripe, the same platform used by millions of
                    businesses worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Reach More Donors</h3>
                  <p className="text-muted-foreground">
                    Get discovered by donors looking to support causes like yours.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Heart className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    100% to Your Mission
                  </h3>
                  <p className="text-muted-foreground">
                    Every dollar donated goes directly to you. We don't take a cut.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Get Started in 4 Simple Steps
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Tell us about your organization
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your nonprofit's name, mission, and contact details.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Provide your tax information
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your EIN (tax ID) to verify your nonprofit status.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Connect your bank account
                  </h3>
                  <p className="text-muted-foreground">
                    Add your banking details so we can deposit donations directly.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Start receiving donations!
                  </h3>
                  <p className="text-muted-foreground">
                    Your profile goes live and donors can start supporting you immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/nonprofit/onboarding">
                <Button size="lg" className="gap-2">
                  Start Registration
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to modernize your fundraising?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join other nonprofits who have simplified their donation process and
              expanded their reach.
            </p>
            <Link href="/nonprofit/onboarding">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
