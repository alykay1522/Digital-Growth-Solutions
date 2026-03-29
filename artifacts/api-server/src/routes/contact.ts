import { Router, type IRouter } from "express";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid form data",
      details: parsed.error.message,
    });
    return;
  }

  const { name, email } = parsed.data;
  req.log.info({ name, email }, "Contact form submission received");

  res.json({
    success: true,
    message: `Thank you, ${name}! We've received your message and will get back to you at ${email} within 24 hours.`,
  });
});

export default router;
