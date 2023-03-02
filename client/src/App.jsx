import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import "./font-awesome.css";
 
import Header from "./Components/Header/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Registration from "./Pages/Auth/Registration";
import Search from "./Pages/Search";
import NotFoundPage from "./Pages/NotFoundPage";
import Advertisement from "./Pages/Advertisement";
import NewAdvertisement from "./Pages/NewAdvertisement";

function App() {
   
 
  return (
    <div className="app">
      <Router>
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/auth/login" element={<Login />} />
            <Route exact path="/auth/registration" element={<Registration />} />
            <Route exact path="/search" element={<Search />}></Route>
            <Route exact path="/advertisement/:slug" element={<Advertisement />}></Route>
            <Route exact path="/add-new-advertisement" element={<NewAdvertisement />}></Route>
            <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;