const width = 800;
const height = 800;

const svg = d3.select(".map-svg");
const loader = document.querySelector(".loader");

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

async function geojsonData() {
  try {
    const response = await fetch("../../India/India.json");
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error loading geojson:", err);
    return null;
  }
}

function drawMap(geoData) {
  console.log(geoData);
  if (!geoData) return;

  svg.selectAll("*").remove();

  const projection = d3.geoMercator().fitSize([width, height], geoData);
  const pathGenerator = d3.geoPath().projection(projection);

  svg
    .selectAll(".state")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", pathGenerator)
    .attr("fill", "#424242")
    .on("mouseover", function (event, d) {
      const stateName =
        d.properties.ST_NM ||
        d.properties.NAME_1 ||
        d.properties.name ||
        "Unknown State";

      tooltip
        .style("opacity", 1)
        .html(`📍 <strong>${stateName}</strong>`)
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 25 + "px");

      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
      d3.select(this).attr("stroke", "#2c3e50").attr("stroke-width", 1.2);
    });

  loader.style.display = "none";
}

const data = await geojsonData();
drawMap(data);
