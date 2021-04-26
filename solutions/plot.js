
function init(){
 
    // Grab a reference to the dropdown select element
    var dropdown = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data)=>{
      console.log(data);
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    })}

  // Initialize the dashboard
  init(); 

function optionChanged(newSample){
    getInfo(newSample);
    getBarChart(newSample);
    getGaugeChart(newSample);
    getBubbleChart(newSample);      
  }

  //  demographic information
function getInfo(sample) {
    d3.json("samples.json").then((data)=> {
        
      // Display the sample metadata
      var metadata = data.metadata;
      // filter meta data info by id
      var resultArray = metadata.filter(sampleId => sampleId.id==sample);
      var result = resultArray[0];
      var demoInfo = d3.select("#sample-metadata");
        
      demoInfo.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        demoInfo.append("h6").text(`${key.toUpperCase()}: ${value}`);
      })
    });
  }

function getBarChart(sample) {
    d3.json("samples.json").then((data) => {
      console.log(data)
  
      var resultArray = data.samples.filter(sampleId => sampleId.id==sample);
      var result = resultArray[0];
  
    // Filter the data for the object with the desired sample number
    //horizontal bar chart
  
      // Top 10 data for horizontal bar chart
  
    var sampleValues = (result.sample_values.slice(0, 10)).reverse();
    var otuTop10 = (result.otu_ids.slice(0, 10)).reverse(); 
    var otuIdTop10 = otuTop10.map((d => "OTU " + d));
    var labels = result.otu_labels.slice(0, 10).reverse();
    var reversedLabels = otuIdTop10.reverse();
  
  
    // create trace variable for the plot
    var trace1 = {
      x: sampleValues,
      y: reversedLabels,
      text: labels,
      name: "Top 10",
      type: "bar",
      orientation: "h"
    };
    
    var barData = [trace1];  
    // create layout variable to set plots layout
     
    var layout = {
      title: "Top 10 OTUs",
    };  
  
    // create the bar plot
    Plotly.newPlot("bar", barData, layout);   
    }); 
} 
    
    // The bubble chart 
function getGaugeChart(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;    
        var resultArray = metadata.filter(sampleId => sampleId.id==sample);
        //var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var result = resultArray[0];
        var wfreq = result.wfreq;
        
        var trace2 = [{
            domain: { x: [0, 1], y: [0, 1]},
            value: wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b> <br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { range: [null, 9], tickwidth: 2, tickmode: "linear" },
              bar: { color: "rbga(0, 128, 0, .8)" },
              steps:
                [
                  { range: [0, 1], color: "rgba(0, 128, 128, .05 )" },
                  { range: [1, 2], color: "rgba(0, 128, 128, .1)" },
                  { range: [2, 3], color: "rgba(0, 128, 128, .2)" },
                  { range: [3, 4], color: "rgba(0, 128, 128, .3)" },
                  { range: [4, 5], color: "rgba(0, 128, 128, .4)" },
                  { range: [5, 6], color: "rgba(0, 128, 128, .5)" },
                  { range: [6, 7], color: "rgba(0, 128, 128, .6)" },
                  { range: [7, 8], color: "rgba(0, 128, 128, .7)" },
                  { range: [8, 9], color: "rgba(0, 128, 128, .8)" },
                ],
              threshold: {
                line: { color: "purple", width: 7 },
                thickness: .75,
                value: wfreq
              }
            }
          }
        ];


        var layout = {
            width :600,
            height : 500,
            margin: {
                t:0,
                b: 0
            }

        };
        Plotly.newPlot("gauge",trace2,layout)
    }); 
        
}
function getBubbleChart(sample){
    d3.json("samples.json").then((data) => {
        console.log(data)
    
        var resultArray = data.samples.filter(sampleId => sampleId.id==sample);
        var result = resultArray[0];
        var otuIds = result.otu_ids.map(ids => {
            return ids;
        }).reverse();

        var sampleValues = result.sample_values.reverse();
        var labels = result.otu_labels.reverse();

        // Set up trace
        var trace3 = {
            x: otuIds,
            y: sampleValues,
            text: labels,
            mode: 'markers',
            marker: {
            color: otuIds,
            opacity: [1, 0.8, 0.6, 0.4],
            size: sampleValues
            }
        };
        var Data = [trace3];
        var layout = {
            title: 'OTU Frequency',
            height:600,
            width:1000
          };
                // create the bubble plot
        Plotly.newPlot("bubble", Data, layout)
    });

}
  

  

  

  

  

