let roundCount = 0;
const roundsDiv = document.getElementById('rounds');
let players = [];

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return [
    params.get('player1') || 'プレイヤー1',
    params.get('player2') || 'プレイヤー2',
    params.get('player3') || 'プレイヤー3'
  ];
}

window.onload = () => {
  players = getQueryParams();
  addRound();
};

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

function addRound() {
  roundCount++;
  const table = document.createElement('table');
  table.innerHTML = `
    <tr><th colspan="4">${roundCount} 局目</th></tr>
    <tr><th>プレイヤー</th><th>${players[0]}</th><th>${players[1]}</th><th>${players[2]}</th></tr>
    <tr>
      <td>点数</td>
      <td><input type="number" name="score0_${roundCount}" /></td>
      <td><input type="number" name="score1_${roundCount}" /></td>
      <td><input type="number" name="score2_${roundCount}" /></td>
    </tr>
  `;
  roundsDiv.appendChild(table);
}

function calculate() {
  const rate = parseFloat(document.getElementById('rate').value);
  const tableFee = parseFloat(document.getElementById('tableFee').value);
  const totalScores = [0, 0, 0];
  let totalRounds = 0;

  for (let i = 1; i <= roundCount; i++) {
    const scores = [0, 1, 2].map(idx =>
      parseInt(document.querySelector(`[name="score${idx}_${i}"]`).value) || 0
    );
    totalRounds++;
    scores.forEach((score, idx) => {
    totalScores[idx] += score;
    });
  }

  const resultEl = document.getElementById('result');
  let resultText = '';

  resultText += `局数: ${totalRounds}\n`;
  resultText += `レート: ${rate}\n\n`;
  resultText += `卓代: ${tableFee}\n\n`;

  resultText += `合計点数:\n`;
  players.forEach((name, idx) => {
    resultText += `${name}: ${totalScores[idx]}\n`;
  });

  resultText += `\n金額換算:\n`;
  const money = totalScores.map(score => Math.round(score * rate * 1000 - tableFee / 3));
  players.forEach((name, idx) => {
    resultText += `${name}: ${money[idx]}円\n`;
  });

  resultEl.textContent = resultText;
  document.getElementById('result-section').style.display = 'block';
}

function confirmBack() {
    if (confirm("現在のデータは消えてしまいますが、よろしいですか？")) {
        window.location.href = 'player.html';
    }
}