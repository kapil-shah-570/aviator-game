// // import React from 'react';
// // import { motion } from 'framer-motion';

// // const PlaneAnimation = ({ multiplier, crashed }) => {
// //   // Plane moves right as multiplier increases (max 80% of width)
// //   const x = Math.min((multiplier - 1) * 10, 300);
  
// //   return (
// //     <div className="relative h-40 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(30,41,59,0.9))]">
// //       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
// //       <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
// //       <motion.div
// //         className="absolute bottom-6 left-0 text-5xl drop-shadow-[0_10px_15px_rgba(250,204,21,0.25)]"
// //         animate={{ x }}
// //         transition={{ type: 'tween', duration: 0.1 }}
// //       >
// //         ✈️
// //       </motion.div>
// //       {crashed && (
// //         <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-black text-red-400 backdrop-blur-sm">
// //           💥 CRASHED 💥
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PlaneAnimation;










// import React, { useEffect, useRef, useState } from 'react';
// import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// const PlaneAnimation = ({ multiplier, crashed, roundStatus }) => {
//   const planeControls = useAnimation();
//   const smokeControls = useAnimation();
//   const [showTakeoff, setShowTakeoff] = useState(false);
//   const [explosionPieces, setExplosionPieces] = useState([]);
//   const containerRef = useRef(null);
//   const oldMultiplier = useRef(multiplier);

//   // Calculate plane X position based on multiplier (max 85% of container width)
//   const [containerWidth, setContainerWidth] = useState(800);
//   useEffect(() => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.offsetWidth);
//     }
//   }, []);
//   const maxX = containerWidth - 80; // leave space for plane width
//   const x = Math.min((multiplier - 1) * 15, maxX * 0.85);

//   // Detect round start: multiplier jumps from 0 to 1.00 (or when multiplier becomes >1 from 0)
//   useEffect(() => {
//     if (oldMultiplier.current === 0 && multiplier === 1 && !crashed) {
//       // Round just started
//       setShowTakeoff(true);
//       planeControls.start("takeoff");
//       smokeControls.start("puff");
//       setTimeout(() => setShowTakeoff(false), 800);
//     }
//     oldMultiplier.current = multiplier;
//   }, [multiplier, crashed, planeControls, smokeControls]);

//   // Handle crash animation
//   useEffect(() => {
//     if (crashed) {
//       // Trigger crash sequence
//       planeControls.start("crash");
//       // Create explosion particles
//       const pieces = Array.from({ length: 12 }).map((_, i) => ({
//         id: i,
//         x: (Math.random() - 0.5) * 200,
//         y: (Math.random() - 0.5) * 150,
//         rotate: Math.random() * 360,
//         scale: 0.5 + Math.random() * 0.8,
//       }));
//       setExplosionPieces(pieces);
//       // Clear pieces after animation
//       setTimeout(() => setExplosionPieces([]), 1500);
//     } else {
//       setExplosionPieces([]);
//     }
//   }, [crashed, planeControls]);

//   // Floating clouds effect (background)
//   const cloudVariants = {
//     animate: (i) => ({
//       x: [0, 30, 0],
//       opacity: [0.3, 0.6, 0.3],
//       transition: {
//         duration: 8 + i * 2,
//         repeat: Infinity,
//         ease: "linear",
//       },
//     }),
//   };

//   return (
//     <div ref={containerRef} className="relative h-48 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-sky-900/50 to-gray-900/90 shadow-2xl">
//       {/* Sky background */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />
      
//       {/* Animated clouds */}
//       {[0, 1, 2].map((i) => (
//         <motion.div
//           key={i}
//           custom={i}
//           variants={cloudVariants}
//           animate="animate"
//           className="absolute text-6xl opacity-30 pointer-events-none"
//           style={{ top: `${20 + i * 30}%`, left: `${10 + i * 20}%` }}
//         >
//           ☁️
//         </motion.div>
//       ))}

//       {/* Runway/ground line */}
//       <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 to-transparent">
//         <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-yellow-500/40" />
//         <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-white/20 animate-pulse" 
//              style={{ width: `${Math.min(x / maxX * 100, 100)}%` }} />
//       </div>

//       {/* Takeoff smoke puffs */}
//       <AnimatePresence>
//         {showTakeoff && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 0.6, scale: 1.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             className="absolute bottom-6 left-4 text-4xl"
//           >
//             💨💨💨
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Plane */}
//       <motion.div
//         variants={{
//           idle: { x: 0, y: 0, rotate: 0, scale: 1 },
//           takeoff: { 
//             y: [-10, -25, -15], 
//             rotate: [-5, 0, 5],
//             transition: { duration: 0.6, times: [0, 0.5, 1] }
//           },
//           flying: { 
//             y: [0, -8, 0, -4, 0], 
//             rotate: [0, 3, 0, -2, 0],
//             transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
//           },
//           crash: {
//             x: [0, x, x + 60, x - 40, x + 120],
//             y: [0, -20, 30, 80, 150],
//             rotate: [0, 15, -30, 180, 360],
//             scale: [1, 1.1, 0.8, 0.4, 0],
//             opacity: [1, 1, 0.8, 0.3, 0],
//             transition: { duration: 0.8, times: [0, 0.2, 0.4, 0.6, 1] }
//           }
//         }}
//         animate={crashed ? "crash" : (multiplier > 1.01 ? "flying" : (showTakeoff ? "takeoff" : "idle"))}
//         style={{ x, y: multiplier > 1.01 ? undefined : 0 }}
//         className="absolute bottom-6 left-0 text-5xl z-10 filter drop-shadow-lg"
//       >
//         {/* Plane with propeller animation */}
//         <div className="relative">
//           <span className="inline-block">✈️</span>
//           {!crashed && multiplier > 1.01 && (
//             <motion.span
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
//               className="absolute -left-3 top-1 text-xl"
//             >
//               ⚙️
//             </motion.span>
//           )}
//         </div>
//       </motion.div>

//       {/* Crash explosion shrapnel */}
//       <AnimatePresence>
//         {crashed && explosionPieces.map((piece) => (
//           <motion.div
//             key={piece.id}
//             initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
//             animate={{ 
//               x: piece.x, 
//               y: piece.y, 
//               opacity: 0, 
//               scale: piece.scale,
//               rotate: piece.rotate
//             }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className="absolute bottom-12 left-0 text-2xl pointer-events-none"
//             style={{ x: x + 30, y: -10 }}
//           >
//             {['💥', '🔥', '🧩', '⚡', '💨'][piece.id % 5]}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       {/* Speed lines when flying fast */}
//       {!crashed && multiplier > 2 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: [0, 0.5, 0] }}
//           transition={{ duration: 0.2, repeat: Infinity }}
//           className="absolute inset-0 pointer-events-none"
//         >
//           <div className="absolute top-1/3 right-0 w-full h-px bg-white/30" style={{ transform: 'skew(-20deg)' }} />
//           <div className="absolute top-2/3 right-0 w-full h-px bg-white/20" style={{ transform: 'skew(15deg)' }} />
//         </motion.div>
//       )}

