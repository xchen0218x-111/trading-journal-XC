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
totalStats.winRate+"%",
totalStats.winRate>=50
?
"bright-green"
:
"bright-red"
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








<div class="analysis-section">


<h2>

Trading Statistics

</h2>



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





${createTimeAnalysisSection(trades)}



${createEmotionAnalysisSection(trades)}



${createDecisionAnalysisSection(trades)}



${createSymbolAnalysisSection(trades)}



${createPerformanceSection(trades)}



`;



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



<p class="${
getProfitClass({
profit:stats.profitValue,
principal:stats.principal
})
}">

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

averageWin:"+$0.00",

averageLoss:"-$0.00",

bestTrade:"-",

worstTrade:"-"

};


}




let profit=0;

let principal=0;

let wins=[];

let losses=[];


let bestTrade=null;

let worstTrade=null;




trades.forEach(t=>{


const p =
Number(t.profit)||0;



profit+=p;


principal+=Number(t.principal)||0;




if(p>0){

wins.push(p);

}



if(p<0){

losses.push(p);

}




if(!bestTrade || p>bestTrade.profit){

bestTrade={

symbol:t.symbol,

profit:p

};

}



if(!worstTrade || p<worstTrade.profit){

worstTrade={

symbol:t.symbol,

profit:p

};

}



});





const avgWin =

wins.length

?

wins.reduce((a,b)=>a+b,0)/wins.length

:

0;




const avgLoss =

losses.length

?

losses.reduce((a,b)=>a+b,0)/losses.length

:

0;





return {


count:trades.length,


winCount:wins.length,


lossCount:losses.length,



profit:

(profit>=0?"+$":"-$")
+
Math.abs(profit).toFixed(2),



profitValue:profit,


principal:principal,



winRate:

((wins.length/trades.length)*100)
.toFixed(1),



averageWin:

"+$"+avgWin.toFixed(2),



averageLoss:

"-$"+Math.abs(avgLoss).toFixed(2),



bestTrade:

bestTrade

?

bestTrade.symbol+
" +$"+
bestTrade.profit.toFixed(2)

:

"-",




worstTrade:

worstTrade

?

worstTrade.symbol+
" -$"+
Math.abs(worstTrade.profit).toFixed(2)

:

"-"



};



}









function createTimeAnalysisSection(trades){



const sessions={


"Opening Session (9-11 AM)":[],

"Midday Session (11 AM-2 PM)":[],

"Afternoon Session (2 PM-Close)":[]


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


sessions["Opening Session (9-11 AM)"].push(t);


}

else if(hour>=11 && hour<14){


sessions["Midday Session (11 AM-2 PM)"].push(t);


}

else if(hour>=14){


sessions["Afternoon Session (2 PM-Close)"].push(t);


}



});





let html="";




Object.keys(sessions).forEach(name=>{


const stats =
calculateAnalysisStats(
sessions[name]
);



html += `


<div class="analysis-box">


<h3>

${name}

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

Time Performance

</div>



<div class="analysis-grid">

${html}

</div>


</div>


`;

}

function createEmotionAnalysisSection(trades){



const emotions={};



trades.forEach(t=>{


const emotion =
t.emotion || "Unknown";



if(!emotions[emotion]){


emotions[emotion]=[];

}



emotions[emotion].push(t);



});





let html="";




Object.keys(emotions).forEach(emotion=>{


const stats =
calculateAnalysisStats(
emotions[emotion]
);



html += `


<div class="analysis-box">


<h3>

${emotion}

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



const decisions={};



trades.forEach(t=>{


const decision =
t.decision || "Unknown";



if(!decisions[decision]){


decisions[decision]=[];

}



decisions[decision].push(t);



});





let html="";




Object.keys(decisions).forEach(decision=>{


const stats =
calculateAnalysisStats(
decisions[decision]
);



html += `


<div class="analysis-box">


<h3>

${decision}

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




Object.keys(symbols).forEach(symbol=>{


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

function createPerformanceSection(trades){


const sorted =
[...trades].sort(
(a,b)=>
new Date(a.date+" "+a.time)
-
new Date(b.date+" "+b.time)
);



let cumulative=0;


let points=[];


sorted.forEach((t,index)=>{


cumulative += Number(t.profit)||0;



points.push({

trade:index+1,

profit:cumulative

});


});





let html="";



points.slice(-10).forEach(p=>{


html += `

<p>

Trade ${p.trade}

:
${
p.profit>=0?"+$":"-$"
}

${Math.abs(p.profit).toFixed(2)}

</p>

`;



});





const stats =
calculateAnalysisStats(trades);





return `



<div class="analysis-panel">


<div class="analysis-panel-title">

Performance Analysis

</div>




<div class="analysis-grid">



<div class="analysis-box">


<h3>

Win / Loss

</h3>



<p>

Winning Trades:

${stats.winCount}

</p>



<p>

Losing Trades:

${stats.lossCount}

</p>



<p>

Win Rate:

${stats.winRate}%

</p>



</div>





<div class="analysis-box">


<h3>

Profit Curve (Last Trades)

</h3>



${

html ||

"<p>No data</p>"

}



</div>



</div>



</div>



`;

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


const date =
new Date(
t.date+"T00:00:00"
);



return date>=monday;



});



}