"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService"; // Ajuste o caminho se precisar

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Estados para o formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro("");
    setLoading(true);

    try {
      if (isLogin) {
        // Tenta fazer o login
        await authService.login(email, senha);
        // Se a linha de cima não der erro (cair no catch), joga pro início!
        router.push("/");
      } else {
        await authService.register(name, email, senha);
        setIsLogin(!isLogin);
      }
    } catch (error) {
      setErro("Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto pt-20">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Play className="text-red-500 fill-red-500" size={48} />
          <h1 className="text-2xl font-bold">
            {isLogin ? "Fazer Login" : "Criar Conta"}
          </h1>
        </div>

        {/* Exibe o erro se as credenciais falharem */}
        {erro && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {erro}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-full mt-2 transition-colors"
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            {isLogin
              ? "Não tem uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
}