//       {/* Crash overlay text */}
//       {crashed && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", bounce: 0.5 }}
//             className="text-center"
//           >
//             <div className="text-6xl mb-2">💥</div>
//             <div className="text-3xl font-black text-red-500 uppercase tracking-wider">
//               CRASHED!
//             </div>
//             <div className="text-sm text-red-300 mt-1">@{multiplier.toFixed(2)}x</div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaneAnimation;















// import React, { useEffect, useRef, useState } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// const PlaneAnimation = ({ multiplier, crashed, roundStatus }) => {
//   const planeControls = useAnimation();
//   const [explosionPieces, setExplosionPieces] = useState([]);
//   const containerRef = useRef(null);
//   const [containerWidth, setContainerWidth] = useState(1200);
//   const [containerHeight, setContainerHeight] = useState(500);
//   const oldMultiplier = useRef(multiplier);
//   const [isTakingOff, setIsTakingOff] = useState(false);

//   // Dimensions for horizontal movement
//   useEffect(() => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.offsetWidth);
//       setContainerHeight(containerRef.current.offsetHeight);
//     }
//   }, []);

//   // Flight path: altitude increases with multiplier (takeoff up to cruising)
//   const maxHorizontal = containerWidth - 100;
//   const horizontalX = Math.min((multiplier - 1) * 20, maxHorizontal * 0.85);
  
//   // Altitude: starts at bottom (takeoff), rises quickly to 30% of height, then slight cruising bobbing
//   let altitude = 0;
//   if (crashed) {
//     altitude = containerHeight * 0.8; // fall down
//   } else if (multiplier <= 1.05 && multiplier > 1) {
//     // Takeoff phase: rapid climb
//     altitude = Math.min((multiplier - 1) * 200, containerHeight * 0.3);
//   } else if (multiplier > 1.05) {
//     // Cruising altitude: 35% of container height with slight sine wave later
//     altitude = containerHeight * 0.35;
//   } else {
//     altitude = containerHeight * 0.85; // parked on ground
//   }

//   // Add gentle bobbing when flying (not crashed, not takeoff)
//   const [bobOffset, setBobOffset] = useState(0);
//   useEffect(() => {
//     if (!crashed && multiplier > 1.05) {
//       const interval = setInterval(() => {
//         setBobOffset(Math.sin(Date.now() / 300) * 8);
//       }, 50);
//       return () => clearInterval(interval);
//     } else {
//       setBobOffset(0);
//     }
//   }, [crashed, multiplier]);

//   const finalY = altitude + bobOffset;

//   // Takeoff detection
//   useEffect(() => {
//     if (oldMultiplier.current === 1 && multiplier > 1 && !crashed) {
//       setIsTakingOff(true);
//       planeControls.start("takeoff");
//       setTimeout(() => setIsTakingOff(false), 800);
//     }
//     oldMultiplier.current = multiplier;
//   }, [multiplier, crashed]);

//   // Crash animation: create explosion fragments and drop plane
//   useEffect(() => {
//     if (crashed) {
//       planeControls.start("crash");
//       const pieces = Array.from({ length: 20 }).map((_, i) => ({
//         id: i,
//         x: (Math.random() - 0.5) * 300,
//         y: (Math.random() - 0.5) * 200 + 50,
//         rotate: Math.random() * 360,
//         scale: 0.3 + Math.random() * 1,
//       }));
//       setExplosionPieces(pieces);
//       setTimeout(() => setExplosionPieces([]), 1500);
//     }
//   }, [crashed]);

//   // Cloud movement variants
//   const cloudVariants = {
//     animate: (i) => ({
//       x: [0, 40, 0],
//       transition: {
//         duration: 12 + i * 3,
//         repeat: Infinity,
//         ease: "linear",
//       },
//     }),
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-[500px] md:h-[550px] overflow-hidden rounded-3xl border border-white/15 shadow-2xl bg-gradient-to-b from-sky-700 via-sky-500 to-gray-800"
//     >
//       {/* Sun */}
//       <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-yellow-400/30 blur-2xl" />
//       <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-yellow-300/40 blur-xl" />

//       {/* Animated Clouds */}
//       {[0, 1, 2, 3, 4].map((i) => (
//         <motion.div
//           key={i}
//           custom={i}
//           variants={cloudVariants}
//           animate="animate"
//           className="absolute text-7xl opacity-40 pointer-events-none drop-shadow-lg"
//           style={{ top: `${15 + i * 18}%`, left: `${-10 + i * 25}%` }}
//         >
//           ☁️
//         </motion.div>
//       ))}

//       {/* Ground / Runway at bottom */}
//       <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-gray-900 via-gray-800/80 to-transparent">
//         <div className="absolute bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent" />
//         <div className="absolute bottom-6 left-0 h-1 bg-white/40" style={{ width: `${Math.min(horizontalX / maxHorizontal * 100, 100)}%` }} />
//         {/* Runway lights */}
//         <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
//           ))}
//         </div>
//       </div>

//       {/* Takeoff dust effect */}
//       <AnimatePresence>
//         {isTakingOff && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
//             animate={{ opacity: 0.7, scale: 1.5, x: -20, y: -30 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="absolute bottom-12 left-8 text-5xl"
//           >
//             💨💨
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* SVG Airplane with realistic shape */}
//       <motion.div
//         variants={{
//           idle: { x: 0, y: 0, rotate: 0 },
//           takeoff: {
//             y: [0, -80, -120],
//             rotate: [-5, -15, -8],
//             transition: { duration: 0.8, ease: "easeOut" },
//           },
//           crash: {
//             x: horizontalX + 50,
//             y: containerHeight * 0.8,
//             rotate: 540,
//             opacity: 0,
//             transition: { duration: 0.7, ease: "backIn" },
//           },
//         }}
//         animate={
//           crashed
//             ? "crash"
//             : isTakingOff
//             ? "takeoff"
//             : "idle"
//         }
//         style={{ x: crashed ? undefined : horizontalX, y: crashed ? undefined : finalY }}
//         className="absolute left-0 z-20 filter drop-shadow-2xl"
//       >
//         <svg
//           width="80"
//           height="80"
//           viewBox="0 0 100 100"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="transform -translate-x-1/2 -translate-y-1/2"
//         >
//           {/* Fuselage */}
//           <path
//             d="M20,50 L80,50 L70,40 L30,40 Z"
//             fill="url(#planeGradient)"
//             stroke="#facc15"
//             strokeWidth="1.5"
//           />
//           {/* Cockpit */}
//           <circle cx="75" cy="50" r="6" fill="#38bdf8" stroke="#facc15" strokeWidth="1" />
//           {/* Wings */}
//           <path d="M40,50 L20,65 L15,60 L30,50 Z" fill="#64748b" stroke="#facc15" strokeWidth="1" />
//           <path d="M60,50 L80,65 L85,60 L70,50 Z" fill="#64748b" stroke="#facc15" strokeWidth="1" />
//           {/* Tail */}
//           <path d="M25,40 L10,20 L15,18 L30,35 Z" fill="#475569" stroke="#facc15" strokeWidth="1" />
//           {/* Engine exhaust */}
//           <ellipse cx="20" cy="50" rx="4" ry="6" fill="#ef4444" />
//           {/* Propeller (spinning) */}
//           {!crashed && multiplier > 1 && (
//             <motion.g
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
//               transform="translate(20,50)"
//             >
//               <line x1="-12" y1="0" x2="12" y2="0" stroke="#cbd5e1" strokeWidth="2" />
//               <line x1="0" y1="-12" x2="0" y2="12" stroke="#cbd5e1" strokeWidth="2" />
//             </motion.g>
//           )}
//           <defs>
//             <linearGradient id="planeGradient" x1="0" y1="0" x2="1" y2="0">
//               <stop offset="0%" stopColor="#94a3b8" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </motion.div>

