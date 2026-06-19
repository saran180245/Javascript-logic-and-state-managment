const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

renderTasks();

addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if(text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed:false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
});

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "active"){
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if(currentFilter === "completed"){
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div>
                <button class="complete-btn" data-id="${task.id}">
                    ✓
                </button>

                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

taskList.addEventListener("click",(e)=>{

    const id = Number(e.target.dataset.id);

    if(e.target.classList.contains("delete-btn")){

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    if(e.target.classList.contains("complete-btn")){

        tasks = tasks.map(task => {

            if(task.id === id){
                task.completed = !task.completed;
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }

    if(e.target.classList.contains("edit-btn")){

        const newText = prompt("Edit Task");

        if(newText){

            tasks = tasks.map(task => {

                if(task.id === id){
                    task.text = newText;
                }

                return task;
            });

            saveTasks();
            renderTasks();
        }
    }
});

document.querySelectorAll("[data-filter]")
.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});