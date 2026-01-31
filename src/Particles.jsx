import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors = ["#ffffff"],
  moveParticlesOnHover = false,
  particleBaseSize = 100,
  alphaParticles = false,
  disableRotation = false,
  className = "",
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({
      depth: false,
      alpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.z = 15;

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * particleSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * particleSpread;
      positions[i3 + 2] = (Math.random() - 0.5) * particleSpread;

      randomness[i3] = Math.random();
      randomness[i3 + 1] = Math.random();
      randomness[i3 + 2] = Math.random();

      const colorHex = particleColors[Math.floor(Math.random() * particleColors.length)];
      const r = parseInt(colorHex.slice(1, 3), 16) / 255;
      const g = parseInt(colorHex.slice(3, 5), 16) / 255;
      const b = parseInt(colorHex.slice(5, 7), 16) / 255;
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;

      sizes[i] = Math.random() * 0.5 + 0.5;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 3, data: randomness },
      color: { size: 3, data: colors },
      size: { size: 1, data: sizes },
    });

    const vertex = /* glsl */ `
      attribute vec3 position;
      attribute vec3 random;
      attribute vec3 color;
      attribute float size;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uBaseSize;
      uniform vec2 uMouse;
      uniform bool uMoveOnHover;
      uniform bool uDisableRotation;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;

        vec3 pos = position;

        float t = uTime * uSpeed;

        if (!uDisableRotation) {
          pos.x += sin(t + random.x * 6.28) * 0.1;
          pos.y += cos(t + random.y * 6.28) * 0.1;
          pos.z += sin(t + random.z * 6.28) * 0.05;
        }

        if (uMoveOnHover) {
          float dist = length(uMouse);
          pos.x += uMouse.x * 0.3 * (1.0 - random.x * 0.5);
          pos.y += uMouse.y * 0.3 * (1.0 - random.y * 0.5);
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float sizeScale = uBaseSize / 1000.0;
        gl_PointSize = size * sizeScale * (300.0 / -mvPosition.z);

        vAlpha = 0.3 + random.x * 0.7;
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;

      varying vec3 vColor;
      varying float vAlpha;
      uniform bool uAlphaParticles;

      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);

        if (dist > 0.5) discard;

        float alpha = uAlphaParticles ? vAlpha * (1.0 - dist * 2.0) : 1.0 - dist * 2.0;
        alpha = smoothstep(0.0, 0.5, alpha);

        vec3 glow = vColor * (1.0 + (1.0 - dist * 2.0) * 0.5);

        gl_FragColor = vec4(glow, alpha);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uBaseSize: { value: particleBaseSize },
        uMouse: { value: [0, 0] },
        uMoveOnHover: { value: moveParticlesOnHover },
        uAlphaParticles: { value: alphaParticles },
        uDisableRotation: { value: disableRotation },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationId;
    const update = (t) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      renderer.render({ scene: mesh, camera });
    };
    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleBaseSize,
    alphaParticles,
    disableRotation,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Particles;
