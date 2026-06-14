import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  getListGoalsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  Plus,
  Target,
  Trophy,
  Trash2,
  CheckCircle,
  TrendingDown,
  Dumbbell,
  Footprints,
  Heart,
  Star,
  Award,
  Zap,
  Flame,
} from "lucide-react";

const GOAL_TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  WeightLoss: { icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-500/10" },
  MuscleGain: { icon: Dumbbell, color: "text-blue-400", bg: "bg-blue-500/10" },
  Steps: { icon: Footprints, color: "text-green-400", bg: "bg-green-500/10" },
  Cardio: { icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
  Custom: { icon: Star, color: "text-purple-400", bg: "bg-purple-500/10" },
};

const BADGES = [
  { id: 1, name: "First Step", desc: "Log your first workout", icon: Footprints, earned: true },
  { id: 2, name: "Week Warrior", desc: "7 consecutive active days", icon: Zap, earned: true },
  { id: 3, name: "Calorie Crusher", desc: "Burn 5,000 calories total", icon: Flame, earned: true },
  { id: 4, name: "Goal Getter", desc: "Complete your first goal", icon: Trophy, earned: false },
  { id: 5, name: "Iron Will", desc: "30 workout sessions", icon: Dumbbell, earned: false },
  { id: 6, name: "Champion", desc: "Reach #1 on leaderboard", icon: Award, earned: false },
];

export default function Goals() {
  const { data: goals, isLoading } = useListGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "WeightLoss" as "WeightLoss" | "MuscleGain" | "Steps" | "Cardio" | "Custom",
    targetValue: "",
    currentValue: "",
    unit: "",
    deadline: "",
  });

  const handleCreate = () => {
    if (!form.title || !form.targetValue || !form.unit) return;
    createGoal.mutate(
      {
        data: {
          title: form.title,
          type: form.type,
          targetValue: Number(form.targetValue),
          currentValue: Number(form.currentValue || 0),
          unit: form.unit,
          deadline: form.deadline || undefined,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListGoalsQueryKey() });
          setForm({ title: "", type: "WeightLoss", targetValue: "", currentValue: "", unit: "", deadline: "" });
          setOpen(false);
        },
      }
    );
  };

  const handleToggleAchieved = (id: number, achieved: boolean) => {
    updateGoal.mutate(
      { id, data: { achieved: !achieved } },
      { onSuccess: () => qc.invalidateQueries({ queryKey: getListGoalsQueryKey() }) }
    );
  };

  const handleDelete = (id: number) => {
    deleteGoal.mutate(
      { id },
      { onSuccess: () => qc.invalidateQueries({ queryKey: getListGoalsQueryKey() }) }
    );
  };

  const activeGoals = (goals ?? []).filter((g) => !g.achieved);
  const completedGoals = (goals ?? []).filter((g) => g.achieved);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">GOALS</h1>
          <p className="text-muted-foreground mt-1">Set targets and track your progress</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Set Fitness Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Goal Title</Label>
                <Input
                  placeholder="e.g. Lose 5kg by summer"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Goal Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm((f) => ({ ...f, type: v as typeof form.type }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["WeightLoss", "MuscleGain", "Steps", "Cardio", "Custom"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Unit</Label>
                  <Input
                    placeholder="kg, steps, km..."
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Current Value</Label>
                  <Input
                    type="number"
                    placeholder="Current amount"
                    value={form.currentValue}
                    onChange={(e) => setForm((f) => ({ ...f, currentValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    placeholder="Target amount"
                    value={form.targetValue}
                    onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Deadline (optional)</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Goals", value: activeGoals.length, icon: Target, color: "text-primary" },
          { label: "Completed", value: completedGoals.length, icon: CheckCircle, color: "text-green-400" },
          { label: "Badges Earned", value: BADGES.filter((b) => b.earned).length, icon: Trophy, color: "text-yellow-400" },
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

      {/* Active Goals */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Goals</h2>
              {activeGoals.map((goal) => {
                const cfg = GOAL_TYPE_CONFIG[goal.type] ?? GOAL_TYPE_CONFIG.Custom;
                const Icon = cfg.icon;
                const pct = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                return (
                  <Card key={goal.id} className="bg-card border-border">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${cfg.bg} shrink-0`}>
                          <Icon className={`h-5 w-5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{goal.title}</span>
                            <Badge variant="outline" className="text-xs">{goal.type}</Badge>
                            {goal.deadline && (
                              <span className="text-xs text-muted-foreground ml-auto">Due: {goal.deadline}</span>
                            )}
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              {goal.currentValue} {goal.unit} / {goal.targetValue} {goal.unit}
                            </span>
                            <span className={`font-bold ${cfg.color}`}>{Math.round(pct)}%</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                            onClick={() => handleToggleAchieved(goal.id, goal.achieved)}
                            title="Mark as achieved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeGoals.length === 0 && (
            <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No active goals</p>
              <p className="text-sm">Set your first fitness goal to stay motivated</p>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</h2>
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5"
                >
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium line-through text-muted-foreground">{goal.title}</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Achieved</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Achievement Badges */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.earned
                    ? "border-yellow-500/30 bg-yellow-500/10"
                    : "border-border bg-secondary/20 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={`h-6 w-6 shrink-0 ${badge.earned ? "text-yellow-400" : "text-muted-foreground"}`}
                  />
                  <div>
                    <div className={`font-semibold text-sm ${badge.earned ? "text-yellow-400" : "text-muted-foreground"}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{badge.desc}</div>
                  </div>
                  {badge.earned && <Trophy className="h-4 w-4 text-yellow-400 ml-auto shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
