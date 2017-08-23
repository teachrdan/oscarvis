const diameter = 500; //max size of the bubbles

let bubble = d3.pack()
  .size([diameter, diameter])
  .padding(1.5);

let svg = d3.select("body")
  .append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

  // d3.csv("https://raw.githubusercontent.com/teachrdan/oscarvis/master/data.csv", function(error, data) {
d3.csv("./data.csv", function(error, data) {
  if (error) {
    console.log("Error accessing CSV:", error);
  } else {
    data = data.map(d => {
      d.value = +d.networth;
      d.age = (Date.now("2017-02-26T00:00:01:000Z") - +new Date(d.dob)) / (1000*60*60*24*365);
      return d;
    });

    const maxWorth = Math.max(...data.map(d => d.value));
    const minWorth = Math.min(...data.map(d => d.value));
    const maxAge = Math.max(...data.map(d => d.age));
    const minAge = Math.min(...data.map(d => d.age));

    const wealthScale = d3.scaleLinear()
      .domain([minWorth, maxWorth])
      .range([20,100]);

    const ageScale = d3.scaleLinear()
      .domain([minAge, maxAge])
      .range([1,0.2]);

    const root = { children: [] };
    root.children = data;

    let nodes = d3.hierarchy(root)
      .sum(d => d.value);

    let node = svg.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(d => !d.children)
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
      .attr("r", (d) => wealthScale(d.data.value))
      .style("fill", (d) => (d.data.gender==='woman') ? "red" : "blue")
      .style("opacity", (d) => ageScale(d.data.age));

    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(d => `${d.data.name}, ${d.data.award}`);

    node.append("title")
      .text(d => `Net Worth: $${d.data.networth}`);
  }
});
