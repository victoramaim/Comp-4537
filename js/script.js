// chatGPT has been used as a reference for this project
// Button class represents a button in the memory game
class Button {
  // Constructor takes a number and initializes the button
  constructor(number) {
    this.button = document.createElement('button');
    this.number = number;
    this.initButton();
  }

  // Initialize the button with number and random color
  initButton() {
    this.button.innerText = this.number;
    this.button.style.backgroundColor = this.getRandomColor();
  }

  // Generate a random color for the button background
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Add the button to a given container
  addToContainer(container) {
    container.appendChild(this.button);
  }

  // Hide the number on the button
  hideNumber() {
    this.button.innerText = '';
  }

  // Show the number on the button
  showNumber(number) {
    this.button.innerText = number;
  }

  // Set the position of the button using absolute coordinates
  setPosition(x, y) {
    this.button.style.position = 'absolute';
    this.button.style.left = `${x}px`;
    this.button.style.top = `${y}px`;
  }

  // Set the callback function for the button click event
  onClick(callback) {
    this.button.onclick = callback;
  }
}

// MemoryGame class manages the overall game logic
class MemoryGame {
  // Constructor initializes the game variables
  constructor() {
    this.numButtons = 0;
    this.buttonContainer = document.getElementById('buttonContainer');
    this.buttons = [];
    this.clickedButtons = [];
  }

  // Clear all the buttons from the container
  clearButtons() {
    this.buttonContainer.innerHTML = '';
    this.buttons = [];
  }

  // Create buttons based on the number of buttons specified by the user
  createButtons() {
    for (let i = 1; i <= this.numButtons; i++) {
      const button = new Button(i);
      this.buttons.push(button);
      button.addToContainer(this.buttonContainer);
    }
  }

  // Shuffle the buttons by setting random positions
  shuffleButtons() {
    this.buttons.forEach(button => {
      const xPos = Math.random() * (window.innerWidth - 250);
      const yPos = Math.random() * (window.innerHeight - 250);
      button.setPosition(xPos, yPos);
    });
  }

  // Start the memory game
  startGame() {
    this.numButtons = parseInt(document.getElementById('numButtons').value, 10);

    // Validate the number chosen by the user
    if (this.numButtons >= 3 && this.numButtons <= 7) {
      this.displayButtons();

      // Shuffle the buttons multiple times before making them clickable
      setTimeout(() => {
        this.shuffleButtons();
        let count = 0;
        const interval = setInterval(() => {
          if (count < this.numButtons) {
            this.shuffleButtons();
            count++;
          } else {
            clearInterval(interval);
            this.hideNumbers();
            this.makeClickable();
          }
        }, 2000);
      }, this.numButtons * 1000); // Wait for the buttons to be created based on the number of buttons
    } else {
      alert(`${messages.numberOutOfRange}`);
    }
  }

  // Display the buttons on the screen
  displayButtons() {
    this.clearButtons();
    this.createButtons();
  }

  // Hide the numbers on all buttons
  hideNumbers() {
    this.buttons.forEach(button => {
      button.hideNumber();
    });
  }

  // Make the buttons clickable and associate a callback function
  makeClickable() {
    this.buttons.forEach((button, index) => {
      button.onClick(() => this.checkOrder(index + 1));
    });
  }

  // Check if the button clicked is in the correct order
  checkOrder(clickedNumber) {
      const expectedNumber = this.clickedButtons.length + 1;

      if (clickedNumber === expectedNumber) {
        const currentButton = this.buttons[clickedNumber - 1];
        currentButton.button.innerText = clickedNumber; // Display the correct number

        this.clickedButtons.push(clickedNumber);

        if (this.clickedButtons.length === this.numButtons) {
          if (this.clickedButtons.every((value, index) => value === index + 1)) {
            // All buttons clicked in the correct order
            setTimeout(()  => {
              alert(`${messages.alertExcellentMemory}`);
              this.clearButtons();
            }, 100);
          } else {
            // Buttons clicked in the wrong order
            alert(`${messages.alertWrongOrder}`);
            this.revealNumbers();
          }
        }
      } else {
        // Button clicked in the wrong order
        alert(`${messages.alertWrongOrder}`);
        this.revealNumbers();
      }
 
  }

  // Reveal the numbers on all buttons
  revealNumbers() {
    this.buttons.forEach((button, index) => {
      button.showNumber(index + 1);
    });
  }
}

// Event listener for the DOMContentLoaded event to start the game
document.addEventListener('DOMContentLoaded', function () {
  // Create input elements
  const label = document.createElement('label');
  label.setAttribute('for', 'numButtons');
  label.textContent = `${messages.howManyButtons}`;

  const input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.setAttribute('id', 'numButtons');
  input.setAttribute('min', '3');
  input.setAttribute('max', '7');

  const goButton = document.createElement('input');
  goButton.setAttribute('type', 'button');
  goButton.setAttribute('id', 'go');
  goButton.setAttribute('value', 'GO');
  goButton.addEventListener('click', startGame);

  // Create div for button container
  const buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('id', 'buttonContainer');

  // Append elements to the body
  document.body.appendChild(label);
  document.body.appendChild(document.createElement('br'));
  document.body.appendChild(input);
  document.body.appendChild(goButton);
  document.body.appendChild(document.createElement('br'));
  document.body.appendChild(buttonContainer);

  // Load the memory game
  startGame();
});

// Callback function for the GO button click event
function startGame() {
  const game = new MemoryGame();
  game.startGame();
}
