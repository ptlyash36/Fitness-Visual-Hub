import { Router, type IRouter } from "express";
import { db, mealsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/meals", async (_req, res): Promise<void> => {
  const meals = await db
    .select()
    .from(mealsTable)
    .orderBy(desc(mealsTable.loggedAt));
  res.json(meals.map((m) => ({ ...m, loggedAt: m.loggedAt.toISOString() })));
});

router.post("/meals", async (req, res): Promise<void> => {
  const { name, calories, protein, carbs, fat, mealType } = req.body;

  if (!name || calories === undefined || !mealType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const validTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
  if (!validTypes.includes(mealType)) {
    res.status(400).json({ error: "Invalid meal type" });
    return;
  }

  const [meal] = await db
    .insert(mealsTable)
    .values({
      name,
      calories: Number(calories),
      protein: Number(protein ?? 0),
      carbs: Number(carbs ?? 0),
      fat: Number(fat ?? 0),
      mealType,
    })
    .returning();

  res.status(201).json({ ...meal, loggedAt: meal.loggedAt.toISOString() });
});

router.delete("/meals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(mealsTable)
    .where(eq(mealsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Meal not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/nutrition/daily", async (_req, res): Promise<void> => {
  const meals = await db.select().from(mealsTable);

  const totals = meals.reduce(
    (acc, m) => ({
      totalCalories: acc.totalCalories + m.calories,
      totalProtein: acc.totalProtein + m.protein,
      totalCarbs: acc.totalCarbs + m.carbs,
      totalFat: acc.totalFat + m.fat,
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );

  res.json({ ...totals, calorieGoal: 2000 });
});

export default router;
