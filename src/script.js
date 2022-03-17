const player = document.querySelector('#player')
const playPause = document.querySelector('#play-pause')
const volumeIcon = document.querySelector('#volume-icon')
const current = document.querySelector('#current')

let playState = 'paused'
let muteState = 'unmuted'

player.src = "https://hwcdn.libsyn.com/p/5/1/8/518b62b2d896549d/Syntax152.mp3?c_id=44542285&cs_id=44542285&expiration=1561491578&hwt=40b42995123424c9086441d814f8a1ba"

function togglePlay(params) {
  if(playState == 'paused'){//If the player is paused it should play
    playPause.src = "./imgs/pause.svg"
    player.play()
    playState = 'playing'
  } else {//If the player is playing it should pause
    playPause.src = "./imgs/play.svg"
    player.pause()
    playState = 'paused'
  }
} 

function togglemute(params) {
  if(muteState == 'muted'){//If the player is not muted it should pause
    volumeIcon.src = "./imgs/volume-full.svg";
    player.muted = false;
    muteState = 'unmuted';
  } else {//If the player is playing it should pause
    volumeIcon.src = "./imgs/volume-off.svg";
    player.muted = true;
    muteState = 'muted';
  }
} 

function skipForward(params) {
  player.currentTime += 30;
}

function skipBackwards(params) {
  player.currentTime -= 30;
}

let speeds = [
  0.5, 1, 1.5, 2
]

function togglePlayback(params) {
  let current = speeds.indexOf(player.playbackRate)
  if(current == speeds.length - 1){
    current = -1
  }
  player.playbackRate = speeds[current + 1]
  console.log(player.playbackRate)
}