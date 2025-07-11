/* ==========================================================
   IMPERIAL COUNTY DA · Dashboards · script.js
   Hard-coded data (2020-2025)
   ========================================================== */

//import * as Constants from './js';
/* ---------- helpers ---------- */
const $      = q => document.querySelector(q);                                                                          //shortcut that lets us do $(q) instead of spelling that all out 
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];                               // creates an array of month names 

/* ---------- stamp footer year ---------- */
$('#yearNow').textContent = new Date().getFullYear();                                                                   //sets text in yearNow html span as the 4 digit integer year getFullyYear from a new Date object

/* ---------- palette ---------- */
const palette = {
  blue:'#6992ff',  blueF:'hsla(224, 100.00%, 70.60%, 0.70)',
  orange:'#ff9f40',orangeF:'hsla(30, 100.00%, 62.50%, 0.70)',
  teal:'#4bc0c0',   pink:'#ff6384',
  yellow:'#ffce54', purple:'#9966ff', grey:'#9599a8'                                                                    //dictionaries/kv pairs are called object literals 
};

/* ==========================================================
   1 · Arrests & Prosecutions
   ========================================================== */

const arrestsChart = new Chart($('#arrestsChart'),{ //makes a new bar chart at the canvas with that ID 
  type:'bar',
  data:{labels:months,datasets:[                                                                                         //data: actual numbers + labels. labels: months array x axis of vertical chart. datasets: values mapped to those labels. label: each dataset matching to the main axis. 
    {label:'Arrests',data:arrests.violent[2025].a,backgroundColor:palette.blueF,borderColor:palette.blue,borderWidth: 0, stack:'s'},         //initalizes violent arrests in 2025 for first load of webpage, background color doesn't work 
    {label:'Prosecutions',data:arrests.violent[2025].p,backgroundColor:palette.orangeF,borderColor:palette.orange,borderWidth: 0,stack:'s'} //first load of page: violent prosecutions in 2025, same stack label builds them on same horizontal space, while stack = true lets them have different vertical space 
  ]},
  options:{                                                                                                              //options: how the chart should look and act 
    responsive:true,maintainAspectRatio:false,                                                                           //response: chart should resize itself, doesn't need to maintain aspect ratio
    scales:{y:{beginAtZero:true,stacked:true,grid:{color:'#26294a'}},                                                    //scales describes each axis. y axis start at 0 prevents misleading chart starting at say 50 or so , stacked true lets those with stack be above rather than on top of each other, muted blue gridlines 
            x:{stacked:true,grid:{display:false}}},                                                                      //x axis stacked true lets bars get wide and cozy with each other, no vertical gridlines to mark x axis                   
    plugins:{title:{display:true,text:'Violent – 2025',color:'#fff',font:{size:18}},                                     //plugins: optional featues that define chart's interface. display the title with violent 2025 and white text, large font 
             legend:{labels:{color:'#fff'}}}                                                                             //make a legend with white text
  }
});
function updArrests(){
  const y=+$('#arrestsYear').value, key=$('#arrestsType').value==='Violent'?'violent':'non';                             //y variable is set to value user set for #arrestsYear input ID, key variable is set to what user elected for arrestsType select id, if they said Violent then key = violent, else key = non
  arrestsChart.data.datasets[0].data=arrests[key][y].a;                                                                  //two datasets in datasets array above. element 0 is the arrests. 
  arrestsChart.data.datasets[1].data=arrests[key][y].p;                                                                  //and element 1 is prosecutions. 
  arrestsChart.options.plugins.title.text=`${$('#arrestsType').value} – ${y}`;                                           //title renamed to a template literal of #arrestsType selection, violent or nonviolent and year select set to y 
  arrestsChart.update(); $('#arrestsYearOut').textContent=y;                                                             //.update() method imported from chart js, textContent for label of slider arrestsYearOut changes
}
$('#arrestsYear').oninput=updArrests; $('#arrestsType').onchange=updArrests;                                             //interesting but important feature here: if arrestsYear slider moves, or arrestsType value is selected (i.e not just changed but user has committed to selecting a choice) run update function 

/* ==========================================================
   2 · DA Actions
   ========================================================== */
