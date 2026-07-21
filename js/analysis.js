function loadAnalysis(){


const page =
document.getElementById("page");


const trades =
getTrades();



const today =
new Date()
.toISOString()
.split("T")[0];



const todayTrades =
trades.filter(t=>t.date===today);



const weekTrades =
getThisWeekTradesAnalysis(trades);



const todayStats =
calculateAnalysisStats(todayTrades);


const weekStats =
calculateAnalysisStats(weekTrades);


const totalStats =
calculateAnalysisStats(trades);




page.innerHTML = `


<h1>
Analysis
</h1>



<div class="analysis-panel">


<div class="analysis-panel-title">

Performance Overview

</div>



<div class="analysis-summary">


${analysisCard(
"Total Profit",
totalStats.profit,
getProfitClass({
profit:totalStats.profitValue,
principal:totalStats.principal
})
)}



${analysisCard(
"Win Rate",
totalStats.winRate+"%"
)}



${analysisCard(
"Total Trades",
totalStats.count
)}



${analysisCard(
"Best Trade",
totalStats.bestTrade
)}



</div>


</div>





<div class="analysis-panel">


<div class="analysis-panel-title">

Trading Statistics

</div>


<div class="analysis-grid">


${createStatPanel(
"Today",
todayStats
)}


${createStatPanel(
"This Week",
weekStats
)}


${createStatPanel(
"Total",
totalStats
)}


</div>


</div>





${createPerformanceSection(trades)}



${createTimeAnalysisSection(trades)}



${createEmotionAnalysisSection(trades)}



${createDecisionAnalysisSection(trades)}



${createSymbolAnalysisSection(trades)}



`;





setTimeout(()=>{


createEquityChart(trades);


createWinLossChart(trades);


createSessionProfitChart(trades);


createSessionWinRateChart(trades);


},100);



}





function analysisCard(title,value,color=""){


return `


<div class="card">


<h3>
${title}
</h3>


<p class="${color}">

${value}

</p>


</div>


`;

}




function createStatPanel(title,stats){


return `


<div class="analysis-box">


<h3>

${title}

</h3>



<p>
Trades:
${stats.count}
</p>



<p>
Win Rate:
${stats.winRate}%
</p>



<p class="${getProfitClass({
profit:stats.profitValue,
principal:stats.principal
})}">

Profit:
${stats.profit}

</p>



<p>

Best:
${stats.bestTrade}

</p>



<p>

Worst:
${stats.worstTrade}

</p>



</div>


`;

}

function calculateAnalysisStats(trades){


if(!trades.length){


return {

count:0,

winCount:0,

lossCount:0,

profit:"+$0.00",

profitValue:0,

principal:0,

winRate:0,

bestTrade:"-",

worstTrade:"-"

};


}



let profit=0;

let principal=0;

let wins=0;

let losses=0;

let best=null;

let worst=null;



trades.forEach(t=>{


const p =
Number(t.profit)||0;


profit += p;


principal += Number(t.principal)||0;



if(p>0){

wins++;

}



if(p<0){

losses++;

}



if(!best || p>best.profit){

best={

symbol:t.symbol,

profit:p

};

}



if(!worst || p<worst.profit){

worst={

symbol:t.symbol,

profit:p

};

}



});





return {


count:trades.length,


winCount:wins,


lossCount:losses,



profit:
(profit>=0?"+$":"-$")
+
Math.abs(profit).toFixed(2),



profitValue:profit,


principal:principal,



winRate:
((wins/trades.length)*100)
.toFixed(1),



bestTrade:

best

?

best.symbol+
" +$"+
best.profit.toFixed(2)

:

"-",




worstTrade:

worst

?

worst.symbol+
" -$"+
Math.abs(worst.profit).toFixed(2)

:

"-"



};


}







function createPerformanceSection(trades){


return `


<div class="analysis-panel">


<div class="analysis-panel-title">

Performance Charts

</div>



<div class="analysis-grid">



<div class="chart-container">


<canvas id="equityChart"></canvas>


</div>




<div class="chart-container">


<canvas id="winLossChart"></canvas>


</div>



</div>



</div>



`;

}

function createTimeAnalysisSection(trades){


return `


<div class="analysis-panel">


<div class="analysis-panel-title">

Time Performance

</div>



<div class="analysis-grid">


<div class="chart-container">

<canvas id="sessionProfitChart"></canvas>

</div>



<div class="chart-container">

<canvas id="sessionWinRateChart"></canvas>

</div>



</div>


</div>


`;

}

function createEmotionAnalysisSection(trades){


const data={};



trades.forEach(t=>{


const key =
t.emotion || "Unknown";


if(!data[key]){

data[key]=[];

}


data[key].push(t);


});



let html="";



Object.keys(data)
.forEach(key=>{


const stats =
calculateAnalysisStats(
data[key]
);



html += `


<div class="analysis-box">


<h3>
${key}
</h3>


<p>

Trades:
${stats.count}

</p>


<p>

Win Rate:
${stats.winRate}%

</p>


<p class="${
getProfitClass({
profit:stats.profitValue,
principal:stats.principal
})
}">

Profit:

${stats.profit}

</p>


</div>



`;



});





return `


<div class="analysis-panel">


<div class="analysis-panel-title">

Emotion Analysis

</div>



<div class="analysis-grid">


${html}


</div>



</div>


`;

}








