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
  let values=[0.2,25,-200,675,-900,400]
  for(let i=0; i<=5; i++){
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

let initialX, finalX, numberOfSegments;
let calculateButton=document.getElementById('calculate');
calculateButton.addEventListener("click",startCalculations, true);
function startCalculations(){
  getConfiguration();
  let stepSize=round((finalX-initialX)/numberOfSegments,6);
  let sum=0;
  calculateError(stepSize);
  let evaluations=[];
  
  let stringOperationMain="";
  for(let i=0,step=initialX; i<=numberOfSegments; i++, step+=stepSize){
    evaluations.push(0);
    for(let j in equation){
      evaluations[i]+=(equation[j].value*Math.pow(step, j));
    }
    evaluations[i]=round(evaluations[i],6);
    stringOperationMain+=`f<sub>(${step})</sub> = ${evaluations[i]}&emsp;`;
  }
  displayEvaluations(stringOperationMain);
  // console.log(evaluations);
  stringOperationMain="";
  let band=0;
  let m=numberOfSegments;
  if(numberOfSegments%2!=0){
    let {result,stringOperation}=simpson3_8(stepSize,numberOfSegments,evaluations);
    sum+=result;
    m-=3;
    band++;
    stringOperationMain+=`I<sub>1</sub> = ${stringOperation}`;
    // console.log(result, stringOperation);
  }
  if(m>1){
    let {result,stringOperation}=simpson1_3Multiple(stepSize,m,evaluations);
    if(band==1){
      stringOperationMain+=`<br>I<sub>2</sub> = ${stringOperation}`;
    }else{
      stringOperationMain+=`I = ${stringOperation}`;
    }
    sum+=result;
    // console.log(result, stringOperation);
    band++;
  }
  sum=round(sum,6);
  if(band==2){
    stringOperationMain+=`<br><b>I<sub>T</sub> = ${sum}</b>`;
  }else{
    stringOperationMain="<b>"+stringOperationMain+"</b>";
  }
  displayResult(stringOperationMain);
  console.log(sum);
}
function simpson3_8(stepSize,n,evaluations){
  let result=3*stepSize*(evaluations[n-3]+3*(evaluations[n-2]+evaluations[n-1])+evaluations[n])/8;
  result=round(result,6);
  
  let stringOperation=`(${stepSize})(3/8)[${evaluations[n-3]} + 3(${evaluations[n-2]}`
  if(evaluations[n-1]>=0){
    stringOperation+=` + ${evaluations[n-1]})`;
  }else{
    stringOperation+=` - ${-evaluations[n-1]})`;
  }
  if(evaluations[n]>=0){
    stringOperation+=` + ${evaluations[n]}`;
  }else{
    stringOperation+=` - ${-evaluations[n]}`;
  }
  stringOperation+=`] = ${result}`;
  
  return {
    result,
    stringOperation,
  };
}
function simpson1_3Multiple(stepSize,numberOfSegments,evaluations){
  let stringOperation=`(${stepSize}/3)[${evaluations[0]} + 4(`;
  let sum=evaluations[0];
  for(let i=1; i<=numberOfSegments-1; i+=2){
    if(evaluations[i]>=0){
      stringOperation+=` + ${evaluations[i]}`;
    }else{
      stringOperation+=` - ${evaluations[i]*-1}`;
    }
    sum+=4*evaluations[i];
  }
  stringOperation+=`) + 2(`;
  if(numberOfSegments-2<2){
    stringOperation+=`0`;
  }
  for(let i=2; i<=numberOfSegments-2; i+=2){
    sum+=2*evaluations[i+1];
    if(evaluations[i]>=0){
      stringOperation+=` + ${evaluations[i]}`;
    }else{
      stringOperation+=` - ${-evaluations[i]}`;
    }
  }
  stringOperation+=`)`;
  sum+=evaluations[numberOfSegments];
  let result=round(stepSize*sum/3,6);
  if(evaluations[numberOfSegments]>=0){
    stringOperation+=` + ${evaluations[numberOfSegments]}] = ${result}`;
  }else{
    stringOperation+=` - ${-evaluations[numberOfSegments]}] = ${result}`;
  }
  return {
    result,
    stringOperation,
  };
}
function getConfiguration(){
  initialX=Number(document.getElementById('initial-x').value);
  finalX=Number(document.getElementById('final-x').value);
  numberOfSegments=Number(document.getElementById('number-segments').value);
}

function calculateError(stepSize){
  /**
   * Formula: https://www.jstor.org/stable/2300068#metadata_info_tab_contents
   */
  let derivative=thirdDerivativeAverage(initialX, finalX);
  let error=round(-Math.pow(stepSize,4)*derivative/180,6);
  let stringOperation=`<b>E<sub>a</sub> = - (${stepSize}^4)(${derivative}/180) = ${error}</b>`
  displayError(stringOperation);
}
function thirdDerivativeAverage(initialX,finalX){
  console.log(equation);
  let end=gradeOfEquation;
  let begin=3;
  if(equation.length<=3){
    return 0;
  }
  let stringOperation="f<sup>'''</sup><sub>(x)</sub> = ";
  let evaluation=0;
  for(let i=begin; i<=end; i++){
    let exponent = i-3;
    let value = equation[i].value*(i-2)*(i-1)*(i);
    let temp=value*(Math.pow(finalX,exponent)-Math.pow(initialX,exponent));
    if(value>=0){
      stringOperation+=` + ${value}x<sup>${exponent}</sup>`
    }else{
      stringOperation+=` - ${-value}x<sup>${exponent}</sup>`
    }
    // console.log(exponent,value,temp);
    evaluation+=temp;
  }
  let result=round(evaluation/(finalX-initialX),6);
  displayThirdDerivative(result, stringOperation, initialX, finalX);
  // console.log(evaluation);
  return result;
}
function displayThirdDerivative(result, stringOperation, initialX, finalX) {
  let celd=document.getElementById('error-operations-celd-js');
  celd.innerHTML=
  `${stringOperation}<br>
  f<sup>'''</sup><sub>(${initialX}&#60;x&#60;${finalX})</sub> = ${result}`;
}
function displayError(stringOperation) {
  let celd=document.getElementById('error-celd-js');
  celd.innerHTML=
  `${stringOperation}`;
}
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