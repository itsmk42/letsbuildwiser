"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Blueprint line element for 2D CAD-style drawings
interface BlueprintLine {
    line: THREE.Line;
    phase: number;      // When this line appears (1-6)
    delay: number;      // Stagger delay within phase
    isFloorPlan: boolean;  // true = floor plan, false = elevation
}

// Create a 2D line from points
const createLine = (
    points: THREE.Vector3[],
    color: number,
    lineWidth: number = 1,
    dashed: boolean = false
): THREE.Line => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = dashed
        ? new THREE.LineDashedMaterial({
            color,
            transparent: true,
            opacity: 1,
            dashSize: 0.2,
            gapSize: 0.1,
            linewidth: lineWidth,
        })
        : new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 1,
            linewidth: lineWidth,
        });
    const line = new THREE.Line(geometry, material);
    if (dashed) line.computeLineDistances();
    return line;
};

// Create rectangle outline
const createRect = (
    x: number, y: number,
    width: number, height: number,
    color: number,
    dashed: boolean = false
): THREE.Line => {
    const hw = width / 2;
    const hh = height / 2;
    const points = [
        new THREE.Vector3(x - hw, y - hh, 0),
        new THREE.Vector3(x + hw, y - hh, 0),
        new THREE.Vector3(x + hw, y + hh, 0),
        new THREE.Vector3(x - hw, y + hh, 0),
        new THREE.Vector3(x - hw, y - hh, 0),
    ];
    return createLine(points, color, 1, dashed);
};

// Create arc for door swing (floor plan)
const createArc = (
    cx: number, cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: number,
    segments: number = 16
): THREE.Line => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        points.push(new THREE.Vector3(
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius,
            0
        ));
    }
    return createLine(points, color, 1, true);
};

// Create toilet symbol (floor plan)
const createToilet = (x: number, y: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    // Bowl
    const bowlPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) {
        const angle = Math.PI * 2 * (i / 16);
        bowlPoints.push(new THREE.Vector3(x + Math.cos(angle) * 0.2, y + Math.sin(angle) * 0.25, 0));
    }
    group.add(createLine(bowlPoints, color));
    // Tank
    group.add(createRect(x, y - 0.35, 0.35, 0.15, color));
    return group;
};

// Create sink symbol (floor plan)
const createSink = (x: number, y: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, 0.4, 0.3, color));
    // Drain circle
    const drainPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 12; i++) {
        const angle = Math.PI * 2 * (i / 12);
        drainPoints.push(new THREE.Vector3(x + Math.cos(angle) * 0.05, y + Math.sin(angle) * 0.05, 0));
    }
    group.add(createLine(drainPoints, color));
    return group;
};

// Create bathtub symbol (floor plan)
const createBathtub = (x: number, y: number, w: number, h: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, w, h, color));
    group.add(createRect(x, y, w - 0.1, h - 0.1, color)); // Inner outline
    return group;
};

// Create bed symbol (floor plan)
const createBed = (x: number, y: number, w: number, h: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, w, h, color));
    // Pillow
    group.add(createRect(x, y + h/2 - 0.15, w - 0.1, 0.2, color));
    return group;
};

// Create sofa symbol (floor plan)
const createSofa = (x: number, y: number, w: number, h: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, w, h, color));
    // Back rest
    group.add(createLine([
        new THREE.Vector3(x - w/2 + 0.05, y - h/2 + 0.1, 0),
        new THREE.Vector3(x + w/2 - 0.05, y - h/2 + 0.1, 0)
    ], color));
    return group;
};

// Create dining table (floor plan)
const createDiningTable = (x: number, y: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, 0.8, 0.5, color));
    // Chairs
    group.add(createRect(x - 0.25, y + 0.35, 0.2, 0.1, color));
    group.add(createRect(x + 0.25, y + 0.35, 0.2, 0.1, color));
    group.add(createRect(x - 0.25, y - 0.35, 0.2, 0.1, color));
    group.add(createRect(x + 0.25, y - 0.35, 0.2, 0.1, color));
    return group;
};

// Create kitchen counter (floor plan)
const createKitchenCounter = (x: number, y: number, w: number, h: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, w, h, color));
    // Stove burners
    for (let i = 0; i < 2; i++) {
        const bx = x - 0.15 + i * 0.3;
        const circlePoints: THREE.Vector3[] = [];
        for (let j = 0; j <= 8; j++) {
            const angle = Math.PI * 2 * (j / 8);
            circlePoints.push(new THREE.Vector3(bx + Math.cos(angle) * 0.08, y + Math.sin(angle) * 0.08, 0));
        }
        group.add(createLine(circlePoints, color));
    }
    return group;
};

// Create staircase (floor plan)
const createStairs = (x: number, y: number, w: number, h: number, steps: number, color: number): THREE.Group => {
    const group = new THREE.Group();
    group.add(createRect(x, y, w, h, color));
    const stepHeight = h / steps;
    for (let i = 1; i < steps; i++) {
        group.add(createLine([
            new THREE.Vector3(x - w/2, y - h/2 + i * stepHeight, 0),
            new THREE.Vector3(x + w/2, y - h/2 + i * stepHeight, 0)
        ], color));
    }
    // Arrow indicating up direction
    group.add(createLine([
        new THREE.Vector3(x, y - h/2 + 0.1, 0),
        new THREE.Vector3(x, y + h/2 - 0.1, 0)
    ], color));
    group.add(createLine([
        new THREE.Vector3(x - 0.1, y + h/2 - 0.2, 0),
        new THREE.Vector3(x, y + h/2 - 0.1, 0),
        new THREE.Vector3(x + 0.1, y + h/2 - 0.2, 0)
    ], color));
    return group;
};

// Create detailed window for elevation
const createWindowElevation = (
    x: number, y: number,
    width: number, height: number,
    color: number,
    detailColor: number
): THREE.Group => {
    const group = new THREE.Group();
    const hw = width / 2;
    const hh = height / 2;

    // Outer frame with depth effect
    group.add(createRect(x, y, width, height, color));
    group.add(createRect(x + 0.02, y - 0.02, width, height, detailColor)); // Shadow offset

    // Inner frame
    group.add(createRect(x, y, width - 0.1, height - 0.1, detailColor));

    // Mullions (4-pane window)
    group.add(createLine([new THREE.Vector3(x, y - hh + 0.05, 0), new THREE.Vector3(x, y + hh - 0.05, 0)], color));
    group.add(createLine([new THREE.Vector3(x - hw + 0.05, y, 0), new THREE.Vector3(x + hw - 0.05, y, 0)], color));

    // Window sill
    group.add(createLine([
        new THREE.Vector3(x - hw - 0.08, y - hh - 0.05, 0),
        new THREE.Vector3(x + hw + 0.08, y - hh - 0.05, 0)
    ], color));
    group.add(createLine([
        new THREE.Vector3(x - hw - 0.08, y - hh - 0.08, 0),
        new THREE.Vector3(x + hw + 0.08, y - hh - 0.08, 0)
    ], detailColor));

    return group;
};

