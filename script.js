// Simple way to display the next screen to play the game
let startScreen = document.getElementById("start-screen")
let quizScreen = document.getElementById("quiz")
let startButton = document.getElementById("start-button")

startButton.addEventListener("click", function() {
    startScreen.style.display = "none"
    quizScreen.style.display = "block"
})

// Get the requested trivia info
let questions = []

async function fetchQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=10")
    const data = await response.json()
    questions = data
    // console.log(questions)
}

// fetchQuestions()
let questionNum = 0 // Keep track of our current question

function populateAnswers() {
    let answerBoxes = document.querySelectorAll(".answer")
    let incorrectAnswer = questions[questionNum].incorrect_answers
    let correctAnswer = questions[questionNum].correct_answer
    let allAnswers = [...incorrectAnswer, correctAnswer]
    shuffleArray(allAnswers)

    answerBoxes.forEach((answer, ind) => {
        answer.textContent = allAnswers[ind]
    })

    questionNum++; // Increment for the next time this func is called
}

function shuffleArray(arr) {
    let i = arr.length - 1
    while(i > 0) {
        let randomIndex = Math.floor((Math.random() * (i + 1))) // Get index from 0-i
        let tmp = arr[randomIndex]
        arr[randomIndex] = arr[i]
        arr[i] = tmp
        i--;
    }
}