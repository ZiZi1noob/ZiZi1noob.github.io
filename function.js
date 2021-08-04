function bubbleChart(data){
    let margin = {top: 150, bottom: 200, left: 200, right: 200};
    let annotationHeight = screen.height;
    let annotationWidth = screen.width;
    const annotations = [
        {
            note: { label: "represents human development index, an index of life expectancy, education, and per capita income indicators. ",
                    align: "middle",
                    title: "HDI", 
                   // orientation: "bottom"
                },
            connector:{"end":"dot"},
            annotation: "HDI",
            x: annotationWidth/2,
            y: -100, //x,y (number:pixels): Position of the subject and one end of the connector
            dy: 100,
            dx: annotationWidth/20,    //dx, dy (number:pixels): Position of the note and one end of the connector, as an offset from x,y
            subject: { radius: 50, radiusPadding: 10 },
            color:["darkblue"]
            },
          ];
          
    const makeAnnotation = d3.annotation().annotations(annotations);

    let yScale = d3.scaleLinear()
                    .domain([30,100])
                    .range([height*0.5,0]);
    let xScale = d3.scaleSqrt()
                    //.base(100)
                    .domain([0,1500000000])   //reverse range instead of domain
                    .range([0,width*0.7]);

    svg =d3.select("#bubbleSVG")
        .append("svg")
        .attr("height", height*0.9)
        .attr("width",width*0.9)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") //show the whole chart including axies.;
    
    svg.call(makeAnnotation);
    svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .transition()
        .duration(2000)
        .delay(function(data,i){
            return i*10;
        })
        .attr("fill", "lightblue")
        .attr("cy", function(data,i){return yScale(data.LifeExpectancy)})
        .attr("cx", function(data,i){return xScale(data.Population)})
        .attr("r", function(data){return data.HDI*10});



    let yAxis =d3.axisLeft(yScale)
        .tickFormat(d3.format("~s"));

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("~s"));

    svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    svg
        .append("g")
        //.attr("transform", "translate("+margin.left+",0))
        .attr("transform", "translate(0,"+height*0.5+")")
        .call(xAxis);

    svg.append("text")      // text label for the x axis
            .attr("x",  width/3)
        .attr("y",  0.5*(height)+margin.bottom/5)
        .attr("class", "axisLabelStyle")
        .text("Population");

    svg.append("text")   // text label for y axis
        .attr("dy", -margin.left/5)
        .attr("dx", -margin.top)
        .attr("transform", "rotate(-90)")    
        .attr("x", -50)
        .attr("class", "axisLabelStyle")
        .text("Average Life Expectancy");



    d3.selectAll("circle")  //add anotation
        .on("mouseover", function(data){
            let dotCX = this.getAttribute("cx");
            let dotCY = this.getAttribute("cy");
            let dotPop = data.Population;
            let dotLifeEp = data.LifeExpectancy;
            let dotHDI =data.HDI;
            let dotCty = data.Country;
            
            let makeAnnotations = d3.annotation();
            svg
                .append("g")
                .style("font-size", 25)
                .style("font-weight", "bold")
                .call(makeAnnotations);

            d3.select(this)
                .transition()
                .attr("fill","red")
                .delay(function(d,i){return 100*i;})
                .duration(1000)
                .attr("r", function(d){return d.HDI*35});


             d3.select(this)
                .append("title")
                .text(
                        `Year: ${data.Year}
Country: ${data.Country}
HDI: ${data.HDI}
Population: ${data.Population} 
LifeExpectancy: ${data.LifeExpectancy}
             `);})

        .on("mouseout", function(data)
        {  
                d3.select(this)
                .transition()
                .delay(function(d,i){return 100*i;})
                .duration(1000)
                .attr("r", function(d){return d.HDI});
        });       

}



