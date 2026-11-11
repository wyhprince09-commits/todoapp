//import React from "react";
// 注意：最新版的 react-router-dom 中，Switch 已经被重命名为 Routes
//import { Routes, Route, Link } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';

//function App() {
//  return (
//    <div className="App">
//      Hello Student
//    </div>
//  );
//}
//
//export default App;
//以上是截至第五个作业
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container } from "react-bootstrap";
import TodoDataService from './services/todos';//第七新增行
// 导入我们刚才创建的组件
import AddTodo from "./components/add-todo";
import TodosList from "./components/todos-list";
import Login from "./components/login";
import Signup from "./components/signup";

function App() {
  // 定义 React Hooks 状态
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  // 初步的登录、登出、注册函数，第六
  // async function login(user = null) {
  //   setUser(user);
  // }

  // async function logout() {
  //   setUser(null);
  //   setToken(null); // 登出时顺便清空 token
  // }

  // async function signup(user = null) {
  //   setUser(user);
  // }第六
    async function login(user = null) {
    TodoDataService.login(user)
      .then(response => {
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
        setError('');
      })
      .catch(e => {
        console.log('login error', e);
        setError(e.toString());
      });
  }

  async function logout() {
    setToken('');
    setUser('');
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
  }

  async function signup(user = null) {
    TodoDataService.signup(user)
      .then(response => {
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
      })
      .catch(e => {
        console.log(e);
        setError(e.toString());
      });
  }

  return (
    <div className="App">
      {/* 导航栏 */}
      <Navbar bg="primary" variant="dark">
        <div className="container-fluid">
          <Navbar.Brand>TodosApp</Navbar.Brand>
          <Nav className="me-auto">
            <Container>
              <Link className="nav-link" to={"/todos"}>Todos</Link>
              
              {/* 根据 user 状态判断显示 Login/Signup 还是 Logout */}
              {user ? (
  <Link className="nav-link" onClick={logout} style={{cursor: "pointer"}}>Logout ({user})</Link>
              ) : (
  // ...
                <>
                  <Link className="nav-link" to={"/login"}>Login</Link>
                  <Link className="nav-link" to={"/signup"}>Sign Up</Link>
                </>
              )}
            </Container>
          </Nav>
        </div>
      </Navbar>

      {/* 路由内容区 */}
      <div className="container mt-4">
        <Routes>
          <Route path="/todos" element={<TodosList token={token} />} />
          <Route path="/todos/create" element={<AddTodo token={token} />} />
          {/* 兼容文档里的更新和编辑路由 */}
          <Route path="/todos/:id/" element={<AddTodo token={token} />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/signup" element={<Signup signup={signup} />} />
        </Routes>
      </div>

      {/* 页脚 */}
      <footer className="text-center text-lg-start bg-light text-muted mt-4">
        <div className="text-center p-4">
          @ Copyright - <a target="_blank" rel="noreferrer" className="text-reset fw-bold text-decoration-none" href="https://github.com/wyhprince09-commits">Tarik</a>
        </div>
      </footer>
    </div>
  );
}

export default App;