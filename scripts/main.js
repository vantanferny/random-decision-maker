let spinBtn
let addBtn
let showOptionsBtn
let hideOptionsBtn
let popUpMessage
let ctx
let choices = {}
let spinAngle = 5400
let optionInput
let defaultPopUpMessageCounter = 0

const CX = 225
const CY = 225
const RADIUS = 200
const CIRCLE_TOP = -0.5
const DEFAULT_POP_UP_MESSAGE = "Just a friendly reminder: <br><br> You are the captain of your fate, master of your soul, and author of your own life story.<br><br> You're free and capable of doing what you want.<br><br> Expressing my sincerest best of luck with your life decisions."

let gagoMode = false
let gagoModeToggleCounter = 0
const GAGO_MESSAGES = ["IKAW", "BAHALA", "GAGO"]

window.onload = function() {
    initVariables()

    spinBtn.onclick = spin
    addBtn.onclick = addOption

    showOptionsBtn.onclick = showOptions
    hideOptionsBtn.onclick = hideOptions

    optionInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) addBtn.click()

        if (optionInput.value.length >= 13) {
            optionInput.value = optionInput.value.substring(0, 12)

            showPopUp("12 char limit exceeded mi amor.")
            setTimeout(removePopUp, 2000)
        }
    });

    window.addEventListener("keyup", function(event) {
        if (event.keyCode === 71) {
            gagoModeToggleCounter += 1

            if (gagoModeToggleCounter >= 5) {
                if (gagoMode) gagoMode = false
                else gagoMode = true

                showPopUp(`gago mode: ${gagoMode}`)
                setTimeout(removePopUp, 2000)

                gagoModeToggleCounter = 0
            }
        } else {
            gagoModeToggleCounter = 0
        }
    });

    drawWheel()
}

const initVariables = () => {
    spinBtn = document.getElementById('btn-spin')
    addBtn = document.getElementById('btn-add')
    showOptionsBtn = document.getElementById('btn-show-options')
    hideOptionsBtn = document.getElementById('btn-hide-options')
    popUpMessage = document.getElementById('pop-up-message')
    optionInput = document.getElementById('option-input')

    ctx = document.getElementById('canvas').getContext("2d")
}

const drawWheel = (postSpin = false) => {
    if (Object.keys(choices).length == 0) drawCircle()

    arcSize = computeSliceSize(Object.keys(choices).length)

    let sliceStartAngle = CIRCLE_TOP
    let textPosition = 0 - (PI(2)/4) + (PI(arcSize) / 2)

    let gagoMessageCounter = 0
    for (choice in choices) {
        drawSlice(sliceStartAngle, sliceStartAngle + arcSize, choices[choice])
        sliceStartAngle += arcSize

        if (gagoMode && postSpin) {
            choice = GAGO_MESSAGES[gagoMessageCounter]
            gagoMessageCounter += 1
            if (gagoMessageCounter > 2) gagoMessageCounter = 0
        }

        drawText(textPosition, choice)
        textPosition += PI(arcSize)
    }
}

const drawCircle = () => {
    ctx.beginPath()
    ctx.arc(CX, CY, RADIUS, 0, PI(2))
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath()
    ctx.stroke()
}

const drawSlice = (startAngle, endAngle, color) => {
    ctx.beginPath()

    ctx.lineTo(CX, CY)
    ctx.arc(CX, CY, RADIUS, PI(startAngle), PI(endAngle))

    ctx.fillStyle = color
    ctx.fill()

    ctx.closePath()
    ctx.stroke()
}

const drawText = (position, text) => {
    ctx.save();

    ctx.translate(CX, CX);
    ctx.rotate(position)
    ctx.font = '16px Arial';
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText(text, 130, 0);

    ctx.restore();
}

const PI = (num) => {
    return num * Math.PI
}

const computeSliceSize = (num) => {
    return 2 / num
}

const generateRandomColor = () => {
    r = Math.floor(Math.random() * Math.floor(256))
    g = Math.floor(Math.random() * Math.floor(256))
    b = Math.floor(Math.random() * Math.floor(256))

    return `rgb(${r},${g},${b})`
}

const spin = () => {
    spinAngle += Math.floor(Math.random() * Math.floor(360)) + 5400
    if (defaultPopUpMessageCounter % 3 == 0) {
        setTimeout(showPopUp, 2000, DEFAULT_POP_UP_MESSAGE)
        setTimeout(removePopUp, 12000)
    }
    defaultPopUpMessageCounter += 1

    document.querySelector('#canvas').style.transform = 'rotate(' + spinAngle + 'deg)';

    if (gagoMode) setTimeout(drawWheel, 2000, true)
    else {
        drawWheel()
    }
}

const addOption = () => {
    const newChoice = document.querySelector('#option-input').value

    if (newChoice == "G_MODE_ON") {
        gagoMode = true
        showPopUp(`gago mode: ${gagoMode}`)
        setTimeout(removePopUp, 2000)
        document.querySelector('#option-input').value = ""

        return
    }

    if (newChoice == "G_MODE_OFF") {
        gagoMode = false
        showPopUp(`gago mode: ${gagoMode}`)
        setTimeout(removePopUp, 2000)
        document.querySelector('#option-input').value = ""

        return
    }

    if (newChoice.length < 1) {
        showPopUp('You gotta fill out the field mi amigo.')
        setTimeout(removePopUp, 5000)

        return
    }

    if (choices[newChoice]) {
        showPopUp('The option already exists ese.')
        setTimeout(removePopUp, 5000)

        return
    }

    const option = document.createElement("div");
    option.classList.add("option");

    const input = document.createElement("input")
    input.classList.add("option-values");
    input.type = "text"
    input.value = newChoice
    input.disabled = true

    const button = document.createElement("button")
    button.classList.add("btn-remove");
    button.innerHTML = "-"
    button.addEventListener('click', function(event) {
        event.target.parentNode.remove()
        delete choices[event.target.parentNode.childNodes[0].value]

        drawWheel()
    });

    option.append(input)
    option.append(button)

    document.querySelector('#options-values-container').append(option)
    choices[newChoice] = generateRandomColor()
    drawWheel()

    document.querySelector('#option-input').value = ""
}

const showOptions = () => {
    showOptionsBtn.style.display = "none"
    hideOptionsBtn.style.display = "block"
    document.getElementById('options-container').style.opacity = 1
}

const hideOptions = () => {
    hideOptionsBtn.style.display = "none"
    showOptionsBtn.style.display = "block"
    document.getElementById('options-container').style.opacity = 0
}

const showPopUp = (message) => {
    let num = Math.floor(Math.random() * Math.floor(3)) + 1;
    let photo = "../neon-sign-maker/images/me/me_" + num + ".png"

    popUpMessage.innerHTML = message
    document.getElementById('pop-up-img').style.backgroundImage = "url('" + photo + "')"
    document.getElementById('pop-up-container').style.animation = "showPopUp 1s ease-in 1"
    document.getElementById('pop-up-container').style.opacity = 100
}

const removePopUp = () => {
    document.getElementById('pop-up-container').style.animation = "removePopUp 1s ease-in 1"
    document.getElementById('pop-up-container').style.opacity = 0
}