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
    } catch (err) {
      alert("Error: Permisos requeridos.");
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
    addLog(`>> ALERTA: [${word}]`);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    setTimeout(() => setDetectedWord(null), 4000);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 6)]);
  };

  if (!started) {
    return (
      // PANTALLA DE INICIO BLANCA FORZADA (style={{ backgroundColor: 'white' }})
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-black" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center max-w-sm w-full">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Radar className="w-12 h-12 text-blue-600 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AETHER LABS</h1>
            <button 
            onClick={initializeSystem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md mt-6 flex items-center justify-center gap-2"
            >
            <Zap className="w-5 h-5" /> ENCENDER
            </button>
        </div>
      </div>
    );
  }

  return (
    // PANTALLA PRINCIPAL BLANCA FORZADA
    <div className="h-screen w-full p-4 flex flex-col text-black" style={{ backgroundColor: '#f3f4f6' }}>
      
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm mb-4 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${entropy > 50 ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-pulse'}`}></div>
          <span className="text-xs font-bold text-gray-700">SENSOR: ACTIVO</span>
        </div>
        <div className="text-xs font-medium text-gray-500 flex gap-2">
           <span>BAT: 98%</span> | <span>GPS: OK</span>
        </div>
      </div>

      {/* PANTALLA RADAR */}
      <main className="flex-1 border-2 border-gray-300 bg-white rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-4 mb-4 shadow-inner">
        
        {/* RADAR */}
        <div className="relative w-[280px] h-[280px] rounded-full flex items-center justify-center border-4 border-gray-100 bg-gray-50 shadow-inner">
          <div className="absolute inset-2 border border-blue-200 rounded-full"></div>
          <div className="absolute inset-[35%] border-2 border-blue-300/50 rounded-full animate-pulse"></div>

          {/* AGUJA */}
          <div 
            className="absolute w-full h-full flex justify-center p-4 transition-transform duration-300 ease-out z-20"
            style={{ transform: `rotate(${magneticHeading}deg)` }}
          >
            <div className="w-1 h-16 bg-red-500 mt-2"></div> 
          </div>

          {/* TEXTO FANTASMA */}
          {detectedWord && (
            <div className="absolute z-50 inset-0 flex items-center justify-center bg-white/90">
              <h2 className="text-5xl font-black text-red-600 border-4 border-red-600 p-2 transform -rotate-12">
                {detectedWord}
              </h2>
            </div>
          )}

          {/* NUMEROS */}
          <div className="absolute z-30 text-center bg-white p-2 rounded shadow border border-gray-200">
            <span className={`text-4xl font-black ${entropy > 80 ? 'text-red-600' : 'text-gray-800'}`}>
                {entropy.toFixed(0)}
            </span>
            <p className="text-[10px] font-bold text-gray-500">µT</p>
          </div>
        </div>
      </main>

      {/* LOGS */}
      <footer className="mt-4 bg-white border border-gray-300 rounded-lg p-3 h-32 overflow-y-auto text-xs shadow-sm">
        <h3 className="text-[10px] mb-2 text-gray-500 font-bold border-b pb-1">HISTORIAL</h3>
        {logs.map((log, i) => (
          <p key={i} className={`mb-1 ${log.includes("ALERTA") ? "text-red-600 font-bold" : "text-gray-600"}`}>
            {log}
          </p>
        ))}
      </footer>
    </div>
  );
}