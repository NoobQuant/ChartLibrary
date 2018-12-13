function AlertStart(){
    alert("Starting animation");

};

function AlertEnd(){
    alert("Animations completed!");

};

function SimpleCanvas(canvasWidth, canvasHeight, box = false, bgcolor = "#080019"){
	/*
	    #09203f dark blue
	    #242424 dark grey
	    #272822 monokai	
	    #000000 black
	    #FFFFFF white
	*/
    var svg = d3.select("body")
		.append("svg")
		//.attr('x', 50)
		//.attr('y', 50)		
	    .attr("width", canvasWidth)
	    .attr("height", canvasHeight);  

	svg.append("rect")
	    .style("fill", bgcolor) // monokai		        
	    .style("fill-opacity", 1.0)
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);

    if (box == true){svg.style("stroke", "black")};

	return svg;
};




class Image{

	constructor(params){


		this.pos          = params.pos;
		this.correctors   = params.correctors;		
		this.path         = params.path;
		this.id           = params.id;
		this.relsize      = params.relsize;	        
		

		var g = svg.append('g')
				   .attr('id', this.id)		
				   .style('opacity', 0.0);


		var imgs = g.selectAll("image").data([0]);
		
		imgs.enter()
			.append("svg:image")
			//.attr("xlink:href", this.path)
			.attr("href", this.path)            
			.attr("x", this.pos[0])
			.attr("y", this.pos[1])
			.attr("width", +this.relsize[0]+"%")
			.attr("height", +this.relsize[1]+"%");

			this.g = g;



	
	};

	Draw(delay, duration){

		this.g.transition()
			.delay(delay)
			.duration(duration)  
			.style('opacity', 1.0)
			.attr("transform", "  scale(" + 3 +")")	
			.attr("transform", " translate(" + (0 - this.correctors[0]) +","+ (0 - this.correctors[1]) +") scale(" + 4 + ")")		  		  		      
			.ease(d3.easeLinear);
		



	};

	Hide(delay, duration){

		this.g
		    .transition()
		    .delay(delay)
		    .duration(duration)        
		    .style("opacity", 0.0);		


	};



};
















class Arrow{

	constructor(params){


		this.startPoint   = params.startPoint;
		this.endPoint     = params.endPoint;
        this.id           = params.id;
        this.color        = params.color || d3.schemeCategory10[0];
        this.strokeWidth  = params.strokeWidth || 1;

        //this.scales          = params.scales || [1]		


		function lineData(d){
		    var points = [
		        {lx: d.source.x, ly: d.source.y},
		        {lx: d.target.x, ly: d.target.y}
		    ];
		    return line(points);
		}

		var line = d3.line()
		                 .x( function(point) { return point.lx; })
		                 .y( function(point) { return point.ly; });

		var path = svg.append("path")
		                .data([{source: {x : this.startPoint[0], y : this.startPoint[1]}
		                	  ,target: {x : this.endPoint[0], y : this.endPoint[1]}}])
		                .attr("class", "line")
		                .style('stroke', this.color)
		                .style('stroke-width', this.strokeWidth)
		                .attr("d", lineData);


		var arrow = svg.append("svg:path")
		               .attr("d", d3.symbol().type(d3.symbolTriangle))
		               .style('stroke', this.color)
		               .style('fill', this.color);


		var totalLength = path.node().getTotalLength();

		this.path = path;
		this.arrow = arrow;
		this.totalLength = totalLength; 
	};

	Draw(delay, duration){


		function translateAlong(path){
		    var l = path.getTotalLength();
		    var ps = path.getPointAtLength(0);
		    var pe = path.getPointAtLength(l);
		    var angl = Math.atan2(pe.y - ps.y, pe.x - ps.x) * (180 / Math.PI) - 270;
		    var rot_tran = "rotate(" + angl + ")";

			return function(d, i, a) {
			    return function(t) {
			      var p = path.getPointAtLength(t * l);
				  return "translate(" + p.x + "," + p.y + ") " + rot_tran;
			    };
			};
		};


		this.path.attr("stroke-dasharray", this.totalLength + " " + this.totalLength)
		    .attr("stroke-dashoffset", this.totalLength)
		    .transition()
		    .delay(delay)
		    .duration(duration)        
		    .ease(d3.easeLinear)
		    .attr("stroke-dashoffset", 0);


		this.arrow.transition()
				  .delay(delay)
				  .duration(duration)
				  .ease(d3.easeLinear)
				  .attrTween("transform", translateAlong(this.path.node()));

	};

	Hide(delay, duration){

		this.path
		    .transition()
		    .delay(delay)
		    .duration(duration)        
		    .style("opacity", 0.0);

		this.arrow
			.transition()
		    .delay(delay)
		    .duration(duration)
			.style("opacity", 0.0)

	};



};



class Circle{

	constructor(params){


		this.pos         = params.pos;
		this.entpoint    = params.entpoint;		
        this.id          = params.id;
        this.r           = params.r || 10;
        this.color       = params.color || d3.schemeCategory10[0];
		this.strokeColor = params.strokeColor || 'white'; 
		this.strokeWidth = params.strokeWidth || 1;
		this.moveInEase  = params.moveInEase || d3.easeBack;

		var circle = svg.append("circle")
							.attr("id", this.id)
		                    .attr("cx", 0)
							.attr("cy", 0)							
		                    .attr("r", this.r)
		                    .style("fill", this.color)
							.style("stroke", this.strokeColor)
		                    .style("stroke-width", params.strokeWidth)							
		                    .style("opacity", 0.0);




	};

	Draw(delay, duration, type = 'default'){

			

		if (type == 'default'){

			d3.select('#'+ this.id)
				.attr("transform", "translate(" + this.pos[0][0] + "," + this.pos[0][1]  + ")")
				.transition()
				.duration(duration)
				.delay(delay)
				.style("opacity",1);

		} else if (type == 'movein'){

			d3.select("#"+this.id)
				.attr("transform", "translate(" + this.entpoint[0] + "," + this.entpoint[1]  + ")")				    
				.transition()
				.delay(delay)
				.duration(duration)
				.style("opacity",1.0)					
				.attr("transform", "translate(" + this.pos[0][0] + "," + this.pos[0][1]  + ")")
				.ease(this.moveInEase);			


		};



	};


	Hide(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0.0);

	};

	Move(stepno, delay, duration, ease = d3.easePoly){

		d3.select("#"+this.id)
	      .transition()
	      .delay(delay)
	      .duration(duration)
		  .attr("transform", "translate(" + (this.pos[stepno][0] ) + "," + (this.pos[stepno][1] ) + ")")
		  .ease(ease);						  		      			
		

	};

	ChangeColor(color, delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("fill", color);

	};	



	Scale(r, delay, duration){

		d3.select("#"+this.id)
	      .transition()
	      .delay(delay)
	      .duration(duration)
		  .attr("r", r);
		

	};	

};









