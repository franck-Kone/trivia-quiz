// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

const body = document.body
body.textContent = '';

//Create Nodes , and variables
let score = 0
let index = 0
let instructionsInterval
let displayDivTimeOut
let answerTime = 45
let answerTimeInterval;
let questionsByCategoryArray = []

const mainDiv = document.createElement('main'),
    header = `<header><img src ="./image/kenzie.png" alt= logo>
<h1 class="game-title">Trivia Quiz</h1><h2>Score:&nbsp<span class="score">0</span></h2></header>`,
    gameBox = document.createElement('div'),
    questionText = document.createElement('h1'),
    userInput = document.createElement('input'),
    submitButton = document.createElement('button'),
    congratDiv = document.createElement('div'),
    continueButton = document.createElement('button'),
    gameOverDiv = document.createElement('div'),
    resetButton = document.createElement('button'),
    gameOverTitle = document.createElement('h1'),
    instructionDiv = document.createElement('div'),
    startGameButton = document.createElement('button'),
    instructions = "You will be shown questions that You can respond to and receive points for answering correctly.If you answer incorrectly, the score and game reset.",
    answerTimeLimit = document.createElement('h1')


//Set nodes content
mainDiv.innerHTML = header
submitButton.textContent = 'Submit'
continueButton.innerHTML = 'Continue'
gameOverTitle.innerHTML += 'Game <span>😭</span>ver'
resetButton.innerHTML = 'Restart'
startGameButton.textContent = 'Start'
answerTimeLimit.innerHTML = 'Timer : <span class="timerCount">45</span>'

//Set classes and attributes
gameBox.className = 'gameBox'
questionText.className = 'question'
submitButton.className = 'submit'
congratDiv.className = 'congrat'
continueButton.className = 'skip'
gameOverDiv.className = 'gameOver'
resetButton.className = 'restart'
instructionDiv.className = 'instruction-container'
startGameButton.className = 'start-button'
answerTimeLimit.className = 'timer-display'

userInput.setAttribute('placeholder', 'Please Enter Your Answer Here!')
userInput.setAttribute('id', 'userAnswer')
userInput.autofocus
userInput.setAttribute('autocomplete', 'off')

//Insert nodes in their parents
gameBox.append(answerTimeLimit, questionText, userInput, submitButton)
mainDiv.append(gameBox)
body.append(mainDiv, gameOverDiv)
gameOverDiv.append(gameOverTitle, resetButton)

// Display instructions
gameInstruction()

function gameInstruction() {

    clearInterval(instructionsInterval)
    let instructionBody = `<h1>Hey! Do You Want to Check For Your IQ?</h1><h2>Instructions</h2><p>`
    const instructions = "You will be shown questions that You can respond to and receive points for answering correctly.If you answer incorrectly, the score and game reset."

    if (index < instructions.length) {
        instructionBody += instructions.slice(0, index + 1)
        instructionBody += '</p>'

        instructionDiv.innerHTML = instructionBody
        mainDiv.append(instructionDiv)

        instructionsInterval = setInterval(() => {
            index++
            gameInstruction()
        }, 100)
    }
    if (index === instructions.length) {
        instructionDiv.append(startGameButton)
    }
}

//Fetching data query Q and A
queryQandA()
async function queryQandA() {

    await fetch('https://jservice.kenzie.academy/api/random-clue?valid=true').then(response => {

        if (response.status !== 200) {

            console.error('Data Not Fetched')
        }

        return response.json()

    }).then(async (result) => {

        const categoryId = result.categoryId

        return await fetch(`https://jservice.kenzie.academy/api/clues?category=${categoryId}`).then(secondResponse => {

            if (secondResponse.status !== 200) {
                console.error('Data with this particular categoryId could not be fetched')
            }
            return secondResponse.json()
        }).then(secondResult => {

            const randomCategory = Math.round(Math.random() * 99)

            for (let clueIndex = 0; clueIndex < secondResult.clues.length; clueIndex++) {
                if (questionsByCategoryArray.length < 100 && clueIndex !== secondResult.clues.length - 1) {
                    questionsByCategoryArray.push(secondResult.clues[clueIndex])
                }
                if (questionsByCategoryArray.length < 100 && clueIndex === secondResult.clues.length - 1) {
                    questionsByCategoryArray.push(secondResult.clues[clueIndex])
                    queryQandA()
                }
            }

            if (questionsByCategoryArray.length === 100) {

                return updateQuestionAndScore(questionsByCategoryArray[randomCategory])
            }
        })
    })
}