//       {/* Speed lines & contrails */}
//       {!crashed && multiplier > 2.5 && (
//         <motion.div
//           animate={{ opacity: [0, 0.6, 0] }}
//           transition={{ duration: 0.3, repeat: Infinity }}
//           className="absolute inset-0 pointer-events-none"
//           style={{ left: horizontalX - 40, top: finalY - 10 }}
//         >
//           <div className="w-32 h-px bg-white/40 -rotate-12" />
//           <div className="w-24 h-px bg-white/30 rotate-6 mt-1" />
//         </motion.div>
//       )}
//       {/* Contrail (continuous) */}
//       {!crashed && multiplier > 1.5 && (
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: horizontalX }}
//           className="absolute h-1 bg-white/20 blur-sm rounded-full"
//           style={{ top: finalY + 10, left: 0 }}
//         />
//       )}

//       {/* Explosion shrapnel */}
//       <AnimatePresence>
//         {crashed &&
//           explosionPieces.map((piece) => (
//             <motion.div
//               key={piece.id}
//               initial={{ x: horizontalX, y: finalY, opacity: 1, scale: 1 }}
//               animate={{
//                 x: horizontalX + piece.x,
//                 y: finalY + piece.y,
//                 opacity: 0,
//                 scale: piece.scale,
//                 rotate: piece.rotate,
//               }}
//               transition={{ duration: 0.7, ease: "easeOut" }}
//               className="absolute text-2xl pointer-events-none z-30"
//             >
//               {["💥", "🔥", "🧨", "⚡", "💨"][piece.id % 5]}
//             </motion.div>
//           ))}
//       </AnimatePresence>

//       {/* Crash overlay */}
//       {crashed && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", bounce: 0.4 }}
//             className="text-center"
//           >
//             <div className="text-7xl mb-3">💥🔥</div>
//             <div className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-wider">
//               CRASHED!
//             </div>
//             <div className="text-lg text-red-300 mt-2 font-mono">@{multiplier.toFixed(2)}x</div>
//           </motion.div>
//         </div>
//       )}

//       {/* Altitude indicator (optional, for realism) */}
//       {!crashed && multiplier > 1 && (
//         <div className="absolute top-4 left-4 text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
//           ALT: {Math.floor(finalY / 5)}m
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaneAnimation;



















// import React, { useEffect, useRef, useState } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// const PlaneAnimation = ({ multiplier, crashed, roundStatus }) => {
//   const planeControls = useAnimation();
//   const [explosionPieces, setExplosionPieces] = useState([]);
//   const containerRef = useRef(null);
//   const [containerWidth, setContainerWidth] = useState(800);
//   const [containerHeight, setContainerHeight] = useState(320);
//   const [isTakingOff, setIsTakingOff] = useState(false);
//   const oldMultiplier = useRef(multiplier);

//   useEffect(() => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.offsetWidth);
//       setContainerHeight(containerRef.current.offsetHeight);
//     }
//   }, []);

//   // Flight path – realistic altitude gain: ground → steep climb → cruise
//   const maxX = Math.min((multiplier - 1) * 22, containerWidth - 100);
//   let altitude = containerHeight - 50; // ground level
//   if (!crashed) {
//     if (multiplier <= 1.08) {
//       // Takeoff: rapid climb
//       const t = (multiplier - 1) / 0.08; // 0..1
//       altitude = (containerHeight - 50) - t * (containerHeight * 0.45);
//     } else {
//       // Cruise at 40% height with small bobbing
//       const bob = Math.sin(Date.now() / 400) * 6;
//       altitude = containerHeight * 0.4 + bob;
//     }
//   } else {
//     // Crash: fall down
//     altitude = containerHeight - 40;
//   }

//   // Rotation: nose up during takeoff (negative rotation), then level, slight tilt in cruise
//   let rotate = 0;
//   if (!crashed) {
//     if (multiplier <= 1.08) {
//       const t = (multiplier - 1) / 0.08;
//       rotate = -20 * (1 - t); // -20° to 0°
//     } else {
//       rotate = Math.sin(Date.now() / 500) * 3;
//     }
//   } else {
//     rotate = 60 + Math.random() * 40; // spinning crash
//   }

//   // Takeoff effect detection
//   useEffect(() => {
//     if (oldMultiplier.current === 1 && multiplier > 1 && !crashed) {
//       setIsTakingOff(true);
//       planeControls.start("takeoff");
//       setTimeout(() => setIsTakingOff(false), 700);
//     }
//     oldMultiplier.current = multiplier;
//   }, [multiplier, crashed]);

//   // Crash explosion
//   useEffect(() => {
//     if (crashed) {
//       planeControls.start("crash");
//       const pieces = Array.from({ length: 18 }).map((_, i) => ({
//         id: i,
//         x: (Math.random() - 0.5) * 250,
//         y: (Math.random() - 0.5) * 180,
//         rotate: Math.random() * 360,
//         scale: 0.4 + Math.random() * 0.9,
//       }));
//       setExplosionPieces(pieces);
//       setTimeout(() => setExplosionPieces([]), 1400);
//     } else {
//       setExplosionPieces([]);
//     }
//   }, [crashed]);

//   // Cloud animations
//   const cloudVariants = {
//     animate: (i) => ({
//       x: [0, 50, 0],
//       transition: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
//     }),
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-80 md:h-96 overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-gradient-to-b from-sky-600 via-sky-400 to-gray-700"
//     >
//       {/* Sun glow */}
//       <div className="absolute top-2 right-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" />

//       {/* Clouds */}
//       {[0, 1, 2, 3].map((i) => (
//         <motion.div
//           key={i}
//           custom={i}
//           variants={cloudVariants}
//           animate="animate"
//           className="absolute text-5xl opacity-30 pointer-events-none drop-shadow"
//           style={{ top: `${10 + i * 25}%`, left: `${-5 + i * 30}%` }}
//         >
//           ☁️
//         </motion.div>
//       ))}

//       {/* Ground / Runway */}
//       <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent">
//         <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-yellow-500/60" />
//         <div className="absolute bottom-2 left-0 h-0.5 bg-white/40 transition-all duration-100" style={{ width: `${Math.min((maxX / containerWidth) * 100, 100)}%` }} />
//         {/* Runway center lights */}
//         <div className="flex justify-center gap-2 absolute bottom-0 left-1/2 transform -translate-x-1/2">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400/70 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
//           ))}
//         </div>
//       </div>

