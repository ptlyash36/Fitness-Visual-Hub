import { Router, type IRouter } from "express";
import { db, dashboardStatsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  let [stats] = await db
    .select()
    .from(dashboardStatsTable)
    .where(undefined)
    .orderBy(desc(dashboardStatsTable.id))
    .limit(1);

  if (!stats) {
    const [created] = await db
      .insert(dashboardStatsTable)
      .values({
        steps: 0,
        caloriesBurned: 0,
        waterIntakeMl: 0,
        sleepHours: 0,
        heartRate: 0,
        bmiValue: 0,
        weightKg: 0,
        date: today,
      })
      .returning();
    stats = created;
  }

  res.json({
    ...stats,
    date: stats.date,
  });
});

router.patch("/dashboard/stats", async (req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const {
    steps,
    caloriesBurned,
    waterIntakeMl,
    sleepHours,
    heartRate,
    bmiValue,
    weightKg,
  } = req.body;

  const [existing] = await db
    .select()
    .from(dashboardStatsTable)
    .orderBy(desc(dashboardStatsTable.id))
    .limit(1);

  const updateData: Partial<typeof dashboardStatsTable.$inferInsert> = {};
  if (steps !== undefined) updateData.steps = steps;
  if (caloriesBurned !== undefined) updateData.caloriesBurned = caloriesBurned;
  if (waterIntakeMl !== undefined) updateData.waterIntakeMl = waterIntakeMl;
  if (sleepHours !== undefined) updateData.sleepHours = sleepHours;
  if (heartRate !== undefined) updateData.heartRate = heartRate;
  if (bmiValue !== undefined) updateData.bmiValue = bmiValue;
  if (weightKg !== undefined) updateData.weightKg = weightKg;

  let stats;
  if (!existing) {
    const [created] = await db
      .insert(dashboardStatsTable)
      .values({
        steps: steps ?? 0,
        caloriesBurned: caloriesBurned ?? 0,
        waterIntakeMl: waterIntakeMl ?? 0,
        sleepHours: sleepHours ?? 0,
        heartRate: heartRate ?? 0,
        bmiValue: bmiValue ?? 0,
        weightKg: weightKg ?? 0,
        date: today,
      })
      .returning();
    stats = created;
  } else {
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(dashboardStatsTable)
      .set(updateData)
      .where(eq(dashboardStatsTable.id, existing.id))
      .returning();
    stats = updated;
  }

  res.json(stats);
});

export default router;
