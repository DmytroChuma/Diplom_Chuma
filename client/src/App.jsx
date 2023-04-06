import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import "./font-awesome.css";
 
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Registration from "./Pages/Auth/Registration";
import Search from "./Pages/Search";
import NotFoundPage from "./Pages/NotFoundPage";
import Advertisement from "./Pages/Advertisement";
import NewAdvertisement from "./Pages/NewAdvertisement";
import Forget from "./Pages/Auth/Forget";
import Cabinet from "./Pages/User/Cabinet";

import store from "./Store/Store";
import UserLogin from "./Store/ActionsCreators/UserLogin";
import userSelect from "./Store/ActionsCreators/UserSelect";
import Chat from "./Pages/User/Chat";
import Select from "./Pages/Select";

function App() {
  
  if (!localStorage.getItem('card'))
    localStorage.setItem('card', 0);

  fetch('/auth').then((res) => res.json()).then((data) => {
    let user = {id: data.id, name: data.name, avatar: data.avatar}
    store.dispatch(UserLogin(user));
    store.dispatch(userSelect(data.select))
  });

  return (
    <div className="app">
      <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/auth/login" element={<Login />} />
            <Route exact path="/auth/forget" element={<Forget />} />
            <Route exact path="/auth/registration" element={<Registration />} />
            <Route exact path="/search" element={<Search />}></Route>
            <Route exact path="/select" element={<Select />}></Route>
            <Route exact path="/search/:params" element={<Search />}></Route>
            <Route exact path="/advertisement/:slug" element={<Advertisement />}></Route>
            <Route exact path="/add-new-advertisement" element={<NewAdvertisement />}></Route>
            <Route exact path="/edit-advertisement/:slug" element={<NewAdvertisement />}></Route>
            <Route exact path="/user/cabinet" element={<Cabinet />}></Route>
            <Route exact path="/user/cabinet/:slug" element={<Cabinet />}></Route>
            <Route exact path="/user/chat" element={<Chat />}></Route>
            <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;