//       {/* Takeoff dust */}
//       <AnimatePresence>
//         {isTakingOff && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
//             animate={{ opacity: 0.8, scale: 1.8, x: -30, y: -20 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="absolute bottom-10 left-6 text-4xl"
//           >
//             💨💨
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Airplane (SVG) */}
//       <motion.div
//         animate={{
//           x: crashed ? containerWidth + 50 : maxX,
//           y: altitude,
//           rotate: rotate,
//         }}
//         transition={{ type: "tween", duration: crashed ? 0.5 : 0.05 }}
//         className="absolute left-0 z-20 transform -translate-x-1/2 -translate-y-1/2"
//         style={{ x: maxX, y: altitude, rotate }}
//       >
//         <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
//           {/* Fuselage */}
//           <path d="M18,50 L82,50 L72,38 L28,38 Z" fill="url(#planeGradient)" stroke="#eab308" strokeWidth="1.2" />
//           {/* Cockpit */}
//           <circle cx="78" cy="50" r="7" fill="#38bdf8" stroke="#facc15" strokeWidth="1.2" />
//           <circle cx="80" cy="48" r="2" fill="white" /> {/* glare */}
//           {/* Main wings */}
//           <path d="M35,50 L12,67 L6,62 L22,50 Z" fill="#475569" stroke="#eab308" strokeWidth="1" />
//           <path d="M65,50 L88,67 L94,62 L78,50 Z" fill="#475569" stroke="#eab308" strokeWidth="1" />
//           {/* Tail wings */}
//           <path d="M28,38 L12,20 L18,16 L34,32 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
//           <path d="M28,38 L12,56 L18,60 L34,44 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
//           {/* Engine */}
//           <ellipse cx="20" cy="50" rx="5" ry="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.5" />
//           {/* Spinning propeller */}
//           {!crashed && multiplier > 1 && (
//             <motion.g
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
//               transform="translate(16,50)"
//             >
//               <line x1="-14" y1="0" x2="14" y2="0" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
//               <line x1="0" y1="-14" x2="0" y2="14" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
//             </motion.g>
//           )}
//           {/* Contrails (exhaust) */}
//           {!crashed && multiplier > 1.4 && (
//             <ellipse cx="14" cy="52" rx="2" ry="4" fill="white" opacity="0.6" />
//           )}
//           <defs>
//             <linearGradient id="planeGradient" x1="0" y1="0" x2="1" y2="0">
//               <stop offset="0%" stopColor="#94a3b8" />
//               <stop offset="40%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </motion.div>

//       {/* ContraIL (trail) */}
//       {!crashed && multiplier > 1.2 && (
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: maxX - 30 }}
//           className="absolute h-1 bg-white/30 blur-sm rounded-full"
//           style={{ top: altitude + 12, left: 10 }}
//         />
//       )}

//       {/* Speed lines */}
//       {!crashed && multiplier > 2.2 && (
//         <motion.div
//           animate={{ opacity: [0, 0.5, 0] }}
//           transition={{ duration: 0.2, repeat: Infinity }}
//           className="absolute pointer-events-none"
//           style={{ left: maxX - 20, top: altitude - 5 }}
//         >
//           <div className="w-12 h-0.5 bg-white/50 -rotate-12" />
//           <div className="w-8 h-0.5 bg-white/40 rotate-6 mt-1" />
//         </motion.div>
//       )}

//       {/* Explosion pieces */}
//       <AnimatePresence>
//         {crashed &&
//           explosionPieces.map((p) => (
//             <motion.div
//               key={p.id}
//               initial={{ x: maxX, y: altitude, opacity: 1, scale: 1 }}
//               animate={{
//                 x: maxX + p.x,
//                 y: altitude + p.y,
//                 opacity: 0,
//                 scale: p.scale,
//                 rotate: p.rotate,
//               }}
//               transition={{ duration: 0.6, ease: "easeOut" }}
//               className="absolute text-2xl pointer-events-none z-30"
//             >
//               {["💥", "🔥", "💢", "⚡", "💨"][p.id % 5]}
//             </motion.div>
//           ))}
//       </AnimatePresence>

//       {/* Crash overlay */}
//       {crashed && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", bounce: 0.3 }}
//             className="text-center"
//           >
//             <div className="text-5xl mb-2">💥🔥</div>
//             <div className="text-2xl font-black text-red-500 uppercase tracking-wider">
//               CRASHED
//             </div>
//             <div className="text-sm text-red-300 mt-1 font-mono">{multiplier.toFixed(2)}x</div>
//           </motion.div>
//         </div>
//       )}

//       {/* Altitude indicator mini */}
//       {!crashed && multiplier > 1 && (
//         <div className="absolute bottom-2 left-2 text-[10px] text-white/50 bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm font-mono">
//           {Math.floor(altitude / 3)}m
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaneAnimation;














// import React, { useEffect, useRef, useState } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// const PlaneAnimation = ({ multiplier, crashed, roundStatus }) => {
//   const containerRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 800, height: 350 });
//   const [explosionPieces, setExplosionPieces] = useState([]);
//   const [isTakingOff, setIsTakingOff] = useState(false);
//   const planeControls = useAnimation();
//   const oldMultiplier = useRef(multiplier);

//   useEffect(() => {
//     if (containerRef.current) {
//       setDimensions({
//         width: containerRef.current.offsetWidth,
//         height: containerRef.current.offsetHeight,
//       });
//     }
//   }, []);

//   // ---- Realistic flight path (diagonal takeoff then level cruise) ----
//   let flightX = 0;
//   let flightY = dimensions.height - 45; // ground level
//   let planeRotation = 0;

//   if (!crashed) {
//     const t = Math.min((multiplier - 1) / 0.12, 1); // takeoff phase up to multiplier 1.12
//     if (multiplier <= 1.12) {
//       // Diagonal climb: x and y both increase (y decreases as it climbs)
//       const easeOutCubic = 1 - Math.pow(1 - t, 3);
//       flightX = easeOutCubic * (dimensions.width - 100);
//       flightY = (dimensions.height - 45) - easeOutCubic * (dimensions.height * 0.5);
//       planeRotation = -20 * (1 - easeOutCubic); // nose up to 0°
//     } else {
//       // Cruise: x goes to end, y stays at ~40% height with gentle bobbing
//       const cruiseT = (multiplier - 1.12) / 5;
//       flightX = Math.min((dimensions.width - 100) + cruiseT * 200, dimensions.width - 50);
//       flightY = dimensions.height * 0.4 + Math.sin(Date.now() / 400) * 5;
//       planeRotation = Math.sin(Date.now() / 500) * 3;
//     }
//     // Bound to container
//     flightX = Math.min(flightX, dimensions.width - 60);
//     flightY = Math.min(Math.max(flightY, 40), dimensions.height - 50);
//   } else {
//     // Crash: fall diagonally down
//     flightX = Math.min(flightX, dimensions.width - 50);
//     flightY = dimensions.height - 30;
//     planeRotation = 180 + Math.random() * 180;
//   }

