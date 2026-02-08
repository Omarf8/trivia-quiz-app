let startScreen = document.getElementById("start-screen")
let quizScreen = document.getElementById("quiz")
let startButton = document.getElementById("start-button")

startButton.addEventListener("click", function() {
    startScreen.style.display = "none"
    quizScreen.style.display = "block"
})

