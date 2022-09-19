var parameterR = 0;
var parameterS = 0;
/*+ 2x^6+x^5-3.5x^4+2.75x^3+2.125x^2-3.875x+1.25 */
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

function calculateError(newValue, deltaValue) {
  var result = (deltaValue / newValue) * 100;
  //console.log("SUB::", (upper-lower), ", ADD:",(upper+lower),", RESULT:",result);
  if (result < 0) {
    result *= -1;
  }
  return result;
}
function round(number, decimalsQuantity) {
  let temp = 10 ** decimalsQuantity;
  return Math.round((number + Number.EPSILON) * temp) / temp;
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

  var arrayACoefficients = [];
  for (let i = 0; i <= algebraicTermsCounter; i++) {
    arrayACoefficients[i] = coefficients[i];
  }
  var coefficientsCounter = algebraicTermsCounter;
  let newValue, tempValue;
  let aproximatedErrorR, aproximatedErrorS;
  var arrayBCoefficients;
  var arrayCCoefficients;

  var root1, root2;
  var discriminant;

  var rootsCounter = 1;
  var iterationsCounter = 1;

  while (coefficientsCounter > 2) {
    /* console.log(
      'START: R,S: ',
      parameterR,
      parameterS,
      'COEFFICIENTS COUNTER:',
      coefficientsCounter
    ); */
    iterationsCounter = 0;

    do {
      iterationsCounter++;
      initialR = parameterR;
      initialS = parameterS;

      arrayBCoefficients = [0, 0]; // The B sub n will start in the position 3 of the array
      for (let i = 0; i <= coefficientsCounter; i++) {
        newValue =
          arrayACoefficients[i] +
          arrayBCoefficients[i + 1] * parameterR +
          arrayBCoefficients[i] * parameterS;

        /* console.log(
          arrayACoefficients[i],
          arrayBCoefficients[i + 1] * parameterR,
          arrayBCoefficients[i] * parameterS
        ); */
        arrayBCoefficients.push(newValue);
        // console.log('b' + i + ': ', arrayBCoefficients[i + 2], '\n\n');
      }

      arrayCCoefficients = [0, 0]; // The C sub n will start in the position 3 of the array
      for (let i = 0; i < coefficientsCounter; i++) {
        newValue =
          arrayBCoefficients[i + 2] +
          arrayCCoefficients[i + 1] * parameterR +
          arrayCCoefficients[i] * parameterS;
        arrayCCoefficients.push(newValue);
        // console.log('c' + i + ': ', arrayCCoefficients[i + 2]);
      }
      for (let i = 1; i <= 2; i++) {
        // Removing the 2 empty spaces at start of B and C arrays
        arrayBCoefficients.shift();
        arrayCCoefficients.shift();
      }
      var ecuation1 = [
        arrayCCoefficients[coefficientsCounter - 2],
        arrayCCoefficients[coefficientsCounter - 3],
        -arrayBCoefficients[coefficientsCounter - 1],
      ];
      var ecuation2 = [
        arrayCCoefficients[coefficientsCounter - 1],
        arrayCCoefficients[coefficientsCounter - 2],
        -arrayBCoefficients[coefficientsCounter],
      ];
      var initialEcuation1 = ecuation1,
        initialEcuation2 = ecuation2;
      /* Simplification of simultaneous ecuations */
      for (let i = 2; i >= 0; i--) {
        ecuation1[i] = ecuation1[i] / ecuation1[0];
        ecuation2[i] = ecuation2[i] / ecuation2[0];
      }
      if (ecuation1[0] < 0) {
        for (let i = 0; i < 3; i++) {
          ecuation1[i] *= -1;
        }
      }
      if (ecuation2[0] > 0) {
        for (let i = 0; i < 3; i++) {
          ecuation2[i] *= -1;
        }
      }

      var deltaS =
        (ecuation1[2] + ecuation2[2]) / (ecuation1[1] + ecuation2[1]);

      var deltaR = (ecuation1[2] - ecuation1[1] * deltaS) / ecuation1[0];

      deltaS = round(deltaS, 4);
      deltaR = round(deltaR, 4);
      // console.log(deltaS, deltaR);

      parameterR += deltaR;
      parameterS += deltaS;

      aproximatedErrorR = calculateError(parameterR, deltaR);
      aproximatedErrorS = calculateError(parameterS, deltaS);

      renderIterationResults(
        iterationsCounter,
        initialR,
        initialS,
        parameterR,
        parameterS,
        arrayBCoefficients,
        arrayCCoefficients,
        initialEcuation1,
        initialEcuation2,
        deltaR,
        deltaS,
        aproximatedErrorR,
        aproximatedErrorS
      );
    } while (
      aproximatedErrorR > toleratedError &&
      aproximatedErrorS > toleratedError
    );

    parameterR = round(parameterR, 4);
    parameterS = round(parameterS, 4);

    console.log('NUEVAS R, S: ', parameterR, parameterS);

    var isComplex = false;

    discriminant = parameterR ** 2 + 4 * parameterS;
    if (discriminant < 0) {
      isComplex = true;
      discriminant *= -1;
      let squareRoot = discriminant ** (1 / 2);
      root1 = [parameterR / 2, squareRoot / 2];
      root2 = [parameterR / 2, -squareRoot / 2];
      render2ComplexRoots(parameterR, parameterS, root1);
    } else {
      let squareRoot = discriminant ** (1 / 2);
      root1 = (parameterR + squareRoot) / 2;
      root2 = (parameterR - squareRoot) / 2;
      render2Roots(parameterR, parameterS, root1, root2);
    }
    console.log('RAICES: ', root1, root2);

    // POLYNOMIAL REDUCTION
    for (let i = 0; i <= coefficientsCounter; i++) {
      arrayACoefficients[i] = round(arrayBCoefficients[i], 4);
    }
    arrayACoefficients.splice(coefficientsCounter - 1, 2);
    console.log('NUEVA ECUACION A: ', arrayACoefficients);
    coefficientsCounter = arrayACoefficients.length - 1;

    console.log('\n\n');
  }

  var root1, root2;
  if (coefficientsCounter == 2) {
    discriminant =
      arrayACoefficients[1] ** 2 -
      4 * arrayACoefficients[0] * arrayACoefficients[2];
    if (discriminant < 0) {
      isComplex = true;
      discriminant *= -1;
      let squareRoot = discriminant ** (1 / 2);
      root1 = [
        -arrayACoefficients[1] / 2,
        squareRoot / (2 * arrayACoefficients[0]),
      ];
      root2 = [
        -arrayACoefficients[1] / 2,
        -squareRoot / (2 * arrayACoefficients[0]),
      ];
      renderLast2ComplexRoots(
        arrayACoefficients[0],
        arrayACoefficients[1],
        arrayACoefficients[2],
        root1
      );
    } else {
      let squareRoot = discriminant ** (1 / 2);
      root1 =
        (-arrayACoefficients[1] + squareRoot) / (2 * arrayACoefficients[0]);
      root2 =
        (-arrayACoefficients[1] - squareRoot) / (2 * arrayACoefficients[0]);
      renderLast2Roots(
        arrayACoefficients[0],
        arrayACoefficients[1],
        arrayACoefficients[2],
        root1,
        root2
      );
    }

    console.log('RAICES: ', root1, root2);
  } else if (coefficientsCounter == 1) {
    root1 = -arrayACoefficients[1] / arrayACoefficients[0];
    renderLastRoot(arrayACoefficients[0], arrayACoefficients[1], root1, root2);
    console.log('RAIZ: ', root1);
  }
}
function render2ComplexRoots(parameterR, parameterS, root1) {
  newRow = document.createElement('tr');
  newCeld = document.createElement('td');
  newCeld.setAttribute('colspan', 5);
  newCeld.innerHTML = `<b>x</b> = (${round(parameterR, 4)} &#8723; &radic;(
  ${round(parameterR, 4)}^2 + 4*${round(parameterS, 4)}))
   / 2 =
  <b>${round(root1[0], 4)}+${round(
    root1[1],
    4
  )}i,&nbsp;&nbsp;&nbsp;&nbsp;${round(root1[0], 4)}-${round(root1[1], 4)}i</b>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
function render2Roots(parameterR, parameterS, root1, root2) {
  newRow = document.createElement('tr');
  newCeld = document.createElement('td');
  newCeld.setAttribute('colspan', 5);
  newCeld.innerHTML = `<b>x</b> = (${round(parameterR, 4)} &#8723; &radic;(
  ${round(parameterR, 4)}^2 + 4*${round(parameterS, 4)}))
   / 2 =
  <b>${round(root1, 4)},&nbsp;&nbsp;&nbsp;&nbsp;${round(root2, 4)}</b>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
