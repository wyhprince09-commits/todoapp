import React, { useState, useEffect } from 'react';
import TodoDataService from '../services/todos';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

const TodosList = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    retrieveTodos();
  }, [props.token]);

  const retrieveTodos = () => {
    TodoDataService.getAll(props.token)
      .then(response => {
        setTodos(response.data);
      })
      .catch(e => console.log(e));
  };

  // 作业 11：删除功能
  const deleteTodo = (todoId) => {
    TodoDataService.deleteTodo(todoId, props.token)
      .then(response => {
        retrieveTodos(); // 删除成功后刷新列表
      })
      .catch(e => console.log(e));
  };

  // 作业 12：一键完成功能
  const completeTodo = (todoId) => {
    TodoDataService.completeTodo(todoId, props.token)
      .then(response => {
        retrieveTodos(); // 完成成功后刷新列表
      })
      .catch(e => console.log(e));
  };

  return (
    <Container>
      {!props.token || props.token === "" ? (
        <Alert variant="warning">
          You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
        </Alert>
      ) : (
        <div>
          {/* 作业 9：添加入口按钮 */}
          <Link to={"/todos/create"}>
            <Button variant="outline-info" className="mb-3">
              Add To-do
            </Button>
          </Link>

          {todos.map((todo) => {
            return (
              <Card key={todo.id} className="mb-3">
                <Card.Body>
                  {/* 作业 12：如果已完成，添加删除线样式 text-decoration-line-through */}
                  <div className={todo.completed ? "text-decoration-line-through" : ""}>
                    <Card.Title>{todo.title}</Card.Title>
                    <Card.Text><b>Memo:</b> {todo.memo}</Card.Text>
                    <Card.Text>
                      Date created: {moment(todo.created_at).format("Do MMMM YYYY")}
                    </Card.Text>
                  </div>

                  <div className="mt-2">
                    {/* 作业 12：未完成才显示编辑按钮 */}
                    {!todo.completed && (
                      <Link to={`/todos/${todo.id}`} state={{ currentTodo: todo }}>
                        <Button variant="outline-info" className="me-2">Edit</Button>
                      </Link>
                    )}
                    
                    {/* 作业 11：删除按钮 */}
                    <Button variant="outline-danger" className="me-2" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </Button>

                    {/* 作业 12：完成按钮 */}
                    <Button variant="outline-success" onClick={() => completeTodo(todo.id)}>
                      Complete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default TodosList;