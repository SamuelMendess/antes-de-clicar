const apresentacao = document.querySelector('#tv');
const casos = [...document.querySelectorAll('[data-caso]')];
const quadro = document.querySelector('#caso-tv');
const posicao = document.querySelector('#caso-posicao');
const anterior = document.querySelector('#caso-anterior');
const seguinte = document.querySelector('#caso-seguinte');
let indice = 0;

function mostrarCaso(novoIndice) {
  indice = novoIndice;
  const copia = casos[indice].cloneNode(true);
  copia.removeAttribute('data-caso');
  copia.querySelector('details').open = false;

  const titulo = copia.querySelector('h3');
  titulo.tabIndex = -1;
  quadro.replaceChildren(copia);
  anterior.disabled = indice === 0;
  seguinte.disabled = indice === casos.length - 1;
  posicao.textContent = `Caso ${indice + 1} de ${casos.length}`;
  return titulo;
}

if (typeof apresentacao.showModal === 'function') {
  for (const botao of document.querySelectorAll('[data-modo-tv]')) {
    botao.hidden = false;
    botao.addEventListener('click', () => {
      const titulo = mostrarCaso(0);
      apresentacao.showModal();
      titulo.focus();
    });
  }

  anterior.addEventListener('click', () => mostrarCaso(indice - 1).focus());
  seguinte.addEventListener('click', () => mostrarCaso(indice + 1).focus());
  document.querySelector('#sair-tv').addEventListener('click', () => apresentacao.close());
}

const galeria = document.querySelector('#galeria');
const seletor = document.querySelector('#fotos');
const grade = document.querySelector('#fotos-grade');
const aviso = document.querySelector('#fotos-status');
const limpar = document.querySelector('#limpar-fotos');
const tiposDeFoto = ['image/jpeg', 'image/png', 'image/webp'];
const enderecos = [];

function removerFotos() {
  grade.replaceChildren();
  for (const endereco of enderecos) {
    URL.revokeObjectURL(endereco);
  }
  enderecos.length = 0;
  limpar.hidden = true;
}

seletor.addEventListener('change', () => {
  const fotos = [...seletor.files];
  if (!fotos.length) return;

  if (fotos.length > 3 || fotos.some(foto => !tiposDeFoto.includes(foto.type))) {
    aviso.textContent = 'Escolha até três fotos em JPEG, PNG ou WebP.';
    seletor.value = '';
    return;
  }

  removerFotos();
  for (const [indiceFoto, foto] of fotos.entries()) {
    const endereco = URL.createObjectURL(foto);
    const imagem = document.createElement('img');
    enderecos.push(endereco);
    imagem.alt = `Foto ${indiceFoto + 1} selecionada para a galeria do encontro`;
    imagem.addEventListener('error', () => {
      aviso.textContent = 'Uma das fotos não abriu. Tente selecionar outra imagem.';
      imagem.remove();
    }, { once: true });
    imagem.src = endereco;
    grade.append(imagem);
  }
  aviso.textContent = fotos.length === 1 ? '1 foto selecionada.' : `${fotos.length} fotos selecionadas.`;
  limpar.hidden = false;
});

limpar.addEventListener('click', () => {
  removerFotos();
  seletor.value = '';
  aviso.textContent = 'Galeria limpa.';
  seletor.focus();
});

galeria.hidden = false;
