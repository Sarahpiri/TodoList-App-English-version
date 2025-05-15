document.addEventListener("DOMContentLoaded", function () {
    const initialState = document.getElementById("initialState");
    const initialContent = document.getElementById("initialContent");
    const addTaskModal = document.getElementById("addTaskModal");
    const addTaskButton = initialState.querySelector("button");
    const taskForm = document.getElementById("taskForm");
    const tasksContainer = document.getElementById("tasksContainer");
    const activeTasksList = document.getElementById("activeTasksList");
    const tagBtn = document.getElementById("tagBtn");
    const priorityTags = document.getElementById("priorityTags");
    const lowPriorityBtn = document.getElementById("low");
    const mediumPriorityBtn = document.getElementById("medium");
    const highPriorityBtn = document.getElementById("high");
  
    let tasks = [];
    let selectedPriority = null;
   
  
    function updateTaskCounts() {
      // Pending task counter
      const pendingCount = tasks.filter((t) => !t.completed).length;
      const pendingTextEl = document.getElementById("activeTasksCountText");
      if (pendingCount === 0) {
        pendingTextEl.textContent = "No tasks for today!";
      } else {
        const persianPending = pendingCount.toLocaleString("en");
        pendingTextEl.textContent = `${persianPending} tasks to do`;
      }
  
      // Done task counter
      const doneCount = tasks.filter((t) => t.completed).length;
      const doneCountSpan = document.getElementById("done-count");
      doneCountSpan.textContent = doneCount.toLocaleString("en");
    }
  
    function renderAll() {
      renderTasks();
      renderDoneTasks();
      updateTaskCounts();
    }
  
    // Initialize UI
    addTaskModal.classList.add("hidden");
    tasksContainer.classList.add("hidden");
    priorityTags.classList.add("hidden");
  
    // Event for adding new task
    addTaskButton.addEventListener("click", function () {
      initialContent.classList.add("hidden");
      addTaskModal.classList.toggle("hidden");
    });
  
    // Toggle tag visibility
    tagBtn.addEventListener("click", function (e) {
      e.preventDefault();
      priorityTags.classList.toggle("hidden");
  
      // Toggle tag icons
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.toggle("hidden");
      activeIcon.classList.toggle("hidden");
    });
  
    function displaySelectedTag(priority, modal) {
      const selectedTagContainer = modal.querySelector(".selected-tag-container");
      selectedTagContainer.innerHTML = `
            <div class="flex items-center mt-6 mr-3">
              <button data-priority="${priority}" class="priority-filter flex justify-center items-center gap-[6px] px-2 pt-1 pb-2 rounded-[4px] text-sm font-medium ${getPriorityClass(
        priority
      )}">
                <img src="./assets/icons/Close-light.svg" alt="close-light" class="w-4 mt-1 block dark:hidden cursor-pointer remove-tag-btn">
                <img src="./assets/icons/darkmode/Close-dark.svg" alt="close-dark" class="w-4 mt-1 hidden dark:block cursor-pointer remove-tag-btn">
                ${getPriorityText(priority)}
              </button>
            </div>`;
      const removeTagBtns =
        selectedTagContainer.querySelectorAll(".remove-tag-btn");
      removeTagBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedPriority = null;
          selectedTagContainer.innerHTML = "";
          tagBtn.classList.remove("hidden");
          const defaultIcon = tagBtn.querySelector(".default-tag-icon");
          const activeIcon = tagBtn.querySelector(".active-tag-icon");
          defaultIcon.classList.remove("hidden");
          activeIcon.classList.add("hidden");
          document
            .querySelectorAll(".priority-filter")
            .forEach((b) => b.classList.remove("active"));
        });
      });
    }
  
    function handlePrioritySelection(priority, modal) {
      selectedPriority = priority;
      priorityTags.classList.add("hidden");
      tagBtn.classList.add("hidden");
      displaySelectedTag(priority, modal);
  
      // Reset tag icons in tagBtn
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.remove("hidden");
      activeIcon.classList.add("hidden");
    }
  
    lowPriorityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handlePrioritySelection("low", addTaskModal);
    });
    mediumPriorityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handlePrioritySelection("medium", addTaskModal);
    });
    highPriorityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handlePrioritySelection("high", addTaskModal);
    });
  
    // Form submission
    taskForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const title = document.getElementById("taskTitle").value;
      const description = document.getElementById("taskDescription").value;
      const priority = selectedPriority || "medium";
  
      const newTask = {
        id: Date.now(),
        title,
        description,
        priority,
        completed: false,
      };
  
      tasks.push(newTask);
      renderAll();
      tasksContainer.classList.remove("hidden");
      initialContent.classList.add("hidden");
      addTaskModal.classList.add("hidden");
      initialState.classList.remove("hidden");
      taskForm.reset();
  
      // Reset tag selection UI
      const selectedTagContainer = document.querySelector(
        ".selected-tag-container"
      );
      if (selectedTagContainer) {
        selectedTagContainer.innerHTML = "";
      }
      tagBtn.classList.remove("hidden");
      document
        .querySelectorAll(".priority-filter")
        .forEach((btn) => btn.classList.remove("active"));
      selectedPriority = null;
  
      // Reset tag icons in tagBtn
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.remove("hidden");
      activeIcon.classList.add("hidden");
    });
  
    // Render tasks function
    function renderTasks() {
      activeTasksList.innerHTML = "";
  
      const activeTasks = tasks.filter((task) => !task.completed);
  
      activeTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        activeTasksList.appendChild(taskElement);
      });
  
      updateTaskCounts();
  
      // closing edit from if exist
      const editForm = document.querySelector(".edit-task-form");
      if (editForm) {
        editForm.remove();
      }
    }
  
    function createTaskElement(task) {
      const colors = { high: "#FF5F37", medium: "#FFAF37", low: "#11A483" };
      const spanColorClass = `bg-[${colors[task.priority]}]`;
      const taskElement = document.createElement("li");
      taskElement.className =
        "relative flex items-center justify-between w-full h-[105px] rounded-xl border dark:border-0 py-3 px-4 sm:py-6 sm:px-5 bg-[--surface-light]";
      taskElement.dataset.id = task.id;
  
      let priorityTagClass, priorityTagText;
      switch (task.priority) {
        case "high":
          priorityTagClass = "bg-[#FFE2DB] dark:bg-[#3D2327] text-[#FF5F37]";
          priorityTagText = "High";
          break;
        case "medium":
          priorityTagClass = "bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37]";
          priorityTagText = "Medium";
          break;
        case "low":
          priorityTagClass = "bg-[#C3FFF1] dark:bg-[#233332] text-[#11A483]";
          priorityTagText = "Low";
          break;
        default:
          priorityTagClass = "bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37]";
          priorityTagText = "Medium";
          break;
      }
  
      taskElement.innerHTML = `
            <span class="absolute right-0 top-0 bottom-0 my-auto h-[76px] sm:h-[78px] w-[4px] ${spanColorClass} rounded-l-lg"></span>
  
            <div class="flex flex-col items-start justify-center gap-3 w-full">
              <div class="flex items-start justify-start gap-2">
                <input type="checkbox" class="w-5 h-5" ${
                  task.completed ? "checked" : ""
                }>
                <h3 class="sm:text-base sm:font-bold text-sm font-semibold">
                  ${task.title}
                </h3>
                <span class="text-xs px-2 py-1 rounded-[4px] ${priorityTagClass}">
                  ${priorityTagText}
                </span>
              </div>
              <p class="sm:text-sm text-xs font-normal text-gray-500">
                ${task.description}
              </p>
            </div>
  
            <div class="task-actions relative self-start mt-2 sm:mt-0">
              <img src="./assets/icons/Edit-menu.svg" alt="actions" class="actions-toggle block dark:hidden cursor-pointer">
              <img src="./assets/icons/darkmode/Edit-Delete-Menu.svg" alt="actions" class="actions-toggle hidden dark:block cursor-pointer">
              <div class="hidden absolute top-[25px] right-[-10px] mt-[3px] w-[78px] h-[34px] p-[5px] border border-[#EBEDEF] dark:border-[--gray-800] rounded-[8px] shadow-[0px_12px_24px_-6px_#1414190F] flex items-center gap-2 z-10 bg-white">
                <img src="./assets/icons/tabler_trash.svg" alt="delete" class="w-[24px] h-[24px] block dark:hidden cursor-pointer delete-task-icon">
                <img src="./assets/icons/darkmode/tabler_trash.svg" alt="delete" class="w-[24px] h-[24px] hidden dark:block cursor-pointer delete-task-icon">
                <div class="border-l border-[#EBEDEF] dark:border-[--gray-800] h-[20px]"></div>
                <img src="./assets/icons/tabler_edit.svg" alt="edit" class="w-[24px] h-[24px] block dark:hidden cursor-pointer edit-task-icon">
                <img src="./assets/icons/darkmode/tabler_edit.svg" alt="edit" class="w-[24px] h-[24px] hidden dark:block cursor-pointer edit-task-icon">
              </div>
            </div>`;
  
      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", function () {
        const taskId = parseInt(taskElement.dataset.id);
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
  
        if (taskIndex !== -1) {
          tasks[taskIndex].completed = this.checked;
          renderAll();
        }
      });
  
      const actionsDiv = taskElement.querySelector(".task-actions > div");
      const actionToggles = taskElement.querySelectorAll(".task-actions > img");
      actionToggles.forEach((btn) =>
        btn.addEventListener("click", () => {
          actionsDiv.classList.toggle("hidden");
        })
      );
  
      const deleteButtons = taskElement.querySelectorAll(".delete-task-icon");
      deleteButtons.forEach((btn) =>
        btn.addEventListener("click", () => {
          const taskId = Number(taskElement.dataset.id);
          deleteTask(taskId);
        })
      );
  
      const editButtons = taskElement.querySelectorAll(".edit-task-icon");
      editButtons.forEach((btn) =>
        btn.addEventListener("click", () => {
          const taskId = Number(taskElement.dataset.id);
          const t = tasks.find((t) => t.id === taskId);
          if (t) showEditForm(t);
          actionsDiv.classList.add("hidden");
        })
      );
  
      return taskElement;
    }
  
    function showEditForm(task) {
      const editForm = document.createElement("form");
      editForm.className =
        "edit-task-form flex flex-col gap-3 p-4 border dark:border-[--gray-800] rounded-md bg-[--background-light]";
      editForm.innerHTML = `
        <input type="text" id="editTaskTitle" placeholder="Task Name " class="w-full px-3 py-2 rounded-md sm:font-bold font-semibold sm:text-base text-sm text-[#7D7D7F] dark:text-white bg-[--background-light] focus:outline-none focus:ring-0" required value="${
          task.title
        }">
        <input type="text" id="editTaskDescription" placeholder="Desceription" class="w-full px-3 py-2 rounded-md sm:font-semibold font-normal sm:text-sm text-xs text-[#AFAEB2] dark:text-[#83878F] bg-[--background-light] focus:outline-none focus:ring-0" value="${
          task.description
        }">
        <div class="flex items-center h-8 w-[74px] gap-2 px-[8px] py-[4px] mt-6 mr-3 bg-[--background-light] border border-[#EBEDEF] dark:border-[--gray-800] rounded-[4px] text-sm font-semibold text-[#AFAEB2] cursor-pointer edit-tag-button">
            <img src="./assets/icons/tag-close.svg" alt="tags" class="default-tag-icon w-4 h-4 ${
              task.priority ? "hidden" : ""
            }">
            <img src="./assets/icons/tag-open.svg" alt="tags" class="active-tag-icon w-4 h-4 ${
              task.priority ? "" : "hidden"
            }">
            Tags
        </div>
        <div id="editPriorityTags" class="hidden block w-[240px] right-0 top-full mt-4 mr-3 flex items-center gap-4 p-[10px] bg-[--surface-light] border border-[#EBEDEF] dark:border-[--gray-800] rounded-lg shadow-md z-50">
            <button data-priority="low" class="priority-filter px-2 pb-1 rounded-[4px] bg-[#C3FFF1] dark:bg-[#233332] text-[#11A483] text-sm font-medium hover:bg-green-200 dark:hover:bg-green-200 ${
              task.priority === "low" ? "active" : ""
            }">Low</button>
            <div class="border-l border-[#EBEDEF] dark:border-[--gray-800] h-[16px]"></div>
            <button data-priority="medium" class="priority-filter px-2 pb-1 rounded-[4px] bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37] text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-100 ${
              task.priority === "medium" ? "active" : ""
            }">Medium</button>
            <div class="border-l border-[#EBEDEF] dark:border-[--gray-800] h-[16px]"></div>
            <button data-priority="high" class="priority-filter px-2 pb-1 rounded-[4px] bg-[#FFE2DB] dark:bg-[#3D2327] text-[#FF5F37] text-sm font-medium hover:bg-red-200 dark:hover:bg-red-200 ${
              task.priority === "high" ? "active" : ""
            }">High</button>
        </div>
        <div class="selected-tag-container">
            ${
              task.priority
                ? `
                <div class="flex items-center mt-4 mr-3">
                  <button data-priority="${
                    task.priority
                  }" class="priority-filter flex justify-center items-center gap-[6px] px-2 pt-1 pb-2 rounded-[4px] text-sm font-medium ${getPriorityClass(
                    task.priority
                  )}">
                    <img src="./assets/icons/Close-light.svg" alt="close-light" class="w-4 mt-1 block dark:hidden cursor-pointer remove-edit-tag-btn">
                    <img src="./assets/icons/darkmode/Close-dark.svg" alt="close-dark" class="w-4 mt-1 hidden dark:block cursor-pointer remove-edit-tag-btn">
                    ${getPriorityText(task.priority)}
                  </button>
                </div> `
                : ``
            }
        </div>
        <div class="w-[calc(100%+32px)] flex justify-end items-center -mx-[16px] mt-4 bg-[--background-light] border-t border-[#EBEDEF] dark:border-[--gray-800] pt-4 pr-4 gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cancel-edit-btn">Cancle</button>
            <button type="submit" class="px-4 py-2 bg-[--primary] text-white rounded-lg hover:bg-blue-400"> Edit Task </button>
        </div>`;
  
      const taskElement = activeTasksList.querySelector(`[data-id="${task.id}"]`);
      if (taskElement) {
        taskElement.insertAdjacentElement("afterend", editForm);
  
        const editPriorityTags = editForm.querySelector("#editPriorityTags");
        const editTagBtn = editForm.querySelector(".edit-tag-button");
        const editPriorityButtons =
          editPriorityTags.querySelectorAll(".priority-filter");
        const selectedEditTagContainer = editForm.querySelector(
          ".selected-tag-container"
        );
        const cancelEditBtn = editForm.querySelector(".cancel-edit-btn");
        const editFormElement = editForm;
  
        editTagBtn.addEventListener("click", (e) => {
          e.preventDefault();
          editPriorityTags.classList.toggle("hidden");
          editTagBtn
            .querySelector(".default-tag-icon")
            .classList.toggle("hidden");
          editTagBtn.querySelector(".active-tag-icon").classList.toggle("hidden");
        });
  
        function displayEditSelectedTag(priority) {
          selectedEditTagContainer.innerHTML = `
                <div class="flex items-center mt-4 mr-3">
                    <button data-priority="${priority}" class="priority-filter flex justify-center items-center gap-[6px] px-2 pt-1 pb-2 rounded-[4px] text-sm font-medium ${getPriorityClass(
            priority
          )}">
                      <img src="./assets/icons/Close-light.svg" alt="close-light" class="w-4 mt-1 block dark:hidden cursor-pointer remove-edit-tag-btn">
                      <img src="./assets/icons/darkmode/Close-dark.svg" alt="close-dark" class="w-4 mt-1 hidden dark:block cursor-pointer remove-edit-tag-btn">
                      ${getPriorityText(priority)}
                    </button>
                </div>`;
  
          const removeEditTagBtns = selectedEditTagContainer.querySelectorAll(
            ".remove-edit-tag-btn"
          );
          removeEditTagBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              selectedPriority = null;
              selectedEditTagContainer.innerHTML = "";
              editTagBtn.classList.remove("hidden");
              const defaultIcon = editTagBtn.querySelector(".default-tag-icon");
              const activeIcon = editTagBtn.querySelector(".active-tag-icon");
              defaultIcon.classList.remove("hidden");
              activeIcon.classList.add("hidden");
              editPriorityButtons.forEach((b) => b.classList.remove("active"));
            });
          });
        }
  
        editPriorityButtons.forEach((btn) => {
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            editPriorityButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            selectedPriority = this.dataset.priority;
            displayEditSelectedTag(this.dataset.priority);
            editTagBtn.classList.add("hidden");
            editPriorityTags.classList.add("hidden");
            editTagBtn
              .querySelector(".default-tag-icon")
              .classList.remove("hidden");
            editTagBtn.querySelector(".active-tag-icon").classList.add("hidden");
          });
        });
  
        cancelEditBtn.addEventListener("click", (e) => {
          e.preventDefault();
          editFormElement.remove();
          currentlyEditingTask = null;
        });
  
        editFormElement.addEventListener("submit", (e) => {
          e.preventDefault();
          const editTitle = document.getElementById("editTaskTitle").value;
          const editDescription = document.getElementById(
            "editTaskDescription"
          ).value;
          const priority = selectedPriority || task.priority || "medium";
  
          const index = tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            tasks[index].title = editTitle;
            tasks[index].description = editDescription;
            tasks[index].priority = priority;
          }
          renderAll();
          currentlyEditingTask = null;
        });
  
        // Show the initial selected tag in the edit form
        if (task.priority) {
          editTagBtn.classList.add("hidden");
          displayEditSelectedTag(task.priority);
          // Enable the priority button in the tag list
          editPriorityButtons.forEach((button) => {
            if (button.dataset.priority === task.priority) {
              button.classList.add("active");
            } else {
              button.classList.remove("active");
            }
          });
        } else {
          editTagBtn.classList.remove("hidden");
        }
      }
    }
  
    function deleteTask(taskId) {
      tasks = tasks.filter((task) => task.id !== taskId);
      renderAll();
    }
  
    function getPriorityClass(priority) {
      switch (priority) {
        case "high":
          return "bg-[#FFE2DB] dark:bg-[#3D2327] text-[#FF5F37]";
        case "medium":
          return "bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37]";
        case "low":
          return "bg-[#C3FFF1] dark:bg-[#233332] text-[#11A483]";
        default:
          return "bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37]";
      }
    }
  
    function getPriorityText(priority) {
      switch (priority) {
        case "high":
          return "High";
        case "medium":
          return "Medium";
        case "low":
          return "Low";
        default:
          return "Medium";
      }
    }
  
    function renderDoneTasks() {
      const doneE1 = document.getElementById("done-tasks");
      const countE2 = document.getElementById("done-count");
      const completedSection = document.getElementById("completedSection");
      const doneTasks = tasks.filter((task) => task.completed);
  
      doneE1.innerHTML = "";
      countE2.textContent = doneTasks.length;
  
      doneTasks.forEach((task) => {
        const li = document.createElement("li");
        const colors = { high: "#FF5F37", medium: "#FFAF37", low: "#11A483" };
        const spanColorClass = `bg-[${colors[task.priority]}]`;
  
        li.className =
          "relative flex items-center justify-between w-full h-[66px] sm:h-[74px] bg-[--surface-light] rounded-xl border dark:border-0 py-3 px-4 sm:py-6 sm:px-5";
  
        li.innerHTML = `
          <span class="absolute right-0 top-0 bottom-0 my-auto h-[42px] sm:h-[48px] w-[4px] ${spanColorClass} rounded-l-lg"></span>
          <div class="flex items-center justify-start sm:flex-1 gap-4">
            <input type="checkbox" class="w-5 h-5" checked>
            <span class="text-sm font-semibold sm:text-base sm:font-medium line-through">${task.title}</span>
          </div>
          <img src="./assets/icons/tabler_trash.svg" alt="delete-task" class="delete-btn block dark:hidden flex items-center justify-end h-[24px] cursor-pointer">
          <img src="./assets/icons/darkmode/tabler_trash.svg" alt="delete-task" class="delete-btn hidden dark:block flex items-center justify-end h-[24px] cursor-pointer">
        `;
  
        const deleteBtns = li.querySelectorAll(".delete-btn");
        deleteBtns.forEach((btn) =>
          btn.addEventListener("click", () => {
            deleteTask(task.id);
            renderAll();
          })
        );
  
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener("change", () => {
          task.completed = false;
          renderAll();
        });
  
        doneE1.appendChild(li);
      });
      if (doneTasks.length > 0) {
        completedSection.classList.remove("hidden");
      } else {
        completedSection.classList.add("hidden");
      }
    }
  
    // Mobile Menu
    const hamburgerBtn = document.getElementById("hamburger-menu");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerContent = document.getElementById("drawerContent");
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const drawerClose = document.getElementById("drawerClose");
  
    function toggleDrawer() {
      mobileDrawer.classList.toggle("hidden");
      if (!mobileDrawer.classList.contains("hidden")) {
        drawerContent.classList.remove("-translate-x-full");
      } else {
        drawerContent.classList.add("-translate-x-full");
      }
    }
  
    hamburgerBtn.addEventListener("click", toggleDrawer);
  
    drawerBackdrop.addEventListener("click", toggleDrawer);
    drawerClose.addEventListener("click", toggleDrawer);
  
    // Dark-Mode
    const lightBtnM = document.getElementById("light-btn-m");
    const darkBtnM = document.getElementById("dark-btn-m");
    const lightBtnD = document.getElementById("light-btn-d");
    const darkBtnD = document.getElementById("dark-btn-d");
  
    function setTheme(mode) {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", mode);
    }
  
    lightBtnM.addEventListener("click", () => setTheme("light"));
    darkBtnM.addEventListener("click", () => setTheme("dark"));
    lightBtnD.addEventListener("click", () => setTheme("light"));
    darkBtnD.addEventListener("click", () => setTheme("dark"));
  
    document.addEventListener("DOMContentLoaded", () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });
  });
  