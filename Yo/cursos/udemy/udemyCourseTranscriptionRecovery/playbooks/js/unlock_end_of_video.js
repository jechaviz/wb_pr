(() => {
  try {
    const video = document.querySelector("video");
    if (!video) return "no_video";

    if (Number.isFinite(video.duration) && video.duration > 1) {
      video.currentTime = Math.max(0, video.duration - 1);
    }

    video.muted = true;
    video.playbackRate = 16;
    video.play().catch(() => {});
    return "ok";
  } catch (e) {
    return "error";
  }
})();
