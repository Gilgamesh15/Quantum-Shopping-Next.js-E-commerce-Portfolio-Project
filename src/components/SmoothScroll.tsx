"use client";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface SmoothScrollProps {
  children: ReactNode;
  rootElement?: React.RefObject<HTMLElement>; // Optional root element for scrolling
}

export default function SmoothScroll({
  children,
  rootElement,
}: SmoothScrollProps) {
  // Ref for measuring the actual height of the inner content
  const contentRef = useRef<HTMLDivElement>(null);

  // State to keep track of the actual height of the inner content
  const [contentHeight, setContentHeight] = useState(0);

  // Measure scroll progress (0-1) through the specified element or entire webpage
  const { scrollYProgress } = useScroll({
    target: rootElement,
    offset: ["start start", "end end"],
  });

  // Apply spring effect to the scroll progress for smoother animation
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1 });

  // Transform smooth progress to actual Y position
  const y = useTransform(smoothProgress, (value) => {
    return (
      value *
      -(
        contentHeight -
        (rootElement?.current?.clientHeight || window.innerHeight)
      )
    );
  });

  // Update content height when content or window size changes
  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [contentRef, children]);

  return (
    <>
      {/* Placeholder div to create scrollable area */}
      <div style={{ height: contentHeight }} />

      {/* Animated content container */}
      <motion.div
        className="w-full fixed flex flex-col top-0"
        style={{ y }}
        ref={contentRef}
      >
        {children}
      </motion.div>
    </>
  );
}
