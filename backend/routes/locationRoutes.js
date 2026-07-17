import express from "express";
import {
  reverseGeocode,
  searchLocations,
  getNearbyHospitals,
} from "../controllers/locationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reverse-geocode", protect, reverseGeocode);

router.get("/search", searchLocations);

router.get("/nearby", getNearbyHospitals);

export default router;
