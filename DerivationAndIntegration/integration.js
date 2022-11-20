let gradeOfEquation = 0;
class Grade{
  grade=String;
  value=Number;
  element=Element;
  constructor(grade,element=undefined){
    this.grade='a'+grade;
    this._setElementById();
    this._setValue();
  }
  _setElementById(){
    this.element=document.getElementById(this.grade);
    this.element.addEventListener("input",()=>{
      this._setValue();
    },true);
  }
  _setValue(){
    let value=Number(this.element.value);
    if(isNaN(value)){
      value=0;
    }
    this.value=value;
  }
  static increaseGrade() {
    gradeOfEquation++;
    let equationBegin=document.getElementById("equation-begin");
    equationBegin.after(createXNewGrade(gradeOfEquation));
    let newGrade=new Grade(gradeOfEquation);
    xArray.push(newGrade);
  }
  static decreaseGrade(){
    if(gradeOfEquation<=0)return;
    xArray[gradeOfEquation].element.removeEventListener("input",()=>{
      this._getValue();
    },true);
    xArray[gradeOfEquation].element.parentNode.parentNode.remove();
    xArray.pop();
    gradeOfEquation--;
  }
}
let xArray=[
  new Grade(0),
];
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
  console.log(xArray);
}