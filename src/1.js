import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { select } from "d3";

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20]);
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      // (enter) => enter.append("circle").attr("class", "new"),
      // (update) => update.attr("class", "updated")
      // (exit) => exit.remove()
      // 이건 default임
      .attr("r", (value) => value)
      .attr("cx", (value) => value * 2)
      .attr("cy", (value) => value * 2)
      .attr("stroke", "red");
  }, [data]);
  // join enter update exit을 한번에, 데이터의 변화에 따른 작업을 설정해줄 수 있음
  // enter data와 dom을 동기화해줌
  // update 변경될 경우
  // exit svg에서 제거될경우
  // https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Paths

  return (
    <React.Fragment>
      <svg ref={svgRef}></svg>
      <br />
      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter((value) => value < 35))}>
        Filter data
      </button>
    </React.Fragment>
  );
}

export default App;
