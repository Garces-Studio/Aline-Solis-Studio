"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Sparkles, MapPin, Phone, ShoppingBag,
  Gift, Calendar, Clock, ChevronRight, CheckCircle,
  Heart, Menu, X, Shield, ArrowRight,
  Package, Truck, User
} from "lucide-react";

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SERVICIOS = [
  { id: 1, nombre: "Manicura Clásica", precio: 150, duracion: "45 min", descripcion: "Limpieza, forma perfecta y esmaltado de larga duración con acabado impecable.", emoji: "✨", popular: false, categoria: "Manos" },
  { id: 2, nombre: "Manicura en Gel", precio: 250, duracion: "60 min", descripcion: "Resultado brillante y resistente. Dura hasta 3 semanas sin astillarse.", emoji: "💅", popular: true, categoria: "Manos" },
  { id: 3, nombre: "Nail Art Premium", precio: 350, duracion: "90 min", descripcion: "Diseños únicos y personalizados hechos a medida. Cada uña es una obra de arte.", emoji: "🎨", popular: false, categoria: "Manos" },
  { id: 4, nombre: "Pedicura Spa", precio: 280, duracion: "75 min", descripcion: "Tratamiento completo con exfoliación, hidratación profunda y esmaltado.", emoji: "🌸", popular: false, categoria: "Pies" },
  { id: 5, nombre: "Pestañas Pelo a Pelo", precio: 600, duracion: "2 hrs", descripcion: "Look natural e irresistible. Extensiones individuales con técnica coreana.", emoji: "👁️", popular: true, categoria: "Pestañas" },
  { id: 6, nombre: "Volumen Ruso", precio: 800, duracion: "2.5 hrs", descripcion: "Máximo dramatismo y volumen. El servicio más solicitado del studio.", emoji: "👑", popular: false, categoria: "Pestañas" },
];

const PRODUCTOS = [
  { id: 1, nombre: "Kit Starter Uñas", precio: 450, descripcion: "Gel base, top coat y 6 colores de temporada", badge: "Bestseller", emoji: "🎀" },
  { id: 2, nombre: "Kit Profesional UV", precio: 980, descripcion: "Set completo con lámpara UV LED + 12 colores", badge: "Nuevo", emoji: "⚡" },
  { id: 3, nombre: "Set Nail Art Deluxe", precio: 320, descripcion: "Pinceles profesionales, stamping y decoraciones", badge: null, emoji: "🖌️" },
  { id: 4, nombre: "Playera USA Premium", precio: 380, descripcion: "Importada directamente de EE.UU. Tallas S–XL", badge: "Importado", emoji: "🇺🇸" },
  { id: 5, nombre: "Accesorios Nail Art", precio: 180, descripcion: "Pedrería, láminas, polvo de unicornio y más", badge: null, emoji: "💎" },
  { id: 6, nombre: "Esmaltes Premium", precio: 220, descripcion: "Pack de 8 tonos exclusivos de temporada", badge: "Limitado", emoji: "🌈" },
];

const NIVELES_LEALTAD = [
  {
    nivel: "Bronze", rango: "0–5 visitas", descuento: "5%",
    color: "from-amber-700 to-amber-500", textColor: "text-amber-700",
    bgLight: "bg-amber-50", borderColor: "border-amber-200",
    emoji: "🥉",
    beneficios: ["5% descuento en todos los servicios", "Acceso a promociones exclusivas", "Cumpleaños especial"],
  },
  {
    nivel: "Silver", rango: "6–15 visitas", descuento: "10%",
    color: "from-slate-500 to-slate-400", textColor: "text-slate-600",
    bgLight: "bg-slate-50", borderColor: "border-slate-200",
    emoji: "🥈",
    beneficios: ["10% descuento garantizado", "Regalo de cumpleaños", "Reserva con prioridad", "1 retoque gratis al mes"],
  },
  {
    nivel: "Gold", rango: "16+ visitas", descuento: "15%",
    color: "from-yellow-500 to-yellow-300", textColor: "text-yellow-700",
    bgLight: "bg-yellow-50", borderColor: "border-yellow-300",
    emoji: "👑",
    beneficios: ["15% descuento VIP", "Kit de regalo mensual", "Citas express sin espera", "1 diseño premium gratis", "Acceso avant-première"],
  },
];

