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
import { 
  Activity, 
  Dumbbell, 
  Apple, 
  Target, 
  TrendingUp, 
  Users, 
  UserCircle,
  LogOut,
  Home
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();

  const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: Activity },
    { title: "Workouts", url: "/workouts", icon: Dumbbell },
    { title: "Nutrition", url: "/nutrition", icon: Apple },
    { title: "Goals", url: "/goals", icon: Target },
    { title: "Progress", url: "/progress", icon: TrendingUp },
    { title: "Community", url: "/community", icon: Users },
    { title: "Trainers", url: "/trainers", icon: UserCircle },
  ];

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
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title}>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
