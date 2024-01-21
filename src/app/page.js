'use client';

import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import * as React from 'react';
import {
  CssBaseline,
  Button,
  AppBar,
  Toolbar,
  TextField,
  Chip,
  Box,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { FaBars } from 'react-icons/fa';
import { FaCheck, FaEllipsisVertical } from 'react-icons/fa6';
import RootTheme from './theme';
import dateToStr from './dateUtil';

function useTodosStatus() {
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

function NewTodoForm({ todosState }) {
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
    </>
  );
}

function TodoListItem({ todo, index, openDrawer }) {
  return (
    <>
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
          <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px] tw-min-h-[80px]">
            <Button className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px]" color="inherit">
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
            <div className="tw-bg-[#dcdcdc] tw-w-[2px] tw-h-[60px] tw-self-center"></div>
            <div className="tw-flex-grow tw-flex tw-items-center hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words tw-p-[5px_10px]">
              {todo.content}
            </div>
            <Button
              onClick={() => openDrawer(todo.id)}
              className="tw-flex-shrink-0 tw-rounded-[0_10px_10px_0]"
              color="inherit">
              <FaEllipsisVertical className="tw-text-[#dcdcdc] tw-text-2xl" />
            </Button>
          </div>
        </div>
      </li>
    </>
  );
}

function useTodoOptionDrawerStatus() {
  const [todoId, setTodoId] = React.useState(null);
  const opened = React.useMemo(() => todoId !== null, [todoId]);

  const close = () => setTodoId(null);
  const open = (id) => setTodoId(id);

  return {
    todoId,
    opened,
    close,
    open,
  };
}

function TodoOptionDrawer({ status }) {
  return (
    <>
      <SwipeableDrawer
        anchor={'bottom'}
        onOpen={() => {}}
        open={status.opened}
        onClose={status.close}>
        <List>
          <ListItem className="tw-flex tw-gap-2 tw-p-[15px]">
            <span className="tw-text-[--mui-color-primary-main]">{status.todoId}번</span>
            <span>할일에 대하여</span>
          </ListItem>
          <Divider className="tw-my-[5px]" />
          <ListItem className="tw-p-[15px_20px]">수정</ListItem>
          <ListItem className="tw-p-[15px_20px]">삭제</ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function TodoList({ todosState }) {
  const todoOptionDrawerStatus = useTodoOptionDrawerStatus();

  return (
    <>
      <TodoOptionDrawer status={todoOptionDrawerStatus} />
      <nav className="tw-mt-3 tw-px-4">
        <ul>
          {todosState.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={todo}
              openDrawer={todoOptionDrawerStatus.open}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

function App() {
  const todosState = useTodosStatus();

  React.useEffect(() => {
    todosState.addTodo('테니스\n유산소\n배드민턴');
    todosState.addTodo('야구');
    todosState.addTodo('볼링');
  }, []);

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
          <div className="tw-flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NewTodoForm todosState={todosState} />
      <TodoList todosState={todosState} />
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
