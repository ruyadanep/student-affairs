
"use client";

import { useEffect, useState } from "react";

type HeroSlide = {
  _id: string;
  title?: string;
  headline: string;
  subheadline?: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const fallbackSlide: HeroSlide = {
    _id: "default-hero",
    headline: "Supporting Every Student, Every Step of the Way",
    subheadline:
      "Welcome to the Plateau State University Student Affairs Portal. Access student services, accommodation, clearance, welfare support and important university information in one place.",
  };

  const heroSlides = slides.length > 0 ? slides : [fallbackSlide];

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    if (heroSlides.length <= 1 || paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length, paused]);

  function goToSlide(index: number) {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }

  return (
    <section
      className="home-hero home-hero-carousel"
      aria-label="Student Affairs highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="home-hero-background" key={activeSlide._id}>
        {activeSlide.imageUrl && (
          <img
            src={activeSlide.imageUrl}
            alt={activeSlide.imageAlt || ""}
            className="home-hero-background-image"
          />
        )}
      </div>

      <div className="home-hero-overlay" />

      <div className="home-hero-decoration home-hero-decoration-one" />
      <div className="home-hero-decoration home-hero-decoration-two" />

      <div className="home-container home-hero-container">
        <div className="home-hero-content" key={activeSlide._id}>
          <div className="home-eyebrow hero-animate hero-animate-eyebrow">
            <span className="home-eyebrow-dot" />
            PLATEAU STATE UNIVERSITY
          </div>

          <h1 className="hero-animate hero-animate-heading">
            {activeSlide.headline}
          </h1>

          <p className="home-hero-description hero-animate hero-animate-description">
            {activeSlide.subheadline ||
              "Supporting student welfare, development and success throughout university life."}
          </p>

          <div className="home-hero-actions hero-animate hero-animate-buttons">
            <a
              href={activeSlide.ctaUrl || "/dashboard"}
              className="home-btn-primary"
            >
              {activeSlide.ctaLabel || "Access Student Portal"}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </a>

            <a href="/support" className="home-btn-outline">
              Student Support
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </div>

          <div className="home-hero-note hero-animate hero-animate-note">
            <span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </span>
            Your university services, accessible in one place.
          </div>
        </div>
      </div>

      {heroSlides.length > 1 && (
        <div className="home-hero-controls">
          <button
            type="button"
            className="home-hero-arrow"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label="Previous slide"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="home-hero-indicators" aria-label="Choose a slide">
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={slide._id}
                className={`home-hero-dot ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="home-hero-arrow"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label="Next slide"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      )}

      {heroSlides.length > 1 && (
        <button
          type="button"
          className="home-hero-pause"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Resume automatic slides" : "Pause automatic slides"}
        >
          {paused ? "Play slideshow" : "Pause slideshow"}
        </button>
      )}
    </section>
  );
}
