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

  var ecuationsMatrix = getInputsValues();

  var x = calculateXValues(ecuationsMatrix, 3);

  console.log(ecuationsMatrix);
  printResults(x);
}
function calculateXValues(ecuationsMatrix, n) {
  var factor = 0;
  var x = new Array(n + 1);
  var sumAux = 0;

  for (let k = 1; k < n; k++) {
    for (let i = k + 1; i <= n; i++) {
      factor = ecuationsMatrix[i][k] / ecuationsMatrix[k][k];
      // console.log('FACTOR', factor);
      for (let j = k + 1; j <= n; j++) {
        ecuationsMatrix[i][j] -= factor * ecuationsMatrix[k][j];
      }
      ecuationsMatrix[i][k] = 0;
      ecuationsMatrix[i][0] -= factor * ecuationsMatrix[k][0];
      // console.log(ecuationsMatrix[i]);
    }
  }
  printMatrix('end', ecuationsMatrix);
  x[n] = ecuationsMatrix[n][0] / ecuationsMatrix[n][n];

  for (let i = n - 1; i >= 1; i--) {
    sumAux = ecuationsMatrix[i][0];
    for (let j = i + 1; j <= n; j++) {
      sumAux -= ecuationsMatrix[i][j] * x[j];
    }
    x[i] = sumAux / ecuationsMatrix[i][i];
  }

  x = x.map((xi) => {
    return round(xi, 6);
  });

  return x;
}

function round(number, decimalsQuantity) {
  let temp = 10 ** decimalsQuantity;
  return Math.round((number + Number.EPSILON) * temp) / temp;
}
function printMatrix(identifier, matrix) {
  var matrixTable = document.getElementById(`${identifier}-matrix-table-js`);
  var matrixContent = document.getElementById(`${identifier}-matrix-js`);
  matrixTable.classList.remove('not-visible');
  matrixContent.innerHTML = null;

  var newRow;
  var newCeld;

  newRow = document.createElement('tr');

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[1][1];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[1][2];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[1][3];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[1][0];
  newRow.appendChild(newCeld);

  matrixContent.appendChild(newRow);

  newRow = document.createElement('tr');

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[2][1];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[2][2];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[2][3];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[2][0];
  newRow.appendChild(newCeld);

  matrixContent.appendChild(newRow);

  newRow = document.createElement('tr');

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[3][1];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[3][2];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[3][3];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = matrix[3][0];
  newRow.appendChild(newCeld);

  matrixContent.appendChild(newRow);
}

function printResults(x) {
  var tableResults = document.getElementById('table-results-js');
  tableResults.innerHTML = null;

  var newRow = document.createElement('tr');
  var newCeld = document.createElement('td');

  newCeld.innerHTML = x[1];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = x[2];
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = x[3];
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
