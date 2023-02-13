// Variávies globais referentes à lista de sonhos, o modo da tela (escuro/claro) e a imagens que serão carregada.

let sonhos = [];
var modoTelaAtual = 'darkMode';
var imagem_base64 = '';
var ordem_sonhos = 'H';


onload = () => {

  // Gera um número randômico para adicionar um gif 'aleatório' à tela quando a lista de senhos estiver.

  document.getElementById("ImgGif").src = "imgs/sleepGif/" + String(randomIntFromInterval(2, 6)) + '.gif';
  const t = JSON.parse(localStorage.getItem('sonhos'));
  if (t) sonhos = t;

  mostraSonhos();


  document.querySelector('#inputNovoSonho').oninput = monitoraCampoAdic;
  document.querySelector('#inputAlteraSonho').oninput = monitoraCampoAlt;

  document.querySelector('#btnAdic').onclick = () => {
    document.querySelector('#btnInc').disabled = true;
    document.querySelector('#inputNovoSonho').value = '';
    document.querySelector('#dataSonho').value = '';
    document.querySelector('#descricaoSonho').value = '';
    document.querySelector('#file').value = '';
    document.querySelector('#inputNovoSonho').focus();
    ativa('tela2');
  };

  document.querySelector('#btnCanc1').onclick = () => {
    document.querySelector('#inputNovoSonho').value = '';
    ativa('tela1');
  };

  document.querySelector('#btnCanc2').onclick = () => {
    let campo = document.querySelector('#inputAlteraSonho');
    campo.value = '';
    campo.removeAttribute('data-id');
    ativa('tela1');
  };

  document.querySelector('#btnInc').onclick = () => { adicionaSonho(); }
  document.querySelector('#btnAlt').onclick = () => { alteraSonho(); }
  document.querySelector('#btnDel').onclick = () => { apagaSonho(); }
  document.querySelector('#btnModoTela').onclick = () => { atualizaVariavelModoTela(); }
  document.querySelector('#btnFilter').onclick = () => { filter(); mostraSonhos(); }

};

function filter() {
  if (ordem_sonhos == 'L') { sonhos.sort(function(a, b) { return new Date(a.data) - new Date(b.data) }); ordem_sonhos = 'H'; }
  else { sonhos.sort(function(a, b) { return new Date(b.data) - new Date(a.data) }); ordem_sonhos = 'L'; }
}


const ativa = (comp) => {
  let listaDeTelas = document.querySelectorAll('body > .component');
  listaDeTelas.forEach((c) => c.classList.add('hidden'));
  document.querySelector('#' + comp).classList.remove('hidden');
};

const adicionaSonho = () => {
  let titulo = document.querySelector('#inputNovoSonho').value;
  let descricao = document.getElementById('descricaoSonho').value;
  let data = document.getElementById('dataSonho').value;
  let enderecoImagem = imagem_base64;

  if (titulo != '') {
    sonhos.push({
      id: Math.random().toString().replace('0.', ''),
      titulo: titulo,
      descricao: descricao,
      data: data,
      enderecoImagem: enderecoImagem
    });
    ativa('tela1');
    salvaSonhos();

    mostraSonhos();
  }
};

const monitoraCampoAdic = (e) => {
  let botao = document.querySelector('#btnInc');
  if (e.target.value.length > 0) botao.disabled = false;
  else botao.disabled = true;
};

const alteraSonho = () => {
  let campo = document.querySelector('#inputAlteraSonho');
  let idSonho = document.querySelector('#inputAlteraSonho').getAttribute('data-id');
  let i = sonhos.findIndex((t) => t.id == idSonho);

  sonhos[i].titulo = document.getElementById("InputAlteraTitulo").value;
  sonhos[i].descricao = document.getElementById("inputAlteraDescricao").value;
  sonhos[i].data = document.getElementById("inputAlteraData").value;
  if (imagem_base64 != '') { sonhos[i].enderecoImagem = imagem_base64; }

  campo.value = '';
  campo.removeAttribute('data-id');

  ativa('tela1');
  salvaSonhos();
  mostraSonhos();
};

const apagaSonho = () => {
  let campo = document.querySelector('#inputAlteraSonho');
  let idSonho = campo.getAttribute('data-id');
  sonhos = sonhos.filter((t) => t.id != idSonho);
  campo.value = '';
  campo.removeAttribute('data-id');
  ativa('tela1');
  salvaSonhos();

  mostraSonhos();

};

const monitoraCampoAlt = (e) => {
  let botao = document.querySelector('#btnAlt');
  if (e.target.value.length > 0) botao.disabled = false;
  else botao.disabled = true;
};

const salvaSonhos = () => {
  localStorage.setItem('sonhos', JSON.stringify(sonhos));
};

