/*Deze code is gebaseerd van Jonah Williams http://bl.ocks.org/jonahwilliams/2f16643b999ada7b1909. Ik heb een aantal aanpassingen gedaan in de code.*/

//Margin definieert de grafiek met eigenschappen voor de vier zijden
//Width en Height definieert daarna de breedte en hoogte van de binnenafmetingen van het grafiekgebied.
var margin = {top: 80, right: 180, bottom: 90, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Er wordt een variable svg gemaakt. Er worden margins toegevoegd aan het canvas van svg 
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Laadt de data uit het .tsv file
d3.tsv("data.tsv", function(error, data){

	
	//Hier worden de waardes van alle colummen uit het .tsv bestand geladen
	var elements = Object.keys(data[0])
		.filter(function(d){
			return ((d != "Year") & (d != "State"));
		});
    
	var selection = elements[0];
 
    //Hier wordt de bar gecalculeerd. Nu wordt het op een passende manier geplaatst. 
	var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d){
				return +d[selection];
			})])
			.range([height, 0]);

	var x = d3.scale.ordinal()
			.domain(data.map(function(d){ return d.State;}))
			.rangeBands([0, width]);

    //X-as van grafiek wordt hier aan de onderkant geplaatst
	var xAxis = d3.svg.axis()
		.scale(x)
	    .orient("bottom");
    
    //y-as van de grafiek wordt hier aan de linkerkant geplaatst
	var yAxis = d3.svg.axis()
		.scale(y)
	    .orient("left");

    //Waardes worden op de x-as geplaatst. Tekst labels aan de x-as worden hier opgemaakt. Zonder zou de x-as leeg staan.
	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "8px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-90)" );

    //Waardes worden op de y-as geplaatst. Zonder zou de y-as leeg staan.
 	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis);
    
    //
	svg.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/data.length)
		.attr("height", function(d){
			return height - y(+d[selection]);
		})
		.attr("x", function(d, i){
			return (width / data.length) * i ;
		})
		.attr("y", function(d){
			return y(+d[selection]);
		})
		.append("title")
		.text(function(d){
			return d.State + " : " + d[selection];
        
		});

    //Dropdown menu
	var selector = d3.select("#drop")
    	.append("select")
    	.attr("id","dropdown")
    	.on("change", function(d){
        	selection = document.getElementById("dropdown");
            
            //Waardes uit .tsv worden nu verwerkt ik de hoogte, de y-as, van de bar, als nieuwe jaren worden gekozen
        	y.domain([0, d3.max(data, function(d){
				return +d[selection.value];})]);

        	yAxis.scale(y);
            
            //Selection returns selectie van gekozen waarde. Waarde wordt visueel. Nieuwe waarde wordt verwerkt in de y-as. 
        	d3.selectAll(".rectangle")
           		.transition()
	            .attr("height", function(d){
					return height - y(+d[selection.value]); 
				})
				.attr("x", function(d, i){
					return (width / data.length) * i ;
				})
				.attr("y", function(d){
					return y(+d[selection.value]);
				}) 
           		.ease("linear")
           		.select("title")
           		.text(function(d){
           			return d.State + " : " + d[selection.value];
           		});
      
           	d3.selectAll("g.y.axis")
           		.transition()
           		.call(yAxis);

         });
    
    //Laadt de keuzes in het dropdown menu. De jaren kunnen nu gekozen worden.
    selector.selectAll("option")
      .data(elements)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })           
});
