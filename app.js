

let socket = new WebSocket("ws://iron-grocs.herokuapp.com/grocs");

/* Responsibility: display a food on the screen */
function showFood(food) {
    console.log('Showing ' + food.name);

    let parent = document.querySelector('ul');
    // Creating a brand new element to display
    let foodItem = document.createElement('li');

    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    if (food.found) {
        checkbox.checked = true;
        foodItem.classList.add('finished');
    }

    checkbox.addEventListener('click', function () {
        console.log(food);

        console.log({
            command: 'find-item',
            id: food.id,
            found: !food.found,
        });

        socket.send(JSON.stringify({
            command: 'find-item',
            id: food.id,
            found: !food.found,
        }));
    });

    let name = document.createElement('span');
    name.textContent = food.quantity + 'x ' + food.name;

    foodItem.appendChild(checkbox);
    foodItem.appendChild(name);

    parent.appendChild(foodItem);
}

window.addEventListener('load', function () {
    // Connect to Ben's server via websocket.
    console.log('page is loaded');

    socket.onopen = function () {
        console.log('were connected!');
    };

    socket.onmessage = function (message) {
        // Delete everything in the list.
        let parent = document.querySelector('ul');
        parent.innerHTML = '';

        let foods = JSON.parse(message.data);
        foods.forEach(food => {
            showFood(food);
        });
    };

    // Make the add button do its job
    let addBtn = document.querySelector('#add-food');
    addBtn.addEventListener('click', function () {
        let quantity = parseInt(document.querySelector('#item-count').value);
        let name = document.querySelector('#new-item').value;

        if (quantity > 0 && name.length > 1) {
            socket.send(JSON.stringify({
                command: 'add-item',
                name: name,
                quantity: parseInt(quantity),
            }));
        }
    });
});