// 할 일 목록을 담을 배열 선언 및 초기화
let tasks = [];

// 할 일 목록을 표시할 요소와 할 일 추가 버튼 요소 가져옴.
const taskList = document.getElementById('list-items');
const createBtn = document.getElementById('create-btn');

/** 초기화 함수: 로컬 스토리지에서 데이터를 불러와 tasks 배열에 할 일을 설정 */
function initializedTask() {
    // 로컬 스토리지에서 할 일 데이터 불러오기
    // 만약 데이터가 없다면 빈 배열 할당
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 할 일 목록 화면에 렌더링
    renderTasks();
}

/** 할 일 요소 생성 함수: 각 할 일에 대한 요소를 생성하고 반환 */
function createTaskElement(task) {
    const newTask = document.createElement('li');
    let checkboxElement = task.completed ? '<input id="checkbox-input" type="checkbox" checked>' : '<input id="checkbox-input" type="checkbox">';
    let completedClass = task.completed ? 'class="completed"' : '';
    newTask.innerHTML = `
        ${checkboxElement}
        <input ${completedClass} id="text-input" type="text" value="${task.content || ''}">
        <button id="delete-btn">
            <i class="fa-solid fa-circle-minus"></i>
        </button>
    `;

    const checkbox = newTask.children[0];
    const textInput = newTask.children[1];
    const deleteBtn = newTask.children[2];

    // 체크박스 변경 시 task 객체 업데이트 및 저장
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        if (checkbox.checked) {
            textInput.classList.add('completed');
        } else {
            textInput.classList.remove('completed');
        }
        saveStorage();
    });

    // 텍스트 입력란 변경 시 task 객체 업데이트 및 저장
    textInput.addEventListener('input', () => {
        task.content = textInput.value;
        saveStorage();
    });

    // 삭제 버튼 클릭 시 해당 할 일 삭제
    deleteBtn.addEventListener('click', () => {
        const index = tasks.indexOf(task);
        if (index !== -1) {
            tasks.splice(index, 1);
            saveStorage();
            renderTasks();
        }
    });

    return newTask;
}

/** 할 일 추가 함수: 새로운 할 일을 생성하고 tasks 배열에 추가 */
function addTask() {
    // 새로운 할 일 객체 생성
    const task = {
        completed: false,
        content: '',
        id: Date.now(),
    }

    // 할 일 객체를 tasks 배열에 추가
    tasks.push(task);

    // 로컬 스토리지에 변경된 tasks 배열 저장
    saveStorage();

    // 할 일 목록 다시 렌더링
    renderTasks();
}

/** 할 일 렌더링 함수: tasks 배열의 할 일들을 HTML 문서에 렌더링 */
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const newTask = createTaskElement(task);
        taskList.appendChild(newTask);
        console.log(newTask.innerHTML)
    });
}

/** 로컬 스토리지에 tasks 배열을 저장하는 함수 */
function saveStorage() {
    // tasks 배열을 로컬 스토리지에 문자열로 저장
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

createBtn.addEventListener('click', addTask);
initializedTask();