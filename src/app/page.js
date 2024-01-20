'use client';

import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import * as React from 'react';
import { CssBaseline, Button, AppBar, Toolbar, TextField, Chip, Box } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import RootTheme from './theme';
import dateToStr from './dateUtil';

function useTodosState() {
  const [todos, setTodos] = React.useState([]);
  const lastTodoIdRef = React.useRef(0);

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };

    setTodos((todos) => [newTodo, ...todos]);
  };

  const modifyTodo = (index, newContent) => {
    const newTodos = todos.map((todo, _index) =>
      _index != index ? todo : { ...todo, content: newContent },
    );
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, _index) => _index != index);
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    modifyTodo,
    removeTodo,
  };
}

function App() {
  const todosState = useTodosState(); // 리액트 커스텀훅

  React.useEffect(() => {
    todosState.addTodo('테니스\n유산소\n배드민턴');
    todosState.addTodo('야구');
    todosState.addTodo('볼링');
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 입력해주세요.');
      form.content.focus();
      return;
    }

    todosState.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
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
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          name="content"
          autoComplete="off"
          label="할 일을 입력해주세요."
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
      <nav className="tw-mt-3 tw-px-4">
        <ul>
          {todosState.todos.map((todo, index) => (
            <li key={todo.id}>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-3">
                <div className="tw-flex tw-gap-x-2 tw-font-bold">
                  <Chip className="tw-pt-[3px]" label={`번호 : ${todo.id}`} variant="outlined" />
                  <Chip
                    className="tw-pt-[3px]"
                    label={`현재날짜 : ${todo.regDate}`}
                    variant="outlined"
                    color="primary"
                  />
                </div>
                <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px]">
                  <Button
                    className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px] tw-items-start"
                    color="inherit">
                    <FaCheck
                      className={classNames(
                        'tw-text-3xl',
                        {
                          'tw-text-[--mui-color-primary-main]': index % 2 == 0,
                        },
                        { 'tw-text-[#dcdcdc]': index % 2 != 0 },
                      )}
                    />
                  </Button>
                  <div className="tw-bg-blue-500 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
                    {todo.content}
                  </div>
                  <div className="tw-bg-green-500 tw-w-[150px] tw-flex-shrink-0">후</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