function renderLast2ComplexRoots(a, b, c, root1) {
  newRow = document.createElement('tr');
  newCeld = document.createElement('td');
  newCeld.setAttribute('colspan', 5);
  newCeld.innerHTML = `<b>x</b> = (-${round(b, 4)} &#8723; &radic;(
  ${round(b, 4)}^2 - 4*${round(a, 4)}*${round(c, 4)}))
   / (2*${round(a, 4)}) =
   <b>${round(root1[0], 4)}+${round(
    root1[1],
    4
  )}i,&nbsp;&nbsp;&nbsp;&nbsp;${round(root1[0], 4)}-${round(root1[1], 4)}i</b>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
function renderLast2Roots(a, b, c, root1, root2) {
  newRow = document.createElement('tr');
  newCeld = document.createElement('td');
  newCeld.setAttribute('colspan', 5);
  newCeld.innerHTML = `<b>x</b> = (-${round(b, 4)} &#8723; &radic;(
  ${round(b, 4)}^2 - 4*${round(a, 4)}*${round(c, 4)}))
   / (2*${round(a, 4)}) =
  <b>${round(root1, 4)},;&nbsp;&nbsp;&nbsp;&nbsp;${round(root2, 4)}</b>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}
function renderLastRoot(a, b, root) {
  newRow = document.createElement('tr');
  newCeld = document.createElement('td');
  newCeld.setAttribute('colspan', 5);
  newCeld.innerHTML = `<b>x</b> = ${b > 0 ? '-' : '+'} ${round(b, 4)} /
  ${round(a, 4)} = <b>${round(root, 4)}</b>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}

function renderIterationResults(
  iteration,
  initialR,
  initialS,
  parameterR,
  parameterS,
  arrayBCoefficients,
  arrayCCoefficients,
  ecuation1,
  ecuation2,
  deltaR,
  deltaS,
  aproximatedErrorR,
  aproximatedErrorS
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
  newCeld.innerHTML = `r = ${round(initialR, 4)}<br>
                    s = ${round(initialS, 4)}`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  for (
    let i = 0, j = arrayBCoefficients.length - 1;
    i < arrayBCoefficients.length;
    i++, j--
  ) {
    newCeld.innerHTML += `b<sub>${j}</sub> = ${round(
      arrayBCoefficients[i],
      4
    )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  }
  newCeld.innerHTML += `<br><br>`;
  for (
    let i = 0, j = arrayCCoefficients.length;
    i < arrayCCoefficients.length;
    i++, j--
  ) {
    newCeld.innerHTML += `c<sub>${j}</sub> = ${round(
      arrayCCoefficients[i],
      4
    )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  }
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  var temp1 = round(ecuation1[0], 4);
  var temp2 = round(ecuation1[1], 4);
  var temp3 = round(ecuation1[2], 4);
  var temp4 = round(ecuation2[0], 4);
  var temp5 = round(ecuation2[1], 4);
  var temp6 = round(ecuation2[2], 4);
  newCeld.innerHTML += `${temp1}&Delta;r ${
    temp2 < 0 ? '- ' + temp2 * -1 : '+ ' + temp2
  }&Delta;s = ${temp3}<br>
  ${temp4}&Delta;r  ${
    temp5 < 0 ? '- ' + temp5 * -1 : '+ ' + temp5
  }&Delta;s = ${temp6}<br><br>
  &Delta;r = ${deltaR}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  &Delta;s = ${deltaS}<br><br>
  r = ${round(initialR, 4)} ${
    deltaR < 0 ? '- ' + deltaR * -1 : '+ ' + deltaR
  } = ${round(parameterR, 4)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  s = ${round(initialS, 4)} ${
    deltaS < 0 ? '- ' + deltaS * -1 : '+ ' + deltaS
  } = ${round(parameterS, 4)}<br>`;
  newRow.appendChild(newCeld);

  newCeld = document.createElement('td');
  newCeld.innerHTML = `E<sub>a,r</sub> = ${round(aproximatedErrorR, 3)}%<br>
  E<sub>a,s</sub> = ${round(aproximatedErrorS, 3)}%<br>`;
  newRow.appendChild(newCeld);

  tableResults.appendChild(newRow);
}

function getInputs() {
  tableResults = document.getElementById('table-results-js');
  table = document.getElementById('table-js');
  tableHeader = document.getElementById('table-header-js');
  toleratedError = document.getElementById('tolerated-error').value;
  parameterR = document.getElementById('parameter-r').value;
  parameterS = document.getElementById('parameter-s').value;
  if (
    !toleratedError ||
    !parameterR ||
    !parameterS ||
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
  parameterR = Number(parameterR);
  parameterS = Number(parameterS);
}

/*TEST CASE:
-2+7x-5x^2+6^3  5   0   1   10
*/
