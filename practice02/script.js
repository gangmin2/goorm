const createBtn = document.getElementById('create-btn');
const list = document.getElementById('list');

let tasks = [];

// 페이지가 로드될 때 로컬 스토리지에서 데이터를 검색하여 tasks 배열에 할당
if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
}

createBtn.addEventListener('click', addTask);

function addTask() {
    const task = {
        id: new Date().getTime(),
        text: '',
        completed: false
    }

    tasks.push(task);
    saveTasksToLocalStorage(); // 새로운 작업을 추가할 때마다 로컬 스토리지에 데이터 저장
    renderTasks();

    // 새로운 항목이 생성될 때 자동으로 포커스 설정
    const newInputEl = document.getElementById(`input-${task.id}`);
    if (newInputEl) {
        newInputEl.removeAttribute('disabled');
        newInputEl.focus();
    }
}

function renderTasks() {
    list.innerHTML = ''; // 이전에 렌더링된 항목 제거

    tasks.forEach(task => {
        const {
            taskEl,
            checkboxEl,
            inputEl,
            editBtnEl,
            removeBtnEl,
        } = createTaskElement(task);

        list.prepend(taskEl);

        inputEl.focus(); // 새로운 항목이 생성될 때 자동으로 포커스 설정

        editBtnEl.addEventListener('click', () => {
            inputEl.removeAttribute('disabled');
            inputEl.focus();
        });

        removeBtnEl.addEventListener('click', () => {
            taskEl.remove();
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasksToLocalStorage(); // 항목 삭제 시 로컬 스토리지 업데이트
        });

        // 포커스가 해제되면 자동으로 disabled 속성 추가
        inputEl.addEventListener('blur', () => {
            inputEl.setAttribute('disabled', '');
            saveTasksToLocalStorage(); // 포커스 해제 시 로컬 스토리지 업데이트
        });
    });
}

function createTaskElement(task) {
    const taskEl = document.createElement('li');
    taskEl.classList.add('task');

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = task.completed;

    checkboxEl.addEventListener('change', () => {
        task.completed = checkboxEl.checked;

        if (task.completed) {
            taskEl.classList.add('completed');
        } else {
            taskEl.classList.remove('completed');
        }

        saveTasksToLocalStorage(); // 체크박스 상태가 변경될 때마다 로컬 스토리지에 데이터 저장
    });

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = task.text;

    // 올바른 ID를 설정하여 input 요소에 포커스를 설정할 수 있도록 함
    inputEl.id = `input-${task.id}`;

    inputEl.setAttribute('disabled', ''); // 초기에는 입력 비활성화 상태로 시작

    inputEl.addEventListener('input', () => {
        task.text = inputEl.value;
        saveTasksToLocalStorage(); // 입력 내용이 변경될 때마다 로컬 스토리지에 데이터 저장
    });

    const editBtnEl = document.createElement('button');
    editBtnEl.innerText = '✏️';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.innerText = '🗑️';

    taskEl.append(checkboxEl);
    taskEl.append(inputEl);
    taskEl.append(editBtnEl);
    taskEl.append(removeBtnEl);

    return {
        taskEl,
        checkboxEl,
        inputEl,
        editBtnEl,
        removeBtnEl,
    }
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // tasks 배열을 로컬 스토리지에 문자열로 저장
}