class Rectangle{

	constructor(params){


		this.pos         = params.pos;
		this.dim         = params.dim;
		this.entpoint    = params.entpoint || params.pos;		
        this.id          = params.id;
        //this.r           = params.r || 10;
        this.color       = params.color || d3.schemeCategory10[0];
		this.strokeColor = params.strokeColor || 'white'; 
		this.strokeWidth = params.strokeWidth || 1;

		var rectangle = svg.append("rect")
						   .attr("id", this.id)		
						   .attr("x", 0)
						   .attr("y", 0)
						   .attr("width", this.dim[0])
						   .attr("height", this.dim[1])
						   .style("fill", this.color)
						   .style("stroke", this.strokeColor)
						   .style("stroke-width", params.strokeWidth)							
						   .style("opacity", 0.0);						   							



	};

	Draw(delay, duration, type = 'default'){

			

		if (type == 'default'){

			d3.select('#'+ this.id)
				.attr("transform", "translate(" + this.pos[0][0] + "," + this.pos[0][1]  + ")")
				.transition()
				.duration(duration)
				.delay(delay)
				.style("opacity",1);

		} else if (type == 'movein'){

			d3.select("#"+this.id)
				.attr("transform", "translate(" + this.entpoint[0] + "," + this.entpoint[1]  + ")")				    
				.transition()
				.delay(delay)
				.duration(duration)
				.style("opacity",1.0)					
				.attr("transform", "translate(" + this.pos[0][0] + "," + this.pos[0][1]  + ")")
				.ease(d3.easeBack);			


		};

	};


	Hide(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0.0);

	};

	Move(stepno, delay, duration){

		d3.select("#"+this.id)
	      .transition()
	      .delay(delay)
	      .duration(duration)
	     .attr("transform", "translate(" + (this.pos[stepno][0] ) + "," + (this.pos[stepno][1] ) + ")");						  		      			
		

	};

	ChangeColor(color, delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("fill", color);

	};	


};










class MathSymbol{

	constructor(labels, relsize = 100){
		this.labels = labels;

		this.labels.forEach(function(d){
		    svg.append("g")
			        .attr("id",d.id)
					.attr("class", "mathjax")
					//.style("font-family","Helvetica")					
				    .style("font-size", relsize + "%")
					.style("color", d.color || "#D7E4DB")
					/*
					.style("color",
						function(){         
						   return d.color;
					  } || "#D7E4DB"
					  )
					*/					
					//.style("stroke-width","5px")
				    //.style("stroke", d.strokeColor || "red")							        	
		        	.style("opacity",0.0)
		        	.append("text")  	
		        	.text(
			          	function(){         
			             	return d.label;
			            }      
		        	);    	
	    });

	};


	Draw(delay = 0, duration = 100, type = 'default'){
  
		if (type == 'default'){
			this.labels.forEach(function(d){
					d3.select("#"+d.id)
		        	    .attr("transform", "translate(" + d.pos[0][0] + "," + d.pos[0][1]  + ")")					
						.transition()
						.duration(duration)
						.delay(delay)
					    .style("opacity",1.0);
			});
		} else if (type == 'movein'){

			this.labels.forEach(function(d){
			    d3.select("#"+d.id)
		        	.attr("transform", "translate(" + d.entpoint[0] + "," + d.entpoint[1]  + ")")				    
				    .transition()
					.delay(delay)
					.duration(duration)
		        	.style("opacity",1.0)					
					.attr("transform", "translate(" + d.pos[0][0] + "," + d.pos[0][1]  + ")")
		        	.ease(d3.easeBack);			
			});
		};


	};	

	Move(stepno, delay, duration, scale = 1){
		this.labels.forEach(function(d){
				d3.select("#"+d.id)
			      .transition()
			      .delay(delay)
			      .duration(duration)
				  //.attr("transform", "translate(" + d.pos[stepno][0] + "," + d.pos[stepno][1]  + ")");
	 	          .attr("transform", "translate(" + d.pos[stepno][0] + "," + d.pos[stepno][1]  + ") scale("+ scale +")");				   			      			
		});
	};

	Hide(delay, duration = 300){

		this.labels.forEach(function(d){
				d3.select("#"+d.id)
			      .transition()
			      .delay(delay)
			      .duration(duration)
			      .style("opacity", "0")			
		});

	};


};

class SimpleGrid{

	constructor(grid, pos, dim){

		this.grid = grid;
		this.pos = pos;
		this.dim = dim;
	};

	Draw(delay = 0, duration = 0){

		var width  = this.dim[0],
		    height = this.dim[1];

		var verticals = d3.gridding()
			  .size([width, height])
			  .offset([this.pos[0],this.pos[1]])
			  .mode('vertical');

		var horizontals = d3.gridding()
			  .size([width, height])
			  .offset([this.pos[0],this.pos[1]])
			  .valueX(2)
			  .mode('horizontal');		  

		var dataVertical = d3.range(this.grid[1]);
		var dataHorizontal = d3.range(this.grid[0]);	

		var verticalData = verticals(dataVertical);
		var horizontalData = horizontals(dataHorizontal);	

		// Add group for gird
		var gridgroup = svg.append('g');

	    var vertGrids = gridgroup.selectAll("vertgrids")
	             .data(verticalData)
	             .enter()
	             .append("rect")
	             .style("fill", "none")
	             .style("stroke", "#F8F8F2")
	             .attr("width", function(d) { return d.width; })
	             .attr("height", function(d) { return d.height; })
	             .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		var horizGrids = gridgroup.selectAll("horizgrids")
			    .data(horizontalData)
				.enter()
				.append("rect")
			    .style("fill", "none")
			    .style("stroke", "#F8F8F2")
			    .attr("width", function(d) { return d.width; })
			    .attr("height", function(d) { return d.height; })
			    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

		gridgroup.style("opacity",0);

		gridgroup.transition()
				 .delay(delay)
				 .duration(duration)
				 .style("opacity", 1.0);		

		this.gridgroup = gridgroup
	};

	Hide(delay, duration = 300){

		this.gridgroup.transition()
					  .duration(duration)
				      .delay(delay)					  
					  .style("opacity", 0.0);		

	};

};


class SimpleBox{

	// time is unnecessary since 31.5.2018
	constructor(point, width, height, time, stroke = 1, color = 'red'){

		this.point = point;
		//this.time = time;
		this.width = width;
		this.height = height;
		this.stroke = stroke;		
		this.color = color;
	};

