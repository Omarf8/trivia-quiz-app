// Global Variables
let questions = [] // Store the requested trivia info
let questionNum = 0 // Keep track of our current question
let score = 0
let selectedButton = null
let startTime = 0
let endTime = 0
let isFetching = false

// DOM Selection
let loadingScreen = document.getElementById("loading")
let startScreen = document.getElementById("start-screen")
let quizScreen = document.getElementById("quiz")
let endScreen = document.getElementById("end-screen")
let startButton = document.getElementById("start-button")
let answerButtons = document.querySelectorAll(".answer")
let confirmButton = document.getElementById("confirm")
let nextButton = document.getElementById("next")
let playAgain = document.getElementById("play-again")
let winningStatus = document.getElementById("win-status")
let finalScore = document.getElementById("score")
let timeElapsed = document.getElementById("timer")

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
    if(isFetching) { return }
    isFetching = true

    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")

    // API Error when fetching too often
    if(response.status === 429) {
        loadingScreen.innerHTML = `
            <h1>Too many requests detected.</h1>
            <h1>Please wait a moment...</h1>
            <button id="retry-btn">Try Again</button>
        `
        
        document.getElementById("retry-btn").addEventListener("click", () => {
            loadingScreen.innerHTML = "<h1>Loading questions...</h1>"
            isFetching = false
            fetchQuestions()
        })

        return
    }

    const data = await response.json()

    if(data.results && data.results.length > 0) {
        questions = data.results
        loadingScreen.style.display = "none"
        startScreen.style.display = "flex"
    }
    else {
        console.error("No questions returned")
        alert("Failed to load questions. Please try again later.")
    }

    isFetching = false
}

// Game Logic
function populateQuestion() {
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
        if(button.textContent === decodeHTML(questions[questionNum].correct_answer)) {
            button.classList.add("correct")
        }
    })

    if(selectedButton && selectedButton.classList.contains("correct")) { 
        score++ 
    }
    else {
        selectedButton.classList.add("incorrect")
    }

    selectedButton = null

    confirmButton.style.display = "none"
    nextButton.style.display = "block"
}

function showEndScreen() {
    endTime = Date.now()

    let ms = endTime - startTime
    let totalSec = Math.floor(ms / 1000)

    let min = Math.floor(totalSec / 60)
    let sec = totalSec % 60

    quizScreen.style.display = "none"
    endScreen.style.display = "flex"

    if(score > 5) {
        winningStatus.textContent = "You Passed!"
    }
    else {
        winningStatus.textContent = "Better Luck Next Time!"
    }

    finalScore.textContent = `${score}/10`
    timeElapsed.textContent = `${min}:${sec.toString().padStart(2, '0')}`
}

async function reset() {
    if(isFetching) { return }

    questionNum = 0
    score = 0
    selectedButton = null
    startTime = 0
    endTime = 0

    endScreen.style.display = "none"
    loadingScreen.style.display = "flex"

    await fetchQuestions()
}

// Event Listeners
startButton.addEventListener("click", function() {
    startScreen.style.display = "none"
    quizScreen.style.display = "flex"

    startTime = Date.now()

    populateQuestion()
})

playAgain.addEventListener("click", reset)

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

fetchQuestions()