const mostraSonhos = () => {
  const listaDesonhos = document.querySelector('#listaSonhos');
  listaDesonhos.innerHTML = '';

  sonhos.forEach((t) => {
    let elemSonho = document.createElement('div');
    elemSonho.id = t.id;
    elemSonho.setAttribute('data-id', t.id);
    elemSonho.className = "divSonho";
    listaSonhos.appendChild(elemSonho);

    var img = document.createElement('div');
    img.style.backgroundImage = `url(data:image/png;base64,${t.enderecoImagem})`;
    img.id = "imgSonho";
    elemSonho.appendChild(img);

    var infoArea = document.createElement('div');
    infoArea.id = "infoArea";
    elemSonho.appendChild(infoArea);

    var label = document.createElement('p');
    label.id = "titulo";
    label.className = "titulo";
    label.textContent = t.titulo + ' : ' + t.data;
    infoArea.appendChild(label);

    let editorSonho = document.createElement('button');
    editorSonho.className = "btnEditarSonho";

    editorSonho.onclick = () => {

      let campo = document.querySelector('#inputAlteraSonho');
      ativa('tela3');
      campo.value = t.titulo;
      campo.setAttribute('data-id', t.id);

      document.getElementById("InputAlteraTitulo").value = t.titulo;
      document.getElementById("inputAlteraData").value = t.data;
      document.getElementById("inputAlteraDescricao").value = t.descricao;
      document.getElementById("file2").value = '';

      campo.focus();
    }

    label.appendChild(editorSonho);

    img.onclick = () => {
      ativa('tela4');
      document.getElementById("sonhoClicked").textContent = t.titulo;
      document.getElementById("imagemSonhoClicked").style.backgroundImage = `url(data:image/png;base64,${t.enderecoImagem})`;
      document.getElementById("textSonho").textContent = t.descricao;
      document.getElementById("dataSonhoClicked").textContent = t.data;
    };
    listaDesonhos.appendChild(elemSonho);

  });

  document.querySelector('#estado').innerText = sonhos.length;
  if (sonhos.length > 0) {
    listaDesonhos.classList.remove('hidden');
    document.querySelector('#blank').classList.add('hidden');
  }

  else {
    listaDesonhos.classList.add('hidden');
    document.querySelector('#blank').classList.remove('hidden');
  } modoTela();
};

function randomIntFromInterval(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }




function blackBackgroundColor(elem) { elem.style.backgroundColor = "black"; }
function whiteBackgroundColor(elem) { elem.style.backgroundColor = "white"; }

function blackFontColor(elem) { elem.style = "black"; }
function whiteFontColor(elem) { elem.style = "white"; }



function backgroundColorToBlack(elem) { for (var i = 0; i < elem.length; i++) { blackBackgroundColor(elem[i]); } }
function backgroundColorToWhite(elem) { for (var i = 0; i < elem.length; i++) { whiteBackgroundColor(elem[i]); } }

function fontColorToBlack(elem) { for (var i = 0; i < elem.length; i++) { elem[i].style.color = 'black'; } }
function fontColorToWhite(elem) { for (var i = 0; i < elem.length; i++) { elem[i].style.color = 'white'; } }


function darkMode() {
  document.body.style.backgroundColor = 'black';
  document.querySelectorAll('p').forEach(e => e.style.color = "white");

  var btns = document.getElementsByClassName('btnEditarSonho');
  for (var i = 0; i < btns.length; i++) { btns[i].style.backgroundImage = "url(imgs/edit_white.png)" }

  backgroundColorToBlack(document.getElementsByClassName("componentHeader"));
  fontColorToWhite(document.getElementsByClassName("componentTitle"));
}

function lightMode() {
  document.body.style.backgroundColor = 'white';
  document.querySelectorAll('p').forEach(e => e.style.color = "black");

  var btns = document.getElementsByClassName('btnEditarSonho');
  for (var i = 0; i < btns.length; i++) { btns[i].style.backgroundImage = "url(imgs/edit.png)" }

  backgroundColorToWhite(document.getElementsByClassName("componentHeader"));
  fontColorToBlack(document.getElementsByClassName("componentTitle"));
}

function atualizaVariavelModoTela() {
  if (modoTelaAtual == 'lightMode') {
    modoTelaAtual = 'darkMode';
    document.getElementById("modoTelaIcon").src = 'imgs/lightMode.png';
    darkMode();
  }
  else {
    document.getElementById("modoTelaIcon").src = 'imgs/darkMode.png';
    modoTelaAtual = 'lightMode';
    lightMode();
  }
}

function imgToBase64(id) {
  document.getElementById(id).addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      imagem_base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
    }; reader.readAsDataURL(file);
  })
}

imgToBase64("file");
imgToBase64("file2");

function modoTela() {
  if (modoTelaAtual == 'lightMode') {
    lightMode();
    document.getElementById("modoTelaIcon").src = 'imgs/darkMode.png';
  }
  else {
    darkMode();
    document.getElementById("modoTelaIcon").src = 'imgs/lightMode.png';

  }
}

function openForm() {
  var form = document.getElementById("myForm");
  if (form.style.display == 'block') { form.style.display = "none"; }
  else { form.style.display = "block"; document.getElementById("colorPicked1").scrollIntoView(); }
}

function corBarra() {
  var header = document.getElementById("headerBar");
  header.style.backgroundImage = '';
  header.style.backgroundColor = document.getElementById("colorPicked2").value; modoTela = '';
}

function corFundo() {
  document.body.style.backgroundColor = document.getElementById("colorPicked1").value;
  var barras = document.getElementsByClassName("componentHeader");
  for (var i = 0; i < barras.length; i++) { barras[i].style.backgroundColor = document.getElementById("colorPicked1").value; modoTela = ''; }
}



document.getElementById("headerBar").style.backgroundImage = "linear-gradient(to right top, #913a4b, #904c78, #7e659c, #607db0, #4a91b5)";


navigator.serviceWorker.register('../sw.js');
