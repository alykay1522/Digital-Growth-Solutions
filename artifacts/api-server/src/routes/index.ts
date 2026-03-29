import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import analyzeRouter from "./analyze";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(analyzeRouter);

export default router;
