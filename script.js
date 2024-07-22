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

class DataSet {
    constructor(data, enumerator) {
        this.enum = enumerator;
        if (enumerator != "Timeline") {
            this.data = data.sort((a, b) => a[enumerator] - b[enumerator]);
        } else {
            this.data = data.sort((a, b) => {
                return new Date(a.Timeline) - new Date(b.Timeline);
            });
        }
    }

    transitionVectors() { // n pts means n-1 transition vectors
        let lines = [];
        for (let i = 0; i < this.data.length - 1; i++) {
            const len = this.dist(this.data[i], this.data[i + 1]);
            const line = {
                len: len,
                unit_vector: [
                    (this.data[i + 1]["x"] - this.data[i]["x"]) / len,
                    (this.data[i + 1]["y"] - this.data[i]["y"]) / len
                ]
            };
            lines.push(line);
        }
        return lines;
    }

    dist(a, b) {
        let x_diff = a["x"] - b["x"];
        let y_diff = a["y"] - b["y"];
        return Math.sqrt(x_diff * x_diff + y_diff * y_diff);
    }
}


// dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

function reset(){
    svg.selectAll(".arrow").remove();
    svg.selectAll(".line-path").remove();
}
function clearPlot(){
    reset();
    svg.selectAll(".dot").remove();
}



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

// What do these scales mean? 
// Suppose I want to plot a point p. I give its coodrinate wrt to plot, not screen.
// These functions do the work of converting my coordinates to useful on screen coordinates.
const xScale = d3.scaleLinear()
    .domain([0, decideMaxValOnAxis_x(data)])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, decideMaxValOnAxis_y(data)])
    .range([height, 0]);

// Tooltip container for point info dispaly
const tooltip = svg.append("text")
    .attr("class", "tooltip")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "-1.2em")
    .style("visibility", "hidden");

// Add X axis
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

// Add Y axis
svg.append("g")
    .call(d3.axisLeft(yScale));

// Add points
svg.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5)
    .attr("class", "dot")
    .on("mouseover", function(event, d) {
        tooltip.text(`x: ${d.x}, y: ${d.y}, Timestamp: ${d.Timeline}`)
            .style("visibility", "visible");
    })
    .on("mousemove", function(event) {
        const [mouseX, mouseY] = d3.pointer(event);
        tooltip.attr("x", mouseX + 10).attr("y", mouseY - 10);
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });

function autoPlay() {
    // arrow marker definition
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 10)
        .attr("refY", 5)
        .attr("markerWidth", 4.5)
        .attr("markerHeight", 4.5)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "green");

    // line generator
    const line = d3.line()
        .x(dataPoint => xScale(dataPoint.x))
        .y(dataPoint => yScale(dataPoint.y));

    // Removing existing path if any
    svg.selectAll(".line-path").remove();
    svg.selectAll(".arrow").remove();

    // Add the path to the svg
    const path = svg.append("path")
        .datum(data)
        .attr("class", "line-path") // Add a class for easier selection
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 4)
        .attr("d", line);

    // total length of the path
    const pathLength = path.node().getTotalLength();

    // Animating the path
    path.attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(3000)
        .attr("stroke-dashoffset", 0);

    // Calculate midpoints and add arrows
    //const unit_v = DataSet(data, 'Timeline').transitionVectors();
    for (let i = 0; i < data.length - 1; i++) {
        let x1 = xScale(data[i].x);
        let y1 = yScale(data[i].y);
        let x2 = xScale(data[i + 1].x);
        let y2 = yScale(data[i + 1].y);

        let midX = (x1 + x2) / 2;
        let midY = (y1 + y2) / 2;

        // terminating arrow at the midpoint. Also show arrow only if transition.
        if( x1 != x2 || y1 != y2)
        svg.append("line")
            .attr("class", "arrow")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", midX)
            .attr("y2", midY)
            .attr("stroke", "green")
            .attr("stroke-width", 4)
            .attr("marker-end", "url(#arrow)")
            .style("opacity", 0)
            .transition()
            .delay(2500)
            .style("opacity", 1);
    }
}