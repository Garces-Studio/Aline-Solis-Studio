"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Share2, Download, Camera } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function ContenidoConfirmacion() {
  const searchParams = useSearchParams();
  const servicio = searchParams.get("servicio") || "Manicura Premium";
  const fecha = "Próximamente (Confirmar en WA)";
  const ticket = searchParams.get("ticket") || "AL-XXXXXX";

  return (
    <div className="min-h-screen bg-rosa-suave/30 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white"
      >
        <div className="bg-rosa-acento p-10 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="40" fill="white" fillOpacity="0.1" /></svg>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold mb-2 tracking-tight">¡Reserva Exitosa!</h1>
          <p className="text-white/80 font-light uppercase tracking-widest text-xs">Aline Solis Studio</p>
        </div>

        <div className="p-10 space-y-8 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-rosa-suave/50 rounded-2xl flex items-center justify-center text-rosa-acento group-hover:bg-rosa-acento group-hover:text-white transition-all">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Servicio</p>
                <p className="font-serif text-xl text-negro-lujo">{servicio}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-rosa-suave/50 rounded-2xl flex items-center justify-center text-rosa-acento group-hover:bg-rosa-acento group-hover:text-white transition-all">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fecha Estimada</p>
                <p className="font-serif text-xl text-negro-lujo">{fecha}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-rosa-suave/50 rounded-2xl flex items-center justify-center text-rosa-acento group-hover:bg-rosa-acento group-hover:text-white transition-all">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ubicación</p>
                <p className="font-serif text-xl text-negro-lujo">Nezahualcóyotl, EdoMex</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rosa-acento/5 -translate-y-1/2 translate-x-1/2 rounded-full transition-transform group-hover:scale-150"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Ticket ID</p>
            <p className="text-4xl font-serif font-black text-rosa-acento tracking-tighter">{ticket}</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => window.print()}
              className="w-full bg-negro-lujo text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-rosa-acento transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              Descargar Ticket <Download size={20} />
            </button>
            <a 
              href="https://www.instagram.com/aline_solis_studio/" 
              target="_blank" 
              className="w-full border-2 border-slate-100 text-slate-500 py-5 rounded-2xl font-bold uppercase tracking-widest hover:border-rosa-acento hover:text-rosa-acento transition-all flex items-center justify-center gap-3"
            >
              Compartir en Instagram <Camera size={20} />
            </a>
          </div>

          <p className="text-center text-[10px] text-slate-400 uppercase tracking-tighter">
            Presenta este ticket digital al llegar a tu cita.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaginaConfirmacion() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando confirmación...</div>}>
      <ContenidoConfirmacion />
    </Suspense>
  );
}
