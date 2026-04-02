"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Calendar, Star, ChevronLeft, Gift, Award, LogOut, Crown, Loader2
} from "lucide-react";

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

// Niveles del Club VIP
function getNivel(visitas: number) {
  if (visitas >= 16) return { nivel: "Gold", emoji: "👑", color: "from-yellow-500 to-yellow-300", textColor: "text-yellow-700", meta: 16, descuento: "15%" };
  if (visitas >= 6)  return { nivel: "Silver", emoji: "🥈", color: "from-slate-500 to-slate-400", textColor: "text-slate-600", meta: 15, descuento: "10%" };
  return { nivel: "Bronze", emoji: "🥉", color: "from-amber-700 to-amber-500", textColor: "text-amber-700", meta: 5, descuento: "5%" };
}

export default function MiCuenta() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [cargando, setCargando] = useState(true);

  // Datos de loyalty simulados — en producción vendrían de una tabla `visitas` en Supabase
  const visitas = 7;
  const vip = getNivel(visitas);
  const progreso = Math.min((visitas / (vip.nivel === "Gold" ? 16 : 15)) * 100, 100);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setSession(data.session);
      setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) router.replace("/login");
      else setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-crema flex items-center justify-center">
        <Loader2 size={32} className="text-rosa-acento animate-spin" />
      </div>
    );
  }

  const nombre = session?.user?.user_metadata?.nombre as string
    || session?.user?.email?.split("@")[0]
    || "Clienta";

  const email = session?.user?.email ?? "";

  return (
    <div className="min-h-screen bg-crema pt-24 pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rosa-suave/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-negro-lujo hover:text-rosa-acento transition-colors">
            <ChevronLeft size={20} />
            <span className="font-bold text-sm hidden sm:block">Inicio</span>
          </Link>
          <div className="font-bold text-negro-lujo flex items-center gap-2">
            <span className="text-lg">💅</span> Mi Cuenta
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-negro-lujo/50 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> <span className="hidden sm:block">Salir</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-6">
        {/* Tarjeta de perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-7 md:p-10 shadow-xl shadow-rosa-acento/5 border border-rosa-suave/30 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rosa-suave/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            {/* Avatar con inicial */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rosa-acento to-rosa-medio flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-negro-lujo mb-0.5 capitalize">{nombre}</h1>
              <p className="text-negro-lujo/50 text-sm mb-3">{email}</p>
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${vip.color} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow`}>
                <Award size={13} /> Club {vip.nivel} · {vip.descuento} descuento
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-5">
            {/* VIP Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-negro-lujo to-zinc-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 text-white/5 text-[8rem] pointer-events-none">
                {vip.emoji}
              </div>
              <h3 className="font-bold text-base mb-5 flex items-center gap-2 relative z-10">
                <Star className="text-yellow-400" size={18} /> Club VIP
              </h3>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60 text-xs">Mis visitas</span>
                    <span className="font-bold text-sm">{visitas} / {vip.meta}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progreso}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-rosa-acento to-rosa-medio rounded-full"
                    />
                  </div>
                  {vip.nivel !== "Gold" && (
                    <p className="text-white/40 text-xs mt-2 text-center">
                      {vip.meta - visitas} visitas para nivel {vip.nivel === "Bronze" ? "Silver" : "Gold"} {vip.nivel === "Silver" ? "👑" : "🥈"}
                    </p>
                  )}
                  {vip.nivel === "Gold" && (
                    <p className="text-yellow-400 text-xs mt-2 text-center font-bold">
                      ¡Eres miembro Gold! 🎉
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-white/40">Tu descuento activo</p>
                    <p className="text-2xl font-black text-rosa-acento">{vip.descuento} OFF</p>
                  </div>
                  <Gift size={26} className="text-white/20" />
                </div>
              </div>
            </motion.div>

            {/* Beneficios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-5 border border-rosa-suave/50 shadow-sm"
            >
              <h3 className="font-bold text-negro-lujo text-sm mb-4 flex items-center gap-2">
                <Crown size={15} className="text-rosa-acento" /> Tus beneficios
              </h3>
              <ul className="space-y-2.5">
                {vip.nivel === "Bronze" && ["5% descuento en servicios", "Acceso a promociones", "Cumpleaños especial"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-negro-lujo/70 text-xs">
                    <span className="text-rosa-acento mt-0.5">✓</span> {b}
                  </li>
                ))}
                {vip.nivel === "Silver" && ["10% descuento garantizado", "Regalo de cumpleaños", "Reserva con prioridad", "1 retoque gratis al mes"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-negro-lujo/70 text-xs">
                    <span className="text-rosa-acento mt-0.5">✓</span> {b}
                  </li>
                ))}
                {vip.nivel === "Gold" && ["15% descuento VIP", "Kit de regalo mensual", "Citas express sin espera", "1 diseño premium gratis", "Acceso avant-première"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-negro-lujo/70 text-xs">
                    <span className="text-rosa-acento mt-0.5">✓</span> {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Soporte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 border border-rosa-suave/50 shadow-sm"
            >
              <h3 className="font-bold text-negro-lujo text-sm mb-3">Ayuda</h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Preguntas frecuentes", href: "#" },
                  { label: "WhatsApp del studio", href: "https://wa.me/521XXXXXXXXXX" },
                  { label: "Política de cancelaciones", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-negro-lujo/60 text-xs hover:text-rosa-acento transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLogout}
                className="mt-5 flex items-center gap-2 text-red-400 text-xs font-medium hover:text-red-600 transition-colors"
              >
                <LogOut size={13} /> Cerrar sesión
              </button>
            </motion.div>
          </div>

          {/* Columna derecha: Citas */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-7 border border-rosa-suave/50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-negro-lujo">Mis Citas</h2>
                <span className="bg-rosa-suave/60 text-rosa-acento text-xs font-bold px-3 py-1 rounded-full">
                  2 próximas
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { mes: "OCT", dia: "24", servicio: "Manicura en Gel", hora: "Jueves 16:00 hrs", estado: "Confirmada", estadoColor: "bg-green-100 text-green-700 border-green-200", barra: "bg-rosa-acento" },
                  { mes: "NOV", dia: "12", servicio: "Retoque de Pestañas", hora: "Martes 11:30 hrs", estado: "Pendiente", estadoColor: "bg-amber-100 text-amber-700 border-amber-200", barra: "bg-zinc-200" },
                ].map((cita, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="border border-rosa-suave/50 hover:border-rosa-acento/30 rounded-2xl p-5 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${cita.barra}`} />
                    <div className="bg-rosa-suave/40 p-3 rounded-xl text-center min-w-[60px]">
                      <div className="text-xs font-bold text-rosa-acento uppercase">{cita.mes}</div>
                      <div className="text-xl font-black text-negro-lujo leading-none mt-0.5">{cita.dia}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-negro-lujo">{cita.servicio}</h4>
                      <p className="text-negro-lujo/50 text-xs flex items-center gap-1 mt-1">
                        <Calendar size={11} /> {cita.hora}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cita.estadoColor}`}>
                      {cita.estado}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Sin historial vacío — mensaje motivador */}
              <div className="mt-5 p-5 bg-rosa-suave/20 rounded-2xl text-center border border-dashed border-rosa-acento/20">
                <p className="text-negro-lujo/50 text-xs mb-3">
                  ¿Quieres acumular más visitas y subir de nivel?
                </p>
                <Link
                  href="/#servicios"
                  className="inline-flex items-center gap-2 bg-rosa-acento text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-negro-lujo transition-colors shadow"
                >
                  <Calendar size={13} /> Agendar nueva cita
                </Link>
              </div>

              {/* Info sobre visitas reales */}
              <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <User size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs leading-relaxed">
                  Tus visitas y citas se actualizan cuando el studio confirma tu reserva por WhatsApp.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
