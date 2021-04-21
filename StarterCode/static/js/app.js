
d3.json("./samples.json").then((bbData) =>{
      console.log(bbData);
    var data = bbData;

    var idList = data.names;
    for (var i = 0; i< idList.length; i++){
        selectBox = d3.select("#selDataset");
        selectBox.append("option").text(idList[i]);
        
    }
    // Set up default plot
  updatePlots(0)

   
  function updatePlots(index) {

    // horizontal bar chart & gauge chart
    var sample = data.samples[index].otu_ids;
    console.log(sample);
    var sampleValues = data.samples[index].sample_values;
    var otuLabels = data.samples[index].otu_labels;

    var washFrequency = data.metadata[+index].wfreq;
    console.log(washFrequency);


    //  Demographic Data 
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    var demographicData = d3.select('#sample-metadata');

    // clear demographic data
    demographicData.html("");

    for (var i = 0; i < demoKeys.length; i++) {

      demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
    };


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
        l: 75,
        r: 75,
        t: 75,
        b: 50
      }
    };

    // create the bar plot
    Plotly.newPlot("bar", barData, layout);

   // The bubble chart 

    // Set up trace
    trace2 = {
      x: sample,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: sample,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    }

    var bubbleData = [trace2];

    var layout = {
      title: 'OTU Frequency',
      showlegend: false,
      height: 600,
      width: 930
    }

      // create the bubble plot
    Plotly.newPlot("bubble", bubbleData, layout)

    // Gauge chart

    var trace3 = [{
      domain: {x: [0, 1], y: [0,1]},
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Washes Per Week" },
      gauge: {
        axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
        bar: { color: "#669999" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "transparent",
        steps: [
          { range: [0, 1], color: "#fff" },
          { range: [1, 2], color: "#e6fff5" },
          { range: [2, 3], color: "ccffeb" },
          { range: [3, 4], color: "b3ffe0" },
          { range: [4, 5], color: "#99ffd6" },
          { range: [5, 6], color: "#80ffcc" },
          { range: [6, 7], color: "#66ffc2" },
          { range: [7, 8], color: "#4dffb8" },
          { range: [8, 9], color: "#33ffad" }

        ],
      }
    }];

    gaugeData = trace3;

    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", gaugeData, layout);

  }

  // On button click, call refreshData()
  d3.selectAll("#selDataset").on("change", refreshData);



  function refreshData() {
    var dropdownMenu = d3.select("#selDataset");
    var personsID = dropdownMenu.property("value");
    console.log(personsID);
    console.log(data)

    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        updatePlots(i);
        return
      }
    }
  }

});
