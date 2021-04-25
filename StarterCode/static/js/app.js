
function buildData(sample){
  d3.json("./samples.json").then((bbData) =>{
    //console.log(bbData);
    var data = bbData.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = data.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    //  Demographic Data 
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    var demographicData = d3.select('#sample-metadata');

    // clear demographic data
    demographicData.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });


    // BONUS: Build the Gauge Chart
    buildGauge(result.wfreq);
  });
}

function buildChart(sample){
  d3.json("./samples.json").then((bbData)=>{
    var sample = bbData.samples;
    // Filter the data for the object with the desired sample number
    var resultArray = sample.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otuId = result.otu_ids;
    var sampleValues = result.sample_values;
    var otuLabels = result.otu_labels;


    // The bubble chart 

    // Set up trace
    trace2 = {
      x: sample,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuId,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    }

    var bubbleData = [trace2];

    var layout = {
      title: 'OTU Frequency',
      margin:{t: 0},
      hovermode:"closest",
      xaxis:{title:"OTU ID"},
      margin: {t:30}
    };

      // create the bubble plot
    Plotly.newPlot("bubble", bubbleData, layout);

    //horizontal bar chart

    // Top 10 data for horizontal bar chart
    var otuTop10 = sample.slice(0, 10).reverse();
    var topTenFreq = sampleValues.slice(0, 10).reverse();
    var labels = data.samples[0].otu_labels.slice(0, 10).reverse();
    var otuIdTop10 = otuTop10.map((d => "OTU " + d));
    var reversedLabels = otuIdTop10.reverse();

    // create trace variable for the plot
    var trace1 = {
      x: topTenFreq,
      y: reversedLabels,
      text: labels,
      name: "",
      type: "bar",
      orientation: "h"
    };
    
    // create layout variable to set plots layout
    var barData = [trace1];
    
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 150,
        t: 30
      }
    };
    
    // create the bar plot
    Plotly.newPlot("bar", barData, layout);   

  });
} 
function init(){
 
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./samples.json").then((bbData)=>{
    var sampleNames = bbData.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }); 
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