	Draw(delay = 0, duration = 300){

		var xPoint = this.point[0];
		var yPoint = this.point[1];
		var width = this.width;
		var height = this.height;
		var time = duration;
		
		var lineData0 = [ { "x": xPoint, "y": yPoint},  { "x": xPoint + width,  "y": yPoint},];
		var lineData1 = [ { "x": xPoint + width,   "y": yPoint},  { "x": xPoint + width,  "y": yPoint + height},];
		var lineData2 = [ { "x": xPoint + width,   "y": yPoint + height},  { "x": xPoint,  "y": yPoint + height},];
		var lineData3 = [ { "x": xPoint,   "y": yPoint + height},  { "x": xPoint,  "y": yPoint},];  		 
		var lineData = [lineData0, lineData1, lineData2, lineData3]



		 var lineFunction = d3.line()
	                          .x(function(d) { return d.x; })
	                          .y(function(d) { return d.y; })
	                          .curve(d3.curveBasis);
	
		///* // Not so neat but works...
		var lines = [];
		for (var i = 0; i < lineData.length; i++) {

			lines[i] = svg.append("path")
		                        .attr("d", lineFunction(lineData[i]))                            
	                            .attr("stroke", this.color)
	                            .attr("fill", "none");
		
			var totalLength = lines[i].node().getTotalLength();

		    lines[i]
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
	          .attr("stroke-width", this.stroke)
		      .transition()
	          .duration(time)
	          .delay(delay + time*i)
	          .ease(d3.easeLinear)
	          .attr("stroke-dashoffset", 0);

		};

	    this.lines = lines;

	};	

	Hide(delay, duration = 300){

		for (var i = 0; i < this.lines.length; i++) {

		    var crt = this.lines[i];
		    crt
			   .transition()
			   .duration(duration)
			   .delay(delay)			   
		       .style("opacity", "0");	
		};

	};


};



class SimplePlot{

	constructor(params){

		this.xPoint             = params.pos[0];
		this.yPoint             = params.pos[1];
		this.xRange 		    = params.xrange;
		this.yRange 			= params.yrange;
		this.xDomain 			= params.xdomain;
		this.yDomain 			= params.ydomain;	
		this.id 				= params.id;
	    this.tickSizecc 		= params.tickSizecc || 10;
	    this.tickNo 			= params.tickNo || [5,5];
	    //this.tickLabelSize 		= params.tickLabelSize || 20;
	    this.xlabelRelativeSize = params.xlabelRelativeSize || 100;
		this.xlabel 			= params.xlabel
		this.xlabelColor 		= params.xlabelColor || "#D7E4DB"; 
	    this.ylabelRelativeSize = params.ylabelRelativeSize || 100;
		this.ylabel 			= params.ylabel
		this.ylabelColor 		= params.ylabelColor || "#D7E4DB"; 		
		this.tickColor 		    = params.tickColor || "#D7E4DB"; 
		this.tickStroke 		= params.tickStroke || "none"; 		
		this.ylabelCorrector    = params.ylabelCorrector || [100,0];
		this.xlabelCorrector    = params.xlabelCorrector || [0,70];
		this.xTickLabelSize		= params.tickLabelSize || params.xTickLabelSize || 20;
		this.yTickLabelSize		= params.tickLabelSize || params.yTickLabelSize || 20;		 


	};


	DrawAxes(delay = 0, duration = 500, type = 'normal', axesID = "mygroup"){
		/* 
		CSS for axis colors
		
		.y line{
		stroke: #D7E4DB;
		}

		.y path{
		stroke: #D7E4DB;
		}

		.x line{
		stroke: #D7E4DB;
		}

		.x path{
		stroke: #D7E4DB;
		}

		*/

		// Plot axes
	    var plot = svg.append("g")
				    .attr("id", this.id)
				    .attr("transform", "translate(" + this.xPoint + "," + this.yPoint + ")")
				    .style("opacity", 0.0);


		var yRangeInv = [this.yRange[1], this.yRange[0]]					
		// Set the ranges
		if (type == 'normal'){

			var xScale = d3.scaleLinear().range(this.xRange).domain(this.xDomain);
			var yScale = d3.scaleLinear().range(yRangeInv).domain(this.yDomain);

			var xAxis = d3.axisBottom().scale(xScale);
			var yAxis = d3.axisLeft().scale(yScale);
		} else if (type == 'bar'){

			var xScale = d3.scaleBand().range(this.xRange);
			xScale.domain(this.xDomain);

			var yRangeInv = [this.yRange[1], this.yRange[0]]			
			var yScale = d3.scaleLinear().range(yRangeInv).domain(this.yDomain);			

			plot.append('g').attr('id', axesID); // cannot be removed!

		} else if (type == 'timeseries'){
			
			//var xScale = d3.scaleLinear().range(this.xRange).domain(this.xDomain);
			var xScale = d3.scaleTime().range(this.xRange).domain(this.xDomain);
			var yScale = d3.scaleLinear().range(yRangeInv).domain(this.yDomain);

			var xAxis = d3.axisBottom().scale(xScale);
			var yAxis = d3.axisLeft().scale(yScale);		
		}

		// x-axis
		plot.append("g")
		  .attr("class", "x axis")		  
		  .attr("transform", "translate("+ this.yRange[0] + "," + this.yRange[1] + ")")
		  .call(d3.axisBottom(xScale)
			  	  .tickSize(this.tickSizecc)			  	
				  .ticks(this.tickNo[0]))
				  .selectAll("text")
				  .style("font-size", this.xTickLabelSize)
				  .style("fill",this.tickColor)
				  .style("stroke",this.tickStroke);

		plot.append("g")
		  .style("text-anchor", "middle")
		  .attr("transform",
		        "translate(" + (this.xRange[1]/2 + this.xlabelCorrector[0]) + " ," + (this.yRange[1] + this.xlabelCorrector[1] ) + ")")
    	  .append("g")
    	  	  .attr("class", "mathjax")
			  .style("font-size", this.xlabelRelativeSize + "%") 
			  .style("color", this.xlabelColor)  	  	  
	    	  .append("text")  	
	    	  .text(this.xlabel);

		// y-axis
		plot.append("g")
		  .attr("class", "y axis")		  
		  .call(d3.axisLeft(yScale)
					.tickSize(this.tickSizecc)
					.ticks(this.tickNo[1]))
					.selectAll("text")
					.style("font-size", this.yTickLabelSize)
					.style("fill",this.tickColor)
					.style("stroke",this.tickStroke);							  	

		plot.append("g")
			.style("text-anchor", "middle")
			.attr("transform",
					"translate(" + (this.xRange[0] - this.ylabelCorrector[0]) + " ," + (this.yRange[1] / 2 + this.ylabelCorrector[1]) + ") rotate(-90)")
			.append("g")
				.attr('id', 'yaxistext')
				.attr("class", "mathjax")
				.style("font-size", this.ylabelRelativeSize + "%") 
				.style("color", this.ylabelColor)  	  	  
				.append("text")  	
				.text(this.ylabel);


		plot.transition()
			.duration(duration)
			.delay(delay)
			.style("opacity", 1.0);

		var lineFunction = d3.line()
		.x(function(d) { return xScale(d[0]); })
		.y(function(d) { return yScale(d[1]); });

		this.plot 	   	  = plot;
		this.xScale    	  = xScale;
		this.yScale    	  = yScale;
		this.yRangeInv 	  = yRangeInv;
		this.xAxis 		  = xAxis;
		this.yAxis 		  = yAxis;
		this.yaxistext 	  = yaxistext;
		this.lineFunction = lineFunction;
		this.axesID 	  = axesID;	
	};

