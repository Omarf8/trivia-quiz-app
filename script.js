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