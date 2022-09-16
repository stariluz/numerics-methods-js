var independentVariableR = 0;
var independentVariableS = 0;

function startCalculations() {
  registerEcuation();
  try {
    getInputs();
  } catch (error) {
    cleanResults();
    return;
  }
  bairstowMethod();
}

function calculateError(currentValue, newValue) {
  var result = ((newValue - currentValue) / newValue) * 100;
  //console.log("SUB::", (upper-lower), ", ADD:",(upper+lower),", RESULT:",result);
  if (result < 0) {
    result *= -1;
  }
  return result;
}
function bairstowMethod() {
  // INPUTS VALIDATIONS
  if (toleratedError < 0.0000001) {
    let error = new Error(
      "ERROR: the tolerated error can't be smaller than 10^-7."
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

  let newValue, tempValue;

  var arrayBCoefficients = [0, 0]; // The B sub n will start in the position 3 of the array
  for (let i = 0; i <= algebraicTermsCounter; i++) {
    tempValue = coefficients[i];
    if (operations[i] == '-') {
      tempValue *= -1;
    }
    newValue =
      tempValue +
      arrayBCoefficients[i + 1] * independentVariableR +
      arrayBCoefficients[i] * independentVariableS;
    arrayBCoefficients.push(newValue);
    console.log('b' + i + ': ', arrayBCoefficients[i + 2]);
  }

  var arrayCCoefficients = [0, 0]; // The C sub n will start in the position 3 of the array
  for (let i = 0; i < algebraicTermsCounter; i++) {
    newValue =
      arrayBCoefficients[i + 2] +
      arrayCCoefficients[i + 1] * independentVariableR +
      arrayCCoefficients[i] * independentVariableS;
    arrayCCoefficients.push(newValue);
    console.log('c' + i + ': ', arrayCCoefficients[i + 2]);
  }

  // for (let iteration = 1; iteration <= iterationsQuantity; iteration++) {
  //   middleValue = (independentVariableR + independentVariableS) / 2;

  //   lowerResult = evaluateEcuation(independentVariableR);
  //   middleResult = evaluateEcuation(middleValue);
  //   decisionFactor = lowerResult * middleResult;

  //   aproximatedError = calculateError(
  //     independentVariableR,
  //     independentVariableS
  //   );

  //   //console.log("LOWER f("+independentVariableR+") = "+lowerResult);
  //   //console.log("MIDDLE f("+middleValue+") = "+middleResult);
  //   //console.log("ERROR  = "+aproximatedError);

  //   renderIterationResults(
  //     iteration,
  //     independentVariableR,
  //     independentVariableS,
  //     middleValue,
  //     lowerResult,
  //     middleResult,
  //     decisionFactor,
  //     aproximatedError
  //   );

  //   if (decisionFactor == 0 || aproximatedError < toleratedError) {
  //     // THE ROOT IS FOUNDED OR THE ERROR IS TOLERATED
  //     break;
  //   } else if (decisionFactor < 0) {
  //     independentVariableS = middleValue;
  //   } else if (decisionFactor > 0) {
  //     independentVariableR = middleValue;
  //   }
  // }
  // console.log("RESULT: ", middleResult);
}

function renderIterationResults(
  iteration,
  independentVariableR,
  independentVariableS,
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
  newCeld.innerHTML = `x<sub>l</sub>=${independentVariableR}<br>
                    x<sub>u</sub>=${independentVariableS}`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `x<sub>r</sub>=${middleValue}<br>`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `f<sub>(${independentVariableR})</sub>=${lowerResult}<br>
                    f<sub>(${middleValue})</sub>=${middleResult}<br>
                    f<sub>(${independentVariableR})</sub>f<sub>(${middleValue})</sub>=${decisionFactor}`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = aproximatedError + '%';
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}

function getInputs() {
  tableResults = document.getElementById('table-results-js');
  table = document.getElementById('table-js');
  tableHeader = document.getElementById('table-header-js');
  toleratedError = document.getElementById('tolerated-error').value;
  independentVariableR = document.getElementById(
    'independient-variable-r'
  ).value;
  independentVariableS = document.getElementById(
    'independient-variable-s'
  ).value;
  if (
    !toleratedError ||
    !independentVariableR ||
    !independentVariableS ||
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

  toleratedError = Number(toleratedError);
  independentVariableR = Number(independentVariableR);
  independentVariableS = Number(independentVariableS);
}

/*TEST CASE:
-2+7x-5x^2+6^3  5   0   1   10
*/