const renderInflaChart =  function(data, heightT, widthT){
 
    const margin = {top: 100, bottom: 200, left: 200, right: 400};
    let height = heightT;
    let width = widthT;
    const circleR = 5;

    var svg = d3.select("#chartsArea") // 1. Add the SVG to the page and employ 
        .append("svg")
        .attr("width", width)
        .attr("height", height*0.8)
        .append("g")
        .attr("transform", "translate(" + width/4 + ", 0)"); //show the whole chart including axies.

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.Year;}),d3.max(data, function(d){ return d.Year;})])
        .range([0,width*0.5]); // output pix
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){ return d.Inflation;})])
        .range([height*0.5,30]); // output length

    var line = d3.line() //d3's line generator
        .x(function(data, i) { return xScale(data.Year); }) // set the x values for the line generator
        .y(function(data) { 
            return yScale(data.Inflation); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX); // apply smoothing to the line



    svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line);

    svg.append("g")
        .attr("class", "axisStyle") 
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
    
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(function(data){
            return data});

    svg.append("g")
        .attr("class", "axisStyle")
        .attr("transform", "translate(0," + 0.5*height + ")")
        .call(xAxis); // Create an axis component with d3.axisBottom
   
    dotArea =svg.selectAll(".dot")   // 12. Appends a circle for each datapoint 
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(data, i) {
            return xScale(data.Year) })
        .attr("cy", function(data) {
            return yScale(data.Inflation)})
        .attr("r", circleR);

    svg.append("text")      // text label for the x axis
        .attr("x",  width/4.5)
        .attr("y",  0.4*(height) + margin.bottom)
        .attr("class", "axisLabelStyle")
        .text("Year");

    svg.append("text")   // text label for y axis
        .attr("dy", "-1em")
        .attr("dx", "-6em")
        .attr("transform", "rotate(-90)")    
        .attr("x", -50)
        .attr("class", "axisLabelStyle")
        .text("Inflation, consumer prices (annual %)");

    svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2)
        .attr("class", "chartText")
        .text("Inflation rate");     
    svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2+28)
        .attr("class", "chartText2")
        .text("is based on consumer price index (CPI). CPI tracks the change");
        svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2+28+28)
        .attr("class", "chartText2")
        .text(" in retail prices of goods and services for their daily consumption.");    
       
    d3.selectAll("circle")  //add anotation
        .on("mouseover", function(data){
            let dotCX = this.getAttribute("cx");
            let dotCY = this.getAttribute("cy");
            let dotYear = data.Year;
            let dotInfla = data.Inflation;
            let annotations =addAnotationI(dotCX,dotCY,dotYear,dotInfla);
            
            const makeAnnotations = d3.annotation()
                    .annotations(annotations);
            svg.append("g")
                .style("font-size", 25)
                .style("font-weight", "bold")
                .call(makeAnnotations);

            d3.select(this)
                .transition()
                .delay(function(d,i){return 100*i;})
                .duration(1000)
                .attr("r", function(){return 20;});
            })
        .on("mouseout", function()
        {
            d3.select(this)
                .attr("r",circleR);
        }
            );       
};

