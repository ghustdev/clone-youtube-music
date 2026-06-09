"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Play className="text-red-500 fill-red-500" size={48} />
          <h1 className="text-2xl font-bold">
            {isLogin ? "Fazer Login" : "Criar Conta"}
          </h1>
          <p className="text-zinc-400 text-sm text-center">
            {isLogin
              ? "Acesse sua conta para curtir suas músicas."
              : "Cadastre-se para criar playlists e salvar favoritos."}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Seu Nome Completo"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-full mt-2 transition-colors">
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
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
