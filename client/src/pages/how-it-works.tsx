import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  CreditCard,
  Heart,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Lock,
  Building,
  DollarSign,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How Charitable Works
              </h1>
              <p className="text-lg text-muted-foreground">
                We've simplified online giving to make it easy for donors to support
                causes they care about, and for nonprofits to receive funds directly.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">For Donors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Make a difference in just three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Find a Cause</h3>
                  <p className="text-muted-foreground">
                    Browse our directory of verified nonprofits. Filter by category
                    to find organizations that match your values.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Donate Securely</h3>
                  <p className="text-muted-foreground">
                    Choose your donation amount and complete your gift using Stripe's
                    secure payment processing.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Make an Impact</h3>
                  <p className="text-muted-foreground">
                    100% of your donation goes directly to the nonprofit. Receive a
                    tax receipt via email.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/browse">
                <Button size="lg" className="gap-2">
                  Start Browsing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">For Nonprofits</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get set up in minutes and start receiving digital donations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Register</h3>
                  <p className="text-muted-foreground">
                    Complete our simple onboarding form with your organization's
                    details and banking information.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Receive Donations</h3>
                  <p className="text-muted-foreground">
                    Your profile goes live immediately. Donors can find you and
                    start contributing right away.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Paid</h3>
                  <p className="text-muted-foreground">
                    Funds are deposited directly to your bank account. Track
                    everything in your dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/nonprofit/onboarding">
                <Button size="lg" className="gap-2">
                  Register Your Nonprofit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Charitable?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">100% Goes to Charity</h3>
                  <p className="text-sm text-muted-foreground">
                    Every dollar you donate goes directly to the nonprofit.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fast Payouts</h3>
                  <p className="text-sm text-muted-foreground">
                    Nonprofits receive funds within 2-3 business days.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Verified Nonprofits</h3>
                  <p className="text-sm text-muted-foreground">
                    All organizations are vetted for legitimacy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Protected by Stripe's industry-leading security.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
