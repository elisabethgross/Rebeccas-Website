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
    mutationFn: async (data: typeof form.getValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "Dr. Mitchell will contact you within 24 hours.",
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

  const onSubmit = (data: typeof form.getValues) => {
    contactMutation.mutate(data);
  };

  const expectations = [
    "Initial phone consultation to discuss your goals",
    "Comprehensive 90-minute evaluation session",
    "Personalized treatment plan presentation",
    "Flexible scheduling to fit your lifestyle"
  ];

  return (
    <section id="contact" className="py-20 gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Ready to Transform Your Movement?
            </h2>
            <p className="text-xl text-charcoal-light mb-8 leading-relaxed">
              Take the first step toward pain-free living. Schedule your comprehensive consultation and discover how personalized care can get you back to the activities you love.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
                  <Phone className="text-white w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal">Call or Text</div>
                  <div className="text-charcoal-light">(555) 123-4567</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
                  <Mail className="text-white w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal">Email</div>
                  <div className="text-charcoal-light">sarah@mitchellpt.com</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
                  <MapPin className="text-white w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal">Location</div>
                  <div className="text-charcoal-light">
                    Downtown Medical Center<br />
                    123 Health Way, Suite 200<br />
                    City, State 12345
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-charcoal mb-4">What to Expect</h3>
                <ul className="space-y-3 text-charcoal-light">
                  {expectations.map((expectation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                      <span>{expectation}</span>
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
            <Card className="bg-white rounded-2xl shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-charcoal mb-6">
                  Schedule Your Consultation
                </h3>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-charcoal mb-2">
                      Thank you for your message!
                    </h4>
                    <p className="text-charcoal-light">
                      Dr. Mitchell will contact you within 24 hours to schedule your consultation.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="w-full bg-sage text-white hover:bg-sage-dark rounded-xl py-4 font-semibold text-lg"
                      >
                        {contactMutation.isPending ? "Sending..." : "Schedule My Consultation"}
                      </Button>
                      
                      <p className="text-sm text-charcoal-light text-center">
                        By submitting this form, you agree to receive communication from Dr. Mitchell's office regarding your appointment and treatment.
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