// Create detailed door for elevation
const createDoorElevation = (
    x: number, y: number,
    width: number, height: number,
    color: number,
    accentColor: number,
    detailColor: number
): THREE.Group => {
    const group = new THREE.Group();
    const hw = width / 2;

    // Frame with depth
    group.add(createLine([
        new THREE.Vector3(x - hw - 0.05, y, 0),
        new THREE.Vector3(x - hw - 0.05, y + height + 0.1, 0),
        new THREE.Vector3(x + hw + 0.05, y + height + 0.1, 0),
        new THREE.Vector3(x + hw + 0.05, y, 0),
    ], color));

    // Door panels (double door)
    group.add(createRect(x - hw/2, y + height/2, width * 0.42, height * 0.95, color));
    group.add(createRect(x + hw/2, y + height/2, width * 0.42, height * 0.95, color));

    // Panel details
    group.add(createRect(x - hw/2, y + height * 0.7, width * 0.3, height * 0.4, detailColor));
    group.add(createRect(x - hw/2, y + height * 0.25, width * 0.3, height * 0.3, detailColor));
    group.add(createRect(x + hw/2, y + height * 0.7, width * 0.3, height * 0.4, detailColor));
    group.add(createRect(x + hw/2, y + height * 0.25, width * 0.3, height * 0.3, detailColor));

    // Door handles
    group.add(createLine([
        new THREE.Vector3(x - 0.05, y + height * 0.45, 0),
        new THREE.Vector3(x - 0.05, y + height * 0.55, 0)
    ], accentColor));
    group.add(createLine([
        new THREE.Vector3(x + 0.05, y + height * 0.45, 0),
        new THREE.Vector3(x + 0.05, y + height * 0.55, 0)
    ], accentColor));

    // Decorative arch above door
    const archPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 12; i++) {
        const angle = Math.PI * (i / 12);
        archPoints.push(new THREE.Vector3(
            x + Math.cos(angle) * hw * 0.6,
            y + height + 0.15 + Math.sin(angle) * 0.15,
            0
        ));
    }
    group.add(createLine(archPoints, accentColor));

    return group;
};

// Create detailed roof for elevation
const createRoofElevation = (
    x: number, y: number,
    width: number, peakHeight: number,
    color: number, accentColor: number,
    detailColor: number
): THREE.Group => {
    const group = new THREE.Group();
    const hw = width / 2;
    const overhang = 0.4;

    // Main roof outline with overhang
    group.add(createLine([
        new THREE.Vector3(x - hw - overhang, y, 0),
        new THREE.Vector3(x, y + peakHeight, 0),
        new THREE.Vector3(x + hw + overhang, y, 0),
    ], color));

    // Inner roof line (depth effect)
    group.add(createLine([
        new THREE.Vector3(x - hw - overhang + 0.05, y - 0.05, 0),
        new THREE.Vector3(x, y + peakHeight - 0.05, 0),
        new THREE.Vector3(x + hw + overhang - 0.05, y - 0.05, 0),
    ], detailColor));

    // Fascia/overhang detail
    group.add(createLine([
        new THREE.Vector3(x - hw - overhang, y, 0),
        new THREE.Vector3(x - hw - overhang, y - 0.12, 0),
        new THREE.Vector3(x + hw + overhang, y - 0.12, 0),
        new THREE.Vector3(x + hw + overhang, y, 0),
    ], color));

    // Roof tile pattern (hatching lines)
    const tileSpacing = 0.25;
    for (let i = 1; i < peakHeight / tileSpacing; i++) {
        const tileY = y + i * tileSpacing;
        const ratio = 1 - (i * tileSpacing / peakHeight);
        const tileHW = (hw + overhang) * ratio;
        if (tileHW > 0.1) {
            group.add(createLine([
                new THREE.Vector3(x - tileHW, tileY, 0),
                new THREE.Vector3(x + tileHW, tileY, 0),
            ], detailColor));
        }
    }

    // Ridge decoration
    group.add(createLine([
        new THREE.Vector3(x - 0.25, y + peakHeight, 0),
        new THREE.Vector3(x + 0.25, y + peakHeight, 0),
    ], accentColor));
    group.add(createLine([
        new THREE.Vector3(x - 0.2, y + peakHeight + 0.08, 0),
        new THREE.Vector3(x + 0.2, y + peakHeight + 0.08, 0),
    ], accentColor));

    return group;
};




