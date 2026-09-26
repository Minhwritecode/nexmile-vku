import React, { useEffect, useRef, useState } from 'react';
import { 
  Bus, 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  GraduationCap, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Database,
  Route as RouteIcon,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthMode } from '../types/auth';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { login, register, forgotPassword, resetPassword, serverConnected } = useAuth();

  // Mode states: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('IT');
  const [homeArea, setHomeArea] = useState('');
  const [preferredRouteId, setPreferredRouteId] = useState<'route_6' | 'route_13' | 'both'>('route_13');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  // --- THREE.JS BACKGROUND SCENE (Synchronized with Splash Design) ---
  useEffect(() => {
    let cancelled = false;
    let cleanupScene: (() => void) | undefined;

    const initializeScene = async () => {
      // Load the WebGL engine after the form is available. This prevents the
      // 550KB Three.js chunk from delaying the first usable login screen.
      const THREE = await import('three');
      if (cancelled || !containerRef.current) return;
      const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.032); // Deep slate atmosphere

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.2, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 2.8);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3.5, 22);
    cyanPoint.position.set(-5, 4, 3);
    scene.add(cyanPoint);

    const amberPoint = new THREE.PointLight(0xf59e0b, 2.2, 18);
    amberPoint.position.set(4, 2, -5);
    scene.add(amberPoint);

    // --- 1. UNDULATING DIGITAL TERRAIN GRID (SMART CITY ROADBED) ---
    const gridGeometry = new THREE.PlaneGeometry(42, 65, 45, 45);
    gridGeometry.rotateX(-Math.PI / 2);

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.position.y = -0.6;
    scene.add(gridMesh);

    const originalPositions = gridGeometry.attributes.position.clone();

    // --- 2. TRANSIT HIGHWAY CORRIDOR (EXPRESS ROUTE TO VKU) ---
    const curvePoints = [
      new THREE.Vector3(0, 0, -30),
      new THREE.Vector3(-2.4, 0.25, -19),
      new THREE.Vector3(2.6, 0.45, -8),
      new THREE.Vector3(-1.3, 0.15, 3),
      new THREE.Vector3(0.5, 0.05, 16),
    ];
    const transitCurve = new THREE.CatmullRomCurve3(curvePoints);

    // Glowing Emerald Transit Road
    const tubeGeo = new THREE.TubeGeometry(transitCurve, 100, 0.24, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.3,
      roughness: 0.2,
      metalness: 0.8,
    });
    const roadTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(roadTube);

    // Neon Cyan Rails
    const railMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    const leftCurve = new THREE.CatmullRomCurve3(
      curvePoints.map((p) => new THREE.Vector3(p.x - 1.25, p.y + 0.1, p.z))
    );
    const rightCurve = new THREE.CatmullRomCurve3(
      curvePoints.map((p) => new THREE.Vector3(p.x + 1.25, p.y + 0.1, p.z))
    );

    const leftRail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(leftCurve.getPoints(80)),
      railMat
    );
    const rightRail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(rightCurve.getPoints(80)),
      railMat
    );
    scene.add(leftRail);
    scene.add(rightRail);

    // --- 3. 3D CYBER BUS ---
    const busGroup = new THREE.Group();

    // Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      emissive: 0x064e3b,
      roughness: 0.3,
      metalness: 0.7,
    });
    const busBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2.4), bodyMat);
    busBody.position.y = 0.55;
    busGroup.add(busBody);

    // Cyan Windshield Glass
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.85,
    });
    const busGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 1.2), glassMat);
    busGlass.position.set(0, 0.75, 0.4);
    busGroup.add(busGlass);

    // Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const hlLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), hlMat);
    hlLeft.position.set(-0.45, 0.45, 1.22);
    const hlRight = hlLeft.clone();
    hlRight.position.x = 0.45;
    busGroup.add(hlLeft);
    busGroup.add(hlRight);

    // Underglow
    const ugMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 2.8).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 })
    );
    ugMesh.position.y = 0.08;
    busGroup.add(ugMesh);

    scene.add(busGroup);

    // --- 4. HOLOGRAPHIC STATION BEACONS ---
    const beaconsGroup = new THREE.Group();
    const stationData = [
      { t: 0.15, color: 0x38bdf8 },
      { t: 0.52, color: 0xf59e0b },
      { t: 0.88, color: 0x10b981 },
    ];

    stationData.forEach((st) => {
      const pos = transitCurve.getPointAt(st.t);

      // Light beam
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.08, 4.5, 16),
        new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.45 })
      );
      beam.position.set(pos.x, pos.y + 2.25, pos.z);
      beaconsGroup.add(beam);

      // Rotating Ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.48, 0.7, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
      );
      ring.position.set(pos.x, pos.y + 0.06, pos.z);
      beaconsGroup.add(ring);

      // Top glowing sphere
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: st.color })
      );
      sphere.position.set(pos.x, pos.y + 4.5, pos.z);
      beaconsGroup.add(sphere);
    });
    scene.add(beaconsGroup);

    // --- 5. FLOATING DATA PACKETS (PARTICLES) ---
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cEmerald = new THREE.Color(0x10b981);
    const cCyan = new THREE.Color(0x38bdf8);
    const cAmber = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 36;
      particlePositions[i3 + 1] = Math.random() * 12;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 55;

      const rnd = Math.random();
      const col = rnd < 0.5 ? cEmerald : rnd < 0.85 ? cCyan : cAmber;
      particleColors[i3] = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlePoints = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particlePoints);

    // --- MOUSE PARALLAX ---
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
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      camera.position.x = mouseX * 2.0;
      camera.position.y = 3.2 + mouseY * 1.0;
      camera.lookAt(0, 0.6, -2);

      // Undulating wireframe wave
      const posAttr = gridGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = originalPositions.getX(i);
        const z = originalPositions.getZ(i);
        const wave =
          Math.sin(x * 0.35 + elapsedTime * 1.4) * 0.38 +
          Math.cos(z * 0.25 + elapsedTime * 1.1) * 0.38;
        posAttr.setY(i, wave);
      }
      posAttr.needsUpdate = true;

      // Bus along Highway
      const busSpeed = 0.065;
      const busProgress = (elapsedTime * busSpeed) % 1;
      const busPos = transitCurve.getPointAt(busProgress);
      const nextPos = transitCurve.getPointAt(Math.min(0.999, busProgress + 0.01));

      busGroup.position.copy(busPos);
      busGroup.lookAt(nextPos);
      busGroup.position.y += Math.sin(elapsedTime * 12) * 0.03;

      // Beacons rotate
      beaconsGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          child.rotation.z += 0.015 * (index % 2 === 0 ? 1 : -1);
        }
      });

      // Drift particles forward
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += 0.07;
        if (positions[i3 + 2] > 20) {
          positions[i3 + 2] = -35;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    cleanupScene = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    };

    void initializeScene();
    return () => {
      cancelled = true;
      cleanupScene?.();
    };
  }, []);

  // Clear messages on mode switch
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setIsSuccessTransition(true);
      setTimeout(() => {
        onAuthenticated();
      }, 900);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName || !email || !password) {
      setErrorMessage('Vui lòng điền Họ tên, Email và Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName,
      email,
      password,
      studentId: studentId.trim() || undefined,
      faculty,
      homeArea: homeArea.trim() || undefined,
      preferredRouteId,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setIsSuccessTransition(true);
      setTimeout(() => {
        onAuthenticated();
      }, 900);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Vui lòng nhập địa chỉ email đã đăng ký.');
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      // Switch to reset mode to enter new password
      setTimeout(() => {
        setMode('reset');
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword({
      email,
      newPassword,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }, 1200);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex items-center justify-center">
      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Cybernetic Grid Scanline & Radial Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/70 pointer-events-none z-10" />

      {/* Top Floating Brand & Network Node Pill */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bus className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-white">NexMile.AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                VKU BUS 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">Trợ lý Lộ trình Xe buýt Sinh viên Thông minh</p>
          </div>
        </div>

        {/* MongoDB Atlas Database Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs">
          <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono text-[11px]">
            {serverConnected ? 'MongoDB Atlas: Connected' : 'MongoDB: Cluster0.0yx8pww'}
          </span>
          <span className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'}`} />
        </div>
      </header>

      {/* Center Auth Card with Glassmorphic Aesthetic */}
      <div 
        className={`relative z-20 w-full max-w-md mx-4 transition-all duration-700 transform ${
          isSuccessTransition ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 text-white overflow-hidden">
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

          {/* Card Header & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CỔNG XÁC THỰC SINH VIÊN</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'login' && 'Chào mừng trở lại!'}
              {mode === 'register' && 'Tạo tài khoản NexMile'}
              {mode === 'forgot' && 'Khôi phục Mật khẩu'}
              {mode === 'reset' && 'Đặt lại Mật khẩu Mới'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' && 'Đăng nhập để đồng bộ lộ trình thông minh & AI dự báo'}
              {mode === 'register' && 'Đồng hành cùng hệ thống xe buýt số thông minh VKU'}
              {mode === 'forgot' && 'Nhập email sinh viên để xác thực khôi phục tài khoản'}
              {mode === 'reset' && 'Nhập mật khẩu an toàn mới cho tài khoản của bạn'}
            </p>
          </div>

          {/* Navigation Mode Tabs */}
          {(mode === 'login' || mode === 'register') && (
            <div className="flex rounded-xl bg-slate-950/70 p-1 mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Đăng ký mới
              </button>
            </div>
          )}

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Toast */}
          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* --- 1. LOGIN FORM --- */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email sinh viên / VKU
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@vku.udn.vn"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">Ghi nhớ đăng nhập</span>
                </label>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Bảo mật JWT 256-bit
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực với MongoDB...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* --- 2. REGISTER FORM --- */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Họ và tên đầy đủ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email sinh viên VKU *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyenvana@vku.udn.vn"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mã sinh viên (MSSV)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    placeholder="23IT001"
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Khoa / Viện
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 transition cursor-pointer"
                  >
                    <option value="IT">Khoa CNTT</option>
                    <option value="AI">Viện AI & KHMT</option>
                    <option value="SE">Khoa KTPM</option>
                    <option value="DM">Khoa Kỹ thuật số</option>
                    <option value="IS">Khoa HTTT</option>
                    <option value="KT">Khoa Kinh tế số</option>
                    <option value="OTHER">Khoa khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Khu vực đón xe
                  </label>
                  <input
                    type="text"
                    value={homeArea}
                    onChange={(e) => setHomeArea(e.target.value)}
                    placeholder="Hải Châu / Cẩm Lệ..."
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tuyến xe ưu tiên
                  </label>
                  <select
                    value={preferredRouteId}
                    onChange={(e) => setPreferredRouteId(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 transition cursor-pointer"
                  >
                    <option value="route_13">Tuyến 13 (Qua cổng VKU)</option>
                    <option value="route_6">Tuyến 06 (Hải Châu - VKU)</option>
                    <option value="both">Cả hai tuyến</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mật khẩu (tối thiểu 6 ký tự) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Xác nhận lại mật khẩu *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tạo tài khoản trên MongoDB...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký tài khoản</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* --- 3. FORGOT PASSWORD FORM --- */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email đã đăng ký
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@vku.udn.vn"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 Hệ thống sẽ đối soát email trong cơ sở dữ liệu MongoDB Atlas để cấp quyền đặt lại mật khẩu trực tuyến cho bạn.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.99] transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra MongoDB...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Xác minh tài khoản</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang Đăng nhập</span>
              </button>
            </form>
          )}

          {/* --- 4. RESET PASSWORD FORM --- */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Email xác thực: {email}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Xác nhận lại mật khẩu mới
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.99] transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang cập nhật mật khẩu...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Lưu mật khẩu mới & Đăng nhập</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Hủy và quay lại Đăng nhập</span>
              </button>
            </form>
          )}

          {/* Guest Quick Access option */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onAuthenticated}
              className="text-[11px] text-slate-400 hover:text-emerald-400 transition duration-150 inline-flex items-center gap-1 hover:underline"
            >
              <span>Tiếp tục trải nghiệm ở chế độ Khách (Guest)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-slate-500 z-20 pointer-events-none">
        <span className="font-mono">© 2026 VKU Smart Mobility Lab</span>
        <span className="hidden sm:inline">Trợ lý AI đa tác nhân & Điều phối giao thông thông minh</span>
      </footer>
    </div>
  );
};
