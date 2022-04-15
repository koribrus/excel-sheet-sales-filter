"use strict";

const form = document.querySelector("#form");

console.log("v6");
// model.createInvArray();

let header = "";

// --- Functions ---
//  Convert text string to array
const textToArray = function (string) {
  header = string.slice(0, string.indexOf("\n")).split(",");
  const rows = string.slice(string.indexOf("\n") + 1).split("\n");

  const arr = rows.map((row) => {
    //   split data rows into arrays of strings
    const splitRows = row.split(",");

    // split each string element into [entry, values] pairs
    const objArr = splitRows.map((el, i) => {
      const obj = [header[i], el];
      return obj;
    });

    // convert [entry, value] pairs to {'entry': 'value'} objects
    const array = Object.fromEntries(objArr);

    return array;
  });
  return arr;
};

const arrayToCSVString = function (LTOs, header) {
  const string = [
    header,
    ...LTOs.map((item) => [
      item["Product Sub-Category"],
      item["Product Class"],
      item["SKU"],
      item["Product Name"],
      item["Wholesale Price"],
      item["Price Promotion Amt"],
      item["Final Wholesale Price"],
      item["Packaging"],
      item[""],
      item["Country"],
      item["Agent Name\r"],
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  return string;
};

// Controlled event
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("CSV file submitted");

  const input = invFile.files[0];
  const input2 = ltoFile.files[0];
  console.log(input);
  console.log(input2);

  // FileReader is a JS Object that asynchronously reads the contents of files
  const reader = new FileReader();

  // Reads content of input
  reader.readAsText(input);

  // function uses reader to read CSV file to text and convert text to array once file has been loaded.
  reader.addEventListener("load", function (e) {
    //  The function takes the submit event target (the csv file) and stores the result to variable 'text'
    console.log(e);
    const textInv = e.target.result;

    // convert text string to array of objects
    const dataInv = textToArray(textInv);
    // console.log(data);

    // write data to browswer screen
    // document.write(JSON.stringify(data));

    // Search data array for desired value and create final data array
    // const LTOs = [];

    const readerInv = new FileReader();
    readerInv.readAsText(input2);

    readerInv.addEventListener("load", function (e) {
      console.log(e);
      const textLTO = e.target.result;

      const data = textToArray(textLTO);
      data.pop();
      console.log(dataInv);
      console.log(data);

      const LTOinInv = [];

      data.forEach((obj) => {
        dataInv.forEach((inv) => {
          if (obj["SKU"] === inv["SKU"]) {
            LTOinInv.push(obj);
          }
        });
      });

      console.log(LTOinInv);
      // create a csv String
      const csvFile = arrayToCSVString(LTOinInv, header);

      const myFile = new File([csvFile], "demo.txt", {
        type: "text/plain;charset=utf-8",
      });
      saveAs(myFile);
    });
  });
});
