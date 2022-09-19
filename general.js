// Ecuation variables
var ecuation = '';
var operations = ['+'];
var coefficients = [0];
var exponents = [0];
// var operationIt=0;
// var coefficientIt=0;
var algebraicTermsCounter = 0;

// Limits
var iterationsQuantity = 0;
var toleratedError = 0.0;

var table, tableHeader, tableResults;

function registerEcuation() {
  ecuation = document.getElementById('ecuation').value;
  try {
    if (!ecuation) {
      let error = new Error('ERROR: please enter all the fields.');
      renderOperationError(error);
      throw error;
    }
  } catch (error) {
    return;
  }

  // RESTART FIRST DATA
  algebraicTermsCounter = 0;
  operations = ['+'];
  coefficients = [0];
  exponents = [0];

  for (let i = 0; i < ecuation.length; i++) {
    if (ecuation[i] == 'x') {
      if (
        (coefficients[algebraicTermsCounter] == 0 ||
          coefficients[algebraicTermsCounter] == undefined) &&
        isNaN(ecuation[i - 1])
      ) {
        coefficients[algebraicTermsCounter] = 1;
      }
      exponents[algebraicTermsCounter] = 1;
    } else if (ecuation[i] == '^') {
      i++;
      exponents[algebraicTermsCounter] = 0;
      while (!isNaN(ecuation[i])) {
        exponents[algebraicTermsCounter] =
          exponents[algebraicTermsCounter] * 10;
        exponents[algebraicTermsCounter] += Number(ecuation[i]);
        i++;
      }
      // console.log("EXPONENT "+algebraicTermsCounter+":", exponents[algebraicTermsCounter]);
      i--;
    } else if (ecuation[i] == '.') {
      i++;
      let decimalCoefficient = 0;
      let counter = 1;
      while (!isNaN(ecuation[i])) {
        decimalCoefficient = Number(ecuation[i]) * 10 ** -counter;
        coefficients[algebraicTermsCounter] =
          coefficients[algebraicTermsCounter] + decimalCoefficient;
        i++;
        counter++;
      }
      i--;
    } else if (isNaN(ecuation[i])) {
      algebraicTermsCounter++;
      operations[algebraicTermsCounter] = ecuation[i];
      // console.log('NAN: ' + ecuation[i]);
    } else {
      coefficients[algebraicTermsCounter] = 0;
      exponents[algebraicTermsCounter] = 0;
      while (!isNaN(ecuation[i])) {
        coefficients[algebraicTermsCounter] =
          coefficients[algebraicTermsCounter] * 10;
        coefficients[algebraicTermsCounter] += Number(ecuation[i]);
        i++;
      }
      // console.log("NUMBER "+algebraicTermsCounter+":", coefficients[algebraicTermsCounter]);
      i--;
    }
  }

  reduceEcuation();

  // TEST OF CORRECT BUCKET OF OPERATIONS
  for (let i = 0; i <= algebraicTermsCounter; i++) {
    console.log(
      '   ' + operations[i] + ' ' + coefficients[i] + 'x^' + exponents[i]
    );
  }
}

function reduceEcuation() {
  for (let i = 0; i <= algebraicTermsCounter; i++) {
    if (coefficients[i] == 0) {
      operations.splice(i, 1);
      coefficients.splice(i, 1);
      exponents.splice(i, 1);
      i--;
      algebraicTermsCounter--;
    } else if (operations[i] === '-') {
      coefficients[i] *= -1;
      operations[i] = '+';
    }
  }
}

var memoryEvaluatedFunctionResults = {};
function evaluateEcuation(variable) {
  if (memoryEvaluatedFunctionResults[variable] !== undefined) {
    //console.log("ALREADY EXISTS.")
    return memoryEvaluatedFunctionResults[variable];
  }
  var collector = 0;
  var evaluatedValue = 0;
  for (let i = 0; i <= algebraicTermsCounter; i++) {
    evaluatedValue = coefficients[i] * variable ** exponents[i];
    //console.log("\t"+coefficients[i]+"*"+variable+"^"+exponents[i]+"="+evaluatedValue);
    if (operations[i] == '+') {
      collector += evaluatedValue;
    } else if (operations[i] == '-') {
      collector -= evaluatedValue;
    } else if (operations[i] == '*') {
      collector *= evaluatedValue;
    } else if (operations[i] == '/') {
      collector /= evaluatedValue;
    } else {
      throw Error(
        'ERROR: the ecuation is not an extended polynomial or is not in the specified format.'
      );
    }
  }
  memoryEvaluatedFunctionResults[variable] = collector;
  return collector;
  // console.log("f("+variable+") = "+collector);
}

function cleanResults() {
  // tableResults = document.getElementById('table-results-js');
  tableResults.innerHTML = null;
}

function chargeToast() {
  const toastTrigger = document.getElementById('liveToastBtn');
  const toastLiveExample = document.getElementById('liveToast');
  if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
      const toast = new bootstrap.Toast(toastLiveExample);

      toast.show();
    });
  }
}

var errorCounter;
function renderOperationError(error) {
  // const toast = document.getElementById(`error-${errorCounter++}`)

  const errorContainer = document.getElementById('error-js');

  const newError = document.createElement('div');
  newError.classList.add('toast');
  newError.classList.add('text-bg-danger');
  newError.id = `error-${errorCounter++}`;
  newError.setAttribute('role', 'alert');
  newError.setAttribute('aria-live', '');
  newError.setAttribute('aria-atomic', 'true');
  newError.setAttribute('data-bs-delay', '10000');
  newError.innerHTML = `
        <div class="toast-header">
            <img src="./img/error.png" class="error-icon rounded me-2" alt="Error icon" >
            <strong class="me-auto">A problem founded was founded :( </strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${error.message}
        </div>
    `;
  // console.log(newError);
  const toast = new bootstrap.Toast(newError);
  errorContainer.appendChild(newError);
  toast.show();

  // errorContainer.classList.add('error-display');
  // errorContainer.innerHTML=error.message;
}

function cleanOperationError() {
  const errorContainer = document.getElementById('error-js');
  errorContainer.innerHTML = null;
}