function createDecisionAnalysisSection(trades){


const data={};



trades.forEach(t=>{


const key =
t.decision || "Unknown";


if(!data[key]){

data[key]=[];

}


data[key].push(t);


});



let html="";



Object.keys(data)
.forEach(key=>{


const stats =
calculateAnalysisStats(
data[key]
);



html += `


<div class="analysis-box">


<h3>

${key}

</h3>


<p>

Trades:
${stats.count}

</p>


<p>

Win Rate:
${stats.winRate}%

</p>


<p class="${
getProfitClass({
profit:stats.profitValue,
principal:stats.principal
})
}">

Profit:
${stats.profit}

</p>


</div>


`;



});



return `


<div class="analysis-panel">


<div class="analysis-panel-title">

Decision Analysis

</div>



<div class="analysis-grid">


${html}


</div>



</div>



`;

}








function createSymbolAnalysisSection(trades){


const symbols={};



trades.forEach(t=>{


const symbol =
t.symbol || "Unknown";


if(!symbols[symbol]){

symbols[symbol]=[];

}


symbols[symbol].push(t);


});



let html="";



Object.keys(symbols)
.forEach(symbol=>{


const stats =
calculateAnalysisStats(
symbols[symbol]
);



html += `


<div class="analysis-box">


<h3>

${symbol}

</h3>


<p>

Trades:
${stats.count}

</p>


<p>

Win Rate:
${stats.winRate}%

</p>


<p class="${
getProfitClass({
profit:stats.profitValue,
principal:stats.principal
})
}">

Profit:

${stats.profit}

</p>


</div>



`;



});



return `


<div class="analysis-panel">


<div class="analysis-panel-title">

Symbol Performance

</div>



<div class="analysis-grid">


${html}


</div>



</div>



`;

}









let equityChart=null;


function createEquityChart(trades){



const sorted =
[...trades].sort(
(a,b)=>

new Date(
a.date+" "+a.time
)

-

new Date(
b.date+" "+b.time
)

);




let total=0;


let labels=[];


let values=[];



sorted.forEach((t,i)=>{


total += Number(t.profit)||0;


labels.push(
"Trade "+(i+1)
);


values.push(total);


});



const ctx =
document.getElementById(
"equityChart"
);



if(!ctx){

return;

}



if(equityChart){

equityChart.destroy();

}



equityChart =
new Chart(
ctx,
{


type:"line",


data:{


labels:labels,


datasets:[{

label:"Cumulative Profit",

data:values,

tension:0.3

}]


},



options:{


responsive:true


}


}

);



}








let winLossChart=null;



function createWinLossChart(trades){



const wins =
trades.filter(
t=>Number(t.profit)>0
).length;



const losses =
trades.filter(
t=>Number(t.profit)<0
).length;



const ctx =
document.getElementById(
"winLossChart"
);



if(!ctx){

return;

}



if(winLossChart){

winLossChart.destroy();

}



winLossChart =
new Chart(
ctx,
{


type:"doughnut",


data:{


labels:[

"Win",

"Loss"

],


datasets:[{

data:[

wins,

losses

]

}]


},



options:{


responsive:true,


plugins:{


legend:{


position:"bottom"


}


}


}


}

);



}







function getThisWeekTradesAnalysis(trades){


const now =
new Date();


const day =
now.getDay() || 7;



const monday =
new Date(

now.getFullYear(),

now.getMonth(),

now.getDate()-day+1

);



monday.setHours(
0,
0,
0,
0
);



return trades.filter(t=>{


const d =
new Date(
t.date+"T00:00:00"
);



return d>=monday;



});



}

function getTradingSessions(trades){


const sessions={


"Opening 9-11":[],

"Midday 11-2":[],

"Afternoon 2-Close":[]


};



trades.forEach(t=>{


if(!t.time){

return;

}



const hour =
Number(
t.time.split(":")[0]
);



if(hour>=9 && hour<11){


sessions["Opening 9-11"].push(t);


}
else if(hour>=11 && hour<14){


sessions["Midday 11-2"].push(t);


}
else if(hour>=14){


sessions["Afternoon 2-Close"].push(t);


}


});



return sessions;


}






let sessionProfitChart=null;


function createSessionProfitChart(trades){



const sessions =
getTradingSessions(trades);



const labels =
Object.keys(sessions);



const values =
labels.map(label=>{


return sessions[label]
.reduce(
(sum,t)=>
sum+(Number(t.profit)||0),
0
);


});





const ctx =
document.getElementById(
"sessionProfitChart"
);



if(!ctx){

return;

}



if(sessionProfitChart){

sessionProfitChart.destroy();

}



sessionProfitChart =
new Chart(
ctx,
{


type:"bar",



data:{


labels:labels,


datasets:[{

label:"Profit",

data:values

}]


},



options:{


responsive:true,


plugins:{


legend:{


display:false


}


}


}



}

);



}









let sessionWinRateChart=null;



function createSessionWinRateChart(trades){



const sessions =
getTradingSessions(trades);



const labels =
Object.keys(sessions);



const values =
labels.map(label=>{


const list =
sessions[label];


if(!list.length){

return 0;

}



const wins =
list.filter(
t=>Number(t.profit)>0
)
.length;



return Number(
(
wins/list.length*100
)
.toFixed(1)
);



});





const ctx =
document.getElementById(
"sessionWinRateChart"
);



if(!ctx){

return;

}



if(sessionWinRateChart){

sessionWinRateChart.destroy();

}



sessionWinRateChart =
new Chart(
ctx,
{


type:"bar",



data:{


labels:labels,


datasets:[{

label:"Win Rate %",

data:values

}]


},



options:{


responsive:true,


plugins:{


legend:{


display:false


}


}



}



}

);



}