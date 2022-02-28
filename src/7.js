import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function App() {
  const [data, setData] = useState(
    Array.from({ length: 50 }, () => Math.round(Math.random() * 100))
  );

  useEffect(() => {}, [data]);
  return (
    <div style={{ padding: "300px" }}>
      <h2> Zoomable Line Chart with D3 </h2>
      <ZoomableLineChart data={data} />
      <button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </button>
    </div>
  );
}

export default App;

const ZoomableLineChart = ({ data, id = "myZoomableLineChart" }) => {
  // zoom function을 통해서 zoom을 정의할 수 있음
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [currentZoomState, setCurrentZoomState] = useState();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgContent = svg.select(".content");

    const { width, height } = wrapperRef.current.getBoundingClientRect();

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([10, width - 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      console.log(xScale.domain());
      console.log(newXScale.domain());
      xScale.domain(newXScale.domain());
    }

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - 10, 10]);

    const lineGenerator = d3
      .line()
      .x((d, index) => xScale(index))
      .y((d) => yScale(d))
      .curve(d3.curveCardinal);

    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale);

    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // zoom

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [-100, 0],
        [width + 100, height],
      ])
      .on("zoom", () => {
        const zoomState = d3.zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
        // d3는 현재 svg의 zoom State를 자체적으로 저장한다.
        // d3는 DOM을 직접 조작하기 때문에, 이 scale에 따라 리렌더링 되도록 state를 이용하여 관리한다.
        //  k 배율
        //  x, y svg offset
      });
    // zoom Scale 최소 최대값
    // .scaleExtent([0.5, 5]) 확대 축소되는 비율 설정
    // translateExent 드래그하여 이동할 수 있는 범위 설정
    // g한계를 안 정해주면 무한임 최소 0 0 으로라도 줘야함

    svg.call(zoomBehavior);
    // zoomBehavior(svg);
  }, [data, currentZoomState]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
};
