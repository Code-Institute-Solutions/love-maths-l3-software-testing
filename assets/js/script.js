/**
 * This main constant defines math operations we support
 * The `createQuestion` function needs to return an array of: [operand1, operand2, result]
 * TODO: Add support for subtraction
 */
const OPERATIONS = {
  addition: { symbol: "+", createQuestion: createAdditionQuestion },
  multiplication: { symbol: "x", createQuestion: createMultiplicationQuestion },
  division: { symbol: "÷", createQuestion: createDivisionQuestion },
};

/**
 * Generate a pseudorandom integer between two values, inclusive
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * The four basic arithmetic operations for easy unit testing:
 * addition, subtraction, multiplication and division.
 * To be called inside of each "create[operation name]Question" function
 */
function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num2 === 0 ? undefined : num1 / num2;
}

/**
 * Generate an addition question
 */
function createAdditionQuestion() {
  const augend = randomInteger(0, 100);
  const addend = randomInteger(0, 100);
  const sum = add(augend, addend);
  return [augend, addend, sum];
}

/**
 * Generate a multiplication question, where the multiplier is not too big
 */
function createMultiplicationQuestion() {
  const multiplicand = randomInteger(0, 20);
  const multiplier = randomInteger(0, 10);
  const product = multiply(multiplicand, multiplier);
  return [multiplicand, multiplier, product];
}

/**
 * Generate a multiplication question, being the inverse of a multiplication question
 * NOTE: This is intentionally implemented in a way that might be buggy ;)
 */
function createDivisionQuestion() {
  [multiplicand, multiplier, product] = createMultiplicationQuestion();
  return [product, multiplier, divide(product, multiplier)];
}

/**
 * Increment the score or incorrect counter in the DOM by 1
 * NOTE: This functionality is intentionally left outside of the GameEngine, to allow for an example exploit
 */
function incrementCounter(elemID) {
  document.getElementById(elemID).value++;
}

/**
 * The main class, which handles the game logic
 */
class GameEngine {
  #operation = "addition"; // The current game operation
  #operand1; // The first operand for the current question
  #operand2; // The second operand for the current question
  #correctAnswer; // The true answer for the current question

  get operation() {
    return this.#operation;
  }
  set operation(op) {
    if (OPERATIONS[op]) {
      this.#operation = op;
      this.newQuestion();
    } else {
      alert(`Unimplemented operation: ${op}, staying with ${this.#operation}`);
    }
  }

  // Generate a new question and update the DOM
  newQuestion() {
    document.getElementById("answer-box").value = "";
    document.getElementById("answer-box").focus();

    [this.#operand1, this.#operand2, this.#correctAnswer] =
      OPERATIONS[this.#operation].createQuestion();

    document.getElementById("operand1").textContent = this.#operand1;
    document.getElementById("operand2").textContent = this.#operand2;
    document.getElementById("operator").textContent =
      OPERATIONS[this.#operation].symbol;
  }

  // Check whether the user's answer is correct, update the counters and proceed to the next question
  checkAnswer() {
    let userAnswer = parseInt(document.getElementById("answer-box").value);

    if (userAnswer === this.#correctAnswer) {
      alert("Hey! You got it right! :D");
      incrementCounter("score");
    } else {
      alert(
        `Awwww.... you answered ${userAnswer}. The correct answer was ${
          this.#correctAnswer
        }!`
      );
      incrementCounter("incorrect");
    }

    this.newQuestion();
  }
}

// Wait for the DOM to finish loading before running the game
// Get the button elements and add event listeners to them
document.addEventListener("DOMContentLoaded", function () {
  let game = new GameEngine();

  for (let button of document.getElementsByTagName("button")) {
    if (button.dataset.operation === "submit") {
      button.addEventListener("click", function () {
        game.checkAnswer();
      });
    } else {
      button.addEventListener("click", function () {
        game.operation = this.dataset.operation;
      });
    }
  }

  document
    .getElementById("answer-box")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        game.checkAnswer();
      }
    });

  // Basic asserts
  console.assert(add(3, 5) === 8, "addition test1 failed");
  console.assert(add(1003, -5) === 998, "addition test2 failed");
  console.assert(isNaN(add(NaN, 5)), "addition test3 failed");

  console.assert(subtract(19, 5) === 14, "subtraction test1 failed");
  console.assert(subtract(19219, 11542) === 7677, "subtraction test2 failed");
  console.assert(subtract(-19, 5) === -24, "subtraction test3 failed");

  console.assert(multiply(3, 5) === 15, "multiplication test1 failed");
  console.assert(multiply(0, 0) === 0, "multiplication test2 failed");
  console.assert(
    multiply(9999, 9999) === 99980001,
    "multiplication test3 failed"
  );

  console.assert(divide(30, 5) === 6, "division test1 failed");
  console.assert(divide(0, 5) === 0, "division test2 failed");
  console.assert(divide(9999, 0) === undefined, "division test3 failed");

  game.newQuestion();
});
