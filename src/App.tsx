/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Calculator, 
  Zap, 
  Loader2, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';

interface Prediction {
  prediction: string;
  details: {
    years: number;
    months: number;
    days: number;
  };
  confidence: number;
}

export default function App() {
  const [year, setYear] = useState<string>('2000');
  const [month, setMonth] = useState<string>('1');
  const [day, setDay] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birth_year: parseInt(year),
          birth_month: parseInt(month),
          birth_day: parseInt(day),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from server');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0C] text-[#E0E0E0] font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      {/* Header Section */}
      <header className="h-20 shrink-0 border-b border-[#222226] flex items-center justify-between px-6 md:px-10 bg-[#0E0E12] z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
              AETERNUS <span className="text-blue-500 underline decoration-2">ML</span>
            </h1>
            <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase font-bold italic mt-1">
              Temporal Analysis Engine
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target Horizon</p>
            <p className="text-sm font-mono text-blue-400">31 MARCH 2026</p>
          </div>
          <div className="w-[1px] h-10 bg-[#222226]"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">System Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Control Panel (Left Sidebar) */}
        <section className="w-full md:w-[380px] shrink-0 border-r border-[#222226] p-8 md:p-10 flex flex-col gap-8 bg-[#0C0C10] overflow-y-auto z-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-blue-500" />
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] italic">Input Parameters</label>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Birth Date Configuration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-600 block pl-1 uppercase font-bold">Year</span>
                    <input 
                      type="number" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-[#16161C] border border-[#2A2A35] rounded-md py-3 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      placeholder="YYYY"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-600 block pl-1 uppercase font-bold">Month</span>
                    <select 
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full bg-[#16161C] border border-[#2A2A35] rounded-md py-3 px-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1 < 10 ? `0${i+1}` : i+1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-600 block pl-1 uppercase font-bold">Day</span>
                    <input 
                      type="number" 
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full bg-[#16161C] border border-[#2A2A35] rounded-md py-3 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      placeholder="DD"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#16161C] border border-blue-900/20 rounded-md">
                <div className="mt-1">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">ML Inference Engine</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed italic">Utilizing trained Random Forest Regressor for temporal drift calculation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-[11px] text-red-400 font-medium">
                {error}
              </div>
            )}
            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-md transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(37,99,235,0.2)] disabled:opacity-50 disabled:hover:bg-blue-600 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Calculate Chronology
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Display Panel (Right Content) */}
        <section className="flex-1 p-8 md:p-12 bg-[#0A0A0C] flex flex-col justify-center items-center relative overflow-hidden">
          {/* Backdrop Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-lg z-10">
            <div className="text-center mb-12">
              <span className="text-[10px] text-blue-500 font-mono tracking-[0.4em] uppercase block mb-3 font-bold">Temporal Output Matrix</span>
              <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-none italic">
                Analysis <span className="font-bold not-italic">Result</span>
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {!prediction && !loading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111118]/40 border border-[#222226] rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-gray-600 grayscale opacity-40 italic"
                >
                  <Target className="w-12 h-12 mb-2" />
                  <p className="text-sm font-mono tracking-widest uppercase">Waiting for Input Data</p>
                </motion.div>
              ) : prediction ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative bg-[#111118]/80 backdrop-blur-xl border border-[#2A2A35] rounded-3xl p-10 md:p-12 shadow-2xl overflow-hidden ring-1 ring-white/5"
                >
                  <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-gray-600 tracking-widest uppercase">
                    SEQ_ID: {(prediction.confidence * 100000).toFixed(0)}-ML
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="flex items-baseline gap-4 mb-2">
                       <span className="text-8xl md:text-9xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        {prediction.details.years}
                      </span>
                      <span className="text-xl md:text-2xl font-light text-blue-500 uppercase tracking-widest italic pt-4">
                        Years
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_rgba(34,197,94,1)]"></div>
                      <span className="text-[10px] text-green-400 font-mono tracking-wider">CONFIDENCE { (prediction.confidence * 100).toFixed(1) }%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-12 border-t border-[#222226] pt-8">
                    <div className="text-center p-4 bg-[#16161C]/50 rounded-xl border border-[#222226]">
                      <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold mb-1">Months</p>
                      <p className="text-2xl font-mono text-white tabular-nums">
                        {prediction.details.months}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-[#16161C]/50 rounded-xl border border-[#222226]">
                      <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold mb-1">Days</p>
                      <p className="text-2xl font-mono text-white tabular-nums">
                        {prediction.details.days}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 h-1 bg-[#1A1A24] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center p-20">
                  <div className="relative">
                    <div className="w-24 h-24 border-2 border-blue-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex justify-center gap-12 text-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Precision</p>
                <p className="font-mono text-sm">64-BIT</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Algorithm</p>
                <p className="font-mono text-sm leading-none pt-1">SKLEARN_0.24</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Latency</p>
                <p className="font-mono text-sm">~1.2MS</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="h-12 shrink-0 bg-[#08080A] border-t border-[#222226] px-6 md:px-10 flex items-center justify-between text-[9px] font-mono text-gray-600 z-10">
        <div className="flex gap-6 uppercase tracking-[0.2em] font-bold">
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Kernel: SKLEARN-LTS-2026</span>
          <span className="hidden sm:inline">Model: FOREST_REGR_V4</span>
        </div>
        <div className="uppercase tracking-[0.2em] flex items-center gap-2">
          DESIGNED FOR <span className="text-gray-400 font-bold">PREDICTIVE ENVIRONMENTS</span> 
          <ExternalLink className="w-2 h-2" />
        </div>
      </footer>
    </div>
  );
}


