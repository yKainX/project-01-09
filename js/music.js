export function bindMusicPlayers() {
  const lyricsStage = document.querySelector('.lyrics-stage');
  const setLyrics = (lines, index) => {
    if (!lyricsStage || !lines.length) return;
    const previous = lyricsStage.querySelector('.lyric-previous');
    const current = lyricsStage.querySelector('.lyric-current');
    const next = lyricsStage.querySelector('.lyric-next');
    const activeIndex = Math.min(lines.length - 1, Math.max(0, index));
    if (current.textContent === lines[activeIndex]) return;
    lyricsStage.classList.remove('lyrics-changing');
    void lyricsStage.offsetWidth;
    previous.textContent = lines[Math.max(0, activeIndex - 1)];
    current.textContent = lines[activeIndex];
    next.textContent = lines[Math.min(lines.length - 1, activeIndex + 1)];
    lyricsStage.classList.add('lyrics-changing');
  };

  document.querySelectorAll('.music-player').forEach((player) => {
    const audio = player.querySelector('audio');
    const button = player.querySelector('.music-play-button');
    const fill = player.querySelector('.music-progress span');
    const time = player.querySelector('.music-time');
    const caption = player.querySelector('.music-caption');
    const start = Number(player.dataset.start || 0);
    const end = Number(player.dataset.end || 0);
    const captions = JSON.parse(decodeURIComponent(player.dataset.captions || '[]'));
    const fadeDuration = 800;
    let fadingOut = false;

    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    const reset = () => { button.textContent = '▶'; player.classList.remove('playing'); };
    const fadeIn = () => {
      const startedAt = performance.now();
      audio.volume = 0;
      const animate = (now) => {
        audio.volume = Math.min(1, (now - startedAt) / fadeDuration);
        if (audio.volume < 1 && !audio.paused) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };
    const fadeOut = () => {
      if (fadingOut) return;
      fadingOut = true;
      const startedAt = performance.now();
      const initialVolume = audio.volume;
      const animate = (now) => {
        audio.volume = Math.max(0, initialVolume * (1 - ((now - startedAt) / fadeDuration)));
        if (audio.volume > 0 && !audio.paused) { requestAnimationFrame(animate); return; }
        audio.pause(); audio.currentTime = start; audio.volume = 1; fadingOut = false; reset();
      };
      requestAnimationFrame(animate);
    };

    audio.addEventListener('loadedmetadata', () => {
      const duration = end > start ? end - start : audio.duration || 0;
      audio.currentTime = start;
      time.textContent = `0:00 / ${formatTime(duration)}`;
    });

    button.addEventListener('click', async () => {
      if (!audio.getAttribute('src')) return;
      if (!audio.paused) { audio.pause(); reset(); return; }
      if (audio.currentTime < start || (end && audio.currentTime >= end)) audio.currentTime = start;
      try {
        await audio.play(); fadeIn(); button.textContent = 'Ⅱ'; player.classList.add('playing');
        document.querySelectorAll('.music-player').forEach((item) => item.classList.toggle('selected-track', item === player));
        setLyrics(captions, 0);
      }
      catch { caption.textContent = 'Não foi possível reproduzir este trecho agora.'; reset(); }
    });
    audio.addEventListener('timeupdate', () => {
      const duration = end > start ? end - start : audio.duration || 0;
      const elapsed = Math.max(0, audio.currentTime - start);
      fill.style.width = duration ? `${Math.min(100, (elapsed / duration) * 100)}%` : '0%';
      time.textContent = `${formatTime(elapsed)} / ${formatTime(duration)}`;
      const captionIndex = Math.min(captions.length - 1, Math.floor((elapsed / Math.max(duration, 1)) * captions.length));
      if (captions[captionIndex] && caption.textContent !== captions[captionIndex]) {
        caption.classList.remove('caption-in');
        void caption.offsetWidth;
        caption.textContent = captions[captionIndex];
        caption.classList.add('caption-in');
      }
      setLyrics(captions, captionIndex);
      if (end && audio.currentTime >= end - (fadeDuration / 1000)) fadeOut();
    });
    audio.addEventListener('ended', () => { audio.currentTime = start; reset(); });
    audio.addEventListener('error', () => { caption.textContent = 'Não foi possível carregar este trecho.'; });
  });
}
