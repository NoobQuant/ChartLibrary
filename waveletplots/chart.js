
// Sources:
	// Book D3 Tips and Tricks by d3noob
	// http://stackoverflow.com/questions/34886070/multiseries-line-chart-with-mouseover-tooltip
	// http://stackoverflow.com/questions/35441624/how-to-remove-tooltips-on-line-when-click-button-d3-js
	// https://ablesense.com/responsive-d3js-charts/

	
// Declare some global variables
var dataNest, allPaths, allLegends, containerCorrector;
var sBarMinWidth = 758
var sBarWidth = 310

// Print docuent width
console.log("Whole document width is " + $( document ).width());
console.log("Body width is " + d3.select('body').style('width'));



// Set the dimensions of the canvas / graph
//var margin = {top: 30, right: 40, bottom: 70, left: 100};
var margin = {top: 30, right: 70, bottom: 70, left: 100};

var widthChart
//var widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right - sBarWidth;

if(parseInt(d3.select('body').style('width'), 10) < sBarMinWidth){
	widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right;						
	
} else {
	widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right - sBarWidth;			
}

//var widthChart = 500 - margin.left - margin.right;
//var widthChart = $( document ).width() - margin.left - margin.right-sBarWidth;


var heightChart = 450 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d.%m.%Y").parse;

// Following returns a value in the data array that corresponds to  
// the horizontal position of the mouse pointer
bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Set the ranges
var x = d3.time.scale().range([0, widthChart]);
//var x = d3.time.scale();
var y = d3.scale.linear().range([heightChart, 0]);

// Define x axis
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

// Define y axis
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line object
var valueline = d3.svg.line();
 
// Adds the svg canvas
var svg = d3.select("#chart") // select chart that is defined in dashboard html file
    .append("svg")
        .attr("width", widthChart + margin.left + margin.right)
        .attr("height", heightChart + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
	
	
// Initialize tooltip stuff
var mouseG = svg.append("g")
				.attr("class", "mouse-over-effects");				
mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");
	
	
// Get the data
d3.csv("waveletplots/modelTwoOutput.csv", function(error, data) {
    data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.value = +d.value;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([d3.min(data, function(d) { return d.value; }), d3.max(data, function(d) { return d.value; })]); 
	
    // Add the X Axis
    var xAxisEl = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightChart + ")")
        //.call(xAxis);

    // Add the Y Axis
    var yAxisEl = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);	
		
		
    // Nest the entries by seriename
    dataNest = d3.nest()
        .key(function(d) {return d.seriename;})
        .entries(data);

	// set the colour scale		
    var color = d3.scale.category20c();  

	// Initialize tooltip stuff	
	var mousePerLine = mouseG.selectAll('.mouse-per-line')
	  .data(dataNest)
	  .enter()
	  .append("g")
	  .attr("class", "mouse-per-line")
	  // Add id to each mouse-per-line
	  .attr("id", function(d){
		return "mouse-per-line-" + d.key;
		});   
	
	// Append tooltip stuff
	mousePerLine.append("circle")
	  .attr("r", 7)
	  .style("stroke", function(d) {
		return color(d.name);
	  })
	  .style("fill", "none")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");		  
	  
	mousePerLine.append("text")
	  .attr("transform", "translate(10,3)");		
   
	// spacing for legend 	
    legendSpace = heightChart/dataNest.length;
	
	// Specify properties for the line
	valueline.x(function(d) { return x(d.date); });
	valueline.y(function(d) { return y(d.value); });	
	
	// Loop through each series / key in  data
    allPaths = [];
	allLegends = [];
	dataNest.forEach(function(d,i) {
		
		let currentNum = i+1;
		
		// Add lines
		allPaths[i] = svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add colors dynamically
                return d.color = color(d.key); })
				.style("stroke-width",2)
			.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID to path
			
		// Add the Legend
		allLegends[i] = svg.append("text")
			
			.attr("x", -margin.left)
			
			// Assign ID to each legend name	
			.attr("id", 'legendserie'+currentNum) // assigns "legendserie" + i				
			.attr("y", (margin.top+10) + legendSpace*(i-1)) 			
			
			// dynamic colours
			.style("fill", function() {  
				return d.color = color(d.key); }) 
				
			// On-click property to toggle line visibility on-off	
			.on("click", function(){ 
				// Determine if current line is visible
				var active = d.active ? false : true, 
				newOpacity = active ? 0 : 1;
				// Hide or show the elements based on the line path ID
				d3.select("#tag"+d.key.replace(/\s+/g, '')) // start with tag to avoid numbers, strip spaces
				.transition().duration(100)
				.style("opacity", newOpacity); 
				d.active = active;
				d3.select("#mouse-per-line-" + d.key) // This records tooltip opacity!!
				  .style("opacity", newOpacity);
			})
			
			// Mouseover
			.on("mouseover", function (d) {
				console.log("Mouseover")
			    d3.select(this).style("cursor", "pointer");
			    //add also text highlihgting!
										
			})
			// Mouseout
			.on("mouseout", function (d) {
			   d3.select(this).style("cursor", "default");
			})
			
    });
	
	// Draw lines once intially 
	drawChart();
	
	function drawChart() {
		// reset the width
		
		if(parseInt(d3.select('body').style('width'), 10) < sBarMinWidth){
			widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right;						
			
		} else {
			widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right - sBarWidth;			
		}
		
		console.log("Whole document width is " + $( document ).width());
		console.log("Body width is " + d3.select('body').style('width'));
		console.log("WidthChart is " + widthChart);
		
		// set the svg dimensions
		svg.attr("width", widthChart + margin.left + margin.right);	
		
		// Set new range for xScale
		x.range([0, widthChart]);
		
		// give the x axis the resized scale
		xAxis.scale(x);
		
		// draw the new xAxis
		xAxisEl.call(xAxis);
		
		// Specify properties for the line (HAS DUPLICATE ABOVE)
		valueline.x(function(d) { return x(d.date); });
		valueline.y(function(d) { return y(d.value); });
		
		// Plot line paths and and legend texts
		dataNest.forEach(function(d,i) {
			allPaths[i].attr("d", valueline(d.values)); // this actually plots the line!	
			allLegends[i].text(d.key); // This actually adds the legend titles	
			
		// Render Tooltip stuff. Should go into drawChart
		mouseOverStuff();			
			
		});
	}	
	
	// redraw chart on resize
	window.addEventListener('resize', drawChart);	



});	


