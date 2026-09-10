/* =========================================
   SMART STUDENT PLANNER
   MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   HELPER FUNCTIONS
   ========================================= */

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDayName() {

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    return days[new Date().getDay()];
}


/* =========================================
   NAVIGATION
   ========================================= */

const navigationLinks =
    document.querySelectorAll(".bottom-nav a");


const sections = {

    "Home":
        "home-section",

    "Timetable":
        "timetable-section",

    "Assignments":
        "assignments-section",

    "Study":
        "study-section",

    "Exams":
        "exams-section",

    "Tasks":
        "tasks-section",

    "Progress":
        "progress-section",

    "Reminders":
        "reminders-section"

};


navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();


        /*
           The last span contains the
           actual navigation name.
        */

        const pageName =
            this.lastElementChild.textContent.trim();


        /*
           Hide every section.
        */

        Object.values(sections).forEach(function (sectionId) {

            document
                .getElementById(sectionId)
                .classList.add("hidden");

        });


        /*
           Show selected section.
        */

        if (sections[pageName]) {

            document
                .getElementById(sections[pageName])
                .classList.remove("hidden");

        }


        /*
           Update active navigation item.
        */

        navigationLinks.forEach(function (item) {

            item.classList.remove("active");

        });

        this.classList.add("active");


        /*
           Scroll to top.
        */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


/* =========================================
   ASSIGNMENTS
   ========================================= */

