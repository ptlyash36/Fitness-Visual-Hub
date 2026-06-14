import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import workoutsRouter from "./workouts";
import nutritionRouter from "./nutrition";
import goalsRouter from "./goals";
import progressRouter from "./progress";
import communityRouter from "./community";
import trainersRouter from "./trainers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(workoutsRouter);
router.use(nutritionRouter);
router.use(goalsRouter);
router.use(progressRouter);
router.use(communityRouter);
router.use(trainersRouter);

export default router;
