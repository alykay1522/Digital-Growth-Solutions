import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import analyzeRouter from "./analyze";
import aiFix from "./ai-fix";
import detectStack from "./detect-stack";
import chat from "./chat";
import compare from "./compare";
import sniff from "./sniff";
import clone from "./clone";
import paypal from "./paypal";
import blog from "./blog";
import blogAdmin from "./blog-admin";
import agents from "./agents";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(analyzeRouter);
router.use(aiFix);
router.use(detectStack);
router.use(chat);
router.use(compare);
router.use(sniff);
router.use(clone);
router.use(paypal);
router.use(blog);
router.use(blogAdmin);
router.use("/agents", agents);

export default router;
