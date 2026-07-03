// app/admin/page.tsx
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Plus, Trash2, Edit2, Link as LinkIcon, AlertCircle, X, Music, User, Disc, Tags } from "lucide-react";
import { authService } from "@/services/authService";
import { musicaService, Musica } from "@/services/musicaService";
import { artistaService, generoService, albumService, Artista, Genero, Album } from "@/services/adminService";

type Tab = "musicas" | "artistas" | "albuns" | "generos";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("musicas");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [albuns, setAlbuns] = useState<Album[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [novaMusica, setNovaMusica] = useState({ title: "", artist: "", album: "", genre: "", youtubeUrl: "", durationSeconds: 0 });
  const [novoArtista, setNovoArtista] = useState({ nome: "", biografia: "", foto_url: "" });
  const [novoGenero, setNovoGenero] = useState({ nome: "" });
  const [novoAlbum, setNovoAlbum] = useState({ titulo: "", artistaId: 0, ano_lancamento: new Date().getFullYear(), capa_url: "" });

  const isAdmin = useSyncExternalStore(authService.subscribeAuthChanges, authService.getAdminSnapshot, () => false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      const [musicasData, artistasData, generosData, albunsData] = await Promise.all([
        musicaService.listar().catch(() => []),
        artistaService.listar().catch(() => []),
        generoService.listar().catch(() => []),
        albumService.listar().catch(() => []),
      ]);
      setMusicas(musicasData);
      setArtistas(artistasData);
      setGeneros(generosData);
      setAlbuns(albunsData);
    } catch (error) {
      setErro("Erro geral ao carregar dados. Verifique sua conexão e permissões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) carregarDados();
  }, [isAdmin]);

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNovaMusica({ title: "", artist: "", album: "", genre: "", youtubeUrl: "", durationSeconds: 0 });
    setNovoArtista({ nome: "", biografia: "", foto_url: "" });
    setNovoGenero({ nome: "" });
    setNovoAlbum({ titulo: "", artistaId: 0, ano_lancamento: new Date().getFullYear(), capa_url: "" });
  };

  // --- Deleção em Cascata ---
  const handleDeletarMusica = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta música?")) {
      await musicaService.deletar(id);
      carregarDados();
    }
  };
  const handleDeletarArtista = async (id: number) => {
    if (confirm("ATENÇÃO: Excluir este artista excluirá em cascata todos os seus álbuns e músicas associadas. Tem certeza?")) {
      await artistaService.deletar(id);
      carregarDados();
    }
  };
  const handleDeletarGenero = async (id: number) => {
    if (confirm("ATENÇÃO: Excluir este gênero pode afetar as músicas associadas em cascata. Tem certeza?")) {
      await generoService.deletar(id);
      carregarDados();
    }
  };
  const handleDeletarAlbum = async (id: number) => {
    if (confirm("ATENÇÃO: Excluir este álbum excluirá em cascata todas as músicas associadas a ele. Tem certeza?")) {
      await albumService.deletar(id);
      carregarDados();
    }
  };

  // --- Handlers de Abertura de Edição ---
  const abrirEdicaoMusica = (m: any) => {
    setEditingId(m.id);
    setNovaMusica({
      title: m.title || m.titulo || "",
      artist: typeof m.artist === 'object' ? (m.artist?.nome || "") : (m.artist || m.artista?.nome || ""),
      album: typeof m.album === 'object' ? (m.album?.titulo || "") : (m.album || m.album?.titulo || ""),
      genre: typeof m.genre === 'object' ? (m.genre?.nome || "") : (m.genre || m.genero?.nome || ""),
      youtubeUrl: m.youtubeUrl || m.urlYoutube || "",
      durationSeconds: m.durationSeconds || m.duracaoSegundos || 0
    });
    setIsModalOpen(true);
  };

  const abrirEdicaoArtista = (a: Artista) => {
    setEditingId(a.id);
    setNovoArtista({ nome: a.nome, biografia: a.biografia || "", foto_url: a.foto_url || "" });
    setIsModalOpen(true);
  };

  const abrirEdicaoAlbum = (a: Album) => {
    setEditingId(a.id);
    setNovoAlbum({
      titulo: a.titulo,
      artistaId: a.artista?.id || a.artistaId || 0,
      ano_lancamento: a.ano_lancamento || new Date().getFullYear(),
      capa_url: a.capa_url || ""
    });
    setIsModalOpen(true);
  };

  const abrirEdicaoGenero = (g: Genero) => {
    setEditingId(g.id);
    setNovoGenero({ nome: g.nome });
    setIsModalOpen(true);
  };

  // --- Handlers de Salvar (Criar/Atualizar) ---
  const handleSalvarMusica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMusica.artist || !novaMusica.album || !novaMusica.genre) {
      return alert("Selecione um Artista, Álbum e Gênero válidos.");
    }
    try {
      if (editingId) await musicaService.atualizar(editingId, novaMusica);
      else await musicaService.criar(novaMusica);
      fecharModal();
      carregarDados();
    } catch (error) { alert("Erro ao salvar música."); }
  };

  const handleSalvarArtista = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await artistaService.atualizar(editingId, novoArtista);
      else await artistaService.criar(novoArtista);
      fecharModal();
      carregarDados();
    } catch (error) { alert("Erro ao salvar artista."); }
  };

  const handleSalvarGenero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await generoService.atualizar(editingId, novoGenero);
      else await generoService.criar(novoGenero);
      fecharModal();
      carregarDados();
    } catch (error) { alert("Erro ao salvar gênero."); }
  };

  const handleSalvarAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAlbum.artistaId) return alert("Selecione um artista.");
    try {
      if (editingId) await albumService.atualizar(editingId, novoAlbum);
      else await albumService.criar(novoAlbum);
      fecharModal();
      carregarDados();
    } catch (error) { alert("Erro ao salvar álbum."); }
  };

  if (!isAdmin) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8">
          <h1 className="text-3xl font-bold text-zinc-100">Área restrita</h1>
          <p className="text-zinc-400">Apenas administradores podem acessar esta seção.</p>
        </div>
    );
  }

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-red-500">Painel do Administrador</h1>
            <p className="text-zinc-400 mt-1">Gerencie o catálogo completo</p>
          </div>
          <button
              onClick={() => { setEditingId(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <Plus size={18} /> Adicionar {activeTab === "musicas" ? "Música" : activeTab === "artistas" ? "Artista" : activeTab === "generos" ? "Gênero" : "Álbum"}
          </button>
        </div>

        {erro && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-md flex items-center gap-3">
              <AlertCircle size={20} /> <p>{erro}</p>
            </div>
        )}

        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <TabButton icon={<Music size={16}/>} label="Músicas" isActive={activeTab === "musicas"} onClick={() => setActiveTab("musicas")} />
          <TabButton icon={<User size={16}/>} label="Artistas" isActive={activeTab === "artistas"} onClick={() => setActiveTab("artistas")} />
          <TabButton icon={<Disc size={16}/>} label="Álbuns" isActive={activeTab === "albuns"} onClick={() => setActiveTab("albuns")} />
          <TabButton icon={<Tags size={16}/>} label="Gêneros" isActive={activeTab === "generos"} onClick={() => setActiveTab("generos")} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden min-h-[400px]">
          {loading ? (
              <div className="flex justify-center items-center h-full p-8 text-zinc-500">Carregando dados...</div>
          ) : (
              <>
                {activeTab === "musicas" && (
                    <ListTable
                        headers={["Título", "Artista", "Álbum", "YouTube", "Ações"]}
                        gridCols="grid-cols-[2fr_1.5fr_1.5fr_2fr_100px]"
                        data={musicas}
                        renderRow={(m: any) => {
                          const titulo = m.title || m.titulo || "Sem título";
                          const artistaNome = typeof m.artist === 'object' ? (m.artist?.nome || m.artist?.name) : (m.artist || m.artista?.nome || m.artista || "Desconhecido");
                          const albumTitulo = typeof m.album === 'object' ? (m.album?.titulo || m.album?.title) : (m.album || m.album?.titulo || "Desconhecido");
                          const youtubeUrl = m.youtubeUrl || m.urlYoutube || "";

                          return (
                              <>
                                <span className="font-medium text-white truncate">{titulo}</span>
                                <span className="text-zinc-400 truncate">{artistaNome}</span>
                                <span className="text-zinc-400 truncate">{albumTitulo}</span>
                                <span className="text-zinc-500 flex items-center gap-2 truncate"><LinkIcon size={14} /> {youtubeUrl}</span>
                                <div className="flex justify-end gap-3">
                                  <EditButton onClick={() => abrirEdicaoMusica(m)} />
                                  <DeleteButton onClick={() => handleDeletarMusica(m.id)} />
                                </div>
                              </>
                          );
                        }}
                    />
                )}

                {activeTab === "artistas" && (
                    <ListTable headers={["ID", "Nome do Artista", "Ações"]} gridCols="grid-cols-[100px_1fr_100px]" data={artistas}
                               renderRow={(a) => (
                                   <>
                                     <span className="text-zinc-500">#{a.id}</span>
                                     <span className="font-medium text-white">{a.nome}</span>
                                     <div className="flex justify-end gap-3">
                                       <EditButton onClick={() => abrirEdicaoArtista(a)} />
                                       <DeleteButton onClick={() => handleDeletarArtista(a.id)} />
                                     </div>
                                   </>
                               )}
                    />
                )}

                {activeTab === "albuns" && (
                    <ListTable headers={["ID", "Título do Álbum", "Ações"]} gridCols="grid-cols-[100px_1fr_100px]" data={albuns}
                               renderRow={(a) => (
                                   <>
                                     <span className="text-zinc-500">#{a.id}</span>
                                     <span className="font-medium text-white">{a.titulo}</span>
                                     <div className="flex justify-end gap-3">
                                       <EditButton onClick={() => abrirEdicaoAlbum(a)} />
                                       <DeleteButton onClick={() => handleDeletarAlbum(a.id)} />
                                     </div>
                                   </>
                               )}
                    />
                )}

                {activeTab === "generos" && (
                    <ListTable headers={["ID", "Nome do Gênero", "Ações"]} gridCols="grid-cols-[100px_1fr_100px]" data={generos}
                               renderRow={(g) => (
                                   <>
                                     <span className="text-zinc-500">#{g.id}</span>
                                     <span className="font-medium text-white">{g.nome}</span>
                                     <div className="flex justify-end gap-3">
                                       <EditButton onClick={() => abrirEdicaoGenero(g)} />
                                       <DeleteButton onClick={() => handleDeletarGenero(g.id)} />
                                     </div>
                                   </>
                               )}
                    />
                )}
              </>
          )}
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? "Editar " : "Adicionar "}
                    {activeTab === "musicas" ? "Música" : activeTab === "artistas" ? "Artista" : activeTab === "generos" ? "Gênero" : "Álbum"}
                  </h2>
                  <button onClick={fecharModal} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                {activeTab === "musicas" && (
                    <form onSubmit={handleSalvarMusica} className="flex flex-col gap-4">
                      <FormInput label="Título da Música" value={novaMusica.title} onChange={(e) => setNovaMusica({ ...novaMusica, title: e.target.value })} />

                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Artista</label>
                        <select required value={novaMusica.artist} onChange={(e) => setNovaMusica({ ...novaMusica, artist: e.target.value })} className="form-select">
                          <option value="">Selecione um artista existente</option>
                          {artistas.map((a) => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-400">Álbum</label>
                          <select required value={novaMusica.album} onChange={(e) => setNovaMusica({ ...novaMusica, album: e.target.value })} className="form-select">
                            <option value="">Selecione...</option>
                            {albuns.map((a) => <option key={a.id} value={a.titulo}>{a.titulo}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-zinc-400">Gênero</label>
                          <select required value={novaMusica.genre} onChange={(e) => setNovaMusica({ ...novaMusica, genre: e.target.value })} className="form-select">
                            <option value="">Selecione...</option>
                            {generos.map((g) => <option key={g.id} value={g.nome}>{g.nome}</option>)}
                          </select>
                        </div>
                      </div>

                      <FormInput type="url" label="URL do YouTube" value={novaMusica.youtubeUrl} onChange={(e) => setNovaMusica({ ...novaMusica, youtubeUrl: e.target.value })} />
                      <FormInput type="number" label="Duração (segundos)" value={novaMusica.durationSeconds.toString()} onChange={(e) => setNovaMusica({ ...novaMusica, durationSeconds: Number(e.target.value) })} />
                      <ModalActions onCancel={fecharModal} />
                    </form>
                )}

                {activeTab === "artistas" && (
                    <form onSubmit={handleSalvarArtista} className="flex flex-col gap-4">
                      <FormInput label="Nome do Artista" value={novoArtista.nome} onChange={(e) => setNovoArtista({ ...novoArtista, nome: e.target.value })} />
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Biografia</label>
                        <textarea
                            required
                            value={novoArtista.biografia}
                            onChange={(e) => setNovoArtista({ ...novoArtista, biografia: e.target.value })}
                            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-red-500 min-h-[100px] resize-none"
                        />
                      </div>
                      <FormInput type="url" label="URL da Foto" value={novoArtista.foto_url} onChange={(e) => setNovoArtista({ ...novoArtista, foto_url: e.target.value })} />
                      <ModalActions onCancel={fecharModal} />
                    </form>
                )}

                {activeTab === "generos" && (
                    <form onSubmit={handleSalvarGenero} className="flex flex-col gap-4">
                      <FormInput label="Nome do Gênero" value={novoGenero.nome} onChange={(e) => setNovoGenero({ nome: e.target.value })} />
                      <ModalActions onCancel={fecharModal} />
                    </form>
                )}

                {activeTab === "albuns" && (
                    <form onSubmit={handleSalvarAlbum} className="flex flex-col gap-4">
                      <FormInput label="Título do Álbum" value={novoAlbum.titulo} onChange={(e) => setNovoAlbum({ ...novoAlbum, titulo: e.target.value })} />
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Artista do Álbum</label>
                        <select required value={novoAlbum.artistaId} onChange={(e) => setNovoAlbum({ ...novoAlbum, artistaId: Number(e.target.value) })} className="form-select">
                          <option value={0}>Selecione o Artista</option>
                          {artistas.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                        </select>
                      </div>
                      <FormInput type="number" label="Ano de Lançamento" value={novoAlbum.ano_lancamento.toString()} onChange={(e) => setNovoAlbum({ ...novoAlbum, ano_lancamento: Number(e.target.value) })} />
                      <FormInput type="url" label="URL da Capa" value={novoAlbum.capa_url} onChange={(e) => setNovoAlbum({ ...novoAlbum, capa_url: e.target.value })} />
                      <ModalActions onCancel={fecharModal} />
                    </form>
                )}
              </div>
            </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
        .form-select {
          border-radius: 0.375rem; border-width: 1px; border-color: #3f3f46; background-color: #09090b; padding: 0.5rem 0.75rem; color: white; outline: 2px solid transparent; outline-offset: 2px; width: 100%;
        }
        .form-select:focus { border-color: #ef4444; }
      `}} />
      </div>
  );
}

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            isActive ? "bg-zinc-900 text-white border-t border-x border-zinc-800" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
        }`}
    >
      {icon} {label}
    </button>
);

const FormInput = ({ label, type = "text", value, onChange }: { label: string, type?: string, value: string, onChange: (e: any) => void }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-400">{label}</label>
      <input required type={type} value={value} onChange={onChange} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-red-500" />
    </div>
);

const ModalActions = ({ onCancel }: { onCancel: () => void }) => (
    <div className="mt-4 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancelar</button>
      <button type="submit" className="rounded-md bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">Salvar</button>
    </div>
);

const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="text-zinc-400 hover:text-white transition-colors" title="Editar"><Edit2 size={18} /></button>
);

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="text-zinc-400 hover:text-red-500 transition-colors" title="Excluir"><Trash2 size={18} /></button>
);

const ListTable = ({ headers, gridCols, data, renderRow }: { headers: string[], gridCols: string, data: any[], renderRow: (item: any) => React.ReactNode }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
      <div className="flex flex-col">
        <div className={`grid ${gridCols} gap-4 px-6 py-4 bg-zinc-950/50 border-b border-zinc-800 text-sm font-semibold text-zinc-400`}>
          {headers.map((h, i) => <span key={i} className={i === headers.length - 1 ? "text-right" : ""}>{h}</span>)}
        </div>
        {safeData.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">Nenhum registro encontrado.</div>
        ) : (
            safeData.map((item, idx) => (
                <div key={item.id || idx} className={`grid ${gridCols} gap-4 px-6 py-4 items-center border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm`}>
                  {renderRow(item)}
                </div>
            ))
        )}
      </div>
  );
};