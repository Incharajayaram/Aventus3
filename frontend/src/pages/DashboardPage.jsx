import React, { useEffect, useRef, useState } from "react";
import Intro from "./Intro";
import Dashboard from "./Dashboard";

const DashboardPage = () => {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = intro, 1 = dashboard
  const pages = [<Intro />, <Dashboard />];

  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();

      if (e.deltaY > 50 && currentPage === 0) {
        setCurrentPage(1);
      } else if (e.deltaY < -50 && currentPage === 1) {
        setCurrentPage(0);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [currentPage]);

  useEffect(() => {
    containerRef.current.scrollTo({
      top: currentPage * window.innerHeight,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="h-[200vh]">
        {/* Pages stacked vertically */}
        <div className="h-screen">{pages[0]}</div>
        <div className="h-screen">{pages[1]}</div>
      </div>
    </div>
  );
};

export default DashboardPage;