// const severity = {2020:[250,140],2021:[270,130],2022:[260,125],2023:[255,135],2024:[280,120],2025:[275,150]};            //1 layer object literal
// const outcomes = {2020:[300,55,40,25],2021:[320,60,38,22],2022:[310,58,42,20],
//                   2023:[330,62,37,21],2024:[340,65,35,20],2025:[350,70,34,21]};

const pieOpt=t=>({plugins:{title:{display:true,text:t,color:'#fff',font:{size:18}},legend:{labels:{color:'#fff'}}}});    //pieOpt is a function that takes a string t and makes an options object, t becomes the text within the title within the plguins of the options object  

const sevPie=new Chart($('#severityPie'),{type:'pie',                                                                    //Creates the severity piechart at the #severityPie canvas 
  data:{labels:['Misdemeanor','Felony'],datasets:[{data:severity[2025],backgroundColor:[palette.teal,palette.pink]}]},   //slices of pie chart are misdemeanor and felony, datasets initalize as 2025 misdemeanors and felonies, teal and pink respectively 
  options:pieOpt('Severity – 2025')});                                                                                   //options built from prebuilt options function with Severity – 2025 as title input 

  const outPie=new Chart($('#outcomePie'),{type:'pie',                                                                   //Creates the outcomes piechart at the #outcomePie canvas 
  data:{labels:['Convicted','No Contest','Dropped','Acquitted'],                                                         //slices of pie chart are convicted, no contest, dropped, and acquitted taken from the 2025 key and colored by the backgroundColor array 
        datasets:[{data:outcomes[2025],backgroundColor:[palette.blue,palette.yellow,palette.grey,palette.purple]}]},     //options built from prebuilt options function with Outcomes – 2025 as title input 
  options:pieOpt('Outcomes – 2025')});         

  $('#actionsYear').oninput=e=>{                                                                                         //when actionsYear slider is moved, eventObject is inputted into a function that does the following 
  const y=+e.target.value;                                                                                               //sets a constant Y that takes the value of the eventObject (the year user selected) as a number (+ turns string into number)
  sevPie.data.datasets[0].data=severity[y];                                                                              //sets the only element, element 0, of the sevPie datasets (severity for a given year) to user inputted year y 
  outPie.data.datasets[0].data=outcomes[y];                                                                              //sets the only element, element 0, of the outPie datasets (severity for a given year) to user inputted year y 
  sevPie.options.plugins.title.text=`Severity – ${y}`;                                                                   //changes severity title to user selected year 
  outPie.options.plugins.title.text=`Outcomes – ${y}`;                                                                   //changes outcome title to user selected year 
  sevPie.update(); outPie.update(); $('#actionsYearOut').textContent=y;                                                  //.update() tells chartJS to make a new chart on the updates, textContent changes the year on the slider's label 
};

/* ==========================================================
   3 · Victim Services
   ========================================================== */

const vColors = {                                                                                                          //1 layered object literal, service string keys map to color values 
  'Compensation':      palette.teal,
  'Court Escorts':     palette.pink,
  'Crisis Counseling': palette.yellow
};

