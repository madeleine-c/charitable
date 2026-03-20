import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Heart, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Nonprofit } from "@shared/schema";

interface DonationDialogProps {
  nonprofit: Nonprofit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const presetAmounts = [25, 50, 100, 250, 500];

export function DonationDialog({ nonprofit, open, onOpenChange }: DonationDialogProps) {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const amount = customAmount ? parseInt(customAmount) : selectedAmount;

  const createCheckout = useMutation({
    mutationFn: async () => {
      if (!amount || amount < 1) {
        throw new Error("Please enter a valid donation amount");
      }
      const res = await apiRequest("POST", "/api/donations/checkout", {
        nonprofitId: nonprofit.id,
        amount: amount * 100,
        donorName: isAnonymous ? undefined : donorName,
        donorEmail,
        message,
        isAnonymous,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donate to {nonprofit.name}</DialogTitle>
          <DialogDescription>
            Your donation makes a real difference. 100% goes directly to this organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={selectedAmount === preset && !customAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset)}
                  data-testid={`button-amount-${preset}`}
                >
                  ${preset}
                </Button>
              ))}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Other"
                  className="pl-7"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  min={1}
                  data-testid="input-custom-amount"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="donor-email">Email (for receipt)</Label>
              <Input
                id="donor-email"
                type="email"
                placeholder="your@email.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                data-testid="input-donor-email"
              />
            </div>

            <div>
              <Label htmlFor="donor-name">Name (optional)</Label>
              <Input
                id="donor-name"
                placeholder="Your name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isAnonymous}
                data-testid="input-donor-name"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                data-testid="switch-anonymous"
              />
              <Label htmlFor="anonymous" className="text-sm">
                Donate anonymously
              </Label>
            </div>

            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                rows={3}
                data-testid="input-message"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => createCheckout.mutate()}
              disabled={!amount || amount < 1 || createCheckout.isPending}
              data-testid="button-complete-donation"
            >
              {createCheckout.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              {amount ? `Donate $${amount}` : "Enter Amount"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
