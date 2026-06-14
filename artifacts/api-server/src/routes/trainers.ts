import { Router, type IRouter } from "express";
import { db, trainersTable, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/trainers", async (_req, res): Promise<void> => {
  const trainers = await db.select().from(trainersTable);
  res.json(trainers);
});

router.post("/trainers/:id/book", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const trainerId = parseInt(raw, 10);
  if (isNaN(trainerId)) {
    res.status(400).json({ error: "Invalid trainer id" });
    return;
  }

  const [trainer] = await db
    .select()
    .from(trainersTable)
    .where(eq(trainersTable.id, trainerId));

  if (!trainer) {
    res.status(404).json({ error: "Trainer not found" });
    return;
  }

  const { clientName, date, time, notes } = req.body;

  if (!clientName || !date || !time) {
    res.status(400).json({ error: "clientName, date, and time are required" });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      trainerId,
      clientName,
      date,
      time,
      status: "confirmed",
      notes: notes ?? null,
    })
    .returning();

  res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

export default router;
