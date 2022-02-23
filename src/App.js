import React, { useEffect, useRef } from "react";
import "./App.css";
import { select, pack, json, hierarchy } from "d3";
import randomColor from "randomcolor";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
    const canvas = select(canvasRef.current);
    json(url)
      .then((resData) => {
        const mapData = hierarchy(resData, (node) => node["children"])
          .sum((node) => node["value"])
          .sort((node1, node2) => node2["value"] - node1["value"]);

        const tree = pack().size([1800, 1200]).padding(5)(mapData);

        const entireValue = tree.value;

        const leaf = canvas
          .selectAll("a")
          .data(tree.leaves())
          .join("a")
          .attr("transform", (node) => `translate(${node["x"]},${node["y"]})`)
          .style("display", "center")
          .style("justify-content", "center")
          .style("align-items", "center");
        // 부모노드를 이동시킨다.

        leaf
          .append("circle")
          .attr("r", (node) => (node["value"] / entireValue) * 2000)
          .attr("fill", () => randomColor());

        leaf
          .append("text")
          .text((node) => node["data"]["name"][0])
          .attr("text-anchor", "middle");
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <React.Fragment>
      <h1>BubbleChart</h1>
      <svg ref={canvasRef} />
    </React.Fragment>
  );
}

export default App;

//https://observablehq.com/@d3/bubble-chart
