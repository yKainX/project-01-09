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
    button.addEventListener('click', () => {
      if (button.classList.contains('is-sending')) return;
      button.classList.add('is-sending');
      letterReveal.textContent = 'Uma cartinha está voando até você...';
      letterReveal.classList.add('is-revealed');

      const bounds = button.getBoundingClientRect();
      const sheet = document.createElement('div');
      sheet.className = 'flying-letter-sheet';
      sheet.setAttribute('aria-hidden', 'true');
      sheet.innerHTML = '<span>para maria</span><i>♡</i>';
      sheet.style.left = `${bounds.left + (bounds.width / 2) - 42}px`;
      sheet.style.top = `${bounds.top + 26}px`;
      document.body.append(sheet);

      const showLetter = () => {
        sheet.remove();
        const backdrop = document.querySelector('#modal-backdrop');
        const content = document.querySelector('#modal-content');
        content.innerHTML = '<div class="letter-modal-mark">✉</div><span class="letter-modal-kicker">uma cartinha para você</span><h3 id="modal-title"></h3><p></p>';
        content.querySelector('h3').textContent = button.querySelector('.letter-label').textContent;
        content.querySelector('p').textContent = button.dataset.letter;
        document.dispatchEvent(new CustomEvent('maria:modalopen', { detail: button }));
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.querySelector('#modal-close').focus();
        button.classList.remove('is-sending');
        letterReveal.textContent = 'Sua cartinha chegou. ♡';
      };
      sheet.addEventListener('animationend', showLetter, { once: true });
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

  const skyReveal = document.querySelector('#sky-reveal');
  document.querySelectorAll('.sky-star').forEach((star) => {
    star.addEventListener('click', () => {
      if (star.classList.contains('is-shining')) return;
      document.querySelectorAll('.sky-star').forEach((item) => item.classList.remove('discovered'));
      star.classList.add('is-shining');
      skyReveal.textContent = 'Essa estrela está brilhando para você...';
      skyReveal.classList.add('is-revealed');
      window.setTimeout(() => {
        const backdrop = document.querySelector('#modal-backdrop');
        const content = document.querySelector('#modal-content');
        content.innerHTML = '<div class="star-modal-mark">✦</div><span class="letter-modal-kicker">uma estrela para você</span><h3 id="modal-title">Uma luz no nosso céu</h3><p></p>';
        content.querySelector('p').textContent = star.dataset.star;
        document.dispatchEvent(new CustomEvent('maria:modalopen', { detail: star }));
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.querySelector('#modal-close').focus();
        star.classList.remove('is-shining');
        star.classList.add('discovered');
        skyReveal.textContent = 'A estrela deixou uma mensagem para você. ✦';
      }, 900);
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
