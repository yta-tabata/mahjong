document.getElementById('player-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const player1 = document.getElementById('player1').value || 'プレイヤー1';
    const player2 = document.getElementById('player2').value || 'プレイヤー2';
    const player3 = document.getElementById('player3').value || 'プレイヤー3';
  
    const params = new URLSearchParams({
      player1: player1,
      player2: player2,
      player3: player3
    });
  
    window.location.href = `index.html?${params.toString()}`;
});