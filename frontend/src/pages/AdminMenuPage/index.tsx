import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/Modal';
import { getCardapios, createCardapio, updateCardapio, deleteCardapio, API_BASE_URL } from '../../utils';
import { PlusCircle } from 'lucide-react';


type Cardapio = {
  id: number;
  nome: string;
  restaurante_id: number;
};

export default function AdminMenuPage() {
  const [cardapios, setCardapios] = useState<Cardapio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newPdf, setNewPdf] = useState<File|null>(null);
  const [uploadError, setUploadError] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editPdf, setEditPdf] = useState<File|null>(null);
  const [editId, setEditId] = useState<number|null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editError, setEditError] = useState<string|null>(null);

  useEffect(() => {
    async function fetchCardapios() {
      try {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        const data = await getCardapios();
        const filtrados = Array.isArray(data) ? data.filter((c: any) => c.restaurante_id === restaurante_id) : [];
        setCardapios(filtrados);
      } catch (err) {
        // Tratar erro se necessário
      }
    }
    fetchCardapios();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cardápios</h2>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold"
          onClick={() => {
            setNewNome('');
            setNewPdf(null);
            setUploadError(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircle size={20} />
          Adicionar Novo Cardápio
        </button>
      </div>
      {/* Modal de criação de cardápio */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setUploadError(null);
            if (!newNome || !newPdf) {
              setUploadError('Preencha o nome e selecione um PDF.');
              return;
            }
            // Simulação de upload: normalmente você faria upload para o backend ou storage
            // Aqui vamos supor que o backend aceita multipart/form-data em /cardapio/upload
            try {
              const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
              const restaurante_id = usuarioLogado.restaurante_id;
              const formData = new FormData();
              formData.append('file', newPdf);
              formData.append('nome', newNome);
              formData.append('restaurante_id', restaurante_id);
              const resp = await fetch(`${API_BASE_URL}/cardapio`, {
                method: 'POST',
                body: formData
              });
              if (!resp.ok) {
                throw new Error('Erro ao criar cardápio');
              }
              const novo = await resp.json();
              setCardapios([...cardapios, novo]);
              setIsModalOpen(false);
            } catch (err: any) {
              setUploadError(err.message || 'Erro ao criar cardápio');
            }
          }}
        >
          <h2 className="text-xl font-bold mb-2">Novo Cardápio</h2>
          <label className="block text-sm font-medium">Nome do Cardápio</label>
          <input
            type="text"
            className="border rounded-md p-2 mb-2"
            value={newNome}
            onChange={e => setNewNome(e.target.value)}
            required
          />
          <label className="block text-sm font-medium">PDF do Cardápio</label>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={e => setNewPdf(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            className="mb-2"
            required
          />
          {uploadError && <div className="text-red-600 text-sm mb-2">{uploadError}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">Salvar</button>
          </div>
        </form>
      </Modal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardapios.map((cardapio) => (
          <div key={cardapio.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col items-center">
            <div className="w-full flex justify-center bg-gray-100" style={{height: '220px'}}>
              <object
                data={`${API_BASE_URL}/cardapio/${cardapio.id}/pdf`}
                type="application/pdf"
                width="100%"
                height="220px"
                aria-label={cardapio.nome}
              >
                <span>PDF não suportado</span>
              </object>
            </div>
            <div className="p-4 w-full flex flex-col items-center">
              <h3 className="font-bold text-lg text-center">{cardapio.nome}</h3>
              <div className="flex gap-2 mt-4 w-full">
                <button
                  className="flex-1 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setEditId(cardapio.id);
                    setEditNome(cardapio.nome);
                    setEditPdf(null);
                    setEditError(null);
                    setEditModalOpen(true);
                  }}
                >Editar</button>
                <button
                  className="flex-1 py-2 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                  onClick={() => {
                    window.open(`${API_BASE_URL}/cardapio/${cardapio.id}/pdf`, '_blank');
                  }}
                >Visualizar</button>
                <button
                  className="flex-1 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                  onClick={async () => {
                    await deleteCardapio(cardapio.id);
                    setCardapios(cardapios.filter(c => c.id !== cardapio.id));
                  }}
                >Excluir</button>
              </div>
            </div>
          </div>
        ))}

      {/* Modal de edição de cardápio */}
      <Modal isOpen={editModalOpen} onClose={async () => {
        setEditModalOpen(false);
        // Atualiza a lista ao fechar o modal de edição
        try {
          const data = await getCardapios();
          setCardapios(data);
        } catch {}
      }}>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setEditError(null);
            if (!editNome) {
              setEditError('Preencha o nome do cardápio.');
              return;
            }
            try {
              if (editId == null) return;
              const updated = await updateCardapio(editId, { nome: editNome, file: editPdf || undefined });
              setCardapios(cardapios.map(c => c.id === editId ? { ...c, nome: updated.nome } : c));
              setEditModalOpen(false);
              // Atualiza a lista após editar
              try {
                const data = await getCardapios();
                setCardapios(data);
              } catch {}
            } catch (err: any) {
              setEditError(err.message || 'Erro ao editar cardápio');
            }
          }}
        >
          <h2 className="text-xl font-bold mb-2">Editar Cardápio</h2>
          <label className="block text-sm font-medium">Nome do Cardápio</label>
          <input
            type="text"
            className="border rounded-md p-2 mb-2"
            value={editNome}
            onChange={e => setEditNome(e.target.value)}
            required
          />
          <label className="block text-sm font-medium">Novo PDF (opcional)</label>
          <input
            type="file"
            accept="application/pdf"
            ref={editFileInputRef}
            onChange={e => setEditPdf(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            className="mb-2"
          />
          {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={() => setEditModalOpen(false)}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">Salvar</button>
          </div>
        </form>
      </Modal>
      </div>
    </div>
  );
}