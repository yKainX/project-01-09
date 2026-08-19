const storySteps = [
  {
    id: 'self',
    title: 'O que mais te define?',
    prompt: 'Você possui todas essas qualidades, mas qual delas é a sua marca registrada?',
    options: [
      { id: 'warm', label: 'Acolhedora', description: 'Você faz o ambiente parecer mais seguro e leve.', accent: '🤗' },
      { id: 'playful', label: 'Divertida', description: 'Seu brilho e sua risada mudam o clima.', accent: '✨' },
      { id: 'deep', label: 'Intensa', description: 'Você vive com emoção, verdade e coração.', accent: '🔥' },
      { id: 'authentic', label: 'Autêntica', description: 'Você é você, sem filtros e sem medo de ser.', accent: '🌷' }
    ]
  },
  {
    id: 'feeling',
    title: 'O que mais te define?',
    prompt: 'Quando você se sente mais linda?',
    options: [
      { id: 'care', label: 'Quando cuida', description: 'Seu cuidado é uma forma de amor.', accent: '💗' },
      { id: 'laugh', label: 'Quando ri', description: 'Seu sorriso é leve, bonito e contagiante.', accent: '😊' },
      { id: 'honest', label: 'Quando fala com verdade', description: 'Sua sinceridade é forte e admirável.', accent: '🌙' },
      { id: 'open', label: 'Quando se entrega', description: 'Você é profunda mesmo quando se deixa ver.', accent: '🌊' }
    ]
  },
  {
    id: 'memory',
    title: 'Como você quer ser lembrada?',
    prompt: 'Escolha a sensação que você quer deixar.',
    options: [
      { id: 'comfort', label: 'Com carinho', description: 'Porque sua presença acalma e acolhe.', accent: '🫶' },
      { id: 'light', label: 'Com brilho', description: 'Porque você ilumina tudo ao redor.', accent: '☀️' },
      { id: 'strength', label: 'Com força', description: 'Porque sua essência é linda mesmo quando é intensa.', accent: '💪' },
      { id: 'tender', label: 'Com ternura', description: 'Porque há delicadeza no jeito que você é.', accent: '🌸' }
    ]
  }
];

const results = {
  warm: {
    headline: 'Você é aconchego.',
    body: 'Seu jeito de cuidar faz as pessoas se sentirem seguras, amadas e em casa.'
  },
  playful: {
    headline: 'Você é leveza.',
    body: 'Seu sorriso e sua graça transformam o simples em algo bonito.'
  },
  deep: {
    headline: 'Você é intensidade.',
    body: 'Há força, verdade e profundidade no jeito que você vive.'
  },
  authentic: {
    headline: 'Você é única.',
    body: 'O que há de mais bonito em você é a forma autêntica de ser.'
  },
  care: {
    headline: 'Você é amor em ação.',
    body: 'Seu cuidado é uma das coisas mais especiais que você tem.'
  },
  laugh: {
    headline: 'Você é brilho.',
    body: 'Seu riso e sua presença deixam tudo mais vivo e feliz.'
  },
  honest: {
    headline: 'Você é verdade.',
    body: 'Sua sinceridade é rara e faz a sua presença ser ainda mais forte.'
  },
  open: {
    headline: 'Você é profundidade.',
    body: 'O que você mostra com coragem é exatamente o que faz você ser tão linda.'
  },
  comfort: {
    headline: 'Você é carinho.',
    body: 'Sua presença transmite acolhimento e suavidade.'
  },
  light: {
    headline: 'Você é luz.',
    body: 'Você faz o mundo parecer mais bonito só por existir nele.'
  },
  strength: {
    headline: 'Você é força.',
    body: 'Sua intensidade é parte de tudo o que você é.'
  },
  tender: {
    headline: 'Você é ternura.',
    body: 'Há uma delicadeza muito especial no jeito que você se mostra.'
  }
};

export function mountQualityGame() {
  const gameContainer = document.querySelector('#quality-game');
  if (!gameContainer) return;

  let stepIndex = 0;
  let selections = [];

  function renderStep() {
    const step = storySteps[stepIndex];
    gameContainer.innerHTML = `
      <div class="quality-game-card">
        <div class="quality-game-header">
          <span class="eyebrow">mini-game para você!</span>
          <h3>${step.title}</h3>
          <p>${step.prompt}</p>
        </div>
        <div class="quality-options">
          ${step.options.map((option) => `<button class="quality-option" type="button" data-id="${option.id}" data-step="${step.id}"><span>${option.accent}</span><strong>${option.label}</strong><small>${option.description}</small></button>`).join('')}
        </div>
        <div class="quality-progress" aria-label="Progresso do mini-game">
          <span style="width:${((stepIndex + 1) / storySteps.length) * 100}%"></span>
        </div>
      </div>
    `;

    gameContainer.querySelectorAll('.quality-option').forEach((button) => {
      button.addEventListener('click', () => {
        selections.push(button.dataset.id);
        if (stepIndex < storySteps.length - 1) {
          stepIndex += 1;
          renderStep();
          return;
        }

        const finalText = [
          results[selections[0]]?.headline || 'Você é especial.',
          results[selections[1]]?.body || 'E isso faz parte do seu encanto.',
          results[selections[2]]?.body || 'Seu jeito é único e merece ser celebrado.'
        ].join(' ');

        gameContainer.innerHTML = `
          <div class="quality-game-card final-card">
            <div class="quality-game-header">
              <span class="eyebrow">resultado</span>
              <h3>O que esse mini-game mostrou</h3>
              <p>Você é incrível do jeitinho que é.</p>
            </div>
            <div class="quality-result-panel">
              <p>${finalText}</p>
              <div class="quality-badge">💖</div>
            </div>
            <button class="soft-button quality-replay" type="button">Jogar de novo</button>
          </div>
        `;

        const replayButton = gameContainer.querySelector('.quality-replay');
        replayButton?.addEventListener('click', () => {
          stepIndex = 0;
          selections = [];
          renderStep();
        });
      });
    });
  }

  renderStep();
}
