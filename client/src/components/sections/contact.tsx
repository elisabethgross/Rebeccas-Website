import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactSubmissionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      howDidYouHear: "",
      activities: "",
      contactMethod: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "Dr. Kleiner will contact you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: any) => {
    contactMutation.mutate(data);
  };

  const expectations = [
    "Initial phone consultation to discuss your goals",
    "Comprehensive 60-minute evaluation session",
    "Personalized treatment plan presentation",
    "Flexible scheduling to fit your lifestyle"
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 md:mb-6">
            How to Contact Me
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed px-2">
            Ready to start your journey to better movement and pain-free living? I'm here to help you take the first step.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 md:mb-6">
              Ready to Transform Your Movement?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-charcoal-light mb-6 md:mb-8 leading-relaxed">
              Take the first step toward pain-free living. Schedule your comprehensive consultation and discover how personalized care can get you back to the activities you love.
            </p>
            
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm md:text-base">Call or Text</div>
                  <div className="text-charcoal-light text-sm md:text-base">646-600-8599</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="break-all">
                  <div className="font-semibold text-charcoal text-sm md:text-base">Email</div>
                  <div className="text-charcoal-light text-sm md:text-base">kleinerDPT@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm md:text-base">Location</div>
                  <div className="text-charcoal-light text-sm md:text-base">
                    New York, NY
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white rounded-xl md:rounded-2xl shadow-lg">
              <CardContent className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-3 md:mb-4">What to Expect</h3>
                <ul className="space-y-2 md:space-y-3 text-charcoal-light">
                  {expectations.map((expectation, index) => (
                    <li key={index} className="flex items-start space-x-2 md:space-x-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-coral mt-0.5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{expectation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white rounded-xl md:rounded-2xl shadow-2xl">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-charcoal mb-4 md:mb-6">
                  Schedule Your Consultation
                </h3>
                
                {isSubmitted ? (
                  <div className="text-center py-6 md:py-8">
                    <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-sage mx-auto mb-3 md:mb-4" />
                    <h4 className="text-lg md:text-xl font-semibold text-charcoal mb-2">
                      Thank you for your message!
                    </h4>
                    <p className="text-sm md:text-base text-charcoal-light">
                      Dr. Kleiner will contact you within 24 hours to schedule your consultation.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-charcoal font-medium">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  className="border-gray-300 focus:border-sage focus:ring-sage"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-charcoal font-medium">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  className="border-gray-300 focus:border-sage focus:ring-sage"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="border-gray-300 focus:border-sage focus:ring-sage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="border-gray-300 focus:border-sage focus:ring-sage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="howDidYouHear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">How did you hear about us?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-sage focus:ring-sage">
                                  <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="referral">Referral from friend/family</SelectItem>
                                <SelectItem value="google">Google search</SelectItem>
                                <SelectItem value="social">Social media</SelectItem>
                                <SelectItem value="doctor">Doctor referral</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="activities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">What activities do you want to return to?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell me about your goals and what you'd like to achieve..."
                                className="border-gray-300 focus:border-sage focus:ring-sage resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">Preferred Contact Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="phone" id="phone" />
                                  <Label htmlFor="phone" className="text-charcoal">Phone</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="email" id="email" />
                                  <Label htmlFor="email" className="text-charcoal">Email</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="text" id="text" />
                                  <Label htmlFor="text" className="text-charcoal">Text</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full bg-sage text-white hover:bg-sage-dark rounded-xl py-3 md:py-4 font-semibold text-base md:text-lg"
                        data-testid="button-submit-contact"
                      >
                        {contactMutation.isPending ? "Sending..." : "Schedule My Consultation"}
                      </Button>
                      
                      <p className="text-xs sm:text-sm text-charcoal-light text-center">
                        By submitting this form, you agree to receive communication from Dr. Kleiner's office regarding your appointment and treatment.
                      </p>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
