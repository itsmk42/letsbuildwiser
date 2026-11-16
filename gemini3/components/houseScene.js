/**
 * Letsbuildwiser — scroll-driven build: floor plan → structure → finished home.
 *
 * The house: a wide, modern white villa with a South Indian accent — navy clay-tile roof over the
 * main block and the pillared sit-out, flat concrete terraces on the wings, a car porch, an open
 * balcony, tinted glass and a little teal. Finished under a bright mid-morning sky.
 *
 * createHouseScene(canvas, { assets }) returns { setStage(s), resize(), setActive(on), dispose() }.
 * `assets` is the URL of the folder holding the photographic sky and scanned textures (optional —
 * without it the scene falls back to its built-in procedural sky and textures).
 * `s` is a continuous story position:
 *   0–1 floor plan · 1–2 footings, columns, plinth · 2–3 ground-floor walls, slabs
 *   3–4 setbacks, first floor, gables · 4–5 roofs, glazing, railings, boundary
 *   5–6 plaster and paint, paving, lawn, daylight · 6–7 pool, garden, palms, furniture, car
 *   7–8 pull back for the logo
 *
 * The plan and the house are generated from the same wall, column and opening lists,
 * so every line of the plan is exactly where its wall later stands.
 */
import * as THREE from "three";

const GOLD = 0xffe100;
const LINE = 0xe6e3dc;
const CONCRETE = 0x6f6b64;
const BG = 0x0a0a0a;
const HAZE = 0xc3d6e8;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lin = (s, a, b) => clamp01((s - a) / (b - a));
const span = (s, a, b) => ease(lin(s, a, b));

