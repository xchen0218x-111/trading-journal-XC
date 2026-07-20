const app = document.getElementById("app");


app.innerHTML = `


<div class="sidebar">

<h2>
Trading Journal
</h2>


<div class="menu">

<div onclick="loadDashboard()">
📊 Dashboard
</div>


<div onclick="loadCalendar()">
📅 Calendar
</div>


<div onclick="loadAnalysis()">
📈 Analysis
</div>


<div onclick="loadSetting()">
⚙ Setting
</div>


</div>


</div>



<div class="content" id="page">

</div>


`;



// Default page

loadDashboard();