function mouseOverStuff() {

	var lines = document.getElementsByClassName('line');
	mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
	  .attr('width', widthChart) // can't catch mouse events on a g element
	  .attr('height', heightChart)
	  .attr('fill', 'none')
	  .attr('pointer-events', 'all')
	  .on('mouseout', function() { // on mouse out hide line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "0");
		d3.selectAll(".mouse-per-line circle")
		  .style("opacity", "0");
		d3.selectAll(".mouse-per-line text")
		  .style("opacity", "0");
	  })
	  .on('mouseover', function() { // on mouse in show line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "1"); // show black line or not
		d3.selectAll(".mouse-per-line circle")
		  .style("opacity", "1");
		d3.selectAll(".mouse-per-line text")
		  .style("opacity", "1");
	  })
	  .on('mousemove', function() { // mouse moving over canvas
		var mouse = d3.mouse(this);
		d3.select(".mouse-line")
		  .attr("d", function() {
			tempMouse = mouse[0];  
			var d = "M" + tempMouse + "," + height;
			d += " " + tempMouse + "," + 0;
			//console.log(tempMouse)			
			return d;
		  });	  
		  
		d3.selectAll(".mouse-per-line")
		  .attr("transform", function(d, i) {
				var xDate = x.invert(mouse[0]),
					bisect = d3.bisector(function(d) { return d.date; }).right;
					idx = bisect(d.values, xDate);
				
				var beginning = 0,
					
					end = lines[i].getTotalLength();
					target = null;

				while (true){
				  target = Math.floor((beginning + end) / 2);
				  pos = lines[i].getPointAtLength(target);
				  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
					  break;
				  }
				  if (pos.x > mouse[0])      end = target;
				  else if (pos.x < mouse[0]) beginning = target;
				  else break; //position found
				}
				
				d3.select(this).select('text')
				  .text(y.invert(pos.y).toFixed(2));
				return "translate(" + mouse[0] + "," + pos.y +")";
		  });
	  });		  
 }

function clickAll() {
	// there appears to be a discrepancy with the way jQuery and d3 
	// handle events that causes a jQuery induced click event 
	// $("#some-d3-element").click() to not dispatch to the d3 element.
	// As a woraround this function, found from
	// http://stackoverflow.com/questions/9063383/how-to-invoke-click-event-programmatically-in-d3	
	var lines = document.getElementsByClassName('line');
	jQuery.fn.d3Click = function () {
	  this.each(function (i, e) {
		var evt = new MouseEvent("click");
		e.dispatchEvent(evt);
	  });
	};	
	
	for (var i = 0; i < lines.length; i++){
		let num = i+1;
		let currentstr = num.toString();
		$("#legendserie" + currentstr).d3Click();
	}
  }
  
 function clickNth(seriesNo) {
	
	var lines = document.getElementsByClassName('line');
	jQuery.fn.d3Click = function () {
	  this.each(function (i, e) {
		var evt = new MouseEvent("click");
		e.dispatchEvent(evt);
	  });
	};	
	
	for (var i = 0; i < lines.length; i++){
		let num = i+1;
		let currentstr = num.toString();
	if (i == (seriesNo-1)){
			$("#legendserie" + currentstr).d3Click();
	}
	}
  } 
  
 function showAll() {
	var lines = document.getElementsByClassName('line');
	jQuery.fn.d3Click = function () {
	  this.each(function (i, e) {
		var evt = new MouseEvent("click");
		e.dispatchEvent(evt);
	  });
	};	
	for (var i = 0; i < lines.length; i++){
		let num = i+1;
		let currentstr = num.toString();		
		let currentOpacity = lines[i].style.opacity;
		if(currentOpacity === "0"){
			$("#legendserie" + currentstr).d3Click();
		}
	}
  } 

  function hideAll() {
	var lines = document.getElementsByClassName('line');
	jQuery.fn.d3Click = function () {
	  this.each(function (i, e) {
		var evt = new MouseEvent("click");
		e.dispatchEvent(evt);
	  });
	};		
	for (var i = 0; i < lines.length; i++){
		let num = i+1;
		let currentstr = num.toString();		
		let currentOpacity = lines[i].style.opacity;
		// If series hasn't been physically clicked yet, it will have 
		// currentOpacity = ""
		if(currentOpacity === "1" || currentOpacity === "" ){
			$("#legendserie" + currentstr).d3Click();
		}
	}
  }  

	