const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

async function buscarPokemon() {
  const input = document.getElementById('input').value.trim().toLowerCase();
  if (!input) return;

  const card = document.getElementById('card');
  const erro = document.getElementById('erro');

  card.classList.remove('visivel');
  erro.textContent = '';
  erro.classList.remove('visivel');

  try {
    const resposta = await fetch(`${BASE_URL}/${input}`);

    if (!resposta.ok) {
      throw new Error('Pokémon não encontrado.');
    }

    const dados = await resposta.json();

    document.getElementById('imagem').src = dados.sprites.other['official-artwork'].front_default;
    document.getElementById('numero').textContent = `#${String(dados.id).padStart(3, '0')}`;
    document.getElementById('nome').textContent = dados.name;

    document.getElementById('tipos').innerHTML = dados.types
      .map(t => `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`)
      .join('');

    document.getElementById('stats').innerHTML = dados.stats
      .map(s => {
        const pct = Math.round((s.base_stat / 255) * 100);
        return `
          <div class="stat">
            <span class="stat-label">${s.stat.name.replace('special-', 'sp.')}</span>
            <div class="stat-barra-fundo">
              <div class="stat-barra" style="width: ${pct}%"></div>
            </div>
            <span class="stat-valor">${s.base_stat}</span>
          </div>`;
      })
      .join('');

    card.classList.add('visivel');
n
  } catch (err) {
    erro.textContent = err.message;
    erro.classList.add('visivel');
  }
}

document.getElementById('input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarPokemon();
});