export default function BuildingAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const blueprintLinesRef = useRef<BlueprintLine[]>([]);
    const floorPlanGroupRef = useRef<THREE.Group | null>(null);
    const elevationGroupRef = useRef<THREE.Group | null>(null);
    const animationFrameRef = useRef<number>(0);
    const progressRef = useRef<{ value: number }>({ value: 0 });
    const isInitializedRef = useRef(false);

    // Color palette - CAD blueprint style
    const colors = useMemo(() => ({
        // Blueprint colors
        primary: 0xffd700,       // Gold - main lines
        secondary: 0xffffff,     // White - secondary lines
        accent: 0x4a9eff,        // Blue - accent/dimension lines
        detail: 0x888888,        // Gray - detail lines
        background: 0x0a0a12,    // Dark blue-black background
    }), []);

    // Create detailed 2D floor plan (top-down view - XZ plane laid flat)
    const createFloorPlan = useCallback(() => {
        const group = new THREE.Group();
        const lines: BlueprintLine[] = [];

        const addLine = (points: THREE.Vector3[], color: number, phase: number, delay: number = 0, dashed: boolean = false) => {
            const line = createLine(points, color, 1, dashed);
            group.add(line);
            lines.push({ line, phase, delay, isFloorPlan: true });
        };

        const addGroup = (grp: THREE.Group, phase: number, delay: number = 0) => {
            group.add(grp);
            grp.children.forEach((child, idx) => {
                if (child instanceof THREE.Line) {
                    lines.push({ line: child, phase, delay: delay + idx * 0.01, isFloorPlan: true });
                }
            });
        };

        const s = 0.55; // Scale factor

        // ==================== PHASE 1: OUTER WALLS (thick double lines) ====================
        // Main house outline - outer wall
        addLine([
            new THREE.Vector3(-5*s, 0, -4*s), new THREE.Vector3(-5*s, 0, 4.2*s),
            new THREE.Vector3(4.2*s, 0, 4.2*s), new THREE.Vector3(4.2*s, 0, -4*s),
            new THREE.Vector3(-5*s, 0, -4*s)
        ], colors.primary, 1, 0);
        // Inner wall line (wall thickness)
        addLine([
            new THREE.Vector3(-4.8*s, 0, -3.8*s), new THREE.Vector3(-4.8*s, 0, 4*s),
            new THREE.Vector3(4*s, 0, 4*s), new THREE.Vector3(4*s, 0, -3.8*s),
            new THREE.Vector3(-4.8*s, 0, -3.8*s)
        ], colors.primary, 1, 0.05);

        // Car porch outline
        addLine([
            new THREE.Vector3(4.2*s, 0, -3*s), new THREE.Vector3(7*s, 0, -3*s),
            new THREE.Vector3(7*s, 0, 2.2*s), new THREE.Vector3(4.2*s, 0, 2.2*s)
        ], colors.secondary, 1, 0.1);

        // ==================== PHASE 2: INTERIOR WALLS & ROOMS ====================
        // Living room / Drawing room divider
        addLine([new THREE.Vector3(-1*s, 0, 4*s), new THREE.Vector3(-1*s, 0, 1*s)], colors.primary, 2, 0);
        addLine([new THREE.Vector3(-0.8*s, 0, 4*s), new THREE.Vector3(-0.8*s, 0, 1.2*s)], colors.primary, 2, 0.02);

        // Horizontal wall (Kitchen/Dining separator)
        addLine([new THREE.Vector3(-4.8*s, 0, 1*s), new THREE.Vector3(0.5*s, 0, 1*s)], colors.primary, 2, 0.05);
        addLine([new THREE.Vector3(-4.8*s, 0, 1.2*s), new THREE.Vector3(0.3*s, 0, 1.2*s)], colors.primary, 2, 0.07);

        // Bedroom divider
        addLine([new THREE.Vector3(1.5*s, 0, -3.8*s), new THREE.Vector3(1.5*s, 0, 0*s)], colors.primary, 2, 0.1);
        addLine([new THREE.Vector3(1.7*s, 0, -3.8*s), new THREE.Vector3(1.7*s, 0, -0.2*s)], colors.primary, 2, 0.12);

        // Bathroom walls
        addLine([new THREE.Vector3(-4.8*s, 0, -1.5*s), new THREE.Vector3(-2.5*s, 0, -1.5*s)], colors.primary, 2, 0.15);
        addLine([new THREE.Vector3(-2.5*s, 0, -1.5*s), new THREE.Vector3(-2.5*s, 0, -3.8*s)], colors.primary, 2, 0.17);

        // Staircase area
        addLine([new THREE.Vector3(0.5*s, 0, 1*s), new THREE.Vector3(0.5*s, 0, -0.5*s)], colors.accent, 2, 0.2);
        addLine([new THREE.Vector3(0.5*s, 0, -0.5*s), new THREE.Vector3(1.5*s, 0, -0.5*s)], colors.accent, 2, 0.22);

        // ==================== PHASE 3: DOORS WITH SWING ARCS ====================
        // Front door (main entrance)
        addLine([new THREE.Vector3(-0.1*s, 0, 4.2*s), new THREE.Vector3(0.7*s, 0, 4.2*s)], colors.accent, 3, 0);
        const frontDoorArc = createArc(-0.1*s, 4.2*s, 0.8*s, -Math.PI/2, 0, colors.accent, 12);
        frontDoorArc.rotation.x = -Math.PI/2;
        group.add(frontDoorArc);
        lines.push({ line: frontDoorArc, phase: 3, delay: 0.02, isFloorPlan: true });

        // Bedroom door
        addLine([new THREE.Vector3(1.5*s, 0, -1.5*s), new THREE.Vector3(1.5*s, 0, -0.8*s)], colors.accent, 3, 0.05);
        const bedroomDoorArc = createArc(1.5*s, -0.8*s, 0.7*s, Math.PI, Math.PI*1.5, colors.accent, 12);
        bedroomDoorArc.rotation.x = -Math.PI/2;
        group.add(bedroomDoorArc);
        lines.push({ line: bedroomDoorArc, phase: 3, delay: 0.07, isFloorPlan: true });

        // Bathroom door
        addLine([new THREE.Vector3(-3.5*s, 0, -1.5*s), new THREE.Vector3(-2.8*s, 0, -1.5*s)], colors.accent, 3, 0.1);
        const bathDoorArc = createArc(-2.8*s, -1.5*s, 0.7*s, 0, Math.PI/2, colors.accent, 12);
        bathDoorArc.rotation.x = -Math.PI/2;
        group.add(bathDoorArc);
        lines.push({ line: bathDoorArc, phase: 3, delay: 0.12, isFloorPlan: true });

        // Kitchen door
        addLine([new THREE.Vector3(-3*s, 0, 1*s), new THREE.Vector3(-2.3*s, 0, 1*s)], colors.accent, 3, 0.15);

        // ==================== PHASE 4: WINDOWS ====================
        // Front windows (with thickness)
        addLine([new THREE.Vector3(-3.8*s, 0, 4.2*s), new THREE.Vector3(-2.2*s, 0, 4.2*s)], colors.accent, 4, 0);
        addLine([new THREE.Vector3(-3.8*s, 0, 4*s), new THREE.Vector3(-2.2*s, 0, 4*s)], colors.accent, 4, 0.02);
        addLine([new THREE.Vector3(-3.8*s, 0, 4*s), new THREE.Vector3(-3.8*s, 0, 4.2*s)], colors.accent, 4, 0.03);
        addLine([new THREE.Vector3(-2.2*s, 0, 4*s), new THREE.Vector3(-2.2*s, 0, 4.2*s)], colors.accent, 4, 0.04);

        addLine([new THREE.Vector3(2*s, 0, 4.2*s), new THREE.Vector3(3.5*s, 0, 4.2*s)], colors.accent, 4, 0.05);
        addLine([new THREE.Vector3(2*s, 0, 4*s), new THREE.Vector3(3.5*s, 0, 4*s)], colors.accent, 4, 0.06);

        // Side windows
        addLine([new THREE.Vector3(-5*s, 0, 2*s), new THREE.Vector3(-4.8*s, 0, 2*s)], colors.accent, 4, 0.1);
        addLine([new THREE.Vector3(-5*s, 0, 3*s), new THREE.Vector3(-4.8*s, 0, 3*s)], colors.accent, 4, 0.11);
        addLine([new THREE.Vector3(-5*s, 0, 2*s), new THREE.Vector3(-5*s, 0, 3*s)], colors.accent, 4, 0.12);

        // ==================== PHASE 5: FURNITURE & FIXTURES ====================
        // Living room - Sofa
        const sofa = createSofa(-3*s, 2.5*s, 1.2*s, 0.5*s, colors.detail);
        sofa.rotation.x = -Math.PI/2;
        addGroup(sofa, 5, 0);

        // Living room - Center table
        const livingTable = createRect(-3*s, 1.8*s, 0.6*s, 0.4*s, colors.detail);
        livingTable.rotation.x = -Math.PI/2;
        group.add(livingTable);
        lines.push({ line: livingTable, phase: 5, delay: 0.05, isFloorPlan: true });

        // Dining area - Dining table with chairs
        const diningTable = createDiningTable(0*s, 2.5*s, colors.detail);
        diningTable.rotation.x = -Math.PI/2;
        addGroup(diningTable, 5, 0.1);

        // Kitchen - Counter with stove
        const kitchenCounter = createKitchenCounter(-3.5*s, -0.3*s, 1.2*s, 0.5*s, colors.detail);
        kitchenCounter.rotation.x = -Math.PI/2;
        addGroup(kitchenCounter, 5, 0.15);

        // Kitchen - Sink
        const kitchenSink = createSink(-4.3*s, 0.3*s, colors.detail);
        kitchenSink.rotation.x = -Math.PI/2;
        addGroup(kitchenSink, 5, 0.2);

        // Bedroom - Bed
        const bed = createBed(2.8*s, -2*s, 1*s, 1.4*s, colors.detail);
        bed.rotation.x = -Math.PI/2;
        addGroup(bed, 5, 0.25);

        // Bathroom - Toilet
        const toilet = createToilet(-3.5*s, -2.8*s, colors.detail);
        toilet.rotation.x = -Math.PI/2;
        addGroup(toilet, 5, 0.3);

        // Bathroom - Bathtub
        const bathtub = createBathtub(-4*s, -2*s, 0.6*s, 1*s, colors.detail);
        bathtub.rotation.x = -Math.PI/2;
        addGroup(bathtub, 5, 0.35);

        // Staircase
        const stairs = createStairs(1*s, 0.2*s, 0.8*s, 1.2*s, 8, colors.accent);
        stairs.rotation.x = -Math.PI/2;
        addGroup(stairs, 5, 0.4);

        // ==================== PHASE 6: DIMENSIONS & ANNOTATIONS ====================
        // Horizontal dimension line
        addLine([new THREE.Vector3(-5.5*s, 0, 5*s), new THREE.Vector3(7.5*s, 0, 5*s)], colors.detail, 6, 0, true);
        addLine([new THREE.Vector3(-5*s, 0, 4.8*s), new THREE.Vector3(-5*s, 0, 5.2*s)], colors.detail, 6, 0.02);
        addLine([new THREE.Vector3(4.2*s, 0, 4.8*s), new THREE.Vector3(4.2*s, 0, 5.2*s)], colors.detail, 6, 0.03);
        addLine([new THREE.Vector3(7*s, 0, 4.8*s), new THREE.Vector3(7*s, 0, 5.2*s)], colors.detail, 6, 0.04);

        // Vertical dimension line
        addLine([new THREE.Vector3(-5.8*s, 0, -4.5*s), new THREE.Vector3(-5.8*s, 0, 4.5*s)], colors.detail, 6, 0.1, true);
        addLine([new THREE.Vector3(-6*s, 0, -4*s), new THREE.Vector3(-5.6*s, 0, -4*s)], colors.detail, 6, 0.12);
        addLine([new THREE.Vector3(-6*s, 0, 4.2*s), new THREE.Vector3(-5.6*s, 0, 4.2*s)], colors.detail, 6, 0.13);

        // Room dimension markers
        addLine([new THREE.Vector3(-3*s, 0, 3.7*s), new THREE.Vector3(-3*s, 0, 1.3*s)], colors.detail, 6, 0.2, true);
        addLine([new THREE.Vector3(2.5*s, 0, -0.8*s), new THREE.Vector3(2.5*s, 0, -3.5*s)], colors.detail, 6, 0.22, true);

        // North arrow
        addLine([new THREE.Vector3(6*s, 0, -2*s), new THREE.Vector3(6*s, 0, -3.5*s)], colors.accent, 6, 0.3);
        addLine([new THREE.Vector3(5.8*s, 0, -3.2*s), new THREE.Vector3(6*s, 0, -3.5*s), new THREE.Vector3(6.2*s, 0, -3.2*s)], colors.accent, 6, 0.32);

        // Rotate to lay flat (XZ plane for top-down view)
        group.rotation.x = -Math.PI / 2;
        group.position.y = 0;

        return { group, lines };
    }, [colors]);

    // Create detailed 2D elevation view (front view - XY plane) - CENTERED VERTICALLY
    const createElevation = useCallback(() => {
        const group = new THREE.Group();
        const lines: BlueprintLine[] = [];

        const addLine = (line: THREE.Line | THREE.Group, phase: number, delay: number = 0) => {
            group.add(line);
            if (line instanceof THREE.Line) {
                lines.push({ line, phase, delay, isFloorPlan: false });
            } else {
                line.children.forEach((child, idx) => {
                    if (child instanceof THREE.Line) {
                        lines.push({ line: child, phase, delay: delay + idx * 0.01, isFloorPlan: false });
                    }
                });
            }
        };

        const s = 0.5; // Scale for elevation
        const yOffset = -2.5; // Vertical offset to center the elevation

        // ==================== PHASE 1: GROUND & LANDSCAPING ====================
        // Ground line with texture
        addLine(createLine([
            new THREE.Vector3(-7*s, yOffset, 0),
            new THREE.Vector3(8.5*s, yOffset, 0)
        ], colors.primary), 1, 0);

        // Ground texture hatching
        for (let i = 0; i < 15; i++) {
            const gx = -6.5*s + i * 1*s;
            addLine(createLine([
                new THREE.Vector3(gx, yOffset, 0),
                new THREE.Vector3(gx - 0.15, yOffset - 0.2, 0)
            ], colors.detail), 1, 0.02 + i * 0.01);
        }

        // Entrance steps
        addLine(createLine([
            new THREE.Vector3(-1.8*s, yOffset, 0),
            new THREE.Vector3(-1.8*s, yOffset + 0.15, 0),
            new THREE.Vector3(1.8*s, yOffset + 0.15, 0),
            new THREE.Vector3(1.8*s, yOffset, 0)
        ], colors.primary), 1, 0.15);
        addLine(createLine([
            new THREE.Vector3(-1.6*s, yOffset + 0.15, 0),
            new THREE.Vector3(-1.6*s, yOffset + 0.3, 0),
            new THREE.Vector3(1.6*s, yOffset + 0.3, 0),
            new THREE.Vector3(1.6*s, yOffset + 0.15, 0)
        ], colors.primary), 1, 0.17);

        // Planters
        addLine(createRect(-2.5*s, yOffset + 0.2, 0.5*s, 0.4*s, colors.detail), 1, 0.2);
        addLine(createRect(2.5*s, yOffset + 0.2, 0.5*s, 0.4*s, colors.detail), 1, 0.22);

        // ==================== PHASE 2: GROUND FLOOR STRUCTURE ====================
        const groundFloorHeight = 2.8 * s;
        const plinthHeight = 0.3;

        // Plinth with depth lines
        addLine(createLine([
            new THREE.Vector3(-5.2*s, yOffset + plinthHeight, 0),
            new THREE.Vector3(-5.2*s, yOffset, 0),
            new THREE.Vector3(4.2*s, yOffset, 0),
            new THREE.Vector3(4.2*s, yOffset + plinthHeight, 0)
        ], colors.primary), 2, 0);

        // Main walls with double lines (wall thickness)
        addLine(createLine([
            new THREE.Vector3(-5*s, yOffset + plinthHeight, 0),
            new THREE.Vector3(-5*s, yOffset + groundFloorHeight, 0)
        ], colors.primary), 2, 0.05);
        addLine(createLine([
            new THREE.Vector3(-4.85*s, yOffset + plinthHeight, 0),
            new THREE.Vector3(-4.85*s, yOffset + groundFloorHeight - 0.1, 0)
        ], colors.detail), 2, 0.06);

        addLine(createLine([
            new THREE.Vector3(4*s, yOffset + plinthHeight, 0),
            new THREE.Vector3(4*s, yOffset + groundFloorHeight, 0)
        ], colors.primary), 2, 0.08);
        addLine(createLine([
            new THREE.Vector3(3.85*s, yOffset + plinthHeight, 0),
            new THREE.Vector3(3.85*s, yOffset + groundFloorHeight - 0.1, 0)
        ], colors.detail), 2, 0.09);

        // Cornice/band at slab level
        addLine(createLine([
            new THREE.Vector3(-5.1*s, yOffset + groundFloorHeight, 0),
            new THREE.Vector3(4.1*s, yOffset + groundFloorHeight, 0)
        ], colors.primary), 2, 0.1);
        addLine(createLine([
            new THREE.Vector3(-5.1*s, yOffset + groundFloorHeight - 0.08, 0),
            new THREE.Vector3(4.1*s, yOffset + groundFloorHeight - 0.08, 0)
        ], colors.accent), 2, 0.12);

        // Brick/stone texture hatching on walls
        for (let row = 0; row < 8; row++) {
            const hy = yOffset + plinthHeight + 0.25 + row * 0.3;
            if (hy < yOffset + groundFloorHeight - 0.3) {
                addLine(createLine([
                    new THREE.Vector3(-5*s, hy, 0),
                    new THREE.Vector3(-3.8*s, hy, 0)
                ], colors.detail), 2, 0.15 + row * 0.01);
                addLine(createLine([
                    new THREE.Vector3(2.8*s, hy, 0),
                    new THREE.Vector3(4*s, hy, 0)
                ], colors.detail), 2, 0.16 + row * 0.01);
            }
        }

        // Car porch structure
        addLine(createLine([
            new THREE.Vector3(4.2*s, yOffset, 0),
            new THREE.Vector3(7.2*s, yOffset, 0),
            new THREE.Vector3(7.2*s, yOffset + 2.3*s, 0),
            new THREE.Vector3(4.2*s, yOffset + 2.3*s, 0)
        ], colors.secondary), 2, 0.2);

        // Car porch pillars
        addLine(createLine([
            new THREE.Vector3(5.5*s, yOffset, 0),
            new THREE.Vector3(5.5*s, yOffset + 2.3*s, 0)
        ], colors.secondary), 2, 0.22);
        addLine(createLine([
            new THREE.Vector3(5.6*s, yOffset, 0),
            new THREE.Vector3(5.6*s, yOffset + 2.3*s, 0)
        ], colors.detail), 2, 0.23);

        // ==================== PHASE 3: FIRST FLOOR ====================
        const firstFloorHeight = groundFloorHeight + 2.5 * s;

        // First floor walls with setback
        addLine(createLine([
            new THREE.Vector3(-4.5*s, yOffset + groundFloorHeight, 0),
            new THREE.Vector3(-4.5*s, yOffset + firstFloorHeight, 0),
            new THREE.Vector3(3.2*s, yOffset + firstFloorHeight, 0),
            new THREE.Vector3(3.2*s, yOffset + groundFloorHeight, 0)
        ], colors.primary), 3, 0);

        // Wall thickness lines
        addLine(createLine([
            new THREE.Vector3(-4.35*s, yOffset + groundFloorHeight + 0.1, 0),
            new THREE.Vector3(-4.35*s, yOffset + firstFloorHeight - 0.1, 0)
        ], colors.detail), 3, 0.05);
        addLine(createLine([
            new THREE.Vector3(3.05*s, yOffset + groundFloorHeight + 0.1, 0),
            new THREE.Vector3(3.05*s, yOffset + firstFloorHeight - 0.1, 0)
        ], colors.detail), 3, 0.06);

        // First floor cornice
        addLine(createLine([
            new THREE.Vector3(-4.6*s, yOffset + firstFloorHeight, 0),
            new THREE.Vector3(3.3*s, yOffset + firstFloorHeight, 0)
        ], colors.primary), 3, 0.1);
        addLine(createLine([
            new THREE.Vector3(-4.6*s, yOffset + firstFloorHeight - 0.06, 0),
            new THREE.Vector3(3.3*s, yOffset + firstFloorHeight - 0.06, 0)
        ], colors.accent), 3, 0.12);

        // Balcony projection
        addLine(createLine([
            new THREE.Vector3(-2*s, yOffset + groundFloorHeight, 0),
            new THREE.Vector3(-2*s, yOffset + groundFloorHeight + 0.12, 0),
            new THREE.Vector3(2*s, yOffset + groundFloorHeight + 0.12, 0),
            new THREE.Vector3(2*s, yOffset + groundFloorHeight, 0)
        ], colors.primary), 3, 0.15);

        // ==================== PHASE 4: ROOF ====================
        addLine(createRoofElevation(
            -0.65*s, yOffset + firstFloorHeight,
            7.5*s, 1.8*s,
            colors.primary, colors.accent, colors.detail
        ), 4, 0);

        // Car porch flat roof with parapet
        addLine(createLine([
            new THREE.Vector3(4.2*s, yOffset + 2.3*s, 0),
            new THREE.Vector3(4.2*s, yOffset + 2.5*s, 0),
            new THREE.Vector3(7.3*s, yOffset + 2.5*s, 0),
            new THREE.Vector3(7.3*s, yOffset + 2.3*s, 0)
        ], colors.secondary), 4, 0.2);

        // ==================== PHASE 5: WINDOWS & DOORS ====================
        // Ground floor windows with details
        addLine(createWindowElevation(-3.2*s, yOffset + 1.1*s, 1.1*s, 1.3*s, colors.accent, colors.detail), 5, 0);
        addLine(createWindowElevation(2.3*s, yOffset + 1.1*s, 1.1*s, 1.3*s, colors.accent, colors.detail), 5, 0.1);

        // Main entrance door with arch
        addLine(createDoorElevation(0, yOffset + plinthHeight, 1.1*s, 2*s, colors.primary, colors.accent, colors.detail), 5, 0.2);

        // First floor windows
        addLine(createWindowElevation(-2.5*s, yOffset + groundFloorHeight + 0.8*s, 0.9*s, 1.1*s, colors.accent, colors.detail), 5, 0.3);
        addLine(createWindowElevation(1.5*s, yOffset + groundFloorHeight + 0.8*s, 0.9*s, 1.1*s, colors.accent, colors.detail), 5, 0.4);

        // Car porch entrance (garage style)
        addLine(createRect(5.7*s, yOffset + 1*s, 1.8*s, 1.8*s, colors.secondary), 5, 0.5);
        // Garage door panels
        for (let i = 0; i < 4; i++) {
            addLine(createLine([
                new THREE.Vector3(4.9*s + i * 0.45*s, yOffset + 0.2, 0),
                new THREE.Vector3(4.9*s + i * 0.45*s, yOffset + 1.9*s, 0)
            ], colors.detail), 5, 0.52 + i * 0.02);
        }

        // ==================== PHASE 6: DECORATIVE DETAILS ====================
        // Balcony railing with decorative pattern
        addLine(createLine([
            new THREE.Vector3(-1.8*s, yOffset + groundFloorHeight + 0.12, 0),
            new THREE.Vector3(-1.8*s, yOffset + groundFloorHeight + 0.7, 0),
            new THREE.Vector3(1.8*s, yOffset + groundFloorHeight + 0.7, 0),
            new THREE.Vector3(1.8*s, yOffset + groundFloorHeight + 0.12, 0)
        ], colors.accent), 6, 0);

        // Railing verticals with decorative pattern
        for (let i = 0; i <= 8; i++) {
            const rx = -1.8*s + i * 0.45*s;
            addLine(createLine([
                new THREE.Vector3(rx, yOffset + groundFloorHeight + 0.12, 0),
                new THREE.Vector3(rx, yOffset + groundFloorHeight + 0.7, 0)
            ], colors.detail), 6, 0.05 + i * 0.01);
        }
        // Horizontal railing bar
        addLine(createLine([
            new THREE.Vector3(-1.8*s, yOffset + groundFloorHeight + 0.4, 0),
            new THREE.Vector3(1.8*s, yOffset + groundFloorHeight + 0.4, 0)
        ], colors.detail), 6, 0.15);

        // Entrance porch pillars (decorative columns)
        for (const px of [-1.4*s, 1.4*s]) {
            // Column base
            addLine(createRect(px, yOffset + plinthHeight + 0.15, 0.2*s, 0.2, colors.primary), 6, 0.2);
            // Column shaft
            addLine(createLine([
                new THREE.Vector3(px - 0.08*s, yOffset + plinthHeight + 0.25, 0),
                new THREE.Vector3(px - 0.08*s, yOffset + groundFloorHeight - 0.3, 0)
            ], colors.primary), 6, 0.22);
            addLine(createLine([
                new THREE.Vector3(px + 0.08*s, yOffset + plinthHeight + 0.25, 0),
                new THREE.Vector3(px + 0.08*s, yOffset + groundFloorHeight - 0.3, 0)
            ], colors.primary), 6, 0.23);
            // Column capital
            addLine(createRect(px, yOffset + groundFloorHeight - 0.2, 0.25*s, 0.15, colors.accent), 6, 0.25);
        }

        // Porch canopy with decorative brackets
        addLine(createLine([
            new THREE.Vector3(-1.7*s, yOffset + groundFloorHeight - 0.15, 0),
            new THREE.Vector3(1.7*s, yOffset + groundFloorHeight - 0.15, 0)
        ], colors.primary), 6, 0.3);
        addLine(createLine([
            new THREE.Vector3(-1.7*s, yOffset + groundFloorHeight - 0.08, 0),
            new THREE.Vector3(1.7*s, yOffset + groundFloorHeight - 0.08, 0)
        ], colors.accent), 6, 0.32);

        // Decorative moldings between floors
        addLine(createLine([
            new THREE.Vector3(-5*s, yOffset + plinthHeight + 0.05, 0),
            new THREE.Vector3(-3.5*s, yOffset + plinthHeight + 0.05, 0)
        ], colors.detail), 6, 0.35);
        addLine(createLine([
            new THREE.Vector3(2.5*s, yOffset + plinthHeight + 0.05, 0),
            new THREE.Vector3(4*s, yOffset + plinthHeight + 0.05, 0)
        ], colors.detail), 6, 0.36);

        // Name plate with decorative frame
        addLine(createRect(0, yOffset + groundFloorHeight - 0.45, 1.3*s, 0.25, colors.accent), 6, 0.4);
        addLine(createRect(0, yOffset + groundFloorHeight - 0.45, 1.4*s, 0.3, colors.detail), 6, 0.42);

        // Dimension lines with end markers
        addLine(createLine([
            new THREE.Vector3(-5.8*s, yOffset - 0.4, 0),
            new THREE.Vector3(4.5*s, yOffset - 0.4, 0)
        ], colors.detail, 1, true), 6, 0.5);
        addLine(createLine([
            new THREE.Vector3(-5*s, yOffset - 0.5, 0),
            new THREE.Vector3(-5*s, yOffset - 0.3, 0)
        ], colors.detail), 6, 0.52);
        addLine(createLine([
            new THREE.Vector3(4*s, yOffset - 0.5, 0),
            new THREE.Vector3(4*s, yOffset - 0.3, 0)
        ], colors.detail), 6, 0.53);

        // Height dimension line
        addLine(createLine([
            new THREE.Vector3(-5.6*s, yOffset, 0),
            new THREE.Vector3(-5.6*s, yOffset + firstFloorHeight + 1.8*s, 0)
        ], colors.detail, 1, true), 6, 0.55);

        // Elevation is in XY plane (front view) - centered at y=0
        group.position.z = 0;

        return { group, lines };
    }, [colors]);

    // Animation render loop - Floor Plan to Elevation transformation (2D to 2D)
    const animate = useCallback(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        animationFrameRef.current = requestAnimationFrame(animate);

        const progress = progressRef.current.value;
        const lines = blueprintLinesRef.current;

        // ==================== BLUEPRINT LINE ANIMATION ====================
        lines.forEach(({ line, phase, delay, isFloorPlan }) => {
            let phaseStart: number, phaseEnd: number;

            switch (phase) {
                case 1: phaseStart = 0.06 + delay * 0.02; phaseEnd = 0.20; break;
                case 2: phaseStart = 0.18 + delay * 0.02; phaseEnd = 0.34; break;
                case 3: phaseStart = 0.32 + delay * 0.02; phaseEnd = 0.48; break;
                case 4: phaseStart = 0.46 + delay * 0.02; phaseEnd = 0.62; break;
                case 5: phaseStart = 0.60 + delay * 0.02; phaseEnd = 0.76; break;
                case 6: phaseStart = 0.74 + delay * 0.02; phaseEnd = 0.88; break;
                default: phaseStart = 0; phaseEnd = 1;
            }

            const elementProgress = Math.max(0, Math.min(1, (progress - phaseStart) / (phaseEnd - phaseStart)));
            const eased = 1 - Math.pow(1 - elementProgress, 3);

            if (isFloorPlan) {
                // Floor plan lines fade out as we transition (0% - 50%)
                const fadeProgress = Math.min(1, progress / 0.5);
                const fadeEased = 1 - Math.pow(1 - fadeProgress, 2);
                if (line.material instanceof THREE.LineBasicMaterial || line.material instanceof THREE.LineDashedMaterial) {
                    line.material.opacity = Math.max(0, 1 - fadeEased);
                }
            } else {
                // Elevation lines fade in based on their phase
                if (line.material instanceof THREE.LineBasicMaterial || line.material instanceof THREE.LineDashedMaterial) {
                    line.material.opacity = eased;
                }
            }
        });

        // ==================== VIEW TRANSFORMATION ====================
        // Smoothly transition from floor plan to elevation view
        const transitionProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.4));
        const transitionEased = transitionProgress < 0.5
            ? 2 * transitionProgress * transitionProgress
            : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2;

        // Floor plan group fades out and moves down
        if (floorPlanGroupRef.current) {
            floorPlanGroupRef.current.rotation.x = -Math.PI / 2 + transitionEased * Math.PI / 2;
            floorPlanGroupRef.current.position.y = transitionEased * -8;
        }

        // Elevation group is centered at y=0 (viewport center) after transition
        // Starts above and settles to center
        if (elevationGroupRef.current) {
            // Start position: above viewport, End position: centered (y=0)
            elevationGroupRef.current.position.y = 4 * (1 - transitionEased);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || isInitializedRef.current) return;
        isInitializedRef.current = true;

        // Scene setup with dark blueprint background
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(colors.background);
        sceneRef.current = scene;

        // Orthographic camera for 2D blueprint view - centered at y=0
        // Smaller frustum = larger/zoomed in view
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 6; // Reduced from 10 for larger blueprints
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            100
        );
        camera.position.set(0, 0, 20);
        camera.lookAt(0, 0, 0); // Look at center (0,0,0)
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // ==================== FLOOR PLAN (2D - Top View) ====================
        const { group: floorPlanGroup, lines: floorPlanLines } = createFloorPlan();
        floorPlanGroupRef.current = floorPlanGroup;
        floorPlanGroup.position.set(0, 0, -5);
        scene.add(floorPlanGroup);

        // ==================== ELEVATION (2D - Front View) ====================
        const { group: elevationGroup, lines: elevationLines } = createElevation();
        elevationGroupRef.current = elevationGroup;
        elevationGroup.position.set(0, 4, 0); // Start above, will animate to center
        scene.add(elevationGroup);

        // Combine all lines for animation
        blueprintLinesRef.current = [...floorPlanLines, ...elevationLines];

        // Set initial opacity for elevation lines (invisible)
        elevationLines.forEach(({ line }) => {
            if (line.material instanceof THREE.LineBasicMaterial || line.material instanceof THREE.LineDashedMaterial) {
                line.material.opacity = 0;
            }
        });

        // Blueprint grid (subtle background grid for CAD effect) - centered at y=0
        const gridSize = 20;
        const gridDivisions = 40;
        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x1a1a2a,
            transparent: true,
            opacity: 0.4
        });

        for (let i = -gridSize/2; i <= gridSize/2; i += gridSize/gridDivisions) {
            const hPoints = [
                new THREE.Vector3(-gridSize/2, i, -1),
                new THREE.Vector3(gridSize/2, i, -1)
            ];
            const vPoints = [
                new THREE.Vector3(i, -gridSize/2, -1),
                new THREE.Vector3(i, gridSize/2, -1)
            ];
            scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hPoints), gridMaterial));
            scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vPoints), gridMaterial));
        }

        // Start animation loop
        animate();

        // Handle resize for orthographic camera - keep centered
        // Smaller frustum values = larger/zoomed in blueprints
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspect = width / height;
            // Desktop: 6, Tablet: 7, Mobile: 8 (smaller = more zoomed in)
            const frustumSize = width < 480 ? 8 : width < 768 ? 7 : 6;

            cameraRef.current.left = frustumSize * aspect / -2;
            cameraRef.current.right = frustumSize * aspect / 2;
            cameraRef.current.top = frustumSize / 2;
            cameraRef.current.bottom = frustumSize / -2;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
            renderer.dispose();
        };
    }, [colors, createFloorPlan, createElevation, animate]);


    // Setup GSAP ScrollTrigger for text animations and scroll-based progress
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Create a timeline for coordinated animations
            // Extended scroll for 6 text sections + final reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=700%",
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        progressRef.current.value = self.progress;
                    },
                },
            });

            // Hero fade out (0% - 8%)
            tl.fromTo(".hero-overlay",
                { opacity: 1 },
                { opacity: 0, duration: 0.08, ease: "power2.inOut" },
                0
            );

            // Text 1 - Structural Safety (8% - 20%) - Foundation phase
            tl.fromTo(".text-1",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.08
            );
            tl.to(".text-1",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.18
            );

            // Text 2 - Cost Optimization (22% - 34%) - Ground floor walls
            tl.fromTo(".text-2",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.22
            );
            tl.to(".text-2",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.32
            );

            // Text 3 - Regulatory Compliance (36% - 48%) - First floor
            tl.fromTo(".text-3",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.36
            );
            tl.to(".text-3",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.46
            );

            // Text 4 - Timely Delivery (50% - 62%) - Roof
            tl.fromTo(".text-4",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.50
            );
            tl.to(".text-4",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.60
            );

            // Text 5 - Quality Assurance (64% - 76%) - Windows & Doors
            tl.fromTo(".text-5",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.64
            );
            tl.to(".text-5",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.74
            );

            // Text 6 - Sustainable Design (78% - 88%) - Final details
            tl.fromTo(".text-6",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
                0.78
            );
            tl.to(".text-6",
                { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" },
                0.86
            );

            // Canvas fade out and Text 7 (Final CTA) reveal (88% - 100%)
            tl.to(canvasRef.current,
                { opacity: 0, duration: 0.08, ease: "power2.inOut" },
                0.88
            );
            tl.fromTo(".text-7",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.10, ease: "power2.out" },
                0.90
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden font-sans"
        >
            {/* Three.js Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-10"
            />

            {/* --- HERO OVERLAY (Fades out on scroll) --- */}
            <div className="hero-overlay absolute inset-0 z-50 flex flex-col items-center justify-center bg-black pointer-events-none">
                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter text-center px-4">
                    Letsbuild <span className="text-[var(--color-gold)]">wiser</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl text-center px-6">
                    Civil Engineering Consultation & Construction
                </p>
                <div className="absolute bottom-8 sm:bottom-10 animate-bounce text-gray-500">
                    <span className="text-xs sm:text-sm">Scroll to build</span>
                    <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-500 rounded-full mx-auto mt-2 flex justify-center pt-2">
                        <div className="w-1 h-1.5 sm:h-2 bg-gray-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* --- SCROLLYTELLING TEXT OVERLAYS --- */}
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
                <div className="w-full max-w-7xl px-4 sm:px-6 md:px-12 relative h-full flex items-center">

                    {/* Text 1 - Structural Safety */}
                    <div className="text-1 absolute inset-0 opacity-0 flex items-center justify-center md:justify-start">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-left md:ml-8 lg:ml-16 bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Structural<br /> Safety
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 mx-auto md:mx-0 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                We prioritize your safety above all. Rigorous calculations and stress testing ensure a home that stands strong for generations.
                            </p>
                        </div>
                    </div>

                    {/* Text 2 - Cost Optimization */}
                    <div className="text-2 absolute inset-0 opacity-0 flex items-center justify-center md:justify-end">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-right md:mr-8 lg:mr-16 flex flex-col items-center md:items-end bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Cost<br /> Optimization
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Smart engineering saves money. We optimize material usage and construction methods to deliver premium quality within budget.
                            </p>
                        </div>
                    </div>

                    {/* Text 3 - Regulatory Compliance */}
                    <div className="text-3 absolute inset-0 opacity-0 flex items-center justify-center md:justify-start">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-left md:ml-8 lg:ml-16 bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Regulatory<br /> Compliance
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 mx-auto md:mx-0 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Navigate approvals with ease. Our designs adhere strictly to all local building codes and zoning regulations.
                            </p>
                        </div>
                    </div>

                    {/* Text 4 - Timely Delivery */}
                    <div className="text-4 absolute inset-0 opacity-0 flex items-center justify-center md:justify-end">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-right md:mr-8 lg:mr-16 flex flex-col items-center md:items-end bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Timely<br /> Delivery
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Efficient project management means no delays. We respect your time and ensure your dream home is ready when promised.
                            </p>
                        </div>
                    </div>

                    {/* Text 5 - Quality Assurance */}
                    <div className="text-5 absolute inset-0 opacity-0 flex items-center justify-center md:justify-start">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-left md:ml-8 lg:ml-16 bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Quality<br /> Assurance
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 mx-auto md:mx-0 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Every detail matters. Our rigorous site supervision and quality control protocols ensure flawless execution from foundation to finishing.
                            </p>
                        </div>
                    </div>

                    {/* Text 6 - Sustainable Design */}
                    <div className="text-6 absolute inset-0 opacity-0 flex items-center justify-center md:justify-end">
                        <div className="max-w-[85vw] sm:max-w-md md:max-w-xl text-center md:text-right md:mr-8 lg:mr-16 flex flex-col items-center md:items-end bg-black/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Sustainable<br /> Design
                            </h2>
                            <div className="w-10 sm:w-12 md:w-20 h-1 md:h-1.5 bg-[var(--color-gold)] mb-3 sm:mb-4 md:mb-6 shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Building for tomorrow. We integrate energy-efficient solutions and eco-friendly materials for a home that respects the environment.
                            </p>
                        </div>
                    </div>

                    {/* Text 7 - Final CTA */}
                    <div className="text-7 absolute inset-0 opacity-0 flex flex-col items-center justify-center scale-95">
                        <div className="bg-black/60 backdrop-blur-md p-8 sm:p-12 md:p-16 rounded-3xl border border-[var(--color-gold)]/30 shadow-[0_0_60px_rgba(255,215,0,0.2)]">
                            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-tighter text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                                Letsbuild <span className="text-[var(--color-gold)] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">wiser</span>
                            </h2>
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-2xl text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                Civil Engineering Consultation & Construction
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}