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
      document.querySelectorAll('.sealed-letter').forEach((item) => item.classList.toggle('opened', item === button));
      letterReveal.textContent = button.dataset.letter;
      letterReveal.classList.add('is-revealed');
    });
  });
}
