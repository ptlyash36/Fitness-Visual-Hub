import { Router, type IRouter } from "express";
import { db, goalsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/goals", async (_req, res): Promise<void> => {
  const goals = await db
    .select()
    .from(goalsTable)
    .orderBy(desc(goalsTable.createdAt));
  res.json(
    goals.map((g) => ({ ...g, createdAt: g.createdAt.toISOString() }))
  );
});

router.post("/goals", async (req, res): Promise<void> => {
  const { title, type, targetValue, currentValue, unit, deadline } = req.body;

  if (!title || !type || targetValue === undefined || !unit) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const validTypes = ["WeightLoss", "MuscleGain", "Steps", "Cardio", "Custom"] as const;
  if (!validTypes.includes(type)) {
    res.status(400).json({ error: "Invalid goal type" });
    return;
  }

  const [goal] = await db
    .insert(goalsTable)
    .values({
      title,
      type,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue ?? 0),
      unit,
      deadline: deadline ?? null,
      achieved: false,
    })
    .returning();

  res.status(201).json({ ...goal, createdAt: goal.createdAt.toISOString() });
});

router.patch("/goals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { title, currentValue, achieved, deadline } = req.body;
  const update: Partial<typeof goalsTable.$inferInsert> = {};
  if (title !== undefined) update.title = title;
  if (currentValue !== undefined) update.currentValue = Number(currentValue);
  if (achieved !== undefined) update.achieved = Boolean(achieved);
  if (deadline !== undefined) update.deadline = deadline;

  const [goal] = await db
    .update(goalsTable)
    .set(update)
    .where(eq(goalsTable.id, id))
    .returning();

  if (!goal) {
    res.status(404).json({ error: "Goal not found" });
    return;
  }

  res.json({ ...goal, createdAt: goal.createdAt.toISOString() });
});

router.delete("/goals/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(goalsTable)
    .where(eq(goalsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Goal not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
