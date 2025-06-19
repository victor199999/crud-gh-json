let usuarios = [];
let sha = '';

const cargarUsuarios = async () => {
  const res = await fetch('/api/usuarios');
  const data = await res.json();
  usuarios = data.usuarios;
  sha = data.sha;
  renderizarUsuarios();
};

const guardarUsuarios = async () => {
  await fetch('/api/usuarios', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarios, sha })
  });
  cargarUsuarios();
};

const crearUsuario = () => {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  if (!nombre || !email) return alert('Completa todos los campos');
  usuarios.push({ id: Date.now(), nombre, email });
  guardarUsuarios();
};

const eliminarUsuario = (id) => {
  usuarios = usuarios.filter(u => u.id !== id);
  guardarUsuarios();
};

const renderizarUsuarios = () => {
  const lista = document.getElementById('listaUsuarios');
  lista.innerHTML = '';
  usuarios.forEach(u => {
    const li = document.createElement('li');
    li.innerHTML = `${u.nombre} (${u.email}) <button onclick="eliminarUsuario(${u.id})">Eliminar</button>`;
    lista.appendChild(li);
  });
};

window.onload = cargarUsuarios;
