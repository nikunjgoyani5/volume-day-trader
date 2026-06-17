"use client";

import { useRef } from "react";
import VectorArrow from "@/components/ui/vector-arrow/VectorArrow";

interface GrowraButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export default function GrowraButton({
  label = "Contact",
  href = "#Contact",
  onClick,
}: GrowraButtonProps) {
  const circleRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (circleRef.current) {
      circleRef.current.style.left = `${x}px`;
      circleRef.current.style.top = `${y}px`;
    }
  };

  return (
    <>
      <style>{`
        .growra-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          border-radius: 1000px;
          padding: 12px 24px;
          background-color: #ED1F24;
          box-shadow: inset 0 1.413px 3.178px rgba(255, 255, 255, 0.502);
          line-height: 1.6;
          cursor: pointer;
          border: none;
        }
        .growra-btn:hover,
        .growra-btn:focus-visible {
          background-color: #ED1F24;
        }

        /* Ripple fill circle */
        .growra-circle-wrap {
          position: absolute;
          inset: -0.0625px;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 0;
        }
        .growra-circle-bg {
          position: absolute;
          width: 200%;
          padding-top: 0;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .growra-circle {
          position: absolute;
          background-color: #ED1F24;
          border-radius: 50%;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%) scale(0);
          transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1),
                      height 0.55s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .growra-btn:hover .growra-circle,
        .growra-btn:focus-visible .growra-circle {
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%) scale(1);
        }

        /* Button content */
        .growra-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Text letter animation */
        .growra-text-wrap {
          overflow: hidden;
        }
        .growra-label {
          opacity: 0.9;
          color: #ffffff;
          font-weight: 600;
          font-family: "Inter Tight", sans-serif;
          font-size: 16px;
          display: inline-flex;
        }
        .growra-letter {
          display: inline-block;
          text-shadow: 0 1.25em 0 #ffffff;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: calc(var(--i) * 0.03s);
        }
        .growra-btn:hover .growra-letter {
          transform: translateY(-1.25em);
        }

        /* Site Vector arrow — slides up-right on hover (same as navbar) */
        .growra-icon-wrap {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
        }
        .growra-btn .vector-arrow {
          position: relative;
          display: inline-grid;
          place-items: center;
          width: 14px;
          height: 14px;
          overflow: hidden;
          color: #ffffff;
        }
        .growra-btn .vector-arrow__svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .growra-btn .vector-arrow__svg:first-of-type {
          transform: translate(0, 0);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s;
        }
        .growra-btn:hover .vector-arrow__svg:first-of-type,
        .growra-btn:focus-visible .vector-arrow__svg:first-of-type {
          transform: translate(150%, -150%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s;
        }
        .growra-btn .vector-arrow__svg--copy {
          position: absolute;
          inset: 0;
          transform: translate(-150%, 150%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s;
        }
        .growra-btn:hover .vector-arrow__svg--copy,
        .growra-btn:focus-visible .vector-arrow__svg--copy {
          transform: translate(0, 0);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s;
        }
        .growra-btn .vector-arrow__svg path {
          stroke: currentColor;
        }
      `}</style>

      <a
        href={href}
        className="growra-btn"
        onMouseMove={handleMouseMove}
        onClick={onClick}
      >
        {/* Ripple Circle */}
        <div className="growra-circle-wrap">
          <div
            ref={circleRef}
            className="growra-circle"
            style={{ position: "absolute" }}
          />
        </div>

        {/* Content */}
        <div className="growra-content">
          <div className="growra-text-wrap">
            <div className="growra-label" aria-label={label}>
              {label.split("").map((char, i) => (
                <span
                  key={i}
                  className="growra-letter"
                  aria-hidden="true"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="growra-icon-wrap">
            <VectorArrow />
          </div>
        </div>
      </a>
    </>
  );
}