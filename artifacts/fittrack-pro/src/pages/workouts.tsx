import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListWorkouts,
  useCreateWorkout,
  useDeleteWorkout,
  useGetWorkoutSummary,
  getListWorkoutsQueryKey,
  getGetWorkoutSummaryQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Plus, Dumbbell, Clock, Trash2, Zap, Heart, Activity } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Cardio: "#22d3ee",
  Strength: "#3b82f6",
  Yoga: "#a855f7",
  HIIT: "#f97316",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Cardio: Heart,
  Strength: Dumbbell,
  Yoga: Activity,
  HIIT: Zap,
};

const categoryBadgeClass: Record<string, string> = {
  Cardio: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
  Strength: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Yoga: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  HIIT: "border-orange-500/30 text-orange-400 bg-orange-500/10",
};

export default function Workouts() {
  const { data: workouts, isLoading } = useListWorkouts();
  const { data: summary } = useGetWorkoutSummary();
  const createWorkout = useCreateWorkout();
  const deleteWorkout = useDeleteWorkout();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Cardio" as "Cardio" | "Strength" | "Yoga" | "HIIT",
    durationMinutes: "",
    exercises: "",
    notes: "",
  });

  const pieData = [
    { name: "Cardio", value: summary?.cardio ?? 0 },
    { name: "Strength", value: summary?.strength ?? 0 },
    { name: "Yoga", value: summary?.yoga ?? 0 },
    { name: "HIIT", value: summary?.hiit ?? 0 },
  ].filter((d) => d.value > 0);

  const handleCreate = () => {
    if (!form.name || !form.durationMinutes || !form.exercises) return;
    createWorkout.mutate(
      {
        data: {
          name: form.name,
          category: form.category,
          durationMinutes: Number(form.durationMinutes),
          exercises: form.exercises,
          notes: form.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetWorkoutSummaryQueryKey() });
          setForm({ name: "", category: "Cardio", durationMinutes: "", exercises: "", notes: "" });
          setOpen(false);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteWorkout.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetWorkoutSummaryQueryKey() });
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">WORKOUTS</h1>
          <p className="text-muted-foreground mt-1">Build and track your training sessions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Workout Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Workout Name</Label>
                <Input
                  placeholder="e.g. Morning HIIT Blast"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v as typeof form.category }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Cardio", "Strength", "Yoga", "HIIT"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={form.durationMinutes}
                    onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Exercises</Label>
                <Textarea
                  placeholder="e.g. Bench Press 4x8, Pull-ups 3x10..."
                  value={form.exercises}
                  onChange={(e) => setForm((f) => ({ ...f, exercises: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Any notes about this workout"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createWorkout.isPending}>
                {createWorkout.isPending ? "Creating..." : "Create Workout"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions", value: summary?.totalSessions ?? 0, icon: Dumbbell, color: "text-blue-400" },
          { label: "Total Minutes", value: summary?.totalMinutes ?? 0, icon: Clock, color: "text-green-400" },
          { label: "Cardio Sessions", value: summary?.cardio ?? 0, icon: Heart, color: "text-cyan-400" },
          { label: "Strength Sessions", value: summary?.strength ?? 0, icon: Zap, color: "text-orange-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <Icon className={`h-8 w-8 ${color}`} />
              <div>
                <div className="text-2xl font-bold font-display">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Category Chart */}
        <Card className="bg-card border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                No workouts logged yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workout List */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Your Workout Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : (workouts ?? []).length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No workouts yet</p>
                <p className="text-sm">Create your first workout plan to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(workouts ?? []).map((w) => {
                  const Icon = CATEGORY_ICONS[w.category] ?? Dumbbell;
                  return (
                    <div
                      key={w.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-border/80 transition-colors bg-secondary/20"
                    >
                      <div
                        className="p-2 rounded-lg mt-0.5"
                        style={{ background: `${CATEGORY_COLORS[w.category]}20` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: CATEGORY_COLORS[w.category] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">{w.name}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${categoryBadgeClass[w.category]}`}
                          >
                            {w.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-2">{w.exercises}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {w.durationMinutes} min
                          </span>
                          <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                        onClick={() => handleDelete(w.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
