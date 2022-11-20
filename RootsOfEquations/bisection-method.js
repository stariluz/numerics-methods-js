var lowerLimit = 0.0;
var upperLimit = 1.0;

function renderIterationResults(
  iteration,
  lowerLimit,
  upperLimit,
  middleValue,
  lowerResult,
  middleResult,
  decisionFactor,
  aproximatedError
) {
  var newRow = undefined;
  var newCeld = undefined;

  newRow = document.createElement('tr');
  // if(iteration%2==0){
  //     newRow.setAttribute("class", "table-light");
  // }

  newCeld = document.createElement('th');
  newCeld.setAttribute('scope', 'row');
  newCeld.innerHTML = iteration;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `x<sub>l</sub>=${lowerLimit}<br>
                    x<sub>u</sub>=${upperLimit}`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `x<sub>r</sub>=${middleValue}<br>`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `f<sub>(${lowerLimit})</sub>=${lowerResult}<br>
                    f<sub>(${middleValue})</sub>=${middleResult}<br>
                    f<sub>(${lowerLimit})</sub>f<sub>(${middleValue})</sub>=${decisionFactor}`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = aproximatedError + '%';
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
function calculateError(lower, upper) {
  var result = ((upper - lower) / (upper + lower)) * 100;
  //console.log("SUB::", (upper-lower), ", ADD:",(upper+lower),", RESULT:",result);
  if (result < 0) {
    result *= -1;
  }
  return result;
}
function bisectionMethod() {
  // INPUTS VALIDATIONS
  if (upperLimit <= lowerLimit) {
    let error = new Error('ERROR: lower limit is higher than the upper limit.');
    throw error;
  }
  if (toleratedError < 0.0000001) {
    let error = new Error(
      "ERROR: the tolerated error can't be smaller than 10^-7."
    );
    throw error;
  }
  if (iterationsQuantity < 0 || iterationsQuantity > 10 ** 7) {
    let error = new Error(
      "ERROR: the iterations quantity can't be greater than 10^7."
    );
    throw error;
  }

  cleanOperationError();
  cleanResults();

  table.classList.add('displayed');

  var middleValue = 0;
  var lowerResult = 0;
  var middleResult = 0;
  var decisionFactor = 0;
  var aproximatedError = 0;

  for (let iteration = 1; iteration <= iterationsQuantity; iteration++) {
    middleValue = (lowerLimit + upperLimit) / 2;

    lowerResult = evaluateEcuation(lowerLimit);
    middleResult = evaluateEcuation(middleValue);
    decisionFactor = lowerResult * middleResult;

    aproximatedError = calculateError(lowerLimit, upperLimit);

    //console.log("LOWER f("+lowerLimit+") = "+lowerResult);
    //console.log("MIDDLE f("+middleValue+") = "+middleResult);
    //console.log("ERROR  = "+aproximatedError);

    renderIterationResults(
      iteration,
      lowerLimit,
      upperLimit,
      middleValue,
      lowerResult,
      middleResult,
      decisionFactor,
      aproximatedError
    );

    if (decisionFactor == 0 || aproximatedError < toleratedError) {
      // THE ROOT IS FOUNDED OR THE ERROR IS TOLERATED
      break;
    } else if (decisionFactor < 0) {
      upperLimit = middleValue;
    } else if (decisionFactor > 0) {
      lowerLimit = middleValue;
    }
  }
  // console.log("RESULT: ", middleResult);
}

function getInputs() {
  tableResults = document.getElementById('table-results-js');
  table = document.getElementById('table-js');
  tableHeader = document.getElementById('table-header-js');
  iterationsQuantity = document.getElementById('iterations-quantity').value;
  toleratedError = document.getElementById('tolerated-error').value;
  lowerLimit = document.getElementById('lower-limit').value;
  upperLimit = document.getElementById('upper-limit').value;
  console.log('getInputs');
  if (
    !iterationsQuantity ||
    !toleratedError ||
    !lowerLimit ||
    !upperLimit ||
    tableResults === undefined ||
    table === undefined ||
    tableHeader === undefined
  ) {
    // HIDE AND EMPTY THE TABLE
    table.classList.remove('displayed');
    setTimeout(() => {
      tableResults.innerHTML = null;
    }, 1000);

    // SHOW AND TRHOW THE ERROR
    let error = new Error('ERROR: please enter all the fields.');
    renderOperationError(error);
    throw error;
  }

  iterationsQuantity = Number(iterationsQuantity);
  toleratedError = Number(toleratedError);
  lowerLimit = Number(lowerLimit);
  upperLimit = Number(upperLimit);
}

/*TEST CASE:
-2+7x-5x^2+6^3  5   0   1   10
*/

function startCalculations() {
  registerEcuation();
  try {
    getInputs();
  } catch (error) {
    cleanResults();
    return;
  }
  bisectionMethod();
}
