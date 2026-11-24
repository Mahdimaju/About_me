"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/useReducedMotion";

const MAX_RIPPLES = 16;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_imageAspect;
  uniform vec2 u_focal;
  uniform float u_displacement;
  uniform float u_causticIntensity;
  uniform vec4 u_ripples[${MAX_RIPPLES}]; // xy = uv pos, z = startTime, w = strength

  varying vec2 v_uv;

  vec2 getCoverUv(vec2 uv, vec2 res, float imgAspect, vec2 focal) {
    float canvasAspect = res.x / max(res.y, 1.0);
    vec2 scale = vec2(1.0);
    if (canvasAspect > imgAspect) {
      scale.y = imgAspect / canvasAspect;
    } else {
      scale.x = canvasAspect / imgAspect;
    }
    return (uv - focal) * scale + focal;
  }

  float waveHeight(vec2 p, float aspect) {
    float h = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 rip = u_ripples[i];
      if (rip.w <= 0.001) continue;
      float age = u_time - rip.z;
      if (age < 0.0 || age > 2.4) continue;

      vec2 diff = p - rip.xy;
      diff.x *= aspect;
      float dist = length(diff);

      float radius = age * 0.48;
      float ringDist = dist - radius;
      float envelope = exp(-ringDist * ringDist * 75.0) * exp(-age * 1.95);
      float wave = sin(ringDist * 44.0) * envelope * rip.w;
      h += wave;
    }
    return h;
  }

  void main() {
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);

    // Subtle organic liquid breath on lower fluid area
    float eps = 0.0035;
    float hCenter = waveHeight(v_uv, aspect);
    float hRight = waveHeight(v_uv + vec2(eps, 0.0), aspect);
    float hDown = waveHeight(v_uv + vec2(0.0, eps), aspect);

    vec2 grad = vec2(hRight - hCenter, hDown - hCenter) / eps;
    vec2 displacedUv = v_uv + grad * u_displacement * 0.0014;

    vec2 coverUv = getCoverUv(displacedUv, u_resolution, u_imageAspect, u_focal);
    vec2 clampedUv = clamp(coverUv, 0.001, 0.999);

    // Mild chromatic aberration on active ripple crest for liquid glass feel
    float shift = length(grad) * 0.00018;
    float r = texture2D(u_texture, clamp(clampedUv + vec2(shift, 0.0), 0.001, 0.999)).r;
    float g = texture2D(u_texture, clampedUv).g;
    float b = texture2D(u_texture, clamp(clampedUv - vec2(shift, 0.0), 0.001, 0.999)).b;
    vec3 color = vec3(r, g, b);

    // Warm obsidian-ember caustic specular reflection along ripple crests
    vec3 lightDir = normalize(vec3(0.45, -0.55, 0.7));
    vec3 normal = normalize(vec3(-grad.x * 0.12, -grad.y * 0.12, 1.0));
    float spec = pow(max(dot(normal, lightDir), 0.0), 18.0);
    float crest = clamp(length(grad) * 0.045, 0.0, 1.0);

    vec3 emberHighlight = mix(vec3(1.0, 0.35, 0.04), vec3(1.0, 0.82, 0.52), spec);
    color += emberHighlight * crest * u_causticIntensity;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface WaterRippleCanvasProps {
  imageSrc: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  focalPoint?: [number, number];
  displacement?: number;
  causticIntensity?: number;
  /** Listen to pointer events across a parent/window instead of only the canvas itself */
  listenTarget?: "self" | "window";
  /** Mount WebGL only on hover (saves WebGL contexts for project card grids) */
  activateOnHover?: boolean;
  priority?: boolean;
}

