let selectedDay = null;

let currentAssetType = "Stock";




function loadCalendar(){


const page =
document.getElementById("page");



page.innerHTML = `


<h1>
Calendar
</h1>




<div class="calendar-toolbar">


<button 
onclick="changeAssetType('Stock')"
class="${currentAssetType==="Stock"?"active":""}">
Stock
</button>



<button 
onclick="changeAssetType('Future')"
class="${currentAssetType==="Future"?"active":""}">
Future
</button>




<button 
onclick="changeAssetType('ETF')"
class="${currentAssetType==="ETF"?"active":""}">
ETF
</button>


</div>






<div class="calendar-container">


<h2>
July 2026
</h2>




<div class="weekdays">

<div>Mon</div>
<div>Tue</div>
<div>Wed</div>
<div>Thu</div>
<div>Fri</div>
<div>Sat</div>
<div>Sun</div>

</div>





<div class="calendar-grid">

${generateCalendarDays()}

</div>



<div id="day-details"></div>



</div>








<div class="trade-area">





<div class="add-trade">


<h2>
Add Trade
</h2>





<label>

Trade Date & Time

</label>



<input

id="trade-datetime"

placeholder="2026/7/20 15:01:30"

>








<label>
Asset Type
</label>



<select id="asset-type">


<option>Stock</option>

<option>Future</option>

<option>ETF</option>


</select>







<label>
Trade Text
</label>



<textarea

id="trade-text"

placeholder="Paste your trade description here"

></textarea>








<label>
Emotion
</label>



<select id="emotion">


<option>Neutral</option>

<option>Confident</option>

<option>Fear</option>

<option>Greedy</option>

<option>Excited</option>

<option>Regret</option>


</select>








<label>
Decision Type
</label>



<select id="decision">


<option>Self</option>

<option>Trade Follow</option>


</select>







<label>
Note
</label>



<textarea id="trade-note"></textarea>








<button onclick="handleTradeParse()">

Parse Trade

</button>



<div id="parse-result"></div>




</div>









<div class="history">


<h2>
Trade History
</h2>





<table>


<tbody id="trade-history">


${renderTradeHistory()}


</tbody>


</table>


</div>






</div>



`;



}





function changeAssetType(type){


currentAssetType = type;


loadCalendar();


}





function getCurrentTrades(){


return getTrades()

.filter(t=>

t.assetType===currentAssetType

);


}






function generateCalendarDays(){


let html="";



for(let i=1;i<=31;i++){


html += `


<div class="day"

onclick="selectDay(${i},this)"

>



<span>

${i}

</span>




<p class="${getDailyProfitClass(i)}">

${getDailyProfit(i)}

</p>



</div>


`;

}


return html;


}







function getDailyProfit(day){


let profit=0;



getCurrentTrades()

.forEach(t=>{


if(

t.date &&

t.date.endsWith(

"-"+String(day).padStart(2,"0")

)

){


profit += Number(t.profit)||0;


}


});




if(profit===0){

return "";

}




return (

profit>0?"+$":"-$"

)

+

Math.abs(profit).toFixed(2);



}







function getDailyProfitClass(day){


const trades =

getCurrentTrades()

.filter(t=>

t.date &&

t.date.endsWith(

"-"+String(day).padStart(2,"0")

)

);




if(!trades.length){

return "";

}



let profit=0;

let principal=0;



trades.forEach(t=>{


profit += Number(t.profit)||0;


principal += Number(t.principal)||0;


});




return getProfitClass({

profit,

principal

});


}





function selectDay(day,element){


if(selectedDay===day){


document

.getElementById("day-details")

.innerHTML="";


element.classList.remove("selected");


selectedDay=null;


return;


}




document

.querySelectorAll(".day")

.forEach(d=>{

d.classList.remove("selected");

});




element.classList.add("selected");


selectedDay=day;





const trades =

getCurrentTrades()

.filter(t=>

t.date &&

t.date.endsWith(

"-"+String(day).padStart(2,"0")

)

);





document.getElementById("day-details").innerHTML = `


<div class="day-info">


<h2>

July ${day}, 2026

</h2>




${
trades.length

?

trades.map(t=>`


<div class="info-card">


<b>${t.symbol}</b>


<br>


${t.type}



<span class="${getProfitClass(t)}">


${t.profit>=0?"+$":"-$"}

${Math.abs(t.profit).toFixed(2)}


</span>


</div>


`).join("")


:

"<p>No trades</p>"

}



</div>


`;



}

function handleTradeParse(){


const text =

document.getElementById("trade-text").value;



const trade =

parseTradeText(text);




const datetime =

document.getElementById("trade-datetime").value;



const parsed =

parseTradeDateTime(datetime);



trade.date =

parsed.date;



trade.time =

parsed.time;



trade.assetType =

document.getElementById("asset-type").value;



trade.emotion =

document.getElementById("emotion").value;



trade.decision =

document.getElementById("decision").value;



trade.note =

document.getElementById("trade-note").value;



trade.marked=false;



saveTrade(trade);



alert("Trade Saved");



refreshCalendar();


}






