import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/home";

const queryClient = new QueryClient();

// Placeholder pages
function Dashboard() { return <div>Dashboard</div>; }
function Workouts() { return <div>Workouts</div>; }
function Nutrition() { return <div>Nutrition</div>; }
function Goals() { return <div>Goals</div>; }
function Progress() { return <div>Progress</div>; }
function Community() { return <div>Community</div>; }
function Trainers() { return <div>Trainers</div>; }

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard"><AppLayout><Dashboard /></AppLayout></Route>
      <Route path="/workouts"><AppLayout><Workouts /></AppLayout></Route>
      <Route path="/nutrition"><AppLayout><Nutrition /></AppLayout></Route>
      <Route path="/goals"><AppLayout><Goals /></AppLayout></Route>
      <Route path="/progress"><AppLayout><Progress /></AppLayout></Route>
      <Route path="/community"><AppLayout><Community /></AppLayout></Route>
      <Route path="/trainers"><AppLayout><Trainers /></AppLayout></Route>
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
