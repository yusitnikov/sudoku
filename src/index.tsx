import React from "react";
import ReactDOM from "react-dom";
import {App} from "./components/app/App";
import NorthOrSouth from "./data/puzzles/NorthOrSouth";

ReactDOM.render(
    <App puzzle={NorthOrSouth}/>,
    document.getElementById("root")
);
