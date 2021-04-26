function buildplot(sample) {
  d3.json("data/samples.json").then((data) => {
    console.log(data)

    var wfreq = data.metadata.map(d =>d.wfreq)
    console.log(`Wfreq:${wfreq}`)
  })

  // Filter the data for the object with the desired sample number
  //var samples = data.samples.filter(sampleObj=> sampleObj.id == sample);
  var samples = data.samples[index].otu_ids;
  console.log(samples);

  //horizontal bar chart

    // Top 10 data for horizontal bar chart

  var sampleValues = (samples.sample_values.slice(0, 10)).reverse();
  var otuTop10 = (samples.otu_ids.slice(0, 10)).reverse(); 
  var otuIdTop10 = otuTop10.map((d => "OTU " + d));
  var labels = samples.otu_labels.slice(0, 10).reverse();
  var reversedLabels = otuIdTop10.reverse();


  // create trace variable for the plot
  var trace1 = {
    x: sampleValues,
    y: reversedLabels,
    text: labels,
    name: "",
    type: "bar",
    orientation: "h"
  };
  var barData = [trace1];  
  // create layout variable to set plots layout
   
  var layout = {
    title: "Top 10 OTUs",
    margin: {
      l: 100,
      r:100,
      t: 100,
      b:30
    }
  };  

  // create the bar plot
  Plotly.newPlot("bar", barData, layout);   
       

  // The bubble chart 

  // Set up trace
  var trace2 = {
      x: samples.otu_ids,
      y: samples.sample_values,
      text: samples.otu_labels,
      mode: 'markers',
      marker: {
        color: otuId,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    };

    var bubbleData = [trace2];

    var layout = {
      title: 'OTU Frequency',
      height:600,
      width:1000
    };

      // create the bubble plot
    Plotly.newPlot("bubble", bubbleData, layout);

  //  demographic information
function getInfo(id) {
  d3.json("data/samples.json").then((data)=> {
      
    // Display the sample metadata
    var metadata = data.metadata;

    console.log(metadata)

    // filter meta data info by id
    var result = metadata.filter(meta => meta.id.toString() === id)[0];

    var demoInfo = d3.select("#sample-metadata");
      
    demoInfo.html("");

    Object.entries(result).forEach(([key, value]) => {
      demoInfo.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
   
function optionChanged(id) {
  // Fetch new data each time a new sample is selected
  getPlot(id);
  getInfo(id);
}  
    

function init(){
 
  // Grab a reference to the dropdown select element
  var dropdown = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data)=>{
    console.log(data)
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    getPlot(firstSample);
    getInfo(firstSample);
  }); 
}


// Initialize the dashboard
init();
}