import Main from "../../components/Main";


function Homescreen() {
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  } catch {}
  return (
    <div>
      {usuario && (
        <div className="p-4 text-lg font-semibold text-green-700">Bem-vindo, {usuario.nome || usuario.email}!</div>
      )}
      <Main />
    </div>
  );
}

export default Homescreen;