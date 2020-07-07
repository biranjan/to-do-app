// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');


//Event Listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

//Backend Functions
const server = "http://localhost:8000/";
const todolistServer = server + "todo";

function getCompletedTodos() {
    var result = null;
    $.ajax({
        type: "GET",
        url: server + "todo-completed",
        async: false,
        success: function(data){
            result = data;
        }
    });
    return result;
}

function getIncompleteTodos(){
    var result = null;
    $.ajax({
        type: "GET",
        url: server + "todo-incomplete",
        async: false,
        success: function(data){
            result= data;
        }

    });
    console.log(result)
    return result;
}

var data = {todo: getIncompleteTodos() || [], completed: getCompletedTodos() || []};
console.log(data);
//console.log(getIncompleteTodos());


function addItemToBackend(value) {
    var result = null;
    payload = {'description': value};
    console.log(payload);
    $.ajax({
        type: "POST",
        url: todolistServer,
        data: payload,
        async: false,
        success: function(data){
            result = data;
            console.log(data)
        }
    });
    return result.Id;
}

function removeItemInBackend(item){
    console.log(item.id)
    $.ajax({
        url: todolistServer + "/" + item.id,
        type: 'DELETE',
        async: false,
        success: function(data) {
            //console.log(data)
        }
    });
}

function updateItemInBackend(item){
    var completed = true
    if (item.classList.contains('completed')) {
        completed = false
    } 
    var id = item.childNodes[0].id
    payload = {'completed': completed};
    $.ajax({
        url: todolistServer + "/" + id,
        type:  'POST',
        data: payload,
        async: false,
        success: function(data){
            result = data;
        }
    });
    return result.Id;
}

function addTodoInFrontEnd(item,id,completed) {
    
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (completed) {
        todoDiv.classList.toggle("completed");
    };
    //Create LI
    const newTodo = document.createElement('li');
    //console.log(length(todoInput.value))
    //addItemToBackend(todoInput.value)
    newTodo.innerText = item;
    //var id = addItemToBackend(todoInput.value);
    newTodo.id = id;
    console.log(newTodo);
    //data.todo.push(todoInput.value);
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    //CHECK MARK BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton)
    //Trash BUTTON
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton)
    //Append to list
    todoList.appendChild(todoDiv);
    //Clear Todo inpur value
    //todoInput.value = "";    
}

function renderTodoFromBackend() {
    if (!data.todo.length && !data.completed.length) return;
    for (var i = 0; i < data.todo.length; i++) {
        var value = data.todo[i].Description;
        var id = data.todo[i].Id;
        addTodoInFrontEnd(value,id,false)
    }
    for (var j = 0; j < data.completed.length; j++){
        var value = data.completed[j].Description;
        var id = data.completed[j].Id;
        addTodoInFrontEnd(value,id,true)
    }
}


renderTodoFromBackend()
// Functions
function addTodo(event) {
    //Prevent form from submitting
    event.preventDefault();
    //Todo DIV
    //console.log(todoInput.value)
    //console.log(todoInput.value.length)
    //renderTodoFromBackend()
    if (todoInput.value.length > 0) {
        var id = addItemToBackend(todoInput.value);
        addTodoInFrontEnd(todoInput.value,id,false)
        todoInput.value = "";
    } else {
        alert("Empty todo");
    };
}

function deleteCheck(event) {
    // get the item clicked
    const item = event.target;
    // delete todo
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        // Animate using transform
        todo.classList.add("fall");
        todo.addEventListener('transitionend', function () {
            //var item = this.parentNode.parentNode;
            //console.log(todo)
            //console.log(todo.childNodes[0].id)
            //console.log(todo.childNodes[0].innerText)
            removeItemInBackend(todo.childNodes[0])
            todo.remove();

        });

    }
    // check mark
    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        console.log(todo.childNodes[0].id)
        updateItemInBackend(todo)
        todo.classList.toggle("completed");
        console.log(todo)
    }

}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}