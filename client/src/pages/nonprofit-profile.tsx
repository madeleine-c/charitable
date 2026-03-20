import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DonationDialog } from "@/components/donation-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Users,
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  Lock,
  Share2,
  ExternalLink,
} from "lucide-react";
import type { Nonprofit, Donation, Post } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export default function NonprofitProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);

  const { data: nonprofit, isLoading } = useQuery<Nonprofit>({
    queryKey: ["/api/nonprofits", slug],
  });

  const { data: donations } = useQuery<Donation[]>({
    queryKey: ["/api/nonprofits", slug, "donations"],
    enabled: !!nonprofit,
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/nonprofits", nonprofit?.id, "posts"],
    enabled: !!nonprofit?.id,
  });

  const recentDonations = donations?.slice(0, 5) || [];

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="h-64 bg-muted animate-pulse" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mb-2" />
            <Skeleton className="h-4 w-2/3 max-w-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!nonprofit) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Nonprofit Not Found</h1>
            <p className="text-muted-foreground">
              The nonprofit you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="relative h-64 md:h-80 bg-muted overflow-hidden">
          {nonprofit.coverImageUrl ? (
            <img
              src={nonprofit.coverImageUrl}
              alt={nonprofit.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Heart className="h-24 w-24 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-md bg-background border-4 border-background shadow-lg overflow-hidden">
                {nonprofit.logoUrl ? (
                  <img
                    src={nonprofit.logoUrl}
                    alt={nonprofit.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart className="h-12 w-12 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold" data-testid="text-nonprofit-name">
                    {nonprofit.name}
                  </h1>
                  {nonprofit.isVerified && (
                    <Badge className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="mt-2">
                  {nonprofit.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-mission">
                  {nonprofit.mission}
                </p>
              </section>

              {nonprofit.description && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">About Us</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {nonprofit.description}
                  </p>
                </section>
              )}

              {posts && posts.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Updates & Fundraisers</h2>
                  <div className="space-y-4">
                    {posts.map((post) => {
                      const progress = post.goalAmount
                        ? Math.min(((post.raisedAmount || 0) / post.goalAmount) * 100, 100)
                        : 0;
                      return (
                        <Card key={post.id} data-testid={`card-post-${post.id}`}>
                          {post.imageUrl && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-semibold" data-testid={`text-post-title-${post.id}`}>
                                {post.title}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {post.content}
                            </p>
                            {post.goalAmount && post.goalAmount > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">
                                      {formatCurrency(post.raisedAmount || 0)}
                                    </span>
                                    <span className="text-muted-foreground">
                                      of {formatCurrency(post.goalAmount)}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likeCount || 0} likes
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {post.donorCount || 0} donors
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-xl font-semibold mb-4">Impact</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold" data-testid="text-total-raised">
                          {formatCurrency(nonprofit.totalRaised || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Raised</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold" data-testid="text-donor-count">
                          {nonprofit.donorCount || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Donors</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {recentDonations.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Recent Supporters</h2>
                  <div className="space-y-3">
                    {recentDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {donation.isAnonymous
                                ? "Anonymous"
                                : donation.donorName || "A generous donor"}
                            </p>
                            {donation.message && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                "{donation.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(donation.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(donation.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => setDonationDialogOpen(true)}
                    data-testid="button-donate"
                  >
                    <Heart className="h-4 w-4" />
                    Donate Now
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>100% goes to this nonprofit</span>
                  </div>

                  <hr />

                  <div className="space-y-4 text-sm">
                    {nonprofit.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {nonprofit.address}
                          {nonprofit.city && `, ${nonprofit.city}`}
                          {nonprofit.state && `, ${nonprofit.state}`}
                          {nonprofit.zipCode && ` ${nonprofit.zipCode}`}
                        </span>
                      </div>
                    )}
                    {nonprofit.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={nonprofit.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                          data-testid="link-website"
                        >
                          Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {nonprofit.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`mailto:${nonprofit.email}`}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="link-email"
                        >
                          {nonprofit.email}
                        </a>
                      </div>
                    )}
                    {nonprofit.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`tel:${nonprofit.phone}`}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="link-phone"
                        >
                          {nonprofit.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <hr />

                  <Button variant="outline" className="w-full gap-2" data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <DonationDialog
        nonprofit={nonprofit}
        open={donationDialogOpen}
        onOpenChange={setDonationDialogOpen}
      />
    </div>
  );
}
