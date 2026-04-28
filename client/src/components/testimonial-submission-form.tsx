import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { submitTestimonialSchema, type SubmitTestimonialInput } from "@shared/schema";
import { Heart, Star } from "lucide-react";

interface Props {
  trigger?: React.ReactNode;
}

export function TestimonialSubmissionForm({ trigger }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<SubmitTestimonialInput>({
    resolver: zodResolver(submitTestimonialSchema),
    defaultValues: {
      firstName: "",
      lastInitial: "",
      activityRole: "",
      quote: "",
      rating: undefined,
      consentGiven: false as unknown as true,
    },
  });

  const rating = form.watch("rating");

  const mutation = useMutation({
    mutationFn: async (data: SubmitTestimonialInput) => {
      const payload = {
        ...data,
        lastInitial: data.lastInitial?.trim() || undefined,
        activityRole: data.activityRole?.trim() || undefined,
        rating: data.rating ?? undefined,
      };
      const res = await apiRequest("POST", "/api/testimonials", payload);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for sharing!",
        description:
          "Your testimonial will appear once Dr. Kleiner reviews it.",
      });
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: (err: any) => {
      toast({
        title: "Couldn't submit your story",
        description:
          err?.message ||
          "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubmitTestimonialInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            className="bg-coral text-white hover:bg-coral/90 rounded-full px-6"
            data-testid="button-open-share-story"
          >
            <Heart className="w-4 h-4 mr-2" />
            Share Your Story
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Story</DialogTitle>
          <DialogDescription>
            Your words help others find compassionate care. Dr. Kleiner will
            review your testimonial before it appears on the site.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="form-share-story"
          >
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} data-testid="input-first-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastInitial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last initial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="D"
                        maxLength={2}
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-last-initial"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activityRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity or role (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Marathon Runner, Yoga Teacher, Retired Hiker"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-activity-role"
                    />
                  </FormControl>
                  <FormDescription>
                    Helps readers see who's behind the words.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Share your experience working with Dr. Kleiner…"
                      {...field}
                      data-testid="input-quote"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (optional)</FormLabel>
                  <FormControl>
                    <div
                      className="flex items-center gap-1"
                      role="radiogroup"
                      aria-label="Star rating"
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (rating ?? 0) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              field.onChange(rating === star ? undefined : star)
                            }
                            className="p-1"
                            aria-label={`${star} star${star === 1 ? "" : "s"}`}
                            data-testid={`button-rating-${star}`}
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                active
                                  ? "fill-coral text-coral"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                      {rating ? (
                        <button
                          type="button"
                          onClick={() => field.onChange(undefined)}
                          className="ml-2 text-xs text-charcoal-light hover:text-charcoal underline"
                        >
                          clear
                        </button>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consentGiven"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-md border border-sage/30 bg-sage/5 p-3">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      className="mt-1"
                      data-testid="checkbox-consent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-tight">
                    <FormLabel className="text-sm font-medium text-charcoal">
                      I authorize Dr. Rebecca Kleiner, PT to publish this
                      testimonial on her website.
                    </FormLabel>
                    <FormDescription className="text-xs">
                      You can ask to have it removed at any time. No medical or
                      treatment details should be included unless you want them
                      to be.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-sage text-white hover:bg-sage-dark"
                data-testid="button-submit-story"
              >
                {mutation.isPending ? "Sending…" : "Send for Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
