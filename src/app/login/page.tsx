"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "registro">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
    } else {
      router.push("/cuenta");
    }
    setCargando(false);
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    if (error) {
      setError(error.message.includes("already registered")
        ? "Este correo ya está registrado. Inicia sesión."
        : "Ocurrió un error. Intenta de nuevo.");
    } else {
      setExito("¡Cuenta creada! Revisa tu correo para confirmar tu registro.");
    }
    setCargando(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crema via-white to-rosa-suave flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Floating blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-rosa-acento/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rosa-medio/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back link */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-negro-lujo/60 hover:text-rosa-acento transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl">💅</span>
          <div className="text-left">
            <span className="font-bold text-negro-lujo text-2xl block leading-none">Aline Solis</span>
            <span className="text-rosa-acento text-xs uppercase tracking-[0.25em] font-semibold">Studio</span>
          </div>
        </div>
        <p className="text-negro-lujo/50 text-sm mt-3">Tu portal de clienta exclusiva</p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl shadow-rosa-acento/10 border border-rosa-suave/50 overflow-hidden"
      >
        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-rosa-suave/50">
          {(["login", "registro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); setExito(""); }}
              className={`py-4 text-sm font-bold transition-all relative ${
                tab === t
                  ? "text-rosa-acento"
                  : "text-negro-lujo/40 hover:text-negro-lujo/70"
              }`}
            >
              {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              {tab === t && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-rosa-acento rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-7">
          <AnimatePresence mode="wait">
            {exito ? (
              <motion.div
                key="exito"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-bold text-negro-lujo text-lg mb-2">¡Ya eres parte del club!</h3>
                <p className="text-negro-lujo/60 text-sm mb-6">{exito}</p>
                <button
                  onClick={() => { setTab("login"); setExito(""); }}
                  className="bg-rosa-acento text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-negro-lujo transition-colors"
                >
                  Iniciar sesión
                </button>
              </motion.div>
            ) : tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-negro-lujo/60 uppercase tracking-wider block mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-negro-lujo/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="hola@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-rosa-suave text-negro-lujo text-sm placeholder:text-negro-lujo/30 focus:outline-none focus:border-rosa-acento focus:ring-2 focus:ring-rosa-acento/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-negro-lujo/60 uppercase tracking-wider block mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-negro-lujo/30" />
                    <input
                      type={verPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-rosa-suave text-negro-lujo text-sm placeholder:text-negro-lujo/30 focus:outline-none focus:border-rosa-acento focus:ring-2 focus:ring-rosa-acento/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setVerPassword(!verPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-negro-lujo/30 hover:text-negro-lujo/60 transition-colors"
                    >
                      {verPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-rosa-acento text-white py-3.5 rounded-xl font-bold text-sm hover:bg-negro-lujo transition-all shadow-lg shadow-rosa-acento/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                  {cargando ? "Entrando..." : "Entrar a mi cuenta"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="registro"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegistro}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-negro-lujo/60 uppercase tracking-wider block mb-1.5">
                    Tu nombre
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-negro-lujo/30" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      placeholder="Ej: Karla Martínez"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-rosa-suave text-negro-lujo text-sm placeholder:text-negro-lujo/30 focus:outline-none focus:border-rosa-acento focus:ring-2 focus:ring-rosa-acento/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-negro-lujo/60 uppercase tracking-wider block mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-negro-lujo/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="hola@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-rosa-suave text-negro-lujo text-sm placeholder:text-negro-lujo/30 focus:outline-none focus:border-rosa-acento focus:ring-2 focus:ring-rosa-acento/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-negro-lujo/60 uppercase tracking-wider block mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-negro-lujo/30" />
                    <input
                      type={verPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-rosa-suave text-negro-lujo text-sm placeholder:text-negro-lujo/30 focus:outline-none focus:border-rosa-acento focus:ring-2 focus:ring-rosa-acento/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setVerPassword(!verPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-negro-lujo/30 hover:text-negro-lujo/60 transition-colors"
                    >
                      {verPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-rosa-acento text-white py-3.5 rounded-xl font-bold text-sm hover:bg-negro-lujo transition-all shadow-lg shadow-rosa-acento/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                  {cargando ? "Creando tu cuenta..." : "Crear cuenta gratis"}
                </button>

                <p className="text-negro-lujo/40 text-xs text-center leading-relaxed">
                  Al registrarte aceptas recibir confirmaciones de citas por correo.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer benefit */}
        <div className="bg-rosa-suave/30 border-t border-rosa-suave/50 px-7 py-4 flex items-center gap-3">
          <Sparkles size={16} className="text-rosa-acento shrink-0" />
          <p className="text-negro-lujo/60 text-xs leading-snug">
            Crea tu cuenta y accede al <span className="font-bold text-rosa-acento">Club VIP</span>: descuentos, citas guardadas y beneficios exclusivos.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
