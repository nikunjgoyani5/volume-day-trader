"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import FlowTextLabel from "@/components/ui/flow-text/FlowTextLabel";
import { useState } from "react";
import type { MouseEvent } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  active?: boolean;
}

export default function NavLink({ href, label, onClick, className, active = false }: NavLinkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("font-normal", className)}
      style={{
        color: "#A7ADBE",
        padding: "0.06em 0",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1.08,
        verticalAlign: "middle",
      }}
    >
      <FlowTextLabel label={label} hovered={hovered} />
    </Link>
  );
}
