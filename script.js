const statMap = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD'
};

function setStatus(state, msg) {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusTxt');
  dot.className = 'status-dot' + (state ? ' ' + state : '');
  txt.textContent = msg;
}

function showErro(msg) {
  const el = document.getElementById('erro');
  el.textContent = msg;
  el.classList.add('visivel');
  document.getElementById('card').classList.remove('visivel');
}

function hideErro() {
  document.getElementById('erro').classList.remove('visivel');
}

function buscarPor(nome) {
  document.getElementById('input').value = nome;
  buscarPokemon();
}

async function buscarPokemon() {
  const q = document.getElementById('input').value.trim().toLowerCase();
  if (!q) return;

  hideErro();
  setStatus('loading', 'buscando...');

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
    if (!res.ok) throw new Error('not found');
    const d = await res.json();

    document.getElementById('numero').textContent = `#${String(d.id).padStart(4, '0')}`;
    document.getElementById('nome').textContent = d.name;

    const imgUrl =
      d.sprites.other?.['official-artwork']?.front_default ||
      d.sprites.front_default;
    const img = document.getElementById('imagem');
    img.src = imgUrl;
    img.alt = d.name;

    document.getElementById('tipos').innerHTML = d.types
      .map(t => `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`)
      .join('');

    document.getElementById('stats').innerHTML = d.stats
      .map(s => {
        const label = statMap[s.stat.name] || s.stat.name;
        const pct = Math.min(100, Math.round(s.base_stat / 255 * 100));
        return `
          <div class="stat">
            <span class="stat-label">${label}</span>
            <div class="stat-barra-fundo">
              <div class="stat-barra" style="width:0%" data-w="${pct}%"></div>
            </div>
            <span class="stat-valor">${s.base_stat}</span>
          </div>`;
      })
      .join('');

    const h = (d.height / 10).toFixed(1);
    const w = (d.weight / 10).toFixed(1);
    document.getElementById('quick').innerHTML = `
      <div class="quick-card">
        <div class="quick-label">Altura</div>
        <div class="quick-val">${h} m</div>
      </div>
      <div class="quick-card">
        <div class="quick-label">Peso</div>
        <div class="quick-val">${w} kg</div>
      </div>`;

    document.getElementById('card').classList.add('visivel');
    setStatus('ok', `${d.name} carregado`);

    requestAnimationFrame(() => {
      document.querySelectorAll('.stat-barra').forEach(el => {
        setTimeout(() => el.style.width = el.dataset.w, 80);
      });
    });

  } catch {
    showErro(`"${q}" não encontrado. Tente outro nome ou número.`);
    setStatus('err', 'não encontrado');
  }
}