//Update score if right answer and show up game over if wrong
function updateQuestionAndScore(questionAndAnswerObject) {

    const question = questionAndAnswerObject.question
    const categoryTitle = questionAndAnswerObject.category.title
    const rightAnswer = questionAndAnswerObject.answer
    questionText.innerText = `CATEGORY: ${categoryTitle}\n\nQUESTION: ${question}`
    console.log(rightAnswer)

    submitButton.onclick = () => {

        if (userInput.value.toLowerCase() === rightAnswer.toLowerCase()) {
            answerTime = 46
            clearInterval(answerTimeInterval)
            score++
            userInput.value = ''
            mainDiv.style.filter = 'blur(8px)'
            congratDiv.style.animation = "celebration 2.9s linear "
            gameBox.style.display = 'none'

            congratulation()

            //End game
        } else {
            endGame()
        }
        document.querySelector('.score').innerText = score
    }
}

//Celebration right answers
function congratulation() {

    const randomCategory = Math.round(Math.random() * 99)

    congratDiv.style.display = 'flex'
    const congratMessage = `<h1>Bravooo...!</h1>\n<p>🥳Your score is Increasing🥳</p>\n<p>New Score:<span>${score}</span></p>`
    congratDiv.innerHTML = congratMessage

    // Continue to play after answering correctly a question, and pressing on continueButton 
    continueButton.addEventListener('click', () => {

        congratDiv.style.animation = "resumeCongratulation 2s linear"
        gameBox.style.display = 'flex'

        updateQuestionAndScore(questionsByCategoryArray[randomCategory])

        mainDiv.style.filter = 'blur(0)'

        displayDivTimeOut = setTimeout(() => {
            congratDiv.style.display = 'none'
        }, 1000)

        timerCounter()
    })

    congratDiv.append(continueButton)
    body.append(congratDiv)
}

//Start Game
startGameButton.addEventListener('click', () => {
    instructionDiv.style.display = 'none'
    gameBox.style.display = 'flex'
    // queryQandA()
    timerCounter()
})

//Reset Game
resetButton.addEventListener('click', () => {
    gameOverDiv.style.animation = 'resumeGameOverAnime 2s ease-out'
    answerTime = 46

    if (gameOverDiv.style.display === 'flex') {

        displayDivTimeOut = setTimeout(() => {
            gameOverDiv.style.display = 'none'
            mainDiv.style.animation = 'gameResetAnime 750ms linear'
            mainDiv.style.display = 'flex'

        }, 1000)
    }

    questionsByCategoryArray = []
    queryQandA()
    timerCounter()
})

// game answerTime counter
function timerCounter() {
    const timerCount = document.querySelector('.timerCount')

    return (function recursive() {
        clearInterval(answerTimeInterval)

        answerTime >= 30 ? timerCount.style.color = "darkblue" : answerTime >= 20 ? timerCount.style.color = "orange" : answerTime >= 10 ? timerCount.style.color = "yellow" : timerCount.style.color = "red"

        if (answerTime > 0) {
            answerTimeInterval = setInterval(() => {
                answerTime--
                timerCount.innerText = answerTime
                recursive()

            }, 1000)
        } else {
            document.querySelector('.timerCount').innerText = 0
            endGame()
        }
    })()
}

// Game Over
function endGame() {
    score = 0
    document.querySelector('.score').innerText = score

    mainDiv.style.display = 'none'
    body.style.background = 'radial-gradient(closest-side, black, darkred, black)'
    gameOverDiv.style.display = 'flex'
    gameOverDiv.style.animation = "setGameOverAnime 1.5s ease-out"
    userInput.value = ''
}