<template>
<div>
    <div class="row" style="margin-top:50px; min-height:50vh;margin-left:20px;margin-right:20px;">      
		<div v-show="graphData.length > 0" class="col-12 col-md-10 offset-md-1"  style="margin-top:20px;">
			<h3>AWS services used in the last day</h3>
			<br>
			<br>   
			<div style="position: relative; height:70vh; width:80vw">     
				<canvas id="myChart"></canvas>       
			</div>
		</div>
    </div>
    <div v-show="graphData.length > 0" class="row" style="margin-bottom:40px;">
		<div id="accordion" class="col-md-10 offset-md-1">
			<div>
				<div id="headingOne">
					<h5 class="mb-0">
					<button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						<i class="fas fa-info-circle"></i>
						Details
					</button>
					</h5>
				</div>

				<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
					<div class="card-body">
						<table id="table-details" class="stripe" style="width:100%">
						</table>
					</div>
				</div>
			</div>
		</div>      
    </div>
</div>    
</template>

<script>
import jwtDecode from "jwt-decode";
import vSelect from "vue-select";

export default {  
	data() {
		return {
		token: "Loading token..",
		user: {},			
		all_data: [],
		max: 0,
		all_services: [],
		start_date: "",
		end_date: "",
		graphData: [],		
		no_result: false,		
		processing: false,
		table: ""
		};
	},
	watch: {
		$route(val) {
		for (let i in this.itemNavs) {
			this.itemNavs[i].selected = val.fullPath == this.itemNavs[i].path;
		}
		}
	},
	created() {
		this.$cognitoAuth.getIdToken((err, jwtToken) => {
		if (err) {
			console.log("Dashboard: Couldn't get the session:", err, err.stack);
			return;
		}
		this.token = jwtDecode(jwtToken);
		this.user = this.$cognitoAuth.getCurrentUser();
		document.getElementsByName("token")["0"].content = jwtToken;
		//console.log(jwtToken)
		});
		var _this = this;
		axios.get(" https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/services")
		.then(function(resp) {
			for (var i in resp.data) {
				_this.all_services[resp.data[i]] = {
					name: resp.data[i],
					count: 0
				};
			}
		});
		this.end_date = moment().format("YYYY-MM-DD");
		this.start_date = moment().add(-1, "day");
		this.start_date = this.start_date.format("YYYY-MM-DD");
		console.log(this.start_date);

		axios.get("https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/scan?from=" +	this.start_date +"&to=" +this.end_date)
		.then(function(resp) {
			_this.search(resp);
		});
	},

	methods: {
		search(resp) {
		var _this = this;
		this.graphData = [];
		this.all_data = [];
		
		for (var i in resp.data) {			
			var datatime = resp.data[i].eventTime;
			var time = moment(datatime,'YYYY-MM-DDTHH:mm:ssZ').format('HH:mm:ss DD-MM-YYYY');
			this.all_data.push([i,resp.data[i].userIdentity_userName,resp.data[i].eventName,time]);
		}
		for (var i in _this.all_services) {
			_this.all_services[i].count = 0;
		}
		
		for (var i in resp.data) {
			var data2 = resp.data[i].eventSource;
			var service = data2.split(".");
			_this.all_services[service[0]].count =
			_this.all_services[service[0]].count + 1;
		}

		for (var i in _this.all_services) {
			if (_this.all_services[i].count > 0) {
				_this.graphData.push([_this.all_services[i].name,_this.all_services[i].count]);
			}
		}
		
		if (_this.graphData.length > 0) {
			_this.no_result = false;			
			_this.drawGraph();
			_this.$nextTick(function() {
				$("#table-details").dataTable().fnClearTable();
				$("#table-details").dataTable().fnAddData(_this.all_data);
				$("#table-details").dataTable().fnDraw();			
			});
		} else {
			_this.no_result = true;
		}
		_this.processing = false;
		},
		drawGraph() {
			//finding max value of array
			this.max = 0;
			for (var i in this.graphData) {
				if (this.max < this.graphData[i][1]) {
				this.max = this.graphData[i][1];
				}
			}	
			var ctx = $("#myChart");
			var myChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: this.graphData.map(graphData => graphData[0]),
					datasets: [
						{
						label: "Services",
						backgroundColor: "rgba(54,162,235, 0.2)",
						borderColor: "rgba(5,71,212,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(72,126,240,0.5)",
						hoverBorderColor: "rgba(212,52,5,1)",
						data: this.graphData.map(graphData => graphData[1])
						}
					]
				},

				options: {
					animation: {
						duration: 2000
					},
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					plugins: {
						datalabels: {
							align: "end",
							anchor: "top",
							backgroundColor: null,
							borderColor: null,
							borderRadius: 4,
							borderWidth: 1,
							color: "#000",					
							font: {
								size:14,
								weight: "bold"
							},
							offset: 4,
							padding: 0,
							formatter: Math.round					
						}
					},
					
					tooltips: {
						position: "nearest",
						titleFontSize: 14,
						bodyFontSize: 14
					},
					scales: {
						yAxes: [
						{
							display: true,
							scaleLabel: {
								display: true,
								labelString: "# times",
								fontColor: "#000",
								fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
								fontSize: 16
							},
							callback: function(value) {
								if (Number.isInteger(value)) {
									return value;
								}
							},
							gridLines: {
								display: true,
								color: "rgba(220,227,241,1)"
								},
							ticks: {
								beginAtZero: true,							
								fontColor: "#000",
								min: 0,
								stepSize: Math.ceil(this.max / 2),
								max: this.max + Math.ceil(this.max / 2)
							}
						}
						],
						xAxes: [
						{
							display: true,
							gridLines: { display: false },
							scaleLabel: {
								display: true,
								labelString: "Services",
								fontColor: "#000",
								fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
								fontSize: 16
							},
							ticks: {
								autoSkip: false,							
								fontColor: "#000"
							},
							maxBarThickness: 50
						}
						],
						hover: {
							intersect: false
						}
					}
				}			
			});
		}
	},
	mounted() {
		var _this = this;
		$("#table-details").DataTable({
		data: _this.all_data,
		columns: [
			{ title: "#" },
			{ title: "User" },
			{ title: "Event" },
			{ title: "Timestamp" }
		]
		});
	}
};
</script>
<style>

</style>

