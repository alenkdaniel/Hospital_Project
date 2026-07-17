import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import Hero from "./components/home/Hero";
import Services from "./components/home/Services";
import Specialists from "./components/home/Specialists";
import WhyChooseUs from "./components/home/WhyChooseUs";
import HowItWorks from "./components/home/HowItWorks";
import EmergencyBanner from "./components/home/EmergencyBanner";
import Testimonials from "./components/home/Testimonials";

const Home = () => {

return(
  <div>
  <Hero/>
  <Services/>
  <Specialists/>
  <WhyChooseUs/>
  <HowItWorks/>
  <EmergencyBanner/>
  <Testimonials/>
  </div>
)
};

export default Home;
