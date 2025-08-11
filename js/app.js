let roundCount = 0;
const roundsDiv = document.getElementById('rounds');
let players = [];

const SCORE_KEY  = 'mahjong_scores_v1';
const POINT_UNIT = 1000;
const MIN_ROUNDS = 1;

function loadAllScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) || { roundCount: 0, rounds: {} };
  } catch {
    return { roundCount: 0, rounds: {} };
  }
}
function saveAllScores(state) {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(state));
  } catch (e) { console.warn('save failed', e); }
}

function saveScore(roundNumber, playerId, value) {
  const st = loadAllScores();
  const playerCount = players.length || 3;
  if (!st.rounds[roundNumber]) st.rounds[roundNumber] = Array(playerCount).fill('');
  st.rounds[roundNumber][playerId] = value;
  st.roundCount = Math.max(st.roundCount || 0, roundNumber);
  saveAllScores(st);
}

function getPlayers() {
    const fromLS = (k, fb) => localStorage.getItem(k) || fb;
    return [
      fromLS('mahjong_player1', 'プレイヤー1'),
      fromLS('mahjong_player2', 'プレイヤー2'),
      fromLS('mahjong_player3', 'プレイヤー3'),
    ];
}

window.onload = () => {
  players = getPlayers();
  const saved = loadAllScores();
  const restoreRounds = Math.max(saved.roundCount || 0, MIN_ROUNDS);

  renderChipTable();

  for (let i = 1; i <= restoreRounds; i++) addRound(i);

  for (let i = 1; i <= restoreRounds; i++) {
    const row = (saved.rounds && saved.rounds[i]) || null;
    if (!row) continue;
    row.forEach((val, p) => {
      const scoreInput = document.querySelector(`[name="score${p}_${i}"]`);
      if (scoreInput) scoreInput.value = val ?? '';
    });
  }
};

function addRound(roundNumber) {
  if (!roundNumber) roundNumber = ++roundCount;
  else roundCount = Math.max(roundCount, roundNumber);

  const playerCount = players.length;
  const colspan = playerCount + 1;

  const headers = players.map(name => `<th>${name}</th>`).join('');
  const inputs  = Array.from({ length: playerCount }, (_, idx) =>
    `<td><input type="number" name="score${idx}_${roundNumber}" /></td>`
  ).join('');

  const table = document.createElement('table');
  table.innerHTML = `
    <tr><th colspan="${colspan}">${roundNumber} 局目</th></tr>
    <tr><th>プレイヤー</th>${headers}</tr>
    <tr><td>点数</td>${inputs}</tr>
  `;
  roundsDiv.appendChild(table);

  for (let playerId = 0; playerId < playerCount; playerId++) {
    const input = table.querySelector(`[name="score${playerId}_${roundNumber}"]`);
    input.addEventListener('input', (e) => saveScore(roundNumber, playerId, e.target.value));
  }

  const st = loadAllScores();
  st.roundCount = Math.max(st.roundCount || 0, roundNumber);
  saveAllScores(st);
}

function renderChipTable() {
    const container = document.getElementById('chipTable');
    if (!container) return;
  
    const headers = players.map(name => `<th>${name}</th>`).join('');
    const inputs = players
      .map((_, idx) =>
        `<td><input type="number" name="chip_${idx}" value="0" /></td>`
      )
      .join('');
  
    const table = document.createElement('table');
    table.className = 'chip-table';
    table.innerHTML = `
      <tr><th>プレイヤー</th>${headers}</tr>
      <tr><td>増減</td>${inputs}</tr>
    `;
    container.innerHTML = '';
    container.appendChild(table);
}

function calculate() {
  const rate     = parseFloat(document.getElementById('rate').value);
  const tableFee = parseFloat(document.getElementById('tableFee').value) || 0;
  const chipRate = parseFloat(document.getElementById('chipRate').value);

  const playerCount = players.length;

  const totalScores = Array(playerCount).fill(0);
  let totalRounds = 0;

  for (let i = 1; i <= roundCount; i++) {
    const scores = Array.from({ length: playerCount }, (_, idx) =>
      parseInt(document.querySelector(`[name="score${idx}_${i}"]`).value) || 0
    );
    totalRounds++;
    scores.forEach((score, idx) => totalScores[idx] += score);
  }

  const chipCounts = Array.from({ length: playerCount }, (_, idx) =>
    parseInt(document.querySelector(`[name="chip_${idx}"]`)?.value) || 0
  );

  const resultEl = document.getElementById('result');
  let resultText = '';

  resultText += `局数: ${totalRounds}\n`;
  resultText += `レート: ${rate}\n\n`;
  resultText += `卓代: ${tableFee}\n\n`;

  resultText += `合計点数:\n`;
  players.forEach((name, idx) => { resultText += `${name}: ${totalScores[idx]}\n`; });

  resultText += `\nチップ増減:\n`;
  players.forEach((name, idx) => {
    resultText += `${name}: ${chipCounts[idx]} 枚\n`;
  });

  resultText += `\n麻雀のみ:\n`;
  const mahjongOnlyMoney = totalScores.map(score => Math.round(score * rate * POINT_UNIT));
  players.forEach((name, idx) => { resultText += `${name}: ${mahjongOnlyMoney[idx]}円\n`; });

  resultText += `\n最終結果:\n`;
  const perHeadFee = tableFee / playerCount;
  const resultMoney = totalScores.map((score, idx) => Math.round(score * rate * POINT_UNIT - perHeadFee + chipCounts[idx] * chipRate));
  players.forEach((name, idx) => { resultText += `${name}: ${resultMoney[idx]}円\n`; });

  resultEl.textContent = resultText;
  document.getElementById('result-section').style.display = 'block';
}