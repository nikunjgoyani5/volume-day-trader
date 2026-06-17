"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform float uAmplitude;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  0.366025403784439,
   -0.577350269189626,  0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy  -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m * m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz  + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec4 band(
  vec2  uv,
  float t,
  float yCenter,
  float amp,
  float thickness,
  vec3  colA,
  vec3  colB,
  float opacity
) {
  float wave = snoise(vec2(uv.x * 1.5 + t * 0.1, t * 0.2)) * amp * uAmplitude;

  float dist = uv.y - (yCenter + wave * 0.15);
  float mask = exp(-dist * dist / (thickness * thickness));

  vec3 col = mix(colA, colB, uv.x);
  col *= mask;

  return vec4(col, mask * opacity);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime;

  float ph  = (sin(t * 0.032) + 1.0) * 0.5;
  vec3 cA = mix(uColorA, uColorB, ph);
  vec3 cB = mix(uColorB, uColorC, ph);
  vec3 cC = mix(uColorC, uColorA, ph);

  vec4 l1 = band(uv, t * 0.55, 0.65, 0.55, 0.28, uColorA, uColorB, 0.55);
  vec4 l2 = band(uv, t * 1.05, 0.75, 0.90, 0.18, uColorB, cB,      0.55);
  vec4 l3 = band(uv, t * 0.40, 0.85, 0.45, 0.14, cB,      cC,      0.30);
  vec4 l4 = band(uv, t * 2.10, 0.80, 0.70, 0.07, uColorC, uColorB, 0.18);
  vec4 l5 = band(uv, t * 0.28, 0.90, 0.35, 0.20, uColorB, uColorC, 0.12);

  vec3 col   = l1.rgb*l1.a + l2.rgb*l2.a + l3.rgb*l3.a + l4.rgb*l4.a + l5.rgb*l5.a;
  float alpha = clamp(l1.a + l2.a + l3.a + l4.a + l5.a, 0.0, 0.93);

  alpha *= smoothstep(0.0, 0.6, uv.y);

  fragColor = vec4(col, alpha);
}
`;

interface AuroraProps {
  speed?: number;
  amplitude?: number;
  colorStops?: string[];
  className?: string;
  style?: React.CSSProperties;
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
};

export default function Aurora({
  speed = 1.0,
  amplitude = 1.0,
  colorStops = ["#0012B8", "#00F0FF", "#0040FF"],
  className = "",
  style,
}: AuroraProps) {
  const ctnRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const colorKey = colorStops.join(",");

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    const DPR = Math.min(window.devicePixelRatio ?? 1, 1.5);

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const cvs = gl.canvas as HTMLCanvasElement;
    cvs.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;background:transparent;display:block;";
    ctn.appendChild(cvs);

    const geometry = new Triangle(gl);
    const geo = geometry as Triangle & { attributes?: { uv?: unknown } };
    if (geo.attributes?.uv) delete geo.attributes.uv;

    const cA = hexToRgb(colorStops[0] || "#0012B8");
    const cB = hexToRgb(colorStops[1] || "#00F0FF");
    const cC = hexToRgb(colorStops[2] || "#0040FF");

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth * DPR, ctn.offsetHeight * DPR] },
        uColorA: { value: cA },
        uColorB: { value: cB },
        uColorC: { value: cC },
        uAmplitude: { value: amplitude },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const ro = new ResizeObserver(() => {
      const w = ctn.offsetWidth * DPR;
      const h = ctn.offsetHeight * DPR;
      renderer.setSize(w, h);
      cvs.style.width = "100%";
      cvs.style.height = "100%";
      program.uniforms.uResolution.value = [w, h];
    });
    ro.observe(ctn);

    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(ctn);

    renderer.setSize(ctn.offsetWidth * DPR, ctn.offsetHeight * DPR);

    let rafId = 0;
    let lastT = 0;
    let accT = 0;

    const tick = (t: number) => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;

      const dt = Math.min(t - lastT, 50);
      lastT = t;
      accT += dt * speedRef.current;
      program.uniforms.uTime.value = accT * 0.001;
      renderer.render({ scene: mesh });
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      if (cvs.parentNode === ctn) ctn.removeChild(cvs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, colorKey]);

  return (
    <div
      ref={ctnRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    />
  );
}
