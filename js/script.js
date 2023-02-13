// Variávies globais referentes à lista de sonhos, o modo da tela (escuro/claro) e a imagens que serão carregada.

let tarefas = [];
var modoTelaAtual = 'darkMode';
var imagem_base64 = '';
var ordem_sonhos = 'L';


onload = () => {

  // Gera um número randômico para adicionar um gif 'aleatório' à tela quando a lista de senhos estiver.
 
  document.getElementById("ImgGif").src= "imgs/sleepGif/"+String(randomIntFromInterval(2,6))+'.gif';
  const t = JSON.parse(localStorage.getItem('tarefas'));
  if (t) tarefas = t;
  
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

  document.querySelector('#btnInc').onclick = () => {adicionaSonho();}
  document.querySelector('#btnAlt').onclick = () => {alteraSonho();}
  document.querySelector('#btnDel').onclick = () => {apagaSonho();} 
  document.querySelector('#btnModoTela').onclick = () => {atualizaVariavelModoTela();} 
  document.querySelector('#btnFilter').onclick = () => {filter(); mostraSonhos();} 

};

function filter(){
  if(ordem_sonhos == 'L') {tarefas.sort(function(a,b){return new Date(a.data) - new Date(b.data)}); ordem_sonhos='H';}
  else{tarefas.sort(function(a,b){return new Date(b.data) - new Date(a.data)}); ordem_sonhos='L';}
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
    tarefas.push({
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
  let idTarefa = document.querySelector('#inputAlteraSonho').getAttribute('data-id');
  let i = tarefas.findIndex((t) => t.id == idTarefa);

  tarefas[i].titulo = document.getElementById("InputAlteraTitulo").value;
  tarefas[i].descricao = document.getElementById("inputAlteraDescricao").value;
  tarefas[i].data = document.getElementById("inputAlteraData").value;
  if(imagem_base64 != ''){tarefas[i].enderecoImagem = imagem_base64;}

  campo.value = '';
  campo.removeAttribute('data-id');

  ativa('tela1');
  salvaSonhos();
  mostraSonhos();
};

const apagaSonho = () => {
  let campo = document.querySelector('#inputAlteraSonho');
  let idTarefa = campo.getAttribute('data-id');
  tarefas = tarefas.filter((t) => t.id != idTarefa);
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
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

const mostraSonhos = () => {
  const listaDeTarefas = document.querySelector('#listaSonhos');
  listaDeTarefas.innerHTML = '';
    
  tarefas.forEach((t) => {
    let elemSonho = document.createElement('div');
    elemSonho.id=t.id;
    elemSonho.setAttribute('data-id', t.id);
    elemSonho.className="divSonho";
    listaSonhos.appendChild(elemSonho);
    
    var img = document.createElement('img');
    img.style.backgroundImage =  `url(data:image/png;base64,${t.enderecoImagem})`;
    img.id="imgSonho";
    elemSonho.appendChild(img);
    
    var infoArea = document.createElement('div');
    infoArea.id = "infoArea";
    elemSonho.appendChild(infoArea);
    
    var label = document.createElement('p');
    label.id="titulo";
    label.className="titulo";
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

    campo.focus();}
    
    label.appendChild(editorSonho);
    
    img.onclick = () => {
      ativa('tela4');
      document.getElementById("sonhoClicked").textContent = t.titulo;
      document.getElementById("imagemSonhoClicked").style.backgroundImage = `url(data:image/png;base64,${t.enderecoImagem})`;
      document.getElementById("textSonho").textContent=t.descricao;
      document.getElementById("dataSonhoClicked").textContent=t.data;
    };
    listaDeTarefas.appendChild(elemSonho);
    
  });
  
  document.querySelector('#estado').innerText = tarefas.length;
  if (tarefas.length > 0) {listaDeTarefas.classList.remove('hidden');
  document.querySelector('#blank').classList.add('hidden');} 
  
  else {
    listaDeTarefas.classList.add('hidden');
    document.querySelector('#blank').classList.remove('hidden');
  } modoTela();};
  
  function randomIntFromInterval(min, max) {return Math.floor(Math.random() * (max - min + 1) + min)}




function blackBackgroundColor(elem){elem.style.backgroundColor="black";}
function whiteBackgroundColor(elem){elem.style.backgroundColor="white";}

function blackFontColor(elem){elem.style="black";}
function whiteFontColor(elem){elem.style="white";}



function backgroundColorToBlack(elem){ for(var i = 0; i < 4; i++) {blackBackgroundColor(elem[i]);}}
function backgroundColorToWhite(elem){ for(var i = 0; i < 4; i++) {whiteBackgroundColor(elem[i]);}}

function fontColorToBlack(elem){ for(var i = 0; i < 4; i++) {elem[i].style.color='black';}}
function fontColorToWhite(elem){ for(var i = 0; i < 4; i++) {elem[i].style.color='white';}}


function darkMode(){
  document.body.style.backgroundColor='black';
  document.querySelectorAll('p').forEach(e => e.style.color = "white");
  
  var btns = document.getElementsByClassName('btnEditarSonho');
  for(var i = 0; i < btns.length; i++) {btns[i].style.backgroundImage = "url(imgs/edit_white.png)"}
  
  backgroundColorToBlack(document.getElementsByClassName("componentHeader"));
  fontColorToWhite(document.getElementsByClassName("componentTitle"));

}



function lightMode(){
  document.body.style.backgroundColor='white';
  document.querySelectorAll('p').forEach(e => e.style.color = "black");

  var btns = document.getElementsByClassName('btnEditarSonho');
  for(var i = 0; i < btns.length; i++) {btns[i].style.backgroundImage = "url(imgs/edit.png)"}


  backgroundColorToWhite(document.getElementsByClassName("componentHeader"));
  fontColorToBlack(document.getElementsByClassName("componentTitle"));
}

function atualizaVariavelModoTela(){
  if(modoTelaAtual == 'lightMode'){
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

function imgToBase64(id){
  document.getElementById(id).addEventListener('change', (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      imagem_base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
    }; reader.readAsDataURL(file);
})}





imgToBase64("file");
imgToBase64("file2");





function modoTela(){
  if(modoTelaAtual == 'lightMode'){
    lightMode();
    document.getElementById("modoTelaIcon").src = 'imgs/darkMode.png';
  }
  else {
    darkMode();
    document.getElementById("modoTelaIcon").src = 'imgs/lightMode.png';

  }

}