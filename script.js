let player;
let updateTimer = null;

// Robustly extract YouTube video ID from any common URL or direct input
function extractVideoId(url) {
  // Covers youtu.be, youtube.com/watch, youtube.com/embed, youtube.com/v, youtube.com/shorts, and direct IDs
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  // fallback: if user enters just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  return null;
}

// Load video based on user input
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

// Create the YouTube player
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

// When player is ready, set up seek bar updates
function onPlayerReady() {
  // Set volume bar to current player volume
  if (player && player.getVolume) {
    document.getElementById('volumeBar').value = player.getVolume();
  }
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

// Handle player state changes (optional for more features)
function onPlayerStateChange(event) {
  // Add custom logic here if needed
}

// Custom control functions
function playVideo() {
  if (player) player.playVideo();
}

function pauseVideo() {
  if (player) player.pauseVideo();
}

function seekVideo(value) {
  if (player) {
    const duration = player.getDuration();
    player.seekTo((value / 100) * duration, true);
  }
}

function setVolume(value) {
  if (player) player.setVolume(value);
}

function toggleFullScreen() {
  // Get the iframe inside the #player container
  const iframe = document.querySelector('#player iframe');
  if (!iframe) return;

  // Use the Fullscreen API with all vendor prefixes for compatibility
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) { // Firefox
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) { // IE/Edge
    iframe.msRequestFullscreen();
  }
}

function setPlaybackSpeed(speed) {
  if (player) player.setPlaybackRate(Number(speed));
}

function toggleTheme() {
  document.body.classList.toggle('light');
}

// Load the YouTube IFrame API and set up the player
window.onYouTubeIframeAPIReady = function() {
  // Optionally, load a default video
  createPlayer('dQw4w9WgXcQ');
};
