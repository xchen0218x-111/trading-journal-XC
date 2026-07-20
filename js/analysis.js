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
trades.filter(t=>
t.date===today
);



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





${createAnalysisSection(
"Today Trading Info",
todayStats
)}





${createAnalysisSection(
"This Week Trading Info",
weekStats
)}





${createAnalysisSection(
"Total Trading Info",
totalStats
)}


${createPerformanceSection(trades)}

${createTimeAnalysisSection(trades)}

${createEmotionAnalysisSection(trades)}

${createDecisionAnalysisSection(trades)}

${createSymbolAnalysisSection(trades)}

`;



}









function createAnalysisSection(title,stats){



return `


<div class="dashboard-section">


<h2>

${title}

</h2>




<div class="cards">



${analysisCard(
"Trades",
stats.count
)}



${analysisCard(
"Win Trades",
stats.winCount
)}



${analysisCard(
"Loss Trades",
stats.lossCount
)}



${analysisCard(
"Profit",
stats.profit,
stats
)}



${analysisCard(
"Win Rate",
stats.winRate+"%"
)}



${analysisCard(
"Average Win",
stats.averageWin,
stats.averageWinValue>0
?
"bright-green"
:
""
)}



${analysisCard(
"Average Loss",
stats.averageLoss,
stats.averageLossValue<0
?
"bright-red"
:
""
)}



${analysisCard(
"Best Trade",
stats.bestTrade
)}



${analysisCard(
"Worst Trade",
stats.worstTrade
)}




</div>


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


averageWinValue:0,

averageLossValue:0,


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



profit += p;


principal += Number(t.principal)||0;



if(p>0){

wins.push(p);


}



if(p<0){

losses.push(p);


}





if(
!bestTrade ||
p>bestTrade.profit
){

bestTrade={

symbol:t.symbol,

profit:p

};


}





if(
!worstTrade ||
p<worstTrade.profit
){

worstTrade={

symbol:t.symbol,

profit:p

};


}




});







const averageWin =

wins.length

?

wins.reduce((a,b)=>a+b,0)
/
wins.length

:

0;




const averageLoss =

losses.length

?

losses.reduce((a,b)=>a+b,0)
/
losses.length

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

"+$"+averageWin.toFixed(2),



averageLoss:

"-$"+Math.abs(averageLoss).toFixed(2),



averageWinValue:averageWin,


averageLossValue:averageLoss,





bestTrade:

bestTrade

?

bestTrade.symbol
+
" +$"
+
bestTrade.profit.toFixed(2)

:

"-",




worstTrade:

worstTrade

?

worstTrade.symbol
+
" -$"
+
Math.abs(worstTrade.profit).toFixed(2)

:

"-"



};



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

function createPerformanceSection(trades){


let balance=0;


let points=[];


trades
.sort((a,b)=>
new Date(a.date)-new Date(b.date)
)
.forEach((t,index)=>{


balance += Number(t.profit)||0;


points.push(balance);


});



const max =
Math.max(...points,0);



const win =
trades.filter(t=>t.profit>0).length;



const loss =
trades.filter(t=>t.profit<0).length;



const winPercent =

trades.length

?

(win/trades.length)*100

:

0;




return `


<div class="analysis-grid">



<div class="analysis-box">


<h3>
Profit Curve
</h3>


<div class="big-number">

+$${balance.toFixed(2)}

</div>



<div class="chart-bar">

<div

class="chart-progress"

style="width:${Math.min(winPercent,100)}%"

>

</div>

</div>


</div>





<div class="analysis-box">


<h3>
Win / Loss Distribution
</h3>


<p>

Winning Trades:

${win}

</p>


<p>

Losing Trades:

${loss}

</p>


<p>

Win Rate:

${winPercent.toFixed(1)}%

</p>



</div>



</div>


`;

}

function createTimeAnalysisSection(trades){


const sessions = {


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



let bestSession="";

let bestProfit=-Infinity;



Object.keys(sessions).forEach(name=>{


const stats =
calculateAnalysisStats(
sessions[name]
);



if(stats.profitValue>bestProfit){

bestProfit=
stats.profitValue;

bestSession=name;

}



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



<div class="dashboard-section">


<h2>

Time Performance Analysis

</h2>




<div class="analysis-grid">


${html}


</div>




<div class="analysis-box">


<h3>

Your Best Session

</h3>



<div class="big-number">

${bestSession || "-"}

</div>



</div>



</div>



`;

}

function createEmotionAnalysisSection(trades){


const emotions = {};



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



<p>

Average Win:

${stats.averageWin}

</p>



<p>

Average Loss:

${stats.averageLoss}

</p>



</div>



`;



});







return `


<div class="dashboard-section">


<h2>

Emotion Analysis

</h2>




<div class="analysis-grid">


${html}


</div>



</div>



`;

}

function createDecisionAnalysisSection(trades){



const decisions = {};



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



<p>

Average Win:

${stats.averageWin}

</p>



<p>

Average Loss:

${stats.averageLoss}

</p>



</div>



`;



});






return `



<div class="dashboard-section">


<h2>

Decision Analysis

</h2>



<div class="analysis-grid">


${html}


</div>



</div>



`;

}

function createSymbolAnalysisSection(trades){



const symbols = {};



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



<p>

Average Win:

${stats.averageWin}

</p>



<p>

Average Loss:

${stats.averageLoss}

</p>



</div>


`;



});






return `



<div class="dashboard-section">


<h2>

Symbol Performance

</h2>



<div class="analysis-grid">


${html}


</div>



</div>



`;

}