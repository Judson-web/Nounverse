let player;
let updateTimer = null;

// Extract YouTube video ID from URL or direct input
function extractVideoId(url) {
  const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : url;
}

// Load video based on user input
function loadVideo() {
  const url = document.getElementById('videoUrl').value.trim();
  const videoId = extractVideoId(url);
  if (player && videoId) {
    player.loadVideoById(videoId);
  } else if (videoId) {
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
  // You can add custom logic here if needed
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
  const iframe = document.querySelector('#player iframe');
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    iframe.mozRequestFullScreen();
  } else if (iframe.msRequestFullscreen) {
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
