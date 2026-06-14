import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar for public page */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold tracking-widest text-primary">
            <Activity className="h-6 w-6 text-accent" />
            FITTRACK<span className="text-foreground">PRO</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-gym.jpg" 
            alt="Gym Workout" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">THE ULTIMATE FITNESS COCKPIT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 leading-tight">
              TRACK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">FITNESS JOURNEY</span><br />
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
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">ENGINEERED FOR <span className="text-accent">RESULTS</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to command your fitness lifestyle from one central hub.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/images/feature-running.jpg" alt="Running" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent p-6 flex flex-col justify-end">
                <Activity className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground">Detailed metrics on your heart rate, steps, and weekly progress.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/images/feature-food.jpg" alt="Healthy Food" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent p-6 flex flex-col justify-end">
                <Target className="h-8 w-8 text-accent mb-3" />
                <h3 className="text-2xl font-bold mb-2">Macro Targeting</h3>
                <p className="text-muted-foreground">Log meals and dial in your nutrition with exact protein, carb, and fat tracking.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/images/feature-yoga.jpg" alt="Yoga" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent p-6 flex flex-col justify-end">
                <Zap className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-2">Workout Programs</h3>
                <p className="text-muted-foreground">From HIIT to heavy lifting. Log sets, reps, and track volume over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
