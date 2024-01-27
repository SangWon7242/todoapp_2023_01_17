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
  ListItemButton,
  Modal,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaBars } from 'react-icons/fa';
import { FaCheck, FaEllipsisVertical, FaTrashCan, FaPenToSquare } from 'react-icons/fa6';
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

    return id;
  };

  const modifyTodo = (index, newContent) => {
    const newTodos = todos.map((todo, _index) =>
      _index != index ? todo : { ...todo, content: newContent },
    );
    setTodos(newTodos);
  };

  const modifyTodoById = (id, newContent) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }

    modifyTodo(index, newContent);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, _index) => _index != index);
    setTodos(newTodos);
  };

  const removeTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index != -1) {
      removeTodo(index);
    }
  };

  const findTodoIndexById = (id) => {
    return todos.findIndex((todo) => todo.id == id);
  };

  const findTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }

    return todos[index];
  };

  return {
    todos,
    addTodo,
    modifyTodo,
    removeTodo,
    findTodoById,
    modifyTodoById,
    removeTodoById,
  };
}

function NewTodoForm({ todosState, noticeSnackBarState }) {
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 입력해주세요.');
      form.content.focus();
      return;
    }

    const newTodoId = todosState.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
    noticeSnackBarState.open(`${newTodoId}번 할일이 추가되었습니다.`);
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

function TodoListItem({ todo, index, openDrawer, todosState }) {
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

function useTodoOptionDrawerStatue() {
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

function useEditTodoModalState() {
  const [opened, setOpened] = React.useState(false);

  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
  };
}

function EditTodoModal({ state, todosState, todo, closeDrawer, noticeSnackBarState }) {
  const close = () => {
    state.close();
    closeDrawer();
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 입력해주세요.');
      form.content.focus();
      return;
    }

    todosState.modifyTodoById(todo.id, form.content.value);
    close();
    noticeSnackBarState.open(`${todo.id}번 할일이 수정되었습니다`, 'info');
  };

  return (
    <>
      <Modal
        open={state.opened}
        onClose={state.close}
        className="tw-flex tw-justify-center tw-items-center">
        <div className="tw-bg-white tw-p-10 tw-rounded-[20px] tw-w-full tw-max-w-lg">
          <form onSubmit={onSubmit} className="tw-flex tw-flex-col tw-gap-2">
            <TextField
              minRows={3}
              maxRows={10}
              multiline
              name="content"
              autoComplete="off"
              variant="outlined"
              label="할일을 입력해주세요."
              defaultValue={todo?.content}
            />

            <Button type="submit" variant="contained">
              수정
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}

function TodoOptionDrawer({ state, todosState, noticeSnackBarState }) {
  const removeTodo = () => {
    if (confirm(`${state.todoId}번 할일을 삭제하시겠습니까?`) == false) {
      state.close();
      return;
    }

    todosState.removeTodoById(state.todoId);
    state.close();
    noticeSnackBarState.open(`${state.todoId}번 할일을 삭제되었습니다.`, 'info');
  };

  const editTodoModalState = useEditTodoModalState();

  const todo = todosState.findTodoById(state.todoId);

  return (
    <>
      <EditTodoModal
        state={editTodoModalState}
        todosState={todosState}
        todo={todo}
        closeDrawer={state.close}
        noticeSnackBarState={noticeSnackBarState}
      />
      <SwipeableDrawer
        anchor={'bottom'}
        onOpen={() => {}}
        open={state.opened}
        onClose={state.close}>
        <List>
          <ListItem className="tw-flex tw-gap-2">
            <span className="tw-text-[--mui-color-primary-main]">{state.todoId}번</span>
            <span>할일에 대하여</span>
            <Divider className="tw-my-[5px]" />
          </ListItem>
          <ListItemButton
            className="tw-p-[15px_20px] tw-flex tw-gap-x-2 tw-items-center"
            onClick={editTodoModalState.open}>
            <span>수정</span>
            <FaPenToSquare className="block tw-mt-[-5px]" />
          </ListItemButton>
          <ListItemButton
            className="tw-pt-[15px] tw-px-[20px] tw-flex tw-gap-x-2 tw-items-center"
            onClick={removeTodo}>
            <span>삭제</span>
            <FaTrashCan className="block tw-mt-[-5px]" />
          </ListItemButton>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function TodoList({ todosState, noticeSnackBarState }) {
  const todoOptionDrawerState = useTodoOptionDrawerStatue();

  return (
    <>
      <TodoOptionDrawer
        state={todoOptionDrawerState}
        todosState={todosState}
        noticeSnackBarState={noticeSnackBarState}
      />
      <nav className="tw-mt-3 tw-px-4">
        <ul>
          {todosState.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={todo}
              todosState={todosState}
              openDrawer={todoOptionDrawerState.open}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

function NoticeSnackBar({ state }) {
  return (
    <>
      <Snackbar open={state.opened} autoHideDuration={state.autoHideDuration} onClose={state.close}>
        <Alert variant={state.variant} severity={state.severity}>
          {state.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

function useNoticeSnackBarState() {
  const [opened, setOpened] = React.useState(false);
  const [autoHideDuration, setAutoHideDuration] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [variant, setVariant] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

  // console.log(msg);

  const open = (msg, severity = 'success', autoHideDuration = 6000, variant = 'filled') => {
    setOpened(true);
    setMsg(msg);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
    setVariant(variant);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    severity,
    variant,
    msg,
  };
}

function App() {
  const todosState = useTodosStatus();
  const noticeSnackBarState = useNoticeSnackBarState();

  React.useEffect(() => {
    todosState.addTodo('테니스\n유산소\n배드민턴');
    todosState.addTodo('야구');
    todosState.addTodo('볼링');
  }, []);

  return (
    <>
      <AppBar position="fixed" onClick={() => noticeSnackBarState.open('하하')}>
        <Toolbar>
          <div className="tw-flex-1">
            <FaBars className="tw-cursor-pointer" />
          </div>
          <div className="logo-box">
            <span className="tw-font-bold">HAPPY NOTE</span>
          </div>
          <div className="tw-flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackBar state={noticeSnackBarState} />
      <NewTodoForm todosState={todosState} noticeSnackBarState={noticeSnackBarState} />
      <TodoList todosState={todosState} noticeSnackBarState={noticeSnackBarState} />
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
