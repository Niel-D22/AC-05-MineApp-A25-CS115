import React from "react";
import { motion } from "framer-motion";

const animations = {
  initial: { opacity: 0, y: 20 }, // Posisi awal: transparan & agak ke bawah
  animate: { opacity: 1, y: 0 },  // Posisi akhir: muncul & di posisi normal
  exit: { opacity: 0, y: -20 },   // Saat keluar: transparan & geser ke atas
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }} // Kecepatan animasi
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;