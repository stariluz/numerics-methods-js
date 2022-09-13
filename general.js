// Ecuation variables
var ecuation = '';
var operations = ['+'];
var coefficients = [0];
var exponents = [0];
// var operationIt=0;
// var coefficientIt=0;
var it = 0;

// Limits
var iterationsQuantity = 0;
var toleratedError = 0.0;
var lowerLimit = 0.0;
var upperLimit = 1.0;

var table, tableHeader, tableResults;

function registerEcuation() {
  try {
    getInputs();
  } catch (error) {
    return;
  }
  it = 0;
  operations = ['+'];
  coefficients = [0];
  exponents = [0];

  for (let i = 0; i < ecuation.length; i++) {
    if (ecuation[i] == 'x') {
      exponents[it] = 1;
    } else if (ecuation[i] == '^') {
      i++;
      exponents[it] = 0;
      while (!isNaN(ecuation[i])) {
        exponents[it] = exponents[it] * 10;
        exponents[it] += Number(ecuation[i]);
        i++;
      }
      // console.log("EXPONENT "+it+":", exponents[it]);
      i--;
    } else if (isNaN(ecuation[i])) {
      it++;
      operations[it] = ecuation[i];
      // console.log("OPERATION "+it+":", operations[it]);
    } else {
      coefficients[it] = 0;
      exponents[it] = 0;
      while (!isNaN(ecuation[i])) {
        coefficients[it] = coefficients[it] * 10;
        coefficients[it] += Number(ecuation[i]);
        i++;
      }
      // console.log("NUMBER "+it+":", coefficients[it]);
      i--;
    }
  }
  bisectionMethod();
  // TEST OF CORRECT BUCKET OF OPERATIONS
  // for(let i=0; i<=it; i++){
  //     console.log('   '+operations[i]+' '+ coefficients[i]+'^'+ exponents[i]);
  // }
  // testFunctions();
}

var memoryEvaluatedFunctionResults = {};
function evaluateEcuation(variable) {
  if (memoryEvaluatedFunctionResults[variable] !== undefined) {
    //console.log("ALREADY EXISTS.")
    return memoryEvaluatedFunctionResults[variable];
  }
  var collector = 0;
  var evaluatedValue = 0;
  for (let i = 0; i <= it; i++) {
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

function getInputs() {
  tableResults = document.getElementById('table-results-js');
  table = document.getElementById('table-js');
  tableHeader = document.getElementById('table-header-js');
  ecuation = document.getElementById('ecuation').value;
  iterationsQuantity = document.getElementById('iterations-quantity').value;
  toleratedError = document.getElementById('tolerated-error').value;
  lowerLimit = document.getElementById('lower-limit').value;
  upperLimit = document.getElementById('upper-limit').value;

  table.classList.remove('displayed');

  if (
    !ecuation ||
    !iterationsQuantity ||
    !toleratedError ||
    !lowerLimit ||
    !upperLimit ||
    tableResults === undefined ||
    table === undefined ||
    tableHeader === undefined
  ) {
    setTimeout(() => {
      tableResults.innerHTML = null;
    }, 1000);
    // console.log("ERROR")
    let error = new Error('ERROR: please enter all the fields.');
    renderError(error);
    throw error;
  }

  iterationsQuantity = Number(iterationsQuantity);
  toleratedError = Number(toleratedError);
  lowerLimit = Number(lowerLimit);
  upperLimit = Number(upperLimit);
}

function cleanResults() {
  tableResults = document.getElementById('table-results-js');
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
function renderError(error) {
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
  console.log(newError);
  const toast = new bootstrap.Toast(newError);
  errorContainer.appendChild(newError);
  toast.show();

  // errorContainer.classList.add('error-display');
  // errorContainer.innerHTML=error.message;
}
function cleanError() {
  const errorContainer = document.getElementById('error-js');
  errorContainer.innerHTML = null;
}
