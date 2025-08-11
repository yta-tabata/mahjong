const SCORE_KEY = 'mahjong_scores_v1';

const PLAYER_KEYS = {
    p1: 'mahjong_player1',
    p2: 'mahjong_player2',
    p3: 'mahjong_player3',
};

window.addEventListener('DOMContentLoaded', () => {
    const p1 = localStorage.getItem(PLAYER_KEYS.p1);
    const p2 = localStorage.getItem(PLAYER_KEYS.p2);
    const p3 = localStorage.getItem(PLAYER_KEYS.p3);
  
    if (p1) document.getElementById('player1').value = p1;
    if (p2) document.getElementById('player2').value = p2;
    if (p3) document.getElementById('player3').value = p3;
});

function savePlayers() {
    const player1 = document.getElementById('player1').value || 'プレイヤー1';
    const player2 = document.getElementById('player2').value || 'プレイヤー2';
    const player3 = document.getElementById('player3').value || 'プレイヤー3';
  
    localStorage.setItem(PLAYER_KEYS.p1, player1);
    localStorage.setItem(PLAYER_KEYS.p2, player2);
    localStorage.setItem(PLAYER_KEYS.p3, player3);
}

document.getElementById('player-form').addEventListener('submit', function (e) {
    e.preventDefault();
    savePlayers();

    window.location.href = `index.html`;
});

document.getElementById('newGame').addEventListener('click', function () {
    if (confirm('現在のスコアを削除して新しく始めますか？')) {
      localStorage.removeItem(SCORE_KEY);
      savePlayers();

      window.location.href = 'index.html';
    }
});