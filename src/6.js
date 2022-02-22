import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      // 범위를 똑같이 나눈다
      .domain(data.map((value, idx) => idx))
      .range([0, 300])
      .padding(0.5)
      .clamp(true);
    // (0,0)~(6,200)
    const yScale = scaleLinear().domain([0, 150]).range([150, 0]).clamp(true);

    const colorScale = scaleLinear()
      .domain([75, 115, 150])
      .range(["green", "orange", "red"])
      .clamp(true);
    const xAxis = axisBottom(xScale).ticks(data.length);
    // axais를 고정한다
    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
    // 한 번만 호출 그룹 엘리먼트에 css를 적용했다.
    const yAxis = axisRight(yScale);
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, value) => {
        const index = svg.selectAll(".bar").nodes().indexOf(event.target);
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => 150 - yScale(value));
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter((value) => value < 35))}>
        Filter data
      </button>
      <button onClick={() => setData([...data, Math.random() * 150])}>
        Add data
      </button>
    </React.Fragment>
  );
}

export default App;