	DrawScatter(delay= 0, duration = 500, params){

		// This needs to be modified such that it takes similar input parameter
		// dictionary as MoveScatter

		var data 			  = params.data
		var id   			  = params.id;
		var circleStrokeColor = params.circleStrokeColor || "#D7E4DB"
		var circleStrokeWidth = params.circleStrokeWidth || 1		

		var xScale = this.xScale;
		var yScale = this.yScale;


		var dots = this.plot.append("g")
			.attr("id", id)
			.style("opacity", 0.0);

		dots.selectAll("circle")
	      .data(data)
		  .enter()
		  .append("circle")
		  .attr("r", function(d) {return d.r})		  
		  .style("fill", function(d) {return d.color})		  
		  .style("stroke", circleStrokeColor)
		  .style("stroke-width", circleStrokeWidth)
		  .attr("transform", function(d) {
			return " translate(" + (xScale(d.x)) +","+ (yScale(d.y)) +")"
		  })   		  			      

		dots.transition()
			.delay(delay)
			.duration(duration)
			.style("opacity", 1.0);

		this.circleStrokeColor = circleStrokeColor
		this.circleStrokeWidth = circleStrokeWidth

	};

	DrawLSELines(delay, duration, params){
		/***********************************************
		Draws LSE lines from scatter points to a vertical line

		linedata: [y_0, m]
		***********************************************/
		
		var scatterdata	= params.scatterdata;
		var linedata    = params.linedata;
		var id    		= params.id;
		var strokeWidth = params.strokeWidth || 3;
		var color 		= params.color || "steelblue";					

		/*
		// Function for calculating the points
		function CalculateLSELine(myx, myy){
			
			// Linear regressin line equation is 
			//   y = y_0 + m*x
			// Substituting in observation x-value we get the y coordinate
			// of intersection point 
			
			return[[myx, myy], [myx, linedata[0] + linedata[1] * myx]]
		}
		*/


		var xScale = this.xScale;
		var yScale = this.yScale;
		var plot = this.plot


		var totalLengths = []

		var LSELineGroup = plot.append('g')
							   .attr('id', id)
							   .style("opacity", 1.0)


		scatterdata.forEach(function(d,i){

			function lineData(d){
				var points = [
					{lx: d.source.x, ly: d.source.y},
					{lx: d.target.x, ly: d.target.y}
				];
				return line(points);
			}
			
			var line = d3.line()
			.x( function(point) { return point.lx; })
			.y( function(point) { return point.ly; });

			// Coordinates of line
			var LSELinePoint = CalculateLSELine(d.x, d.y, linedata[0], linedata[1])


			var path = LSELineGroup.append("path")
			.data([{source: {x : xScale(LSELinePoint[0][0]), y : yScale(LSELinePoint[0][1]) }
				  ,target:  {x : xScale(LSELinePoint[1][0]), y : yScale(LSELinePoint[1][1]) }}])
			//.attr("class", "SMElines")
			.attr("id", id + "_" + i)
			.style('stroke', color)
			.style('stroke-width', strokeWidth)
			.attr("d", lineData)
			.style("opacity", 0);			

			totalLengths.push(path.node().getTotalLength());			
				
		});		


		// Draw lines; not as cools as version below
		scatterdata.forEach(function(d,i){

			d3.select("#" + id + "_" + i)
				.transition()
				.delay(delay)
				.duration(duration)
				.style("opacity", 1)				
		});		

		// Draws lines in, has a problem with tweening later however
		/*
		scatterdata.forEach(function(d,i){

			d3.select("#" + id + "_" + i)
				.attr("stroke-dasharray", totalLengths[i] + " " + totalLengths[i])
				.attr("stroke-dashoffset", totalLengths[i])
				.transition()
				.delay(delay)
				.duration(duration)        
				.ease(d3.easeLinear)
				//.attr("stroke-dashoffset", 0);
				//.transition()
				//.delay(delay + duration)
				
				.each('end', function(){
					d3.select(this)
						.attr("stroke-dasharray", "none")
						.attr('stroke-dashoffset', 'none');
     
				});
				
				.on('end', function(){
					d3.select(this)
						.attr("stroke-dasharray", "none")
						.attr('stroke-dashoffset', 0);
     
				});				

		});
		//*/

	};

	///*
	TweenLSELines(delay, duration, params){
	

		var scatterdata	= params.scatterdata;
		var newLinedata = params.newLinedata;
		var oldLinedata = params.oldLinedata;		
		var id    		= params.id;

		var lineFunction = this.lineFunction		
		
		scatterdata.forEach(function(d,i){


			///*

			function lineData(d){
				var points = [
					{lx: d.source.x, ly: d.source.y},
					{lx: d.target.x, ly: d.target.y}
				];
				return line(points);
			}
			
			var line = d3.line()
			.x( function(point) { return point.lx; })
			.y( function(point) { return point.ly; });

			// Coordinates of new line
			var newLSELinePoint = CalculateLSELine(d.x, d.y, newLinedata[0], newLinedata[1])			
			var oldLSELinePoint = CalculateLSELine(d.x, d.y, oldLinedata[0], oldLinedata[1])

			
			/*
			d3.select("#" + id + "_" + i)
				.transition()
				.delay(delay)
				.duration(duration)
				//.attrTween("d", pathTween(lineFunction(line2Data), 4))
				.attrTween("d", pathTween(lineFunction(LSELinePoint), 4))
			*/


			// Needs this imported: https://github.com/pbeshai/d3-interpolate-path
			d3.select("#" + id + "_" + i)
				.attr('d', lineFunction(oldLSELinePoint))
				.transition()
				.delay(delay)
				.duration(duration)
				.attrTween('d', function () { 
				  return d3.interpolatePath(lineFunction(oldLSELinePoint), lineFunction(newLSELinePoint)); 
				});				

		});


	};
	//*/


	HideLSELines(delay, duration = 300, params){

		/*
		params.scatterdata.forEach(function(d,i){
			d3.select("#" + params.id + "_" + i)
				.transition()
				.delay(delay)
				.duration(duration)
				.style("opacity", "0")
				//.style('stroke-width', 0)						
		});
		//*/

		///*
		d3.select("#" + params.id)
			.transition()
			.delay(delay)
			.duration(duration)
			.style("opacity", "0")
		//*/

	};	

	MoveScatterDots(newDataSet, params, delay, duration, ease = d3.easeCubic){

		// x-axis readjustement is missing

		//this.xPoint             = params.pos[0];
		//this.yPoint             = params.pos[1];
		//this.xRange 		    = params.xrange;
		//this.yRange 			= params.yrange;
		this.xDomain 			= params.xdomain || this.xDomain;
		this.yDomain 			= params.ydomain || this.yDomain;	
		//this.id 				= params.id;
	    this.tickSizecc 		= params.tickSizecc || this.tickSizecc;
	    this.tickNo 			= params.tickNo || this.tickNo;
	    this.tickLabelSize 		= params.tickLabelSize || this.tickLabelSize;
	    this.xlabelRelativeSize = params.xlabelRelativeSize || this.xlabelRelativeSize;
		this.xlabel 			= params.xlabel || this.xlabel;
		this.xlabelColor 		= params.xlabelColor || this.xlabelColor; 
	    this.ylabelRelativeSize = params.ylabelRelativeSize || this.ylabelRelativeSize;
		this.ylabel 			= params.ylabel || this.ylabel;
		this.ylabelColor 		= params.ylabelColor || this.ylabelColor; 		
		this.tickColor 		    = params.tickColor || this.tickColor; 
		this.tickStroke 		= params.tickStroke || this.tickStroke; 		
		this.ylabelCorrector    = params.ylabelCorrector || this.ylabelCorrector;
		this.xlabelCorrector    = params.xlabelCorrector || this.xlabelCorrector;
		this.circleStrokeWidth  = params.circleStrokeWidth || this.circleStrokeWidth
		this.circleStrokeColor  = params.circleStrokeColor || this.circleStrokeColor
		this.xTickLabelSize		= params.xtickLabelSize || this.xTickLabelSize
		this.yTickLabelSize		= params.ytickLabelSize || this.yTickLabelSize			
	
		var xScale = this.xScale;
		var yScale = this.yScale;
		var yScale = this.yScale;				

		yScale.domain(this.yDomain);

		this.plot.select(".y")
			.transition()
			.delay(delay)
			.duration(1000)
			.call(this.yAxis
				.tickSize(this.tickSizecc)
				.ticks(this.tickNo[1])
				 )
			.selectAll("text")
			.style("font-size", this.tickLabelSize)
			.style("fill",this.tickColor)
			.style("stroke",this.tickStroke)
			.style("font-size", this.yTickLabelSize)						

		this.plot.selectAll("circle")		
			.data(newDataSet)
			.transition()
			.delay(delay)
			.duration(duration) 
			.ease(ease)
			.style("fill", function(d) {
				return d.color
			})
			.style("stroke", this.circleStrokeColor)
			.style("stroke-width", this.circleStrokeWidth)			
			.attr("transform", function(d) {
				return " translate(" + (xScale(d.x)) +","+ (yScale(d.y)) +")"
			}) 




		// Awful hack to update the y axis label
		// Should be replaced with enter/update/exit logic...
		this.plot.select('#yaxistext')
		.transition()
		.delay(delay)
		.duration(duration) 
		.style('opacity',0);			

		this.plot.append("g")
			.style("text-anchor", "middle")
			.attr("transform",
					"translate(" + (this.xRange[0] - this.ylabelCorrector[0]) + " ," + (this.yRange[1] / 2 + this.ylabelCorrector[1]) + ") rotate(-90)")
			.append("g")
				.attr('id', 'yaxistext_new')
				.attr("class", "mathjax")
				.style("font-size", this.ylabelRelativeSize + "%") 
				.style("color", this.ylabelColor)
				.style('opacity',0) 	  	  
				.append("text")  	
				.text(this.ylabel);

		this.plot.select('#yaxistext_new')
				.transition()
				.delay(delay)
				.duration(duration) 
				.style('opacity',1);		
				 
				

		this.yScale = yScale;

	};

	HideScatter(id, delay, duration){

		d3.select("#"+id)
			.transition()
			.delay(delay)
			.duration(duration)
			.style("opacity", "0")			

	};	

	DrawLine(data, id, delay, duration = 700, strokewidth = 1, strokecolor = 'steelblue'){

		//var xScale = this.xScale;
		//var yScale = this.yScale;	

		/*
		// Regression line
		var lineFunction = d3.line()
		    .x(function(d) { return xScale(d[0]); })
			.y(function(d) { return yScale(d[1]); });
		*/

	    var linepath =  this.plot.append("path")
			        .attr("class", "line")
			        .attr("id", id)
			        .attr("d", this.lineFunction(data));

		var totalLength = linepath.node().getTotalLength();
	   
		linepath
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
			  .attr("stroke", strokecolor)
			  .attr('fill','none')
		      .attr("stroke-width", strokewidth)
		      .transition()
		      .delay(delay)
	          .duration(duration)
	          .ease(d3.easeLinear)
	          .attr("stroke-dashoffset", 0);

		//this.lineFunction = lineFunction;
		this.linepath = linepath;
	
	};

	HideLine(delay, duration, id){

		d3.select("#"+id)
			.transition()
			.delay(delay)
			.duration(duration)
			.style("opacity", "0")			

	};	
	

	InitShapeAlongLine(params){

		this.shapeid = params.id;
		var r = params.r || 10;
		var cx = params.cx || 0;		
		var cy = params.cy || 0;		
		var fillColor = params.fillColor || "#ff3333";
		var strokeColor = params.stroke || 'white';				
		var strokeWidth = params.strokeWidth || 3;
		this.moveAlongEase = params.moveAlongEase || d3.easeCubic;
    
		var shape = this.plot.append("circle")
							  .attr('id', this.shapeid)
							  .attr("cx", cx)
							  .attr("cy", cy)									
							  .attr("r", r)
							  .attr('fill',fillColor)
							  .attr('opacity', 0)
							  .style("stroke", strokeColor)
							  .style("stroke-width", strokeWidth);
		this.shape = shape;							
	
	};

	MoveShape(delay, duration, interval, moveAlongEase = d3.easeCubic){
		// Inspired by https://bl.ocks.org/beemyfriend/a726752f461c22a4792a5aa4c10287be

		var path = this.linepath;
		var yScale = this.yScale;
		var xScale = this.xScale;
		//var moveAlongEase = this.moveAlongEase
		
		this.shape	
			 .transition()
			 .duration(0)
			 .delay(delay)
			 .style("opacity",1);

		transition(this.shape);
		
		function transition(shape) {
			shape
			  .transition()
			  .delay(delay)
			  .duration(duration)
			  .ease(moveAlongEase)      
			  .attrTween("transform", translateAlong(path.node(), interval[0], interval[1])  )			  
		}
		
		// tweening function on specific direction
		function translateAlong(path, startt, endt) {


			var l1 = endt   * path.getTotalLength();
			var l2 = startt * path.getTotalLength();			
			var l = l1-l2;

			if (Math.sign(l) == -1 || Math.sign(l) == -0){
				var direction = 'backward';
				l = Math.abs(l);
			} else {
				var direction = 'forward';
			};
	
			  return function(d, i, a) {
				
				return function(t) {

					if(direction == 'backward'){
						var p = path.getPointAtLength(l2 - (t * l) )
					} else if (direction == 'forward') {
						var p = path.getPointAtLength(l2 + t * l);
					}

				  console.log(yScale.invert(p.y))
				  //console.log(xScale.invert(p.x))				  
				  return "translate(" + p.x + "," + p.y + ")";
	
				};
			  };
			}







	};

	DrawBars(mydata, params, delay, duration = 300){

		// https://codepen.io/netkuy/pen/KzPaBe
		// Odd behavior with gap = pad = 0...
		this.barColor 	= params.barColor || "#666da3";
		const BAR_WIDTH = params.barWidth || 100;
		const BAR_GAP 	= params.barGap || 150;
		const pad 		= params.pad || 75;

		const WIDTH = this.xRange[1] - this.xRange[0];
		const HEIGHT = this.yRange[1] - this.yRange[0]
		var scale = this.yScale;

		function y(d) {
			return scale(d.value);			
		}
		
		function height(d) {
			return HEIGHT - scale(d.value);
		}


		const t = d3.transition()
					.duration(750);	 
		var vis = this.plot.select("#"+this.axesID)
		var bar = vis.selectAll('g').data(mydata, d => d.id)				  
  
		// EXIT section
		bar
		.exit()
			.remove();
		
		// UPDATE section
		bar.transition(t).attr("transform", (d, i) => `translate( ${pad + i * (BAR_WIDTH + BAR_GAP)} , ${y(d)} )`);


		bar.select("rect")
		.transition(t)
			.attr("height", height);
	
		// ENTER section
		const barEnter = bar
				.enter().append("g")
				.attr("transform", (d, i) => `translate(${pad + i * (BAR_WIDTH + BAR_GAP)},${HEIGHT})`);
	
		barEnter
		.transition(t)
			.attr("transform", (d, i) => `translate(${pad + i * (BAR_WIDTH + BAR_GAP)}, ${y(d)})`);
		
		const rect = barEnter.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.style('fill', this.barColor)
			.attr("width", BAR_WIDTH)
			.attr("height", 0);
		
		rect
		.transition(t)
			.attr("height", height);

	};

	TweenLine(line1ID,line1Data,line2Data, delay, duration = 2000){

		var xScale = this.xScale;
		var yScale = this.yScale;	
		var lineFunction = this.lineFunction

		// Uses cusotm function pathTween, which is old d3 version function by Bostok
		// depreciated over d3-interpolate-path
		/*
		d3.select("#" + line1ID)
				.transition()
				.delay(delay)
				.duration(duration)
		         //.attrTween("d", pathTween(lineFunction(line1Data), 4))
		        //.transition()
		         .attrTween("d", pathTween(lineFunction(line2Data), 4))
				//.transition();
		*/
		
		// Needs this imported: https://github.com/pbeshai/d3-interpolate-path				
		d3.select("#" + line1ID)
				.transition()
				.delay(delay)
				.duration(duration)
				 //.attrTween("d", pathTween(lineFunction(line2Data), 4))
				 .attrTween('d', function () { 
					var previous = d3.select(this).attr('d')
					var current = lineFunction(line2Data)
					return d3.interpolatePath(previous, current);
				});								 


		


	};
    
	Hide(delay, duration){

		this.plot
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0);		
	};	
    
};



class ThoughtBubble {

	/*
	Corresponding CSS:
		.stop-left {
		    stop-color: rgba(228, 239, 233, 1.00);     
		}

		.stop-right {
		    stop-color: rgba(147, 165, 207, 1.00);
		}

		.filled {
		    fill: url(#mainGradient);
		}

		.outlined {
		    fill:   none;
		    stroke: url(#mainGradient);
		    stroke-width: 4;
		}	
	*/

	constructor(params){


	    this.pos             = params.pos
        this.scales          = params.scales || [1]
        this.id              = params.id
	    this.textRelXPos     = params.textRelXPos || 0
        this.textRelYPos     = params.textRelYPos || 0
        this.textAreaWidth   = params.textAreaWidth || 200
        this.textAreaHeight  = params.textAreaHeight || 100
        this.text            = params.text || "empty"
        this.scaleEase       = params.scaleEase || "d3.easeLinear"
        this.moveEase        = params.moveEase || "d3.easeLinear"
        this.fontFamily      = params.fontFamily || "Times New Roman"
        this.fontSize        = params.fontSize || 14
        this.textColor       = params.textColor || "black";


		// Create the svg:defs element and the main gradient definition.
		var svgDefs = svg.append('defs');

		var mainGradient = svgDefs.append('linearGradient')
		    .attr('id', 'mainGradient');

		// Create the stops of the main gradient. Each stop will be assigned
		// a class to style the stop using CSS.
		mainGradient.append('stop')
		    .attr('class', 'stop-left')
		    .attr('offset', '0');

		mainGradient.append('stop')
		    .attr('class', 'stop-right')
		    .attr('offset', '1');
		    

		//Filter for the outside glow
		var filter = svgDefs.append("filter")
		  .attr("id","glow");
		filter.append("feGaussianBlur")
		  .attr("stdDeviation","3.5")
		  .attr("result","coloredBlur");
		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
		       .attr("in","coloredBlur");
		
		feMerge.append("feMergeNode")
			  .attr("in","SourceGraphic");


		// Group tp hold cloud
		var group = svg.append('g')
		    .attr("id", this.id)
		    .style("opacity", 0);

		// Define outline of cloud
		var bubbleString0 = "M 0,0"
		          + "c -5,-30 -70,-30 -80,-8"          

		var bubbleString1 = "M -63,-21"
		          + "c -20,-20 -70,-20 -95,13"          

		var bubbleString2 = "M -151,-15"
		          + "c -10,0 -40,-15 -60,40"          

		var bubbleString3 = "M -211,25"
		          + "c -30,20 -30,50 -10,80"      

		var bubbleString4 = "M -216,100"
		          + "c -20,15 -10,90 40,70"     

		var bubbleString5 = "M -174,168"
		          + "c -15,30 35,30 35,20" 

		var bubbleString6 = "M -139,187"
		          + "c 15,15 40,15 55,0" 

		var bubbleString7 = "M -88,183"
		          + "c 30,25 90,15 100,-15" 

		var bubbleString8 = "M 5,178"
		          + "c 25,0 35,-10 28,-35" 

		var bubbleString9 = "M 35,150"
		          + "c 10,0 10,-20 6,-20" 

		var bubbleString10 = "M 40,130"
		          + "c 40,-20 25,-40 10,-50" 

		var bubbleString11 = "M 57,86"
		          + "c 20,-20 25,-40 -5,-60" 

		var bubbleString12 = "M 58,30"
		          + "c 15,-17 0,-50 -60,-35" 

		var strings = [bubbleString0
		             ,bubbleString1
		             ,bubbleString2
		             ,bubbleString3                         
		             ,bubbleString4
		             ,bubbleString5                          
		             ,bubbleString6              
		             ,bubbleString7
		             ,bubbleString8
		             ,bubbleString9 
		             ,bubbleString10
		             ,bubbleString11
		             ,bubbleString12       
		            ]

		// Draw outline
		strings.forEach(function(d){
		      group.append("g")
		           .append("path")
		           .attr("fill","none")        
		           .attr("d", d);
		});

		// Define buuble fill path
		var filledBubbleString = "M 0,0"
		          + "c -5,-30 -70,-25 -60,-20" 
		          + "c -20,-19 -70,-20 -90,4"
		          + "c -10,0 -40,-15 -60,40"
		          + "c -30,20 -32,51 -10,81" 
		          + "c -14,10 -10,83 45,65"
		          + "c -15,27 35,27 37,19"
		          + "c 15,12 40,13 54,-3" 
		          + "c 30,20 82,10 90,-9" 
		          + "c 23,4 30,-10 29,-27" 
		          + "c 10,0 10,-20 6,-20"
		          + "c 36,-17 23,-40 16,-44"
		          + "c 20,-21 23,-37 1,-57" 
		          + "c 17,-16 -2,-48 -60,-34"                                                                       

		  // Draw  bubble fill
		  group.append("g")
		         .append("path")
		         //.style("filter", "url(#glow)")
				 //.classed("filled",true)
				 .style("fill","rgba(228, 239, 233, 1.00)")    
		         .style("stroke", "none")            
		         .attr("d", filledBubbleString);



		// Initialize cloud group
		group.attr("transform", "translate(" + this.pos[0][0] + "," + this.pos[0][1]  + 
								") scale("+ this.scales[0]+")");			      			


	};

	Draw(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",1);

	};

	Hide(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0);

	};

	Text(delay, duration){

		///*
		var fo = d3.select('#'+ this.id)
					.append('foreignObject')
					.attr('x',-180 + this.textRelXPos) 
					.attr('y',65 + this.textRelYPos)
					.attr('width',this.textAreaWidth)
					.attr('height',this.textAreaHeight);


		var div = fo.append('xhtml:div')
						.html(this.text)
						.style("font-family",this.fontFamily)
						.attr("align", "center")					
						.style("font-size", this.fontSize + "px")
						.style("color", this.textColor);


	};


	Scale(stepno, delay, duration, corrector = [100, -40]){


		d3.select('#'+ this.id)
		  .transition()
		  .delay(delay)
		  .duration(duration)  
		  .attr("transform", " translate(" + (this.pos[stepno][0] + corrector[0]) +","+ (this.pos[stepno][1] + corrector[1]) +") scale(" + this.scales[1]+ ")")		  		  		  
		  .ease(eval(this.scaleEase));

	};


	Move(stepno, delay, duration){

		d3.select('#'+ this.id)
	      .transition()
	      .delay(delay)
	      .duration(duration)
	      .attr("transform", "translate(" + this.pos[stepno][0] + "," + this.pos[stepno][1]  + ") scale("+this.scales[0]+")")			      			
		  .ease(eval(this.moveEase));
	};



};


class TextField {

	constructor(params){

		this.pos             = params.pos
        this.id              = params.id		
        this.scales          = params.scales || [1]
	    this.textRelXPos     = params.textRelXPos || 0
        this.textRelYPos     = params.textRelYPos || 0
        this.textAreaWidth   = params.textAreaWidth || 200
        this.textAreaHeight  = params.textAreaHeight || 100
        this.text            = params.text || "empty"
        this.scaleEase       = params.scaleEase || "d3.easeLinear"
        this.fontFamily      = params.fontFamily || "Calibri"
        this.fontSize        = params.fontSize || 20
        this.textColor       = params.textColor || "black";        
        this.textAlign       = params.textAlign || "left"
        this.pads            = params.pads || [0,0,0,0]
        this.rectStroke      = params.rectStroke || "none";


		var group = svg.append('g')
						.attr('id',this.id)
						.style("opacity", 0);

		var rectangle = group.append('rect')
							.attr('x',this.pos[0][0])
							.attr('y',this.pos[0][1])
							.attr('width',this.textAreaWidth)
							.attr('height',this.textAreaHeight)
							.attr('fill','none')
							.attr('stroke',this.rectStroke); 

		var fo = group.append('foreignObject')
						.attr('x',this.pos[0][0] + this.pads[0]) 
						.attr('y',this.pos[0][1] + this.pads[2])						
						.attr('width',this.textAreaWidth - this.pads[1])
						.attr('height',this.textAreaHeight - this.pads[3]);				

		var div = fo.append('xhtml:div')
						//.attr("class", "mathjax")
						.attr('id',this.id + "_xhtml")
						.style("font-family",this.fontFamily)				
						.style("color", this.textColor)
						.attr("align", this.textAlign)											
						.style("font-size", this.fontSize + "px")
						.append("text")
						.html(this.text);


	};


	Draw(delay , duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",1);		
	};

	// DOES NOT WORK	
	Update(newtext){

		document.getElementById(this.id + "_xhtml").innerHTML = newtext
			
	};
	

	Hide(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0);		
	};	

};


class ForceSwarm {

	constructor(params){

		//this.pos             = params.pos
        //this.id              = params.id		

		this.nodes = params.nodes;	
		var circleStrokeColor = params.circleStrokeColor || "#D7E4DB"
		var circleStrokeWidth = params.circleStrokeWidth || 1		

		var simulation = d3.forceSimulation(this.nodes)
		    .force("charge", d3.forceManyBody().strength(-8))
		    .alphaMin(0.001) // def 0.001
		    .alphaDecay(1 - Math.pow(0.001, 1 / 400)) 
		    .velocityDecay(0.7) // def 0.4
		    .force('collision', d3.forceCollide()
		                          .radius(function(d){return d.radius})    
		          )    
		    .force('x', d3.forceX()
		                  .x(function(d) {return d.xCenter;})
		                  .strength(0.08)
		          )
		    .force('y', d3.forceY()
		                  .y(function(d) {return d.yCenter;})
		                  .strength(0.08)
		    )
		    .stop();

		var node = svg.append("g")
		            .attr("stroke", circleStrokeColor)
		            //.style('fill', '"#666da3"')
		            .attr("stroke-width", circleStrokeWidth)
		            .selectAll(".node");


		this.simulation = simulation;
		this.node = node;

	};
	//Draw(delay , duration){


	//};

	restart(nodes) {


	  this.node = this.node.data(nodes, function(d) { return d.name;});

	  this.node.exit()
	      .style("fill", function(d){ return d.color; })
	      .remove();

	  this.node
	      .style("fill", function(d){ return d.color; })        
	      .attr("r", function(d){return d.radius; });

	  this.node = this.node.enter().append("circle")
	             .attr("r", function(d){return d.radius; })
	             .merge(this.node);

	  this.simulation.nodes(nodes);
	  this.simulation.alpha(1).restart();            

	};	

/*
	startAnimating(){

      // For recording
      var xArray = [];
      var yArray = [];
      var colorArray = [];
      var timeArray = [];		
      
      this.xArray = xArray;
      this.yArray = yArray;
      this.colorArray = colorArray;
      this.timeArray = timeArray;		

	  this.simulation.restart().on('tick',animate(this.node));


	  function animate(node){

		  node.attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; })
	  };


	};

	animate() {
	  swarm.node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })


	  // Record
	  //this.xArray.push(this.node.data().map(function(d){return d.x}));
	  //this.yArray.push(this.node.data().map(function(d){return d.y}));
	  //this.colorArray.push(this.node.data().map(function(d){return d.color}));  
	  //this.timeArray.push(performance.now())
 
	//};	
*/
};

class DataTable {

	constructor(params){
		this.id              = params.id
		this.pos             = params.pos
		this.path            = params.path
        this.width           = params.width || 700			

		var tabWidth = this.width 
		/*
		Corresponding CSS
		
			table { 
			border-collapse: collapse; 
			font: 14px/1.4 Georgia, Serif;

			}
			tr:nth-of-type(odd) { 
			background: #FFFFFF; 
			}
			tr:nth-of-type(even) { 
			background: #BED6FF; 
			}  
			th { 
			background: #333; 
			color: white; 
			font-weight: bold;
			font-size: 30px;  
			cursor: s-resize;
			background-repeat: no-repeat;
				background-position: 3% center;
			}

			td {
			font-size: 26px;
			}

			td, th { 
			padding: 6px; 
			border: 1px solid #ccc; 
			text-align: center;
			width: 150px;     
			}

			th.des:after {
			content: "\21E9";
			}

			th.aes:after {
			content: "\21E7";
			}
		*/

	   var tableholder = svg.append("foreignObject")
						.attr("id", this.id)
						.style("opacity", 0.0)						
	                    .attr("width", tabWidth + 100)
	                    .attr("height", 500)
	                    .attr('x',this.pos[0]) 
	                    .attr('y',this.pos[1])
	                    .append("xhtml:body");	                    

	    // Inspired by
	    //http://bl.ocks.org/AMDS/4a61497182b8fcb05906
	    //d3.json("data.json", function(error, data) { 
	    d3.json(this.path, function(error, data) {          
	      	if (error) throw error;
	      
	        var sortAscending = true;

		    var table = tableholder.append('table')
								   .attr('width',tabWidth)						   

		  

	        var titles = d3.keys(data[0]);

	        var headers = 
			      table.append('thead')
					        .append('tr')
	                        .selectAll('th')
	                        .data(titles).enter()
	                            .append('th')
	                            .text(function (d) {
	                               return d;
	                             })
	                            .on('click', function (d) {
	                              headers.attr('class', 'header');
	                              
	                              if (sortAscending) {
	                                rows.sort(function(a, b) { return b[d] < a[d]; });
	                                sortAscending = false;
	                                this.className = 'aes';
	                              } else {
	                              rows.sort(function(a, b) { return b[d] > a[d]; });
	                              sortAscending = true;
	                              this.className = 'des';
	                              }
	                         
			                     });
	      
	      var rows = table.append('tbody')
					      .selectAll('tr')
		                  .data(data).enter()
		                     .append('tr');

	      rows.selectAll('td')
	          .data(function (d) {
	            return titles.map(function (k) {
	              return { 'value': d[k], 'name': k};
	            });
	          })
	          .enter()
		          .append('td')
		          .attr('data-th', function (d) {
		            return d.name;
		          })
		          .text(function (d) {
		            return d.value;
		          });
	    });

        
	}

	Draw(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",1.0);	    

	};

	Hide(delay, duration){

		d3.select('#'+ this.id)
			.transition()
			.duration(duration)
			.delay(delay)
		    .style("opacity",0.0);	    

	}


}



// https://stackoverflow.com/questions/27190266/d3js-elliptic-speech-bubble
function SpeechBubble(parameters) {
    var w = parameters.width || 200,
            h = parameters.height || 100,
            a = w / 2,
            b = h / 2,
            o_x = parameters.x0 || 100,
            o_y = parameters.y0 || 100,
            m_r = parameters.l || 300,
            m_w = 10,
            m_q = parameters.angle * Math.PI / 180 || 50 * Math.PI / 180,
            m_q_delta = Math.atan(m_w / (2 * Math.min(w, h)));

    var d = "M", x, y, 
            d_q = Math.PI / 30; // 1/30 -- precision of drawing

    // now, we are drawing the path step by step
    for (var alpha = 0; alpha < 2 * Math.PI; alpha += d_q) {

        if (alpha > m_q - m_q_delta && alpha < m_q + m_q_delta) { //edge
            x = o_x + m_r * Math.cos(m_q);
            y = o_y + m_r * Math.sin(m_q);
            d += "L" + x + "," + y;
            alpha = m_q + m_q_delta;
        } else { // ellipse
            x = a * Math.cos(alpha) + o_x;
            y = b * Math.sin(alpha) + o_y;
            d += "L" + x + "," + y + " ";
        }
    }
    d += "Z";
    return(d.replace(/^ML/, "M").replace(/ Z$/, "Z"));
};





function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};


// http://bl.ocks.org/larsenmtl/86077bddc91c3de8d3db6a53216b2f47
function addMathJax(){

	setTimeout(() => {
	  
	  MathJax.Hub.Config({
	    tex2jax: {
	      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
	      processEscapes: true

	    }
	  });
	  
	  MathJax.Hub.Register.StartupHook("End", function() {
	    setTimeout(() => {
	          svg.selectAll('.mathjax').each(function(){
	          var self = d3.select(this),
	              g = self.select('text>span>svg');
	          g.remove();
	          self.append(function(){
	            return g.node();
	          });
	        });
	      }, 1);
	    });
	  
	  MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg.node()]);
	  
	}, 1);  

};

// Cusotm function pathTween, which is old d3 version function by Bostok
//https://bl.ocks.org/mbostock/3916621
// depreciated over d3-interpolate-path
/*
function pathTween(d1, precision){
	return function() {
		var path0 = this,
			path1 = path0.cloneNode(),
			n0 = path0.getTotalLength(),
			n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

		// Uniform sampling of distance based on specified precision.
		var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
		while ((i += dt) < 1) distances.push(i);
		distances.push(1);

		// Compute point-interpolators at each distance.
		var points = distances.map(function(t) {
		var p0 = path0.getPointAtLength(t * n0),
			p1 = path1.getPointAtLength(t * n1);
		return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
		});

		return function(t) {
		return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
		};
	};
};
*/


function CalculateLSELine(myx, myy, y_0, m){
			
	// Linear regressin line equation is 
	//   y = y_0 + m*x
	// Substituting in observation x-value we get the y coordinate
	// of intersection point 
	
	return[[myx, myy], [myx, y_0 + m * myx]]
};
