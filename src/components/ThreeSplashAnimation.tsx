import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Bus, Sparkles, ArrowRight, ShieldCheck, Radio, Zap } from 'lucide-react';

interface ThreeSplashAnimationProps {
  onComplete: () => void;
}

export const ThreeSplashAnimation: React.FC<ThreeSplashAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Khởi tạo lõi AI đa tầng...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.035); // Deep slate dark atmospheric fog

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 2.5);
    dirLight.position.set(5, 12, 7);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanPoint.position.set(-4, 3, 2);
    scene.add(cyanPoint);

    // --- 1. UNDULATING DIGITAL TERRAIN GRID (SMART CITY ROADBED) ---
    const gridWidth = 40;
    const gridDepth = 60;
    const gridSegments = 45;
    const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegments, gridSegments);
    gridGeometry.rotateX(-Math.PI / 2);

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.position.y = -0.5;
    scene.add(gridMesh);

    // Store original Y coordinates for sine wave animation
    const originalPositions = gridGeometry.attributes.position.clone();

    // --- 2. TRANSIT HIGHWAY CORRIDOR (EXPRESS ROUTE TO VKU) ---
    const curvePoints = [
      new THREE.Vector3(0, 0, -28),
      new THREE.Vector3(-2.2, 0.2, -18),
      new THREE.Vector3(2.5, 0.4, -8),
      new THREE.Vector3(-1.2, 0.1, 2),
      new THREE.Vector3(0, 0, 15),
    ];
    const transitCurve = new THREE.CatmullRomCurve3(curvePoints);

    // Glowing Road Ribbon
    const tubeGeo = new THREE.TubeGeometry(transitCurve, 100, 0.22, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8,
    });
    const roadTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(roadTube);

    // Parallel Neon Laser Guardrails
    const railMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });

    const leftRailPoints = curvePoints.map((p) => new THREE.Vector3(p.x - 1.2, p.y + 0.1, p.z));
    const leftCurve = new THREE.CatmullRomCurve3(leftRailPoints);
    const leftRailGeo = new THREE.BufferGeometry().setFromPoints(leftCurve.getPoints(80));
    const leftRail = new THREE.Line(leftRailGeo, railMat);
    scene.add(leftRail);

    const rightRailPoints = curvePoints.map((p) => new THREE.Vector3(p.x + 1.2, p.y + 0.1, p.z));
    const rightCurve = new THREE.CatmullRomCurve3(rightRailPoints);
    const rightRailGeo = new THREE.BufferGeometry().setFromPoints(rightCurve.getPoints(80));
    const rightRail = new THREE.Line(rightRailGeo, railMat);
    scene.add(rightRail);

    // --- 3. STYLIZED 3D CYBER BUS (NEXMILE ROUTE 13 BEACON) ---
    const busGroup = new THREE.Group();

    // Bus Chassis Main Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 2.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      emissive: 0x064e3b,
      roughness: 0.3,
      metalness: 0.7,
    });
    const busBody = new THREE.Mesh(bodyGeo, bodyMat);
    busBody.position.y = 0.55;
    busGroup.add(busBody);

    // Bus Cockpit Glass Windshield (Glowing Cyan Tint)
    const glassGeo = new THREE.BoxGeometry(1.1, 0.4, 1.2);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
    });
    const busGlass = new THREE.Mesh(glassGeo, glassMat);
    busGlass.position.set(0, 0.75, 0.4);
    busGroup.add(busGlass);

    // Dual Glowing Headlight Beams
    const headlightGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    leftHeadlight.position.set(-0.45, 0.45, 1.22);
    busGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    rightHeadlight.position.set(0.45, 0.45, 1.22);
    busGroup.add(rightHeadlight);

    // Headlight Spotlights illuminating forward road
    const busSpot = new THREE.SpotLight(0x38bdf8, 5, 15, Math.PI / 6, 0.5, 1);
    busSpot.position.set(0, 0.6, 1.2);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 6);
    busGroup.add(busSpot);
    busGroup.add(spotTarget);
    busSpot.target = spotTarget;

    // Glowing Neon Underglow Plane
    const underglowGeo = new THREE.PlaneGeometry(1.6, 2.8);
    underglowGeo.rotateX(-Math.PI / 2);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });
    const underglowMesh = new THREE.Mesh(underglowGeo, underglowMat);
    underglowMesh.position.y = 0.08;
    busGroup.add(underglowMesh);

    scene.add(busGroup);

    // --- 4. HOLOGRAPHIC STATION IOT BEACONS (STOPS ALONG ROUTE) ---
    const beaconsGroup = new THREE.Group();
    const stationStopsData = [
      { t: 0.15, label: 'SN-13-01: BV Ung Bướu', color: 0x38bdf8 },
      { t: 0.5, label: 'SN-13-05: Cầu Trần Thị Lý', color: 0xf59e0b },
      { t: 0.88, label: 'SN-13-10: Cổng Trường ĐH VKU', color: 0x10b981 },
    ];

    stationStopsData.forEach((st) => {
      const pos = transitCurve.getPointAt(st.t);

      // Vertical holographic light beam
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.08, 4.5, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: st.color,
        transparent: true,
        opacity: 0.45,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(pos.x, pos.y + 2.25, pos.z);
      beaconsGroup.add(beamMesh);

      // Rotating radar ring on ground
      const ringGeo = new THREE.RingGeometry(0.5, 0.7, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: st.color,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(pos.x, pos.y + 0.05, pos.z);
      beaconsGroup.add(ringMesh);

      // Top glowing sphere
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: st.color });
      const beaconSphere = new THREE.Mesh(sphereGeo, sphereMat);
      beaconSphere.position.set(pos.x, pos.y + 4.5, pos.z);
      beaconsGroup.add(beaconSphere);
    });

    scene.add(beaconsGroup);

    // --- 5. FLOATING AI DATA PACKETS (PARTICLE FIELD) ---
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x10b981); // Emerald
    const c2 = new THREE.Color(0x38bdf8); // Cyan
    const c3 = new THREE.Color(0xf59e0b); // Amber

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 35;
      particlePositions[i3 + 1] = Math.random() * 12;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 55;

      const mixed = Math.random();
      const chosenColor = mixed < 0.45 ? c1 : mixed < 0.85 ? c2 : c3;
      particleColors[i3] = chosenColor.r;
      particleColors[i3 + 1] = chosenColor.g;
      particleColors[i3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // --- MOUSE & GYRO INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse camera interpolation (Parallax depth)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      camera.position.x = mouseX * 2.2;
      camera.position.y = 3.5 + mouseY * 1.2;
      camera.lookAt(0, 0.8, -2);

      // Undulating wireframe terrain wave
      const posAttr = gridGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = originalPositions.getX(i);
        const z = originalPositions.getZ(i);
        const wave =
          Math.sin(x * 0.35 + elapsedTime * 1.5) * 0.4 +
          Math.cos(z * 0.25 + elapsedTime * 1.2) * 0.4;
        posAttr.setY(i, wave);
      }
      posAttr.needsUpdate = true;

      // Animate Bus along Transit Highway
      const busSpeed = 0.08;
      const busProgress = (elapsedTime * busSpeed) % 1;
      const busPos = transitCurve.getPointAt(busProgress);
      const nextPos = transitCurve.getPointAt(Math.min(0.999, busProgress + 0.01));

      busGroup.position.copy(busPos);
      busGroup.lookAt(nextPos);

      // Subtle bus suspension rumble
      busGroup.position.y += Math.sin(elapsedTime * 12) * 0.03;

      // Rotate station rings
      beaconsGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          child.rotation.z += 0.015 * (index % 2 === 0 ? 1 : -1);
        }
      });

      // Drift particle data packets
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += 0.08; // Move forward toward user
        if (positions[i3 + 2] > 20) {
          positions[i3 + 2] = -35;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- PROGRESS LOGIC TIMELINE ---
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = Math.min(100, prev + 2.5);

        if (next < 25) {
          setStatusMessage('Khởi tạo Lõi Dự Báo AI Đa Tầng...');
        } else if (next < 50) {
          setStatusMessage('Kết nối Cảm biến IoT Trạm dừng Tuyến 13 & Tuyến 06...');
        } else if (next < 75) {
          setStatusMessage('Đồng bộ Vệ tinh GPS & Vi khí hậu khuôn viên VKU...');
        } else if (next < 95) {
          setStatusMessage('Hiệu chuẩn Mô hình ETA & Khuyến nghị giờ xuất phát...');
        } else {
          setStatusMessage('Sẵn sàng! Chào mừng sinh viên đến với NexMile VKU.');
        }

        return next;
      });
    }, 55);

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(progressInterval);

      gridGeometry.dispose();
      gridMaterial.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      leftRailGeo.dispose();
      rightRailGeo.dispose();
      railMat.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle Complete Transition
  const handleEnterApp = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // Auto transition when progress reaches 100% after small pause
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        handleEnterApp();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 text-white select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Brand Bar Overlay */}
      <div className="relative z-10 p-6 md:p-8 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bus className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
                NexMile<span className="text-emerald-400">.AI</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                VKU BUS 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Hệ thống Trợ lý AI Đón Xe Buýt Thông Minh Cho Sinh Viên
            </p>
          </div>
        </div>

        {/* Skip button for quick evaluation */}
        <button
          onClick={handleEnterApp}
          className="px-4 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 shadow-lg group"
        >
          <span>Vào ứng dụng</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center 3D Interactive Hint (Disappears quickly) */}
      <div className="relative z-10 text-center pointer-events-none px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-md text-[11px] text-slate-300 shadow-xl animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mô hình 3D Digital Twin Tuyến 13 & Tuyến 06 hướng về Đại học VKU</span>
        </div>
      </div>

      {/* Bottom HUD Loading Card & Telemetry Calibration */}
      <div className="relative z-10 p-6 md:p-8 max-w-xl mx-auto w-full pointer-events-auto">
        <div className="bg-slate-900/85 border border-slate-700/80 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-4">
          {/* Header of card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Radio className="w-4 h-4 animate-ping" />
              <span className="uppercase tracking-wider">Đang khởi tạo thuật toán AI</span>
            </div>
            <span className="font-mono text-sm font-black text-cyan-300">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-150 shadow-md shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <span className="truncate pr-2 font-medium">{statusMessage}</span>
            <span className="text-[10px] text-slate-400 shrink-0 font-mono">VKU IoT v2.4</span>
          </div>

          {/* 3 Core Pillars Micro Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1.5 rounded-xl border border-slate-700/40">
              <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">So sánh xe máy</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1.5 rounded-xl border border-slate-700/40">
              <Bus className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">Độ tin cậy T6/T13</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1.5 rounded-xl border border-slate-700/40">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Đề xuất tức thì</span>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-[10px] text-slate-300 mt-3 font-mono">
          © 2026 NexMile AI • Đề tài Ứng dụng Di chuyển Thông minh cho Sinh viên VKU Đà Nẵng
        </p>
      </div>
    </div>
  );
};
