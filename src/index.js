let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });

    // Function for creating new toy card (for initial GET request and any new POST requests)
    function createToyItem(toy) {
        // Create new card for each toy
        const newCard = document.createElement('div');
        newCard.className = 'card';
        toyCollection.appendChild(newCard);

        // Card header
        const toyHeader = document.createElement('h2');
        toyHeader.innerText = toy.name;
        newCard.appendChild(toyHeader);

        // Toy image
        const toyImage = document.createElement('img');
        toyImage.className = 'toy-avatar';
        toyImage.src = toy.image;
        newCard.appendChild(toyImage);

        // Number of likes
        const numberOfLikes = document.createElement('p');
        numberOfLikes.innerText = `${toy.likes} Likes`;
        newCard.appendChild(numberOfLikes);

        // Like button
        const likeButton = document.createElement('button');
        likeButton.className = 'like-btn';
        likeButton.id = toy.id;
        likeButton.innerText = 'Like <3';
        newCard.appendChild(likeButton);

        /*---------- Update like count when Like Button is clicked ----------*/

        likeButton.addEventListener('click', () => {
            toy.likes += 1

            const configurationObject = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "likes": toy.likes
                })
            }

            fetch(`http://localhost:3000/toys/${toy.id}`, configurationObject)
            .then(response => response.json())
            .then(data => {
                console.log(data.likes);
                numberOfLikes.innerText = `${data.likes} Likes`;
            })
        })

        return newCard;
    }

    /*---------- Fetch all existing toys from database and render them in DOM ----------*/

    const toyCollection = document.querySelector('#toy-collection');

    fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(data => {
        data.map(toy => createToyItem(toy));
    })
    .catch(error => {
        toyCollection.innerText = `Error! ${error}`;
        console.log(error);
    })

    /*---------- Add a new toy to the database via form submission ----------*/

    const form = document.querySelector('form');
    const inputToyName = document.querySelector('form > input');
    const inputToyImage = document.querySelector('form > input:nth-child(4)');
    
    form.addEventListener('submit', (event) => {
        newToyName = inputToyName.value;
        newToyImage = inputToyImage.value;

        const configurationObject = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "name": newToyName,
                "image": newToyImage,
                "likes": 0
            })
        }

        fetch('http://localhost:3000/toys', configurationObject)
        .then(response => response.json())
        .then(toy => createToyItem(toy))
        .catch(error => {
            console.log(error);
        })

        event.preventDefault();
    })
});
