import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWeeklyProgress,
  useListMeasurements,
  useCreateMeasurement,
  getListMeasurementsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Plus, TrendingUp, Activity, Scale, Ruler } from "lucide-react";

export default function Progress() {
  const { data: weekly, isLoading: weeklyLoading } = useGetWeeklyProgress();
  const { data: measurements, isLoading: measLoading } = useListMeasurements();
  const createMeasurement = useCreateMeasurement();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ weightKg: "", chestCm: "", waistCm: "", hipsCm: "" });

  const handleCreate = () => {
    if (!form.weightKg) return;
    createMeasurement.mutate(
      {
        data: {
          weightKg: Number(form.weightKg),
          chestCm: form.chestCm ? Number(form.chestCm) : undefined,
          waistCm: form.waistCm ? Number(form.waistCm) : undefined,
          hipsCm: form.hipsCm ? Number(form.hipsCm) : undefined,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListMeasurementsQueryKey() });
          setForm({ weightKg: "", chestCm: "", waistCm: "", hipsCm: "" });
          setOpen(false);
        },
      }
    );
  };

  const weeklyData = weekly?.days ?? [];
  const weightData = (measurements ?? [])
    .slice(0, 10)
    .reverse()
    .map((m, i) => ({
      entry: `Entry ${i + 1}`,
      weight: m.weightKg,
      chest: m.chestCm,
      waist: m.waistCm,
    }));

  // Fitness score based on recent weekly data
  const fitnessScore = weeklyData.length > 0
    ? Math.min(
        Math.round(
          (weeklyData.reduce((s, d) => s + d.steps, 0) / (weeklyData.length * 10000)) * 40 +
          (weeklyData.reduce((s, d) => s + d.workoutMinutes, 0) / (weeklyData.length * 60)) * 40 +
          20
        ),
        100
      )
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">PROGRESS</h1>
          <p className="text-muted-foreground mt-1">Visualize your fitness journey over time</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Log Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Log Body Measurement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {[
                { key: "weightKg", label: "Weight (kg) *", placeholder: "75.5" },
                { key: "chestCm", label: "Chest (cm)", placeholder: "100" },
                { key: "waistCm", label: "Waist (cm)", placeholder: "80" },
                { key: "hipsCm", label: "Hips (cm)", placeholder: "95" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-sm">{label}</Label>
                  <Input
                    type="number"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button onClick={handleCreate} className="w-full" disabled={createMeasurement.isPending}>
                {createMeasurement.isPending ? "Logging..." : "Save Measurement"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fitness Score */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border col-span-2 md:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-muted-foreground">Fitness Score</span>
            </div>
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeDasharray={`${fitnessScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-display">{fitnessScore}</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {fitnessScore >= 80 ? "Excellent" : fitnessScore >= 60 ? "Good" : fitnessScore >= 40 ? "Fair" : "Needs Work"}
            </p>
          </CardContent>
        </Card>

        {[
          {
            label: "Avg Daily Steps",
            value: weeklyData.length
              ? Math.round(weeklyData.reduce((s, d) => s + d.steps, 0) / weeklyData.length).toLocaleString()
              : "0",
            icon: TrendingUp,
            color: "text-blue-400",
          },
          {
            label: "Avg Calories Burned",
            value: weeklyData.length
              ? Math.round(weeklyData.reduce((s, d) => s + d.caloriesBurned, 0) / weeklyData.length)
              : 0,
            icon: Activity,
            color: "text-orange-400",
          },
          {
            label: "Total Workout Min",
            value: weeklyData.reduce((s, d) => s + d.workoutMinutes, 0),
            icon: Scale,
            color: "text-green-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-5">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <div className="text-2xl font-bold font-display">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="weekly">
        <TabsList className="mb-6">
          <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
          <TabsTrigger value="body">Body Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Weekly Steps & Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="steps" fill="hsl(var(--primary))" opacity={0.8} radius={[3, 3, 0, 0]} name="Steps" />
                    <Line yAxisId="right" type="monotone" dataKey="caloriesBurned" stroke="#f97316" strokeWidth={2} dot={false} name="Calories" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Workout Minutes per Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="wm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="workoutMinutes" stroke="#22d3ee" fill="url(#wm)" strokeWidth={2} name="Workout Min" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body" className="space-y-6">
          {weightData.length > 1 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Weight Trend (kg)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="entry" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" fill="url(#wt)" strokeWidth={2} name="Weight (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="h-4 w-4" /> Measurement Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {measLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (measurements ?? []).length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Scale className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No measurements logged</p>
                  <p className="text-sm">Start tracking your body measurements</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left pb-3 font-medium">Date</th>
                        <th className="text-right pb-3 font-medium">Weight</th>
                        <th className="text-right pb-3 font-medium">Chest</th>
                        <th className="text-right pb-3 font-medium">Waist</th>
                        <th className="text-right pb-3 font-medium">Hips</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(measurements ?? []).slice(0, 10).map((m) => (
                        <tr key={m.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="py-3 text-muted-foreground">
                            {new Date(m.loggedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-right font-medium">{m.weightKg} kg</td>
                          <td className="py-3 text-right text-muted-foreground">{m.chestCm ? `${m.chestCm} cm` : "—"}</td>
                          <td className="py-3 text-right text-muted-foreground">{m.waistCm ? `${m.waistCm} cm` : "—"}</td>
                          <td className="py-3 text-right text-muted-foreground">{m.hipsCm ? `${m.hipsCm} cm` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
