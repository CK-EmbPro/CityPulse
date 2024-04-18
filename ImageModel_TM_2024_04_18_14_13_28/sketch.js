// Classifier Variable
let classifier;
// Model URL
let imageModelURL = './citypulse-model/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Serial port object
let serial;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(1920, 1080);
  // Create the video
  video = createCapture(VIDEO);
  video.size(1920, 1080);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();

  // Initialize serial port
  serial = new p5.SerialPort();

  // Set serial port parameters
  serial.open("/dev/ttyACM0"); 
  serial.on('open', () => {
    console.log('Serial port opened');
  });
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

  // Send classification label to Arduino
  serial.write(label);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();

}

// When we get a result
function gotResult(error, results) {
  // If there is an error
console.log(results)
if(results[0].label=="zebra-crossing-busy"){
  serial.write("1")

}
else{
  serial.write("0")
}
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
