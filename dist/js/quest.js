/*
This file contains the logic for the quiz and the game.
In the first section the code for the quiz is written.
 */

document.getElementById('endButton').addEventListener('click', function () {
    document.getElementById('quizSection').style.display = 'block';
    loadQuiz();
});

/*
The quiz questions are stored in an array of objects.
 */
const questions = [
    {
        question: "What is the first cryptocurrency?",
        options: ["Bitcoin", "Ethereum", "Ripple", "Litecoin"],
        answer: "Bitcoin"
    },
    {
        question: "Who is the creator of Bitcoin?",
        options: ["Satoshi Nakamoto", "Vitalik Buterin", "Charlie Lee", "Roger Ver"],
        answer: "Satoshi Nakamoto"
    },
    {
        question: "What technology is used to secure cryptocurrency transactions?",
        options: ["Blockchain", "Artificial Intelligence", "Cloud Computing", "Big Data"],
        answer: "Blockchain"
    }
];

/*
The function loadQuiz() is used to load the quiz questions and options to the DOM.
 */
function loadQuiz() {
    const quizQuestions = document.getElementById('quizQuestions');
    quizQuestions.innerHTML = '';

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <h4>Question ${index + 1}: ${question.question}</h4>
            <div>
                ${question.options.map((option, i) => `
                    <div>
                        <input type="radio" id="q${index}_option${i}" name="q${index}" value="${option}">
                        <label for="q${index}_option${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        quizQuestions.appendChild(questionElement);
    });
}
/*
The event listener is added to the submitQuiz button to calculate the score of the quiz.
 */
document.getElementById('submitQuiz').addEventListener('click', function () {
    let score = 0;
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name=q${index}]:checked`);
        if (selectedOption) {
            if (selectedOption.value === question.answer) {
                score++;
            }
        }
    });
    const quizSection = document.getElementById('quizSection');
    if (score === 3) {
        quizSection.innerHTML = `
        <h2>Quiz Score</h2>
        <p>Your score: ${score}/${questions.length}</p>
        <p>Congratulations! Here is your promo-code: </p>
    `;
    } else {
        quizSection.innerHTML = `
        <h2>Quiz Score</h2>
        <p>Your score: ${score}/${questions.length}</p>
        <p>Better luck next time </p>
        `;
    }
});

/*
This section hides the other buttons and displays the quiz section when the end button is clicked.
 */
document.getElementById('endButton').addEventListener('click', function () {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('endButton').style.display = 'none';
    document.getElementById('button1').style.display = 'none';
    document.getElementById('button2').style.display = 'none';
    document.getElementById('button3').style.display = 'none';
    document.getElementById('button4').style.display = 'none';
    document.getElementById('button5').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    loadQuiz();
});

/*
This section contains the logic for the buttons.
 */
const buttons = document.querySelectorAll('.button');
const startButton = document.getElementById('startButton');
let currentIndex = 0;

/*
The function randomButtonPosition() is used to randomly position the buttons on the screen.
 */
function randomButtonPosition() {

    const width = document.querySelector('.white-box').offsetWidth - buttons[currentIndex].offsetWidth;
    const height = document.querySelector('.white-box').offsetHeight - buttons[currentIndex].offsetHeight;
    const randomLeft = Math.floor(Math.random() * width);
    const randomTop = Math.floor(Math.random() * height);

    buttons[currentIndex].style.left = randomLeft + 'px';
    buttons[currentIndex].style.top = randomTop + 'px';
    buttons[currentIndex].style.display = 'block';


}
/*
The event listener is added to the buttons to hide the button that is clicked and display the next button.

 */

buttons.forEach(button => {
    button.addEventListener('click', function () {

        buttons[currentIndex].style.display = 'none';
        currentIndex++;
        randomButtonPosition();
    });
});

startButton.addEventListener('click', function () {
    randomButtonPosition();
    startButton.style.display = 'none';
});






