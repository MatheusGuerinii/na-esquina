import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gvkanntuocgmdcuyhwkp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a2FubnR1b2NnbWRjdXlod2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjIyMzcsImV4cCI6MjA2Njg5ODIzN30.csTHHao5dCabyB9kAs9D84UsT1PDgUGOV2MQ7hHPxT4'; // substitua pela sua chave
const supabase = createClient(supabaseUrl, supabaseKey);
const listaProdutos = document.getElementById("lista-produtos");
const searchInput = document.getElementById("search");
async function carregarProdutos() {
  const { data, error } = await supabase.from("produtos").select("*");
  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return;
  }
  exibirProdutos(data);
}
function exibirProdutos(lista) {
  listaProdutos.innerHTML = "";
  lista.forEach(prod => {
    const card = `<div class="card-produto">
      <h3>${prod.nome}</h3>
      <p><strong>Endereço:</strong> ${prod.endereco}</p>
      <p><strong>Categoria:</strong> ${prod.categoria}</p>
    </div>`;
    listaProdutos.innerHTML += card;
  });
}
async function filtrarCategoria(categoria) {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("categoria", categoria);

  if (error) {
    console.error("Erro ao filtrar:", error.message);
    return;
  }
  exibirProdutos(data);
}
searchInput.addEventListener("input", async () => {
  const termo = searchInput.value.toLowerCase();
  const { data, error } = await supabase.from("produtos").select("*");
  if (error) return;

  const filtrados = data.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.endereco.toLowerCase().includes(termo) ||
    p.categoria.toLowerCase().includes(termo)
  );
  exibirProdutos(filtrados);
});
function abrirCadastro() {
  document.getElementById('modalCadastro').style.display = 'flex';
}
function fecharCadastro() {
  document.getElementById('modalCadastro').style.display = 'none';
}
async function enviarCadastro() {
  const nome = document.getElementById('nomeLoja').value.trim();
  const endereco = document.getElementById('enderecoLoja').value.trim();
  const categoria = document.getElementById('categoriaLoja').value;

  if (nome && endereco && categoria) {
    const { error } = await supabase.from("produtos").insert([
      {
        nome: nome,
        endereco: endereco,
        categoria: categoria,
        preco: "--"
      }
    ]);
    if (error) {
      alert("Erro ao cadastrar loja: " + error.message);
    } else {
      alert("Loja cadastrada com sucesso!");
      fecharCadastro();
      carregarProdutos();
    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}
window.abrirCadastro = abrirCadastro;
window.fecharCadastro = fecharCadastro;
window.enviarCadastro = enviarCadastro;
window.filtrarCategoria = filtrarCategoria;
carregarProdutos();