document.getElementById('endButton').addEventListener('click', function () {
    document.getElementById('quizSection').style.display = 'block';
    loadQuiz();
});


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


const buttons = document.querySelectorAll('.button');
const startButton = document.getElementById('startButton');

function randomButtonPosition(button) {
    const width = document.querySelector('.white-box').offsetWidth - button.offsetWidth;
    const height = document.querySelector('.white-box').offsetHeight - button.offsetHeight;
    const randomLeft = Math.floor(Math.random() * width);
    const randomTop = Math.floor(Math.random() * height);
    button.style.left = randomLeft + 'px';
    button.style.top = randomTop + 'px';


}

let currentIndex = 0;

function setButton() {
    const currentButton = buttons[currentIndex];
    currentButton.style.display = 'block';
    currentButton.disabled = false;
    currentIndex = (currentIndex + 1) % buttons.length;
}

startButton.addEventListener('click', function () {
    setButton();
    startButton.style.display = 'none';
});

buttons.forEach(button => {
    button.addEventListener('click', function () {
        // Show the modal associated with the button
        const modalId = this.getAttribute('data-modal');
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show(button);

        modal.addEventListener('hidden.bs.modal', function () {
            this.style.display = 'none';
            const nextButton = document.querySelector('.button:not([style="display: block;"])');
            if (nextButton) {
                randomButtonPosition(nextButton);
                nextButton.style.display = 'block';
            } else {
                alert('Congratulations! You have pressed all the buttons.');
            }
        });
    });
});


window.addEventListener('resize', function () {
    buttons.forEach(button => {
        if (button.style.display === 'block') {
            randomButtonPosition(button);
        }
    });
});


