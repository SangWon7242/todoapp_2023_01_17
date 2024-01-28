'use client';

import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import * as React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
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

const todosAtom = atom({
  key: 'app/todosAtom',
  default: [],
});

const lastTodoIdAtom = atom({
  key: 'app/lastTodoIdAtom',
  default: 0,
});

function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const [lastTodoId, setLastTodoId] = useRecoilState(lastTodoIdAtom);
  const lastTodoIdRef = React.useRef(lastTodoId);

  lastTodoIdRef.current = lastTodoId;

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;
    setLastTodoId(id);

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

function NewTodoForm({ noticeSnackBarStatus }) {
  const todosStatus = useTodosStatus();

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일을 입력해주세요.');
      form.content.focus();
      return;
    }

    const newTodoId = todosStatus.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
    noticeSnackBarStatus.open(`${newTodoId}번 할일이 추가되었습니다.`);
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

function TodoListItem({ todo, index, openDrawer, todosStatus }) {
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

function useEditTodoModalStatus() {
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

function EditTodoModal({ status, todosStatus, todo, closeDrawer, noticeSnackBarStatus }) {
  const close = () => {
    status.close();
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

    todosStatus.modifyTodoById(todo.id, form.content.value);
    close();
    noticeSnackBarStatus.open(`${todo.id}번 할일이 수정되었습니다`, 'info');
  };

  return (
    <>
      <Modal
        open={status.opened}
        onClose={status.close}
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

function TodoOptionDrawer({ status, todosStatus, noticeSnackBarStatus }) {
  const removeTodo = () => {
    if (confirm(`${status.todoId}번 할일을 삭제하시겠습니까?`) == false) {
      status.close();
      return;
    }

    todosStatus.removeTodoById(status.todoId);
    status.close();
    noticeSnackBarStatus.open(`${status.todoId}번 할일을 삭제되었습니다.`, 'info');
  };

  const editTodoModalStatus = useEditTodoModalStatus();

  const todo = todosStatus.findTodoById(status.todoId);

  return (
    <>
      <EditTodoModal
        status={editTodoModalStatus}
        todosStatus={todosStatus}
        todo={todo}
        closeDrawer={status.close}
        noticeSnackBarStatus={noticeSnackBarStatus}
      />
      <SwipeableDrawer
        anchor={'bottom'}
        onOpen={() => {}}
        open={status.opened}
        onClose={status.close}>
        <List>
          <ListItem className="tw-flex tw-gap-2">
            <span className="tw-text-[--mui-color-primary-main]">{status.todoId}번</span>
            <span>할일에 대하여</span>
            <Divider className="tw-my-[5px]" />
          </ListItem>
          <ListItemButton
            className="tw-p-[15px_20px] tw-flex tw-gap-x-2 tw-items-center"
            onClick={editTodoModalStatus.open}>
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

function TodoList({ todosStatus, noticeSnackBarStatus }) {
  const todoOptionDrawerStatus = useTodoOptionDrawerStatue();

  return (
    <>
      <TodoOptionDrawer
        status={todoOptionDrawerStatus}
        todosStatus={todosStatus}
        noticeSnackBarStatus={noticeSnackBarStatus}
      />
      <nav className="tw-mt-3 tw-px-4">
        <ul>
          {todosStatus.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={index}
              todosStatus={todosStatus}
              openDrawer={todoOptionDrawerStatus.open}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

function NoticeSnackBar({ status }) {
  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.autoHideDuration}
        onClose={status.close}>
        <Alert variant={status.variant} severity={status.severity}>
          {status.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

function useNoticeSnackBarStatus() {
  const [opened, setOpened] = React.useState(false);
  const [autoHideDuration, setAutoHideDuration] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [variant, setVariant] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

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
  const todosStatus = useTodosStatus();
  const noticeSnackBarStatus = useNoticeSnackBarStatus();

  React.useEffect(() => {
    todosStatus.addTodo('테니스\n유산소\n배드민턴');
    todosStatus.addTodo('야구');
    todosStatus.addTodo('볼링');
  }, []);

  return (
    <>
      <AppBar position="fixed">
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
      <NoticeSnackBar status={noticeSnackBarStatus} />
      <NewTodoForm noticeSnackBarStatus={noticeSnackBarStatus} />
      <TodoList todosStatus={todosStatus} noticeSnackBarStatus={noticeSnackBarStatus} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  );
}
