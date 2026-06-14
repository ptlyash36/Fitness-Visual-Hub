import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  HelpCircle,
} from "lucide-react";

const FAQS = [
  {
    q: "How do I connect my fitness wearable?",
    a: "Go to Settings > Devices in the app or web dashboard. We support Apple Watch, Fitbit, Garmin, Polar, and most Bluetooth heart rate monitors. Follow the on-screen pairing instructions for your device.",
  },
  {
    q: "Can I export my fitness data?",
    a: "Yes! You can export all your data as CSV or PDF from the Progress section. Go to Progress > Export Data and choose your date range and format.",
  },
  {
    q: "Is my health data secure?",
    a: "Absolutely. All data is encrypted end-to-end using AES-256. We are HIPAA compliant and never sell your personal data to third parties. You own your data and can delete it at any time.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from Settings > Subscription. Your access continues until the end of your billing period and you will not be charged again.",
  },
  {
    q: "Does FitTrack Pro work offline?",
    a: "The mobile app fully supports offline mode. You can log workouts and meals without internet. Everything syncs automatically when you reconnect.",
  },
  {
    q: "How does the AI fitness recommendation work?",
    a: "Our AI analyzes your workout history, nutrition logs, sleep data, and goals to generate personalized recommendations. The more data you provide, the smarter and more accurate the suggestions become.",
  },
  {
    q: "Can I share my progress with my trainer?",
    a: "Yes! Use the Share feature in the Progress section to generate a shareable link or PDF report. You can also grant your trainer direct access through the Trainers section.",
  },
  {
    q: "How do I reset my password?",
    a: 'Click "Forgot Password" on the login page. We will send a secure reset link to your registered email address. The link expires after 24 hours for security.',
  },
];

const SOCIAL_LINKS = [
  { icon: Twitter, label: "Twitter / X", handle: "@FitTrackPro", color: "text-sky-400" },
  { icon: Instagram, label: "Instagram", handle: "@fittrackpro", color: "text-pink-400" },
  { icon: Youtube, label: "YouTube", handle: "FitTrack Pro", color: "text-red-400" },
  { icon: Facebook, label: "Facebook", handle: "FitTrack Pro Official", color: "text-blue-400" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [chatOpen, setChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">CONTACT & SUPPORT</h1>
        <p className="text-muted-foreground mt-1">We are here to help you succeed</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Mail,
            label: "Email Support",
            detail: "support@fittrackpro.com",
            sub: "Response within 24 hours",
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            icon: MessageCircle,
            label: "Live Chat",
            detail: "Chat with our team",
            sub: "Mon-Fri, 9am-6pm EST",
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            icon: Phone,
            label: "Phone Support",
            detail: "+1 (800) 348-7722",
            sub: "Premium members only",
            color: "text-orange-400",
            bg: "bg-orange-500/10",
          },
        ].map(({ icon: Icon, label, detail, sub, color, bg }) => (
          <Card key={label} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`p-3 rounded-xl ${bg} shrink-0`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <div className="font-bold mb-0.5">{label}</div>
                <div className={`text-sm font-medium ${color}`}>{detail}</div>
                <div className="text-xs text-muted-foreground mt-1">{sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" /> Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="py-8 text-center">
                <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="John Smith"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Subject</Label>
                  <Input
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Message *</Label>
                  <Textarea
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Social Media + Live Chat */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, handle, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className={`text-xs ${color}`}>{handle}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Our Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary/30 border border-border p-4">
                <p className="font-medium mb-1">FitTrack Pro HQ</p>
                <p className="text-sm text-muted-foreground">
                  123 Fitness Boulevard<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
                <Badge variant="outline" className="mt-3 text-xs">
                  Open Mon-Fri, 9am-5pm PST
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat Widget */}
          <div
            className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 cursor-pointer hover:border-green-500/50 transition-colors"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <MessageCircle className="h-6 w-6 text-green-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-sm">Live Chat Support</div>
                <div className="text-xs text-green-400">3 agents online now</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Average wait time: &lt; 2 minutes. Click to start chatting.
            </p>
            {chatOpen && (
              <div className="mt-4 p-3 rounded-lg bg-background border border-border text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Support Agent</p>
                Hi there! Welcome to FitTrack Pro support. How can I help you today?
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold font-display">FREQUENTLY ASKED QUESTIONS</h2>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline hover:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
