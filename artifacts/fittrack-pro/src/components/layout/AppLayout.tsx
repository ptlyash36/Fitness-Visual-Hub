import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Dumbbell,
  Apple,
  Target,
  TrendingUp,
  Users,
  UserCircle,
  Home,
  Smartphone,
  HeadphonesIcon,
  Sun,
  Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: Activity },
  { title: "Workouts", url: "/workouts", icon: Dumbbell },
  { title: "Nutrition", url: "/nutrition", icon: Apple },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Community", url: "/community", icon: Users },
  { title: "Trainers", url: "/trainers", icon: UserCircle },
  { title: "Mobile App", url: "/mobile-app", icon: Smartphone },
  { title: "Contact", url: "/contact", icon: HeadphonesIcon },
];

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !dark);
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((d) => !d)}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2 font-display text-xl font-bold tracking-widest text-primary">
          <Activity className="h-6 w-6 text-accent" />
          FITTRACK<span className="text-foreground">PRO</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">v2.0 — Dark Mode</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full bg-background min-h-screen">
        <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-bold tracking-widest text-primary">
            <Activity className="h-5 w-5 text-accent" />
            FITTRACK<span className="text-foreground">PRO</span>
          </div>
          <SidebarTrigger />
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
