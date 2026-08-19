# M.A.R.I.A.

Uma experiência web pessoal, delicada e mobile-first para preservar memórias.

## Como usar

Abra `index.html` no navegador ou publique a pasta `project-maria` via GitHub Pages. Não há dependências ou etapa de build.

O progresso é salvo localmente pelo navegador. Para reiniciar a experiência, limpe os dados do site no navegador.

O acesso pede a senha `0105` em cada nova sessão do navegador. Como este é um site estático, isso funciona como uma barreira de acesso visual, e não como proteção dos arquivos: não publique fotos, vídeos ou áudios sem consentimento e use hospedagem com autenticação se o conteúdo precisar ficar realmente privado.

## Estrutura

- `css/`: identidade visual, componentes e movimento.
- `js/`: navegação, conteúdo, estado, galeria, player e lógica da experiência.
  - `timeline.js`: definição dos capítulos e renderização do conteúdo principal.
  - `content.js`: shim de compatibilidade para o conteúdo da timeline.
  - `storage.js`: estado persistido e compatibilidade de dados.
- `assets/`: reservado para fotos, áudios, vídeos, ícones e fontes personalizados.

## Melhorias recentes

- O conteúdo foi separado em um módulo dedicado para facilitar manutenção.
- O estado local agora preserva o último capítulo visitado e é mais resistente a dados antigos.
- A navegação ganhou destaque visual para o capítulo atual e melhor controle de foco ao abrir o modal.
- Foi adicionado um mini-game fofo com qualidades da Maria para dar um toque especial à experiência.