/** Small seeded generator so textures and planting are identical on every visit. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createHouseScene(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(BG, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const small = (canvas.clientWidth || 800) < 700;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 40, 120);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 900);
  const rnd = seeded(20240611);

  /* ───────── procedural textures ───────── */
  function tex(w, h, draw, srgb = true) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }
  const rep = (t, u, v) => {
    const c = t.clone();
    c.repeat.set(u, v);
    c.needsUpdate = true;
    return c;
  };
  const speckle = (x, w, h, n, colors, min, max) => {
    for (let i = 0; i < n; i++) {
      x.fillStyle = colors[(rnd() * colors.length) | 0];
      const s = lerp(min, max, rnd());
      x.fillRect(rnd() * w, rnd() * h, s, s * lerp(0.6, 2.2, rnd()));
    }
  };

  // glazed navy clay tiles: 8 across, 6 courses per repeat
  const tileMap = tex(512, 512, (x, W, H) => {
    const n = 8;
    const rows = 6;
    const tw = W / n;
    const th = H / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < n; c++) {
        const v = rnd() * 0.3 - 0.15;
        x.fillStyle = `rgb(${(30 * (1 + v)) | 0},${(48 * (1 + v)) | 0},${(92 * (1 + v * 0.8)) | 0})`;
        x.fillRect(c * tw, r * th, tw + 1, th + 1);
      }
    }
    speckle(x, W, H, 700, ["rgba(8,12,30,.25)", "rgba(120,150,210,.10)"], 2, 6);
    for (let c = 0; c < n; c++) {
      const g = x.createLinearGradient(c * tw, 0, (c + 1) * tw, 0);
      g.addColorStop(0, "rgba(0,0,10,.55)");
      g.addColorStop(0.2, "rgba(0,0,0,0)");
      g.addColorStop(0.5, "rgba(170,200,255,.2)");
      g.addColorStop(0.8, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,10,.55)");
      x.fillStyle = g;
      x.fillRect(c * tw, 0, tw, H);
    }
    for (let r = 0; r < rows; r++) {
      const y = (r + 1) * th;
      const g = x.createLinearGradient(0, y - th * 0.3, 0, y);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,10,.65)");
      x.fillStyle = g;
      x.fillRect(0, y - th * 0.3, W, th * 0.3);
      x.fillStyle = "rgba(170,200,255,.22)";
      x.fillRect(0, (y % H) + 1, W, 3);
    }
  });
  const tileBump = new THREE.CanvasTexture(tileMap.image);
  tileBump.wrapS = tileBump.wrapT = THREE.RepeatWrapping;

  // large-format light paving
  const paverMap = tex(512, 512, (x, W, H) => {
    x.fillStyle = "#8f8d88";
    x.fillRect(0, 0, W, H);
    const sw = 128;
    const sh = 64;
    for (let r = 0; r < H / sh; r++) {
      for (let c = -1; c < W / sw + 1; c++) {
        const b = 206 * (1 + rnd() * 0.1 - 0.05);
        x.fillStyle = `rgb(${b | 0},${(b * 0.985) | 0},${(b * 0.95) | 0})`;
        x.fillRect(c * sw + (r % 2) * (sw / 2) + 1.5, r * sh + 1.5, sw - 3, sh - 3);
      }
    }
    speckle(x, W, H, 2400, ["rgba(0,0,0,.05)", "rgba(255,255,255,.08)", "rgba(120,110,90,.06)"], 1, 4);
  });
  const terraceMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#d9d7d1";
    x.fillRect(0, 0, W, H);
    speckle(x, W, H, 1800, ["rgba(0,0,0,.04)", "rgba(255,255,255,.1)"], 1, 4);
    x.strokeStyle = "rgba(90,88,84,.5)";
    x.lineWidth = 2;
    x.strokeRect(1, 1, W - 2, H - 2);
  });
  const deckMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#d8c9ad";
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 120; i++) {
      x.fillStyle = ["rgba(150,125,90,.14)", "rgba(255,245,225,.16)", "rgba(120,100,70,.1)"][(rnd() * 3) | 0];
      x.fillRect(0, rnd() * H, W, lerp(1, 5, rnd()));
    }
    x.fillStyle = "rgba(90,75,55,.35)";
    for (let i = 0; i < 4; i++) x.fillRect(0, i * 64, W, 2);
  });
  // mown lawn with alternating stripes
  const grassMap = tex(512, 512, (x, W, H) => {
    for (let i = 0; i < 4; i++) {
      x.fillStyle = i % 2 ? "#5d9440" : "#6aa349";
      x.fillRect(i * (W / 4), 0, W / 4, H);
    }
    speckle(x, W, H, 16000, ["#78b052", "#4f8436", "#86bb5d", "#5a9140", "#93c468", "#487a31"], 1, 3);
  });
  const groundMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#6f9a4c";
    x.fillRect(0, 0, W, H);
    speckle(x, W, H, 5200, ["#7fa957", "#5c873f", "#8cb262", "#668f45", "#9aa86a", "#547c3a"], 1, 4);
  });
  const asphaltMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#4b4c4f";
    x.fillRect(0, 0, W, H);
    speckle(x, W, H, 6000, ["#57585b", "#404144", "#626366", "#3a3b3e"], 1, 3);
  });
  const noiseBump = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#808080";
    x.fillRect(0, 0, W, H);
    speckle(x, W, H, 5000, ["#8c8c8c", "#747474", "#969696", "#6a6a6a"], 1, 3);
  }, false);
  const rippleBump = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#808080";
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      x.strokeStyle = rnd() > 0.5 ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.3)";
      x.lineWidth = lerp(1, 3, rnd());
      x.beginPath();
      const px = rnd() * W;
      const py = rnd() * H;
      x.ellipse(px, py, lerp(8, 30, rnd()), lerp(3, 9, rnd()), rnd() * 0.6 - 0.3, 0, 6.3);
      x.stroke();
    }
  }, false);
  const woodMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#8a5a36";
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) {
      x.fillStyle = ["rgba(50,28,12,.3)", "rgba(170,120,76,.25)", "rgba(110,70,40,.3)"][(rnd() * 3) | 0];
      x.fillRect(0, rnd() * H, W, lerp(1, 4, rnd()));
    }
  });
  const canopyMap = tex(256, 256, (x, W, H) => {
    x.fillStyle = "#33602b";
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 1500; i++) {
      x.fillStyle = ["#4a8236", "#2a5325", "#5b9442", "#234920", "#6aa24c", "#356a2c"][(rnd() * 6) | 0];
      x.beginPath();
      x.ellipse(rnd() * W, rnd() * H, lerp(2, 7, rnd()), lerp(1.5, 4, rnd()), rnd() * 3.14, 0, 6.3);
      x.fill();
    }
  });
  // a spray of leaves on a transparent ground — used on cards that clothe every canopy
  const leafMap = tex(256, 256, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) {
      const a = rnd() * 6.283;
      const d = lerp(10, 78, rnd());
      const len = lerp(34, 58, rnd());
      x.save();
      x.translate(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d);
      x.rotate(a + lerp(-0.6, 0.6, rnd()));
      x.fillStyle = ["#5d9a3a", "#467f2e", "#74ad48", "#3a6e28", "#86bb56", "#507f33"][(rnd() * 6) | 0];
      x.beginPath();
      x.moveTo(-len / 2, 0);
      x.quadraticCurveTo(0, -len * 0.3, len / 2, 0);
      x.quadraticCurveTo(0, len * 0.3, -len / 2, 0);
      x.fill();
      x.strokeStyle = "rgba(220,240,190,.35)";
      x.lineWidth = 1.2;
      x.beginPath();
      x.moveTo(-len / 2, 0);
      x.lineTo(len / 2, 0);
      x.stroke();
      x.restore();
    }
  });
  leafMap.wrapS = leafMap.wrapT = THREE.ClampToEdgeWrapping;
  const frondMap = tex(256, 96, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.lineCap = "round";
    for (let i = 0; i < 46; i++) {
      const px = 8 + i * 5.3;
      const k = 1 - Math.abs(i / 46 - 0.42) * 1.25;
      const len = Math.max(6, 44 * k);
      x.strokeStyle = ["#5a9038", "#477b2e", "#6da045", "#3d6e2a"][(rnd() * 4) | 0];
      x.lineWidth = 3.4;
      for (const sgn of [-1, 1]) {
        x.beginPath();
        x.moveTo(px, H / 2);
        x.lineTo(px + len * 0.45, H / 2 + sgn * len);
        x.stroke();
      }
    }
    x.strokeStyle = "#8aa152";
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(2, H / 2);
    x.lineTo(W - 4, H / 2);
    x.stroke();
  });
  frondMap.wrapS = frondMap.wrapT = THREE.ClampToEdgeWrapping;

  /* ───────── mid-morning sky (also the source of ambient light and reflections) ───────── */
  const SUN = new THREE.Vector3(-0.62, 0.86, 0.66).normalize(); // about 48° up, from the front-left
  const skyMap = tex(2048, 1024, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#2468c4");
    g.addColorStop(0.24, "#4a8fde");
    g.addColorStop(0.42, "#9cc6ee");
    g.addColorStop(0.5, "#dceaf5");
    g.addColorStop(0.505, "#b9c9b4");
    g.addColorStop(1, "#7d8f6a");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    // sun: position on the dome that matches the key light
    const theta = Math.acos(SUN.y);
    let phi = Math.atan2(SUN.z, -SUN.x);
    if (phi < 0) phi += Math.PI * 2;
    const sx = (phi / (Math.PI * 2)) * W;
    const sy = (theta / Math.PI) * H;
    for (const [r, a] of [[260, 0.22], [120, 0.35], [46, 0.9], [20, 1]]) {
      const sg = x.createRadialGradient(sx, sy, 0, sx, sy, r);
      sg.addColorStop(0, `rgba(255,252,240,${a})`);
      sg.addColorStop(1, "rgba(255,252,240,0)");
      x.fillStyle = sg;
      x.fillRect(sx - r, sy - r, r * 2, r * 2);
    }
    // fair-weather cumulus, smaller and denser towards the horizon
    for (let i = 0; i < 46; i++) {
      const cy = lerp(0.2, 0.47, Math.pow(rnd(), 0.7)) * H;
      const k = lerp(1.5, 0.45, (cy / H - 0.2) / 0.27);
      const cx = rnd() * W;
      const n = 9 + ((rnd() * 9) | 0);
      for (let j = 0; j < n; j++) {
        const px = cx + (rnd() - 0.5) * 190 * k;
        const py = cy - rnd() * 26 * k;
        const r = lerp(22, 54, rnd()) * k;
        for (const wrap of [-W, 0, W]) {
          const cg = x.createRadialGradient(px + wrap, py, 0, px + wrap, py, r);
          cg.addColorStop(0, "rgba(255,255,255,.55)");
          cg.addColorStop(0.6, "rgba(250,252,255,.22)");
          cg.addColorStop(1, "rgba(245,250,255,0)");
          x.fillStyle = cg;
          x.fillRect(px + wrap - r, py - r, r * 2, r * 2);
        }
      }
    }
  });
  const haze = new THREE.Color(HAZE);
  const lawnTone = new THREE.Color(0xffffff);
  const skyGeo = new THREE.SphereGeometry(600, 48, 24);
  const sky = new THREE.Mesh(
    skyGeo,
    new THREE.MeshBasicMaterial({ map: skyMap, side: THREE.BackSide, fog: false, transparent: true, opacity: 0, depthWrite: false }),
  );
  sky.renderOrder = -10;
  scene.add(sky);
  {
    const pm = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyMap, side: THREE.BackSide })));
    scene.environment = pm.fromScene(env, 0.02, 1, 800).texture;
    pm.dispose();
  }

  /* ───────── lights ───────── */
  const hemi = new THREE.HemisphereLight(0xc4ccda, 0x1c1a16, 1.3);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff3df, 1.5);
  key.position.copy(SUN).multiplyScalar(60);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(small ? 2048 : 4096);
  Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 5, far: 140 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 2.5;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb9d2ff, 0.35);
  fill.position.set(14, 9, -10);
  scene.add(fill);

  /* ───────── ground ───────── */
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 1, map: rep(groundMap, 110, 110) });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(200, 200, 0x2c2a27, 0x1a1917);
  grid.position.y = 0.004;
  grid.material.transparent = true;
  scene.add(grid);

  /* ───────── part registry ───────── */
  const parts = [];
  const finishMats = [];
  let cur = null;

  /** A part is a group of items revealed together over the story window [a, b]. */
  function part(a, b, build, opt = {}) {
    cur = {
      a,
      b,
      items: [],
      edge: opt.edges === false ? null : new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }),
      flat: null,
      color: opt.color ?? null, // fixed plan-line colour (otherwise gold → white)
      lift: !!opt.lift, // plan lines that ride up on the plinth
      out: opt.out || null, // optional [a, b] window over which the part fades away again
    };
    build();
    parts.push(cur);
    cur = null;
  }

  const offset = { polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 1.5 };
  /** Material that starts as raw structure and turns into its finished colour at the finishing stage. */
  function M(hex, rough = 0.9, extra = {}) {
    const m = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: rough, ...offset, ...extra });
    m.userData.from = new THREE.Color(CONCRETE);
    m.userData.to = new THREE.Color(hex);
    finishMats.push(m);
    return m;
  }
  const S = (hex, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, ...extra });
  const fading = { transparent: true, opacity: 0, depthWrite: false };

  const mat = {
    plaster: M(0xffffff, 0.9, { bumpMap: noiseBump, bumpScale: 0.35 }),
    band: M(0xf6f6f4, 0.85),
    plinth: M(0xb9b6b0, 0.9, { bumpMap: noiseBump, bumpScale: 0.6 }),
    column: M(0xffffff, 0.85),
    teal: M(0x16898a, 0.7),
    compound: M(0xfafaf8, 0.9, { bumpMap: noiseBump, bumpScale: 0.35 }),
    terrace: M(0xffffff, 0.8, { map: rep(terraceMap, 9, 14) }),
    wood: S(0xc9b79c, 0.7, { map: woodMap, ...offset }),
    tile: S(opts.assets ? 0xa8b2d0 : 0x9aa6c4, 0.4, { map: tileMap, bumpMap: tileBump, bumpScale: 2.2, envMapIntensity: 1.2 }),
    ridge: S(0x1b2a52, 0.5),
    // 70 % tint: dark, mirror-like glazing
    glass: new THREE.MeshPhysicalMaterial({ color: 0x6b8194, roughness: 0.04, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.35 }),
    rail: new THREE.MeshPhysicalMaterial({ color: 0xcfe9ee, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.26, envMapIntensity: 1.6, depthWrite: false }),
    frame: S(0x15171a, 0.45, { metalness: 0.5 }),
    metal: S(0xb9bcc0, 0.3, { metalness: 0.9 }),
    white: S(0xfbfbfa, 0.6),
    cushion: S(0x1c9796, 0.85),
    paint: new THREE.MeshPhysicalMaterial({ color: 0x23282e, roughness: 0.32, metalness: 0.7, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.4 }),
    tyre: S(0x151515, 0.9),
    solar: S(0x0c1326, 0.25, { metalness: 0.5, envMapIntensity: 0.9 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x1fb6b2, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4, bumpMap: rep(rippleBump, 3, 2), bumpScale: 1.6, emissive: 0x0a6f6c, emissiveIntensity: 0.25 }),
    pot: S(0xf2f0ea, 0.7),
    trunk: S(0x8a7a66, 0.95, { bumpMap: noiseBump, bumpScale: 2 }),
    bark: S(0x5a4634, 0.95, { bumpMap: noiseBump, bumpScale: 2 }),
    core: S(0x9fc48a, 0.95, { map: rep(canopyMap, 5, 3) }),
    hedge: S(0xdfe8d2, 0.95, { map: rep(canopyMap, 6, 2), bumpMap: rep(noiseBump, 6, 2), bumpScale: 4 }),
    leaves: [0xffffff, 0xe4efd6, 0xcfe0be].map((c) => S(c, 0.8, { map: leafMap, alphaTest: 0.5, side: THREE.DoubleSide })),
    frond: S(0xffffff, 0.75, { map: frondMap, alphaTest: 0.4, side: THREE.DoubleSide }),
    lawn: S(0xffffff, 1, { map: grassMap, bumpMap: rep(noiseBump, 5, 5), bumpScale: 1.5, ...fading }),
    paver: S(0xffffff, 0.9, { map: paverMap, ...fading }),
    deck: S(0xffffff, 0.85, { map: deckMap, ...fading }),
    walk: S(0xd6d4cf, 0.9, { bumpMap: noiseBump, bumpScale: 0.6, ...fading }),
    road: S(0xffffff, 0.95, { map: asphaltMap, ...fading }),
    marking: new THREE.MeshBasicMaterial({ color: 0xf2f2ee, ...fading }),
  };
  // timber starts pale (raw) and is oiled at the finishing stage
  mat.wood.userData.from = mat.wood.color.clone();
  mat.wood.userData.to = new THREE.Color(0xffffff);
  finishMats.push(mat.wood);

  const add = (obj, mode) => {
    cur.items.push({ obj, mode });
    return obj;
  };
  const shadowed = (m) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  /**
   * Box whose base centre sits at (x, y, z). `mode` says how it is revealed:
   * "y" rises from its base, "x"/"z" spreads from one edge, "pop" scales up from its base centre.
   */
  function box(w, h, d, x, y, z, material, mode = "y", edges = true) {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = shadowed(new THREE.Mesh(g, material));
    if (mode === "x") {
      g.translate(w / 2, h / 2, 0);
      m.position.set(x - w / 2, y, z);
    } else if (mode === "z") {
      g.translate(0, h / 2, d / 2);
      m.position.set(x, y, z - d / 2);
    } else {
      g.translate(0, h / 2, 0);
      m.position.set(x, y, z);
    }
    if (edges && cur.edge) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), cur.edge));
    scene.add(m);
    return add(m, mode);
  }

  /** Flat line on the ground from (x1,z1) to (x2,z2) that draws along its length. */
  function ribbon(x1, z1, x2, z2, width = 0.23, y = 0.03) {
    if (!cur.flat) cur.flat = new THREE.MeshBasicMaterial({ color: cur.color ?? GOLD, transparent: true, opacity: 1 });
    const len = Math.hypot(x2 - x1, z2 - z1);
    const g = new THREE.BoxGeometry(len, 0.012, width);
    g.translate(len / 2, 0, 0);
    const m = new THREE.Mesh(g, cur.flat);
    m.position.set(x1, y, z1);
    m.userData.y = y;
    m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    scene.add(m);
    return add(m, "x");
  }

  /** Thin line object (arc, dashed outline) that fades in. */
  function fadeLine(points, dashed = false, closed = false) {
    const g = new THREE.BufferGeometry().setFromPoints(closed ? [...points, points[0]] : points);
    const m = dashed
      ? new THREE.LineDashedMaterial({ color: GOLD, dashSize: 0.5, gapSize: 0.32, transparent: true, opacity: 0 })
      : new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
    const l = new THREE.Line(g, m);
    if (dashed) l.computeLineDistances();
    l.userData.y = 0;
    scene.add(l);
    return add(l, "fade");
  }

  /** Text label that always faces the camera. */
  const labelJobs = [];
  function label(text, x, y, z, size = 0.66, color = "#D9D5CC") {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const draw = () => {
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.font = '600 50px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
      if ("letterSpacing" in ctx) ctx.letterSpacing = "9px";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, c.width / 2, c.height / 2 + 4);
      t.needsUpdate = true;
    };
    draw();
    labelJobs.push(draw);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false }));
    sp.scale.set(size * 5, size, 1);
    sp.position.set(x, y + size * 0.55, z);
    sp.userData.y = sp.position.y;
    sp.renderOrder = 5;
    scene.add(sp);
    return add(sp, "fade");
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => labelJobs.forEach((d) => d()));

  /* ───────── the house, in metres ───────── */
  const T = 0.23; // wall thickness
  const PL = 0.45; // plinth height
  const H1 = 3.3; // ground-floor storey height
  const SL = 0.2; // slab thickness
  const H2 = 3.1; // first-floor storey height
  const GF = PL;
  const FF = PL + H1 + SL; // also the level of the terrace over the car porch
  const EAVE = FF + H2; // top of the first-floor walls
  const ROOF = EAVE + 0.22; // top of the flat roof on the left wing
  const PITCH = 0.42; // main roof, about 24°

  // plot: 80 ft × 70 ft, with the garden, pool and drive in front
  const PX = 12.2;
  const PZB = -8.0;
  const PZF = 13.3;
  const GATE = [5.0, 9.4];

  // [x1, z1, x2, z2, thickness, storeys] — storeys: 1 ground only, 2 both, "F" first floor only.
  // The single source for both the plan and the walls.
  const WALLS = [
    // main block
    [-4, -4.5, 4, -4.5, T, 2],
    [4, -4.5, 4, 1.5, T, 2],
    [4, 1.5, -4, 1.5, T, 2],
    [-4, 1.5, -4, -4.5, T, 2],
    // left wing: lounge below, bedroom and open balcony above
    [-9, -3.5, -4, -3.5, T, 2],
    [-9, -3.5, -9, 2.5, T, 2],
    [-9, 2.5, -4, 2.5, T, 1],
    [-4, 1.5, -4, 2.5, T, 1],
    [-9, 0.3, -4, 0.3, T, "F"],
    // right: guest room behind the car porch
    [4, -4.5, 9.5, -4.5, T, 1],
    [9.5, -4.5, 9.5, -1.2, T, 1],
    [9.5, -1.2, 4, -1.2, T, 1],
    // partitions
    [-4, -1.5, -2.7, -1.5, 0.12, 1],
    [-1.7, -1.5, 0.9, -1.5, 0.12, 1],
    [1.9, -1.5, 4, -1.5, 0.12, 1],
    [0, -4.5, 0, -1.5, 0.12, 1],
    [-9, -0.3, -6.3, -0.3, 0.12, 1],
    [-5.3, -0.3, -4, -0.3, 0.12, 1],
  ];
  const COLS = [
    [-4, -4.5, 2], [0, -4.5, 2], [4, -4.5, 2], [-4, -1.5, 2], [4, -1.5, 2], [-4, 1.5, 2], [0, 1.5, 2], [4, 1.5, 2],
    [-9, -3.5, 2], [-6.5, -3.5, 2], [-9, -0.3, 2], [-9, 2.5, 2], [-4, 2.5, 2],
    [9.5, -4.5, 1], [6.75, -4.5, 1], [9.5, -1.2, 1],
  ];
  const PORCH = [[4.3, 4.1], [9.3, 4.1]]; // car-porch pillars
  const SITOUT = [-2.5, -0.5, 1.5]; // sit-out pillars along z = 3.75
  // openings: wall runs along `ax`, faces `n`; p = position along the wall, q = wall line, y = sill, w × h
  const OPENINGS = [
    { ax: "x", n: 1, p: -1.6, q: 1.5, y: GF, w: 1.5, h: 2.6, kind: "door" },
    { ax: "x", n: 1, p: 1.75, q: 1.5, y: GF + 0.05, w: 3.7, h: 2.8, kind: "slide" },
    { ax: "x", n: 1, p: -2.1, q: 1.5, y: FF + 0.75, w: 2.7, h: 1.95, shade: true },
    { ax: "x", n: 1, p: 1.9, q: 1.5, y: FF + 0.75, w: 2.7, h: 1.95, shade: true },
    { ax: "x", n: 1, p: -6.5, q: 2.5, y: GF + 0.05, w: 4.1, h: 2.85, kind: "slide" },
    { ax: "x", n: 1, p: -6.5, q: 0.3, y: FF + 0.02, w: 4.1, h: 2.55, kind: "slide" },
    { ax: "z", n: -1, p: -1.9, q: -9, y: GF + 0.9, w: 2.3, h: 1.75, shade: true },
    { ax: "z", n: -1, p: 1.15, q: -9, y: GF + 0.9, w: 1.7, h: 1.75, shade: true },
    { ax: "z", n: -1, p: -1.6, q: -9, y: FF + 0.9, w: 2.3, h: 1.65, shade: true },
    { ax: "z", n: 1, p: 0, q: 4, y: FF + 0.02, w: 2.7, h: 2.55, kind: "slide" },
    { ax: "z", n: 1, p: -3.0, q: 4, y: FF + 0.9, w: 1.5, h: 1.55, shade: true },
    { ax: "x", n: 1, p: 5.1, q: -1.2, y: GF, w: 1.0, h: 2.35, kind: "door" },
    { ax: "x", n: 1, p: 7.6, q: -1.2, y: GF + 0.9, w: 1.9, h: 1.55 },
    { ax: "z", n: 1, p: -2.85, q: 9.5, y: GF + 0.9, w: 1.7, h: 1.55, shade: true },
  ];

  /* ═════════ 0–1 · floor plan ═════════ */
  part(0.06, 0.45, () => {
    ribbon(-PX, PZF, PX, PZF, 0.08);
    ribbon(PX, PZF, PX, PZB, 0.08);
    ribbon(PX, PZB, -PX, PZB, 0.08);
    ribbon(-PX, PZB, -PX, PZF, 0.08);
  }, { out: [4.9, 5.5] });

  part(0.28, 0.9, () => {
    for (const [x1, z1, x2, z2, t, st] of WALLS) if (st !== "F") ribbon(x1, z1, x2, z2, t);
    // sit-out, its pillars and steps
    ribbon(-4, 3.85, 1.9, 3.85, 0.07);
    ribbon(1.9, 3.85, 1.9, 1.5, 0.07);
    for (const x of SITOUT) ribbon(x - 0.14, 3.75, x + 0.14, 3.75, 0.28);
    for (const z of [4.2, 4.5]) ribbon(-2.6, z, -0.4, z, 0.04);
    // car porch outline and pillars
    ribbon(4, 1.5, 4, 4.3, 0.06);
    ribbon(4, 4.3, 9.5, 4.3, 0.06);
    ribbon(9.5, 4.3, 9.5, -1.2, 0.06);
    for (const [x, z] of PORCH) ribbon(x - 0.16, z, x + 0.16, z, 0.32);
    // stair
    for (let i = 0; i < 7; i++) ribbon(1.5 + i * 0.3, -1.3, 1.5 + i * 0.3, -0.25, 0.035);
    // pool
    ribbon(-10.7, 5.0, -5.6, 5.0, 0.07);
    ribbon(-5.6, 5.0, -5.6, 8.6, 0.07);
    ribbon(-5.6, 8.6, -10.7, 8.6, 0.07);
    ribbon(-10.7, 8.6, -10.7, 5.0, 0.07);
  }, { lift: true, out: [4.9, 5.5] });

  // door and window positions marked on the plan, where they will later be fitted
  const marks = (width, y) => {
    for (const o of OPENINGS) {
      if (o.y > FF - 0.1) continue;
      const a = o.p - o.w / 2;
      const b = o.p + o.w / 2;
      if (o.ax === "x") ribbon(a, o.q, b, o.q, width, y);
      else ribbon(o.q, a, o.q, b, width, y);
    }
  };
  part(0.6, 0.95, () => marks(T + 0.03, 0.036), { lift: true, color: BG, out: [4.9, 5.5] });
  part(0.66, 1.0, () => marks(0.05, 0.042), { lift: true, out: [4.9, 5.5] });

  part(0.72, 1.0, () => {
    const arc = (cx, cz, r, a0, a1) => {
      const pts = [];
      for (let i = 0; i <= 18; i++) {
        const a = lerp(a0, a1, i / 18);
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0.045, cz + Math.sin(a) * r));
      }
      pts.push(new THREE.Vector3(cx, 0.045, cz));
      fadeLine(pts);
    };
    arc(-2.7, -1.5, 0.95, 0, -Math.PI / 2);
    arc(0.9, -1.5, 0.95, 0, -Math.PI / 2);
    arc(-6.3, -0.3, 0.95, 0, -Math.PI / 2);
    arc(-2.35, 1.5, 0.75, 0, -Math.PI / 2);
    arc(-0.85, 1.5, 0.75, Math.PI, Math.PI * 1.5);
    arc(4.6, -1.2, 0.95, 0, -Math.PI / 2);
    label("DINING", -2.0, 0.05, -3.0);
    label("KITCHEN", 2.0, 0.05, -3.0);
    label("LIVING", -0.9, 0.05, 0.1, 0.78);
    label("BEDROOM", -6.5, 0.05, -1.9);
    label("LOUNGE", -6.5, 0.05, 1.1);
    label("GUEST", 6.75, 0.05, -2.85);
    label("CAR PORCH", 6.75, 0.05, 1.6);
    label("SIT-OUT", -1.05, 0.05, 2.75, 0.52);
    label("POOL", -8.15, 0.05, 6.8);
  }, { edges: false, lift: true, out: [1.9, 2.3] });

  part(0.5, 1.0, () => {
    const z = PZF + 1.4;
    const x = PX + 1.4;
    ribbon(-PX, z, PX, z, 0.05);
    ribbon(-PX, z - 0.4, -PX, z + 0.4, 0.05);
    ribbon(PX, z - 0.4, PX, z + 0.4, 0.05);
    ribbon(x, PZF, x, PZB, 0.05);
    ribbon(x - 0.4, PZF, x + 0.4, PZF, 0.05);
    ribbon(x - 0.4, PZB, x + 0.4, PZB, 0.05);
    label("80 FT", 0, 0.05, z + 1.1, 1.15, "#FFE100");
    label("70 FT", x + 2.3, 0.05, 2.6, 1.15, "#FFE100");
  }, { edges: false, out: [2.95, 3.45] });

  /* ═════════ 1–2 · structure ═════════ */
  part(1.0, 1.4, () => {
    for (const [x, z] of COLS) box(1.0, 0.26, 1.0, x, 0, z, mat.plinth);
    for (const [x, z] of PORCH) box(0.9, 0.26, 0.9, x, 0, z, mat.plinth);
    for (const x of SITOUT) box(0.7, 0.26, 0.7, x, 0, 3.75, mat.plinth);
  });
  part(1.25, 1.95, () => {
    for (const [x, z] of COLS) box(0.21, GF + H1, 0.21, x, 0, z, mat.column);
  });
  part(1.6, 2.05, () => {
    box(8.3, PL, 6.3, 0, 0, -1.5, mat.plinth);
    box(5.15, PL, 6.3, -6.5, 0, -0.5, mat.plinth);
    box(5.65, PL, 3.45, 6.75, 0, -2.85, mat.plinth);
    box(6.0, PL, 2.4, -1.05, 0, 2.7, mat.plinth); // sit-out floor
    box(2.4, 0.3, 0.35, -1.5, 0, 4.07, mat.plinth);
    box(2.6, 0.15, 0.35, -1.5, 0, 4.42, mat.plinth);
    box(5.6, 0.12, 5.6, 6.75, 0, 1.55, mat.plinth); // porch floor
  });

  /* ═════════ 2–3 · ground floor ═════════ */
  const wall = ([x1, z1, x2, z2, t], y, h, material) => {
    const len = Math.hypot(x2 - x1, z2 - z1) + t;
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;
    if (z1 === z2) box(len, h, t, cx, y, cz, material);
    else box(t, h, len, cx, y, cz, material);
  };
  const isFeature = (w) => w[1] === -1.2 && w[3] === -1.2; // teal wall at the back of the car porch
  part(2.0, 2.65, () => {
    for (const w of WALLS) if (w[5] !== "F") wall(w, GF, H1, isFeature(w) ? mat.teal : mat.plaster);
  });
  const pillar = (x, z, y, h, r = 0.11) => {
    box(r * 3, 0.16, r * 3, x, y, z, mat.column);
    const c = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.12, h - 0.28, 20), mat.column));
    c.geometry.translate(0, (h - 0.28) / 2, 0);
    c.position.set(x, y + 0.16, z);
    scene.add(c);
    add(c, "y");
    box(r * 2.8, 0.12, r * 2.8, x, y + h - 0.12, z, mat.column);
  };
  part(2.35, 2.8, () => {
    for (const x of SITOUT) pillar(x, 3.75, GF, 2.98);
    box(6.1, 0.18, 0.22, -1.05, GF + 2.98, 3.75, mat.wood, "x");
    for (const [x, z] of PORCH) box(0.3, H1 + PL - 0.12, 0.3, x, 0.12, z, mat.column);
  });
  part(2.6, 3.0, () => {
    box(8.36, SL, 6.36, 0, GF + H1, -1.5, mat.band, "x");
    box(5.3, SL, 6.5, -6.55, GF + H1, -0.45, mat.band, "x");
    box(5.95, SL, 9.35, 6.87, GF + H1, -0.03, mat.terrace, "x"); // terrace over the guest room and car porch
  });

  /* ═════════ 3–4 · setbacks, first floor, gables ═════════ */
  part(3.0, 3.45, () => {
    const sx = 10.6;
    const z0 = -6.3;
    const z1 = 10.2;
    const top = 11.4;
    const r = (y) => [
      new THREE.Vector3(-sx, y, z1),
      new THREE.Vector3(sx, y, z1),
      new THREE.Vector3(sx, y, z0),
      new THREE.Vector3(-sx, y, z0),
    ];
    fadeLine(r(0.06), true, true);
    fadeLine(r(top), true, true);
    for (const p of r(0.06)) fadeLine([p, new THREE.Vector3(p.x, top, p.z)], true);
    label("SETBACK", -PX + 0.8, 0.05, z1 + 1.0, 0.62, "#FFE100");
    label("HEIGHT LIMIT", 0, top + 0.6, z1, 0.76, "#FFE100");
  }, { edges: false, out: [4.2, 4.7] });

  part(3.1, 3.55, () => {
    for (const [x, z, st] of COLS) if (st === 2) box(0.21, H2, 0.21, x, FF, z, mat.column);
  });
  part(3.35, 3.95, () => {
    for (const w of WALLS) if (w[5] !== 1) wall(w, FF, H2, mat.plaster);
    box(0.32, H2, 0.32, -8.86, FF, 2.36, mat.column); // balcony corner post
  });
  // triangular gable walls under the tiled roof
  function gable(w, h, x, y, z) {
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2, 0);
    sh.lineTo(w / 2, 0);
    sh.lineTo(0, h);
    sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
    g.translate(0, 0, -T / 2);
    const m = shadowed(new THREE.Mesh(g, mat.plaster));
    m.rotation.y = Math.PI / 2;
    m.position.set(x, y, z);
    if (cur.edge) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), cur.edge));
    scene.add(m);
    add(m, "y");
  }
  const MAIN_RISE = 3 * Math.tan(PITCH);
  part(3.8, 4.15, () => {
    gable(6 + T, MAIN_RISE, -4, EAVE, -1.5);
    gable(6 + T, MAIN_RISE, 4, EAVE, -1.5);
    // flat roof of the left wing, shading the open balcony
    box(5.6, 0.22, 7.0, -6.6, EAVE, -0.4, mat.terrace, "x");
  });

  /* ═════════ 4–5 · roofs, glazing, railings, boundary ═════════ */
  /**
   * One roof slope. `axis` is the direction of the ridge; the slope runs from `eave` up to `ridge`
   * (both measured on the other axis) between `from` and `to`. Returns helpers that add its
   * rafters and its tiled surface, each growing from the eave towards the ridge.
   */
  function slope({ axis, from, to, ridge, eave, yRidge, pitch, th = 0.11 }) {
    const run = Math.abs(eave - ridge);
    const len = run / Math.cos(pitch);
    const yEave = yRidge - run * Math.tan(pitch);
    const up = Math.sign(ridge - eave);
    const L = to - from;
    const g = new THREE.Group();
    if (axis === "x") {
      g.position.set((from + to) / 2, yEave, eave);
      g.rotation.y = up > 0 ? 0 : Math.PI;
    } else {
      g.position.set(eave, yEave, (from + to) / 2);
      g.rotation.y = up > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
    const tilt = new THREE.Group();
    tilt.rotation.x = -pitch;
    g.add(tilt);
    scene.add(g);
    return {
      rafters() {
        const n = Math.max(2, Math.round(L / 0.75));
        for (let i = 0; i <= n; i++) {
          const rg = new THREE.BoxGeometry(0.07, 0.13, len);
          rg.translate(0, -0.065, len / 2);
          const r = shadowed(new THREE.Mesh(rg, mat.wood));
          r.position.x = -L / 2 + 0.06 + ((L - 0.12) * i) / n;
          if (cur.edge) r.add(new THREE.LineSegments(new THREE.EdgesGeometry(rg), cur.edge));
          tilt.add(r);
          add(r, "z");
        }
      },
      tiles() {
        const tg = new THREE.BoxGeometry(L, th, len);
        tg.translate(0, th / 2, len / 2);
        const uv = tg.attributes.uv;
        for (let i = 8; i < 12; i++) uv.setXY(i, uv.getX(i) * (L / TILE_SPAN), uv.getY(i) * (len / TILE_SPAN));
        const m = shadowed(new THREE.Mesh(tg, [mat.band, mat.band, mat.tile, mat.wood, mat.band, mat.band]));
        tilt.add(m);
        add(m, "z");
      },
    };
  }
  const TILE_SPAN = opts.assets ? 3.4 : 2.2; // metres covered by one repeat of the roof-tile texture
  const MAIN_RIDGE = EAVE + MAIN_RISE + 0.03;
  const roofs = [
    slope({ axis: "x", from: -4.65, to: 4.65, ridge: -1.5, eave: 2.45, yRidge: MAIN_RIDGE, pitch: PITCH }),
    slope({ axis: "x", from: -4.65, to: 4.65, ridge: -1.5, eave: -5.45, yRidge: MAIN_RIDGE, pitch: PITCH }),
    slope({ axis: "x", from: -4.25, to: 2.15, ridge: 1.5 + T / 2, eave: 4.4, yRidge: FF + 0.46, pitch: 0.31, th: 0.1 }), // sit-out
  ];
  part(4.0, 4.35, () => roofs.forEach((r) => r.rafters()));
  part(4.25, 4.72, () => roofs.forEach((r) => r.tiles()), { edges: false });
  part(4.6, 4.85, () => {
    box(9.34, 0.1, 0.3, 0, MAIN_RIDGE + 0.02, -1.5, mat.ridge, "x", false);
  }, { edges: false });

  /** Places a group on a wall face: local x runs along the wall, local z points outwards. */
  function onWall(o, build) {
    const g = new THREE.Group();
    const off = o.n * (T / 2 + 0.012);
    if (o.ax === "x") {
      g.position.set(o.p, o.y, o.q + off);
      g.rotation.y = o.n > 0 ? 0 : Math.PI;
    } else {
      g.position.set(o.q + off, o.y, o.p);
      g.rotation.y = o.n > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
    const piece = (w, h, d, x, y, z, material) => {
      const m = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material));
      m.position.set(x, y + h / 2, z);
      g.add(m);
      return m;
    };
    build(g, piece);
    scene.add(g);
    add(g, "pop");
  }
  // slim dark frame, tinted glass, a mullion roughly every 1.2 m
  function glazing(o) {
    onWall(o, (g, piece) => {
      const { w, h } = o;
      piece(w + 0.12, h + 0.12, 0.09, 0, -0.06, 0.0, mat.frame);
      piece(w, h, 0.05, 0, 0, 0.04, mat.glass);
      const n = Math.max(1, Math.round(w / 1.2));
      for (let i = 1; i < n; i++) piece(0.045, h, 0.07, -w / 2 + (w * i) / n, 0, 0.05, mat.frame);
      if (o.kind !== "slide") piece(w + 0.3, 0.07, 0.2, 0, -0.13, 0.05, mat.band); // sill
      if (o.shade) piece(w + 0.5, 0.09, 0.6, 0, h + 0.16, 0.3, mat.band); // thin concrete sunshade
    });
  }
  function door(o) {
    onWall(o, (g, piece) => {
      const { w, h } = o;
      piece(w + 0.18, h + 0.1, 0.1, 0, 0, 0.0, mat.frame);
      piece(w, h - 0.02, 0.07, 0, 0, 0.05, mat.teal);
      for (let i = 0; i < 5; i++) piece(w - 0.3, 0.025, 0.02, 0, 0.35 + i * ((h - 0.7) / 4), 0.095, mat.frame);
      piece(0.03, 1.3, 0.05, w / 2 - 0.16, 0.65, 0.12, mat.metal); // pull handle
    });
  }
  part(4.5, 4.95, () => {
    for (const o of OPENINGS) (o.kind === "door" ? door : glazing)(o);
    // louvred vent in each gable
    for (const sx of [-1, 1]) {
      onWall({ ax: "z", n: sx, p: -1.5, q: sx * 4, y: EAVE + 0.3 }, (g, piece) => {
        piece(1.0, 0.6, 0.06, 0, 0, 0.02, mat.frame);
        for (let i = 0; i < 5; i++) piece(0.88, 0.035, 0.05, 0, 0.07 + i * 0.1, 0.05, mat.metal);
      });
    }
  }, { edges: false });

  // frameless glass balustrade with a slim top rail
  const rail = (x1, z1, x2, z2, y) => {
    const along = z1 === z2;
    const len = Math.hypot(x2 - x1, z2 - z1);
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;
    const p = box(along ? len : 0.025, 1.0, along ? 0.025 : len, cx, y, cz, mat.rail, "y", false);
    p.castShadow = false;
    box(along ? len : 0.05, 0.04, along ? 0.05 : len, cx, y + 1.0, cz, mat.metal, "pop", false);
  };
  part(4.55, 4.95, () => {
    rail(-8.7, 2.62, -4.12, 2.62, FF); // open balcony
    rail(3.96, 4.52, 9.76, 4.52, FF); // terrace over the porch
    rail(9.76, 4.52, 9.76, -4.6, FF);
    rail(9.76, -4.6, 4.14, -4.6, FF);
    rail(3.96, 4.52, 3.96, 1.64, FF);
    rail(-9.3, 2.98, -3.92, 2.98, ROOF); // roof terrace on the left wing
    box(0.14, 0.7, 6.9, -9.33, ROOF, -0.4, mat.plaster, "y", false);
    box(5.46, 0.7, 0.14, -6.6, ROOF, -3.83, mat.plaster, "y", false);
    // timber pergola on the roof terrace
    for (const [x, z] of [[-8.6, -3.0], [-5.0, -3.0], [-8.6, 0.2], [-5.0, 0.2]]) box(0.12, 2.3, 0.12, x, ROOF, z, mat.white, "y", false);
    for (const z of [-3.0, 0.2]) box(4.1, 0.14, 0.12, -6.8, ROOF + 2.3, z, mat.white, "x", false);
    for (let i = 0; i < 10; i++) box(0.07, 0.12, 3.9, -8.6 + i * 0.4, ROOF + 2.44, -1.4, mat.wood, "pop", false);
    // timber ceiling under the balcony roof and the porch slab
    box(4.7, 0.04, 2.1, -6.5, EAVE - 0.04, 1.42, mat.wood, "pop", false);
    box(5.3, 0.04, 5.2, 6.78, GF + H1 - 0.04, 1.6, mat.wood, "pop", false);
  }, { edges: false });

  // boundary wall, gate posts and a sliding slatted gate
  let gate = null;
  part(4.6, 5.0, () => {
    const h = 1.35;
    const seg = (x1, z1, x2, z2) => {
      const along = z1 === z2;
      const len = Math.hypot(x2 - x1, z2 - z1);
      box(along ? len : 0.18, h, along ? 0.18 : len, (x1 + x2) / 2, 0, (z1 + z2) / 2, mat.compound);
      box(along ? len : 0.26, 0.06, along ? 0.26 : len, (x1 + x2) / 2, h, (z1 + z2) / 2, mat.band, "y", false);
    };
    seg(-PX, PZB, -PX, PZF);
    seg(PX, PZB, PX, PZF);
    seg(-PX, PZB, PX, PZB);
    seg(-PX, PZF, GATE[0], PZF);
    seg(GATE[1], PZF, PX, PZF);
    for (const x of GATE) box(0.45, 1.75, 0.45, x, 0, PZF, mat.compound);
    gate = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const s = shadowed(new THREE.Mesh(new THREE.BoxGeometry(GATE[1] - GATE[0] - 0.3, 0.12, 0.04), mat.frame));
      s.position.y = 0.2 + i * 0.18;
      gate.add(s);
    }
    gate.position.set((GATE[0] + GATE[1]) / 2, 0.06, PZF - 0.14);
    gate.userData.x = gate.position.x;
    scene.add(gate);
    add(gate, "y");
  });

  /* ═════════ 5–6 · ground finishes ═════════ */
  const flat = (w, d, x, z, material, y, order = 2, tile = 2.4) => {
    const pg = new THREE.PlaneGeometry(w, d);
    const uv = pg.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * d) / tile);
    const m = new THREE.Mesh(pg, material);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    m.receiveShadow = true;
    m.renderOrder = order;
    scene.add(m);
    return m;
  };
  const grounds = [
    flat(PX * 2 - 0.2, PZF - PZB - 0.2, 0, (PZF + PZB) / 2, mat.lawn, 0.05, 1, 3.6),
    flat(90, 7.0, 0, PZF + 5.4, mat.road, 0.03, 1, 3.5),
    flat(90, 1.75, 0, PZF + 1.0, mat.walk, 0.06, 1, 1.75),
    flat(5.6, 9.0, 7.0, 8.8, mat.paver, 0.075), // drive
    flat(5.0, 1.7, 1.9, 5.5, mat.paver, 0.075), // walk from the drive to the sit-out
    flat(3.2, 1.4, -1.5, 5.15, mat.paver, 0.075),
    flat(6.9, 5.6, -8.15, 6.8, mat.deck, 0.085, 2, 2.0), // pool deck
  ];
  for (let i = 0; i < 12; i++) grounds.push(flat(2.2, 0.16, -38.5 + i * 7, PZF + 5.4, mat.marking, 0.04, 2));

  /* ═════════ 6–7 · pool, garden, furniture, car ═════════ */
  /** Canopy: a dark core that casts the shadow, clothed in leaf cards for a real leafy silhouette. */
  const cardGeo = new THREE.PlaneGeometry(1, 1);
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _q2 = new THREE.Quaternion();
  const _p = new THREE.Vector3();
  const _n = new THREE.Vector3();
  const _s = new THREE.Vector3();
  const _z = new THREE.Vector3(0, 0, 1);
  function canopy(parent, cx, cy, cz, r, count, squash = 0.82) {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.86, 1), mat.core);
    core.position.set(cx, cy, cz);
    core.scale.y = squash;
    core.castShadow = true;
    parent.add(core);
    const cards = new THREE.InstancedMesh(cardGeo, mat.leaves[(rnd() * mat.leaves.length) | 0], count);
    for (let i = 0; i < count; i++) {
      _n.set(rnd() * 2 - 1, rnd() * 1.7 - 0.7, rnd() * 2 - 1).normalize();
      const d = r * lerp(0.82, 1.08, rnd());
      _p.set(cx + _n.x * d, cy + _n.y * d * squash, cz + _n.z * d);
      _q.setFromUnitVectors(_z, _n);
      _q2.setFromAxisAngle(_z, rnd() * 6.283);
      _q.multiply(_q2);
      _s.setScalar(r * lerp(0.8, 1.25, rnd()));
      cards.setMatrixAt(i, _m.compose(_p, _q, _s));
    }
    cards.instanceMatrix.needsUpdate = true;
    cards.receiveShadow = true;
    parent.add(cards);
  }
  function tree(x, z, h, r) {
    const g = new THREE.Group();
    const tg = new THREE.CylinderGeometry(r * 0.09, r * 0.16, h, 8);
    tg.translate(0, h / 2, 0);
    g.add(shadowed(new THREE.Mesh(tg, mat.bark)));
    canopy(g, 0, h + r * 0.35, 0, r, small ? 40 : 80);
    const n = 3 + ((rnd() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + rnd();
      const d = r * lerp(0.55, 0.85, rnd());
      canopy(g, Math.cos(a) * d, h + r * lerp(-0.1, 0.3, rnd()), Math.sin(a) * d, r * lerp(0.5, 0.7, rnd()), small ? 22 : 44);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rnd() * 6.283;
    scene.add(g);
    add(g, "pop");
  }
  function palm(x, z, h, lean = 0.9) {
    const g = new THREE.Group();
    const tg = new THREE.CylinderGeometry(0.13, 0.22, h, 10, 12);
    tg.translate(0, h / 2, 0);
    const p = tg.attributes.position;
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + lean * Math.pow(p.getY(i) / h, 2));
    tg.computeVertexNormals();
    g.add(shadowed(new THREE.Mesh(tg, mat.trunk)));
    const crown = new THREE.Group();
    crown.position.set(lean, h - 0.05, 0);
    const n = 18;
    for (let i = 0; i < n; i++) {
      const len = lerp(3.0, 4.1, rnd());
      const fg = new THREE.PlaneGeometry(len, 1.2, 9, 2);
      fg.rotateX(-Math.PI / 2);
      fg.translate(len / 2, 0, 0);
      const fp = fg.attributes.position;
      const rise = lerp(0.05, 1.3, rnd());
      for (let k = 0; k < fp.count; k++) {
        const t = fp.getX(k) / len;
        fp.setY(k, rise * len * t - 1.1 * len * t * t - Math.abs(fp.getZ(k)) * 0.4);
      }
      fg.computeVertexNormals();
      const f = new THREE.Mesh(fg, mat.frond);
      f.rotation.y = (i / n) * 6.283 + rnd() * 0.5;
      f.castShadow = true;
      crown.add(f);
    }
    for (let i = 0; i < 5; i++) {
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), mat.bark);
      c.position.set(Math.cos(i * 1.3) * 0.24, -0.3, Math.sin(i * 1.3) * 0.24);
      crown.add(c);
    }
    g.add(crown);
    g.position.set(x, 0, z);
    g.rotation.y = rnd() * 6.283;
    scene.add(g);
    add(g, "pop");
  }
  function bush(x, z, r, y = 0) {
    const g = new THREE.Group();
    canopy(g, 0, r * 0.7, 0, r, small ? 18 : 30, 0.78);
    g.position.set(x, y, z);
    scene.add(g);
    add(g, "pop");
  }
  const hedge = (w, h, d, x, z) => box(w, h, d, x, 0.05, z, mat.hedge, "y", false);
  function planter(x, z, y, w = 1.6, d = 0.45) {
    box(w, 0.45, d, x, y, z, mat.white, "pop", false);
    for (let i = 0; i < Math.round(w / 0.5); i++) bush(x - w / 2 + 0.28 + i * 0.5, z, 0.26, y + 0.36);
  }
  /** Furniture is built in a group; (x, z) is its centre on a floor at height y. */
  function furniture(x, y, z, rot, build) {
    const g = new THREE.Group();
    const piece = (w, h, d, px, py, pz, material) => {
      const m = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material));
      m.position.set(px, py + h / 2, pz);
      g.add(m);
      return m;
    };
    build(g, piece);
    g.position.set(x, y, z);
    g.rotation.y = rot;
    scene.add(g);
    add(g, "pop");
  }
  const chair = (x, y, z, rot) => furniture(x, y, z, rot, (g, piece) => {
    for (const sx of [-0.22, 0.22]) for (const sz of [-0.22, 0.22]) piece(0.04, 0.42, 0.04, sx, 0, sz, mat.white);
    piece(0.52, 0.05, 0.52, 0, 0.42, 0, mat.white);
    piece(0.46, 0.07, 0.46, 0, 0.47, 0, mat.cushion);
    piece(0.52, 0.42, 0.05, 0, 0.47, -0.24, mat.white);
  });
  const table = (x, y, z, r = 0.55) => furniture(x, y, z, 0, (g) => {
    const top = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.04, 32), mat.white));
    top.position.y = 0.73;
    const leg = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 12), mat.metal));
    leg.position.y = 0.36;
    const foot = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r * 0.5, 0.03, 24), mat.metal));
    foot.position.y = 0.015;
    g.add(top, leg, foot);
  });
  const parasol = (x, y, z) => furniture(x, y, z, 0, (g) => {
    const pole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.5, 10), mat.metal));
    pole.position.y = 1.25;
    const top = shadowed(new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.45, 8, 1, true), mat.cushion));
    top.material.side = THREE.DoubleSide;
    top.position.y = 2.42;
    g.add(pole, top);
  });
  const lounger = (x, y, z, rot) => furniture(x, y, z, rot, (g, piece) => {
    piece(0.68, 0.22, 1.95, 0, 0, 0, mat.white);
    piece(0.6, 0.08, 1.3, 0, 0.22, 0.3, mat.cushion);
    const back = piece(0.6, 0.08, 0.7, 0, 0.36, -0.62, mat.cushion);
    back.rotation.x = 0.5;
  });

  part(6.0, 6.35, () => {
    // pool: stone coping and water
    box(5.5, 0.14, 0.4, -8.15, 0.06, 5.0, mat.white, "pop", false);
    box(5.5, 0.14, 0.4, -8.15, 0.06, 8.6, mat.white, "pop", false);
    box(0.4, 0.14, 3.2, -10.7, 0.06, 6.8, mat.white, "pop", false);
    box(0.4, 0.14, 3.2, -5.6, 0.06, 6.8, mat.white, "pop", false);
    const w = new THREE.Mesh(new THREE.PlaneGeometry(4.75, 3.25), mat.water);
    w.rotation.x = -Math.PI / 2;
    w.position.set(-8.15, 0.15, 6.8);
    w.receiveShadow = true;
    scene.add(w);
    add(w, "pop");
    lounger(-9.6, 0.09, 4.1, Math.PI);
    lounger(-8.5, 0.09, 4.1, Math.PI);
    parasol(-7.3, 0.09, 4.2);
    // tulsi thara on axis with the front door
    box(0.72, 0.2, 0.72, -1.5, 0.07, 7.4, mat.compound, "pop", false);
    box(0.5, 0.6, 0.5, -1.5, 0.27, 7.4, mat.compound, "pop", false);
    box(0.62, 0.08, 0.62, -1.5, 0.87, 7.4, mat.teal, "pop", false);
    bush(-1.5, 7.4, 0.24, 0.92);
  }, { edges: false });

  part(6.1, 6.6, () => {
    // clipped hedges and planting inside the wall
    hedge(0.7, 0.8, PZF - PZB - 1.2, -PX + 0.65, (PZF + PZB) / 2);
    hedge(0.7, 0.8, 11.5, PX - 0.65, -2.0);
    hedge(PX * 2 - 1.6, 0.9, 0.7, 0, PZB + 0.65);
    hedge(15.6, 0.7, 0.65, -4.0, PZF - 0.6);
    hedge(4.6, 0.55, 0.55, -6.6, 3.05);
    for (const x of [-3.4, 0.6]) bush(x, 4.35, 0.36);
    for (let i = 0; i < 5; i++) bush(-11.2 + i * 0.15, -5.6 + i * 2.3, lerp(0.45, 0.7, rnd()));
    for (let i = 0; i < 4; i++) bush(2.6 + (i % 2) * 0.5, 7.0 + i * 1.5, lerp(0.4, 0.55, rnd()));
    planter(5.3, 4.2, FF, 2.2);
    planter(8.45, 4.2, FF, 2.2);
    planter(-6.4, 2.3, FF, 3.6, 0.4);
    tree(-11.0, -6.6, 1.8, 1.4);
    for (const x of [-3.6, -2.2, 0.4, 1.8]) bush(x, 11.6, 0.5);
    // dining set under a parasol on the terrace, two chairs on the balcony
    table(6.9, FF, 1.9);
    for (let i = 0; i < 4; i++) chair(6.9 + Math.sin(i * 1.5708) * 0.95, FF, 1.9 + Math.cos(i * 1.5708) * 0.95, i * 1.5708 + Math.PI);
    parasol(6.9, FF, 1.9);
    lounger(8.6, FF, -0.3, -Math.PI / 2);
    table(-6.5, FF, 1.5, 0.36);
    chair(-7.4, FF, 1.45, Math.PI / 2 + 0.3);
    chair(-5.6, FF, 1.45, -Math.PI / 2 - 0.3);
    // solar panels at the back of the terrace
    for (const x of [5.2, 6.4, 7.6]) {
      for (const z of [-3.6, -2.0]) {
        const p = box(1.05, 0.05, 1.45, x, FF + 0.4, z, mat.solar, "pop", false);
        p.rotation.x = 0.26;
        box(0.05, 0.36, 0.05, x, FF, z - 0.5, mat.metal, "pop", false);
      }
    }
  }, { edges: false });

  // palms and the belt of trees around the plot (kept clear of the camera's view from the front)
  part(6.15, 6.95, () => {
    palm(-10.6, -5.4, 9.8, 1.0);
    palm(10.4, -5.9, 10.8, -1.0);
    palm(-11.0, 10.6, 7.4, 0.7);
    palm(-15.2, 1.2, 9.2, -0.9);
    palm(15.4, -1.2, 9.8, 1.0);
    palm(-3.2, -12.6, 11.4, 0.8);
    palm(5.0, -13.4, 10.4, -1.2);
    palm(-16.0, -9.8, 10.6, 1.2);
    palm(16.8, -10.4, 11.6, -0.8);
    palm(-17.6, 7.4, 9.0, 1.0);
    palm(17.8, 6.2, 9.6, -1.1);
    for (let i = 0; i < 16; i++) {
      const a = lerp(1.3, 4.98, i / 15) + (rnd() - 0.5) * 0.14;
      const R = lerp(18, 24, rnd());
      tree(Math.sin(a) * R, Math.cos(a) * R * 0.85 - 2.0, lerp(2.6, 4.4, rnd()), lerp(2.6, 3.8, rnd()));
    }
    for (let i = 0; i < 16; i++) {
      const a = lerp(1.1, 5.18, i / 15) + (rnd() - 0.5) * 0.12;
      const R = lerp(29, 40, rnd());
      tree(Math.sin(a) * R, Math.cos(a) * R * 0.9 - 4, lerp(3.6, 6.4, rnd()), lerp(3.8, 5.6, rnd()));
    }
    for (const [x, z] of [[-26, 27], [-15, 29], [22, 28], [31, 26], [-36, 23], [40, 22]]) tree(x, z, 2.4, lerp(2.4, 3.2, rnd()));
  }, { edges: false });

  // the car, which drives in through the gate
  const car = new THREE.Group();
  {
    const sh = new THREE.Shape();
    const pts = [[-2.2, 0.32], [-2.28, 0.8], [-2.05, 1.02], [-1.72, 1.5], [0.35, 1.52], [1.15, 1.02], [2.1, 0.9], [2.3, 0.62], [2.24, 0.32]];
    sh.moveTo(pts[0][0], pts[0][1]);
    for (const [px, py] of pts.slice(1)) sh.lineTo(px, py);
    sh.closePath();
    const bg = new THREE.ExtrudeGeometry(sh, { depth: 1.62, bevelEnabled: true, bevelSize: 0.09, bevelThickness: 0.09, bevelSegments: 4 });
    bg.translate(0, 0, -0.81);
    car.add(shadowed(new THREE.Mesh(bg, mat.paint)));
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.4, 1.83), mat.glass);
    band.position.set(-0.68, 1.25, 0);
    car.add(band);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 1.5), mat.glass);
    screen.position.set(0.79, 1.3, 0);
    screen.rotation.z = 1.012;
    car.add(screen);
    const rear = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 1.5), mat.glass);
    rear.position.set(-1.92, 1.27, 0);
    rear.rotation.z = -0.54;
    car.add(rear);
    for (const wx of [-1.42, 1.42]) {
      for (const wz of [-0.84, 0.84]) {
        const w = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 24), mat.tyre));
        w.rotation.x = Math.PI / 2;
        w.position.set(wx, 0.36, wz);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.28, 16), mat.metal);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wx, 0.36, wz);
        car.add(w, hub);
      }
    }
    for (const lz of [-0.55, 0.55]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.42), mat.white);
      hl.position.set(2.31, 0.74, lz);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.4), new THREE.MeshStandardMaterial({ color: 0x8a1414, roughness: 0.4 }));
      tl.position.set(-2.3, 0.86, lz);
      car.add(hl, tl);
    }
    car.rotation.y = Math.PI / 2; // nose towards the house
    car.position.set(7.0, 0.1, PZF + 7);
    car.visible = false;
    scene.add(car);
  }
  // a properly modelled car replaces the simple stand-in above once it has loaded
  if (opts.assets) {
    Promise.all([import("three/addons/loaders/GLTFLoader.js"), import("three/addons/libs/meshopt_decoder.module.js")])
      .then(([{ GLTFLoader }, { MeshoptDecoder }]) => {
        const gltfLoader = new GLTFLoader();
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);
        gltfLoader.load(opts.assets + "car.glb", (gltf) => {
          const model = gltf.scene;
          model.traverse((o) => {
            if (!o.isMesh) return;
            o.castShadow = true;
            o.receiveShadow = true;
            const m = o.material;
            if (m.transmission > 0) {
              // tinted, mirror-like glass to match the house (and avoid a costly transmission pass)
              m.transmission = 0;
              m.transparent = false;
              m.color.set(0x55646f);
              m.metalness = 1;
              m.roughness = 0.06;
            }
            if (/^Paint 1/.test(m.name)) {
              m.color.set(0x1b2530); // deep graphite blue, in place of the model's default red
              m.metalness = 0.85;
              m.roughness = 0.28;
            }
            m.envMapIntensity = 1.2;
          });
          // The model is true to scale (4.36 m long), stands on y = 0 and faces +z, with its middle
          // 0.24 m ahead of its origin. These figures come from the file itself: measuring it at run time
          // is unreliable because its four wheels are instanced, which inflates the computed bounds.
          const holder = new THREE.Group();
          model.position.set(0, 0, -0.238);
          holder.add(model);
          holder.rotation.y = Math.PI / 2; // the car group expects the nose along +x
          car.clear();
          car.add(holder);
        }, undefined, () => {});
      })
      .catch(() => {});
  }

  /* ───────── photographic sky and scanned textures ───────── */
  // Optional. Everything above already works with procedural stand-ins; these replace them as they load.
  const SKY_SUN = { u: 0.5998, v: 0.2288 }; // where the sun sits in sky.jpg (fraction across, fraction down)
  if (opts.assets) {
    const loader = new THREE.TextureLoader();
    const load = (file, srgb, done) =>
      loader.load(opts.assets + file, (t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        done(t);
      }, undefined, () => {});
    const set = (m, props) => {
      Object.assign(m, props);
      m.needsUpdate = true;
    };

    load("sky.jpg", true, (t) => {
      t.wrapT = THREE.ClampToEdgeWrapping;
      // turn the dome so the photographed sun sits where the key light comes from, and match its height
      const theta = SKY_SUN.v * Math.PI;
      const phi = SKY_SUN.u * Math.PI * 2;
      const lx = -Math.cos(phi) * Math.sin(theta);
      const lz = Math.sin(phi) * Math.sin(theta);
      sky.rotation.y = Math.atan2(SUN.x, SUN.z) - Math.atan2(lx, lz);
      const flatLen = Math.hypot(SUN.x, SUN.z);
      SUN.set((SUN.x / flatLen) * Math.sin(theta), Math.cos(theta), (SUN.z / flatLen) * Math.sin(theta));
      key.position.copy(SUN).multiplyScalar(60);
      set(sky.material, { map: t, toneMapped: false });
      haze.set(0xaab3c6);
      // ambient light and reflections from the same sky
      const pm = new THREE.PMREMGenerator(renderer);
      const env = new THREE.Scene();
      const dome = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
      dome.rotation.y = sky.rotation.y;
      env.add(dome);
      const old = scene.environment;
      scene.environment = pm.fromScene(env, 0.02, 1, 800).texture;
      if (old) old.dispose();
      pm.dispose();
    });
    load("roof_navy.jpg", true, (t) => set(mat.tile, { map: t }));
    load("roof_nor.jpg", false, (t) => {
      set(mat.tile, { normalMap: t, bumpMap: null });
      mat.tile.normalScale.set(1.6, 1.6);
    });
    load("grass_nor.jpg", false, (t) => {
      set(mat.lawn, { normalMap: t, bumpMap: null });
      mat.lawn.normalScale.set(1.5, 1.5);
    });
    load("grass_diff.jpg", true, (t) => {
      t.repeat.set(130, 130);
      set(groundMat, { map: t });
    });
    load("paving_diff.jpg", true, (t) => {
      set(mat.paver, { map: t });
      set(mat.walk, { map: t });
      mat.walk.color.set(0xffffff);
    });
    load("paving_nor.jpg", false, (t) => {
      set(mat.paver, { normalMap: t });
      set(mat.walk, { normalMap: t, bumpMap: null });
    });
    load("asphalt_nor.jpg", false, (t) => {
      set(mat.road, { normalMap: t });
      mat.road.normalScale.set(0.7, 0.7);
    });
  }

  /* ───────── per-frame update ───────── */
  const gold = new THREE.Color(GOLD);
  const white = new THREE.Color(LINE);
  const black = new THREE.Color(BG);
  const groundDark = new THREE.Color(0x0d0d0d);
  const skyA = new THREE.Color(0xc4ccda);
  const skyB = new THREE.Color(0xbcd8ff);
  const earthA = new THREE.Color(0x1c1a16);
  const earthB = new THREE.Color(0x8f9670);
  const tmp = new THREE.Color();
  let width = 1;
  let height = 1;

  function applyStage(s, time) {
    const finish = span(s, 5.05, 5.95);
    const day = span(s, 5.2, 6.1);
    const lifted = span(s, 1.6, 2.05) * PL;

    for (const p of parts) {
      const u = lin(s, p.a, p.b);
      const gone = p.out ? span(s, p.out[0], p.out[1]) : 0;
      const n = p.items.length;
      for (let i = 0; i < n; i++) {
        const it = p.items[i];
        const st = n > 1 ? (i / (n - 1)) * 0.55 : 0;
        const t = ease(clamp01((u - st) / 0.45));
        const o = it.obj;
        if (it.mode === "fade") {
          o.material.opacity = t * (1 - gone);
          o.visible = o.material.opacity > 0.003;
        } else {
          o.visible = t > 0.002 && gone < 0.998;
          const v = Math.max(t, 0.002);
          if (it.mode === "y") o.scale.y = v;
          else if (it.mode === "x") o.scale.x = v;
          else if (it.mode === "z") o.scale.z = v;
          else o.scale.setScalar(v);
        }
        // the plan is carried up on the plinth, so the walls rise from the very lines that were drawn
        if (p.lift && o.userData.y !== undefined) o.position.y = o.userData.y + lifted;
      }
      // newest work is gold, then settles to white
      const age = lin(s, p.b + 0.25, p.b + 1.0);
      tmp.copy(gold).lerp(white, age);
      if (p.edge) {
        p.edge.color.copy(tmp);
        p.edge.opacity = (u > 0 ? 1 : 0) * (1 - finish) * lerp(1, 0.55, age);
      }
      if (p.flat) {
        if (p.color === null) p.flat.color.copy(tmp);
        p.flat.opacity = (1 - gone) * lerp(1, 0.55, span(s, 1.9, 2.6));
      }
    }

    for (const m of finishMats) m.color.copy(m.userData.from).lerp(m.userData.to, finish);
    const laid = span(s, 5.2, 5.95);
    for (const g of grounds) {
      g.material.opacity = laid;
      g.visible = laid > 0.004;
    }
    grid.material.opacity = 1 - day;
    grid.visible = day < 0.995;
    groundMat.color.copy(groundDark).lerp(lawnTone, day);

    // black studio → bright morning
    sky.material.opacity = day;
    sky.visible = day > 0.003;
    scene.fog.color.copy(black).lerp(haze, day);
    scene.environmentIntensity = lerp(0.25, 0.95, day);
    hemi.color.copy(skyA).lerp(skyB, day);
    hemi.groundColor.copy(earthA).lerp(earthB, day);
    hemi.intensity = lerp(1.3, 0.75, day);
    key.intensity = lerp(1.5, 3.6, day);
    fill.intensity = lerp(0.35, 0.25, day);
    renderer.toneMappingExposure = lerp(1.0, 0.86, day);
    if (mat.water.bumpMap) mat.water.bumpMap.offset.set(time * 0.00002, time * 0.000013);

    // the gate slides open, the car drives in and parks under the porch, the gate closes
    const open = span(s, 6.3, 6.5) - span(s, 7.0, 7.2);
    if (gate) gate.position.x = gate.userData.x - 4.3 * open;
    car.visible = s > 6.3;
    car.position.z = lerp(PZF + 7, 1.7, span(s, 6.4, 6.98));
    car.rotation.y = -Math.PI / 2 + Math.PI; // faces the house on the way in

    /* camera */
    const tilt = span(s, 1.0, 2.35);
    const end = span(s, 7.0, 7.8);
    const phi = lerp(0.035, 1.0, tilt) + 0.3 * span(s, 2.35, 5.6) + 0.12 * span(s, 5.6, 6.9) + 0.03 * end
      + Math.sin(time * 0.00031) * 0.012 * span(s, 7.25, 7.85);
    // views from the front-left during the build, swinging round to the right as the garden grows;
    // the closing shot then pans from right to left and settles square-on to the front of the house
    const settle = span(s, 7.25, 7.85);
    let theta = lerp(0, -0.62, tilt) + 0.2 * lin(s, 2.35, 6.0) + 1.24 * span(s, 5.9, 6.95) - 0.82 * span(s, 7.0, 7.8);
    theta += Math.sin(time * 0.00045) * 0.075 * settle; // slow side-to-side sway once it has settled
    const aspect = width / height;
    const wide = aspect > 1.15;
    // look at the middle of the plot for the plan, then at the house
    const tx = lerp(0, 0.2, tilt);
    const tz = lerp(2.65, 1.6, tilt);
    const ty = lerp(0, 3.6, span(s, 1.2, 4.6));
    const hw = lerp(16.4, wide ? 15.2 : 12.2, tilt) + (wide ? 3.2 : 1.2) * end;
    const hh = lerp(13.8, 10.6, tilt) - 1.0 * span(s, 4.6, 6.4) + 4.8 * end;
    const tanF = Math.tan((camera.fov * Math.PI) / 360);
    const d = Math.max(hh / tanF, hw / (tanF * aspect));
    camera.position.set(tx + d * Math.sin(phi) * Math.sin(theta), ty + d * Math.cos(phi), tz + d * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(tx, ty, tz);
    scene.fog.near = d + lerp(10, 40, day);
    scene.fog.far = d + lerp(70, 420, day);

    // keep the house clear of the text cards (desktop: nudge right) and of the logo at the end (nudge up)
    const ox = wide ? lerp(-0.1, 0, end) * lerp(0.4, 1, tilt) : 0;
    const oy = lerp(wide ? 0.0 : 0.06 * tilt - 0.03, wide ? 0.15 : 0.17, end) - 0.05 * span(s, 5.6, 6.9) * (1 - end);
    camera.setViewOffset(width, height, ox * width, oy * height, width, height);
  }

  /* ───────── loop ───────── */
  let target = 0;
  let current = 0;
  let active = true;
  let raf = 0;
  let last = 0;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!active) return;
    const dt = Math.min(0.1, (time - last) / 1000 || 0.016);
    last = time;
    // ease towards the scroll position so the build never jumps
    current = reduced ? target : current + (target - current) * (1 - Math.exp(-dt * 3.2));
    if (Math.abs(target - current) < 0.0004) current = target;
    applyStage(current, reduced ? 0 : time);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 700 ? 1.75 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resize();
  raf = requestAnimationFrame(frame);

  return {
    setStage(s) {
      target = Math.max(0, Math.min(8, s));
    },
    resize,
    setActive(on) {
      active = on;
    },
    dispose() {
      cancelAnimationFrame(raf);
      const seen = new Set();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const list = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        for (const m of list) {
          if (seen.has(m)) continue;
          seen.add(m);
          for (const k of ["map", "bumpMap", "emissiveMap"]) if (m[k]) m[k].dispose();
          m.dispose();
        }
      });
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
    },
  };
}
