import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { select, treemap, json, hierarchy } from "d3";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
    const canvas = select(canvasRef.current);
    const tooltip = select(tooltipRef.current);
    json(url)
      .then((resData, error) => {
        if (error) {
          console.log(error);
        } else {
          // 루트노드와 리프노드로 hierarchy(트리)를 만든다.
          let tree = hierarchy(resData, (node) => {
            return node["children"];
            // 데이터로 하기위해 children을 node의 data로 한다.
          })
            .sum((node) => {
              return node["value"];
              // 트리맵의 크기로 할 value
              // 노드마다 하위노드의 value의 누적합을 구한다.
            })
            .sort((node1, node2) => {
              return node2["value"] - node1["value"];
              // 내림차순으로 정렬한다.
            });
          let createTreeMap = treemap().size([1000, 600]);
          createTreeMap(tree);
          // 트리를 트리맵으로 변환하여 리프노드들이 필요한 데이터를 갖게한다.
          //x0 y0는 좌표이다.

          let block = canvas
            .selectAll("g")
            .data(tree.leaves())
            .enter()
            .append("g")
            .attr("transform", (movie) => {
              return "translate(" + movie["x0"] + "," + movie["y0"] + ")";
            });
          // enter를 통해 데이터가 실제 html요소와 연결되게 하고 append를 통해 실제 요소를 가지게 한다.
          // 그리고 translate를 이용하여 좌표만큼 이동시킨다.

          block
            .append("rect")
            .classed("tile", true)
            .attr("fill", (movie) => {
              let category = movie["data"]["category"];
              if (category === "Action") {
                return "orange";
              } else if (category === "Drama") {
                return "lightgreen";
              } else if (category === "Adventure") {
                return "crimson";
              } else if (category === "Family") {
                return "steelblue";
              } else if (category === "Animation") {
                return "pink";
              } else if (category === "Comedy") {
                return "khaki";
              } else if (category === "Biography") {
                return "tan";
              }
            })
            .attr("data-name", (movie) => {
              return movie["data"]["name"];
            })
            .attr("data-category", (movie) => {
              return movie["data"]["category"];
            })
            .attr("data-value", (movie) => {
              return movie["data"]["value"];
            })
            .attr("width", (movie) => {
              return movie["x1"] - movie["x0"];
            })
            .attr("height", (movie) => {
              return movie["y1"] - movie["y0"];
            })
            .on("mouseover", (e, movie) => {
              tooltip.transition().style("visibility", "visible");

              let revenue = movie["data"]["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

              tooltip.html("$ " + revenue + "<hr />" + movie["data"]["name"]);

              tooltip.attr("data-value", movie["data"]["value"]);
            })
            .on("mouseout", (movie) => {
              tooltip.transition().style("visibility", "hidden");
            });
          // rect를 통해 하위에 rect를 만들고 class를 추가한다.
          // 그리고 높이와 너비를 가지게 한다.

          block
            .append("text")
            .text((movie) => {
              return movie["data"]["name"];
            })
            .attr("x", 5)
            .attr("y", 20);
        }
      })
      .then(() => {
        setLoading(false);
      });
  }, [loading]);

  return (
    <React.Fragment>
      <h2 id="title">Highest Grossing Movies</h2>
      <div id="container">
        {loading ? (
          <ClipLoader color="black" loading={loading} size={150} />
        ) : (
          <>
            <svg id="canvas" ref={canvasRef} />
            <div id="rightSide">
              <div id="tooltip" ref={tooltipRef} />
              <svg id="legend">
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="0"
                    width="40"
                    height="40"
                    fill="orange"
                  ></rect>
                  <text x="60" y="20" fill="black">
                    Action
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="40"
                    width="40"
                    height="40"
                    fill="lightgreen"
                  ></rect>
                  <text x="60" y="60" fill="black">
                    Drama
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="80"
                    width="40"
                    height="40"
                    fill="crimson"
                  ></rect>
                  <text x="60" y="100" fill="black">
                    Adventure
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="120"
                    width="40"
                    height="40"
                    fill="steelblue"
                  ></rect>
                  <text x="60" y="140" fill="black">
                    Family
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="160"
                    width="40"
                    height="40"
                    fill="pink"
                  ></rect>
                  <text x="60" y="180" fill="black">
                    Animation
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="200"
                    width="40"
                    height="40"
                    fill="khaki"
                  ></rect>
                  <text x="60" y="220" fill="black">
                    Comedy
                  </text>
                </g>
                <g>
                  <rect
                    className="legend-item"
                    x="10"
                    y="240"
                    width="40"
                    height="40"
                    fill="tan"
                  ></rect>
                  <text x="60" y="260" fill="black">
                    Biography
                  </text>
                </g>
              </svg>
              <div id="description">Top 95 Highest Grossing Movies</div>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
