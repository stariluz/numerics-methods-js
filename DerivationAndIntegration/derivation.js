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
    this.element=document.getElementById(this.grade);
    this.element.addEventListener("input",()=>{
      this._getValue();
    },true);
  }
  _setValue(){
    this.element.value=this.value;
  }
  _getValue(){
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
  let values=[1.2,-0.25,-0.5,-0.15,-0.1];
  for(let i=0; i<=4; i++){
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


let calculateButton=document.getElementById('calculate');
calculateButton.addEventListener("click",startCalculations, true);
function startCalculations(){
  let {x, stepSize} = getConfiguration();
  let sum=0;
  // calculateError(stepSize);
  let evaluations=[];
  // console.log(equation);
  let stringOperationMain1="",stringOperationMain2="";
  let length=stepSize*2;
  for(let i=0,step=x-length; step<=x+length; i++, step+=stepSize){
    evaluations.push(0);
    // console.log("I:",i);
    for(let j in equation){
      let temp=(equation[j].value*Math.pow(step, j));
      // console.log(temp);
      evaluations[i]+=temp;
    }
    evaluations[i]=round(evaluations[i],6);
    stringOperationMain1+=`x<sub>${i+1}</sub>=${step}&emsp;`
    stringOperationMain2+=`f<sub>(${step})</sub> = ${evaluations[i]}&emsp;`;
  }
  stringOperationMain1+="<br>"+stringOperationMain2;
  displayEvaluations(stringOperationMain1);
  //  console.log(evaluations);
  let {result,stringOperation}=centralFiniteDIference2Steps(evaluations,stepSize,x);
  displayResult(stringOperation);
  console.log(result);
}
function centralFiniteDIference2Steps(evaluations, stepSize, x){
  let result=(-evaluations[4]+8*(evaluations[3]-evaluations[1])+evaluations[0])/(12*stepSize);
  result=round(result,6);
  let stringOperation=
  `f'<sub>(${x})</sub> = (-(${evaluations[4]}) + 8((${evaluations[3]}) - (${evaluations[1]})) + (${evaluations[0]}))/(12(${stepSize})) = ${result}<br>`;
  return {
    result,
    stringOperation
  }
}
function getConfiguration(){
  let x, stepSize;
  x=Number(document.getElementById('x').value);
  stepSize=Number(document.getElementById('step-size').value);
  return {
    x, stepSize,
  };
}

// function calculateError(stepSize){
//   /**
//    * Formula: https://www.jstor.org/stable/2300068#metadata_info_tab_contents
//    */
//   let derivative=thirdDerivativeAverage(initialX, finalX);
//   let error=round(-Math.pow(stepSize,4)*derivative/180,6);
//   let stringOperation=`<b>E<sub>a</sub> = - (${stepSize}^4)(${derivative}/180) = ${error}</b>`
//   displayError(stringOperation);
// }

/* function displayError(stringOperation) {
  let celd=document.getElementById('error-celd-js');
  celd.innerHTML=
  `${stringOperation}`;
} */
function displayResult(stringOperation) {
  let celd=document.getElementById('result-celd-js');
  celd.innerHTML=
  `${stringOperation}`;
}
function displayEvaluations(stringOperation) {
  let celd=document.getElementById('evaluations-celd-js');
  celd.innerHTML=
  `${stringOperation}`;
}