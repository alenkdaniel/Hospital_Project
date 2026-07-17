import User from "../models/User.js";
import axios from "axios";

export const reverseGeocode  = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          apikey: process.env.GEOAPIFY_API_KEY,
        },
      },
    );
    const result = response.data.features[0];
    const address = result.properties;
    return res.json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchLocations = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNearbyHospitals = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
