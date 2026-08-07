import { motion } from "framer-motion";

// =====================================
// SCROLL REVEAL
//
// Shared entrance animation used across the site so every
// section fades/rises into place the first time it enters the
// viewport, instead of each component hand-rolling its own
// motion.div boilerplate.
// =====================================

const DIRECTIONS = {
  up: { y: 36, x: 0 },
  down: { y: -36, x: 0 },
  left: { y: 0, x: 36 },
  right: { y: 0, x: -36 },
  none: { y: 0, x: 0 },
};

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
  amount = 0.2,
}) => {
  const offset = DIRECTIONS[direction] || DIRECTIONS.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;