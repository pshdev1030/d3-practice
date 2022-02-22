import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { selectAll, select, rollup, treemap, json, hierarchy } from "d3";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <svg ref={canvasRef} />
    </React.Fragment>
  );
}

export default App;
