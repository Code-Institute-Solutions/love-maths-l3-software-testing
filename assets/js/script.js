/**
 * This main constant defines math operations we support
 * The `createQuestion` function needs to return an array of: [operand1, operand2, result]
 * TODO: Add support for subtraction
 */
const OPERATIONS = {
    "addition": {"symbol": "+", "createQuestion": createAdditionQuestion},
    "multiplication": {"symbol": "x", "createQuestion": createMultiplicationQuestion},
    "division": {"symbol": "÷", "createQuestion": createDivisionQuestion},
};

/**
 * Generate a pseudorandom integer between two values, inclusive
 */
 function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an addition question
 */
function createAdditionQuestion() {
    const augend = randomInteger(0, 25);
    const addend = randomInteger(0, 25);
    const sum = augend + addend;
    return [augend, addend, sum];
}

/**
 * Generate a multiplication question, where the multiplier is not too big
 */
function createMultiplicationQuestion() {
    const multiplicand = randomInteger(0, 25);
    const multiplier = randomInteger(0, 10);
    const product = multiplicand * multiplier;
    return [multiplicand, multiplier, product];
}

/**
 * Generate a multiplication question, being the inverse of a multiplication question
 * NOTE: This is intentionally implemented in a way that might be buggy ;)
 */
function createDivisionQuestion() {
    [multiplicand, multiplier, product] = createMultiplicationQuestion();
    return [product, multiplier, multiplicand];
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
    #correctAnswer;  // The true answer for the current question

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
    
        [this.#operand1, this.#operand2, this.#correctAnswer] = OPERATIONS[this.#operation].createQuestion();

        document.getElementById('operand1').textContent = this.#operand1;
        document.getElementById('operand2').textContent = this.#operand2;
        document.getElementById('operator').textContent = OPERATIONS[this.#operation].symbol;
    }

    // Check whether the user's answer is correct, update the counters and proceed to the next question
    checkAnswer() {
        let userAnswer = parseInt(document.getElementById("answer-box").value);

        if (userAnswer === this.#correctAnswer) {
            alert("Hey! You got it right! :D");
            incrementCounter("score");
        } else {
            alert(`Awwww.... you answered ${userAnswer}. The correct answer was ${this.#correctAnswer}!`);
            incrementCounter("incorrect");
        }

        this.newQuestion()
    }
}

// Wait for the DOM to finish loading before running the game
// Get the button elements and add event listeners to them
document.addEventListener("DOMContentLoaded", function() {
    let game = new GameEngine();

    for (let button of document.getElementsByTagName("button")) {
        if (button.dataset.operation === "submit") {
            button.addEventListener("click", game.checkAnswer);
        } else {
            button.addEventListener("click", function() {
                game.operation = this.dataset.operation;
            });
        }
    }

    document.getElementById("answer-box").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            game.checkAnswer();
        }
    });

    game.newQuestion();
});