export function WaterRippleCanvas({
  imageSrc,
  alt,
  className = "",
  imageClassName = "",
  focalPoint = [0.5, 0.5],
  displacement = 1.0,
  causticIntensity = 0.24,
  listenTarget = "self",
  activateOnHover = false,
}: WaterRippleCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [webglReady, setWebglReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(!activateOnHover);
  const [isVisible, setIsVisible] = useState(true);

  const shouldRunWebGL =
    !reducedMotion && webglSupported && isVisible && (!activateOnHover || isHovered);

  // Observe visibility to pause animation loop offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? true);
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldRunWebGL) {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglSupported(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uImageAspect = gl.getUniformLocation(program, "u_imageAspect");
    const uFocal = gl.getUniformLocation(program, "u_focal");
    const uDisplacement = gl.getUniformLocation(program, "u_displacement");
    const uCaustic = gl.getUniformLocation(program, "u_causticIntensity");
    const uRipples = gl.getUniformLocation(program, "u_ripples");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let disposed = false;
    let imageAspect = 16 / 9;
    let textureLoaded = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (disposed) return;
      imageAspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        textureLoaded = true;
        setWebglReady(true);
      } catch {
        setWebglSupported(false);
      }
    };
    img.onerror = () => {
      if (!disposed) setWebglReady(false);
    };
    img.src = imageSrc;

    // Ring buffer for water ripples
    const ripplesData = new Float32Array(MAX_RIPPLES * 4);
    let rippleIndex = 0;
    let lastDropTime = 0;
    let lastX = -1;
    let lastY = -1;
    const startPerf = performance.now();

    const addRipple = (clientX: number, clientY: number, strength: number, force = false) => {
      const rect = container.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const x = (clientX - rect.left) / Math.max(rect.width, 1);
      const y = (clientY - rect.top) / Math.max(rect.height, 1);
      const now = (performance.now() - startPerf) / 1000;

      if (!force) {
        const moved = Math.hypot(x - lastX, y - lastY);
        if (moved < 0.022 && now - lastDropTime < 0.09) return;
      }

      lastDropTime = now;
      lastX = x;
      lastY = y;

      const offset = rippleIndex * 4;
      ripplesData[offset] = x;
      ripplesData[offset + 1] = y;
      ripplesData[offset + 2] = now;
      ripplesData[offset + 3] = strength;
      rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
    };

    // Trigger subtle opening drop on hero liquid area so user immediately notices living surface
    if (listenTarget === "window") {
      ripplesData[0] = 0.52;
      ripplesData[1] = 0.84;
      ripplesData[2] = 0.1;
      ripplesData[3] = 0.75;
      rippleIndex = 1;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      addRipple(e.clientX, e.clientY, 0.85);
    };

    const handlePointerDown = (e: PointerEvent) => {
      addRipple(e.clientX, e.clientY, 1.55, true);
    };

    const target: EventTarget = listenTarget === "window" ? window : container;
    target.addEventListener("pointermove", handlePointerMove as EventListener, {
      passive: true,
    });
    target.addEventListener("pointerdown", handlePointerDown as EventListener, {
      passive: true,
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId = 0;
    let tabHidden = document.hidden;

    const handleVisibility = () => {
      tabHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = () => {
      rafId = window.requestAnimationFrame(render);
      if (tabHidden || !textureLoaded) return;

      const elapsed = (performance.now() - startPerf) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uImageAspect, imageAspect);
      gl.uniform2f(uFocal, focalPoint[0], focalPoint[1]);
      gl.uniform1f(uDisplacement, displacement);
      gl.uniform1f(uCaustic, causticIntensity);
      gl.uniform4fv(uRipples, ripplesData);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      target.removeEventListener("pointermove", handlePointerMove as EventListener);
      target.removeEventListener("pointerdown", handlePointerDown as EventListener);
      gl.deleteTexture(texture);
      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, [
    shouldRunWebGL,
    imageSrc,
    focalPoint,
    displacement,
    causticIntensity,
    listenTarget,
  ]);

  const objectPositionStyle = `${Math.round(focalPoint[0] * 100)}% ${Math.round(
    focalPoint[1] * 100
  )}%`;

  return (
    <div
      ref={containerRef}
      onPointerEnter={activateOnHover ? () => setIsHovered(true) : undefined}
      onPointerLeave={activateOnHover ? () => setIsHovered(false) : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Base crisp image: renders instantly for LCP & acts as reduced-motion / non-WebGL fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        style={{ objectPosition: objectPositionStyle }}
        className={`h-full w-full object-cover select-none ${imageClassName}`}
      />

      {/* Interactive GLSL Water Ripple Shader Layer */}
      {shouldRunWebGL && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${
            webglReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
