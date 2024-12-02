// src/front/js/index.js
import React from "react";
import ReactDOM from "react-dom";
import injectContext from "./store/appContext.js"; // Asegúrate de importar injectContext
import App from "./App.jsx";

// Envolver App con injectContext
const ContextualizedApp = injectContext(App);

ReactDOM.render(<ContextualizedApp />, document.querySelector("#app"));