//   // Takeoff effect trigger
//   useEffect(() => {
//     if (oldMultiplier.current === 1 && multiplier > 1 && !crashed) {
//       setIsTakingOff(true);
//       setTimeout(() => setIsTakingOff(false), 700);
//     }
//     oldMultiplier.current = multiplier;
//   }, [multiplier, crashed]);

//   // Explosion on crash
//   useEffect(() => {
//     if (crashed) {
//       const pieces = Array.from({ length: 24 }).map((_, i) => ({
//         id: i,
//         x: (Math.random() - 0.5) * 300,
//         y: (Math.random() - 0.5) * 200 - 50,
//         rotate: Math.random() * 360,
//         scale: 0.3 + Math.random() * 1,
//       }));
//       setExplosionPieces(pieces);
//       setTimeout(() => setExplosionPieces([]), 1500);
//     } else {
//       setExplosionPieces([]);
//     }
//   }, [crashed]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-96 overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-b from-sky-500 via-sky-300 to-gray-800"
//     >
//       {/* Sky elements */}
//       <div className="absolute top-5 right-5 w-24 h-24 rounded-full bg-yellow-300/30 blur-2xl" />
//       <div className="absolute top-0 left-0 w-full h-full">
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute text-6xl text-white/20"
//             animate={{ x: [0, 80, 0] }}
//             transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
//             style={{ top: `${10 + i * 15}%`, left: `${-10 + i * 18}%` }}
//           >
//             ☁️
//           </motion.div>
//         ))}
//       </div>

//       {/* Ground / Runway */}
//       <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent">
//         <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-yellow-500/60" />
//         <div
//           className="absolute bottom-2 left-0 h-0.5 bg-white/40 transition-all duration-100"
//           style={{ width: `${Math.min((flightX / dimensions.width) * 100, 100)}%` }}
//         />
//         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400/70 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
//           ))}
//         </div>
//       </div>

//       {/* Takeoff dust */}
//       <AnimatePresence>
//         {isTakingOff && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, x: 5, y: 0 }}
//             animate={{ opacity: 0.8, scale: 1.8, x: -40, y: -20 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="absolute bottom-10 left-8 text-4xl"
//           >
//             💨💨
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Realistic SVG Airplane */}
//       <motion.div
//         animate={{
//           x: flightX,
//           y: flightY,
//           rotate: planeRotation,
//         }}
//         transition={{ type: "tween", duration: crashed ? 0.4 : 0.05 }}
//         className="absolute left-0 z-20 transform -translate-x-1/2 -translate-y-1/2"
//       >
//         <svg width="90" height="90" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
//           {/* <!-- Fuselage --> */}
//           <path d="M20,60 L100,60 L88,48 L32,48 Z" fill="url(#planeBody)" stroke="#eab308" strokeWidth="1.5" />
//           {/* <!-- Nose cone --> */}
//           <path d="M98,54 L112,60 L98,66 Z" fill="#cbd5e1" stroke="#eab308" strokeWidth="1" />
//           {/* <!-- Cockpit windows --> */}
//           <ellipse cx="95" cy="58" rx="4" ry="6" fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5" />
//           <ellipse cx="95" cy="62" rx="4" ry="4" fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5" />
//           {/* <!-- Passenger windows --> */}
//           <g fill="#38bdf8" stroke="#1e293b" strokeWidth="0.3">
//             <rect x="40" y="54" width="6" height="4" rx="1" />
//             <rect x="50" y="54" width="6" height="4" rx="1" />
//             <rect x="60" y="54" width="6" height="4" rx="1" />
//             <rect x="70" y="54" width="6" height="4" rx="1" />
//             <rect x="80" y="54" width="6" height="4" rx="1" />
//           </g>
//           {/* <!-- Main wings --> */}
//           <path d="M35,60 L10,80 L6,73 L25,60 Z" fill="#334155" stroke="#eab308" strokeWidth="1.2" />
//           <path d="M85,60 L110,80 L114,73 L95,60 Z" fill="#334155" stroke="#eab308" strokeWidth="1.2" />
//           {/* <!-- Wing flaps --> */}
//           <path d="M25,60 L10,73 L12,75 L28,62 Z" fill="#475569" />
//           <path d="M95,60 L110,73 L108,75 L92,62 Z" fill="#475569" />
//           {/* <!-- Tail fin (vertical) --> */}
//           <path d="M30,48 L12,22 L18,18 L36,44 Z" fill="#1e293b" stroke="#eab308" strokeWidth="1" />
//           {/* <!-- Horizontal stabilizers --> */}
//           <path d="M32,48 L18,35 L15,37 L28,50 Z" fill="#334155" stroke="#eab308" strokeWidth="0.8" />
//           <path d="M32,48 L18,61 L15,59 L28,46 Z" fill="#334155" stroke="#eab308" strokeWidth="0.8" />
//           {/* <!-- Engines (turbofan) --> */}
//           <ellipse cx="24" cy="60" rx="6" ry="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
//           <ellipse cx="24" cy="60" rx="3" ry="7" fill="#0f172a" />
//           {/* <!-- Engine exhaust glow --> */}
//           <ellipse cx="18" cy="60" rx="2" ry="4" fill="rgba(250,204,21,0.6)" />
//           {/* <!-- Spinning propeller (if prop plane, but we use jet fan) --> */}
//           {!crashed && multiplier > 1 && (
//             <motion.g
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
//               transform="translate(16,60)"
//             >
//               <line x1="-10" y1="0" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
//               <line x1="0" y1="-10" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="2.5" />
//             </motion.g>
//           )}
//           {/* <!-- Contrails (exhaust smoke) --> */}
//           {!crashed && multiplier > 1.3 && (
//             <ellipse cx="14" cy="62" rx="3" ry="5" fill="white" opacity="0.5" />
//           )}
//           <defs>
//             <linearGradient id="planeBody" x1="0" y1="0" x2="1" y2="0">
//               <stop offset="0%" stopColor="#cbd5e1" />
//               <stop offset="40%" stopColor="#f1f5f9" />
//               <stop offset="100%" stopColor="#64748b" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </motion.div>

//       {/* Persistent contrail (vapor trail) */}
//       {!crashed && multiplier > 1.2 && (
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: flightX - 40 }}
//           className="absolute h-1.5 bg-white/40 blur-sm rounded-full"
//           style={{ top: flightY + 10, left: 15 }}
//         />
//       )}

//       {/* Speed lines */}
//       {!crashed && multiplier > 2.5 && (
//         <motion.div
//           animate={{ opacity: [0, 0.6, 0] }}
//           transition={{ duration: 0.2, repeat: Infinity }}
//           className="absolute pointer-events-none"
//           style={{ left: flightX - 25, top: flightY - 8 }}
//         >
//           <div className="w-14 h-0.5 bg-white/60 -rotate-12" />
//           <div className="w-10 h-0.5 bg-white/40 rotate-6 mt-1" />
//         </motion.div>
//       )}

