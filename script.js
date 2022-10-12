// STATIC VARIABLES
numberOfPoints = 0;


function startCalculations() {
  function getInputsValues() {
    function getField(coord, index) {
      if(coord!='x'&&coord!='y'){
        throw Error("The provided coord is not 'x' or 'y'.");
      }
      return Number(document.getElementById(`${coord}${index}`).value);
    }

    var points=new Array(numberOfPoints+1);
    for (let i = 1; i <= numberOfPoints; i++) {
      points[i]={
        x:0,
        y:0
      };
    }

    for (let i = 1; i <= numberOfPoints; i++) {
      points[i].x = getField('x', i);
      points[i].y = getField('y', i);
    }

    return points;
  }

  var points = getInputsValues();

  var coefficientsAResulted = calculateACoefficients(points);

  console.log(coefficientsAResulted);
  printResult(coefficientsAResulted);
}
function calculateACoefficients(points) {
  var coefficientsA=[0,0];
  var numberOfPoints = points.length-1;
  var sumOfXtimesY=0;
  var sumOfY=0;
  var sumOfX=0;
  var sumOfXpow2=0;
  
  console.log(points);

  for(let i=1; i<=numberOfPoints; i++){
  // console.log(points[i]);
    sumOfXtimesY+=points[i].x*points[i].y;
    sumOfX+=points[i].x;
    sumOfY+=points[i].y;
    sumOfXpow2+=Math.pow(points[i].x,2);
  }
  coefficientsA[1] = (numberOfPoints*sumOfXtimesY-sumOfX*sumOfY)/(numberOfPoints*sumOfXpow2-Math.pow(sumOfX,2));
  coefficientsA[0] = (sumOfY/numberOfPoints) - coefficientsA[1]*(sumOfX/numberOfPoints);

  return coefficientsA;
}
function printResult(coefficientsA) {
  var resultCeld = document.getElementById("result-celd-js");
  resultCeld.innerHTML = null;

  resultCeld.innerText=`y = ${coefficientsA[0]} + ${coefficientsA[1]}x`;
}
function addPointFields() {
  numberOfPoints++;
  var pointsContainer = document.getElementById("points-inputs-container-js");
  var newField = document.createElement("div");

  newField.classList.add("col");
  newField.innerHTML = `
    <div class="input-group mb-3">
      <div class="input-group-text">(</div>
      <div class="form-floating">
        <input type="number" class="form-control" id="x${numberOfPoints}" placeholder="x${numberOfPoints}" />
        <label for="x${numberOfPoints}">x${numberOfPoints} </label>
      </div>
      <div class="form-floating">
        <input type="number" class="form-control" id="y${numberOfPoints}" placeholder="y${numberOfPoints}" />
        <label for="y${numberOfPoints}">y${numberOfPoints}</label>
      </div>
      <div class="input-group-text">)</div>
    </div>`;
    pointsContainer.appendChild(newField);
}


function main(){
  addPointFields();
}

main();