import { Router, type IRouter } from "express";
import { db, measurementsTable, workoutsTable, dashboardStatsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/measurements", async (_req, res): Promise<void> => {
  const measurements = await db
    .select()
    .from(measurementsTable)
    .orderBy(desc(measurementsTable.loggedAt));
  res.json(
    measurements.map((m) => ({ ...m, loggedAt: m.loggedAt.toISOString() }))
  );
});

router.post("/measurements", async (req, res): Promise<void> => {
  const { weightKg, chestCm, waistCm, hipsCm } = req.body;

  if (weightKg === undefined) {
    res.status(400).json({ error: "weightKg is required" });
    return;
  }

  const [measurement] = await db
    .insert(measurementsTable)
    .values({
      weightKg: Number(weightKg),
      chestCm: chestCm !== undefined ? Number(chestCm) : null,
      waistCm: waistCm !== undefined ? Number(waistCm) : null,
      hipsCm: hipsCm !== undefined ? Number(hipsCm) : null,
    })
    .returning();

  res.status(201).json({ ...measurement, loggedAt: measurement.loggedAt.toISOString() });
});

router.get("/progress/weekly", async (_req, res): Promise<void> => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return dayNames[d.getDay()];
  });

  const workouts = await db.select().from(workoutsTable);
  const stats = await db.select().from(dashboardStatsTable).orderBy(desc(dashboardStatsTable.id)).limit(1);

  const baseSteps = stats[0]?.steps ?? 8000;
  const baseCalories = stats[0]?.caloriesBurned ?? 400;

  const weeklyDays = days.map((day, i) => ({
    day,
    steps: Math.max(0, baseSteps + (Math.random() * 2000 - 1000) | 0),
    caloriesBurned: Math.max(0, baseCalories + (Math.random() * 200 - 100) | 0),
    workoutMinutes: i < workouts.length ? workouts[i]?.durationMinutes ?? 0 : (Math.random() * 60 | 0),
  }));

  res.json({ days: weeklyDays });
});

export default router;
