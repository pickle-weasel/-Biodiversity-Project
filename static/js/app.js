function buildMetadata(sample) {

// @TODO: Complete the following function that builds the metadata panel

// Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata")
  // Use `.html("") to clear any existing metadata
    .html("")
    .append("table");
  // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(data).forEach(([key, value]) => {
      d3.select("table")
      .append("tr")
      .append("td")
      .text(`${key}: ${value}`);
        });
        
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
});
}

function buildCharts(sample) {

// @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    console.log(data)

    var otuIds = data.otu_ids;
    var idsSorted = otuIds.slice(0);
    idsSorted.sort(function(a,b) {
      return b - a
      });
    console.log(otuIds);
    console.log(idsSorted);
    console.log(idsSorted.slice(0, 10));

    var otuLabels = data.otu_labels;
    var labelsSorted = otuLabels.slice(0);
    labelsSorted.sort(function(a,b) {
      return b - a
      });
    console.log(labelsSorted.slice(0, 10))

    var sampleValues = data.sample_values;
    // console.log(sample_values);
    var valuesSorted = sampleValues.slice(0);
    valuesSorted.sort(function(a,b) {
      return b - a
      });
    console.log(valuesSorted.slice(0, 10));

  
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        colorscale: "Earth",
        size: sampleValues,
        sizeref: 1.2
        },
      };

    var data = [trace1];

    var layout = {
      title: `BB Sample ${sample}`,
      showlegend: false
      };

    Plotly.newPlot("bubble", data, layout);

// });
  

  // @TODO: Build a Pie Chart
  
  var data = [{
    values: valuesSorted.slice(0, 10),
    labels: idsSorted.slice(0, 10),
    type: "pie",
    hoverinfo: labelsSorted.slice(0, 10)
    }];

  var layout = {
    height: 500,
    width: 500
  }

  Plotly.newPlot("pie", data, layout); 
});
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
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