const renderIntnHomcdChart =  function(data, heightT, widthT){
 
 const margin = {top: 100, bottom: 200, left: 200, right: 400};
 let height = heightT;
 let width = widthT;
 const circleR = 5;

 var svg = d3.select("#chartsArea") // 1. Add the SVG to the page and employ 
     .append("svg")
     .attr("width", width)
     .attr("height", height*0.8)
     .append("g")
     .attr("transform", "translate(" + width/4 + ", 0)"); //show the whole chart including axies.

 var xScale = d3.scaleLinear()
     .domain([d3.min(data, function(d){ return d.Year;}),d3.max(data, function(d){ return d.Year;})])
     .range([0,width*0.5]); // output pix
 var yScale = d3.scaleLinear()
     .domain([0, d3.max(data, function(d){ return d.IntentionalHomicides;})])
     .range([height*0.5,30]); // output length

 var line = d3.line() //d3's line generator
     .x(function(data, i) { return xScale(data.Year); }) // set the x values for the line generator
     .y(function(data) { 
         return yScale(data.IntentionalHomicides); }) // set the y values for the line generator 
     .curve(d3.curveMonotoneX); // apply smoothing to the line



 svg.append("path")
     .datum(data) // 10. Binds data to the line 
     .attr("class", "line") // Assign a class for styling 
     .attr("d", line);

 svg.append("g")
     .attr("class", "axisStyle") 
     .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
 
 let xAxis = d3.axisBottom(xScale)
     .tickFormat(function(data){
         return data});

 svg.append("g")
     .attr("class", "axisStyle")
     .attr("transform", "translate(0," + 0.5*height + ")")
     .call(xAxis); // Create an axis component with d3.axisBottom

 dotArea =svg.selectAll(".dot")   // 12. Appends a circle for each datapoint 
     .data(data)
     .enter().append("circle") // Uses the enter().append() method
     .attr("class", "dot") // Assign a class for styling
     .attr("cx", function(data, i) {
         return xScale(data.Year) })
     .attr("cy", function(data) {
         return yScale(data.IntentionalHomicides)})
     .attr("r", circleR);

 svg.append("text")      // text label for the x axis
     .attr("x",  width/4.5)
     .attr("y",  0.4*(height) + margin.bottom)
     .attr("class", "axisLabelStyle")
     .text("Year");

 svg.append("text")   // text label for y axis
     .attr("dy", "-1em")
     .attr("dx", "-6em")
     .attr("transform", "rotate(-90)")    
     .attr("x", -50)
     .attr("class", "axisLabelStyle")
     .text("Intentional homicides per 100,000");

 svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2)
     .attr("class", "chartText")
     .text("Intentional homicides");     
 svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2+28)
     .attr("class", "chartText2")
     .text("is defined as unlawful death purposefully inflicted on a person");
     svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2+28+28)
     .attr("class", "chartText2")
     .text("by another person.");    
    
 d3.selectAll("circle")  //add anotation
     .on("mouseover", function(data){
         let dotCX = this.getAttribute("cx");
         let dotCY = this.getAttribute("cy");
         let dotYear = data.Year;
         let dotInfla = data.IntentionalHomicides;
         let annotations =addAnotationIH(dotCX,dotCY,dotYear,dotInfla);
         
         const makeAnnotations = d3.annotation()
                 .annotations(annotations);
         svg.append("g")
             .style("font-size", 25)
             .style("font-weight", "bold")
             .call(makeAnnotations);

         d3.select(this)
             .transition()
             .delay(function(d,i){return 100*i;})
             .duration(1000)
             .attr("r", function(){return 20;});
         })
     .on("mouseout", function()
     {
         d3.select(this)
             .attr("r",circleR);
     }
         );       
};

const renderUnempltChart =  function(data, heightT, widthT){
 
 const margin = {top: 100, bottom: 200, left: 200, right: 400};
 let height = heightT;
 let width = widthT;
 const circleR = 5;

 var svg = d3.select("#chartsArea") // 1. Add the SVG to the page and employ 
     .append("svg")
     .attr("width", width*2)
     .attr("height", height)
     .append("g")
     .attr("transform", "translate(" + width/4 + ", 0)"); //show the whole chart including axies.

 var xScale = d3.scaleLinear()
     .domain([d3.min(data, function(d){ return d.Year;}),d3.max(data, function(d){ return d.Year;})])
     .range([0,width*0.5]); // output pix
 var yScale = d3.scaleLinear()
     .domain([0, d3.max(data, function(d){ return d.Unemployment;})])
     .range([height*0.5,30]); // output length

 var line = d3.line() //d3's line generator
     .x(function(data, i) { return xScale(data.Year); }) // set the x values for the line generator
     .y(function(data) { 
         return yScale(data.Unemployment); }) // set the y values for the line generator 
     .curve(d3.curveMonotoneX); // apply smoothing to the line



 svg.append("path")
     .datum(data) // 10. Binds data to the line 
     .attr("class", "line") // Assign a class for styling 
     .attr("d", line);

 svg.append("g")
     .attr("class", "axisStyle") 
     .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
 
 let xAxis = d3.axisBottom(xScale)
     .tickFormat(function(data){
         return data});

 svg.append("g")
     .attr("class", "axisStyle")
     .attr("transform", "translate(0," + 0.5*height + ")")
     .call(xAxis); // Create an axis component with d3.axisBottom

 dotArea =svg.selectAll(".dot")   // 12. Appends a circle for each datapoint 
     .data(data)
     .enter().append("circle") // Uses the enter().append() method
     .attr("class", "dot") // Assign a class for styling
     .attr("cx", function(data, i) {
         return xScale(data.Year) })
     .attr("cy", function(data) {
         return yScale(data.Unemployment)})
     .attr("r", circleR);

 svg.append("text")      // text label for the x axis
     .attr("x",  width/4.5)
     .attr("y",  0.4*(height) + margin.bottom)
     .attr("class", "axisLabelStyle")
     .text("Year");

 svg.append("text")   // text label for y axis
     .attr("dy", "-1em")
     .attr("dx", "-6em")
     .attr("transform", "rotate(-90)")    
     .attr("x", -50)
     .attr("class", "axisLabelStyle")
     .text("Unemployment rate");

 svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2)
     .attr("class", "chartText")
     .text("Unemployment rate");     
 svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2+28)
     .attr("class", "chartText2")
     .text("is the percentage of the total labor force that is unemployed but");
     svg.append("text")   // text label for the title axis
     .attr("x", width*0.3)             
     .attr("y", margin.left*0.2+28+28)
     .attr("class", "chartText2")
     .text("actively seeking employment and willing to work.");    
    
 d3.selectAll("circle")  //add anotation
     .on("mouseover", function(data){
         let dotCX = this.getAttribute("cx");
         let dotCY = this.getAttribute("cy");
         let dotYear = data.Year;
         let dotInfla = data.Unemployment;
         let annotations =addAnotationUem(dotCX,dotCY,dotYear,dotInfla);
         
         const makeAnnotations = d3.annotation()
                 .annotations(annotations);
         svg.append("g")
             .style("font-size", 25)
             .style("font-weight", "bold")
             .call(makeAnnotations);

         d3.select(this)
             .transition()
             .delay(function(d,i){return 100*i;})
             .duration(1000)
             .attr("r", function(){return 20;});
         })
     .on("mouseout", function()
     {
         d3.select(this)
             .attr("r",circleR);
     }
         );       
};

