/*
Colophon
ML5JS FaceMesh for face detection.
Music: Hiroshi Yoshimura "Wet Land" from his Wet Land (1993) album.
 */

// Facemesh indexes for midpoint top and bottom eyelids of each eye, see:
// https://raw.githubusercontent.com/tensorflow/tfjs-models/refs/heads/master/face-landmarks-detection/mesh_map.jpg

export const sketch = function(p) {
const LEFT_TOP = 159;
const LEFT_BOT = 145;
const RIGHT_TOP = 386;
const RIGHT_BOT = 374;

// Defines eyelid distance in pixels for eyes to be regarded as "closed"
const CLOSED_THRESHOLD = 4.4;

let eyeCloseStartTime = 0; // Timestamp when eyes were first detected as closed
const CLOSE_DURATION_THRESHOLD = 300; // Minimum duration (ms) for eyes to be considered closed

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };
let leftEyeTop = [246, 161, 160, 159, 158, 157, 173];
let leftEyeBot = [ 7, 163, 144, 145, 153, 154, 155];
let rightEyeTop = [398, 384, 385, 386, 387, 388, 466];
let rightEyeBot = [382, 381, 380, 374, 373, 390, 249];
let song;
let isEyeOpen = true;

let isModelReady = false;

let cnvWidth = 640;
let cnvHeight = 480;
let myFont;
p.preload = function () {
  // Load the faceMesh model
  song = p.loadSound('../assets/01-Wet-Land-Min.mp3');
  faceMesh = ml5.faceMesh(options, () => {
    isModelReady = true;
    p.setup()}
  );
}
p.setup = function () {

  console.log('setup')
  myFont = p.loadFont('../assets/PPMondwest-Regular.otf');

  p.createCanvas(cnvWidth/2, cnvHeight/2);
  // p.drawingContext.filter = 'blur(12px)'

  // Create the webcam video and hide it
  video = p.createCapture(p.VIDEO);
  video.size(cnvWidth, cnvHeight);
  video.hide();
  // Start detecting faces from the webcam video
  if (faceMesh) {
    faceMesh.detectStart(video, gotFaces);
  }
  p.frameRate(24);
  p.imageMode(p.CENTER);

  let gradient = p.drawingContext.createRadialGradient(
    p.width/2, p.height/2, p.width/8,  // inner circle
    p.width/2, p.height/2, p.width/4  // outer circle
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,1)');
  
  p.drawingContext.fillStyle = gradient;
  p.drawingContext.fillRect(0, 0, p.width, p.height);
  
  
}

p.draw = function () {
  if (!isModelReady) {
    console.log('model not ready')
    p.background(255);
    p.fill(0);
    p.textSize(24);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont(myFont)
    p.text('mirror mirror on the wall...', cnvWidth/4, cnvHeight/4);
    return;
  }
  // Draw the webcam video
  // webcamPermissions();
  p.image(video, cnvWidth/4, cnvHeight/4, cnvWidth/2, cnvHeight/2);
  // p.filter(p.BLUR, 8);

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    // console.log(face)

//  Drawing face points
    for (let j = 0; j < leftEyeTop.length; j++) {
      let keypointLET = face.keypoints[leftEyeTop[j]]
      let keypointRET = face.keypoints[rightEyeTop[j]]

      let keypointLEB = face.keypoints[leftEyeBot[j]]
      let keypointREB = face.keypoints[rightEyeBot[j]]
      p.noStroke();
      p.fill(0, 255, 0);
      p.circle(keypointLET.x, keypointLET.y, 2);
      p.circle(keypointRET.x, keypointRET.y, 2);

      p.fill(255, 0, 0);
      p.circle(keypointLEB.x, keypointLEB.y, 2);    
      p.circle(keypointREB.x, keypointREB.y, 2);     
    }
    

//  ––––––––––––––
    
    let leftEyeClosedDist = calcDistance(
      face.keypoints[LEFT_TOP], 
      face.keypoints[LEFT_BOT]);
    let rightEyeClosedDist = calcDistance(
      face.keypoints[RIGHT_TOP], 
      face.keypoints[RIGHT_BOT]);
    
    // p.drawingContext.filter = 'blur(20px)'


//     Preventing blinks from registering
//     Eyes must be closed for at least 500ms for sound to trigger. 
    if (leftEyeClosedDist <= CLOSED_THRESHOLD && rightEyeClosedDist <= CLOSED_THRESHOLD) {
    //  Eyes are closed
      if (isEyeOpen) {
      isEyeOpen = false;
      eyeCloseStartTime = p.millis();
      } else {
      //  Eye is closed
        if (p.millis() - eyeCloseStartTime >= CLOSE_DURATION_THRESHOLD ) {
          playSound();
          document.getElementById('blackout').style.opacity = '0.95';
          document.getElementById('textInput').removeAttribute("disabled")
          document.getElementById('textInput').click();
          document.getElementById('textInput').focus();

        }
      }
    } else {
      
    //  eyes are open. 
      if (!isEyeOpen) {
        isEyeOpen = true;
        pauseSound();
        document.getElementById('blackout').style.opacity = '0.1';
        document.getElementById('textInput').setAttribute("disabled","")


      }
    }
  }
  // Inner Shadow Dreamy Effect
  let gradient = p.drawingContext.createRadialGradient(
    p.width/2, p.height/2, p.width/8,  // inner circle
    p.width/2, p.height/2, p.width/4  // outer circle
  );
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,1)');
  
  p.drawingContext.fillStyle = gradient;
  p.drawingContext.fillRect(0, 0, p.width, p.height);
  
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  // console.log('gotFaces', results)
  faces = results;
}

// Calculates euclidian distance
function calcDistance (a, b) {
  return p.sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
}

function playSound () {
  if (!song.isPlaying()) {
    console.log('playing')
    song.setVolume(1)
    song.play();
    
  }
}

function pauseSound() {
// This is meant to fade out sound but doesn't work as intended... oh well
  if (song.isPlaying()) {
    song.setVolume(0, 1, 1);
    
    setTimeout(function () {
      song.pause();
      console.log('pausing')
    }, 1000)
  }
}

// function webcamPermissions () {
//   navigator.permissions.query({ name: "camera" }).then(res => {
//       if(res.state == "granted"){
//           // has permission
//         document.querySelector('#title').innerHTML = "Close your eyes..."
//       }
//   });
// }

}
