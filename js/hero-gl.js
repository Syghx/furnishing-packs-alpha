// The hero: the selected pack's room, full colour, filling the screen. When the
// pack changes, the next room washes in across the old one like ink spreading
// through water. A very slow push-in and a slight pointer parallax keep it alive
// without ever drawing attention away from the furniture.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uShift;
uniform float uZoomA;
uniform float uZoomB;
uniform float uT;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}
vec2 cover(vec2 uv, vec2 size, float zoom) {
  float s = max(uRes.x / size.x, uRes.y / size.y) * zoom;
  vec2 p = (uv - 0.5) * uRes / (size * s) + 0.5 + uShift;
  return vec2(p.x, 1.0 - p.y);
}

// Contrast-adaptive sharpening, after AMD's FidelityFX CAS. Some pack photos are only 1000px
// wide, so a large screen shows them bigger than their own pixels; this restores the crispness
// of edges that enlarging softens, more strongly the more a photo is enlarged, without halos.
float enlarged(vec2 size, float zoom) { return max(uRes.x / size.x, uRes.y / size.y) * zoom; }
vec3 sharp(sampler2D t, vec2 uv, vec2 size, float zoom) {
  float amount = clamp((enlarged(size, zoom) - 0.9) * 1.1, 0.15, 0.9);
  vec2 d = 1.0 / size;
  vec3 c = texture2D(t, uv).rgb;
  vec3 n = texture2D(t, uv + vec2(0.0, d.y)).rgb;
  vec3 s = texture2D(t, uv - vec2(0.0, d.y)).rgb;
  vec3 e = texture2D(t, uv + vec2(d.x, 0.0)).rgb;
  vec3 w = texture2D(t, uv - vec2(d.x, 0.0)).rgb;
  vec3 mn = min(c, min(min(n, s), min(e, w)));
  vec3 mx = max(c, max(max(n, s), max(e, w)));
  vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, vec3(0.0001)), 0.0, 1.0));
  vec3 wt = amp * (-1.0 / mix(8.0, 5.0, amount));
  return clamp((c + (n + s + e + w) * wt) / (1.0 + 4.0 * wt), 0.0, 1.0);
}

void main() {
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec3 a = sharp(uA, cover(vUv, uSizeA, uZoomA), uSizeA, uZoomA);
  vec3 col = a;
  if (uT > 0.0) {
    // The new room spreads in from the left on a soft, organic front.
    float f = 0.55 * vUv.x + 0.45 * fbm(vUv * asp * 3.0 + 21.0);
    float p = mix(-0.25, 1.25, uT);
    float w = 1.0 - smoothstep(p - 0.1, p + 0.1, f);
    float front = 1.0 - abs(w * 2.0 - 1.0);
    vec2 wobble = vec2(fbm(vUv * 4.0 + uTime * 0.2) - 0.5, fbm(vUv * 4.0 + 9.0) - 0.5) * 0.02 * front;
    vec3 b = sharp(uB, cover(vUv + wobble, uSizeB, uZoomB), uSizeB, uZoomB);
    col = mix(a, b, w) * (1.0 - front * 0.1);
  }
  col += (hash(vUv * uRes + fract(uTime * 7.0) * 91.0) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}`;

export function createHero(canvas, { reduceMotion = false } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return null;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  for (const n of ['uA', 'uB', 'uRes', 'uSizeA', 'uSizeB', 'uShift', 'uZoomA', 'uZoomB', 'uT', 'uTime']) U[n] = gl.getUniformLocation(prog, n);
  gl.uniform1i(U.uA, 0);
  gl.uniform1i(U.uB, 1);

  const makeTex = () => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([14, 14, 15, 255]));
    return t;
  };
  let texA = makeTex();
  let texB = makeTex();
  let sizeA = [1, 1];
  let sizeB = [1, 1];

  const state = {
    w: 1, h: 1, t: 0, transitioning: false, tStart: 0,
    shownA: 0, shownB: 0,
    shift: { x: 0, y: 0 }, shiftTarget: { x: 0, y: 0 },
    running: false, raf: 0, ready: false, pending: null,
  };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    state.w = Math.max(1, Math.round(r.width * dpr));
    state.h = Math.max(1, Math.round(r.height * dpr));
    canvas.width = state.w;
    canvas.height = state.h;
    gl.viewport(0, 0, state.w, state.h);
  }

  const load = (url) => new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url + (url.includes('?') ? '&' : '?') + 'gl=1';
  });
  const upload = (tex, im) => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
  };

  // The first room appears straight away; later ones wash in over it.
  async function setImage(url) {
    const token = (state.pending = url);
    const im = await load(url);
    if (state.pending !== token) return;
    if (!state.ready) {
      upload(texA, im);
      sizeA = [im.naturalWidth, im.naturalHeight];
      state.shownA = performance.now();
      state.ready = true;
      return;
    }
    if (state.transitioning) finishTransition();
    upload(texB, im);
    sizeB = [im.naturalWidth, im.naturalHeight];
    state.shownB = performance.now();
    if (reduceMotion) return finishTransition();
    state.transitioning = true;
    state.tStart = performance.now();
  }
  function finishTransition() {
    [texA, texB] = [texB, texA];
    sizeA = sizeB;
    state.shownA = state.shownB;
    state.transitioning = false;
    state.t = 0;
  }

  // A barely-there push-in over ten seconds after each room arrives.
  // The push-in starts close to the photo's real size, so it adds little enlargement of its own.
  const zoomFor = (since, now) => (reduceMotion ? 1.012 : 1.012 + 0.03 * Math.pow(1 - Math.min(1, (now - since) / 10000), 2));

  function frame(now) {
    if (!state.running) return;
    state.raf = requestAnimationFrame(frame);
    if (!state.ready) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texB);
    if (state.transitioning) {
      const k = Math.min(1, (now - state.tStart) / 1700);
      state.t = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      if (k >= 1) finishTransition();
    }
    state.shift.x += (state.shiftTarget.x - state.shift.x) * 0.05;
    state.shift.y += (state.shiftTarget.y - state.shift.y) * 0.05;
    gl.uniform2f(U.uRes, state.w, state.h);
    gl.uniform2f(U.uSizeA, sizeA[0], sizeA[1]);
    gl.uniform2f(U.uSizeB, sizeB[0], sizeB[1]);
    gl.uniform2f(U.uShift, state.shift.x, state.shift.y);
    gl.uniform1f(U.uZoomA, zoomFor(state.shownA, now));
    gl.uniform1f(U.uZoomB, zoomFor(state.shownB, now));
    gl.uniform1f(U.uT, state.transitioning ? state.t : 0);
    gl.uniform1f(U.uTime, now / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function setRunning(on) {
    if (on === state.running) return;
    state.running = on;
    if (on) state.raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(state.raf);
  }

  resize();
  return {
    setImage,
    resize,
    setRunning,
    // Pointer position in 0..1 of the canvas: a gentle parallax only.
    move(x, y) {
      if (reduceMotion) return;
      state.shiftTarget.x = (x - 0.5) * -0.01;
      state.shiftTarget.y = (y - 0.5) * -0.006;
    },
    leave() {
      state.shiftTarget.x = 0;
      state.shiftTarget.y = 0;
    },
  };
}
