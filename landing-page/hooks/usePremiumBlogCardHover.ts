"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

/** Luxury ease — close to cubic-bezier(0.22, 1, 0.36, 1) */
const EASE_LUX = "power3.out";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const CARD_SHADOW_REST =
  "0px -4px 100px 21px rgba(24, 25, 51, 0.2) inset";
const CARD_SHADOW_HOVER =
  "0px -4px 100px 21px rgba(24, 25, 51, 0.2) inset, 0 28px 56px -14px rgba(0, 0, 0, 0.55)";

export function usePremiumBlogCardHover() {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const activeTween = useRef<gsap.core.Timeline | null>(null);

  const killActive = useCallback(() => {
    activeTween.current?.kill();
    activeTween.current = null;
  }, []);

  const getSweepDistance = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return 320;
    return media.offsetWidth * 1.15;
  }, []);

  const onEnter = useCallback(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const light = lightRef.current;
    if (!card || !image || !light) return;

    killActive();

    if (prefersReducedMotion()) {
      gsap.to(card, { y: -4, duration: 0.3, ease: "power2.out" });
      gsap.to(image, { scale: 1.03, duration: 0.3, ease: "power2.out" });
      return;
    }

    const sweep = getSweepDistance();

    gsap.set(light, {
      x: -sweep,
      opacity: 0,
      rotation: 25,
      force3D: true,
    });
    gsap.set(image, { transformOrigin: "center center", force3D: true });

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    tl.to(
      card,
      {
        y: -8,
        duration: 0.5,
        ease: EASE_LUX,
        force3D: true,
        boxShadow: CARD_SHADOW_HOVER,
      },
      0
    )
      .to(
        image,
        {
          scale: 1.08,
          rotation: 1.5,
          duration: 0.7,
          ease: EASE_LUX,
          force3D: true,
        },
        0
      )
      .to(
        light,
        {
          x: sweep,
          opacity: 0.9,
          duration: 0.85,
          ease: EASE_LUX,
          force3D: true,
        },
        0
      )
      .to(light, { opacity: 0, duration: 0.15, ease: "power1.out" }, 0.7);

    activeTween.current = tl;
  }, [getSweepDistance, killActive]);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const light = lightRef.current;
    if (!card || !image || !light) return;

    killActive();

    if (prefersReducedMotion()) {
      gsap.to(card, {
        y: 0,
        boxShadow: CARD_SHADOW_REST,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(image, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      return;
    }

    const sweep = getSweepDistance();

    gsap.set(light, { x: sweep, opacity: 0, rotation: 25, force3D: true });

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    tl.to(
      light,
      {
        x: -sweep,
        opacity: 0.75,
        duration: 0.5,
        ease: "power2.inOut",
        force3D: true,
      },
      0
    )
      .to(light, { opacity: 0, duration: 0.12, ease: "power1.out" }, 0.4)
      .to(
        image,
        {
          scale: 1.03,
          rotation: 0.5,
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
        },
        0
      )
      .to(
        image,
        {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "ease-out",
          force3D: true,
        },
        0.3
      )
      .to(
        card,
        {
          y: 0,
          duration: 0.6,
          ease: "ease-out",
          force3D: true,
          boxShadow: CARD_SHADOW_REST,
        },
        0
      );

    activeTween.current = tl;
  }, [getSweepDistance, killActive]);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const light = lightRef.current;
    if (!card || !image || !light) return;

    gsap.set(card, { y: 0, force3D: true, boxShadow: CARD_SHADOW_REST });
    gsap.set(image, {
      scale: 1,
      rotation: 0,
      transformOrigin: "center center",
      force3D: true,
    });
    gsap.set(light, { x: -400, opacity: 0, rotation: 25, force3D: true });

    return () => {
      killActive();
    };
  }, [killActive]);

  return {
    cardRef,
    mediaRef,
    imageRef,
    lightRef,
    onEnter,
    onLeave,
  };
}
