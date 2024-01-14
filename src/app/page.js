'use client';

import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { CssBaseline, Button, AppBar, Toolbar, TextField } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import theme from './theme';
import dateToStr from './dateUtil';

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

const App = () => {
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
      <form onSubmit={(e) => onSubmit(e)} className="tw-flex tw-flex-col tw-p-4 tw-gap-2">
        <TextField label="할 일을 입력해주세요." variant="outlined" />
        <Button variant="contained" className="tw-font-bold">
          추가
        </Button>
      </form>
    </>
  );
};

export default function themeApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
