import React from 'react';
import { motion } from 'framer-motion';

const MultiplierDisplay = ({ multiplier, status }) => {
  return (
    <motion.div
      key={multiplier}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      className={`mb-4 text-7xl font-black tracking-tight ${
        status === 'crashed' ? 'text-red-400' : 'text-emerald-400'
      }`}
    >
      {multiplier.toFixed(2)}x
    </motion.div>
  );
};

export default MultiplierDisplay;