//       {/* Explosion pieces */}
//       <AnimatePresence>
//         {crashed &&
//           explosionPieces.map((p) => (
//             <motion.div
//               key={p.id}
//               initial={{ x: flightX, y: flightY, opacity: 1, scale: 1 }}
//               animate={{
//                 x: flightX + p.x,
//                 y: flightY + p.y,
//                 opacity: 0,
//                 scale: p.scale,
//                 rotate: p.rotate,
//               }}
//               transition={{ duration: 0.7, ease: "easeOut" }}
//               className="absolute text-3xl pointer-events-none z-30"
//             >
//               {["💥", "🔥", "🧨", "⚡", "💨", "🧩"][p.id % 6]}
//             </motion.div>
//           ))}
//       </AnimatePresence>

//       {/* Crash overlay */}
//       {crashed && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", bounce: 0.3 }}
//             className="text-center"
//           >
//             <div className="text-6xl mb-2">💥🔥</div>
//             <div className="text-3xl font-black text-red-500 uppercase tracking-wider">
//               CRASHED!
//             </div>
//             <div className="text-base text-red-300 mt-1 font-mono">@{multiplier.toFixed(2)}x</div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaneAnimation;















// import React, { useEffect, useRef, useState } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// const PlaneAnimation = ({ multiplier, crashed }) => {
//   const containerRef = useRef(null);
//   const [containerHeight, setContainerHeight] = useState(400);
//   const [explosionPieces, setExplosionPieces] = useState([]);
//   const [isTakingOff, setIsTakingOff] = useState(false);
//   const oldMultiplier = useRef(multiplier);

//   useEffect(() => {
//     if (containerRef.current) {
//       setContainerHeight(containerRef.current.offsetHeight);
//     }
//   }, []);

//   // ---- Flight dynamics (vertical and rotation only) ----
//   let planeY = 0;
//   let planeRotation = 0;
//   let planeScale = 1;

//   if (!crashed) {
//     const t = Math.min((multiplier - 1) / 0.12, 1); // takeoff phase up to multiplier 1.12
//     if (multiplier <= 1.12) {
//       // Diagonal climb: rises from ground to 35% height
//       const easeOutCubic = 1 - Math.pow(1 - t, 3);
//       planeY = (containerHeight - 60) - easeOutCubic * (containerHeight * 0.5);
//       planeRotation = -18 * (1 - easeOutCubic); // nose up to level
//       planeScale = 1 + t * 0.2; // slight growth during takeoff
//     } else {
//       // Cruise at 40% height with bobbing and banking
//       planeY = containerHeight * 0.4 + Math.sin(Date.now() / 350) * 6;
//       planeRotation = Math.sin(Date.now() / 450) * 4;
//       // Scale increases with multiplier (up to 1.4x)
//       planeScale = Math.min(1 + (multiplier - 1.12) * 0.05, 1.5);
//     }
//     // Bound Y
//     planeY = Math.min(Math.max(planeY, 50), containerHeight - 60);
//   } else {
//     // Crash: falls to ground and spins
//     planeY = containerHeight - 50;
//     planeRotation = 180 + (Date.now() % 360);
//     planeScale = 1;
//   }

//   // Takeoff effect detection
//   useEffect(() => {
//     if (oldMultiplier.current === 1 && multiplier > 1 && !crashed) {
//       setIsTakingOff(true);
//       setTimeout(() => setIsTakingOff(false), 800);
//     }
//     oldMultiplier.current = multiplier;
//   }, [multiplier, crashed]);

//   // Explosion on crash
//   useEffect(() => {
//     if (crashed) {
//       const pieces = Array.from({ length: 28 }).map((_, i) => ({
//         id: i,
//         x: (Math.random() - 0.5) * 280,
//         y: (Math.random() - 0.5) * 180 - 40,
//         rotate: Math.random() * 360,
//         scale: 0.3 + Math.random() * 1,
//       }));
//       setExplosionPieces(pieces);
//       setTimeout(() => setExplosionPieces([]), 1500);
//     } else {
//       setExplosionPieces([]);
//     }
//   }, [crashed]);

//   // ---- Scrolling background to simulate forward motion ----
//   const scrollX = Math.min((multiplier - 1) * 15, 2000);
//   const runwayScroll = scrollX % 120; // runway dash movement
//   const cloudScroll = scrollX % 300;

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-96 overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-b from-sky-500 via-sky-300 to-gray-800"
//     >
//       {/* Animated clouds scrolling left */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(5)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute text-6xl text-white/20"
//             animate={{ x: [0, -200] }}
//             transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
//             style={{ top: `${10 + i * 20}%`, left: `${100 + i * 30}%` }}
//           >
//             ☁️
//           </motion.div>
//         ))}
//       </div>

//       {/* Scrolling ground / runway */}
//       <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
//         <motion.div
//           animate={{ x: [-runwayScroll, -runwayScroll - 120] }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="absolute bottom-0 left-0 flex gap-4"
//           style={{ width: '200%' }}
//         >
//           <div className="w-full h-20 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent" />
//           {[...Array(20)].map((_, i) => (
//             <div key={i} className="w-8 h-0.5 bg-yellow-500/60 mt-16" />
//           ))}
//         </motion.div>
//       </div>
//       {/* Runway center lights (scrolling) */}
//       <div className="absolute bottom-3 left-0 right-0 overflow-hidden">
//         <motion.div
//           animate={{ x: [-runwayScroll * 2, -runwayScroll * 2 - 80] }}
//           transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//           className="flex gap-3"
//         >
//           {[...Array(30)].map((_, i) => (
//             <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
//           ))}
//         </motion.div>
//       </div>

