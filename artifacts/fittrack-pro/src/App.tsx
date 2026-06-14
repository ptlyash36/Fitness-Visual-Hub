import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Nutrition from "@/pages/nutrition";
import Goals from "@/pages/goals";
import Progress from "@/pages/progress";
import Community from "@/pages/community";
import Trainers from "@/pages/trainers";
import MobileApp from "@/pages/mobile-app";
import Contact from "@/pages/contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <AppLayout><Dashboard /></AppLayout>
      </Route>
      <Route path="/workouts">
        <AppLayout><Workouts /></AppLayout>
      </Route>
      <Route path="/nutrition">
        <AppLayout><Nutrition /></AppLayout>
      </Route>
      <Route path="/goals">
        <AppLayout><Goals /></AppLayout>
      </Route>
      <Route path="/progress">
        <AppLayout><Progress /></AppLayout>
      </Route>
      <Route path="/community">
        <AppLayout><Community /></AppLayout>
      </Route>
      <Route path="/trainers">
        <AppLayout><Trainers /></AppLayout>
      </Route>
      <Route path="/mobile-app">
        <AppLayout><MobileApp /></AppLayout>
      </Route>
      <Route path="/contact">
        <AppLayout><Contact /></AppLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
