"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";

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
  const [previousSlide, setPreviousSlide] = useState<HeroSlide | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const previousSlideRef = useRef<HeroSlide | null>(null);

  const activeSlide = heroSlides[activeIndex] || heroSlides[0];

  const paused = userPaused || isHovered || isFocused || reducedMotion;

  // Detect the user's motion preference.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotion = () => setReducedMotion(media.matches);

    updateMotion();
    media.addEventListener("change", updateMotion);

    return () => media.removeEventListener("change", updateMotion);
  }, []);

  // Automatically advance slides.
  // The timer restarts whenever the active slide changes.
  useEffect(() => {
    if (heroSlides.length <= 1 || paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length, paused, activeIndex]);

  // Keep the previous background image briefly for crossfade.
  useEffect(() => {
    if (previousSlideRef.current?._id === activeSlide._id) {
      return;
    }

    setPreviousSlide(previousSlideRef.current);
    previousSlideRef.current = activeSlide;

    const timeout = window.setTimeout(() => {
      setPreviousSlide(null);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [activeSlide]);

  // Keep the index valid when CMS slides are added or removed.
  useEffect(() => {
    setActiveIndex((current) =>
      Math.min(current, heroSlides.length - 1)
    );
  }, [heroSlides.length]);

  function goToSlide(index: number) {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (
      !event.currentTarget.contains(
        event.relatedTarget as Node | null
      )
    ) {
      setIsFocused(false);
    }
  }

  return (
    <section
      className="home-hero home-hero-carousel"
      aria-label="Student Affairs highlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={handleBlur}
    >
      {/* Animated background images */}
      <div className="home-hero-background" aria-hidden="true">
        {previousSlide?.imageUrl && (
          <img
            key={`previous-${previousSlide._id}`}
            src={previousSlide.imageUrl}
            alt=""
            className="home-hero-background-image is-leaving"
          />
        )}

        {activeSlide.imageUrl && (
          <img
            key={activeSlide._id}
            src={activeSlide.imageUrl}
            alt=""
            fetchPriority="high"
            className="home-hero-background-image is-entering"
          />
        )}
      </div>

      {/* Green overlay */}
      <div className="home-hero-overlay" />

      {/* Decorative elements */}
      <div className="home-hero-decoration home-hero-decoration-one" />
      <div className="home-hero-decoration home-hero-decoration-two" />

      {/* Hero content */}
      <div className="home-container home-hero-container">
        <div
          className="home-hero-content"
          key={activeSlide._id}
        >
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

      {/* Carousel navigation */}
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

          <div
            className="home-hero-indicators"
            aria-label="Choose a slide"
          >
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={slide._id}
                className={`home-hero-dot ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  index === activeIndex ? "true" : undefined
                }
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

      {/* Pause / play */}
      {heroSlides.length > 1 && (
        <button
          type="button"
          className="home-hero-pause"
          onClick={() => setUserPaused((current) => !current)}
          aria-label={
            userPaused
              ? "Resume automatic slides"
              : "Pause automatic slides"
          }
        >
          <span>{userPaused ? "▶" : "Ⅱ"}</span>
          {userPaused ? "Play slideshow" : "Pause slideshow"}
        </button>
      )}
    </section>
  );
}
