import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import analyzeRouter from "./analyze";
import aiFix from "./ai-fix";
import detectStack from "./detect-stack";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(analyzeRouter);
router.use(aiFix);
router.use(detectStack);

export default router;