const services = Object.keys(victims[2025]);                                                                               //Creates an array of [`Compensation`,`Corut Escorts`,`Crisis Counseling`] keeps array in sync           
let vChart;                                                                                                                //declares an empty chart variable 
function buildVictim(svc,yr){                                                                                              //function takes a service and a year and returns a chart 
  return new Chart($('#victimLine'),{                                                                                      //chart is made in canvas with id #victimLine 
    type:'line',                                                                                                           //line chart 
    data:{labels:months,                                                                                                   //X axis is months array
          datasets:[{label:svc,                                                                                            //legend label is service 
                     data:victims[yr][svc],                                                                                //data mapped to months is the service provided for that year array 
                     borderColor:vColors[svc],                                                                             //border color based on service type 
                     backgroundColor:vColors[svc]+'55',                                                                    //100% opacity turns to 55% opacity for fill, Ask Austin about 6 vs. 8 digit hex for color 
                     fill:true,tension:.3,
                     pointRadius: 3,
                     pointHoverRadius:7,
                     pointBackgroundColor: 'black',
                     animation: false,
                     }]},                                                                              //fill:true fills area below line, tension makes line curvy,
    options:{responsive:true,maintainAspectRatio:false,                                                                    //these two commands allow chart to morph with screen size 
      interaction:{mode: 'index', intersect: false},
      plugins:{tooltip:{enabled:false},title:{display:true,text:`${svc} – ${yr}`,color:'#fff',font:{size:18}},                                     //display the title, white, size 18 template literal of the service dash year 
               legend:{labels:{color:'#fff'}}},                                                                            //make the text for the legend white 
      scales:{y:{beginAtZero:true,grid:{color:'#26294a'}},                                                                 //scales block lets you customize axes. y is going to begin at zero and have muted blue gridlines
              x:{grid:{display:false}}}}                                                                                   //x is not going to have gridlines 
  });
}
function updVictim(){                                                                                                      //define a function to update the values for chart 
  const yr = +$('#victimYear').value, svc = $('#victimType').value;                                                        //grabs the value from the #victimYear slider input, grabs the input value from the #victimType select dropdown 
  vChart?.destroy(); vChart = buildVictim(svc,yr);                                                                         //if chart already built optional chaining ? to clear it and run function to build new one referenced by vChart variable with current slider and dropdown year/service input 
  $('#victimYearOut').textContent = yr;                                                                                    //textContext of label for victimYears slider set to updated year                                                             
}
updVictim();
$('#victimYear').addEventListener('input', updVictim);                                                                                      //run updtChart1 with new year if year slider moved 
$('#victimType').addEventListener('input', updVictim);                                                                                    //run updVictim with new serice type if new #victimType input submitted 

/* ==========================================================
   4 · Special Crimes
   ========================================================== */

let sChart;                                                                                                                //declare sChart variable which will soon reference newest chart 
function buildSpecial(y){                                                                                                  //declare a function to build a chart with year input parameter y 
  return new Chart($('#specialBar'),{                                                                                      //build chart on canvas with #specialBar ID 
    type:'bar',                                                                                                            //bar chart 
    data:{labels:Object.keys(special[y]),                                                                                  //X axis labels is the array of keys for for the year given (these will always be the same)
          datasets:[{data:Object.values(special[y]),                                                                       //data will map to the values array for each corresponding crime 
                     backgroundColor:[palette.purple,palette.orangeF,palette.teal]}]},                                     //Color of each bar corresponding to position of key/value pair in array 
    options:{responsive:true,maintainAspectRatio:false,                                                                    //these two commands allow chart to morph with screen size 
      plugins:{title:{display:true,text:`Special Crimes – ${y}`,color:'#fff',font:{size:18}},                              //display title with template literal of "Special Crimes - {year y}", white in color, size 18 font 
               legend:{display:false}},                                                                                    //no legend since its three independent bars which are already labeled along the X axis 
      scales:{y:{beginAtZero:true,grid:{color:'#26294a'}},                                                                 //Y axis bottom is always 0, gridlines muted blue 
              x:{grid:{display:false}}}}                                                                                   //no vertical gridlines 
  });
}
function updSpecial(){                                                                                                     //declare a function to update the chart 
  const y=+$('#specialYear').value;                                                                                        //declare constant y to be the value inputted by the year slider as a number 
  sChart?.destroy(); sChart=buildSpecial(y);                                                                               //If a chart has been built, clear the canvas and reference sChart to a new chart called by buildSpecial for slider input year y 
  $('#specialYearOut').textContent=y;                                                                                      // textContent of #specialYearOut label for #specialYear is year that slider is set to 
}
updSpecial(); $('#specialYear').oninput=updSpecial;                                                                        //Call the update as soon as the script runs once, then again anytime the #specialYear slider gets user input 

/* ==========================================================
   5 · Narcotics
   ========================================================== */


const sched=['I','II','III','IV'];                                                                                         //Build an array of schedule strings 
const nColors=[palette.pink,palette.blue,palette.yellow,palette.purple];                                                   //Build an array of colors 

