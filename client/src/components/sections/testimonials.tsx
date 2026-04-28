import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ShieldCheck, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import { TestimonialSubmissionForm } from "@/components/testimonial-submission-form";

interface Props {
  testimonials?: Testimonial[];
  isPreview?: boolean;
}

function getInitials(t: Testimonial) {
  const first = t.firstName.charAt(0).toUpperCase();
  const last = (t.lastInitial || "").charAt(0).toUpperCase();
  return last ? `${first}${last}` : first;
}

function formatAttribution(t: Testimonial) {
  const last = t.lastInitial?.trim();
  return last ? `${t.firstName} ${last.toUpperCase()}.` : t.firstName;
}

function formatDate(d: Date | string | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
      viewport={{ once: true }}
      data-testid={`testimonial-card-${item.id}`}
    >
      <Card className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-sage/10 h-full">
        <CardContent className="p-7 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sage/15 text-sage flex items-center justify-center font-semibold">
                {getInitials(item)}
              </div>
              <div>
                <div className="font-semibold text-charcoal leading-tight">
                  {formatAttribution(item)}
                </div>
                {item.activityRole && (
                  <div className="text-charcoal-light text-sm leading-tight">
                    {item.activityRole}
                  </div>
                )}
              </div>
            </div>
            <Quote className="w-6 h-6 text-sage/40 shrink-0" />
          </div>

          {item.rating ? (
            <div
              className="flex text-coral mb-3"
              aria-label={`${item.rating} out of 5 stars`}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (item.rating ?? 0) ? "fill-current" : "opacity-30"
                  }`}
                />
              ))}
            </div>
          ) : null}

          <p className="text-charcoal-light leading-relaxed flex-grow">
            {item.quote}
          </p>

          <div className="text-xs text-charcoal-light/70 mt-4">
            {formatDate(item.approvedAt ?? item.submittedAt)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Testimonials({ testimonials, isPreview }: Props) {
  const fromApi = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    enabled: !testimonials,
  });

  const items = testimonials ?? fromApi.data ?? [];
  const isLoading = !testimonials && fromApi.isLoading;

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-cream/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">
            In Their Own Words
          </h2>
          <p className="text-base md:text-xl text-charcoal-light max-w-2xl mx-auto">
            Real stories from people who've moved through pain and back to the
            things they love — shared with their permission.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="rounded-2xl shadow-md border border-sage/10 h-full">
                  <CardContent className="p-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-3 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-4/6" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <TestimonialCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-sm border border-sage/15 p-10">
            <Heart className="w-10 h-10 text-coral mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Be among the first to share your story
            </h3>
            <p className="text-charcoal-light mb-6">
              I'm just starting to collect patient stories here. If you've
              worked with me, I'd be honored to share your experience — with
              your permission.
            </p>
            <TestimonialSubmissionForm />
          </div>
        )}

        {/* Share Your Story CTA + disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-14"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-sage/20 shadow-sm p-6 md:p-7 flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal mb-1">
                Have a success story to share?
              </h3>
              <p className="text-charcoal-light text-sm">
                Your words may help someone else take the first step toward
                pain-free movement.
              </p>
            </div>
            {items.length > 0 ? <TestimonialSubmissionForm /> : null}
          </div>

          <p className="mt-5 text-xs text-charcoal-light/80 text-center max-w-2xl mx-auto flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage shrink-0" />
            Testimonials are shared with each patient's written permission.
            Individual results vary.
          </p>

          {isPreview && (
            <p className="mt-3 text-center text-xs text-coral font-semibold uppercase tracking-wide">
              Preview Mode — sample testimonials shown for design only
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
