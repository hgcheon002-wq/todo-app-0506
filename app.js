// ──────────────────────────────────────────
// 데이터: 할 일 목록을 배열로 관리
// 각 항목은 { id, text, done } 형태
// ──────────────────────────────────────────
let todos = [];

// 현재 선택된 탭: 'all' | 'active' | 'done'
let currentFilter = 'all';

// 페이지가 처음 로드될 때 localStorage에서 데이터 불러오기
// localStorage: 브라우저가 데이터를 저장해주는 공간 (새로고침해도 유지됨)
function loadFromStorage() {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos = JSON.parse(saved); // 문자열 → 배열로 변환
  }
}

// 변경이 있을 때마다 localStorage에 저장
function saveToStorage() {
  localStorage.setItem('todos', JSON.stringify(todos)); // 배열 → 문자열로 변환
}

// ──────────────────────────────────────────
// 탭 UI 생성: index.html을 수정하지 않으므로
// JS로 탭 요소를 만들어 #todo-list 앞에 삽입
// ──────────────────────────────────────────
function createTabs() {
  const tabArea = document.createElement('div');
  tabArea.id = 'tab-area';

  // 탭 버튼 3개 정의
  const tabs = [
    { filter: 'all',    label: '전체보기' },
    { filter: 'active', label: '진행중'   },
    { filter: 'done',   label: '완료'     },
  ];

  tabs.forEach(function (tab) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (tab.filter === currentFilter ? ' active' : '');
    btn.dataset.filter = tab.filter; // 어느 탭인지 데이터 속성으로 저장
    btn.textContent = tab.label;

    btn.addEventListener('click', function () {
      currentFilter = tab.filter; // 현재 필터 변경

      // 모든 탭에서 active 클래스 제거 후 클릭된 탭에만 추가
      document.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      render();
    });

    tabArea.appendChild(btn);
  });

  // #todo-list 바로 앞에 탭 영역 삽입
  const list = document.getElementById('todo-list');
  list.parentNode.insertBefore(tabArea, list);
}

// ──────────────────────────────────────────
// 렌더링: todos 배열을 보고 화면을 새로 그림
// ──────────────────────────────────────────
function render() {
  const list = document.getElementById('todo-list');
  const remaining = document.getElementById('remaining');

  // 현재 탭에 따라 표시할 항목 필터링
  const filtered = todos.filter(function (todo) {
    if (currentFilter === 'active') return !todo.done; // 진행중: 미완료만
    if (currentFilter === 'done')   return todo.done;  // 완료: 완료만
    return true;                                        // 전체보기: 모두
  });

  // 기존 목록을 비우고 다시 그림
  list.innerHTML = '';

  filtered.forEach(function (todo) {
    // li 요소 만들기
    const li = document.createElement('li');
    if (todo.done) {
      li.classList.add('done'); // 완료 상태면 취소선 스타일 적용
    }

    // 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', function () {
      toggleTodo(todo.id); // 체크 상태가 바뀌면 토글 함수 호출
    });

    // 텍스트
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', function () {
      deleteTodo(todo.id);
    });

    // li 안에 요소들 추가
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // ul 안에 li 추가
    list.appendChild(li);
  });

  // 남은 항목 수 업데이트 (done이 false인 것만 세기)
  const count = todos.filter(function (t) { return !t.done; }).length;
  remaining.textContent = '남은 항목: ' + count + '개';
}

// ──────────────────────────────────────────
// 기능 함수들
// ──────────────────────────────────────────

// 할 일 추가
function addTodo(text) {
  const trimmed = text.trim(); // 앞뒤 공백 제거
  if (!trimmed) return; // 빈 문자열이면 아무것도 하지 않음

  const newTodo = {
    id: Date.now(), // 고유 ID로 현재 시각(밀리초)을 사용
    text: trimmed,
    done: false,
  };

  todos.push(newTodo); // 배열에 추가
  saveToStorage();
  render();
}

// 완료/미완료 토글 (체크박스 클릭 시)
function toggleTodo(id) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return { ...todo, done: !todo.done }; // done 값을 반전
    }
    return todo;
  });
  saveToStorage();
  render();
}

// 개별 항목 삭제
function deleteTodo(id) {
  todos = todos.filter(function (todo) { return todo.id !== id; });
  saveToStorage();
  render();
}

// 완료된 항목 전체 삭제
function clearDone() {
  todos = todos.filter(function (todo) { return !todo.done; });
  saveToStorage();
  render();
}

// ──────────────────────────────────────────
// 이벤트 연결
// ──────────────────────────────────────────

// 추가 버튼 클릭
document.getElementById('add-btn').addEventListener('click', function () {
  const input = document.getElementById('todo-input');
  addTodo(input.value);
  input.value = ''; // 입력창 비우기
  input.focus();    // 다시 입력창에 커서 놓기
});

// Enter 키로도 추가 가능
document.getElementById('todo-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('add-btn').click();
  }
});

// 완료 항목 삭제 버튼
document.getElementById('clear-btn').addEventListener('click', clearDone);

// ──────────────────────────────────────────
// 앱 시작
// ──────────────────────────────────────────
loadFromStorage();
createTabs(); // 탭 UI를 DOM에 삽입한 뒤
render();     // 화면 그리기
