let player;
let updateTimer = null;

// --- YOUTUBE PLAYER LOGIC ---

function extractVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

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

function onPlayerStateChange(event) {
  updatePlayPauseButton(event.data);
}

function togglePlayPause() {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === 1) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function updatePlayPauseButton(state) {
  const btn = document.getElementById('playPauseBtn');
  if (!btn) return;
  btn.textContent = (state === 1) ? "Pause" : "Play";
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

function setPlaybackSpeed(speed) {
  if (player) player.setPlaybackRate(Number(speed));
}

function toggleTheme() {
  document.body.classList.toggle('light');
}

window.onYouTubeIframeAPIReady = function() {
  createPlayer('dQw4w9WgXcQ'); // Default video
};

// --- POP-UP, PIP, AND SHARE LOGIC ---

document.addEventListener('DOMContentLoaded', function() {
  // Pop-up modal logic
  const popupBtn = document.getElementById('popupBtn');
  const popupModal = document.getElementById('popupModal');
  const closePopup = document.getElementById('closePopup');

  if (popupBtn && popupModal && closePopup) {
    popupBtn.onclick = () => popupModal.classList.add('active');
    closePopup.onclick = () => popupModal.classList.remove('active');
    popupModal.onclick = (e) => {
      if (e.target === popupModal) popupModal.classList.remove('active');
    };
  }

  // Picture-in-Picture logic (Document PiP API)
  const pipBtn = document.getElementById('pipBtn');
  const playerDiv = document.getElementById('player');

  if (window.documentPictureInPicture && pipBtn && playerDiv) {
    pipBtn.disabled = false;
    pipBtn.title = "Open Picture-in-Picture window";
    pipBtn.onclick = async () => {
      try {
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: playerDiv.clientWidth,
          height: playerDiv.clientHeight,
        });
        pipWindow.document.body.append(playerDiv);
      } catch (err) {
        alert("Failed to open Picture-in-Picture: " + err.message);
      }
    };
  } else if (pipBtn) {
    pipBtn.disabled = true;
    pipBtn.title = "Picture-in-Picture not supported in this browser";
  }

  // --- Web Share API logic ---
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.onclick = () => {
      const shareData = {
        title: document.title || 'Check this out!',
        url: location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {
          // User cancelled or sharing failed
        });
      } else {
        // Fallback: copy to clipboard and alert
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareData.url).then(() => {
            alert('Link copied to clipboard!');
          }, () => {
            prompt('Copy this link:', shareData.url);
          });
        } else {
          prompt('Copy this link:', shareData.url);
        }
      }
    };
  }
});
