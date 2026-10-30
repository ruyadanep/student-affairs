
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const sections = [
  { label: "Overview", id: "introduction" },
  { label: "History", id: "history" },
  { label: "Mission & Vision", id: "mission-vision" },
  { label: "Core Values", id: "core-values" },
  { label: "Our Mandate", id: "mandate" },
  { label: "Structure", id: "organisational-structure" },
  { label: "Services", id: "services" },
  { label: "Units", id: "units" },
  { label: "Student Life", id: "student-life" },
  { label: "Policies", id: "policies" },
  { label: "Dean's Message", id: "dean" },
  { label: "Leadership", id: "leadership" },
  { label: "Resources", id: "resources" },
  { label: "Contact", id: "contact-information" },
];

export default function AboutSectionNav() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const top = wrapperRef.current.getBoundingClientRect().top;
      setIsFixed(top <= 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const nav = (
    <nav
      className={`about-section-nav ${isFixed ? "is-fixed" : ""}`}
      aria-label="About Student Affairs sections"
    >
      <div className="about-container about-section-nav-inner">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );

  return (
    <div ref={wrapperRef} className="about-section-nav-wrapper">
      {mounted && isFixed
        ? createPortal(nav, document.body)
        : nav}
    </div>
  );
}
