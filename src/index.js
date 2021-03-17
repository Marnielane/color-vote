const baseURL = `http://localhost:3000/colors/`
const cardContainer = document.querySelector('#card-container')
const addColorForm = document.getElementById('add-color-form')

fetch(baseURL)
    .then(parseJson)
    .then(interateOverColors)
addNewColorFormListener()

function interateOverColors(colors) {
    colors.forEach(renderColors)
}

function renderColors(color) {
    const colorCard = document.createElement('div')
    colorCard.className = 'color-card'
    colorCard.style.backgroundColor = `${color.hex}`

    const colorName = document.createElement('h2')
    colorName.innerText = color.name

    const voteCounter = document.createElement('p')
    voteCounter.innerText = `${color.votes} Votes`

    const voteButton = document.createElement('button')
    voteButton.textContent = '+1 Vote'
    voteButton.addEventListener('click', (e) => {
        voteForColor(color, voteCounter)
    })

    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = '&times;'

    deleteButton.addEventListener('click', () => {
        colorCard.remove()
        deleteColor(color.id)
    })

    colorCard.append(colorName, voteCounter, voteButton, deleteButton)
    cardContainer.append(colorCard)
}

function deleteColor(id) {
    fetch(baseURL + id, {
        method: "DELETE",
    })
}

function voteForColor(color, voteCounter) {
    color.votes++

    let updatedColor = {
        votes: color.votes,
    }

    let options = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/JSON",
            Accept: "application/json",
        },
        body: JSON.stringify(updatedColor),
    }

    fetch(baseURL + color.id, options)
        .then(parseJson)
        .then(
            (returnUpdatedColor) =>
                (voteCounter.innerText = `Votes ${returnUpdatedColor.votes}`)
        )
}

function addNewColorFormListener() {
    addColorForm.addEventListener('submit', (e) => {
        let colorForm = e.target
        e.preventDefault()

        let color = {
            name: colorForm.name.value,
            hex: colorForm.hex.value,
            votes: 0,
        }

        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(color),
        }

        fetch(baseURL, options)
            .then(parseJson)
            .then((newColor) => renderColors(newColor))
        // .then(window.location.reload())
    })
}

function parseJson(response) {
    return response.json()
}

