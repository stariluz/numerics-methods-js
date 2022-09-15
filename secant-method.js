var previousValue = 0;
var currentValue = 0;

function calculateError(currentValue, newValue) {
  var result = ((newValue - currentValue) / newValue) * 100;
  //console.log("SUB::", (upper-lower), ", ADD:",(upper+lower),", RESULT:",result);
  if (result < 0) {
    result *= -1;
  }
  return result;
}
function secantMethod() {
  // INPUTS VALIDATIONS
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

  var previousResult = 0;
  var currentResult = 0;
  var newValue = 0;
  var aproximatedError = 0;

  for (let iteration = 1; iteration <= iterationsQuantity; iteration++) {
    previousResult = evaluateEcuation(previousValue);
    currentResult = evaluateEcuation(currentValue);
    newValue =
      currentValue -
      (currentResult * (previousValue - currentValue)) /
        (previousResult - currentResult);

    aproximatedError = calculateError(currentValue, newValue);

    //console.log("LOWER f("+lowerLimit+") = "+lowerResult);
    //console.log("MIDDLE f("+middleValue+") = "+middleResult);
    //console.log("ERROR  = "+aproximatedError);

    renderIterationResults(
      iteration,
      previousValue,
      currentValue,
      newValue,
      previousResult,
      currentResult,
      aproximatedError
    );

    if (aproximatedError < toleratedError) {
      // THE ROOT IS FOUNDED OR THE ERROR IS TOLERATED
      break;
    }
    previousValue = currentValue;
    currentValue = newValue;
  }
  // console.log("RESULT: ", middleResult);
}

function renderIterationResults(
  iteration,
  previousValue,
  currentValue,
  newValue,
  previousResult,
  currentResult,
  aproximatedError
) {
  var newRow = undefined;
  var newCeld = undefined;

  newRow = document.createElement('tr');

  // COLUMN 1
  newCeld = document.createElement('th');
  newCeld.setAttribute('scope', 'row');
  newCeld.innerHTML = iteration;
  newRow.appendChild(newCeld);

  // COLUMN 2
  newCeld = document.createElement('td');
  newCeld.innerHTML = `x<sub>i-1</sub> = ${previousValue}<br>
                    x<sub>i</sub> = ${currentValue}`;
  newRow.appendChild(newCeld);

  // COLUMN 3
  newCeld = document.createElement('td');
  newCeld.innerHTML = `f<sub>(${previousValue})</sub> = ${previousResult}<br>
                    f<sub>(${currentValue})</sub> = ${currentResult}<br>`;
  newRow.appendChild(newCeld);
  // COLUMN 4
  newCeld = document.createElement('td');
  newCeld.innerHTML = `x<sub>i+1</sub> = ${currentValue} - (${currentResult})(${previousValue} ${
    currentValue < 0 ? '+ ' + currentValue * -1 : '- ' + currentValue
  }) / (${previousResult} ${
    currentResult < 0 ? '+ ' + currentResult * -1 : '- ' + currentResult
  }) = <b>${newValue}</b> <br>`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = aproximatedError + '%';
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}

function getInputs(i) {
  tableResults = document.getElementById('table-results-js' + i);
  table = document.getElementById('table-js' + i);
  tableHeader = document.getElementById('table-header-js' + i);
  toleratedError = document.getElementById('tolerated-error').value;
  iterationsQuantity = document.getElementById(
    'iterations-quantity' + i
  )?.value;
  previousValue = document.getElementById('previous-value' + i)?.value;
  currentValue = document.getElementById('current-value' + i)?.value;

  console.log(
    toleratedError,
    iterationsQuantity,
    previousValue,
    currentValue,
    table,
    tableHeader,
    tableResults
  );

  if (
    !toleratedError ||
    !iterationsQuantity ||
    !previousValue ||
    !currentValue ||
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
  previousValue = Number(previousValue);
  currentValue = Number(currentValue);
}

var rootsCounter = 1;
function addRoot() {
  rootsCounter++;

  const rootsContainer = document.getElementById('roots-container-js');

  const newRoot = document.createElement('div');
  newRoot.classList.add('col');
  newRoot.innerHTML = `
  <div class="input-group mb-3">
    <div class="input-group-text">Root ${rootsCounter}</div>
    <div class="form-floating">
      <input type="number" class="form-control" id="iterations-quantity${rootsCounter}" placeholder="Amount of iterations"/>
      <label for="iterations-quantity${rootsCounter}">Amount of iterations</label>
    </div>
    <div class="form-floating">
      <input type="number" class="form-control" id="previous-value${rootsCounter}" placeholder="First previous value"/>
      <label for="previous-value${rootsCounter}">First previous value</label>
    </div>
    <div class="form-floating">
      <input type="number" class="form-control" id="current-value${rootsCounter}" placeholder="First current value"/>
      <label for="current-value${rootsCounter}">First current value</label>
    </div>
  </div>`;
  rootsContainer.appendChild(newRoot);
}
function createTable(counter) {
  var newTable = document.getElementById(`table-js${counter}`);
  if (newTable != undefined) {
    //THE TABLE ALREADY EXISTS
    return;
  }
  const tablesContainer = document.getElementById('tables-container-js');
  // console.log(tablesContainer);

  newTable = document.createElement('table');
  newTable.classList.add('table', 'table-striped', 'transition', 'mb-4');
  newTable.id = `table-js${counter}`;
  newTable.innerHTML = `
  
  <thead id="table-header-js${counter}">
      <tr>
        <th colspan="5" class="table-header">Root ${counter}</th>
      </tr>
      <tr>
          <td scope="col">It.</td>
          <td scope="col">Limits</td>
          <td scope="col">Aproximation</td>
          <td scope="col">Operations</td>
          <td scope="col">Error</td>
      </tr>
  </thead>
  <tbody id="table-results-js${counter}">
  </tbody>`;
  // console.log(newTable);
  tablesContainer.appendChild(newTable);
}

function startCalculations() {
  registerEcuation();
  try {
    getInputs(1);
  } catch (error) {
    cleanResults();
    return;
  }
  secantMethod();
  for (let i = 2; i <= rootsCounter; i++) {
    console.log('I WILL ADD MORE ROOTS');
    createTable(i);
    try {
      getInputs(i);
    } catch (error) {
      cleanResults();
      return;
    }
    secantMethod();
  }
}
