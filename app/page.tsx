"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Wifi, Activity, Battery, Zap, AlertTriangle, Radar } from 'lucide-react';

// === DICCIONARIO DE ENTROPÍA (Palabras que la "entidad" puede formar) ===
const WORD_BANK = [
  "AYUDA", "MIRA", "DETRAS", "FRIO", "AQUI", "SANGRE", "666", 
  "LUZ", "SOMBRA", "ELLOS", "NO", "SI", "CORRE", "ABAJO", 
  "DOLOR", "SOLO", "MADRE", "FUEGO", "ETERNO", "VACIO"
];

export default function AetherOS() {
  const [started, setStarted] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [entropy, setEntropy] = useState(0);
  const [magneticHeading, setMagneticHeading] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [detectedWord, setDetectedWord] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // === 1. EL RITUAL DE INICIO (Igual que antes) ===
  const initializeSystem = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') setPermissionGranted(true);
      } else {
        setPermissionGranted(true);
      }

      setStarted(true);
      addLog("SISTEMA AETHER_OS INICIADO");
      addLog("SENSORES CUÁNTICOS ACTIVOS");

    } catch (err) {
      alert("Error: Se requieren permisos para el ritual.");
    }
  };

  // === 2. BUCLE PRINCIPAL (Lógica igual que antes) ===
  useEffect(() => {
    if (!started) return;
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha) setMagneticHeading(event.alpha);
    };
    window.addEventListener('deviceorientation', handleOrientation);
    const interval = setInterval(() => analyzeEnvironment(), 100);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearInterval(interval);
    };
  }, [started]);

  const analyzeEnvironment = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    // SOLUCIÓN AL ERROR DE TYPESCRIPT AQUÍ CON 'as any'
    analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
    const avgVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
    const chaosFactor = Math.random() * 15; 
    const totalEntropy = avgVolume + chaosFactor;
    setEntropy(totalEntropy);

    if (totalEntropy > 60) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }

    const triggerThreshold = 90; 
    if (totalEntropy > triggerThreshold && Math.random() > 0.97) {
      triggerParanormalEvent();
    }
  };

  const triggerParanormalEvent = () => {
    const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    setDetectedWord(word);
    addLog(`>> !ADVERTENCIA! ENTIDAD: ${word}`);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
    setTimeout(() => setDetectedWord(null), 4000);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`> [${time}] ${msg}`, ...prev.slice(0, 6)]);
  };

  // ============================================
  // AQUÍ EMPIEZA LA NUEVA INTERFAZ VISUAL
  // ============================================

  if (!started) {
    return (
      // Pantalla de inicio más tecnológica
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="crt-overlay absolute inset-0 z-20 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
        
        <Radar className="w-24 h-24 text-green-500 animate-spin-slow mb-4 opacity-50" />
        <h1 className="text-5xl mb-2 tracking-[0.3em] font-bold text-green-500 neon-text-glow">AETHER</h1>
        <h2 className="text-xl mb-8 tracking-widest text-green-400 opacity-70">PROTOCOLOS DE ENTROPÍA v1.0</h2>
        
        <button 
          onClick={initializeSystem}
          className="relative group px-8 py-4 bg-black border-2 border-green-500 text-green-500 uppercase tracking-[0.2em] text-lg font-bold overflow-hidden hover:text-black hover:bg-green-500 transition-all duration-300 neon-glow"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Iniciar Enlace
          </span>
          <div className="absolute inset-0 h-full w-0 bg-green-500 transition-all duration-300 group-hover:w-full z-0"></div>
        </button>
        <p className="text-[10px] mt-8 text-center text-green-700 max-w-md font-mono">
          ADVERTENCIA: El uso de este dispositivo puede atraer atención no deseada de planos no materiales.
        </p>
      </div>
    );
  }

  return (
    // Contenedor Principal con efecto CRT y Glitch
    <div className={`h-screen w-full bg-black font-mono overflow-hidden flex flex-col relative ${glitch ? 'opacity-90 hue-rotate-90 blur-[1px]' : ''}`}>
      <div className="crt-overlay absolute inset-0 z-50 opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black z-0 pointer-events-none"></div>

      {/* --- HEADER TÁCTICO --- */}
      <header className="z-10 border-b border-green-800/50 p-3 flex justify-between items-center bg-green-900/10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-green-400">
          <Activity className="w-5 h-5 animate-pulse text-green-500 neon-text-glow" />
          <span className="text-xs tracking-widest font-bold">MONITOR: ACTIVO</span>
        </div>
        <div className="flex gap-4 text-[10px] text-green-600 font-bold">
          <div className="flex items-center gap-1"><Battery className="w-3 h-3"/> SYS: OK</div>
          <div className="flex items-center gap-1"><Radio className="w-3 h-3 animate-pulse"/> LINK: ESTABLE</div>
        </div>
      </header>

      {/* --- VISUALIZADOR PRINCIPAL (EL NUEVO RADAR) --- */}
      <main className="flex-1 flex flex-col items-center justify-start relative p-4 z-10 mt-8">
        
        {/* Contenedor del Radar Complejo */}
        <div className="relative w-[85vw] h-[85vw] max-w-[400px] max-h-[400px] rounded-full flex items-center justify-center">
          
          {/* Capas del Radar (Anillos y Rejillas) */}
          <div className="absolute inset-0 border-2 border-green-600/30 rounded-full neon-glow"></div> {/* Borde Exterior Brillante */}
          <div className="absolute inset-4 border border-green-600/20 rounded-full border-dashed animate-[spin_20s_linear_reverse_infinite]"></div>
          <div className="absolute inset-12 border border-green-600/40 rounded-full"></div>
          <div className="absolute inset-[30%] border-2 border-green-500/10 rounded-full pulsing-ring"></div> {/* Anillo que palpita */}

          {/* Líneas de la cuadrícula */}
          <div className="absolute w-full h-[1px] bg-green-600/20 top-1/2"></div>
          <div className="absolute h-full w-[1px] bg-green-600/20 left-1/2"></div>

          {/* La Barra de Escaneo Giratoria (Estilo Alien) */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
             <div className="w-full h-full radar-sweep-animation opacity-70 origin-center"></div>
          </div>

          {/* Puntero Magnético (La "aguja" que tenías antes, ahora más sutil) */}
          <div 
            className="absolute w-full h-full flex justify-center items-start transition-transform duration-300 ease-out z-20"
            style={{ transform: `rotate(${magneticHeading}deg)` }}
          >
            <div className="w-1 h-16 bg-green-500 mt-2 rounded-full neon-text-glow"></div>
            <div className="absolute top-0 text-xs text-green-300 font-bold -mt-6">{Math.round(magneticHeading)}°</div>
          </div>

          {/* PALABRA DETECTADA (EL GLITCH) */}
          {detectedWord && (
            <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-6xl font-extrabold text-red-600 tracking-tighter glitch-text neon-red-glow uppercase">
                {detectedWord}
              </h2>
            </div>
          )}

          {/* Datos Centrales */}
          <div className="absolute z-30 text-center flex flex-col items-center justify-center bg-black/50 p-4 rounded-full border border-green-500/30 backdrop-blur-sm">
             {/* Indicador de peligro */}
            {entropy > 50 && <AlertTriangle className="w-6 h-6 text-red-500 animate-ping absolute -top-6 neon-red-glow" />}
            
            <span className={`text-5xl font-bold tracking-tighter ${entropy > 80 ? 'text-red-500 neon-red-glow' : 'text-green-400 neon-text-glow'}`}>
                {entropy.toFixed(0)}
            </span>
            <p className="text-[9px] tracking-[0.2em] text-green-600 font-bold mt-1">NIVEL ENTROPÍA (µT)</p>
          </div>
        </div>

        {/* --- PANELES DE DATOS INFERIORES (Estilo Hardware) --- */}
        <div className="w-full mt-auto mb-4 grid grid-cols-2 gap-3 px-4 z-10">
          <div className="border border-green-800/60 bg-green-900/10 p-3 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50"></div>
            <p className="text-[9px] text-green-600 tracking-widest mb-1">FRECUENCIA BASE</p>
            <p className="text-xl text-green-400 font-bold">{(entropy * 1.33).toFixed(1)} <span className="text-xs">Hz</span></p>
          </div>
          <div className="border border-green-800/60 bg-green-900/10 p-3 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50"></div>
            <p className="text-[9px] text-green-600 tracking-widest mb-1">ESTADO EVP</p>
            <p className={`text-xl font-bold ${entropy > 70 ? "text-red-500 animate-pulse" : "text-green-400"}`}>
                {entropy > 70 ? "ANOMALÍA" : "LATENTE"}
            </p>
          </div>
        </div>

      </main>

      {/* --- LOG DE EVENTOS (TERMINAL) --- */}
      <footer className="h-1/4 bg-black border-t-2 border-green-800/50 p-4 overflow-y-auto z-10 relative">
        <h3 className="text-[10px] mb-2 text-green-600 font-bold tracking-widest flex items-center gap-2">
          <Zap className="w-3 h-3" /> REGISTRO DEL SISTEMA
        </h3>
        <div className="flex flex-col gap-1 font-mono text-xs">
          {logs.map((log, i) => (
            <p key={i} className={`truncate ${log.includes("!ADVERTENCIA!") ? "text-red-400 font-bold neon-red-glow" : "text-green-300/70"}`}>
              {log} <span className="animate-pulse inline-block ml-1">_</span>
            </p>
          ))}
        </div>
        {/* Efecto de degradado al final del log */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </footer>
    </div>
  );
}