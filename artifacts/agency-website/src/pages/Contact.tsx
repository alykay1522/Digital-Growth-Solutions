import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { useMeta } from "@/hooks/useMeta";

// Re-defining schema client-side for immediate feedback matching OpenAPI
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  useMeta({ title: "Contact Us", description: "Get in touch with Digital Growth Solutions Agency. Tell us about your project and we'll respond within 24 hours with a plan and a quote." });
  const { toast } = useToast();
  const { mutate: submitContact, isPending } = useSubmitContact();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormData) => {
    submitContact(
      { data }, 
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast({
            title: "Message sent!",
            description: "We'll get back to you within 24 hours.",
          });
          reset();
        },
        onError: (err) => {
          toast({
            title: "Something went wrong",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <AnimatedSection direction="right">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6">
              Let's build something <span className="text-gradient">amazing</span> together.
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Whether you need a new website, a custom web application, or help scaling your eCommerce store, our team is ready to help. Drop us a line and let's talk about your project.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-secondary">Email Us</h3>
                  <p className="text-muted-foreground">hello@digitalgrowthsolutionsagency.com</p>
                  <p className="text-sm text-muted-foreground mt-1">We respond to every enquiry within 24 hours.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection direction="left">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden">
              {isSuccess ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-secondary">Message Sent!</h3>
                  <p className="text-muted-foreground text-center max-w-sm mb-8">
                    Thank you for reaching out. One of our experts will get back to you shortly.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Send another message
                  </Button>
                </div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register("name")} placeholder="John Doe" className="h-12 bg-gray-50 focus-visible:ring-primary/20" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="john@example.com" className="h-12 bg-gray-50 focus-visible:ring-primary/20" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...register("company")} placeholder="Your Company Ltd" className="h-12 bg-gray-50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Needed</Label>
                    <select 
                      id="service" 
                      {...register("service")} 
                      className="flex h-12 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a service...</option>
                      <optgroup label="── Project Builds">
                        <option value="wordpress">WordPress Development</option>
                        <option value="ecommerce">eCommerce / Shopify</option>
                        <option value="mobile">Mobile-First Design</option>
                        <option value="custom">Custom Software / Web App</option>
                        <option value="plugin">Custom Plugin Development</option>
                      </optgroup>
                      <optgroup label="── Website Rescue (24–48 hr fix)">
                        <option value="rescue-down">WordPress Site Down</option>
                        <option value="rescue-checkout">WooCommerce Checkout Fix</option>
                        <option value="rescue-malware">Malware / Hack Removal</option>
                        <option value="rescue-plugin">Plugin / Theme Conflict</option>
                        <option value="rescue-speed">Site Speed Overhaul</option>
                        <option value="rescue-other">Other Emergency Fix</option>
                      </optgroup>
                      <optgroup label="── Monthly Care Plans">
                        <option value="care-basic">Care Basic ($99/mo)</option>
                        <option value="care-pro">Care Pro ($249/mo)</option>
                        <option value="care-elite">Care Elite ($399/mo)</option>
                      </optgroup>
                      <optgroup label="── AI Services">
                        <option value="ai-chatbot">AI Chatbot Installation</option>
                        <option value="ai-content">AI Content Automation</option>
                        <option value="ai-products">AI Product Description Generation</option>
                        <option value="ai-workflow">AI Workflow Automation</option>
                        <option value="ai-redesign">AI-Powered Redesign</option>
                      </optgroup>
                      <optgroup label="── Digital Products">
                        <option value="product-plugin">Micro-Plugin</option>
                        <option value="product-template">Website Starter Kit</option>
                        <option value="product-custom">Custom Script / Tool</option>
                      </optgroup>
                      <option value="other">Other / Not sure</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea 
                    id="message" 
                    {...register("message")} 
                    placeholder="Tell us about your project, timeline, and goals..." 
                    className="min-h-[150px] resize-y bg-gray-50 focus-visible:ring-primary/20" 
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all">
                  {isPending ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
