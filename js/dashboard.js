function loadDashboard(){


const page = document.getElementById("page");


page.innerHTML = `


<h1>
Dashboard
</h1>



<div class="dashboard-section">


<h2>
Today
</h2>


<div class="cards">


<div class="card">

<h3>
Profit
</h3>

<p class="profit">
+$0.00
</p>

</div>



<div class="card">

<h3>
Win Rate
</h3>

<p>
0%
</p>

</div>



<div class="card">

<h3>
Best Win
</h3>

<p class="profit">
+$0.00
</p>

</div>



<div class="card">

<h3>
Worst Loss
</h3>

<p class="loss">
-$0.00
</p>

</div>



</div>

</div>






<div class="dashboard-section">


<h2>
This Week
</h2>


<div class="cards">


<div class="card">

<h3>
Profit
</h3>

<p class="profit">
+$0.00
</p>

</div>



<div class="card">

<h3>
Win Rate
</h3>

<p>
0%
</p>

</div>


</div>


</div>






<div class="dashboard-section">


<h2>
Total
</h2>


<div class="cards">


<div class="card">

<h3>
Profit
</h3>

<p class="profit">
+$0.00
</p>


</div>



<div class="card">

<h3>
Win Rate
</h3>

<p>
0%
</p>

</div>


</div>


</div>



`;



}