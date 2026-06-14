import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Smartphone,
  Star,
  Download,
  Bell,
  Wifi,
  Shield,
  Activity,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

const APP_FEATURES = [
  { icon: Activity, title: "Live Workout Tracking", desc: "Real-time rep counting and heart rate monitoring during your session" },
  { icon: Bell, title: "Smart Reminders", desc: "AI-powered notifications to keep you on track with workouts and meals" },
  { icon: Wifi, title: "Wearable Sync", desc: "Seamlessly connect with Apple Watch, Fitbit, Garmin, and more" },
  { icon: Shield, title: "Secure & Private", desc: "Your health data is encrypted and never shared without consent" },
  { icon: Zap, title: "Offline Mode", desc: "Log workouts without internet. Data syncs when you reconnect" },
  { icon: Target, title: "AI Recommendations", desc: "Personalized workout and nutrition plans powered by machine learning" },
];

const SCREENSHOTS = [
  {
    url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&q=80",
    label: "Dashboard",
  },
  {
    url: "https://images.unsplash.com/photo-1616279969856-759f316a5ac1?w=300&q=80",
    label: "Workout Tracker",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    label: "Nutrition Log",
  },
];

const STATS = [
  { value: "4.9", label: "App Store Rating", icon: Star },
  { value: "500K+", label: "Downloads", icon: Download },
  { value: "200+", label: "Exercises", icon: Activity },
  { value: "98%", label: "User Satisfaction", icon: TrendingUp },
];

export default function MobileApp() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">MOBILE APP</h1>
          <p className="text-muted-foreground mt-1">Your fitness cockpit in your pocket</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/20 p-8 md:p-12">
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=60"
            alt="Mobile app"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Now Available
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-tight">
              FitTrack Pro<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                On Your Phone
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
              Everything you love about FitTrack Pro — now available on iOS and Android. Track workouts, log meals, and crush your goals anywhere, anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 h-14 px-8">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on App Store
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-14 px-8">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.35.19.74.24 1.12.14L14.26 12 4.3.1C3.92 0 3.53.05 3.18.24 2.45.65 2 1.43 2 2.28v19.44c0 .85.45 1.63 1.18 2.04zM20.34 10.35L17.5 8.7l-3.76 3.3 3.76 3.3 2.87-1.65c.82-.47 1.32-1.32 1.32-2.14 0-.83-.5-1.68-1.35-2.16zM4.43.15l11.5 11.35L8.7 14.95 4.43.15zm0 23.7l4.27-14.8 7.23 3.45L4.43 23.85z" />
                </svg>
                Get on Google Play
              </Button>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <Smartphone className="h-40 w-40 text-primary/20" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ value, label, icon: Icon }) => (
          <Card key={label} className="bg-card border-border text-center">
            <CardContent className="p-5">
              <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold font-display text-primary">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Screenshots */}
      <div>
        <h2 className="text-xl font-bold font-display mb-6">APP SCREENSHOTS</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SCREENSHOTS.map((s) => (
            <div key={s.label} className="group relative rounded-2xl overflow-hidden border border-border aspect-[9/16] max-h-80">
              <img
                src={s.url}
                alt={s.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-background/80 text-foreground border-border backdrop-blur-sm">
                  {s.label}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold font-display mb-6">APP FEATURES</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {APP_FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8 border border-dashed border-primary/30 rounded-2xl bg-primary/5">
        <h3 className="text-2xl font-bold font-display mb-3">Ready to Start?</h3>
        <p className="text-muted-foreground mb-6">Join 500,000+ athletes already using FitTrack Pro on mobile</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" /> Download Free — iOS
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Free — Android
          </Button>
        </div>
      </div>
    </div>
  );
}
