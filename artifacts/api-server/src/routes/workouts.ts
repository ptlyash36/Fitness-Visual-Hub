import { Router, type IRouter } from "express";
import { db, workoutsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/workouts/summary", async (_req, res): Promise<void> => {
  const workouts = await db.select().from(workoutsTable);

  const summary = {
    cardio: 0,
    strength: 0,
    yoga: 0,
    hiit: 0,
    totalMinutes: 0,
    totalSessions: workouts.length,
  };

  for (const w of workouts) {
    summary.totalMinutes += w.durationMinutes;
    if (w.category === "Cardio") summary.cardio++;
    else if (w.category === "Strength") summary.strength++;
    else if (w.category === "Yoga") summary.yoga++;
    else if (w.category === "HIIT") summary.hiit++;
  }

  res.json(summary);
});

router.get("/workouts", async (_req, res): Promise<void> => {
  const workouts = await db
    .select()
    .from(workoutsTable)
    .orderBy(desc(workoutsTable.createdAt));
  res.json(
    workouts.map((w) => ({ ...w, createdAt: w.createdAt.toISOString() }))
  );
});

router.post("/workouts", async (req, res): Promise<void> => {
  const { name, category, durationMinutes, exercises, notes } = req.body;

  if (!name || !category || !durationMinutes || !exercises) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const validCategories = ["Cardio", "Strength", "Yoga", "HIIT"] as const;
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: "Invalid category" });
    return;
  }

  const [workout] = await db
    .insert(workoutsTable)
    .values({
      name,
      category,
      durationMinutes: Number(durationMinutes),
      exercises,
      notes: notes ?? null,
    })
    .returning();

  res.status(201).json({ ...workout, createdAt: workout.createdAt.toISOString() });
});

router.get("/workouts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [workout] = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.id, id));

  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  res.json({ ...workout, createdAt: workout.createdAt.toISOString() });
});

router.patch("/workouts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { name, category, durationMinutes, exercises, notes } = req.body;
  const update: Partial<typeof workoutsTable.$inferInsert> = {};
  if (name !== undefined) update.name = name;
  if (category !== undefined) update.category = category;
  if (durationMinutes !== undefined) update.durationMinutes = Number(durationMinutes);
  if (exercises !== undefined) update.exercises = exercises;
  if (notes !== undefined) update.notes = notes;

  const [workout] = await db
    .update(workoutsTable)
    .set(update)
    .where(eq(workoutsTable.id, id))
    .returning();

  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  res.json({ ...workout, createdAt: workout.createdAt.toISOString() });
});

router.delete("/workouts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(workoutsTable)
    .where(eq(workoutsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
