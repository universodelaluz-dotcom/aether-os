"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Wifi, Activity, Battery, Zap, AlertTriangle } from 'lucide-react';

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
  const [entropy, setEntropy] = useState(0); // Nivel de "caos" (0-100)
  const [magneticHeading, setMagneticHeading] = useState(0); // Brújula simulada
  const [glitch, setGlitch] = useState(false);
  const [detectedWord, setDetectedWord] = useState<string | null>(null);
  
  // Referencias para Audio (Micrófono)
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // === 1. EL RITUAL DE INICIO (Solicitar Permisos) ===
  const initializeSystem = async () => {
    try {
      // Solicitar Audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      // Solicitar Sensores de Movimiento (iOS 13+ requiere esto)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
        }
      } else {
        setPermissionGranted(true); // Android / PC
      }

      setStarted(true);
      addLog("SISTEMA INICIADO...");
      addLog("CALIBRANDO SENSORES DE ENTROPÍA...");
      addLog("CONECTANDO CON EL VACÍO...");

    } catch (err) {
      alert("Error: Se requieren permisos de micrófono y sensores para el ritual.");
    }
  };

  // === 2. BUCLE PRINCIPAL (El corazón de la app) ===
  useEffect(() => {
    if (!started) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Usamos alpha como brújula (0-360)
      if (event.alpha) setMagneticHeading(event.alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Bucle de análisis (60fps)
    const interval = setInterval(() => {
      analyzeEnvironment();
    }, 100);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearInterval(interval);
    };
  }, [started]);

  // === 3. LÓGICA DE DETECCIÓN PARANORMAL ===
  const analyzeEnvironment = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    // Obtener datos de audio
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const avgVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;

    // Calcular "Entropía Total" (Ruido + Aleatoriedad del sistema)
    // En una app real, aquí sumaríamos acelerómetro.
    const chaosFactor = Math.random() * 10; 
    const totalEntropy = avgVolume + chaosFactor;

    setEntropy(totalEntropy);

    // --- UMBRALES DE ACTIVIDAD ---
    
    // 1. Glitch Visual (Interferencia)
    if (totalEntropy > 50) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }

    // 2. Formación de Palabras (Spirit Box)
    // Probabilidad baja, aumenta si hay mucho ruido (gritos/golpes)
    const triggerThreshold = 85; 
    if (totalEntropy > triggerThreshold && Math.random() > 0.95) {
      triggerParanormalEvent();
    }
  };

  const triggerParanormalEvent = () => {
    const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    setDetectedWord(word);
    addLog(`>> ENTIDAD DETECTADA: ${word}`);
    
    // Vibrar si es móvil
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    // Limpiar palabra después de 3 seg
    setTimeout(() => setDetectedWord(null), 3000);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 5)]);
  };

  // === RENDERIZADO ===
  if (!started) {
    return (
      <div className="h-screen w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl mb-8 tracking-widest font-bold animate-pulse">AETHER_OS</h1>
        <p className="text-sm mb-8 text-center opacity-70 max-w-md">
          ADVERTENCIA: Esta aplicación utiliza sensores experimentales para detectar fluctuaciones cuánticas. 
          Úselo bajo su propio riesgo.
        </p>
        <button 
          onClick={initializeSystem}
          className="border border-green-500 px-8 py-4 hover:bg-green-900/30 transition-all uppercase tracking-widest text-lg animate-bounce"
        >
          [ INICIAR PROTOCOLO ]
        </button>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full bg-black text-green-500 font-mono overflow-hidden flex flex-col relative ${glitch ? 'opacity-50 translate-x-1' : ''}`}>
      
      {/* --- HEADER TIPO MILITAR --- */}
      <header className="border-b border-green-900 p-2 flex justify-between items-center bg-green-900/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs">MONITOREO ACTIVO</span>
        </div>
        <div className="flex gap-4 text-xs opacity-70">
          <span>BAT: 98%</span>
          <span>REC: ON</span>
        </div>
      </header>

      {/* --- VISUALIZADOR PRINCIPAL (BRÚJULA / RADAR) --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-4">
        
        {/* Círculo de Detección */}
        <div className="relative w-64 h-64 border border-green-800 rounded-full flex items-center justify-center">
          {/* Anillos de radar */}
          <div className="absolute w-48 h-48 border border-green-900/50 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-32 h-32 border border-green-900/30 rounded-full"></div>
          
          {/* Puntero Giratorio (Magnetómetro) */}
          <div 
            className="absolute w-full h-0.5 bg-transparent flex justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${magneticHeading}deg)` }}
          >
            <div className="w-1/2 h-full bg-gradient-to-l from-green-500 to-transparent opacity-50"></div>
          </div>

          {/* PALABRA DETECTADA (EL OUIJA DIGITAL) */}
          {detectedWord && (
            <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/80">
              <h2 className="text-5xl font-bold text-red-600 tracking-tighter animate-pulse glitch-text">
                {detectedWord}
              </h2>
            </div>
          )}

          {/* Datos Centrales */}
          <div className="text-center z-10">
            <span className="text-4xl font-bold opacity-80">{entropy.toFixed(1)}</span>
            <p className="text-[10px] tracking-widest opacity-50">NIVEL DE ENTROPÍA (µT)</p>
          </div>
        </div>

        {/* --- GRID DE DATOS (SPIRIT BOX) --- */}
        <div className="w-full mt-8 grid grid-cols-2 gap-2 text-xs opacity-60">
          <div className="border border-green-900 p-2">
            <p>FREQ: {(entropy * 14.5).toFixed(2)} Hz</p>
            <p>MAG_X: {(Math.sin(magneticHeading) * 40).toFixed(2)}</p>
          </div>
          <div className="border border-green-900 p-2">
            <p>EVP: {entropy > 50 ? "DETECTADO" : "---"}</p>
            <p>TEMP: SIMULATED</p>
          </div>
        </div>

      </main>

      {/* --- LOG DE EVENTOS (FOOTER) --- */}
      <footer className="h-1/3 bg-green-900/5 border-t border-green-900 p-4 overflow-y-auto font-mono text-sm">
        <h3 className="text-[10px] mb-2 border-b border-green-900/50 pb-1 w-full flex justify-between">
          <span>REGISTRO DE COMUNICACIÓN</span>
          <Wifi className="w-3 h-3" />
        </h3>
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => (
            <p key={i} className={`truncate ${log.includes("ENTIDAD") ? "text-red-500 font-bold" : "opacity-70"}`}>
              {log}
            </p>
          ))}
        </div>
      </footer>

      {/* Efecto de Scanlines (Overlay) */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent bg-[length:100%_4px]"></div>
    </div>
  );
}