let gradeOfEquation = 0;
let equationBegin=document.getElementById("equation-begin");
class Grade{
  grade=String;
  value=Number;
  element=Element;
  constructor(grade,element=undefined,value=undefined){
    this.grade='a'+grade;
    if(element==='create'){
      this._createElement();
    }else if(element!==undefined){
      this.element=element;
    }else{
      this._setElementById();
    }
    if(value!==undefined){
      this.value=value;
      this._setValue();
    }else{
      this._getValue();
    }
  }
  _createElement(){
    let index=this.grade.replace("a","");
    displayNewGradeElement(createXNewGrade(index));
    this._setElementById();
  }
  _setElementById(){
    if(this.element===null) return;
    this.element=document.getElementById(this.grade);
    this.element.addEventListener("input",()=>{
      this._getValue();
    },true);
  }
  _setValue(){
    if(this.element===null) return;
    this.element.value=this.value;
  }
  _getValue(){
    if(this.element===null) return;
    let value=Number(this.element.value);
    if(isNaN(value)){
      value=0;
    }
    this.value=value;
  }
  static increaseGrade() {
    gradeOfEquation++;
    displayNewGradeElement(createXNewGrade(gradeOfEquation));
    let newGrade=new Grade(gradeOfEquation);
    equation.push(newGrade);
  }
  static decreaseGrade(){
    if(gradeOfEquation<=0)return;
    equation[gradeOfEquation].element.removeEventListener("input",()=>{
      this._getValue();
    },true);
    equation[gradeOfEquation].element.parentNode.parentNode.remove();
    equation.pop();
    gradeOfEquation--;
  }
}
let equation=[
  // new Grade(0),
];

function displayNewGradeElement(element){
  equationBegin.after(element);
}
main();
function main(){
  initTestProgram();
}
function initTestProgram(){
  let values=[8.5,-20,12,-2];
  // let values=[1,8.5,-10,4,-0.5];
  for(let i=0; i<=values.length-1; i++){
    equation.push(new Grade(i,'create',values[i]));
  }
  gradeOfEquation=5;
}

function round(number, decimalsQuantity) {
  let temp = 10 ** decimalsQuantity;
  return Math.round((number + Number.EPSILON) * temp) / temp;
}

let increaseGradeButton = document.getElementById("increase-grade");
increaseGradeButton.addEventListener("click", Grade.increaseGrade, true);

let decreaseGradeButton = document.getElementById("decrease-grade");
decreaseGradeButton.addEventListener("click", Grade.decreaseGrade, true);

function createXNewGrade(grade) {
  let element=document.createElement('div');
  element.id=`grade-${grade}`;
  element.innerHTML=`
    <span class="operator-sign">+</span>
    <div class="input-group">
      <input
        type="number"
        class="form-control"
        id="a${grade}"
        placeholder="a${grade}"
        value=""
      />
      <span class="input-group-text">x<sup>${grade}</sup></span>
    </div>
  `;
  return element;
}

function getConfiguration(){
  let initialY, initialX, finalX, stepSize;
  initialY=Number(document.getElementById('initial-y').value);
  initialX=Number(document.getElementById('initial-x').value);
  finalX=Number(document.getElementById('final-x').value);
  stepSize=Number(document.getElementById('step-size').value);
  return {
    initialY, initialX, finalX, stepSize
  }
}

let calculateButton=document.getElementById('calculate');
calculateButton.addEventListener("click",startCalculations, true);
function startCalculations(){
  let { initialY, initialX, finalX, stepSize} = getConfiguration();
  // let stepSize=round((finalX-initialX)/numberOfSegments,6);
  let sum=0;
  // calculateError(stepSize);
  let evaluation=0;
  let currentY=initialY;
  let derivative=getFirstDerivative(equation);
  let error=0,errorStringOperation="";

  console.log("Equation:",equation);
  for(let currentX=initialX,i=0; currentX<=finalX; currentX+=stepSize,i++){
    displayIteration(i, currentX, currentY, errorStringOperation);
    evaluation=evaluate(equation,currentX);
    console.log("X:",currentX);
    console.log("Evaluation: ",evaluation);
    evaluation=evaluation*stepSize+currentY;
    console.log("New Y: ",evaluation);
    ({error,errorStringOperation}=calculateError(derivative, currentX,stepSize));
    currentY=evaluation;
  }
  // displayResult(stringOperationMain);
}
function evaluate(equation,x){
  let evaluation=0;
  for(let j in equation){
    evaluation+=(equation[j].value*Math.pow(x, j));
  }
  return evaluation;
}

function calculateError(derivative,x, stepSize){
  let evaluation=evaluate(derivative,x);
  let error=100*evaluation*Math.pow(stepSize,2)/2;
  error=round(error,6)
  console.log("Error:", error);
  let errorStringOperation=`<b>E<sub>a</sub> =  ((${evaluation})(${stepSize})<sup>2</sup>/2)(100%) = ${error}%</b>`
  // displayError(errorStringOperation);
  return {
    error,
    errorStringOperation
  };
}
function getFirstDerivative(equation){
  let end=equation.length-1;
  let begin=1;
  if(equation.length<=1){
    return 0;
  }
  console.log(equation,begin,end);
  let derivative=[];
  let stringOperation="f''(x)";
  for(let i=begin; i<=end; i++){
    let exponent = i-1;
    let value=equation[i].value*(i);
    derivative.push(new Grade(i-1,null,value));
    if(value>=0){
      stringOperation+=` + ${value}x<sup>${exponent}</sup>`
    }else{
      stringOperation+=` - ${-value}x<sup>${exponent}</sup>`
    }
    // console.log(exponent,value,temp);
  }
  displayFirstDerivative(stringOperation);
  console.log(derivative);
  return derivative;
}
function displayFirstDerivative(stringOperation) {
  let celd=document.getElementById('operations-celd-js');
  celd.innerHTML=
  `${stringOperation}<br>`;
}
function displayResult(stringOperation) {
  let celd=document.getElementById('result-celd-js');
  celd.innerHTML=
  `${stringOperation}`;
}

function displayIteration(it, x, y, errorStringOperation){
  let resultsContainer=document.getElementById('results-container-js');
  let newRow=document.createElement('tr');
  let newCeld;

  newCeld=document.createElement('td');
  newCeld.innerText=it;
  newRow.appendChild(newCeld);

  
  newCeld=document.createElement('td');
  newCeld.innerText=x;
  newRow.appendChild(newCeld);

  newCeld=document.createElement('td');
  newCeld.innerText=y;
  newRow.appendChild(newCeld);

  newCeld=document.createElement('td');
  newCeld.innerHTML=errorStringOperation;
  newRow.appendChild(newCeld);

  resultsContainer.appendChild(newRow);
}