function parseTradeDateTime(input){


if(!input){


return {

date:"",

time:""

};


}



const parts =

input.trim().split(" ");



const datePart = parts[0];

const timePart = parts[1] || "00:00";



const dateArray =

datePart.split("/");



if(dateArray.length!==3){


return {

date:"",

time:""

};


}



const year=dateArray[0];

const month=

String(dateArray[1]).padStart(2,"0");


const day=

String(dateArray[2]).padStart(2,"0");



return {


date:

`${year}-${month}-${day}`,


time:

timePart.substring(0,5)


};



}







function renderTradeHistory(){


const trades =

getCurrentTrades();




if(!trades.length){


return `


<tr>

<td colspan="8">

No trades yet

</td>

</tr>


`;



}




return `



<tr>


<th>
⭐
</th>


<th>
Date & Time
</th>


<th>
Symbol
</th>


<th>
Type
</th>


<th>
Profit
</th>


<th>
Note
</th>


<th>
Edit
</th>


<th>
Delete
</th>


</tr>



`

+

trades.map(t=>`



<tr>



<td>



<button

class="star-btn ${t.marked?"marked":""}"

onclick="toggleStar('${t.id}')"

>


${t.marked?"★":"☆"}


</button>



</td>





<td>


${t.date}


<br>


<span>

${t.time || "-"}

</span>


</td>






<td>

${t.symbol || "-"}

</td>





<td>

${t.type || "-"}

</td>





<td>


<span class="${getProfitClass(t)}">


${t.profit>=0?"+$":"-$"}

${Math.abs(t.profit).toFixed(2)}


</span>


</td>






<td class="note-column">


${t.note || "-"}


</td>






<td>


<button

class="icon-btn edit-btn"

onclick="editTrade('${t.id}')"

>

✏️

</button>


</td>






<td>


<button

class="icon-btn delete-btn"

onclick="removeTrade('${t.id}')"

>

🗑️

</button>


</td>






</tr>



`).join("");



}







function toggleStar(id){


toggleMarkTrade(id);


refreshCalendar();


}





function removeTrade(id){


if(!confirm("Delete this trade?")){


return;


}



deleteTrade(id);



refreshCalendar();


}







function editTrade(id){


const trade =

getTrades()

.find(t=>t.id===id);



if(!trade){

return;

}





document.body.insertAdjacentHTML(

"beforeend",

`

<div class="edit-modal" id="edit-modal">


<div class="edit-box">


<h2>

Edit Trade

</h2>



<label>

Date & Time

</label>


<input

id="edit-datetime"

value="${trade.date || ""} ${trade.time || ""}"

>




<label>

Symbol

</label>


<input

id="edit-symbol"

value="${trade.symbol || ""}"

>




<label>

Type

</label>


<input

id="edit-type"

value="${trade.type || ""}"

>



<label>

Entry Price

</label>


<input

id="edit-entry"

value="${trade.entry || ""}"

>




<label>

Close Price

</label>


<input

id="edit-close"

value="${trade.close || ""}"

>




<label>

Quantity

</label>


<input

id="edit-quantity"

value="${trade.quantity || ""}"

>



<label>

Emotion

</label>


<input

id="edit-emotion"

value="${trade.emotion || ""}"

>




<label>

Decision

</label>


<input

id="edit-decision"

value="${trade.decision || ""}"

>




<label>

Note

</label>


<textarea id="edit-note">

${trade.note || ""}

</textarea>





<button onclick="saveEditTrade('${trade.id}')">

Save

</button>




<button onclick="closeEditModal()">

Cancel

</button>




</div>


</div>


`

);



}








function saveEditTrade(id){


const trades=getTrades();



const trade =

trades.find(t=>t.id===id);



const parsed =

parseTradeDateTime(

document.getElementById("edit-datetime").value

);



trade.date = parsed.date;


trade.time = parsed.time;



trade.symbol =

document.getElementById("edit-symbol").value;



trade.type =

document.getElementById("edit-type").value;



trade.entry =

Number(

document.getElementById("edit-entry").value

)||0;



trade.close =

Number(

document.getElementById("edit-close").value

)||0;



trade.quantity =

Number(

document.getElementById("edit-quantity").value

)||0;



trade.emotion =

document.getElementById("edit-emotion").value;



trade.decision =

document.getElementById("edit-decision").value;



trade.note =

document.getElementById("edit-note").value;



if(trade.type==="Long"){


trade.profit =

(trade.close-trade.entry)

*

trade.quantity;


}



if(trade.type==="Short"){


trade.profit =

(trade.entry-trade.close)

*

trade.quantity;


}




trade.principal =

trade.entry * trade.quantity;



updateTrade(trade);



closeEditModal();


refreshCalendar();


}







function closeEditModal(){


const modal =

document.getElementById("edit-modal");



if(modal){


modal.remove();


}


}







function refreshCalendar(){


loadCalendar();


}





function getProfitClass(trade){



const ratio =

trade.principal

?

trade.profit/trade.principal

:

0;



if(trade.profit>0){



if(ratio>=0.05){

return "bright-green";

}



return "dark-green";


}



if(trade.profit<0){



if(Math.abs(ratio)>0.03){

return "bright-red";

}



return "dark-red";


}



return "";


}