//       {/* Takeoff dust effect */}
//       <AnimatePresence>
//         {isTakingOff && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, x: -20, y: 0 }}
//             animate={{ opacity: 0.8, scale: 1.8, x: -60, y: -30 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.6 }}
//             className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-4xl z-10"
//           >
//             💨💨
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Airplane – horizontally centered */}
//       <motion.div
//         animate={{
//           y: planeY,
//           rotate: planeRotation,
//           scale: planeScale,
//         }}
//         transition={{ type: "tween", duration: crashed ? 0.4 : 0.05 }}
//         className="absolute left-1/2 transform -translate-x-1/2 z-20"
//         style={{ x: '-50%' }}
//       >
//         {/* Colorful Realistic SVG Plane */}
//         <svg width="100" height="100" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
//           {/* Fuselage – bright red with gold stripe */}
//           <path d="M25,70 L115,70 L102,56 L38,56 Z" fill="#dc2626" stroke="#eab308" strokeWidth="2" />
//           <path d="M38,60 L102,60 L102,66 L38,66 Z" fill="#eab308" /> {/* gold stripe */}
//           {/* Nose cone – metallic */}
//           <path d="M112,64 L130,70 L112,76 Z" fill="#cbd5e1" stroke="#eab308" strokeWidth="1.5" />
//           {/* Cockpit windows */}
//           <ellipse cx="110" cy="66" rx="5" ry="7" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
//           <ellipse cx="110" cy="74" rx="5" ry="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
//           {/* Passenger windows */}
//           <g fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5">
//             <rect x="45" y="62" width="7" height="5" rx="2" />
//             <rect x="57" y="62" width="7" height="5" rx="2" />
//             <rect x="69" y="62" width="7" height="5" rx="2" />
//             <rect x="81" y="62" width="7" height="5" rx="2" />
//             <rect x="93" y="62" width="7" height="5" rx="2" />
//           </g>
//           {/* Main wings – dark gray with red tips */}
//           <path d="M40,70 L12,92 L6,84 L28,70 Z" fill="#334155" stroke="#eab308" strokeWidth="1.5" />
//           <path d="M100,70 L128,92 L134,84 L112,70 Z" fill="#334155" stroke="#eab308" strokeWidth="1.5" />
//           <path d="M12,92 L6,84 L8,82 L16,88 Z" fill="#dc2626" /> {/* red tip */}
//           <path d="M128,92 L134,84 L132,82 L124,88 Z" fill="#dc2626" />
//           {/* <!-- Wing flaps --> */}
//           <path d="M28,70 L12,84 L14,87 L31,73 Z" fill="#475569" />
//           <path d="M112,70 L128,84 L126,87 L109,73 Z" fill="#475569" />
//           {/* <!-- Tail fin (vertical) --> */}
//           <path d="M35,56 L14,28 L22,24 L42,52 Z" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
//           {/* <!-- Horizontal stabilizers --> */}
//           <path d="M37,56 L22,42 L18,44 L32,58 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
//           <path d="M37,56 L22,70 L18,68 L32,54 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
//           {/* <!-- Engines (turbofans with glow) --> */}
//           <ellipse cx="28" cy="70" rx="8" ry="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
//           <ellipse cx="28" cy="70" rx="4" ry="8" fill="#0f172a" />
//           <ellipse cx="20" cy="70" rx="2.5" ry="5" fill="rgba(250,204,21,0.8)" /> {/* <!-- exhaust glow --> */}
//           {/* <!-- Spinning fan in engine --> */}
//           {!crashed && multiplier > 1 && (
//             <motion.g
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.12, repeat: Infinity, ease: "linear" }}
//               transform="translate(24,70)"
//             >
//               <line x1="-12" y1="0" x2="12" y2="0" stroke="#cbd5e1" strokeWidth="3" />
//               <line x1="0" y1="-12" x2="0" y2="12" stroke="#cbd5e1" strokeWidth="3" />
//             </motion.g>
//           )}
//           {/* <!-- Contrails (engine smoke) --> */}
//           {!crashed && multiplier > 1.2 && (
//             <ellipse cx="16" cy="72" rx="4" ry="6" fill="white" opacity="0.6" />
//           )}
//         </svg>
//       </motion.div>

//       {/* ContraIL (trail behind plane – fixed relative to plane) */}
//       {!crashed && multiplier > 1.15 && (
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: 80 }}
//           className="absolute h-2 bg-white/30 blur-sm rounded-full"
//           style={{ top: planeY + 12, left: 'calc(50% - 50px)' }}
//         />
//       )}

//       {/* Speed lines (appear at high multiplier) */}
//       {!crashed && multiplier > 2.2 && (
//         <motion.div
//           animate={{ opacity: [0, 0.6, 0] }}
//           transition={{ duration: 0.15, repeat: Infinity }}
//           className="absolute pointer-events-none w-full h-full"
//         >
//           <div className="absolute top-1/3 right-10 w-24 h-0.5 bg-white/60 -rotate-12" />
//           <div className="absolute top-2/3 right-5 w-16 h-0.5 bg-white/40 rotate-12" />
//         </motion.div>
//       )}

//       {/* Explosion pieces */}
//       <AnimatePresence>
//         {crashed &&
//           explosionPieces.map((p) => (
//             <motion.div
//               key={p.id}
//               initial={{ x: '50%', y: planeY, opacity: 1, scale: 1 }}
//               animate={{
//                 x: `calc(50% + ${p.x}px)`,
//                 y: planeY + p.y,
//                 opacity: 0,
//                 scale: p.scale,
//                 rotate: p.rotate,
//               }}
//               transition={{ duration: 0.7, ease: "easeOut" }}
//               className="absolute text-3xl pointer-events-none z-30"
//               style={{ left: '50%' }}
//             >
//               {["💥", "🔥", "🧨", "⚡", "💨", "🧩", "💢"][p.id % 7]}
//             </motion.div>
//           ))}
//       </AnimatePresence>

//       {/* Crash overlay */}
//       {crashed && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", bounce: 0.3 }}
//             className="text-center"
//           >
//             <div className="text-6xl mb-2">💥🔥</div>
//             <div className="text-3xl font-black text-red-500 uppercase tracking-wider">
//               CRASHED!
//             </div>
//             <div className="text-base text-red-300 mt-1 font-mono">@{multiplier.toFixed(2)}x</div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaneAnimation;
























