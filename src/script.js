const audioPlayerContainer = document.querySelector('#audio-player-container');
const player = document.querySelector('#player')
const playPause = document.querySelector('#play-pause')
const volumeIcon = document.querySelector('#volume-icon')
const current = document.querySelector('#current-time')
const duration = document.querySelector('#duration-time')
const seekSlider = document.querySelector('#seek-slider');
const volumeSlider = document.querySelector('#volume-slider');
const output = document.querySelector('#volume-output');
const speedButton = document.querySelector('#playback-speed');

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  output.textContent = value;
  player.volume = value / 100;

  if(player.volume < 0.1){
    volumeIcon.src = "./imgs/volume-off.svg";
  } else if (player.volume < 0.5){
    volumeIcon.src = "./imgs/volume-half.svg";
  } else {
    volumeIcon.src = "./imgs/volume-full.svg";
  }

});

let playState = 'paused'

let RAF = null;
let speeds = [
  0.5, 1, 1.5, 2
]

player.src = "https://assets.codepen.io/4358584/Anitek_-_Komorebi.mp3"


seekSlider.addEventListener('input', () => {
  current.textContent = calculateTime(seekSlider.value);
  if(!player.paused) {
    cancelAnimationFrame(RAF);
  }
});

seekSlider.addEventListener('change', () => {
  player.currentTime = seekSlider.value;
  if(!player.paused) {
    requestAnimationFrame(whilePlaying);
  }
});

speedButton.addEventListener('click', () => {
  let current = speeds.indexOf(player.playbackRate)
  if(current == speeds.length - 1){
    current = -1
  }
  player.playbackRate = speeds[current + 1]
  console.log(player.playbackRate)
  speedButton.innerText = player.playbackRate + "x" 
});

playPause.addEventListener('click', () => {
  if(playState == 'paused'){//If the player is paused it should play
    playPause.src = "./imgs/pause.svg"
    player.play()
    requestAnimationFrame(whilePlaying);
    playState = 'playing'
  } else {//If the player is playing it should pause
    playPause.src = "./imgs/play.svg"
    player.pause()
    cancelAnimationFrame(RAF);
    playState = 'paused'
  }
})


function whilePlaying() {
  seekSlider.value = Math.floor(player.currentTime);
  current.textContent = calculateTime(seekSlider.value);
  RAF = requestAnimationFrame(whilePlaying);
}

function setSliderMax() {
  seekSlider.max = Math.floor(player.duration);
}

function displayDuration() {
  duration.textContent = calculateTime(player.duration);
}

function calculateTime(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

function skipForward(params) {
  player.currentTime += 10;
  seekSlider.value = Math.floor(player.currentTime);
  current.textContent = calculateTime(seekSlider.value);
}

function skipBackwards(params) {
  player.currentTime -= 10;
  seekSlider.value = Math.floor(player.currentTime);
  current.textContent = calculateTime(seekSlider.value);
}

function showRangeProgress(rangeInput) {
  if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});


if (player.readyState > 0) {
  displayDuration();
  setSliderMax();
} else {
  player.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
  });
}