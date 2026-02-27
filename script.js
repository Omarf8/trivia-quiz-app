// Global Variables
let questions = [] // Store the requested trivia info
let questionNum = 0 // Keep track of our current question
let score = 0
let selectedButton = null

// DOM Selection
let loadingScreen = document.getElementById("loading")
let startScreen = document.getElementById("start-screen")
let quizScreen = document.getElementById("quiz")
let endScreen = document.getElementById("end-screen")
let startButton = document.getElementById("start-button")
let answerButtons = document.querySelectorAll(".answer")
let confirmButton = document.getElementById("confirm")
let nextButton = document.getElementById("next")
let winningStatus = document.getElementById("win-status")
let finalScore = document.getElementById("score")

// Utility Functions
function decodeHTML(text) {
    let temp = document.createElement("decodetext")
    temp.innerHTML = text
    return temp.textContent
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

// API Functions
async function fetchQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    const data = await response.json()
    // console.log(data)
    questions = data.results
    loadingScreen.style.display = "none"
    startScreen.style.display = "flex"
}

// Game Logic
function populateQuestion() {
    // startScreen.style.display = "flex"
    // Question portion
    let questionBox = document.getElementById("question")
    questionBox.textContent = decodeHTML(`${questionNum + 1}. ${questions[questionNum].question}`)

    // Answers portion
    let incorrectAnswers = questions[questionNum].incorrect_answers
    let correctAnswer = questions[questionNum].correct_answer
    let allAnswers = [...incorrectAnswers, correctAnswer]
    shuffleArray(allAnswers)

    answerButtons.forEach((answer, ind) => {
        answer.textContent = decodeHTML(allAnswers[ind])
        answer.classList.remove("selected")
        answer.classList.remove("correct")
        answer.classList.remove("incorrect")
        answer.disabled = false
    })

    confirmButton.style.display = "block"
    nextButton.style.display = "none"
}

function evaluateQuestion() {
    answerButtons.forEach(button => {
        button.classList.remove("selected")
        button.disabled = true
        if(button.textContent === questions[questionNum].correct_answer) {
            button.classList.add("correct")
        }
    })

    if(selectedButton && selectedButton.classList.contains("correct")) { score++ }
    if(selectedButton && !selectedButton.classList.contains("correct")) { selectedButton.classList.add("incorrect") }

    selectedButton = null

    confirmButton.style.display = "none"
    nextButton.style.display = "block"
}

function showEndScreen() {
    quizScreen.style.display = "none"
    endScreen.style.display = "flex"

    if(score > 5) {
        winningStatus.textContent = "You Passed!"
    }
    else {
        winningStatus.textContent = "Better Luck Next Time!"
    }

    finalScore.textContent = `${score}/10`
}

// Event Listeners
startButton.addEventListener("click", function() {
    startScreen.style.display = "none"
    quizScreen.style.display = "flex"
    populateQuestion()
})

// Initialize
answerButtons.forEach(button => {
    button.addEventListener("click", () => {
        answerButtons.forEach(btn => btn.classList.remove("selected")) // Remove the selected attribute from all buttons
        button.classList.add("selected") // Make the current button become selected
        selectedButton = button
    })
})

confirmButton.addEventListener("click", () => {
    if(selectedButton) {
        evaluateQuestion()
    }
})

nextButton.addEventListener("click", () => {
    questionNum++;

    if(questionNum < questions.length) {
        populateQuestion()
    }
    else {
        showEndScreen()
    }
})

// fetchQuestions()