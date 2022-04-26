// This constant defines the math operations we support
// TODO: Add support for division
const OPERATIONS = {
    "addition": {"symbol": "+", "calculate": (a, b) => a + b},
    "subtraction": {"symbol": "-", "calculate": (a, b) => a - b},
    "multiplication": {"symbol": "x", "calculate": (a, b) => a * b},
};

/**
 * Generate a pseudorandom integer between two values, inclusive
 */
 function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
        this.#operand1 = randomInteger(0, 25);
        this.#operand2 = randomInteger(0, 25);
        this.#correctAnswer = OPERATIONS[this.#operation].calculate(this.#operand1, this.#operand2);

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