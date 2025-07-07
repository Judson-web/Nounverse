let player;
let updateTimer = null;

// Extracts YouTube video ID from any common URL or direct input
function extractVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

// Loads a video given user input
function loadVideo() {
  const url = document.getElementById('videoUrl').value.trim();
  const videoId = extractVideoId(url);
  if (!videoId) {
    alert("Please enter a valid YouTube URL or video ID.");
    return;
  }
  if (player) {
    player.loadVideoById(videoId);
  } else {
    createPlayer(videoId);
  }
}

// Creates the YouTube player
function createPlayer(videoId) {
  player = new YT.Player('player', {
    width: '100%',
    height: '390',
    videoId: videoId,
    playerVars: { 'playsinline': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// Handles player ready event
function onPlayerReady() {
  if (player && player.getVolume) {
    document.getElementById('volumeBar').value = player.getVolume();
  }
  updatePlayPauseButton(player.getPlayerState());
  updateTimer = setInterval(() => {
    if (player && player.getDuration) {
      const duration = player.getDuration();
      const current = player.getCurrentTime();
      if (duration) {
        document.getElementById('seekBar').value = (current / duration) * 100;
      }
    }
  }, 800);
}

// Handles player state changes
function onPlayerStateChange(event) {
  updatePlayPauseButton(event.data);
}

// Play/Pause toggle logic
function togglePlayPause() {
  if (!player) return;
  const state = player.getPlayerState();
  // 1: playing, 2: paused, 0: ended, 5: video cued
  if (state === 1) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

// Updates play/pause button label
function updatePlayPauseButton(state) {
  const btn = document.getElementById('playPauseBtn');
  if (!btn) return;
  if (state === 1) {
    btn.textContent = "Pause";
  } else {
    btn.textContent = "Play";
  }
}

// Seek bar logic
function seekVideo(value) {
  if (player) {
    const duration = player.getDuration();
    player.seekTo((value / 100) * duration, true);
  }
}

// Volume control
function setVolume(value) {
  if (player) player.setVolume(value);
}

// Fullscreen logic (cross-browser)
function toggleFullScreen() {
  const iframe = document.querySelector('#player iframe');
  if (!iframe) return;
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen();
  }
}

// Playback speed control
function setPlaybackSpeed(speed) {
  if (player) player.setPlaybackRate(Number(speed));
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('light');
}

// YouTube IFrame API setup
window.onYouTubeIframeAPIReady = function() {
  createPlayer('dQw4w9WgXcQ'); // Default video
};
