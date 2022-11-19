function startCalculations() {
  function getInputsValues() {
    function getField(row, column) {
      return Number(document.getElementById(`${row}-a${column}`).value);
    }

    var ecuationsMatrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        ecuationsMatrix[i][j] = getField(i, j);
      }
    }
    // console.log(ecuationsMatrix);

    return ecuationsMatrix;
  }
  function getErrorValue(){
    return  Number(document.getElementById(`error-js`).value);
  }

  cleanIterations();

  var ecuationsMatrix = getInputsValues();
  var toleratedError=getErrorValue();

  console.log(ecuationsMatrix);
  var x = getXValuesWithGaussSeidelMethod(ecuationsMatrix, 3, toleratedError);

  printResults(x); // Show in the page the final results
}
function getXValuesWithGaussSeidelMethod(coeficientsMatrix, numberOfUnknownsX, toleratedError) {
  var iterationsCounter = 0;
  var x = new Array(numberOfUnknownsX + 1);
  var old_x = new Array(numberOfUnknownsX + 1);
  var aproximatedErrorOfX = new Array(numberOfUnknownsX + 1);

  // Set initial values of x in 0s;
  for(let i=1; i<=numberOfUnknownsX; i++){
    x[i]=Number(0);
  }
  
  do{
    iterationsCounter++;
    for(let i=1; i<=numberOfUnknownsX; i++){
      old_x[i]=x[i];
      x[i]=coeficientsMatrix[i][0];

      for(let j=1; j<=numberOfUnknownsX; j++){
        if(j==i) continue;
        x[i]-=(coeficientsMatrix[i][j]*x[j]);
      }

      x[i]/=coeficientsMatrix[i][i];

      aproximatedErrorOfX[i]=(x[i]-old_x[i])/x[i]*100;
    }
    printIterationValues(iterationsCounter, x, aproximatedErrorOfX);
  }while(
    aproximatedErrorOfX[1]>toleratedError
    ||aproximatedErrorOfX[2]>toleratedError
    ||aproximatedErrorOfX[3]>toleratedError
  );

  // Round all final values of X's to 6 digits
  x = x.map((xi) => {
    return round(xi, 6);
  });

  return x;
}


function round(number, decimalsQuantity) {
  /* Round function: Request a number and a decimals quantity number, and return the number rounded to that quantity of decimals */
  let temp = 10 ** decimalsQuantity;
  return Math.round((number + Number.EPSILON) * temp) / temp;
}

function cleanIterations() {
  /* Clean old iterations from past executions */
  var tableIterations = document.getElementById('iterations-table-content-js');
  tableIterations.innerHTML=null;
}
function printIterationValues(iterationNumber, x, aproximatedErrorOfX) {
  
  x = x.map((xi) => {
    return round(xi, 6);
  });
  
  aproximatedErrorOfX = aproximatedErrorOfX.map((error_i) => {
    return round(error_i, 6);
  });
  var tableIterations = document.getElementById('iterations-table-content-js');

  var newRow = document.createElement('tr');
  var newCeld;

  newCeld = document.createElement('th');
  newCeld.innerHTML = iterationNumber;
  newRow.appendChild(newCeld);

  for(let i=1; i<x.length; i++){

    /* Print the value of the x_i */
    newCeld = document.createElement('td');
    newCeld.innerHTML = x[i];
    newRow.appendChild(newCeld);

    /* Print the value of the aproximated error of the x_i */
    newCeld = document.createElement('td');
    newCeld.innerHTML = aproximatedErrorOfX[i]+"%";
    newRow.appendChild(newCeld);
  }

  tableIterations.appendChild(newRow);
}

function printResults(x) {
  var tableResults = document.getElementById('results-table-content-js');
  tableResults.innerHTML = null;

  var newRow = document.createElement('tr');
  var newCeld;

  for(let i=1; i<x.length; i++){
    newCeld = document.createElement('td');
    newCeld.innerHTML = x[i];
    newRow.appendChild(newCeld);
  }

  tableResults.appendChild(newRow);
}
