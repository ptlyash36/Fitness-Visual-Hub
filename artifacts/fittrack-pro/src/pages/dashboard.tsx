import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboardStats,
  useUpdateDashboardStats,
  useListMeasurements,
  getGetDashboardStatsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Flame,
  Droplets,
  Moon,
  Heart,
  Scale,
  Footprints,
  TrendingUp,
  Edit3,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  progress,
  color,
  target,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  unit: string;
  progress?: number;
  color: string;
  target?: string;
}) {
  return (
    <Card className="bg-card border-border relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-1 h-full ${color}`}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`p-2 rounded-lg ${color.replace("bg-", "bg-").replace("-500", "-500/10")}`}
          >
            <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
          </div>
          {target && (
            <span className="text-xs text-muted-foreground">Goal: {target}</span>
          )}
        </div>
        <div className="mb-1">
          <span className="text-2xl font-bold font-display">{value}</span>
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{label}</p>
        {progress !== undefined && (
          <Progress value={Math.min(progress, 100)} className="h-1.5" />
        )}
      </CardContent>
    </Card>
  );
}

function BMIGauge({ bmi }: { bmi: number }) {
  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (b < 25) return { label: "Normal", color: "text-green-400" };
    if (b < 30) return { label: "Overweight", color: "text-yellow-400" };
    return { label: "Obese", color: "text-red-400" };
  };
  const cat = getCategory(bmi);
  const pct = Math.min(((bmi - 10) / 30) * 100, 100);
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Scale className="h-4 w-4" /> BMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold font-display">{bmi.toFixed(1)}</span>
          <span className={`text-sm font-medium ${cat.color}`}>{cat.label}</span>
        </div>
        <div className="relative h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full mb-3">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-background shadow"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: measurements } = useListMeasurements();
  const updateStats = useUpdateDashboardStats();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    steps: "",
    caloriesBurned: "",
    waterIntakeMl: "",
    sleepHours: "",
    heartRate: "",
    weightKg: "",
    bmiValue: "",
  });

  const weightHistory = (measurements ?? []).slice(0, 7).reverse().map((m, i) => ({
    day: `Day ${i + 1}`,
    weight: m.weightKg,
  }));

  const handleSave = () => {
    const data: Record<string, number> = {};
    if (form.steps) data.steps = Number(form.steps);
    if (form.caloriesBurned) data.caloriesBurned = Number(form.caloriesBurned);
    if (form.waterIntakeMl) data.waterIntakeMl = Number(form.waterIntakeMl);
    if (form.sleepHours) data.sleepHours = Number(form.sleepHours);
    if (form.heartRate) data.heartRate = Number(form.heartRate);
    if (form.weightKg) data.weightKg = Number(form.weightKg);
    if (form.bmiValue) data.bmiValue = Number(form.bmiValue);
    updateStats.mutate(
      { data },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          setOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            DASHBOARD
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" /> Update Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Today's Stats</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {[
                { key: "steps", label: "Steps", placeholder: "8000" },
                { key: "caloriesBurned", label: "Calories Burned", placeholder: "500" },
                { key: "waterIntakeMl", label: "Water (ml)", placeholder: "2000" },
                { key: "sleepHours", label: "Sleep (hrs)", placeholder: "8" },
                { key: "heartRate", label: "Heart Rate (bpm)", placeholder: "72" },
                { key: "weightKg", label: "Weight (kg)", placeholder: "75" },
                { key: "bmiValue", label: "BMI", placeholder: "22.5" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Stats
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Footprints}
          label="Daily Steps"
          value={(stats?.steps ?? 0).toLocaleString()}
          unit="steps"
          progress={((stats?.steps ?? 0) / 10000) * 100}
          color="bg-blue-500"
          target="10,000"
        />
        <StatCard
          icon={Flame}
          label="Calories Burned"
          value={stats?.caloriesBurned ?? 0}
          unit="kcal"
          progress={((stats?.caloriesBurned ?? 0) / 600) * 100}
          color="bg-orange-500"
          target="600"
        />
        <StatCard
          icon={Droplets}
          label="Water Intake"
          value={((stats?.waterIntakeMl ?? 0) / 1000).toFixed(1)}
          unit="L"
          progress={((stats?.waterIntakeMl ?? 0) / 2500) * 100}
          color="bg-cyan-500"
          target="2.5L"
        />
        <StatCard
          icon={Moon}
          label="Sleep"
          value={stats?.sleepHours ?? 0}
          unit="hrs"
          progress={((stats?.sleepHours ?? 0) / 8) * 100}
          color="bg-purple-500"
          target="8 hrs"
        />
        <StatCard
          icon={Heart}
          label="Heart Rate"
          value={stats?.heartRate ?? 0}
          unit="bpm"
          color="bg-red-500"
        />
        <StatCard
          icon={Scale}
          label="Weight"
          value={stats?.weightKg ?? 0}
          unit="kg"
          color="bg-green-500"
        />
        <StatCard
          icon={Activity}
          label="Fitness Score"
          value={Math.min(Math.round(((stats?.steps ?? 0) / 10000) * 50 + ((stats?.sleepHours ?? 0) / 8) * 30 + 20), 100)}
          unit="/ 100"
          progress={Math.min(Math.round(((stats?.steps ?? 0) / 10000) * 50 + ((stats?.sleepHours ?? 0) / 8) * 30 + 20), 100)}
          color="bg-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Days"
          value={7}
          unit="/ 7 this week"
          progress={100}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* BMI */}
        <BMIGauge bmi={stats?.bmiValue ?? 0} />

        {/* Weight Progress Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Weight Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                Log measurements to see your weight trend
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals Progress */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Daily Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Steps", current: stats?.steps ?? 0, target: 10000, unit: "steps", color: "hsl(var(--primary))" },
            { label: "Water Intake", current: stats?.waterIntakeMl ?? 0, target: 2500, unit: "ml", color: "#22d3ee" },
            { label: "Sleep", current: (stats?.sleepHours ?? 0) * 60, target: 480, unit: "min", color: "#a855f7" },
            { label: "Calories Burned", current: stats?.caloriesBurned ?? 0, target: 600, unit: "kcal", color: "#f97316" },
          ].map(({ label, current, target, unit, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">
                  {label === "Sleep" ? `${stats?.sleepHours ?? 0}h` : current.toLocaleString()} / {label === "Sleep" ? "8h" : `${target.toLocaleString()} ${unit}`}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((current / target) * 100, 100)}%`,
                    background: color,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