import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlaneAnimation = ({ multiplier, crashed }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [explosionPieces, setExplosionPieces] = useState([]);
  const [isTakingOff, setIsTakingOff] = useState(false);
  const oldMultiplier = useRef(multiplier);
  const frameRef = useRef();

  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // --- Flight path ---
  // Map multiplier to X position: multiplier 1 → X=0, multiplier 10 → X=width (full screen)
  const maxMultiplier = 10;
  let rawX = ((multiplier - 1) / (maxMultiplier - 1)) * dimensions.width;
  const planeWidth = 80; // approximate width of plane SVG
  let planeX = Math.min(Math.max(rawX, 0), dimensions.width - planeWidth);
  
  // Determine flight phase: climb until X reaches half of container, then cruise
  const midX = dimensions.width / 2;
  const isClimbing = !crashed && planeX < midX;
  const isCruising = !crashed && planeX >= midX;
  
  // Y position: ground level = height - 60, cruise level = height * 0.35
  const groundY = dimensions.height - 60;
  const cruiseY = dimensions.height * 0.35;
  let planeY = groundY;
  let planeRotation = 0;
  let planeScale = 1;
  
  if (!crashed) {
    if (isClimbing) {
      // Diagonal climb: progress from 0 to 1 as X goes from 0 to midX
      const climbProgress = planeX / midX;
      const easeOut = 1 - Math.pow(1 - climbProgress, 2);
      planeY = groundY - (groundY - cruiseY) * easeOut;
      planeRotation = -15 * (1 - easeOut); // nose up, flattens as climb ends
      planeScale = 1 + climbProgress * 0.2;
    } else if (isCruising) {
      // Cruising: gentle bobbing and banking
      const bob = Math.sin(Date.now() / 350) * 5;
      planeY = cruiseY + bob;
      planeRotation = Math.sin(Date.now() / 450) * 3;
      // Scale increases with multiplier (up to 1.5x)
      planeScale = Math.min(1 + (multiplier - 1) * 0.07, 1.5);
    }
    // Bound Y
    planeY = Math.min(Math.max(planeY, 40), dimensions.height - 50);
  } else {
    // Crash: fall to ground and spin
    planeY = Math.min(planeY + 8, dimensions.height - 50);
    planeRotation = (Date.now() % 720) - 360;
    planeScale = 1;
  }

  // Takeoff effect trigger (when multiplier just passed 1)
  useEffect(() => {
    if (oldMultiplier.current === 1 && multiplier > 1 && !crashed) {
      setIsTakingOff(true);
      setTimeout(() => setIsTakingOff(false), 800);
    }
    oldMultiplier.current = multiplier;
  }, [multiplier, crashed]);

  // Explosion on crash
  useEffect(() => {
    if (crashed) {
      const pieces = Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 180 - 40,
        rotate: Math.random() * 360,
        scale: 0.3 + Math.random() * 1,
      }));
      setExplosionPieces(pieces);
      setTimeout(() => setExplosionPieces([]), 1500);
    } else {
      setExplosionPieces([]);
    }
  }, [crashed]);

  // Scrolling background (runway, lights) to simulate forward motion
  const scrollX = Math.min((multiplier - 1) * 25, 2000);
  const runwayScroll = scrollX % 120;
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-b from-sky-500 via-sky-300 to-gray-800"
    >
      {/* Animated clouds scrolling left */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl text-white/20"
            animate={{ x: [0, -200] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ top: `${10 + i * 20}%`, left: `${100 + i * 30}%` }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Scrolling ground / runway dashes */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <motion.div
          animate={{ x: [-runwayScroll, -runwayScroll - 120] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 flex gap-4"
          style={{ width: '200%' }}
        >
          <div className="w-full h-20 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent" />
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-8 h-0.5 bg-yellow-500/60 mt-16" />
          ))}
        </motion.div>
      </div>
      {/* Runway center lights scrolling */}
      <div className="absolute bottom-3 left-0 right-0 overflow-hidden">
        <motion.div
          animate={{ x: [-runwayScroll * 2, -runwayScroll * 2 - 80] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          className="flex gap-3"
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          ))}
        </motion.div>
      </div>

      {/* Takeoff dust effect (appears at left side during takeoff) */}
      <AnimatePresence>
        {isTakingOff && !crashed && planeX < 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: planeX - 20, y: planeY }}
            animate={{ opacity: 0.8, scale: 1.8, x: planeX - 60, y: planeY - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute text-4xl z-10"
          >
            💨💨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main airplane – positioned absolutely with left offset */}
      <motion.div
        animate={{
          x: planeX,
          y: planeY,
          rotate: planeRotation,
          scale: planeScale,
        }}
        transition={{ type: "tween", duration: crashed ? 0.4 : 0.05 }}
        className="absolute z-20"
        style={{ left: 0, top: 0 }}
      >
        {/* Colorful Realistic SVG Plane */}
        <svg width="90" height="90" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          {/* Fuselage – bright red with gold stripe */}
          <path d="M25,70 L115,70 L102,56 L38,56 Z" fill="#dc2626" stroke="#eab308" strokeWidth="2" />
          <path d="M38,60 L102,60 L102,66 L38,66 Z" fill="#eab308" />
          {/* Nose cone */}
          <path d="M112,64 L130,70 L112,76 Z" fill="#cbd5e1" stroke="#eab308" strokeWidth="1.5" />
          {/* Cockpit windows */}
          <ellipse cx="110" cy="66" rx="5" ry="7" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="110" cy="74" rx="5" ry="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
          {/* Passenger windows */}
          <g fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5">
            <rect x="45" y="62" width="7" height="5" rx="2" />
            <rect x="57" y="62" width="7" height="5" rx="2" />
            <rect x="69" y="62" width="7" height="5" rx="2" />
            <rect x="81" y="62" width="7" height="5" rx="2" />
            <rect x="93" y="62" width="7" height="5" rx="2" />
          </g>
          {/* Main wings */}
          <path d="M40,70 L12,92 L6,84 L28,70 Z" fill="#334155" stroke="#eab308" strokeWidth="1.5" />
          <path d="M100,70 L128,92 L134,84 L112,70 Z" fill="#334155" stroke="#eab308" strokeWidth="1.5" />
          <path d="M12,92 L6,84 L8,82 L16,88 Z" fill="#dc2626" />
          <path d="M128,92 L134,84 L132,82 L124,88 Z" fill="#dc2626" />
          {/* Wing flaps */}
          <path d="M28,70 L12,84 L14,87 L31,73 Z" fill="#475569" />
          <path d="M112,70 L128,84 L126,87 L109,73 Z" fill="#475569" />
          {/* Tail fin */}
          <path d="M35,56 L14,28 L22,24 L42,52 Z" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
          {/* Horizontal stabilizers */}
          <path d="M37,56 L22,42 L18,44 L32,58 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
          <path d="M37,56 L22,70 L18,68 L32,54 Z" fill="#334155" stroke="#eab308" strokeWidth="1" />
          {/* Engines */}
          <ellipse cx="28" cy="70" rx="8" ry="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="28" cy="70" rx="4" ry="8" fill="#0f172a" />
          <ellipse cx="20" cy="70" rx="2.5" ry="5" fill="rgba(250,204,21,0.8)" />
          {/* Spinning fan */}
          {!crashed && multiplier > 1 && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 0.12, repeat: Infinity, ease: "linear" }}
              transform="translate(24,70)"
            >
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#cbd5e1" strokeWidth="3" />
            </motion.g>
          )}
          {/* Contrails (engine smoke) */}
          {!crashed && multiplier > 1.2 && (
            <ellipse cx="16" cy="72" rx="4" ry="6" fill="white" opacity="0.6" />
          )}
        </svg>
      </motion.div>

      {/* Contrail (vapor trail behind plane) */}
      {!crashed && multiplier > 1.15 && planeX > 20 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: Math.min(planeX - 10, 100) }}
          className="absolute h-2 bg-white/30 blur-sm rounded-full"
          style={{ top: planeY + 12, left: planeX - 40 }}
        />
      )}

      {/* Speed lines (appear at high multiplier) */}
      {!crashed && multiplier > 2.2 && planeX > dimensions.width * 0.3 && (
        <motion.div
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.15, repeat: Infinity }}
          className="absolute pointer-events-none w-full h-full"
        >
          <div className="absolute top-1/3 right-10 w-24 h-0.5 bg-white/60 -rotate-12" />
          <div className="absolute top-2/3 right-5 w-16 h-0.5 bg-white/40 rotate-12" />
        </motion.div>
      )}

      {/* Explosion pieces */}
      <AnimatePresence>
        {crashed &&
          explosionPieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: planeX + 40, y: planeY + 20, opacity: 1, scale: 1 }}
              animate={{
                x: planeX + 40 + p.x,
                y: planeY + 20 + p.y,
                opacity: 0,
                scale: p.scale,
                rotate: p.rotate,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute text-3xl pointer-events-none z-30"
            >
              {["💥", "🔥", "🧨", "⚡", "💨", "🧩", "💢"][p.id % 7]}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Crash overlay */}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="text-center"
          >
            <div className="text-6xl mb-2">💥🔥</div>
            <div className="text-3xl font-black text-red-500 uppercase tracking-wider">
              CRASHED!
            </div>
            <div className="text-base text-red-300 mt-1 font-mono">@{multiplier.toFixed(2)}x</div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlaneAnimation;