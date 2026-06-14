import { Router, type IRouter } from "express";
import { db, communityPostsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/community/posts", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(communityPostsTable)
    .orderBy(desc(communityPostsTable.createdAt));
  res.json(posts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })));
});

router.post("/community/posts", async (req, res): Promise<void> => {
  const { authorName, content } = req.body;

  if (!authorName || !content) {
    res.status(400).json({ error: "authorName and content are required" });
    return;
  }

  const [post] = await db
    .insert(communityPostsTable)
    .values({ authorName, content, likes: 0 })
    .returning();

  res.status(201).json({ ...post, createdAt: post.createdAt.toISOString() });
});

router.get("/community/leaderboard", async (_req, res): Promise<void> => {
  const leaderboard = [
    { rank: 1, name: "Alex Chen", avatarUrl: null, points: 9850, steps: 152340, workoutsCompleted: 87 },
    { rank: 2, name: "Sarah Kim", avatarUrl: null, points: 8720, steps: 138900, workoutsCompleted: 73 },
    { rank: 3, name: "Marcus Rivera", avatarUrl: null, points: 7640, steps: 121500, workoutsCompleted: 65 },
    { rank: 4, name: "Priya Patel", avatarUrl: null, points: 6910, steps: 108700, workoutsCompleted: 58 },
    { rank: 5, name: "Jordan Lee", avatarUrl: null, points: 6240, steps: 97300, workoutsCompleted: 51 },
    { rank: 6, name: "Emma Wilson", avatarUrl: null, points: 5580, steps: 88600, workoutsCompleted: 44 },
    { rank: 7, name: "David Park", avatarUrl: null, points: 4920, steps: 79200, workoutsCompleted: 38 },
    { rank: 8, name: "Lisa Thompson", avatarUrl: null, points: 4310, steps: 71400, workoutsCompleted: 33 },
  ];
  res.json(leaderboard);
});

export default router;
