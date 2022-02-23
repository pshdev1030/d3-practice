import React, { useEffect, useRef } from "react";
import "./App.css";
import { select, pack, hierarchy } from "d3";
import randomColor from "randomcolor";

const data = [
  { name: "United States", value: 395995000, color: "#3d02f1" },
  { name: "United Kingdom", value: 253700405, color: "#8415e0" },
  { name: "China (People's Republic of)", value: 170556500, color: "#c82424" },
  { name: "Brazil", value: 58680000, color: "#e0dd15" },
  { name: "India", value: 44464000 },
  { name: "Australia", value: 41980971 },
  { name: "Russia (Federation)", value: 37440000 },
  { name: "France", value: 34139488, color: "#15e0c0" },
  { name: "Canada", value: 33721141 },
  { name: "Italy", value: 28951133 },
  { name: "Mexico", value: 26738610 },
  { name: "Germany", value: 14961849 },
  { name: "Turkey", value: 11986640 },
  { name: "Japan", value: 11387585 },
  { name: "Korea", value: 10826600 },
  { name: "Argentina", value: 6786985 },
  { name: "Saudi Arabia", value: 5445267 },
  { name: "Indonesia", value: 2658090 },
  { name: "South Africa", value: 2270422 },
];

function App() {
  const canvasRef = useRef(null);
  const desRef = useRef(null);

  useEffect(() => {
    const canvas = select(canvasRef.current);
    const mapData = hierarchy(data, (node) => node)
      .sum((node) => node["value"])
      .sort((node1, node2) => node2["value"] - node1["value"]);

    const createPack = pack().size([1000, 600]).padding(5);

    const tree = createPack(mapData);

    const treeElement = canvas
      .selectAll("a")
      .data(tree.leaves())
      .join("a")
      .attr("transform", (node) => `translate(${node["x"]},${node["y"]})`);
    // circle
    treeElement
      .append("circle")
      .attr("r", (node) => node["r"])
      .attr("fill", (node) => (node["color"] ? node["color"] : randomColor()))
      .on("mouseover", (e, node) => {
        e.stopPropagation();
        console.log(e, node);
      });
    // circleText
    treeElement
      .append("text")
      .text((node) =>
        node["r"] > 20 ? node["data"]["name"] : node["data"]["name"][0]
      )
      .attr("text-anchor", "middle")
      .attr("font-size", "10px");
  }, []);

  return (
    <React.Fragment>
      <h1>BubbleChart2</h1>
      <svg ref={canvasRef} />
      <span ref={desRef}>hi</span>
    </React.Fragment>
  );
}

export default App;

//https://observablehq.com/@d3/bubble-chart
