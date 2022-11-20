let pages=[
  {
    "root": "RootsOfEquations",
    "name": "Roots of equations",
    "id": "roots-of-equations",
    "children": [
      {
        "file": "bisection-method.html",
        "name": "Bisection method"
      },
      {
        "file": "bairstow-method.html",
        "name": "Bairstow method"
      },
      {
        "file": "secant-method.html",
        "name": "Secant method"
      }
    ]
  },
  {
    "root": "SimultaneousLinearEcuations",
    "name": "Simultaneous linear equations",
    "id": "simultaneous-linear-equations",
    "children": [
      {
        "file": "gauss.html",
        "name": "Gauss method"
      },
      {
        "file": "gauss-seidel.html",
        "name": "Gauss-Seidel method"
      }
    ]
  },
  {
    "root": "InterpolationAndPolynomialApproximation",
    "name": "Interpolation and polynomial approximation",
    "id": "interpolation-and-polynomial-approximation",
    "children": [
      {
        "file": "linear-regression.html",
        "name": "Linear regression"
      }
    ]
  },
  {
    "root": "DerivationAndIntegration",
    "name": "Derivation and integration",
    "id": "derivation-and-integration",
    "children": [
      {
        "file": "derivation.html",
        "name": "Derivation"
      },
      {
        "file": "integration.html",
        "name": "Integration"
      }
    ]
  },
  {
    "root": "DifferentialEquations",
    "name": "Differential equations",
    "id": "differential-equations",
    "children": [
      {
        "file": "runge-kutta.html",
        "name": "Runge-Kutta method"
      }
    ]
  }
];

let navbar = document.getElementById("navbar");
let contentFrame = document.getElementById("content");

main();
async function main(){
  await initNavbar();
  addListenerToNavigation();
  contentFrame.src=`./${pages[3].root}/${pages[3].children[1].file}`;
}
function updateURL(section,page){
  let url=`./${pages[section].root}/${pages[section].children[page].file}`;
  let pageTitle=`${pages[section].children[page].name} | ${pages[section].name}`;
  contentFrame.src=url;
  history.replaceState({
    id: url,
  }, pageTitle, url);
}
window.addEventListener('popstate', (event)=>{
  if (history.state && history.state.id === 'homepage') {
    contentFrame.src=url;
  }
}, false);
function initNavbar(){
  return new Promise((resolve,reject)=>{
    for (let i in pages) {
      let temp='';
      temp += `
        <div class="dropdown">
          <button class="btn btn-success dropdown-toggle"
            type="button" data-bs-toggle="dropdown" aria-expanded="false"
            id="${pages[i].id}-dropdown" sectionIndex="${i}"
          >
            ${pages[i].name}
          </button>
          <ul class="dropdown-menu">`;
      for(let j in pages[i].children) {
        temp += `
          <li>
              <button class="dropdown-item navButton-js" pageIndex="${i} ${j}">
                ${pages[i].children[j].name}
              </button>
          </li>`;
      }
      temp+=`
          </ul>
        </div>
      `;
      navbar.innerHTML+=temp;
    }
    resolve();
  });
}

function addListenerToNavigation() {
  let navButtons=document.getElementsByClassName('navButton-js');
  for(let i=0; i<navButtons.length; i++){
    navButtons[i].addEventListener("click",onNavigate,true);
  }
}
/**
 * 
 * @param {Event} event 
 */
function onNavigate(event){
  // console.log(event.target); 
  element=event.target;
  // let element=new Element();
  let index=element.getAttribute('pageIndex').split(" ");
  // let contentContainer = document.getElementById("content-container");
  updateURL(index[0],index[1]);
}

let counter=true;
let navbarContainer=document.getElementById('navbar-container');
let buttonDisplayNav=document.getElementById('button-display-nav');
buttonDisplayNav.addEventListener("click", ()=>{
  counter=!counter;
  // buttonDisplayNav.classList.toggle('visible');
  navbarContainer.classList.toggle('visible');
  if(!counter){
    buttonDisplayNav.firstChild.innerText=`Close Navigation`;
  }else{
    buttonDisplayNav.firstChild.innerText=`Open Navigation`;
  }
});