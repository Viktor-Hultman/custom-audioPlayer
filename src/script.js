const audioPlayerContainer = document.querySelector('#audio-player-container');
const player = audioPlayerContainer.querySelector('[data-player]')

const playPauseContainer = audioPlayerContainer.querySelector('[data-play-pause]')
const playButton = playPauseContainer.querySelector('[data-play]')
const pauseButton = playPauseContainer.querySelector('[data-pause]')

const skipBack = audioPlayerContainer.querySelector('[data-skip-back]')
const skipForward = audioPlayerContainer.querySelector('[data-skip-forward]')

const speedButton = audioPlayerContainer.querySelector('[data-playback-speed]');

const seekSlider = audioPlayerContainer.querySelector('[data-seek-slider]');

const current = audioPlayerContainer.querySelector('[data-current-time]')
const duration = audioPlayerContainer.querySelector('[data-duration-time]')

const volumeIconContainer = audioPlayerContainer.querySelector('[data-volume-icon]')
const volumeFull = volumeIconContainer.querySelector('[data-volume-full]')
const volumeHalf = volumeIconContainer.querySelector('[data-volume-half]')
const volumeOff = volumeIconContainer.querySelector('[data-volume-off]')

const volumeSlider = audioPlayerContainer.querySelector('[data-volume-slider]');
const output = audioPlayerContainer.querySelector('[data-volume-output]');

//Targeting all the elements of the audio player


volumeSlider.addEventListener('input', (e) => { //Listener for the volumeslider
  const value = e.target.value;
  output.textContent = value; //Changeing the value of the display text of the amount of volume
  player.volume = value / 100; //Setting the volume of the player to the target value but converted to be between 0.0 - 1.0

  if(player.volume < 0.1){ //If the volume is below 10%
    volumeOff.style = 'display: block;'
    volumeHalf.style = 'display: none;'
    volumeFull.style = 'display: none;'
  } else if (player.volume < 0.5){ //If the volume is below 50%
    volumeOff.style = 'display: none;'
    volumeHalf.style = 'display: block;'
    volumeFull.style = 'display: none;'
  } else { //If the volume is above 50%
    volumeOff.style = 'display: none;'
    volumeHalf.style = 'display: none;'
    volumeFull.style = 'display: block;'
  }

});

let playState = 'paused' // Global variable for what 'state' the aodioplayer is in currently, 'paused' or 'playing'

let RAF = null;

const useEvents = ["click", "keypress"];

let speeds = [ //The avaliable speeds the playback should have
  0.5, 1, 1.5, 2
]

let testSrc = "https://assets.codepen.io/4358584/Anitek_-_Komorebi.mp3" //Src example for the player


seekSlider.addEventListener('input', () => { //Listener for when an input/drag event happens on the 'playtrack'
  current.textContent = calculateTime(seekSlider.value); //Changing the 'current time' of the track
  if(!player.paused) { //If the track is playing then the slider and current time should not be auto updating while the event is happening
    cancelAnimationFrame(RAF);
  }
});

seekSlider.addEventListener('change', () => { //Listener for when an input/drag event is finished on the 'playtrack'
  player.currentTime = seekSlider.value; //Updating the players current time with the value the user has selected
  if(!player.paused) { //Auto updating of the track continue if playing
    requestAnimationFrame(whilePlaying);
  }
});

useEvents.forEach(event=> {
  speedButton.addEventListener(event, (e) => { //Function for toggle between the different playback speeds
    if(event == "click" || e.keyCode == 13){
      let current = speeds.indexOf(player.playbackRate)
      if(current == speeds.length - 1){
        current = -1
      }
      player.playbackRate = speeds[current + 1]
      console.log(player.playbackRate)
      speedButton.innerText = player.playbackRate + "x" 
    }
  });
});

useEvents.forEach(event=> {
  playPauseContainer.addEventListener(event, (e) => { //Event for playing or pausing the track
    if(event == "click" || e.keyCode == 13){
      if(player.src == null || player.src == undefined || player.src == false){ //If the player does not have a src the play/pause button should not work
        return
      }
      if(playState == 'paused'){//If the player is paused it should play
        pauseButton.style = 'display: block;'
        playButton.style = 'display: none;'
        player.play()
        requestAnimationFrame(whilePlaying); //Starting the auto update of the audio track
        playState = 'playing'
      } else {//If the player is playing it should pause
        playButton.style = 'display: block;'
        pauseButton.style = 'display: none;'
        player.pause()
        cancelAnimationFrame(RAF); //Cancel the auto update of the audio track
        playState = 'paused'
      }
    }
  });
});

useEvents.forEach(event=> {
  skipBack.addEventListener(event, (e) => { //Function for 'jumping back' some time on the track
    if(event == "click" || e.keyCode == 13){
      player.currentTime -= 10;
      seekSlider.value = Math.floor(player.currentTime);
      current.textContent = calculateTime(seekSlider.value);
    }
  })
});

useEvents.forEach(event=> {
  skipForward.addEventListener(event, (e) => { //Function for forwarding some time on the track
    if(event == "click" || e.keyCode == 13){
      player.currentTime += 10;
      seekSlider.value = Math.floor(player.currentTime);
      current.textContent = calculateTime(seekSlider.value);
    }
  })
});

function updateSrc(src) {//Function for updating the src of the player
  player.src = src
  pauseButton.style = 'display: block;'
  playButton.style = 'display: none;'
  player.currentTime = 0
  current.textContent = "0:00";
  playState = 'playing'
  player.play()
  requestAnimationFrame(whilePlaying);
}

function whilePlaying() { //Function that updates the audiotrack
  seekSlider.value = Math.floor(player.currentTime);
  current.textContent = calculateTime(seekSlider.value);
  RAF = requestAnimationFrame(whilePlaying);
}

function setSliderMax() { //Function for setting the max val of the track slider to be the same as the audio length
  seekSlider.max = Math.floor(player.duration);
}

function displayDuration() { //Function for setting and displaying the audio length on the player
  duration.textContent = calculateTime(player.duration);
}

function calculateTime(secs) { //Function for calculating and returning minutes and seconds from only seconds parameter
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

//Checks if the audio has been loaded so we can use the length of our audio in our functions
if (player.readyState > 0) {
  displayDuration();
  setSliderMax();
} else {
  player.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
  });
}