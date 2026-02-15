"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Activity, Battery, Zap, AlertTriangle, Radar, Database, Mic } from 'lucide-react';

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

  // === LÓGICA (Igual que antes, no cambia) ===
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
      addLog("Unidad AETHER-L encendida.");
      addLog("Calibrando sensores ambientales...");
    } catch (err) {
      alert("Error: Permisos requeridos para operar el dispositivo.");
    }
  };

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
    addLog(`>> ALERTA: Patrón detectado [${word}]`);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    setTimeout(() => setDetectedWord(null), 4000);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 6)]);
  };

  // ============================================
  // NUEVA INTERFAZ CLARA "TIPO APARATO"
  // ============================================

  if (!started) {
    return (
      // Pantalla de inicio Blanca y Limpia
      <div className="h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg device-chassis flex flex-col items-center max-w-sm w-full">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Radar className="w-12 h-12 text-blue-600 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">AETHER LABS</h1>
            <h2 className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">Unidad de Detección Espectral</h2>
            
            <button 
            onClick={initializeSystem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
            <Zap className="w-5 h-5" /> ENCENDER DISPOSITIVO
            </button>
            <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
            Uso exclusivo para investigación. Requiere acceso a sensores biométricos y ambientales.
            </p>
        </div>
      </div>
    );
  }

  return (
    // Contenedor Principal (El Aparato Físico)
    <div className={`h-screen w-full bg-gray-100 p-4 flex flex-col ${glitch ? 'bg-red-50 transition-colors duration-100' : ''}`}>
      
      {/* CARCASA SUPERIOR (Header Físico) */}
      <div className="device-chassis mb-4 p-3 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Simulación de un LED físico que parpadea */}
          <div className={`w-3 h-3 rounded-full ${entropy > 50 ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-pulse'}`}></div>
          <span className="text-xs font-bold text-gray-700 tracking-widest">SENSOR: ACTIVO</span>
        </div>
        <div className="flex gap-3 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md"><Battery className="w-3 h-3 text-gray-700"/> 98%</div>
          <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md"><Radio className="w-3 h-3 text-blue-600"/> GPS: OK</div>
        </div>
      </div>

      {/* PANTALLA PRINCIPAL HUNDIDA (Screen Inset) */}
      <main className="flex-1 screen-inset rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-4 mb-4 bg-white">
        
        {/* Rejilla de fondo de la pantalla */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{backgroundImage: 'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        </div>

        {/* El Radar Central (Azul y limpio) */}
        <div className="relative w-[280px] h-[280px] rounded-full flex items-center justify-center border-4 border-gray-200 bg-gray-50 shadow-inner">
          
          {/* Anillos técnicos azules */}
          <div className="absolute inset-2 border border-blue-200 rounded-full"></div>
          <div className="absolute inset-12 border border-blue-100 rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-[35%] border-2 border-blue-300/50 rounded-full pulsing-ring-light"></div>

          {/* Puntos cardinales impresos */}
          <span className="absolute top-2 text-xs text-gray-400 font-bold">N</span>
          <span className="absolute bottom-2 text-xs text-gray-400 font-bold">S</span>

          {/* Barra de escaneo (Azul claro) */}
          <div className="absolute inset-2 rounded-full overflow-hidden z-10">
             <div className="w-full h-full radar-sweep-animation-light opacity-50 origin-center"></div>
          </div>

          {/* Puntero Magnético (Aguja física) */}
          <div 
            className="absolute w-full h-full flex justify-center p-4 transition-transform duration-300 ease-out z-20"
            style={{ transform: `rotate(${magneticHeading}deg)` }}
          >
            {/* El triángulo rojo indica el norte magnético */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-red-500"></div>
          </div>

          {/* GLITCH DE PALABRA (Rojo intenso sobre blanco) */}
          {detectedWord && (
            <div className="absolute z-50 inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-200">
              <h2 className="text-5xl font-black text-red-600 tracking-tighter glitch-text-light uppercase bg-white px-4 py-2 border-4 border-red-600 transform -rotate-2 shadow-xl">
                {detectedWord}
              </h2>
            </div>
          )}

          {/* Lectura Central (Display LCD) */}
          <div className="absolute z-30 text-center flex flex-col items-center justify-center bg-white p-3 rounded-lg shadow-md border border-gray-200">
            {entropy > 60 && <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce absolute -top-3 bg-white rounded-full p-1 shadow-sm" />}
            
            <span className={`text-4xl font-black tracking-tighter font-mono ${entropy > 80 ? 'text-red-600' : 'text-gray-800'}`}>
                {entropy.toFixed(1)}
            </span>
            <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase bg-gray-100 px-2 rounded-full">Campo µT</p>
          </div>
        </div>
      </main>

      {/* --- PANELES INFERIORES (Botones físicos y lecturas) --- */}
      <div className="device-chassis p-4 grid grid-cols-3 gap-3 mb-auto bg-gray-50">
          {/* Módulo de Audio */}
          <div className="screen-inset p-2 rounded-md bg-white flex flex-col items-center justify-center">
             <Mic className={`w-5 h-5 mb-1 ${entropy > 50 ? 'text-red-500' : 'text-blue-500'}`}/>
             <p className="text-[9px] text-gray-500 font-bold">INPUT AUDIO</p>
             <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-100" style={{width: `${Math.min(entropy, 100)}%`}}></div>
             </div>
          </div>

          {/* Módulo de Frecuencia */}
          <div className="screen-inset p-2 rounded-md bg-white text-center col-span-2 flex items-center justify-between px-4">
            <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase text-left">Resonancia Base</p>
                <p className="text-xl font-mono font-bold text-gray-800">{(entropy * 0.4).toFixed(2)} <span className="text-xs text-blue-600">Ghz</span></p>
            </div>
            <Activity className="w-8 h-8 text-gray-300" />
          </div>
      </div>

      {/* --- LOG DE DATOS (Impresión en pantalla) --- */}
      <footer className="mt-4 device-chassis p-3 max-h-32 overflow-y-auto bg-gray-100 font-mono text-xs relative">
        <h3 className="text-[10px] mb-2 text-gray-500 font-bold uppercase flex items-center gap-2 border-b border-gray-300 pb-1">
          <Database className="w-3 h-3" /> Historial de Eventos
        </h3>
        <div className="flex flex-col gap-1.5">
          {logs.map((log, i) => (
            <p key={i} className={`flex items-start gap-2 ${log.includes("ALERTA") ? "text-red-600 font-bold bg-red-50 p-1 rounded-sm border-l-2 border-red-500" : "text-gray-700"}`}>
              {log.includes("ALERTA") ? <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/> : <span className="text-blue-400">›</span>}
              {log.replace(">", "")}
            </p>
          ))}
        </div>
      </footer>
    </div>
  );
}