const renderSMChart =  function(data, heightT, widthT){
 
    const margin = {top: 100, bottom: 200, left: 200, right: 400};
    let height = heightT;
    let width = widthT;
    const circleR = 5;
   
    var svg = d3.select("#chartsArea") // 1. Add the SVG to the page and employ 
        .append("svg")
        .attr("width", width*2)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/4 + ", 0)"); //show the whole chart including axies.

   
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.Year;}),d3.max(data, function(d){ return d.Year;})])
        .range([0,width*0.5]); // output pix
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){ return d.SuicideMortality;})])
        .range([height*0.5,30]); // output length
   
    var line = d3.line() //d3's line generator
        .x(function(data, i) { return xScale(data.Year); }) // set the x values for the line generator
        .y(function(data) { 
            return yScale(data.SuicideMortality); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX); // apply smoothing to the line
   
   
   
    svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line);
   
    svg.append("g")
        .attr("class", "axisStyle") 
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
    
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(function(data){
            return data});
   
    svg.append("g")
        .attr("class", "axisStyle")
        .attr("transform", "translate(0," + 0.5*height + ")")
        .call(xAxis); // Create an axis component with d3.axisBottom
   
    dotArea =svg.selectAll(".dot")   // 12. Appends a circle for each datapoint 
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(data, i) {
            return xScale(data.Year) })
        .attr("cy", function(data) {
            return yScale(data.SuicideMortality)})
        .attr("r", circleR);
   
        svg.append("text")      // text label for the x axis
        .attr("x",  width/4.5)
        .attr("y",  0.4*(height) + margin.bottom)
        .attr("class", "axisLabelStyle")
        .text("Year");
   
    svg.append("text")   // text label for y axis
        .attr("dy", "-1em")
        .attr("dx", "-6em")
        .attr("transform", "rotate(-90)")    
        .attr("x", -50)
        .attr("class", "axisLabelStyle")
        .text("Suicide Mortality per 100,000");
   
    svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2)
        .attr("class", "chartText")
        .text("Suicide mortality");     
    svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2+28)
        .attr("class", "chartText2")
        .text("is a major national public health issue in the world. In 2016, suicide");
        svg.append("text")   // text label for the title axis
        .attr("x", width*0.3)             
        .attr("y", margin.left*0.2+28+28)
        .attr("class", "chartText2")
        .text("was the 10th leading cause of death in the U.S. (Wikipedia)");    
       
    d3.selectAll("circle")  //add anotation
        .on("mouseover", function(data){
            let dotCX = this.getAttribute("cx");
            let dotCY = this.getAttribute("cy");
            let dotYear = data.Year;
            let dotInfla = data.SuicideMortality;
            let annotations =addAnotationSM(dotCX,dotCY,dotYear,dotInfla);
            
            const makeAnnotations = d3.annotation()
                    .annotations(annotations);
            svg.append("g")
                .style("font-size", 25)
                .style("font-weight", "bold")
                .call(makeAnnotations);
   
            d3.select(this)
                .transition()
                .delay(function(d,i){return 100*i;})
                .duration(1000)
                .attr("r", function(){return 20;});
            })
        .on("mouseout", function()
        {
            d3.select(this)
                .attr("r",circleR);
        }
            );       
   };





