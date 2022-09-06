// Ecuation variables
var ecuation="";
var operations=['+'];
var coefficients=[0];
var exponents=[0];
// var operationIt=0;
// var coefficientIt=0;
var it=0;

// Limits
var iterationsQuantity=0;
var toleratedError=0.0;
var lowerLimit=0.0;
var upperLimit=1.0;


var table, tableHeader, tableResults;


function registerEcuation(){
    try{
        getInputs();
    }catch(error){
        throw error;
    }
    it=0;
    operations=['+'];
    coefficients=[0];
    exponents=[0];
    
    for(let i=0; i<ecuation.length; i++){
        if(ecuation[i]=='x'){
            exponents[it]=1;
        }else if(ecuation[i]=='^'){
            i++;
            exponents[it]=0;
            while(!isNaN(ecuation[i])){
                exponents[it]=exponents[it]*10;
                exponents[it]+=(Number(ecuation[i]));
                i++;
            }
            // console.log("EXPONENT "+it+":", exponents[it]);
            i--;
        }else if(isNaN(ecuation[i])){
            it++;
            operations[it]=ecuation[i];
            // console.log("OPERATION "+it+":", operations[it]);
        }else{
            coefficients[it]=0;
            exponents[it]=0;
            while(!isNaN(ecuation[i])){
                coefficients[it]=coefficients[it]*10;
                coefficients[it]+=(Number(ecuation[i]));
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

var memoryEvaluatedFunctionResults={};
function evaluateEcuation(variable){
    if(memoryEvaluatedFunctionResults[variable]!==undefined){
        //console.log("ALREADY EXISTS.")
        return memoryEvaluatedFunctionResults[variable];
    }
    var collector=0;
    var evaluatedValue=0;
    for(let i=0; i<=it; i++){
        evaluatedValue=(coefficients[i]*(variable**exponents[i]));
        //console.log("\t"+coefficients[i]+"*"+variable+"^"+exponents[i]+"="+evaluatedValue);
        if(operations[i]=="+"){
            collector+=evaluatedValue;
        }else if(operations[i]=="-"){
            collector-=evaluatedValue;
        }else if(operations[i]=="*"){
            collector*=evaluatedValue;
        }else if(operations[i]=="/"){
            collector/=evaluatedValue;
        }else{
            throw Error('ERROR: the ecuation is not an extended polynomial or is not in the specified format.');
        }
    }
    memoryEvaluatedFunctionResults[variable]=collector;
    return collector;
    // console.log("f("+variable+") = "+collector);
}
function renderIterationResults(iteration, lowerLimit, upperLimit, middleValue, lowerResult, middleResult, decisionFactor, aproximatedError){
    var newRow=undefined;
    var newCeld=undefined;
    
    newRow=document.createElement("tr");
    // if(iteration%2==0){
    //     newRow.setAttribute("class", "table-light");
    // }

    newCeld=document.createElement("th");
    newCeld.setAttribute("scope", "row");
    newCeld.innerHTML=iteration;
    newRow.appendChild(newCeld);

    newCeld=document.createElement("td");
    newCeld.innerHTML=`x<sub>l</sub>=${lowerLimit}<br>
                    x<sub>u</sub>=${upperLimit}`;
    newRow.appendChild(newCeld);

    newCeld=document.createElement("td");
    newCeld.innerHTML=`x<sub>r</sub>=${middleValue}<br>`;
    newRow.appendChild(newCeld);

    
    newCeld=document.createElement("td");
    newCeld.innerHTML=`f<sub>(${lowerLimit})</sub>=${lowerResult}<br>
                    f<sub>(${middleValue})</sub>=${middleResult}<br>
                    f<sub>(${lowerLimit})</sub>f<sub>(${middleValue})</sub>=${decisionFactor}`;
    newRow.appendChild(newCeld);

    newCeld=document.createElement("td");
    newCeld.innerHTML=aproximatedError+'%';
    newRow.appendChild(newCeld);

    tableResults.appendChild(newRow);

}
function calculateError(lower, upper){
    var result=(upper-lower)/(upper+lower)*100;
    if(result<0){
        result*=-1;
    }
    return result;
}
function bisectionMethod(){
    // INPUTS VALIDATIONS
    if(upperLimit<=lowerLimit){
        let error=new Error('ERROR: lower limit is higher than the upper limit.');
        renderError(error);
        throw error;
    }
    if(toleratedError<0.0000001){
        let error=new Error("ERROR: the tolerated error can't be smaller than 10^-7.");
        renderError(error);
        throw error;
    }
    if(iterationsQuantity<0||iterationsQuantity>10**7){
        let error=new Error("ERROR: the iterations quantity can't be greater than 10^7.");
        renderError(error);
        throw error;
    }

    cleanError();
    
    table.classList.add('displayed');

    var middleValue=0;
    var lowerResult=0;
    var middleResult=0;
    var decisionFactor=0;
    var aproximatedError=0;

    for(let iteration=1; iteration<=iterationsQuantity; iteration++){
        middleValue=(lowerLimit+upperLimit)/2;

        lowerResult=evaluateEcuation(lowerLimit);
        middleResult=evaluateEcuation(middleValue);
        decisionFactor=lowerResult*middleResult;

        aproximatedError=calculateError(lowerLimit, upperLimit);
        
        //console.log("LOWER f("+lowerLimit+") = "+lowerResult);
        //console.log("MIDDLE f("+middleValue+") = "+middleResult);
        //console.log("ERROR  = "+aproximatedError);

        renderIterationResults(
            iteration, lowerLimit, upperLimit, middleValue,
            lowerResult, middleResult, decisionFactor,
            aproximatedError
        );

        if(decisionFactor==0||aproximatedError<toleratedError){
            // THE ROOT IS FOUNDED OR THE ERROR IS TOLERATED
            break;
        }else if(decisionFactor<0){
            upperLimit=middleValue;
        }else if(decisionFactor>0){
            lowerLimit=middleValue;
        }
    }
    // console.log("RESULT: ", middleResult);
}

function getInputs(){
    tableResults=document.getElementById('table-results-js');
    table=document.getElementById('table-js');
    tableHeader=document.getElementById('table-header-js');
    ecuation=document.getElementById('ecuation').value;
    iterationsQuantity = document.getElementById('iterations-quantity').value;
    toleratedError = document.getElementById('tolerated-error').value;
    lowerLimit = document.getElementById('lower-limit').value;
    upperLimit = document.getElementById('upper-limit').value;

    table.classList.remove('displayed');


    if(!ecuation||!iterationsQuantity||!toleratedError||!lowerLimit||!upperLimit||tableResults===undefined||table===undefined||tableHeader===undefined){
        setTimeout(()=>{
            tableResults.innerHTML=null;
        },1000)
        // console.log("ERROR")
        let error=new Error('ERROR: please enter all the fields.');
        renderError(error);
        throw error;
    }
    
}
var errorCounter
function renderError(error){
    // const toast = document.getElementById(`error-${errorCounter++}`)
    
    const errorContainer=document.getElementById('error-js');

    const newError=document.createElement('div');
    newError.classList.add("toast");
    newError.classList.add("text-bg-danger");
    newError.id=`error-${errorCounter++}`;
    newError.setAttribute('role', 'alert')
    newError.setAttribute('aria-live', '')
    newError.setAttribute('aria-atomic', 'true')
    newError.setAttribute('data-bs-delay', '10000')
    newError.innerHTML=`
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
    const toast = new bootstrap.Toast(newError)
    errorContainer.appendChild(newError);
    toast.show()

    // errorContainer.classList.add('error-display');
    // errorContainer.innerHTML=error.message;
}
function cleanError(){
    // const errorContainer=document.getElementById('error-js');
    // errorContainer.innerHTML=null;
    // errorContainer.classList.remove('error-display');
}

function chargeToast(){
    const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')
    if (toastTrigger) {
        toastTrigger.addEventListener('click', () => {
            const toast = new bootstrap.Toast(toastLiveExample)

            toast.show()
        })
    }
}




function testFunctions(){
    evaluateEcuation(0);
    evaluateEcuation(0.5);
    evaluateEcuation(0.25);
    evaluateEcuation(0.375);
    evaluateEcuation(0.3125);
    evaluateEcuation(0.28125);
}

/*TEST CASE:
-2+7x-5x^2+6^3  5   0   1   10
*/