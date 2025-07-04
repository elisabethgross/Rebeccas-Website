import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export default function Testimonials() {
  // Fetch Google reviews from API
  const { data: googleReviews, isLoading, error } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Fallback testimonials if Google reviews are not available
  const testimonials = [
    {
      name: "Michael Chen",
      role: "Marathon Runner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "Dr. Mitchell didn't just fix my injury—she transformed how I move. I'm running pain-free for the first time in years and just completed my fastest marathon ever.",
      duration: "5 months of treatment"
    },
    {
      name: "Sarah Johnson",
      role: "Yoga Instructor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "The personalized attention and expertise Dr. Mitchell provided was life-changing. She understood my goals as a yoga instructor and helped me return to teaching stronger than ever.",
      duration: "3 months of treatment"
    },
    {
      name: "David Rodriguez",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "After years of chronic back pain from desk work, Dr. Mitchell's comprehensive approach gave me my life back. The investment in direct-pay care was worth every penny.",
      duration: "6 months of treatment"
    },
    {
      name: "Emma Thompson",
      role: "Tennis Player",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "Dr. Mitchell's expertise and individual attention helped me return to competitive tennis after a shoulder injury. Her holistic approach addresses the whole person, not just the injury.",
      duration: "4 months of treatment"
    },
    {
      name: "James Wilson",
      role: "Retiree",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "At 68, I thought my hiking days were over due to knee pain. Dr. Mitchell's personalized treatment plan got me back on the trails and feeling 20 years younger.",
      duration: "8 months of treatment"
    },
    {
      name: "Lisa Martinez",
      role: "Busy Mom",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      testimonial: "The convenience of home visits and Dr. Mitchell's understanding of my busy schedule made all the difference. I can now keep up with my kids pain-free.",
      duration: "5 months of treatment"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Life-Changing Results
          </h2>
          <p className="text-xl text-charcoal-light max-w-3xl mx-auto">
            Hear from clients who've returned to their favorite activities with renewed confidence and pain-free movement.
          </p>
        </motion.div>

        {/* Call to Action for Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
            <MessageSquare className="w-8 h-8 text-sage" />
            <div className="text-left">
              <h3 className="font-semibold text-charcoal mb-1">Have a success story to share?</h3>
              <p className="text-charcoal-light text-sm">Help others discover quality care</p>
            </div>
            <Button
              onClick={() => window.open("/api/leave-review", "_blank")}
              className="bg-coral text-white hover:bg-coral-dark rounded-full px-6 py-2 flex items-center gap-2"
            >
              Leave a Review
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Display Reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Show Google Reviews if available, otherwise show fallback testimonials */}
          {!isLoading && Array.isArray(googleReviews) && googleReviews.length > 0 ? (
            googleReviews.map((review: any, index: number) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="gradient-cream rounded-2xl shadow-lg h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center mb-6">
                      {review.reviewerProfilePhotoUrl ? (
                        <img
                          src={review.reviewerProfilePhotoUrl}
                          alt={`${review.reviewerName} profile photo`}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mr-4">
                          <span className="text-white font-semibold text-lg">
                            {review.reviewerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-charcoal">{review.reviewerName}</div>
                        <div className="text-charcoal-light text-sm">Google Review</div>
                      </div>
                    </div>
                    
                    <div className="flex text-coral mb-4">
                      {[...Array(parseInt(review.starRating))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    
                    {review.comment && (
                      <p className="text-charcoal-light mb-4 flex-grow">
                        "{review.comment}"
                      </p>
                    )}
                    
                    <div className="text-sage font-semibold text-sm">
                      {new Date(review.createTime).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="gradient-cream rounded-2xl shadow-lg h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name} testimonial photo`}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-charcoal">{testimonial.name}</div>
                      <div className="text-charcoal-light text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex text-coral mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-charcoal-light mb-4 flex-grow">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="text-sage font-semibold text-sm">
                    {testimonial.duration}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="gradient-cream rounded-2xl shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