const GALERIA_ITEMS = [
  { titulo: "Chrome Glam", categoria: "Nail Art", gradient: "from-rose-200 via-pink-300 to-fuchsia-400", icon: "✨" },
  { titulo: "French Premium", categoria: "Manicura", gradient: "from-pink-100 via-rose-200 to-pink-400", icon: "💅" },
  { titulo: "Flores 3D", categoria: "Nail Art", gradient: "from-fuchsia-200 via-purple-300 to-violet-400", icon: "🌸" },
  { titulo: "Gel Nude", categoria: "Manicura", gradient: "from-amber-100 via-rose-200 to-pink-300", icon: "🤍" },
  { titulo: "Ombre Sunset", categoria: "Nail Art", gradient: "from-orange-200 via-pink-300 to-rose-500", icon: "🌅" },
  { titulo: "Volumen Ruso", categoria: "Pestañas", gradient: "from-slate-200 via-rose-200 to-pink-400", icon: "👁️" },
];

// ── Components ────────────────────────────────────────────────────────────────

function FadeInUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const links = [
    { href: "#servicios", label: "Servicios" },
    { href: "#galeria", label: "Instagram" },
    { href: "#tienda", label: "Tienda" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rosa-suave/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">💅</span>
          <div>
            <span className="font-bold text-negro-lujo text-lg leading-none block">Aline Solis</span>
            <span className="text-rosa-acento text-xs uppercase tracking-[0.2em] font-semibold">Studio</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-negro-lujo/70 hover:text-rosa-acento transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={loggedIn ? "/cuenta" : "/login"}
            className="flex items-center gap-1.5 text-sm font-semibold text-negro-lujo/70 hover:text-rosa-acento transition-colors px-3 py-2 rounded-full hover:bg-rosa-suave/50"
          >
            <User size={15} /> {loggedIn ? "Mi cuenta" : "Iniciar sesión"}
          </Link>
          <a
            href="#servicios"
            className="flex items-center gap-2 bg-rosa-acento text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rosa-acento/90 transition-all hover:shadow-lg hover:shadow-rosa-acento/30 hover:-translate-y-0.5"
          >
            Reservar <Calendar size={14} />
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-negro-lujo">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-rosa-suave px-6 pb-6"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-negro-lujo font-medium border-b border-rosa-suave/50 last:border-0">
                {l.label}
              </a>
            ))}
            <Link href={loggedIn ? "/cuenta" : "/login"} onClick={() => setOpen(false)} className="mt-4 w-full flex justify-center border-2 border-rosa-acento text-rosa-acento py-3 rounded-full font-semibold">
              {loggedIn ? "Mi cuenta" : "Iniciar sesión"}
            </Link>
            <a href="#servicios" onClick={() => setOpen(false)} className="mt-3 w-full flex justify-center bg-rosa-acento text-white py-3 rounded-full font-semibold">
              Reservar cita
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-crema via-white to-rosa-suave pt-20">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rosa-acento/10 rounded-full blur-3xl float-animation" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-rosa-medio/20 rounded-full blur-3xl float-animation-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rosa-suave/40 rounded-full blur-3xl" />

        {["💅", "✨", "🌸", "👑", "💎", "🎀"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl select-none"
            style={{
              top: `${15 + i * 12}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
              right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
            }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-rosa-acento/10 text-rosa-acento px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-rosa-acento/20"
        >
          <Sparkles size={14} /> Studio de belleza en Neza · Nezahualcóyotl
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-negro-lujo leading-[1.1] tracking-tight mb-6"
        >
          Tu belleza,{" "}
          <span className="relative inline-block">
            <span className="text-rosa-acento">nuestro arte</span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rosa-acento to-rosa-medio rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-negro-lujo/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Uñas, pestañas y más. El studio de belleza más completo de Nezahualcóyotl.
          Reserva en línea, paga fácil y llega lista para brillar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#servicios"
            className="group flex items-center justify-center gap-2 bg-rosa-acento text-white px-8 py-4 rounded-full font-bold text-base hover:bg-negro-lujo transition-all duration-300 shadow-xl shadow-rosa-acento/30 hover:shadow-negro-lujo/20 hover:-translate-y-1 glow-rosa"
          >
            Reservar mi cita
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#galeria"
            className="flex items-center justify-center gap-2 border-2 border-rosa-acento/30 text-rosa-acento px-8 py-4 rounded-full font-bold text-base hover:border-rosa-acento hover:bg-rosa-suave transition-all"
          >
            Ver galería 🎨
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-negro-lujo/50"
        >
          {[
            { label: "Clientes felices", value: "500+" },
            { label: "Años de experiencia", value: "5+" },
            { label: "Servicios disponibles", value: "12+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-rosa-acento">{stat.value}</div>
              <div className="text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-rosa-acento/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-rosa-acento rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

function ServicesSection() {
  const [reservando, setReservando] = useState<typeof SERVICIOS[0] | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleReservar(servicio: typeof SERVICIOS[0]) {
    setCargando(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ title: servicio.nombre, unit_price: servicio.precio }] }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Hubo un error. Inténtalo de nuevo o contáctanos por WhatsApp.");
      }
    } catch {
      alert("No se pudo conectar con el sistema de pagos. Contáctanos por WhatsApp.");
    } finally {
      setCargando(false);
      setReservando(null);
    }
  }

  return (
    <section id="servicios" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeInUp className="text-center mb-16">
          <span className="text-rosa-acento text-sm font-bold uppercase tracking-[0.3em]">Nuestros servicios</span>
          <h2 className="text-4xl md:text-5xl font-bold text-negro-lujo mt-3 mb-4">
            Tratamientos que te hacen brillar
          </h2>
          <p className="text-negro-lujo/60 max-w-xl mx-auto">
            Cada servicio es realizado con productos de la más alta calidad y técnicas actualizadas.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICIOS.map((s, i) => (
            <FadeInUp key={s.id} delay={i * 0.08}>
              <div className="group relative bg-white border border-rosa-suave rounded-3xl p-7 hover:border-rosa-acento/40 hover:shadow-2xl hover:shadow-rosa-acento/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                {s.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-rosa-acento text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-rosa-acento/30">
                      ⭐ Más popular
                    </span>
                  </div>
                )}
                <div className="text-4xl mb-4">{s.emoji}</div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-negro-lujo text-lg">{s.nombre}</h3>
                  <span className="text-xs text-negro-lujo/40 bg-rosa-suave/50 px-3 py-1 rounded-full font-medium">{s.categoria}</span>
                </div>
                <p className="text-negro-lujo/60 text-sm leading-relaxed mb-6">{s.descripcion}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-negro-lujo">${s.precio}</span>
                    <span className="text-negro-lujo/40 text-sm ml-1">MXN</span>
                    <div className="flex items-center gap-1 text-negro-lujo/40 text-xs mt-0.5">
                      <Clock size={11} /> {s.duracion}
                    </div>
                  </div>
                  <button
                    onClick={() => setReservando(s)}
                    className="flex items-center gap-1.5 bg-negro-lujo text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-rosa-acento transition-all duration-300 group-hover:scale-105"
                  >
                    Reservar <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {reservando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-negro-lujo/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setReservando(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{reservando.emoji}</div>
                <h3 className="text-2xl font-bold text-negro-lujo">{reservando.nombre}</h3>
                <p className="text-negro-lujo/60 text-sm mt-1">{reservando.descripcion}</p>
              </div>

              <div className="bg-rosa-suave/50 rounded-2xl p-5 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-negro-lujo/50 uppercase tracking-widest font-bold">Total a pagar</p>
                  <p className="text-3xl font-bold text-negro-lujo">${reservando.precio} <span className="text-sm text-negro-lujo/40">MXN</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-negro-lujo/50 uppercase tracking-widest font-bold">Duración</p>
                  <p className="text-lg font-semibold text-rosa-acento">{reservando.duracion}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-700">
                <p className="font-semibold mb-1">📅 ¿Cómo funciona?</p>
                <p>Paga el anticipo aquí y te confirmamos tu cita por WhatsApp con la fecha y hora disponible.</p>
              </div>

              <button
                onClick={() => handleReservar(reservando)}
                disabled={cargando}
                className="w-full bg-rosa-acento text-white py-4 rounded-2xl font-bold text-base hover:bg-negro-lujo transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-xl shadow-rosa-acento/30"
              >
                {cargando ? "Redirigiendo..." : "Pagar con MercadoPago 💙"}
              </button>
              <button onClick={() => setReservando(null)} className="w-full mt-3 py-3 text-negro-lujo/50 text-sm hover:text-negro-lujo transition-colors">
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LoyaltySection() {
  return (
    <section id="lealtad" className="py-20 px-6 bg-gradient-to-br from-negro-lujo via-negro-lujo/95 to-negro-lujo relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rosa-acento/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rosa-medio/10 rounded-full blur-3xl" />
        {["✨", "👑", "💎", "🌟"].map((e, i) => (
          <motion.div key={i} className="absolute text-2xl opacity-20" style={{ top: `${20 + i * 20}%`, left: `${5 + i * 25}%` }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i, repeat: Infinity }}>
            {e}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeInUp className="text-center mb-16">
          <span className="text-rosa-medio text-sm font-bold uppercase tracking-[0.3em]">Programa de lealtad</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Club VIP <span className="text-rosa-acento">Aline Solis</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Cada visita te acerca más a los beneficios exclusivos. ¡Acumula y gana!
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NIVELES_LEALTAD.map((nivel, i) => (
            <FadeInUp key={nivel.nivel} delay={i * 0.1}>
              <div className={`relative bg-white/5 backdrop-blur-sm border ${nivel.borderColor} rounded-3xl p-7 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 ${i === 2 ? "ring-2 ring-yellow-400/50" : ""}`}>
                {i === 2 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-negro-lujo text-xs font-black px-4 py-1.5 rounded-full">
                      ⭐ MEJOR PLAN
                    </span>
                  </div>
                )}

                <div className="text-5xl mb-4">{nivel.emoji}</div>
                <h3 className="text-2xl font-black text-white mb-1">{nivel.nivel}</h3>
                <p className="text-white/50 text-sm mb-4">{nivel.rango}</p>

                <div className={`inline-block bg-gradient-to-r ${nivel.color} text-white text-3xl font-black px-5 py-2 rounded-2xl mb-6 shadow-lg`}>
                  {nivel.descuento} OFF
                </div>

                <ul className="space-y-3">
                  {nivel.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-white/80 text-sm">
                      <CheckCircle size={16} className="text-rosa-acento mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur text-white/70 text-sm px-6 py-4 rounded-2xl border border-white/10">
            <Gift size={18} className="text-rosa-medio" />
            Tu nivel se actualiza automáticamente. Solo visita y acumula.
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ── INSTAGRAM FEED ────────────────────────────────────────────────────────────
// Para conectar fotos reales: usa https://behold.so (gratis, sin API key)
// y reemplaza el grid con su widget embed <behold-widget feed-id="TU_ID" />

function GallerySection() {
  // Publicaciones de muestra — reemplazar con widget real de Behold.io
  const posts = GALERIA_ITEMS.map((item, i) => ({
    ...item,
    likes: [128, 243, 97, 310, 175, 88][i] ?? 100,
    comentarios: [14, 32, 8, 41, 20, 11][i] ?? 10,
  }));

  return (
    <section id="galeria" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header estilo Instagram */}
        <FadeInUp className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {/* Avatar simulado */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-rosa-acento to-orange-400 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                💅
              </div>
            </div>
            <div>
              <p className="font-black text-negro-lujo text-lg leading-none">@aline_solis_studio</p>
              <p className="text-negro-lujo/50 text-sm mt-0.5">Studio de belleza · Nezahualcóyotl</p>
              <div className="flex gap-4 mt-2 text-xs text-negro-lujo/60 font-medium">
                <span><b className="text-negro-lujo">500+</b> clientas</span>
                <span><b className="text-negro-lujo">6</b> posts recientes</span>
              </div>
            </div>
          </div>
          <a
            href="https://www.instagram.com/aline_solis_studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-rosa-acento to-orange-400 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            <InstagramIcon size={16} /> Seguir en Instagram
          </a>
        </FadeInUp>

        {/* Grid de posts */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-2.5">
          {posts.map((post, i) => (
            <FadeInUp key={i} delay={i * 0.05}>
              <a
                href="https://www.instagram.com/aline_solis_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br ${post.gradient} block`}
              >
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                    {post.icon}
                  </span>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-negro-lujo/0 group-hover:bg-negro-lujo/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <p className="text-white font-bold text-sm text-center px-3 leading-tight">{post.titulo}</p>
                  <div className="flex items-center gap-3 text-white text-xs font-semibold">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comentarios}</span>
                  </div>
                </div>
              </a>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp className="text-center mt-8">
          <p className="text-negro-lujo/40 text-xs">
            Muestras de nuestro trabajo · Síguenos para ver más diseños diario
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}

function StoreSection() {
  return (
    <section id="tienda" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeInUp className="text-center mb-16">
          <span className="text-rosa-acento text-sm font-bold uppercase tracking-[0.3em]">Tienda online</span>
          <h2 className="text-4xl md:text-5xl font-bold text-negro-lujo mt-3 mb-4">
            Lleva el studio a casa
          </h2>
          <p className="text-negro-lujo/60 max-w-xl mx-auto">
            Kits profesionales, accesorios y productos importados. Envíos a todo México.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTOS.map((p, i) => (
            <FadeInUp key={p.id} delay={i * 0.07}>
              <div className="group bg-white border border-rosa-suave rounded-3xl p-6 hover:shadow-2xl hover:shadow-rosa-acento/10 hover:border-rosa-acento/30 transition-all duration-500 hover:-translate-y-2">
                <div className="relative mb-5">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-rosa-suave to-rosa-medio/40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                    {p.emoji}
                  </div>
                  {p.badge && (
                    <span className="absolute top-3 right-3 bg-rosa-acento text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-negro-lujo text-base mb-1">{p.nombre}</h3>
                <p className="text-negro-lujo/50 text-sm mb-4 leading-relaxed">{p.descripcion}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-negro-lujo">${p.precio}</span>
                    <span className="text-xs text-negro-lujo/40 ml-1">MXN</span>
                  </div>
                  <button className="flex items-center gap-1.5 bg-negro-lujo text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-rosa-acento transition-all">
                    <ShoppingBag size={14} /> Comprar
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Truck size={20} />, titulo: "Envío gratis", detalle: "En compras +$800 MXN" },
              { icon: <Shield size={20} />, titulo: "Compra segura", detalle: "Pagos con MercadoPago" },
              { icon: <Package size={20} />, titulo: "Empaque especial", detalle: "Presentación de regalo" },
            ].map((f) => (
              <div key={f.titulo} className="flex items-center gap-4 bg-rosa-suave/40 rounded-2xl p-5">
                <div className="w-11 h-11 bg-rosa-acento/10 rounded-xl flex items-center justify-center text-rosa-acento shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-negro-lujo text-sm">{f.titulo}</p>
                  <p className="text-negro-lujo/50 text-xs">{f.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const pasos = [
    {
      numero: "01",
      titulo: "Elige tu servicio",
      descripcion: "Navega nuestro menú y selecciona el tratamiento que quieres. Manicura, pedicura, pestañas y más.",
      icon: "💅",
      color: "from-rosa-acento to-rosa-medio",
    },
    {
      numero: "02",
      titulo: "Paga en línea",
      descripcion: "Asegura tu cita con un anticipo seguro a través de MercadoPago. Rápido, fácil y sin complicaciones.",
      icon: "💳",
      color: "from-purple-400 to-rosa-acento",
    },
    {
      numero: "03",
      titulo: "Llega y brilla",
      descripcion: "Te confirmamos por WhatsApp con fecha y hora. Solo llega, relájate y disfruta. ¡Nosotras nos encargamos del resto!",
      icon: "✨",
      color: "from-amber-400 to-rosa-acento",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* subtle bg pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-rosa-suave rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rosa-medio/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeInUp className="text-center mb-16">
          <span className="text-rosa-acento text-sm font-bold uppercase tracking-[0.3em]">Simple y rápido</span>
          <h2 className="text-4xl md:text-5xl font-bold text-negro-lujo mt-3 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-negro-lujo/60 max-w-lg mx-auto">
            Reservar nunca fue tan fácil. En 3 pasos tienes tu cita lista.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-rosa-acento/20 via-rosa-acento to-rosa-acento/20" />

          {pasos.map((paso, i) => (
            <FadeInUp key={paso.numero} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center group">
                {/* number bubble */}
                <motion.div
                  className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${paso.color} flex items-center justify-center shadow-xl mb-6 z-10`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-4xl">{paso.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-negro-lujo rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-black">{paso.numero}</span>
                  </div>
                </motion.div>

                <h3 className="text-xl font-bold text-negro-lujo mb-3 group-hover:text-rosa-acento transition-colors">
                  {paso.titulo}
                </h3>
                <p className="text-negro-lujo/60 text-sm leading-relaxed max-w-xs">
                  {paso.descripcion}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.4} className="mt-14 text-center">
          <a
            href="#servicios"
            className="group inline-flex items-center gap-3 bg-rosa-acento text-white px-10 py-4 rounded-full font-bold text-base hover:bg-negro-lujo transition-all duration-300 shadow-xl shadow-rosa-acento/30 hover:-translate-y-1"
          >
            Empezar ahora
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </FadeInUp>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────

const TESTIMONIOS = [
  {
    nombre: "Karla M.",
    texto: "Las mejores pestañas que me han hecho en mi vida. Duran muchísimo y el trato es increíble. Ya no voy a ningún otro lado.",
    servicio: "Volumen Ruso",
    estrellas: 5,
    tiempo: "hace 1 semana",
    avatar: "👩‍🦱",
  },
  {
    nombre: "Daniela R.",
    texto: "El sistema de reservas online es genial. Pagué, me confirmaron por WhatsApp y llegué directo a mi cita. Súper profesional.",
    servicio: "Manicura en Gel",
    estrellas: 5,
    tiempo: "hace 2 semanas",
    avatar: "👩🏻",
  },
  {
    nombre: "Paola G.",
    texto: "El Nail Art que me hicieron fue una obra de arte. Mis amigas no podían creer que lo hicieron aquí en Neza. ¡100% recomendado!",
    servicio: "Nail Art Premium",
    estrellas: 5,
    tiempo: "hace 3 semanas",
    avatar: "👩🏽‍🦲",
  },
];

function TestimonialsSection() {
  return (
    <section id="reseñas" className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-rosa-suave via-white to-rosa-medio/20">
      {/* Animated geometric background elements for a better look */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rosa-acento/10 via-transparent to-rosa-suave" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeInUp className="text-center mb-16">
          <span className="text-rosa-acento text-sm font-bold uppercase tracking-[0.3em]">Clientas felices</span>
          <h2 className="text-4xl md:text-5xl font-bold text-negro-lujo mt-3 mb-4">
            Lo que dicen de nosotras
          </h2>
          <p className="text-negro-lujo/60 max-w-lg mx-auto">
            Más de 500 clientas confían en Aline Solis Studio. Estos son sus testimonios reales.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t, i) => (
            <FadeInUp key={t.nombre} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl hover:shadow-rosa-acento/10 transition-shadow border border-rosa-suave/60"
              >
                {/* stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.estrellas }).map((_, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + idx * 0.05 }}
                      className="text-amber-400 text-lg"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                <p className="text-negro-lujo/80 text-base leading-relaxed mb-6 italic">
                  &ldquo;{t.texto}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-rosa-suave rounded-full flex items-center justify-center text-2xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-negro-lujo text-sm">{t.nombre}</p>
                      <p className="text-negro-lujo/40 text-xs">{t.tiempo}</p>
                    </div>
                  </div>
                  <span className="bg-rosa-suave/80 text-rosa-acento text-xs font-semibold px-3 py-1.5 rounded-full">
                    {t.servicio}
                  </span>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3} className="mt-10 text-center">
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 bg-rosa-acento text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-negro-lujo transition-all shadow-lg shadow-rosa-acento/30 hover:-translate-y-0.5"
          >
            Reservar mi cita <ArrowRight size={15} />
          </a>
        </FadeInUp>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="contacto" className="py-20 px-6 bg-crema">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInUp>
            <span className="text-rosa-acento text-sm font-bold uppercase tracking-[0.3em]">Encuéntranos</span>
            <h2 className="text-4xl md:text-5xl font-bold text-negro-lujo mt-3 mb-6">
              Visítanos en Neza
            </h2>
            <p className="text-negro-lujo/60 mb-8 leading-relaxed">
              Somos el único studio de belleza en Nezahualcóyotl con reservaciones online,
              programa de lealtad y pago digital. Una experiencia pensada para ti.
            </p>

            <div className="space-y-5">
              {[
                { icon: <MapPin size={18} />, titulo: "Ubicación", detalle: "Nezahualcóyotl, Estado de México" },
                { icon: <Clock size={18} />, titulo: "Horario", detalle: "Lun–Sáb 9:00–20:00 · Dom 10:00–17:00" },
                { icon: <Phone size={18} />, titulo: "WhatsApp", detalle: "Escríbenos para confirmar tu cita" },
                { icon: <InstagramIcon size={18} />, titulo: "Instagram", detalle: "@aline_solis_studio" },
              ].map((item) => (
                <div key={item.titulo} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-rosa-acento/10 rounded-2xl flex items-center justify-center text-rosa-acento shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-negro-lujo text-sm">{item.titulo}</p>
                    <p className="text-negro-lujo/60 text-sm">{item.detalle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="https://wa.me/521XXXXXXXXXX"
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
              >
                💬 WhatsApp
              </a>
              <a
                href="https://www.instagram.com/aline_solis_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-rosa-acento text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="space-y-4">
              {/* Google Maps embed */}
              <div className="rounded-3xl overflow-hidden border border-rosa-suave shadow-xl">
                <iframe
                  title="Ubicación Aline Solis Studio"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60373.67!2d-98.9977!3d19.4135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f38f7e96d921%3A0x8f3d4b5dba9c7d9!2sNezahualc%C3%B3yotl%2C%20Estado%20de%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1648000000000!5m2!1ses!2smx"
                  width="100%"
                  height="300"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* CTA card debajo del mapa */}
              <div className="bg-gradient-to-r from-rosa-acento to-rosa-medio/80 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-base leading-tight">¿Lista para brillar?</p>
                  <p className="text-white/70 text-sm mt-0.5">Reserva tu cita en minutos</p>
                </div>
                <a
                  href="#servicios"
                  className="bg-white text-rosa-acento px-5 py-2.5 rounded-full font-bold text-sm hover:bg-negro-lujo hover:text-white transition-all shadow-lg whitespace-nowrap"
                >
                  Reservar
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-negro-lujo text-white py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💅</span>
              <div>
                <span className="font-bold text-lg">Aline Solis</span>
                <span className="text-rosa-acento text-xs ml-1 uppercase tracking-widest">Studio</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              El studio de belleza más moderno de Nezahualcóyotl. Uñas, pestañas y más, con tecnología y amor.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white/80 uppercase tracking-wider text-xs">Servicios</h4>
            <ul className="space-y-2">
              {["Manicura Clásica", "Manicura en Gel", "Nail Art Premium", "Pedicura Spa", "Pestañas"].map((s) => (
                <li key={s}>
                  <a href="#servicios" className="text-white/50 text-sm hover:text-rosa-acento transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white/80 uppercase tracking-wider text-xs">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/50 text-sm"><MapPin size={14} /> Nezahualcóyotl, EdoMex</li>
              <li className="flex items-center gap-2 text-white/50 text-sm"><Clock size={14} /> Lun–Sáb 9–20h · Dom 10–17h</li>
              <li>
                <a href="https://www.instagram.com/aline_solis_studio/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/50 text-sm hover:text-rosa-acento transition-colors">
                  <InstagramIcon size={14} /> @aline_solis_studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2026 Aline Solis Studio. Todos los derechos reservados.</p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            Hecho con <Heart size={11} className="text-rosa-acento fill-rosa-acento" /> en Nezahualcóyotl
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      <TestimonialsSection />
      <LoyaltySection />
      <GallerySection />
      <StoreSection />
      <AboutSection />
      <Footer />
    </>
  );
}
