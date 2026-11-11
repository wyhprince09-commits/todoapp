import React, { useState } from 'react';
import TodoDataService from '../services/todos'; // 注意路径是 ../
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddTodo = (props) => {
  const navigate = useNavigate();
  const location = useLocation(); // 获取路由传过来的数据

  // 判断是否是编辑模式（如果传了 currentTodo，就是编辑）
  let editing = false;
  let initialTodoTitle = "";
  let initialTodoMemo = "";

  if (location.state && location.state.currentTodo) {
    editing = true;
    initialTodoTitle = location.state.currentTodo.title;
    initialTodoMemo = location.state.currentTodo.memo;
  }

  const [title, setTitle] = useState(initialTodoTitle);
  const [memo, setMemo] = useState(initialTodoMemo);
  const [submitted, setSubmitted] = useState(false); // 控制是否显示提交成功提示

  const onChangeTitle = e => setTitle(e.target.value);
  const onChangeMemo = e => setMemo(e.target.value);

  const saveTodo = () => {
    const data = {
      title: title,
      memo: memo,
      completed: false,
    };

    if (editing) {
      // 编辑模式：调用更新 API
      TodoDataService.updateTodo(location.state.currentTodo.id, data, props.token)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => console.log(e));
    } else {
      // 新建模式：调用创建 API
      TodoDataService.createTodo(data, props.token)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <Container>
      {submitted ? (
        <div className="text-center mt-4">
          <h4>Todo submitted successfully</h4>
          <Link to={"/todos"}>Back to Todos</Link>
        </div>
      ) : (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{editing ? "Edit" : "Create"} Todo</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g. buy gift tomorrow"
              value={title}
              onChange={onChangeTitle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={memo}
              onChange={onChangeMemo}
            />
          </Form.Group>

          <Button variant="info" onClick={saveTodo}>
            {editing ? "Edit" : "Add"} To-do
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddTodo;