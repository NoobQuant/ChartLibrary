

// Sources:
  // https://bl.ocks.org/mbostock/3231298
  // http://bl.ocks.org/eesur/9910343


var maxweek = 37
var minweek = 35
var week_number = 35
var dataset = []

var margin = {top: 0, right: 50, bottom: 100, left: 0}
var sBarMinWidth = 758
var sBarWidth = 310
var widthChart
var heightChart = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom  

if(parseInt(d3.select('body').style('width'), 10) < sBarMinWidth){
  widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right         
  
} else {
  widthChart = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right - sBarWidth
}

// Define canvas
var svg = d3.select("#chart") // select chart that is defined in dashboard html file
            .append("svg")
            .attr("width", widthChart)
            .attr("height", heightChart)
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .append("g")

// Read a change in node count slider
d3.select("#nNodes").on("input", function() {
  restartNodes(+this.value,svg,dataset, +document.getElementById("week_field").value)
})

// Start with 20 nodes
restartNodes(20,svg,dataset,+document.getElementById("week_field").value)







// Main function to do all the lifting 
////////////////////////////////////////
function restartNodes(n_nodes,svg,rem_words_array, crt_week) {


  // Remove all nodes form canvas
  svg.selectAll(".node").remove()
  
  var rem_words = "gfgfg" // hack: put some weird word here that will never be included
  if (rem_words_array.length > 0){
    rem_words_array.forEach(function(word) {
      rem_words = rem_words + "|" + word
    })   
  }     
  	   
  // Adjust slider range and text
  d3.select("#nNodes-value").text(n_nodes)
  d3.select("#nNodes").property("value", n_nodes)

  var input_json = "news_word_cloud/jsonfiles/" + "HS_output_week_"+crt_week+"_lemmatized.json" 
 
  // Data from json file
  d3.json(input_json, function(error, json) {  
      if (error) throw error;

      var data = json
      var nodes = {}
      var max_size = 0
      var node_counter = 0
      var BreakException = {}      

      // Nodes as a collection of objects
      // Hack to break forEach: throw exception
      try {
	      data.forEach(function(crt_word) {

	      	// If blacklisted word, remove
	        if (crt_word.word.match(rem_words)) {
	          return

          } else if (crt_word.type === 'noun' && document.getElementById("cb_noun").checked==false){
             return

	        } else if (crt_word.type === 'verb' && document.getElementById("cb_verb").checked==false ){

            return  
            
          } else if (crt_word.type === 'adjective' && document.getElementById("cb_adjective").checked==false){
            
            return

          } else if (crt_word.type === 'adverb' && document.getElementById("cb_adverb").checked==false){
            
            return  

          } else if (crt_word.type === 'numeral' && document.getElementById("cb_numeral").checked==false){
            
            return  
            

          } else{
	        	node_counter = node_counter + 1
	        }

	        // Append properties
	        crt_word.word = nodes[crt_word.word] || (nodes[crt_word.word] = {name: crt_word.word})
	        nodes[crt_word.word.name].size = crt_word.size
	        nodes[crt_word.word.name].type = crt_word.type 

	        // Get new max size
	        if (crt_word.size > max_size){
	          max_size = crt_word.size
	        }

	        // If we reached target number of nodes, break
	        if (node_counter === n_nodes){
	        	throw BreakException
	        }

	      })

		  } catch (e) {
		    if (e !== BreakException) throw e
		  }

      // Calculate relative size for nodes
      for (element in nodes){
        nodes[element].rel_size = nodes[element].size / max_size
        nodes[element].radius = nodes[element].rel_size * 24 + 8
      }

      // Set force graph layout
      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .size([widthChart-150, heightChart])
          .gravity(0.005)
          .charge(0.001)
          .on("tick", tick)
          .start()

      // Tooltip for word count
      var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "#f44336")
        .style("font-weight", "bold")

      // Nodes
      var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g") // append g element
            .attr("class", "node")
            .call(force.drag)

      // Append circle to node
      node.append("circle")
            .style("fill", color)
            .attr("r", function(d) { return d.radius })   
            .on("mouseover", function(){
                d3.select(this).style({opacity:'0.8'})
                tooltip.text( "Count: " + (+d3.select(this)[0][0].__data__.size)  )  
                tooltip.style("visibility", "visible")
              })
            .on("mousemove", function(){
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")})
            .on("mouseout", function(d){
                d3.select(this).style({opacity:'1.0'})
                tooltip.style("visibility", "hidden")
              })

      // Append text to node
      node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name })


      // redraw chart on resize
      window.addEventListener('resize', drawChart)





  	// Auxiliary functions for main function 
  	////////////////////////////////////////

    // Function for moving of the nodes
    function tick() {

        // Convert object to array
        var nodes_array = Object.keys(nodes).map(function (key) { return nodes[key]})
        var q = d3.geom.quadtree(nodes_array)
        var i = 0
        var n = nodes_array.length

        while (++i < n) q.visit(collide(nodes_array[i]))

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"})
    }

    function collide(node) {
	  // Source: https://bl.ocks.org/mbostock/3231298
	    var r = node.radius + 32
	    var nx1 = node.x - r
	    var nx2 = node.x + r
	    var ny1 = node.y - r
	    var ny2 = node.y + r
	    return function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== node)) {
	        var x = node.x - quad.point.x
	        var y = node.y - quad.point.y
	        var l = Math.sqrt(x * x + y * y)
	        var r = node.radius + quad.point.radius
	        if (l < r) {
	          l = (l - r) / l * .5
	          node.x -= x *= l
	          node.y -= y *= l
	          quad.point.x += x
	          quad.point.y += y
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
	    }
    }


    // helper function for function tick
    function index(obj,i) {return obj[i]}

    // Function for coloring nodes
    function color(d) {
      var colortype
        if (d.type == 'noun'){
          colortype = "#3182bd"
        } else if (d.type == 'adjective') {
          colortype = "#fd8d3c"
        } else if (d.type == 'verb') {
          colortype = "#5aaa3d"
        } else if (d.type == 'adverb') {
          colortype = "#e9d49c"
        } else if (d.type == 'pronoun') {
          colortype = "#d3ffce"
        } else if (d.type == 'particle') {
          colortype = "#e57b7b" 
        } else if (d.type == 'adposition') {
          colortype = "#525176" 
        } else if (d.type == 'numeral') {
          colortype = "#e2b900" 
        } else{
          colortype = "#5aaa3d"
        }
      return colortype
    }

  }) // close json

} // close main function





// Rest of  auxiliary functions 
////////////////////////////////////////

function plus_node(){
   +document.getElementById("nNodes").value++
   restartNodes(+document.getElementById("nNodes").value,svg,dataset,
                +document.getElementById("week_field").value)
}

function minus_node(){
   +document.getElementById("nNodes").value--
   restartNodes(+document.getElementById("nNodes").value,svg,dataset,
                +document.getElementById("week_field").value)
}


function plus_week(){

   if ((+document.getElementById("week_field").value + 1) < (maxweek+1)) {
     +document.getElementById("week_field").value++
     restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value)
   }
}

function minus_week(){
   if ((+document.getElementById("week_field").value - 1) > (minweek-1)) {
     +document.getElementById("week_field").value--
     restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value)
   } 
}



function handleClick(event){

    // Don't do anythin if input is ""
    if (!document.getElementById("myVal").value){
      return false
    }
    draw(document.getElementById("myVal").value)

    // Reset form
    document.getElementById("myVal").value = ""
    return false;
}


function draw(val){
    dataset.push(val)
    var crt_text = d3.select("#excluded_words")[0][0].value
    if (crt_text === "" ){
      crt_text = val  
    } else{
      crt_text = crt_text +", " + val      
    }
    d3.select("#excluded_words")[0][0].value = crt_text               
    restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value)    
}

function remove_last_word(){
    dataset.pop()
    var crt_text = d3.select("#excluded_words")[0][0].value
    var lines = crt_text.split(", ");
    lines.splice(-1,1);
    crt_text = lines.join(", ");
    d3.select("#excluded_words")[0][0].value = crt_text       
    restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value) 
}

function checkbox_update(){

    restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value)   

}

document.getElementById('myVal').onkeypress = function(e){
    if (!e) e = window.event
    if (e.keyCode == '13'){
      return handleClick()
    }
}


function drawChart() {
    // reset the width
    
    heightChart = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom  

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
    
    restartNodes(+document.getElementById("nNodes").value,svg,dataset,
      +document.getElementById("week_field").value)  
    
  } 
  
