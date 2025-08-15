import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modal';

export default function RestaurantePerfilModal({ isOpen, onClose, restaurante, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  restaurante: any;
  onSave: (data: FormData) => void;
}) {
  const [nome, setNome] = useState(restaurante?.nome || '');
  const [endereco, setEndereco] = useState(restaurante?.endereco || '');
  const [telefone, setTelefone] = useState(restaurante?.telefone || '');
  const [tipoCozinha, setTipoCozinha] = useState(restaurante?.tipo_cozinha || '');
  const [imagem, setImagem] = useState<File|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNome(restaurante?.nome || '');
    setEndereco(restaurante?.endereco || '');
    setTelefone(restaurante?.telefone || '');
    setTipoCozinha(restaurante?.tipo_cozinha || '');
    setImagem(null);
  }, [restaurante, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('endereco', endereco);
        formData.append('telefone', telefone);
        formData.append('tipo_cozinha', tipoCozinha);
        if (imagem) formData.append('imagem', imagem);
        onSave(formData);
      }}>
        <h2 className="text-xl font-bold mb-2">Perfil do Restaurante</h2>
        <label className="block text-sm font-medium">Nome</label>
        <input type="text" className="border rounded-md p-2 mb-2" value={nome} onChange={e => setNome(e.target.value)} required />
        <label className="block text-sm font-medium">Endereço</label>
        <input type="text" className="border rounded-md p-2 mb-2" value={endereco} onChange={e => setEndereco(e.target.value)} required />
        <label className="block text-sm font-medium">Telefone</label>
        <input type="text" className="border rounded-md p-2 mb-2" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <label className="block text-sm font-medium">Tipo de Cozinha</label>
        <input type="text" className="border rounded-md p-2 mb-2" value={tipoCozinha} onChange={e => setTipoCozinha(e.target.value)} required />
        <label className="block text-sm font-medium">Imagem do Restaurante</label>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setImagem(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className="mb-2" />
        <div className="flex gap-2 justify-end">
          <button type="button" className="px-4 py-2 border rounded-md" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
