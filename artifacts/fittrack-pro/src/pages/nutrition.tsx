import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListMeals,
  useCreateMeal,
  useDeleteMeal,
  useGetDailyNutrition,
  getListMealsQueryKey,
  getGetDailyNutritionQueryKey,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus, Apple, Trash2, Flame, Droplets } from "lucide-react";

const MEAL_TYPE_COLORS: Record<string, string> = {
  Breakfast: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  Lunch: "border-green-500/30 text-green-400 bg-green-500/10",
  Dinner: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Snack: "border-purple-500/30 text-purple-400 bg-purple-500/10",
};

const MEAL_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack"];

// Quick-add food database
const FOOD_DB = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice (100g)", calories: 112, protein: 2.6, carbs: 24, fat: 0.9 },
  { name: "Oatmeal (100g)", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Greek Yogurt (150g)", calories: 88, protein: 15, carbs: 6, fat: 0.4 },
  { name: "Whey Protein Shake", calories: 120, protein: 25, carbs: 3, fat: 1.5 },
  { name: "Eggs x2", calories: 148, protein: 12.6, carbs: 0.8, fat: 10 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Avocado (half)", calories: 160, protein: 2, carbs: 9, fat: 15 },
];

export default function Nutrition() {
  const { data: meals, isLoading } = useListMeals();
  const { data: daily } = useGetDailyNutrition();
  const createMeal = useCreateMeal();
  const deleteMeal = useDeleteMeal();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [water, setWater] = useState(6);
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "Breakfast" as "Breakfast" | "Lunch" | "Dinner" | "Snack",
  });

  const filteredFoods = FOOD_DB.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const quickAdd = (food: (typeof FOOD_DB)[0]) => {
    setForm((f) => ({
      ...f,
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
    }));
  };

  const handleCreate = () => {
    if (!form.name || !form.calories) return;
    createMeal.mutate(
      {
        data: {
          name: form.name,
          calories: Number(form.calories),
          protein: Number(form.protein || 0),
          carbs: Number(form.carbs || 0),
          fat: Number(form.fat || 0),
          mealType: form.mealType,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListMealsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetDailyNutritionQueryKey() });
          setForm({ name: "", calories: "", protein: "", carbs: "", fat: "", mealType: "Breakfast" });
          setSearch("");
          setOpen(false);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMeal.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListMealsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetDailyNutritionQueryKey() });
        },
      }
    );
  };

  const macroData = [
    { name: "Protein", value: Math.round(daily?.totalProtein ?? 0), color: "#3b82f6", goal: 150 },
    { name: "Carbs", value: Math.round(daily?.totalCarbs ?? 0), color: "#22d3ee", goal: 250 },
    { name: "Fat", value: Math.round(daily?.totalFat ?? 0), color: "#f97316", goal: 65 },
  ];

  const mealsByType = MEAL_ORDER.map((type) => ({
    type,
    meals: (meals ?? []).filter((m) => m.mealType === type),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">NUTRITION</h1>
          <p className="text-muted-foreground mt-1">Track your daily meals and macros</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log a Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Search Food Database</Label>
                <Input
                  placeholder="Search foods..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <div className="border border-border rounded-lg max-h-36 overflow-y-auto">
                    {filteredFoods.map((food) => (
                      <button
                        key={food.name}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex justify-between"
                        onClick={() => { quickAdd(food); setSearch(""); }}
                      >
                        <span>{food.name}</span>
                        <span className="text-muted-foreground">{food.calories} kcal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Meal Name</Label>
                  <Input
                    placeholder="e.g. Grilled Chicken Salad"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Meal Type</Label>
                  <Select
                    value={form.mealType}
                    onValueChange={(v) => setForm((f) => ({ ...f, mealType: v as typeof form.mealType }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Breakfast", "Lunch", "Dinner", "Snack"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "calories", label: "Calories", placeholder: "350" },
                  { key: "protein", label: "Protein (g)", placeholder: "30" },
                  { key: "carbs", label: "Carbs (g)", placeholder: "40" },
                  { key: "fat", label: "Fat (g)", placeholder: "12" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Input
                      type="number"
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createMeal.isPending}>
                {createMeal.isPending ? "Logging..." : "Log Meal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calorie Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" /> Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-5xl font-bold font-display text-orange-400">
                {daily?.totalCalories ?? 0}
              </span>
              <span className="text-muted-foreground text-lg">/ {daily?.calorieGoal ?? 2000} kcal</span>
              <span className="ml-auto text-sm text-muted-foreground">
                {Math.max(0, (daily?.calorieGoal ?? 2000) - (daily?.totalCalories ?? 0))} remaining
              </span>
            </div>
            <Progress
              value={Math.min(((daily?.totalCalories ?? 0) / (daily?.calorieGoal ?? 2000)) * 100, 100)}
              className="h-3 mb-6"
            />
            <div className="grid grid-cols-3 gap-4">
              {macroData.map(({ name, value, color, goal }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{name}</span>
                    <span style={{ color }}>{value}g / {goal}g</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min((value / goal) * 100, 100)}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Water Tracker */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-400" /> Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold font-display text-cyan-400">{water}</span>
              <span className="text-muted-foreground">/ 8 glasses</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setWater(i < water ? i : i + 1)}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    i < water
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <Droplets className="h-4 w-4 mx-auto" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {water >= 8 ? "Daily goal reached!" : `${8 - water} more glasses to go`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Macro Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Macronutrient Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={macroData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {macroData.map((entry) => (
                  <rect key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Meal List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {mealsByType.map(({ type, meals: typeMeals }) => (
            typeMeals.length > 0 && (
              <div key={type}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{type}</h3>
                <div className="space-y-2">
                  {typeMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                      <Apple className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{meal.name}</span>
                          <Badge variant="outline" className={`text-xs shrink-0 ${MEAL_TYPE_COLORS[meal.mealType]}`}>
                            {meal.mealType}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                          <span className="text-orange-400 font-medium">{meal.calories} kcal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fat}g</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDelete(meal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {(meals ?? []).length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <Apple className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No meals logged today</p>
              <p className="text-sm">Start tracking your nutrition by logging a meal</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
