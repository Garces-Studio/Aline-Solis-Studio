"use client";

import { motion } from "framer-motion";
import { User, Calendar, Star, Settings, ChevronLeft, Gift, Award, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MiCuenta() {
  // Simulación de datos para demostración
  const [userVal, setUserVal] = useState({
    nombre: "Daniela Rojas",
    visitas: 7,
    nivel: "Silver",
    puntos: 12,
  });

  // Cálculo de progreso para el Club VIP (Silver: 6-15, Gold: 16+)
  const meta = 15;
  const progreso = (userVal.visitas / meta) * 100;

  return (
    <div className="min-h-screen bg-crema pt-24 pb-20">
      {/* Header/Nav super simple para la cuenta */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rosa-suave/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-negro-lujo hover:text-rosa-acento transition-colors">
            <ChevronLeft size={20} />
            <span className="font-bold text-sm">Volver al inicio</span>
          </Link>
          <div className="font-bold text-negro-lujo">Mi Perfil 💅</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Cabecera del Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-rosa-acento/5 border border-rosa-suave/30 mb-8 relative overflow-hidden"
        >
          {/* Fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rosa-suave/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rosa-acento to-rosa-medio flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userVal.nombre.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black text-negro-lujo mb-1">{userVal.nombre}</h1>
              <p className="text-negro-lujo/50 text-sm mb-4">danielar@ejemplo.com</p>
              
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-400 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                <Award size={14} /> Nivel {userVal.nivel}
              </div>
            </div>
            <button className="hidden md:flex items-center gap-2 text-negro-lujo/50 hover:text-negro-lujo transition-colors text-sm font-medium">
              <Settings size={18} /> Ajustes
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: VIP & Stats */}
          <div className="md:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-negro-lujo to-zinc-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 text-white/5 text-9xl">👑</div>
              
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 z-10 relative">
                <Star className="text-yellow-400" size={20} /> Club VIP Status
              </h3>
              
              <div className="space-y-4 z-10 relative">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Visitas actuales</span>
                    <span className="font-bold">{userVal.visitas} / {meta}</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progreso}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-rosa-acento to-rosa-medio rounded-full"
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2 text-center">
                    A {meta - userVal.visitas} visitas de ser nivel Gold 🏅
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-white/50">Puntos acumulados</p>
                    <p className="text-2xl font-black text-rosa-acento">{userVal.puntos}</p>
                  </div>
                  <Gift size={28} className="text-white/20" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-rosa-suave/50 shadow-md"
            >
              <h3 className="font-bold text-negro-lujo mb-4">Ayuda y Soporte</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm border-b border-transparent hover:border-negro-lujo/30 text-negro-lujo/70 hover:text-negro-lujo transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="text-sm border-b border-transparent hover:border-negro-lujo/30 text-negro-lujo/70 hover:text-negro-lujo transition-colors">Contacto WhatsApp</a></li>
                <li><a href="#" className="text-sm border-b border-transparent hover:border-negro-lujo/30 text-negro-lujo/70 hover:text-negro-lujo transition-colors">Política de cancelaciones</a></li>
              </ul>
              
              <button className="mt-8 flex items-center gap-2 text-red-500/80 text-sm font-medium hover:text-red-500 transition-colors">
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </motion.div>
          </div>

          {/* Columna Derecha: Citas */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 border border-rosa-suave/50 shadow-md h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-negro-lujo">Tus Citas</h2>
                <span className="bg-rosa-suave/50 text-rosa-acento text-xs font-bold px-3 py-1 rounded-full">
                  2 Próximas
                </span>
              </div>

              {/* Lista de citas */}
              <div className="space-y-5">
                {/* Cita 1 */}
                <div className="group border border-rosa-suave/50 hover:border-rosa-acento/40 rounded-2xl p-5 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rosa-acento" />
                  <div className="bg-rosa-suave/40 p-4 rounded-xl text-center min-w-[70px]">
                    <div className="text-xs font-bold text-rosa-acento uppercase">OCT</div>
                    <div className="text-2xl font-black text-negro-lujo leading-none mt-1">24</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-negro-lujo text-lg">Manicura en Gel</h4>
                    <p className="text-negro-lujo/50 text-sm flex items-center gap-1 mt-1">
                      <Calendar size={14} /> Jueves, 16:00 hrs
                    </p>
                  </div>
                  <div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                      Confirmada
                    </span>
                  </div>
                </div>

                {/* Cita 2 */}
                <div className="group border border-rosa-suave/50 hover:border-rosa-acento/40 rounded-2xl p-5 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-200" />
                  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl text-center min-w-[70px]">
                    <div className="text-xs font-bold text-zinc-400 uppercase">NOV</div>
                    <div className="text-2xl font-black text-negro-lujo leading-none mt-1">12</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-negro-lujo text-lg">Retoque de Pestañas</h4>
                    <p className="text-negro-lujo/50 text-sm flex items-center gap-1 mt-1">
                      <Calendar size={14} /> Martes, 11:30 hrs
                    </p>
                  </div>
                  <div>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                      Pendiente
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-8 border-t border-rosa-suave/50 text-center">
                <Link href="/#servicios" className="inline-flex items-center gap-2 bg-negro-lujo text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-rosa-acento transition-colors">
                  <Calendar size={16} /> Agendar nueva cita
                </Link>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
