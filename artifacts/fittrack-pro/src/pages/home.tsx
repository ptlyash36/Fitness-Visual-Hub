import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Activity,
  Zap,
  Target,
  Apple,
  TrendingUp,
  Users,
  UserCircle,
  Smartphone,
  Star,
  CheckCircle,
  Dumbbell,
  Heart,
  Trophy,
} from "lucide-react";

function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const frame = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.round(eased * target));
      if (pct < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration, active]);
  return count;
}

function StatCounter({ value, label, suffix = "", prefix = "" }: {
  value: number; label: string; suffix?: string; prefix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 2000, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Activity,
    title: "Smart Dashboard",
    desc: "Monitor steps, calories, heart rate, sleep, BMI, and water intake from one command center.",
    url: "/dashboard",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    icon: Dumbbell,
    title: "Workout Tracker",
    desc: "Log Cardio, Strength, Yoga, and HIIT workouts. Visualize your training with detailed charts.",
    url: "/workouts",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    icon: Apple,
    title: "Nutrition Planner",
    desc: "Track daily calories, log meals, and hit your protein, carb, and fat targets precisely.",
    url: "/nutrition",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
  },
  {
    icon: Target,
    title: "Goal Management",
    desc: "Set weight loss, muscle gain, and step goals. Earn badges when you crush milestones.",
    url: "/goals",
    img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    desc: "Weekly, monthly, and yearly charts. Track body measurements and fitness scores over time.",
    url: "/progress",
    img: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=80",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Join challenges, climb the leaderboard, and celebrate wins with fellow athletes.",
    url: "/community",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
  },
];

const SUCCESS_STORIES = [
  {
    name: "Marcus R.",
    result: "Lost 24kg in 6 months",
    quote: "FitTrack Pro completely changed how I approach fitness. The nutrition tracking is a game-changer.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80",
  },
  {
    name: "Sarah K.",
    result: "Ran first marathon",
    quote: "The weekly progress charts kept me motivated through every tough training run. I actually look forward to checking my stats.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=200&q=80",
  },
  {
    name: "James T.",
    result: "Gained 8kg muscle",
    quote: "The workout tracker and macro planner together are exactly what I needed for a lean bulk. Best fitness app I have ever used.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold tracking-widest text-primary">
            <Activity className="h-6 w-6 text-accent" />
            FITTRACK<span className="text-foreground">PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/workouts" className="hover:text-foreground transition-colors">Workouts</Link>
            <Link href="/trainers" className="hover:text-foreground transition-colors">Trainers</Link>
            <Link href="/community" className="hover:text-foreground transition-colors">Community</Link>
            <Link href="/mobile-app" className="hover:text-foreground transition-colors">Mobile App</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=80"
            alt="Gym Workout"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">THE ULTIMATE FITNESS COCKPIT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 leading-none">
              TRACK YOUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                FITNESS
              </span>
              <br />
              <span className="text-accent">JOURNEY,</span>
              <br />
              ACHIEVE YOUR GOALS
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Precision tracking for serious athletes. Monitor your workouts, dial in your nutrition, and visualize your progress with a platform built for performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Counter */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={500000} label="Active Users" suffix="+" />
            <StatCounter value={12000000} label="Workouts Logged" suffix="+" />
            <StatCounter value={98} label="User Satisfaction" suffix="%" />
            <StatCounter value={4} label="App Store Rating" prefix="" suffix=".9★" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              EVERYTHING YOU NEED TO{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">WIN</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              10 powerful sections. One platform. Built to get you results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.url}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-card h-72 cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0">
                      <img
                        src={feature.img}
                        alt={feature.title}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/40" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trainer Section Preview */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Expert Coaching</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                TRAIN WITH THE{" "}
                <span className="text-accent">BEST</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Work with certified personal trainers, nutrition coaches, and yoga instructors. Book one-on-one consultations or follow video workout sessions from the world's top coaches.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Certified personal trainers and coaches",
                  "Online consultation booking",
                  "HD video workout sessions",
                  "Personalized training programs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/trainers">
                <Button className="gap-2">
                  <UserCircle className="h-4 w-4" /> Meet Our Trainers
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"
                alt="Trainer coaching"
                className="rounded-2xl object-cover h-64 w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80"
                alt="Yoga session"
                className="rounded-2xl object-cover h-64 w-full mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              SUCCESS <span className="text-accent">STORIES</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real people. Real results. Powered by FitTrack Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SUCCESS_STORIES.map((story) => (
              <Card key={story.name} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={story.img}
                      alt={story.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <div className="font-bold">{story.name}</div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                        {story.result}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Mobile App</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                TAKE IT{" "}
                <span className="text-primary">EVERYWHERE</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The full FitTrack Pro experience on iOS and Android. Offline mode, wearable sync, push notifications, and AI-powered recommendations in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/mobile-app">
                  <Button className="gap-2">
                    <Smartphone className="h-4 w-4" /> Download for iOS
                  </Button>
                </Link>
                <Link href="/mobile-app">
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="h-4 w-4" /> Download for Android
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                alt="Mobile fitness app"
                className="rounded-2xl object-cover h-72 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              POWERED BY <span className="text-primary">AI</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Smarter recommendations. Better results. Faster progress.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "AI Workout Plans",
                desc: "Personalized training programs generated from your fitness level, goals, and available equipment.",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
              },
              {
                icon: Heart,
                title: "Smart Nutrition",
                desc: "AI analyzes your macros and suggests meal adjustments to hit your body composition goals.",
                color: "text-red-400",
                bg: "bg-red-500/10",
              },
              {
                icon: Trophy,
                title: "Adaptive Goals",
                desc: "Goals that automatically adjust based on your weekly performance and progress trends.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <Card key={title} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-xl ${bg} w-fit mb-4`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
            START YOUR TRANSFORMATION <span className="text-accent">TODAY</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Join 500,000 athletes who have already taken control of their fitness. Free to start. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg font-bold gap-2">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mobile-app">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold gap-2">
                <Smartphone className="h-5 w-5" /> Download the App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-display text-lg font-bold tracking-widest text-primary">
              <Activity className="h-5 w-5 text-accent" />
              FITTRACK<span className="text-foreground">PRO</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/workouts" className="hover:text-foreground transition-colors">Workouts</Link>
              <Link href="/nutrition" className="hover:text-foreground transition-colors">Nutrition</Link>
              <Link href="/community" className="hover:text-foreground transition-colors">Community</Link>
              <Link href="/trainers" className="hover:text-foreground transition-colors">Trainers</Link>
              <Link href="/mobile-app" className="hover:text-foreground transition-colors">Mobile App</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              2026 FitTrack Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
