<template>
	<div class="dashboard">
			<dashboard-info-widgets v-show="graphData.length > 0"></dashboard-info-widgets>			

		<vuestic-widget class="no-padding no-v-padding">
			<div class="row" style="padding-top:40px; padding-bottom:40px;">
				<div class="col-12 col-md-5 col-lg-4" style="margin-top:10px;">      
					<v-select  v-model="user_name" ref="select" label="first_name" :options="all_users" placeholder="Users" v-bind:class="{'is-invalid' : errors.username}"></v-select>
					<span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Please, select a username.</b></span>
				</div>
				<div v-show="show_dates" class="col-12 col-md-4 col-lg-4" style="margin-top:10px;"> 
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1"><i class="fas fa-calendar-alt"></i></span>
						</div>
						<input id="date-range" type="text" class="form-control text-center" aria-label="dates" aria-describedby="basic-addon1"
						style="border: 1px solid rgba(60,60,60,.26);">
					</div>   
				</div>
				<div class="col-12 col-md-3 col-lg-4">
					<fieldset style="display:inline-block;padding-right:10px;">
					<vuestic-checkbox 
						label="Dates"
						:id="'checkbox4'"
						v-model="show_dates"/>
					
					</fieldset>
					
					<button class="btn btn-primary" @click="search()" style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
					<i v-if="processing" class="fas fa-spinner fa-pulse"></i><i v-if="!processing" class="fas fa-search d-lg-none" ></i><span v-if="!processing" class="d-none d-lg-block">Search</span></button>
				</div>
			</div>   
			<div v-if="no_result" class="col-12 text-center">
				<h3>{{user_search}} haven't used any service.</h3>
			</div>
		
			<div v-show="graphData.length > 0" class="" style="margin-top:20px;">
				<h3>Services used by {{user_search}}</h3>
				<div style="position: relative; height:50vh;" id="canva">
					<canvas id="myChart"></canvas>
				</div>
			</div>
		
			<div v-show="graphData.length > 0" class="row" style="margin-bottom:40px;">
				<div id="accordion-search" class="col-md-12">
					<div>
						<div id="headingOne">
							<h5 class="mb-0">
							<button class="btn btn-primary" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
							style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
								Details
							</button>
							</h5>
						</div>

						<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion-search">
							<div class="card-body col-12">
								<table id="table-details" class="stripe" style="width:100%">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
        </vuestic-widget> 
	</div>
</template>

<script>
import jwtDecode from "jwt-decode";
import vSelect from "vue-select";
import DashboardInfoWidgets from './dashboard/DashboardInfoWidgets'



