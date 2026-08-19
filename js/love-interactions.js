const moments = {
  care: 'Um lembrete: você merece cuidado, paciência e alguém que queira ficar por perto. Eu gosto de estar aqui para você.',
  smile: 'Seu sorriso é uma das minhas coisas favoritas. E o mais bonito é que ele quase sempre aparece quando você simplesmente está sendo você.',
  remember: 'Eu lembro de uma partida às 03:32, de você puxando assunto com todo mundo e de mim sem imaginar o quanto você ainda ia significar para mim.'
};

export function bindLoveInteractions() {
  const momentAnswer = document.querySelector('#moment-answer');
  document.querySelectorAll('[data-moment]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-moment]').forEach((item) => item.classList.toggle('selected', item === button));
      momentAnswer.textContent = moments[button.dataset.moment];
      momentAnswer.classList.add('is-revealed');
    });
  });

  const reasonReveal = document.querySelector('#reason-reveal');
  document.querySelectorAll('.reason-note').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.reason-note').forEach((item) => item.classList.toggle('selected', item === button));
      reasonReveal.textContent = button.dataset.reason;
      reasonReveal.classList.add('is-revealed');
    });
  });

  const letterReveal = document.querySelector('#letter-reveal');
  document.querySelectorAll('.sealed-letter').forEach((button) => {
    const paper = document.createElement('span');
    paper.className = 'letter-paper';
    paper.textContent = button.dataset.letter;
    button.append(paper);
    button.addEventListener('click', () => {
      document.querySelectorAll('.sealed-letter').forEach((item) => item.classList.toggle('opened', item === button));
      letterReveal.textContent = button.dataset.letter;
      letterReveal.classList.add('is-revealed');
    });
  });

  const gardenReveal = document.querySelector('#garden-reveal');
  document.querySelectorAll('.garden-flower').forEach((flower) => {
    flower.addEventListener('click', () => {
      document.querySelectorAll('.garden-flower').forEach((item) => item.classList.toggle('bloomed', item === flower));
      gardenReveal.textContent = flower.dataset.garden;
      gardenReveal.classList.add('is-revealed');
    });
  });

  const startGame = document.querySelector('#heart-game-start');
  const playground = document.querySelector('#heart-playground');
  const score = document.querySelector('#heart-score');
  const gameMessage = document.querySelector('#heart-game-message');
  let heartsCaught = 0;
  let heartTimer;

  function spawnHeart() {
    if (heartsCaught >= 10) return;
    playground.querySelector('.game-placeholder')?.remove();
    playground.querySelector('.catch-heart')?.remove();
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'catch-heart';
    heart.textContent = ['♥', '♡', '♥'][Math.floor(Math.random() * 3)];
    heart.setAttribute('aria-label', 'Pegar coração');
    heart.style.left = `${10 + Math.random() * 72}%`;
    heart.style.top = `${12 + Math.random() * 63}%`;
    heart.addEventListener('click', () => {
      window.clearTimeout(heartTimer);
      heart.remove();
      heartsCaught += 1;
      score.textContent = `${heartsCaught} / 10`;
      if (heartsCaught === 10) {
        playground.classList.add('game-won');
        gameMessage.textContent = 'Você pegou todos. A surpresa é que eu escolheria você em todos os jogos, todos os dias. ♡';
        startGame.textContent = 'Jogar de novo ♡';
        return;
      }
      spawnHeart();
    });
    playground.append(heart);
    heartTimer = window.setTimeout(spawnHeart, 1700);
  }

  startGame?.addEventListener('click', () => {
    window.clearTimeout(heartTimer);
    heartsCaught = 0;
    score.textContent = '0 / 10';
    playground.classList.remove('game-won');
    gameMessage.textContent = 'Vai, pega todos antes que eles fujam.';
    startGame.textContent = 'Recomeçar <3';
    spawnHeart();
  });
}
