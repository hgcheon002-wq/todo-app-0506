# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 실행 방법

빌드 도구나 서버가 없는 순수 정적 앱입니다. `index.html`을 브라우저에서 직접 열면 바로 동작합니다.

```
# 파일 탐색기에서 더블클릭하거나, 브라우저 주소창에 경로 입력
index.html
```

VS Code를 사용한다면 **Live Server** 확장을 설치해 `index.html` 우클릭 → "Open with Live Server"로 실행할 수 있습니다.

## 아키텍처

빌드 과정 없이 동작하는 바닐라 JS(프레임워크 미사용) 앱입니다. 세 파일이 각각 역할을 분담합니다.

### 데이터 흐름 (app.js)

상태(state)는 `todos` 전역 배열 하나로 관리됩니다. 모든 변경은 아래 순서를 따릅니다.

```
사용자 이벤트 → 기능 함수 호출 → todos 배열 수정 → saveToStorage() → render()
```

- `todos` 배열의 각 항목 형태: `{ id: number, text: string, done: boolean }`
- `id`는 `Date.now()`로 생성 (밀리초 타임스탬프)
- `render()`는 매번 `#todo-list`를 완전히 비우고 DOM을 다시 생성합니다 (가상 DOM 없음)
- 데이터 영속성은 `localStorage`의 `'todos'` 키 하나로 처리합니다

### 기능 함수 목록 (app.js)

| 함수 | 역할 |
|---|---|
| `loadFromStorage()` | 앱 시작 시 localStorage에서 데이터 복원 |
| `saveToStorage()` | 변경 후 localStorage에 저장 |
| `render()` | todos 배열 기준으로 DOM 전체 재생성 |
| `addTodo(text)` | 항목 추가 (빈 문자열 무시) |
| `toggleTodo(id)` | 완료/미완료 전환 |
| `deleteTodo(id)` | 개별 항목 삭제 |
| `clearDone()` | 완료 항목 일괄 삭제 |

### HTML 구조와 JS 연결점

JS가 직접 참조하는 HTML `id` 목록입니다. 변경 시 양쪽 모두 수정해야 합니다.

- `#todo-input` — 텍스트 입력창
- `#add-btn` — 추가 버튼
- `#todo-list` — 항목이 렌더링되는 `<ul>`
- `#remaining` — 남은 항목 수 텍스트
- `#clear-btn` — 완료 항목 일괄 삭제 버튼

### CSS 주요 규칙

- 완료 항목은 `<li>` 에 `.done` 클래스를 추가하여 `.done .todo-text`에 취소선 스타일 적용
- 브랜드 색상: `#4f46e5` (보라, 추가 버튼) / `#e53e3e` (빨강, 삭제 버튼)
- 레이아웃은 Flexbox 기반이며 최대 너비 480px 중앙 정렬


## index.html은 절대 수정하지 않는다.