const nChart=new Chart($('#narcoticsStack'),{                                                                              //Create a new chart at the canvas with #narcoticsStack id 
  type:'bar',                                                                                                              //Bar chart 
  data:{labels:months,datasets:sched.map((s,i)=>({                                                                         //THIS FUNCTION TO GET DATASETS IS CALLED 4 TIMES IN A FOR EACH LOOP BELOW X axis months array, datasets is automatically 2025 and whichever schedule s is called and its correspodning element 0-3 
    label:`Schedule ${s}`,data:narc[2025][s],backgroundColor:nColors[i],stack:'all'                                        //stack all 4 on top of each other, each get stack string `all`
  }))},
  options:{responsive:true,maintainAspectRatio:false,                                                                      //these two commands allow chart to morph with screen size 
    scales:{y:{beginAtZero:true,stacked:true,grid:{color:'#26294a'}},                                                      //Scales allow custom features for each axis. Y axis begins at 0, all 'all' datasets are stacked, and gridlines are muted blue 
            x:{stacked:true,grid:{display:false}}},                                                                        //X axis "stacked" lets each bar grow wide and close to one another, no vertical gridlines 
    plugins:{title:{display:true,text:'Narcotics Cases by Schedule – 2025',color:'#fff',font:{size:18}},                   //Display a title for 2025 narcotics case by schedule, make it white and font size 18
             legend:{labels:{color:'#fff'}}}}                                                                              //Make legend have white font color 
});
$('#narcYear').oninput=e=>{                                                                                                //grab event object for when slider with ID narcYear has user input (they slide to a new year)
  const y=+e.target.value;                                                                                                 //declare a constant y, let it equal the number form of the value the user slid to in the event slider from its event handler object 
  nChart.data.datasets.forEach((ds,i)=>ds.data=narc[y][sched[i]]);                                                         //Second paramter of for each always does index. So this is saying for each ds in the array of schedules, run that dataset function and choose the color based on the element # i 
  nChart.options.plugins.title.text=`Narcotics Cases by Schedule – ${y}`;                                                  //Change chart title to correct year 
  nChart.update(); $('#narcYearOut').textContent=y;                                                                        //Call chart js update and change textcontext of slider to right year 
};

//stops scrolling from being too bad 
document.querySelectorAll('.link-btn').forEach(link => {                                                                   //grabs all elements with .link-btn class, applies function
  link.addEventListener('click', function(e) {                                                                             //when a link is clicked, the function(e) runs 
    e.preventDefault();                                                                                                    //first, ignore the default behavior of that event object 

    const targetId = this.getAttribute('href').slice(1);                                                                   //let targetId store the following string: take off `#` from value of href attribute like #arrests becomes arrests 
    const targetElement = document.getElementById(targetId);                                                               //declare a variable that targetElement that references whatever element has the id matching with targetId 

    const yOffset = isNavHidden() ? 20 : -100;                                                                             // Use smaller offset if nav is hidden, determined by isNavHidden function                                  
    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;                                    //let y = [difference between top of page and targetElement] + how far you've scrolled already + extra offset determined by navbar presence 

    window.scrollTo({ top: y, behavior: 'smooth' });                                                                       //Scroll down y distance with smooth animation 
  });
});

function isNavHidden() {                                                                                                   //function to determine if navbar is hidden 
  return window.matchMedia("(max-height: 500px) and (min-aspect-ratio: 5/3)").matches;                                     //check if media query properties to get rid of navbar are true 
}



/* ==========================================================
   6 · Test Charts
   ========================================================== */
const hoverBarPlugin = {
  id: 'hoverBar',
  afterDraw(chart, args, options) {
    const { ctx, tooltip, chartArea } = chart;
    if (!tooltip._active || tooltip._active.length === 0) return;

    const active = tooltip._active[0];
    const x = active.element.x;
    const width = 30; // adjust this for wider/narrower bars
    const half = width / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // light gray with low opacity
    ctx.fillRect(x - half, chartArea.top, width, chartArea.bottom - chartArea.top);
    ctx.restore();
  }
};
Chart.register(hoverBarPlugin);

//const services = Object.keys(victims[2025]);                                                                               //Creates an array of [`Compensation`,`Corut Escorts`,`Crisis Counseling`] keeps array in sync           

