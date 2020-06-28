//Aliases
let Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache
    Graphics = PIXI.Graphics,
    Text = PIXI.Text
    TextStyle = PIXI.TextStyle;


//Create a Pixi Application
let app = new Application({ 
    width: 512, 
    height: 512,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done

loader
  .add("treasureHunter.json")
  .load(setup);

let secondCharacter, secondSword;
let firstCharacter, firstSword;

function setup() {
  firstCharacter = new Graphics();
  firstCharacter.diameter = true;
  firstCharacter.beginFill(0x9966FF);
  // firstCharacter.drawCircle(0, 0, 32);
  firstCharacter.drawRect(0, 0, 32, 32);
  firstCharacter.endFill();
  firstCharacter.x = 64;
  firstCharacter.y = 130;


  // const a = Circle.Circle(firstCharacter);



  firstSword = new Graphics();
  firstSword.diameter = true;
  firstSword.beginFill(0x9966FF);
  firstSword.drawRect(0, 0, 10, 10);
  firstSword.endFill();
  firstSword.x = firstCharacter.x + 32;
  firstSword.y = firstCharacter.y;

  secondCharacter = new Graphics();
  secondCharacter.diameter = true;
  secondCharacter.beginFill(0x9966FF);
  secondCharacter.drawRect(0, 0, 32, 32);
  // secondCharacter.drawCircle(0, 0, 32);
  secondCharacter.endFill();
  secondCharacter.x = 113;
  secondCharacter.y = 130;

  secondSword = new Graphics();
  secondSword.beginFill(0x9966FF);
  secondSword.drawRect(0, 0, 10, 10);
  secondSword.endFill();
  secondSword.x = secondCharacter.x + 32;
  secondSword.y = secondCharacter.y;

  firstSword.circular = true;
  secondCharacter.circular = true;

  let hit = keyboard(32);

  hit.press = function() {
    firstSword.x = firstCharacter.x + 45;
  }

  hit.release = function() {
    // move to previous position
    firstSword.x = firstCharacter.x + 32;
  }

  state = play;
  
  app.stage.addChild(firstCharacter);
  app.stage.addChild(secondCharacter);
  app.stage.addChild(secondSword);
  app.stage.addChild(firstSword);

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  state(delta);
}

function play() {
  b = new Bump(PIXI);

  if (b.hit(firstSword, secondCharacter)) {
    console.log('hit!');
  } else {
    console.log('no hit');
  }
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}