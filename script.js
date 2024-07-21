// script.js

// Set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const data = [
  {
    "Timeline": "Jul 18 2024 14:19:38",
    "x": 0,
    "y": 0,
    "type": "resource",
    "Title for resource": "Introduction to Mathematical Logic"
  },
  {
    "Timeline": "Jul 18 2024 14:19:39",
    "x": 1,
    "y": 2,
    "type": "quiz",
    "Title for resource": "quiz - 1"
  },
  {
    "Timeline": "Jul 18 2024 14:19:40",
    "x": 4,
    "y": 5,
    "type": "summary",
    "Title for resource": ""
  },
  {
    "Timeline": "Jul 18 2024 14:19:41",
    "x": 2,
    "y": 6,
    "type": "quiz",
    "Title for resource": "quiz - 2"
  },
  {
    "Timeline": "Jul 18 2024 14:19:42",
    "x": 4,
    "y": 7,
    "type": "quiz",
    "Title for resource": "quiz - 3"
  },
  {
    "Timeline": "Jul 18 2024 14:19:43",
    "x": 3,
    "y": 9,
    "type": "summary",
    "Title for resource": ""
  },
  {
    "Timeline": "Jul 18 2024 14:19:44",
    "x": 3,
    "y": 9,
    "type": "resource",
    "Title for resource": "Resolution"
  },
  {
    "Timeline": "Jul 18 2024 14:19:45",
    "x": 0,
    "y": 3,
    "type": "quiz",
    "Title for resource": "quiz - 4"
  },
  {
    "Timeline": "Jul 18 2024 14:19:46",
    "x": 0,
    "y": 3,
    "type": "resource",
    "Title for resource": "Tutorial 1: Part II"
  },
  {
    "Timeline": "Jul 18 2024 14:19:47",
    "x": 0,
    "y": 3,
    "type": "resource",
    "Title for resource": "Predicate Logic"
  }
];


function decideMaxValOnAxis_x(data) { // to decide max value on x axis
    let m = 0;
    data.forEach(d => {
        m = Math.max(m, d.x);
    });
    return m + 3;
}
function decideMaxValOnAxis_y(data) { // to decide max value on y
    let m = 0;
    data.forEach(d => {
        m = Math.max(m, d.y);
    });
    return m + 3;
}

function clearPlot() {
    // Select all plot elements (e.g., circles) and remove them
    svg.selectAll("circle").remove(); 
}



// Add X axis
const x = d3.scaleLinear()
    .domain([0, decideMaxValOnAxis_x(data)])
    .range([0, width]);
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
    .domain([0, decideMaxValOnAxis_y(data)])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// Add dots
svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 5)
    .attr("class", "dot");