function buildChart(canvasId, svc, yr) {
  return new Chart($(canvasId), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: svc,
        data: victims[yr][svc],
        borderColor: vColors[svc],
        backgroundColor: vColors[svc] + '55',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 7,
        pointBackgroundColor: 'black',
        animation: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: { enabled: false },
        title: {
          display: true,
          text: `${svc} – ${yr}`,
          color: '#fff',
          font: { size: 18 }
        },
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#26294a', display: true,  }, ticks:{maxTicksLimit: 3} },
        x: { grid: { display: false } }
      }
    }
  });
}
let tChart1, tChart2, tChart3, tChart4;

function updateBothCharts() {
  const yr = +$('#victimYear').value;
  const svc = $('#victimType').value;

  tChart1?.destroy();
  tChart2?.destroy();
  tChart3?.destroy();
  tChart4?.destroy();

  tChart1 = buildChart('#testChart1', svc, 2025);
  tChart2 = buildChart('#testChart2', svc, 2024);
  tChart3 = buildChart('#testChart3', svc, 2023);
  tChart4 = buildChart('#testChart4', svc, 2022);
  

  $('#victimYearOut').textContent = yr;
}
updateBothCharts(); // Initial render

$('#victimYear').addEventListener('input', updateBothCharts);
$('#victimType').addEventListener('input', updateBothCharts);



//const services = Object.keys(victims[2025]);                                                                               //Creates an array of [`Compensation`,`Corut Escorts`,`Crisis Counseling`] keeps array in sync           
// let tChart2;                                                                                                                //declares an empty chart variable 
// function buildtChart2(svc,yr){                                                                                              //function takes a service and a year and returns a chart 
//   return new Chart($('#testChart2'),{                                                                                      //chart is made in canvas with id #victimLine 
//     type:'line',                                                                                                           //line chart 
//     data:{labels:months,                                                                                                   //X axis is months array
//           datasets:[{label:svc,                                                                                            //legend label is service 
//                      data:victims[yr][svc],                                                                                //data mapped to months is the service provided for that year array 
//                      borderColor:vColors[svc],                                                                             //border color based on service type 
//                      backgroundColor:vColors[svc]+'55',                                                                    //100% opacity turns to 55% opacity for fill, Ask Austin about 6 vs. 8 digit hex for color 
//                      fill:true,
//                      tension:.3,
//                      pointRadius: 3,
//                      pointHoverRadius:7,
//                      pointBackgroundColor: 'black',
//                      animation: false,
//                      }]},                                                                              //fill:true fills area below line, tension makes line curvy,
//     options:{responsive:true,
//       maintainAspectRatio:false,                                                                    //these two commands allow chart to morph with screen size 
//       interaction:{mode: 'index',
//          intersect: false},
//       plugins:{tooltip:{enabled:false},
//       title:{display:true,
//         text:`${svc} – ${yr}`,color:'#fff',font:{size:18}},                                     //display the title, white, size 18 template literal of the service dash year 
//                legend:{labels:{color:'#fff'}}},                                                                            //make the text for the legend white 
//       scales:{y:{beginAtZero:true,grid:{color:'#26294a'}},                                                                 //scales block lets you customize axes. y is going to begin at zero and have muted blue gridlines
//               x:{grid:{display:false}}}}                                                                                   //x is not going to have gridlines 
//   });
// }
// function updtChart2(){                                                                                                      //define a function to update the values for chart 
//   const yr = +$('#victimYear').value, svc = $('#victimType').value;                                                        //grabs the value from the #victimYear slider input, grabs the input value from the #victimType select dropdown 
//   tChart2?.destroy(); tChart2 = buildtChart2(svc,yr);                                                                         //if chart already built optional chaining ? to clear it and run function to build new one referenced by vChart variable with current slider and dropdown year/service input 
//   $('#victimYearOut').textContent = yr;                                                                                    //textContext of label for victimYears slider set to updated year                                                             
// }
// updtChart2();
// $('#victimYear').addEventListener('input', updtChart2);                                                                    //run updtChart1 with new year if year slider moved 
// $('#victimType').addEventListener('input', updtChart2);
