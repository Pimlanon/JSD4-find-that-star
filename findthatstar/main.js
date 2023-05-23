const prompt = require("prompt-sync")({ sigint: true });

const star = "🌟";
const ufo = "🛸";
const planet = "🌑";
const rocket = "🚀";

class Field {
  constructor(field) {
    this.field = field;
    this.playerY = 0; // row
    this.playerX = 0; // column
    this.isHard = false;
  }

  //if randomUFO = Math.random() < 0.3 : create ufo '🛸'
  //if randomUFO = Math.random() > 0.3 : create planet '🌑'
  static createMap(row, column) {
    let map = [];
    const ufoChance = 0.3;

    for (let i = 1; i <= row; i++) {
      let arr = [];
      for (let j = 1; j <= column; j++) {
        let randomUFO = Math.random();
        if (randomUFO < ufoChance) {
          arr.push(ufo);
        } else {
          arr.push(planet);
        }
      }
      // push arr that store '🌑' and '🛸' to map = []
      map.push(arr);
    }

    //craete random star : use do..while to make sure that 'star' will not overlap with 'planet' && 'ufo'
    let starLocationX;
    let starLocationY;
    do {
      starLocationX = Math.floor(Math.random() * column);
      starLocationY = Math.floor(Math.random() * row);
    } while (
      map[starLocationY][starLocationX] !== planet &&
      map[starLocationY][starLocationX] !== ufo
    );
    map[starLocationY][starLocationX] = star;

    return map;
  }

  //create guideline about how to play
  play() {
    this.hardMode();
    this.generatePlayer();
    this.print();
    this.inputFromPrompt();
  }

  inputFromPrompt() {
    let move = prompt(`Which way? (press: w, a, s, d)`);
    //tell player to press only w, a, s, d
    if (move !== "w" && move !== "s" && move !== "a" && move !== "d") {
      console.log(`Please press w (up), s (down), a (left), or d (right)`);
      this.inputFromPrompt();
    } else {
      this.player(move);
    }
  }

  hardMode() {
    while (true) {
      const isHard = prompt("Hard Mode Y/N : ");

      if (isHard.toLowerCase() === "y") {
        this.isHard = true;
        // Generate map 15*25 for hard mode
        this.field = Field.createMap(15, 25);
        break;
      } else if (isHard.toLowerCase() === "n") {
        this.isHard = false;
        // Generate map for easy mode
        // Add code for generating map for easy mode here
        break;
      } else {
        console.log("Please type 'y' or 'n' to start");
      }
    }
  }

  //create player : *
  generatePlayer() {
    if (this.isHard) {
      const numRows = this.field.length;
      const numColumns = this.field[0].length;
      let validPosition = false;

      while (!validPosition) {
        this.playerY = Math.floor(Math.random() * numRows);
        this.playerX = Math.floor(Math.random() * numColumns);

        if (this.field[this.playerY][this.playerX] === planet) {
          validPosition = true;
        }
      }

      this.field[this.playerY][this.playerX] = rocket;
    } else {
      this.field[this.playerY][this.playerX] = rocket;
    }
  }

  //generate map
  print() {
    console.clear();
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  //check move
  player(move) {
    switch (move) {
      case "w":
        this.playerY -= 1;
        break;
      case "s":
        this.playerY += 1;
        break;
      case "a":
        this.playerX -= 1;
        break;
      case "d":
        this.playerX += 1;
        break;
    }

    if (this.playerY < 0 || this.playerX < 0) {
      console.log("Rocket signal lost.");
      return;
    }

    const target = this.field[this.playerY][this.playerX];
    if (target === planet) {
      // move player to the new position
      this.field[this.playerY][this.playerX] = rocket;

      // update map after player moved
      this.print();

      // use created propmt to ask for the next move of player
      this.inputFromPrompt();

      //if player moves to hole
      return;
    }

    if (target === ufo) {
      console.log("Oh no! you got kidnapped by mysterios UFO 🛸");
      return;
    }

    if (target === star) {
      console.log("Congratz! You found GLOWING STAR 🌟!");
      return;
    }
  }
}

const myMap = new Field(Field.createMap(5, 15));

myMap.play();
