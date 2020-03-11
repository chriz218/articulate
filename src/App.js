import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage.js';
import CreateRoomPage from './components/CreateRoomPage.js';
import JoinRoomPage from './components/JoinRoomPage.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage />
          </Route>  
          <Route exact path="/create-room" component={CreateRoomPage}>
            <CreateRoomPage />
          </Route>  
          <Route exact path="/join-room" component={JoinRoomPage}>
            <JoinRoomPage />
          </Route>  
        </Switch>  
      </BrowserRouter>
    </div>
  );
}

export default App;
