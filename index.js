function closep() {
    document.querySelector('.layer').style.display = 'none';
    document.querySelector('.addPopup').style.display = 'none';
}

function openp() {
    document.querySelector('.layer').style.display = 'block';
    document.querySelector('.addPopup').style.display = 'block';
}

function opens() {
    document.querySelector('.layer').style.display = 'block';
    document.querySelector('.searchPopup').style.display = 'block';
}

function closes() {
    document.querySelector('.layer').style.display = 'none';
    document.querySelector('.searchPopup').style.display = 'none';
}

function openb() {
    document.querySelector('.layer').style.display = 'block';
    document.querySelector('.bookmarkPopup').style.display = 'block';
}

function closeb() {
    document.querySelector('.layer').style.display = 'none';
    document.querySelector('.bookmarkPopup').style.display = 'none';
}

function createTodoElement(task, date, searchInput) {
    const item = document.createElement('div');
    item.classList.add('todo');

    // Highlight matching characters
    const highlightedTask = searchInput
        ? task.replace(new RegExp(searchInput, 'gi'), match => `<span class="highlight">${match}</span>`)
        : task;

    item.innerHTML = `
        <strong>${highlightedTask}</strong><br>
        <section class="todo-info">
            <span>${date}</span>
            <button class="btn" onclick="editTodo(this)">edit</button>
            <button class="btn" onclick="deleteTodo(this)">delete</button>
        </section>
    `;
    return item;
}

function searchAndSortTasks() {
    const searchInput = document.getElementById('todo-tas').value.trim().toLowerCase();
    const searchedItemsContainer = document.querySelector('.searchPopup .searched-items');
    searchedItemsContainer.innerHTML = '';

    if (searchInput === '') {
        return;
    }

    const filteredTasks = mydata.filter(todo => todo.task.toLowerCase().includes(searchInput));

    // Sort the filtered tasks alphabetically
    filteredTasks.sort((a, b) => a.task.localeCompare(b.task));

    filteredTasks.forEach(todoData => {
        // Display matching tasks in the searched items container
        const searchTodoElement = createTodoElement(todoData.task, todoData.date, searchInput);
        searchedItemsContainer.appendChild(searchTodoElement);
    });
}

function sortTasks() {
    mydata.sort((a, b) => a.task.localeCompare(b.task));

    // Clear existing todos in the .todos container
    const todosContainer = document.querySelector('.todos');
    todosContainer.innerHTML = '';

    mydata.forEach(todoData => {
        const todoElement = createTodoElement(todoData.task, todoData.date);
        todosContainer.appendChild(todoElement);
    });
}

let mydata = [];


function addtodo() {
    document.querySelector('.layer').style.display = 'none';
    document.querySelector('.addPopup').style.display = 'none';

    const todoData = putdata();
    mydata.push(todoData);
    console.log(mydata);

    document.querySelector('.todos').appendChild(todoData.element);

    localStorage.setItem('todos', JSON.stringify(mydata));
    document.getElementById('notificationSoundd').play();
}


function putdata() {
    const inputval = document.getElementById('todo-task');
    const currentDate = formatDate(new Date());

    const item = createTodoElement(inputval.value, currentDate);

    return {
        task: inputval.value,
        date: currentDate,
        element: item
    };
}

function editTodo(button) {
    console.log("Edit todo function called");

    const todoDiv = button.closest('.todo');
    const taskToEdit = todoDiv.querySelector('strong').textContent;

    // Find the index of the task in the mydata array
    const index = mydata.findIndex(todo => todo.task === taskToEdit);

    // If the task is found in mydata array, prompt the user to edit
    if (index !== -1) {
        const updatedTask = prompt('Edit the task:', taskToEdit);

        // If the user provides an updated task and clicks OK
        if (updatedTask !== null) {
            // Update task in mydata array
            mydata[index].task = updatedTask;

            // Update task in local storage
            const storedData = JSON.parse(localStorage.getItem('todos')) || [];
            storedData[index].task = updatedTask;
            localStorage.setItem('todos', JSON.stringify(storedData));

            // Update task in DOM
            todoDiv.querySelector('strong').textContent = updatedTask;

            // Play notification sound
            document.getElementById('notificationSoundd').play();
        }
    }
}

function deleteTodo(button) {
    console.log("Delete todo function called");

    const todoDiv = button.closest('.todo');
    const taskToDelete = todoDiv.querySelector('strong').textContent;

    // Find the index of the todo in the mydata array
    const index = mydata.findIndex(todo => todo.element === todoDiv);

    // Remove the todo from the mydata array
    if (index !== -1) {
        mydata.splice(index, 1);
    }

    // Remove the task from local storage if found
    const storedData = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedData = storedData.filter(todo => todo.task !== taskToDelete);
    localStorage.setItem('todos', JSON.stringify(updatedData));

    // Remove the todo from the DOM
    todoDiv.remove();
    document.getElementById('notificationSoundd').play();
    getlocal();
}


function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}



function getlocal() {
    const storedData = JSON.parse(localStorage.getItem('todos')) || [];
    mydata = storedData;
    console.log(mydata);

    // Clear existing todos in the .todos container
    const todosContainer = document.querySelector('.todos');
    todosContainer.innerHTML = '';

    storedData.forEach(todoData => {
        const todoElement = createTodoElement(todoData.task, todoData.date);
        todosContainer.appendChild(todoElement);
    });
}




// Load existing todos from local storage and refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    getlocal();
    
});

document.querySelector('#todo-task').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
    addtodo();
    console.log('p');
    }
});