function addAnotationSM(dotCX,dotCY,dotYear,dotInfla){    // Add annotation to the chart
    const annotations = [
        {
            note: {
                title: dotInfla,
                label: "Suicide Mortality"
            },
           
            connector: {
                end: "arrow",        // none, or arrow or dot
                type: "line",       // Line or curve
                endScale: 2,
                lineType : "horizontal",
              },
            color: ["lightGreen"],
            x: dotCX,
            y: dotCY,
            dy: 80,
            dx: 80,
            type: d3.annotationCalloutCircle,
            subject: { radius: 20, radiusPadding: 10 },
        }]
        return annotations;
    }


    
function addAnotationUem(dotCX,dotCY,dotYear,dotInfla){    // Add annotation to the chart
    const annotations = [
        {
            note: {
                title: dotInfla,
                label: "Unemployment Rate"
            },
           
            connector: {
                end: "arrow",        // none, or arrow or dot
                type: "line",       // Line or curve
                endScale: 2,
                lineType : "horizontal",
              },
            color: ["lightGreen"],
            x: dotCX,
            y: dotCY,
            dy: 80,
            dx: 80,
            type: d3.annotationCalloutCircle,
            subject: { radius: 20, radiusPadding: 10 },
        }]
        return annotations;
    }



function addAnotationI(dotCX,dotCY,dotYear,dotInfla){    // Add annotation to the chart
    const annotations = [
        {
            note: {
                title: dotInfla,
                label: "Inflation"
            },
           
            connector: {
                end: "arrow",        // none, or arrow or dot
                type: "line",       // Line or curve
                endScale: 2,
                lineType : "horizontal",
              },
            color: ["lightGreen"],
            x: dotCX,
            y: dotCY,
            dy: 80,
            dx: 80,
            type: d3.annotationCalloutCircle,
            subject: { radius: 20, radiusPadding: 10 },
        }]
        return annotations;
    }




function addAnotationIH(dotCX,dotCY,dotYear,dotInfla){    // Add annotation to the chart
    const annotations = [
        {
            note: {
                title: dotInfla,
                label: "IntentionalHomicides"
            },
            
            connector: {
                end: "arrow",        // none, or arrow or dot
                type: "line",       // Line or curve
                endScale: 2,
                lineType : "horizontal",
                },
            color: ["lightGreen"],
            x: dotCX,
            y: dotCY,
            dy: 80,
            dx: 80,
            type: d3.annotationCalloutCircle,
            subject: { radius: 20, radiusPadding: 10 },
        }]
        return annotations;
    }




function stringToNumber(data){ //convert "string" to "number"
    data.Year = +data.Year;
    data.Inflation = +data.Inflation;
    data.IntentionalHomicides = +data.IntentionalHomicides;
    data.LifeExpectancy= +data.LifeExpectancy;
    data.Population = +data.Population;
    data.SuicideMortality = +data.SuicideMortality;
    data.Unemployment = +data.Unemployment;
    data.HDI = +data.HDI;
}



function sortByYear(a,b){ //objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
    if (a.Year < b.Year){
        return -1;
    }
    if (a.Year > b.Year){
        return 1;
    }
    return 0;
}




function resetBtn(){
    resetZoom.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}
