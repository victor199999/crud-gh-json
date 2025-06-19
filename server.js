import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
  GITHUB_BRANCH,
  FILE_PATH
} = process.env;

// 🔁 Leer archivo JSON desde GitHub
app.get('/api/usuarios', async (req, res) => {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    const usuarios = JSON.parse(Buffer.from(data.content, 'base64').toString());
    res.json({ usuarios, sha: data.sha });
  } catch (err) {
    res.status(500).json({ error: 'Error al leer desde GitHub', detail: err.message });
  }
});

// 📝 Guardar archivo actualizado en GitHub
app.put('/api/usuarios', async (req, res) => {
  const { usuarios, sha } = req.body;
  const nuevoContenido = Buffer.from(JSON.stringify(usuarios, null, 2)).toString('base64');

  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Actualizar usuarios desde CRUD',
        content: nuevoContenido,
        branch: GITHUB_BRANCH,
        sha
      })
    });

    const data = await response.json();
    res.json({ ok: true, commit: data.commit });
  } catch (err) {
    res.status(500).json({ error: 'Error al escribir en GitHub', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
