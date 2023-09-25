import React from "react";
import Editor from "./Editor";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Editor />
      </div>
    </BrowserRouter>
  );
};

export default App;
