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

/*TEST CASE:
-2+7x-5x^2+6^3  5   0   1   0.1
*/

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
function calculateError(lower, upper){
    var result=((upper-lower)/(upper+lower))*100;
    //console.log("SUB::", (upper-lower), ", ADD:",(upper+lower),", RESULT:",result);
    if(result<0){
        result*=-1;
    }
    return result;
}
function bisectionMethod(){
    // INPUTS VALIDATIONS
    if(upperLimit<=lowerLimit){
        throw Error('ERROR: lower limit is higher than the upper limit.');
    }
    if(toleratedError<0.0000001){
        throw Error("ERROR: the tolerated error can't be smaller than 10^-7.");
    }
    if(iterationsQuantity<0||iterationsQuantity>10**7){
        throw Error("ERROR: the iterations quantity can't be greater than 10^7.");
    }

    var middleValue=0;
    var lowerResult=0;
    var middleResult=0;
    var decisionFactor=0;
    var aproximatedError=0;
   
    var newRow=undefined;
    var newCeld=undefined;

    var tableResults=document.getElementById('table-results');

    for(let i=1; i<=iterationsQuantity; i++){

        middleValue=(lowerLimit+upperLimit)/2;
        lowerResult=evaluateEcuation(lowerLimit);
        //console.log("LOWER f("+lowerLimit+") = "+lowerResult);
        middleResult=evaluateEcuation(middleValue);
        //console.log("MIDDLE f("+middleValue+") = "+middleResult);
        decisionFactor=lowerResult*middleResult;
       
        aproximatedError=calculateError(lowerLimit, upperLimit);
        //console.log("ERROR  = "+aproximatedError);

        newRow=document.createElement("tr");

        newCeld=document.createElement("td");
        newCeld.innerHTML=i;
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
    ecuation=document.getElementById('ecuation').value;
    iterationsQuantity = document.getElementById('iterations-quantity').value;
    toleratedError = document.getElementById('tolerated-error').value;
    lowerLimit = document.getElementById('lower-limit').value;
    upperLimit = document.getElementById('upper-limit').value;

    if(!ecuation||!iterationsQuantity||!toleratedError||!lowerLimit||!upperLimit){
        // console.log("ERROR")
        throw Error('ERROR: please enter all the fields.');
    }
   
    iterationsQuantity=Number(iterationsQuantity);
    toleratedError=Number(toleratedError);
    lowerLimit=Number(lowerLimit);
    upperLimit=Number(upperLimit);
}






function testFunctions(){
    evaluateEcuation(0);
    evaluateEcuation(0.5);
    evaluateEcuation(0.25);
    evaluateEcuation(0.375);
    evaluateEcuation(0.3125);
    evaluateEcuation(0.28125);
}
