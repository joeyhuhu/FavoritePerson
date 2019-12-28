
/***************************************************************************************
Reference:
*    Title: <Steering Text Paths>
*    Author: <Daniel Shiffman>
*    Date: <Feb 21, 2017>
*    Availability: <https://editor.p5js.org/codingtrain/sketches/VDLbnxyQe>
*
***************************************************************************************/
/***************************************************************************************
*    Title: <Bouncy Bubbles>
*    Author: <P5 Example>
*    Availability: <https://p5js.org/examples/motion-bouncy-bubbles.html>
*
***************************************************************************************/
/***************************************************************************************
*    Title: <Heart Shape>
*    Author: <Mithru>
*    Availability: <https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg>
*
***************************************************************************************/
/***************************************************************************************
Music:
*    Title: < I Don't Care (Remix) >
*    Author: <Ed Sheeran & Justin Biebe| FlipTunesMusic™r>
*    Availability: <https://www.youtube.com/watch?v=RP7147-eprU>
***************************************************************************************/
let input;
let h1;
let font;
let vehicles = [];
var foo=1.5;
let slider;
let button;
let fr=10;
let speech;
let song;
let click=1;
let numHearts = 8;
let spring = 0.01;
let gravity = -0.1;
let friction = -1.01;
let hearts = [];



//preload the font and music
function preload() {
  font = loadFont('Bakeapple_DEMO.otf');
		song=loadSound('_128k.mp3')
}

function setup() {
  frameRate(fr);
	
  createCanvas(1200,600); 
rectMode(CENTER);
	//create input box for user to input their value	
	input=createInput('');
	input.size(250,30);
  input.position(400,400);
 var points = font.textToPoints(input.value(), 900, 120, 300, {
    sampleFactor: 0.05
  });
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x+200, pt.y);
    vehicles.push(vehicle);
  }

	//create buttons and slider for user to start and reset the system
	button1='click me'
   button = createButton(button1);
  button.position(700, 400);
  button.size(80, 30);
  button.mousePressed(start);
   button = createButton('reset');
  button.position(800,400);
  button.size(80, 30);
  button.mousePressed(reset);
	  slider = createSlider(0, 255, 100);
  slider.position(800, 455);

speech=new p5.Speech();
	
	//create a array of heart object
	for (let i = 0; i < numHearts; i++) {
    hearts[i] = new Heart(
      random(width),
      random(height),
      random(10,30),
      i,
      hearts
    );
  }
 fill(175);

}


function draw() {
  background(0);
	textSize(32);
	
	//use slider to control the volume
	let volumne=map(slider.value(),0,255,0,1);
	song.setVolume(volumne);
let s1 = 'Type the Name of Your Favorite Person';
	let s2='Music Volume';
	let s3='Try to touch the hearts with your mouse';
	let s4='*input less than 9 characters'
fill(255);
text(s1, 320, 60);
	noStroke();
		textSize(14);
	text(s2,700,470);
		textSize(12);
	text(s3,470,90);
	text(s4,400,460);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
	//create a array of heart object with methods
	hearts.forEach(heart => {
    heart.collide();
    heart.move();
    heart.display();
		heart.mouse();
  });
}

//create a vehicle object with method to simulate the action
class Vehicle {
  constructor(x, y) {
    this.pos = createVector(random(width), random(height));
		this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 5;
    this.maxspeed = 25;
    this.maxforce = foo;
		this.color=color(random(175,255),random(125,255),random(15,255));
  }
//the mouse interaction with the object
  behaviors() {
    var arrive = this.arrive(this.target);
    var mouse = createVector(mouseX, mouseY);
    
    var flee = this.flee(mouse);
    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
    this.color=color(random(175,255),random(125,255),random(155,255));
  
  }

  applyForce(f) {
    this.acc.add(f);
  }
//add a pixel to to random new location
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
//show each of the pixcel
  show() {
    stroke(this.color);
    strokeWeight(this.r);
    rect(this.pos.x, this.pos.y,1,1);
  }

//the pixcel to arrive the target location with a maxspeed
  arrive(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }
// the pixcel would flee away from the target location with a maxspeed
  flee(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 50) {
      desired.setMag(this.maxspeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
  
}
//create a heart class
class Heart {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
  }
//prevent overlap by calculate the distance between each heart
  collide() {
    for (let i = this.id + 1; i < numHearts; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }
//movement of the heart object
  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }
	
	//mouse interaction with the hearts
	
mouse(){

if(mouseX>this.x-this.diameter&&mouseX<this.x+this.diameter&&mouseY>this.y-this.diameter&&mouseY<this.y+this.diameter){
	this.diameter=100;
}else{
	this.diameter=random(8,15);
}
}
  display() {
noFill();
     beginShape();
  vertex(this.x, this.y);
  bezierVertex(this.x - this.diameter / 2, this.y - this.diameter / 2, this.x - this.diameter, this.y + this.diameter / 3, this.x, this.y + this.diameter);
  bezierVertex(this.x + this.diameter, this.y + this.diameter / 3, this.x + this.diameter / 2, this.y - this.diameter / 2, this.x, this.y);
  endShape(CLOSE);
  }
}
//the status of the system would change, and the pixcel would start to appear after clicking 'click me'
function start(){
	
if(click!=0){
 var points = font.textToPoints(input.value(), 220, 300, 210, {
    sampleFactor: 0.1
  });
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y);
    vehicles.push(vehicle);
}
	//use speech function to speack out the input value
speech.speak('You are my favorite');
	speech.speak(input.value());
	song.play();
	click=0;
}else{
	noStroke();
	textSize(12);
	fill(255,0,0);
text('Please reset', 700, 450);	
}
}

//the system status would reset when click reset
 function reset(){
 vehicles.length=0;
	noStroke();
	 if(song.isPlaying()){
	 song.stop();
		 input.value('');
	 }
	 click=1;
}

