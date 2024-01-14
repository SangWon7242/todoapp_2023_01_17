'use client';

import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { Button, AppBar, Toolbar } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import theme from './theme';

const useTodoStatus = () => {
  const [todos, setTodos] = React.useState([]);
  const lastTodoIdRef = React.useRef(0);

  const addTodo = (newTitle) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      title: newTitle,
      regDate: dateToStr(new Date()),
    };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id != id);
    setTodos(newTodos);
  };

  const modifyTodo = (id, title) => {
    const newTodos = todos.map((todo) => (todo.id != id ? todo : { ...todo, title }));
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
  };
};

export default function App() {
  const todoState = useTodoStatus(); // 리액트 커스텀훅

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.title.value = form.title.value.trim();

    if (form.title.value.length == 0) {
      alert('할 일을 입력해주세요.');
      form.title.focus();
      return;
    }

    todoState.addTodo(form.title.value);
    form.title.value = '';
    form.title.focus();
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <div className="tw-flex-1">
              <FaBars className="tw-cursor-pointer" />
            </div>
            <div className="logo-box">
              <a className="tw-font-bold" href="/">
                HAPPY NOTE
              </a>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-end">
              <a href="/write">글작성</a>
            </div>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <form onSubmit={(e) => onSubmit(e)}>
          <input type="text" name="title" autoComplete="off" placeholder="할 일을 입력해주세요." />
          <button type="submit">추가</button>
          <button type="reset">취소</button>
        </form>
        {todoState.todos.length}
      </ThemeProvider>
    </>
  );
}

// 유틸리티

// 날짜 객체 입력받아서 문장(yyyy-mm-dd hh:mm:ss)으로 반환한다.
function dateToStr(d) {
  const pad = (n) => {
    return n < 10 ? '0' + n : n;
  };

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  );
}