export default {
	name: "dashboard",
	components: {
		"v-select": vSelect,
		DashboardInfoWidgets,   	
		
	},
	data() {
		return {
		token: "Loading token..",
		user: {},
		options: [],
		all_users: [],
		all_data: [],
		max: 0,
		user_name: "",
		user_search: "",
		all_services: [],
		start_date: "",
		end_date: "",
		graphData: [],
		show_dates: false,
		no_result: false,
		processing: false,
		table: "",
		datepicker:{
			range:''
		}
		};
	},
  methods: {
   
    search_callback(resp) {
		this.all_data = [];
		this.user_search = this.user_name;
		for (var i in resp.data) {
			// console.log(this.all_data[i],resp.data[i]);
			var datatime = resp.data[i].eventTime;
			var time = moment(datatime,'YYYY-MM-DDTHH:mm:ssZ').format('HH:mm:ss DD-MM-YYYY');
			this.all_data.push([i,resp.data[i].eventName,time]);
		}

		for (var i in this.all_services) {
			this.all_services[i].count = 0;
		}
		// console.log(this.all_services);
		for (var i in resp.data) {
			var data2 = resp.data[i].eventSource;

			var service = data2.split(".");
			this.all_services[service[0]].count =this.all_services[service[0]].count + 1;
		}

		for (var i in this.all_services) {
			if (this.all_services[i].count > 0) {
			this.graphData.push([this.all_services[i].name,	this.all_services[i].count]);
			}
		}
		// console.log(this.graphData.length);
		if (this.graphData.length > 0) {
			this.no_result = false;
			// google.charts.load("current", { packages: ["corechart", "bar"] });
			// google.charts.setOnLoadCallback(this.drawGraph);
			this.drawGraph();
			var _this = this;
			this.$nextTick(function() {
				$("#table-details")	.dataTable().fnClearTable();
				$("#table-details").dataTable().fnAddData(_this.all_data);
				$("#table-details").dataTable().fnDraw();
			// $('#table-details').dataTable().fn
			});
		} else {
			this.no_result = true;
		}
		this.processing = false;
    },
    search() {
		this.graphData = [];

		// console.log(this.graphData);
		if (this.user_name != "") {
			this.errors.username = false;
			this.processing = true;
			var _this = this;
			var generalInfo={};
					
					//Run Instances en una hora 
					axios.get("https://api.cursocloudaws.net/tracker/users/"+  this.user_name +"?from=" +this.start_date + "&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=RunInstances&count=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["runInstances"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'runInstances', 'value': resp.data})
					});
					//CreateDBInstace
					axios.get("https://api.cursocloudaws.net/tracker/users/"+ this.user_name + "?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateDBInstance&count=True&begin_with=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["createDBInstance"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'createDBInstance', 'value': resp.data})
					});
					axios.get("https://api.cursocloudaws.net/tracker/users/"+ this.user_name + "?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateFunction&count=True&begin_with=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["createFunction"]=resp.data;
						console.log(generalInfo)
						_this.$eventHub.$emit("generalInfo",{'type': 'createFunction', 'value': resp.data})
					});
					axios.get("https://api.cursocloudaws.net/tracker/users/"+ this.user_name + "?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateLoadBalancer&count=True")					
					.then(function(resp) {	
						generalInfo["createLoadBalancer"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'createLoadBalancer', 'value': resp.data})					
					});
					

			if (!this.show_dates) {
			axios.get("https://api.cursocloudaws.net/tracker/users/" +	this.user_name)
				.then(function(resp) {
				_this.search_callback(resp);
				});
			} else {
			axios.get("https://api.cursocloudaws.net/tracker/users/" +	this.user_name +"?from=" +this.start_date +	"&to=" +this.end_date)
				.then(function(resp) {
				_this.search_callback(resp);
				});			
			}
		} else {
			this.errors.username = true;
		}
    },
   drawGraph() {				
		///finding max value of array
		this.max = 0;
		// console.log(this.graphData)
		for (var i in this.graphData) {
			if (this.max < this.graphData[i][1]) {
			this.max = this.graphData[i][1];
			}
		}
			
		$("#myChart").remove();
		$("#canva").append('<canvas id="myChart"></canvas>');
		var ctx = $("#myChart");
		var myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: this.graphData.map(graphData => graphData[0]),
				datasets: [
					{
					label: "Services",
					backgroundColor: "rgba(74,227,135,0.2)",
					borderColor: "rgba(0,102,0,1)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(204, 255, 51,0.5)",
					hoverBorderColor: "rgba(0,102,0,1)",
					data: this.graphData.map(graphData => graphData[1])
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				plugins: {
					datalabels: {	
						display: function(){
								
								if ($('#canva').width() < 300){
									return false
								}else{
									return true
								}
							},					
						align: "top",
						anchor: "end",
						backgroundColor: null,
						borderColor: null,
						borderRadius: 4,
						borderWidth: 1,
						color: "black",
						font: {
							//size: 14,
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
							stepSize: Math.ceil(this.max / 4),
							max: this.max + Math.ceil(this.max / 4)								
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
							callback: function(value, index, values) {									
								if ($('#canva').width() < 300){									
									return null
								}else {
									return value
								}
                    		},
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
		axios.get("https://api.cursocloudaws.net/tracker/users")
		.then(function(resp) {
			// console.log(resp.data);
			_this.all_users = resp.data;
			// _this.all_users.splice(0,0, 'General');
		});
		axios.get("https://api.cursocloudaws.net/tracker/services")
		.then(function(resp) {
			for (var i in resp.data) {
			_this.all_services[resp.data[i]] = {
				name: resp.data[i],
				count: 0
			};
			}
		});
	},
	mounted() {
		var _this = this;
		var maxDate = moment().format("DD/MM/YYYY");
		$("#date-range").daterangepicker(
		{
			opens: "left",
			maxDate: maxDate,
			locale: {
			format: "DD/MM/YYYY"
			}
			// autoApply: true
		},
		function(start, end, label) {
			_this.start_date = start.format("YYYY-MM-DD");
			_this.end_date = end.format("YYYY-MM-DD");
		}
		);
		
		$.extend( $.fn.dataTable.defaults, {
			responsive: true
		} );
		$("#table-details").DataTable({
			
			data: _this.all_data,
			columns: [{ title: "#" }, { title: "Event" }, { title: "Date and Time" }],
			"columnDefs": [
        		{className: "dt-center", "targets": "_all"}
   			 ]
		});
		$('#accordion-search').on('shown.bs.collapse', function(){
			$("#table-details").DataTable().columns.adjust();
		});
	}
};
</script>
<style lang="scss" scoped>
@import "../sass/_variables.scss";


</style>
