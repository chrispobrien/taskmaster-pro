var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// on click of task name, switch <p> to <input> and focus
$("#list-toDo").on("click","p", function() {
  $(this).replaceWith($("<textarea>")
    .addClass("form-control")
    .val($(this).text().trim()));
  // I tried chaining this but I don't think it works because the line above replaces <p> with <textarea> so the object doesn't exist
  $("textarea").trigger("focus");
});

// load input back to <p>
$(".list-group").on("blur","textarea",function() {
  // load text with input val
  let text = $(this).val().trim();
  // load status with class list-group attribute id name i.e. list-toDo we want toDo
  let status = $(this).closest(".list-group").attr("id").replace("list-","");
  // load index of this li within ul
  let index = $(this).closest(".list-group-item").index();
  // Change text in array - status is like "toDo" and index is a number
  tasks[status][index].text = text;
  // Save tasks to local storage
  saveTasks();
  // Replace the input with a paragraph section with the new text
  $(this).replaceWith($("<p>")
    .addClass("m-1")
    .text(text));
});

$(".list-group").on("click","span", function() {
  // get current text
  let date = $(this).text().trim();
  let dateInput = $("<input>").attr("type","text").addClass("form-control").val(date);
  $(this).replaceWith(dateInput);
  dateInput.trigger("focus");
});

$(".list-group").on("blur","input[type='text']", function() {
  let date = $(this).val().trim();
  // load status with class list-group attribute id name i.e. list-toDo we want toDo
  let status = $(this).closest(".list-group").attr("id").replace("list-","");
  // load index of this li within ul
  let index = $(this).closest(".list-group-item").index();
  // Change text in array - status is like "toDo" and index is a number
  tasks[status][index].date = date;
  // Save tasks to local storage
  saveTasks();
  let taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  $(this).replaceWith(taskSpan);
  
})



// load tasks for the first time
loadTasks();

