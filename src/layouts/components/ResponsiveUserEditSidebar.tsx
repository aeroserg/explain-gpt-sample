import { useRef, useState, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { motion, AnimatePresence } from "framer-motion";
import { UserEditSidebar } from "./UserEditSidebar";

export const ResponsiveUserEditSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const bind = useDrag(({ movement: [mx], last }) => {
    if (last && mx > 100) setIsOpen(true);
    if (last && mx < -100) setIsOpen(false);
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isOpen &&
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    const preventSwipeNav = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (touch.clientX < 20 || touch.clientX > window.innerWidth - 20) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchstart", preventSwipeNav, { passive: false });
    return () => {
      document.removeEventListener("touchstart", preventSwipeNav);
    };
  }, []);

  const handleSidebarItemClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white h-[60px] flex items-center px-4 shadow">
        <button onClick={() => setIsOpen(true)} className="text-xl font-bold">☰</button>
        <span className="ml-4 font-semibold text-lg">Настройки</span>
      </div>

      <div
        {...bind()}
        className="fixed top-0 left-0 w-[20px] h-full z-30 lg:hidden"
        style={{ touchAction: "pan-y" }}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={overlayRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 z-50 h-full bg-white w-[340px] lg:hidden"
            >
              <UserEditSidebar onItemClick={handleSidebarItemClick} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:block">
        <UserEditSidebar />
      </div>
    </>
  );
};