function displayAssignments() {

    const assignments =
        getData("assignments");

    const list =
        document.getElementById("assignment-list");


    if (assignments.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No assignments added yet.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    assignments.forEach(function (assignment, index) {

        const item =
            document.createElement("div");

        item.className =
            "assignment-item";


        item.innerHTML = `

            <h3>
                ${escapeHtml(assignment.title)}
            </h3>

            <p>
                <strong>Subject:</strong>
                ${escapeHtml(assignment.subject)}
            </p>

            <p>
                <strong>Due Date:</strong>
                ${formatDate(assignment.date)}
            </p>

            <p>
                <strong>Priority:</strong>
                ${escapeHtml(assignment.priority)}
            </p>

            <p>
                <strong>Status:</strong>
                ${assignment.completed ? "Completed" : "Pending"}
            </p>

            <button
                onclick="toggleAssignment(${index})">

                ${assignment.completed
                    ? "Mark Pending"
                    : "Mark Complete"}

            </button>

            <button
                onclick="deleteAssignment(${index})">

                Delete

            </button>

        `;


        list.appendChild(item);

    });

}


document
    .getElementById("add-assignment")
    .addEventListener("click", function () {

        const title =
            document
                .getElementById("assignment-title")
                .value.trim();

        const subject =
            document
                .getElementById("assignment-subject")
                .value.trim();

        const date =
            document
                .getElementById("assignment-date")
                .value;

        const priority =
            document
                .getElementById("assignment-priority")
                .value;


        if (!title || !subject || !date) {

            alert("Please fill all assignment details.");

            return;
        }


        const assignments =
            getData("assignments");


        assignments.push({

            title: title,

            subject: subject,

            date: date,

            priority: priority,

            completed: false

        });


        saveData(
            "assignments",
            assignments
        );


        document
            .getElementById("assignment-title")
            .value = "";

        document
            .getElementById("assignment-subject")
            .value = "";

        document
            .getElementById("assignment-date")
            .value = "";


        displayAssignments();

        updateDashboard();

    });


function toggleAssignment(index) {

    const assignments =
        getData("assignments");


    assignments[index].completed =
        !assignments[index].completed;


    saveData(
        "assignments",
        assignments
    );


    displayAssignments();

    updateDashboard();

}


function deleteAssignment(index) {

    const assignments =
        getData("assignments");


    assignments.splice(index, 1);


    saveData(
        "assignments",
        assignments
    );


    displayAssignments();

    updateDashboard();

}


/* =========================================
   TIMETABLE
   ========================================= */

function displayTimetable() {

    const timetable =
        getData("timetable");

    const list =
        document.getElementById("timetable-list");


    if (timetable.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No classes added yet.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    timetable.forEach(function (item, index) {

        const element =
            document.createElement("div");

        element.className =
            "timetable-item";


        element.innerHTML = `

            <h4>
                ${escapeHtml(item.subject)}
            </h4>

            <p>
                <strong>Day:</strong>
                ${escapeHtml(item.day)}
            </p>

            <p>
                <strong>Time:</strong>
                ${escapeHtml(item.start)}
                -
                ${escapeHtml(item.end)}
            </p>

            <button
                onclick="deleteTimetable(${index})">

                Delete

            </button>

        `;


        list.appendChild(element);

    });

}


document
    .getElementById("add-timetable")
    .addEventListener("click", function () {

        const day =
            document
                .getElementById("timetable-day")
                .value;

        const subject =
            document
                .getElementById("timetable-subject")
                .value.trim();

        const start =
            document
                .getElementById("timetable-start")
                .value;

        const end =
            document
                .getElementById("timetable-end")
                .value;


        if (!subject || !start || !end) {

            alert("Please fill all timetable details.");

            return;
        }


        if (end <= start) {

            alert("End time must be after start time.");

            return;
        }


        const timetable =
            getData("timetable");


        timetable.push({

            day: day,

            subject: subject,

            start: start,

            end: end

        });


        saveData(
            "timetable",
            timetable
        );


        document
            .getElementById("timetable-subject")
            .value = "";

        document
            .getElementById("timetable-start")
            .value = "";

        document
            .getElementById("timetable-end")
            .value = "";


        displayTimetable();

        updateDashboard();

    });


function deleteTimetable(index) {

    const timetable =
        getData("timetable");


    timetable.splice(index, 1);


    saveData(
        "timetable",
        timetable
    );


    displayTimetable();

    updateDashboard();

}


/* =========================================
   STUDY PLANNER
   ========================================= */

function displayStudySessions() {

    const studySessions =
        getData("studySessions");

    const list =
        document.getElementById("study-list");


    if (studySessions.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No study sessions planned yet.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    studySessions.forEach(function (session, index) {

        const item =
            document.createElement("div");

        item.className =
            "study-item";


        item.innerHTML = `

            <h4>
                ${escapeHtml(session.subject)}
            </h4>

            <p>
                <strong>Date:</strong>
                ${formatDate(session.date)}
            </p>

            <p>
                <strong>Duration:</strong>
                ${escapeHtml(session.duration)}
            </p>

            <button
                onclick="deleteStudySession(${index})">

                Delete

            </button>

        `;


        list.appendChild(item);

    });

}


document
    .getElementById("add-study")
    .addEventListener("click", function () {

        const subject =
            document
                .getElementById("study-subject")
                .value.trim();

        const date =
            document
                .getElementById("study-date")
                .value;

        const duration =
            document
                .getElementById("study-duration")
                .value;


        if (!subject || !date) {

            alert("Please fill all study details.");

            return;
        }


        const studySessions =
            getData("studySessions");


        studySessions.push({

            subject: subject,

            date: date,

            duration: duration

        });


        saveData(
            "studySessions",
            studySessions
        );


        document
            .getElementById("study-subject")
            .value = "";

        document
            .getElementById("study-date")
            .value = "";


        displayStudySessions();

        updateDashboard();

    });


function deleteStudySession(index) {

    const studySessions =
        getData("studySessions");


    studySessions.splice(index, 1);


    saveData(
        "studySessions",
        studySessions
    );


    displayStudySessions();

    updateDashboard();

}


/* =========================================
   EXAM SCHEDULE
   ========================================= */

function displayExams() {

    const exams =
        getData("exams");

    const list =
        document.getElementById("exam-list");


    if (exams.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No exams added yet.
            </p>
        `;

        return;
    }


    const sortedExams =
        [...exams].sort(function (a, b) {

            return (
                (a.date + a.time)
                .localeCompare(b.date + b.time)
            );

        });


    list.innerHTML = "";


    sortedExams.forEach(function (exam) {

        const originalIndex =
            exams.indexOf(exam);


        const item =
            document.createElement("div");

        item.className =
            "exam-item";


        item.innerHTML = `

            <h4>
                ${escapeHtml(exam.subject)}
            </h4>

            <p>
                <strong>Date:</strong>
                ${formatDate(exam.date)}
            </p>

            <p>
                <strong>Time:</strong>
                ${escapeHtml(exam.time)}
            </p>

            <button
                onclick="deleteExam(${originalIndex})">

                Delete

            </button>

        `;


        list.appendChild(item);

    });

}


document
    .getElementById("add-exam")
    .addEventListener("click", function () {

        const subject =
            document
                .getElementById("exam-subject")
                .value.trim();

        const date =
            document
                .getElementById("exam-date")
                .value;

        const time =
            document
                .getElementById("exam-time")
                .value;


        if (!subject || !date || !time) {

            alert("Please fill all exam details.");

            return;
        }


        const exams =
            getData("exams");


        exams.push({

            subject: subject,

            date: date,

            time: time

        });


        saveData(
            "exams",
            exams
        );


        document
            .getElementById("exam-subject")
            .value = "";

        document
            .getElementById("exam-date")
            .value = "";

        document
            .getElementById("exam-time")
            .value = "";


        displayExams();

        updateDashboard();

    });


function deleteExam(index) {

    const exams =
        getData("exams");


    exams.splice(index, 1);


    saveData(
        "exams",
        exams
    );


    displayExams();

    updateDashboard();

}


/* =========================================
   TASKS
   ========================================= */

function displayTasks() {

    const tasks =
        getData("tasks");

    const list =
        document.getElementById("task-list");


    if (tasks.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No tasks added yet.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    tasks.forEach(function (task, index) {

        const item =
            document.createElement("div");

        item.className =
            "task-item";


        item.innerHTML = `

            <h4>
                ${escapeHtml(task.title)}
            </h4>

            <p>
                <strong>Due Date:</strong>
                ${formatDate(task.date)}
            </p>

            <p>
                <strong>Priority:</strong>
                ${escapeHtml(task.priority)}
            </p>

            <p>
                <strong>Status:</strong>
                ${task.completed ? "Completed" : "Pending"}
            </p>

            <button
                onclick="toggleTask(${index})">

                ${task.completed
                    ? "Mark Pending"
                    : "Mark Complete"}

            </button>

            <button
                onclick="deleteTask(${index})">

                Delete

            </button>

        `;


        list.appendChild(item);

    });

}


document
    .getElementById("add-task")
    .addEventListener("click", function () {

        const title =
            document
                .getElementById("task-title")
                .value.trim();

        const date =
            document
                .getElementById("task-date")
                .value;

        const priority =
            document
                .getElementById("task-priority")
                .value;


        if (!title || !date) {

            alert("Please fill all task details.");

            return;
        }


        const tasks =
            getData("tasks");


        tasks.push({

            title: title,

            date: date,

            priority: priority,

            completed: false

        });


        saveData(
            "tasks",
            tasks
        );


        document
            .getElementById("task-title")
            .value = "";

        document
            .getElementById("task-date")
            .value = "";


        displayTasks();

        updateDashboard();

    });


function toggleTask(index) {

    const tasks =
        getData("tasks");


    tasks[index].completed =
        !tasks[index].completed;


    saveData(
        "tasks",
        tasks
    );


    displayTasks();

    updateDashboard();

}


function deleteTask(index) {

    const tasks =
        getData("tasks");


    tasks.splice(index, 1);


    saveData(
        "tasks",
        tasks
    );


    displayTasks();

    updateDashboard();

}


/* =========================================
   REMINDERS
   ========================================= */

function displayReminders() {

    const reminders =
        getData("reminders");

    const list =
        document.getElementById("reminder-list");


    if (reminders.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No reminders added yet.
            </p>
        `;

        return;
    }


    const sortedReminders =
        [...reminders].sort(function (a, b) {

            return (
                (a.date + a.time)
                .localeCompare(b.date + b.time)
            );

        });


    list.innerHTML = "";


    sortedReminders.forEach(function (reminder) {

        const originalIndex =
            reminders.indexOf(reminder);


        const item =
            document.createElement("div");

        item.className =
            "reminder-item";


        item.innerHTML = `

            <h4>
                ${escapeHtml(reminder.title)}
            </h4>

            <p>
                <strong>Date:</strong>
                ${formatDate(reminder.date)}
            </p>

            <p>
                <strong>Time:</strong>
                ${escapeHtml(reminder.time)}
            </p>

            <button
                onclick="deleteReminder(${originalIndex})">

                Delete

            </button>

        `;


        list.appendChild(item);

    });

}


document
    .getElementById("add-reminder")
    .addEventListener("click", function () {

        const title =
            document
                .getElementById("reminder-title")
                .value.trim();

        const date =
            document
                .getElementById("reminder-date")
                .value;

        const time =
            document
                .getElementById("reminder-time")
                .value;


        if (!title || !date || !time) {

            alert("Please fill all reminder details.");

            return;
        }


        const reminders =
            getData("reminders");


        reminders.push({

            title: title,

            date: date,

            time: time

        });


        saveData(
            "reminders",
            reminders
        );


        document
            .getElementById("reminder-title")
            .value = "";

        document
            .getElementById("reminder-date")
            .value = "";

        document
            .getElementById("reminder-time")
            .value = "";


        displayReminders();

        updateDashboard();

    });


function deleteReminder(index) {

    const reminders =
        getData("reminders");


    reminders.splice(index, 1);


    saveData(
        "reminders",
        reminders
    );


    displayReminders();

    updateDashboard();

}


/* =========================================
   PROGRESS
   ========================================= */

function updateProgress() {

    const assignments =
        getData("assignments");

    const tasks =
        getData("tasks");


    const completedAssignments =
        assignments.filter(function (item) {

            return item.completed;

        }).length;


    const completedTasks =
        tasks.filter(function (item) {

            return item.completed;

        }).length;


    const total =
        assignments.length + tasks.length;


    const completed =
        completedAssignments + completedTasks;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    document
        .getElementById("overall-progress")
        .textContent =
        `${percentage}%`;


    document
        .getElementById("progress-count")
        .textContent =
        `${percentage}% Completed`;


    document
        .getElementById("completed-summary")
        .textContent =
        `Completed: ${completed}`;


    document
        .getElementById("pending-summary")
        .textContent =
        `Pending: ${total - completed}`;


    const message =
        document.getElementById("progress-message");


    if (percentage === 0) {

        message.textContent =
            "Keep going! Complete your tasks and assignments.";

    }
    else if (percentage < 50) {

        message.textContent =
            "Good start! Keep making progress.";

    }
    else if (percentage < 100) {

        message.textContent =
            "Great progress! You are getting closer.";

    }
    else {

        message.textContent =
            "Excellent! Everything is completed.";

    }

}


/* =========================================
   TODAY'S PLAN
   ========================================= */

function updateTodayPlan() {

    const container =
        document.getElementById("today-plan");


    const today =
        getTodayDate();


    const items = [];


    const tasks =
        getData("tasks");


    tasks.forEach(function (task) {

        if (
            task.date === today &&
            !task.completed
        ) {

            items.push({

                title: task.title,

                type: "Task",

                details:
                    `Priority: ${task.priority}`

            });

        }

    });


    const assignments =
        getData("assignments");


    assignments.forEach(function (assignment) {

        if (
            assignment.date === today &&
            !assignment.completed
        ) {

            items.push({

                title: assignment.title,

                type: "Assignment",

                details:
                    `${assignment.subject} • ${assignment.priority}`

            });

        }

    });


    const studySessions =
        getData("studySessions");


    studySessions.forEach(function (session) {

        if (session.date === today) {

            items.push({

                title: session.subject,

                type: "Study Session",

                details:
                    `Duration: ${session.duration}`

            });

        }

    });


    const reminders =
        getData("reminders");


    reminders.forEach(function (reminder) {

        if (reminder.date === today) {

            items.push({

                title: reminder.title,

                type: "Reminder",

                details:
                    `Time: ${reminder.time}`

            });

        }

    });


    if (items.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <p>
                    Nothing scheduled for today.
                </p>

                <p>
                    Enjoy your day or add something to your plan!
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    items.forEach(function (item) {

        const element =
            document.createElement("div");

        element.className =
            "today-item";


        element.innerHTML = `

            <h4>
                ${escapeHtml(item.title)}
            </h4>

            <p>
                <strong>
                    ${escapeHtml(item.type)}
                </strong>
            </p>

            <p>
                ${escapeHtml(item.details)}
            </p>

        `;


        container.appendChild(element);

    });

}


/* =========================================
   DASHBOARD UPCOMING EXAMS
   ========================================= */

function updateDashboardExams() {

    const container =
        document.getElementById("dashboard-exams");


    const exams =
        getData("exams");


    const today =
        getTodayDate();


    const upcoming =
        exams
            .filter(function (exam) {

                return exam.date >= today;

            })
            .sort(function (a, b) {

                return (
                    (a.date + a.time)
                    .localeCompare(
                        b.date + b.time
                    )
                );

            })
            .slice(0, 3);


    if (upcoming.length === 0) {

        container.innerHTML = `

            <p class="empty-message">
                No upcoming exams added yet.
            </p>

        `;

        return;
    }


    container.innerHTML = "";


    upcoming.forEach(function (exam) {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-exam-item";


        item.innerHTML = `

            <div>

                <h4>
                    ${escapeHtml(exam.subject)}
                </h4>

                <p>
                    Time: ${escapeHtml(exam.time)}
                </p>

            </div>


            <div class="exam-date-box">

                ${formatDate(exam.date)}

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   DASHBOARD
   ========================================= */

function updateDashboard() {

    const assignments =
        getData("assignments");

    const tasks =
        getData("tasks");

    const exams =
        getData("exams");

    const studySessions =
        getData("studySessions");

    const reminders =
        getData("reminders");


    /* Pending assignments */

    const pendingAssignments =
        assignments.filter(function (item) {

            return !item.completed;

        }).length;


    document
        .getElementById("assignment-count")
        .textContent =
        `${pendingAssignments} Pending`;


    document
        .getElementById("overview-assignments")
        .textContent =
        `${pendingAssignments} pending`;


    /* Pending tasks */

    const pendingTasks =
        tasks.filter(function (item) {

            return !item.completed;

        }).length;


    document
        .getElementById("task-count")
        .textContent =
        `${pendingTasks} Pending`;


    document
        .getElementById("overview-tasks")
        .textContent =
        `${pendingTasks} pending`;


    /* Upcoming exams */

    const today =
        getTodayDate();


    const upcomingExams =
        exams.filter(function (exam) {

            return exam.date >= today;

        }).length;


    document
        .getElementById("exam-count")
        .textContent =
        `${upcomingExams} Upcoming`;


    /* Study sessions */

    document
        .getElementById("overview-study")
        .textContent =
        `${studySessions.length} planned`;


    /* Reminders */

    document
        .getElementById("overview-reminders")
        .textContent =
        `${reminders.length} scheduled`;


    /* Progress */

    updateProgress();


    /* Today's plan */

    updateTodayPlan();


    /* Upcoming exams */

    updateDashboardExams();

}


/* =========================================
   INITIAL LOAD
   ========================================= */

displayAssignments();

displayTimetable();

displayStudySessions();

displayExams();

displayTasks();

displayReminders();

updateDashboard();

console.log(
    "Smart Student Planner loaded successfully!"
);