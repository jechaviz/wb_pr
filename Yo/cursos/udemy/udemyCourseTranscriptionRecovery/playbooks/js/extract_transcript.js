(() => {
  const collect = () => {
    const selectors = [
      "[data-purpose*='transcript'] p",
      "[data-purpose*='transcript-cue']",
      "div[class*='transcript'] p",
      "div[class*='cue'] p",
      "[class*='transcript'] [class*='cue']",
      "[class*='captions-display'] span"
    ];

    const lines = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        const txt = (el.innerText || "").trim();
        if (txt.length > 0) lines.push(txt);
      });
    });

    const seen = new Set();
    const uniq = [];
    lines.forEach((line) => {
      if (seen.has(line)) return;
      seen.add(line);
      uniq.push(line);
    });

    return uniq.join("\n");
  };

  let text = collect();
  if (text.length > 0) return text;

  const openTranscriptBtn = Array.from(document.querySelectorAll("button, a, span")).find(
    (el) => {
      const t = (el.innerText || "").trim();
      return /Transcrip|Transcript|CC|Subtitles/i.test(t);
    }
  );
  if (openTranscriptBtn) {
    openTranscriptBtn.click();
  }

  text = collect();
  if (text.length > 0) return text;

  const video = document.querySelector("video");
  if (video && video.textTracks && video.textTracks.length > 0) {
    const cues = [];
    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i];
      if (!track || !track.cues) continue;
      for (let j = 0; j < track.cues.length; j++) {
        const cue = track.cues[j];
        if (!cue || !cue.text) continue;
        const txt = (cue.text || "").trim();
        if (txt) cues.push(txt);
      }
    }
    if (cues.length > 0) return cues.join("\n");
  }

  return "";
})();
