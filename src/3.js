import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  axisRight,
  scaleLinear,
} from "d3";

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]);
    // (0,0)~(6,200)
    const yScale = scaleLinear().domain([0, 150]).range([150, 0]);
    // 0은 맨 위이다
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);
    // axais를 고정한다
    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
    // 한 번만 호출 그룹 엘리먼트에 css를 적용했다.
    const yAxis = axisRight(yScale);
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);
    // xAxis(svg.select(".x-axis"));

    const myLine = line()
      .x((value, index) => xScale(index))
      .y((value) => yScale(value))
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data]) //선 하나를 관리하기위해서 data를 감싼다
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
    // path엘리먼트는 그리면 x axis와 같은 그룹으로 동기화된다.
    // 때문에 새로운 엘리먼트를 추가한다.
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        {/* group */}
        {/* <path d="M0,150 100,100 150,120" stroke="blue" fill="none" /> */}
      </svg>
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
