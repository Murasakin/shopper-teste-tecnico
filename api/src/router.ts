import { Router } from "express";
import { priceReadjustmentController } from ".";

const router = Router();

router.route("/validatecsvdata").post((req, res) => {
  return priceReadjustmentController.validate(req, res);
});

export default router;
