<template>	
	<div class="dashboard">	
				<dashboard-info-widgets v-show="graphData.length > 0 && !showSpinner"></dashboard-info-widgets>			
		
		<!-- <div v-show="loading" style="position:absolute;height:100px; top:50%; margin-top:-50px; left:43%;justify-content:center;">	 -->
		<div v-show="loading" style="position:fixed; top:50%; left:50%;">	
			<atom-spinner  :animation-duration="2000"  :size="100"  color="rgb(74,227,135)" />		
		</div>		
		<vuestic-widget v-show="loading == false" class="no-padding no-v-padding" style="/*min-width:910px*/">	
			<div class="row">		
				<div class="col-md-12" style="margin-top:20px;">						  
				<h6>Select an option to search in the</h6>			
				</div>
			</div>
			<div class="row" >							
				<div class="col-12 col-sm-6	 col-md-5 col-lg-4 col-xl-3" style="margin-top:5px;">	
					<fieldset>					
						<vuestic-simple-select							
							v-model="simpleSelectModel"							
							v-bind:options="simpleOptions"
							@input="graphTime">
						</vuestic-simple-select>
					</fieldset>
				</div>
			</div>
			<div v-if="no_result" class="col-12 text-center">
				<h3>No AWS service has been used in the {{simpleSelectModel}}.</h3>						
			</div>					
			<!-- <div v-show="showSpinner" style="position:absolute;height:100px; top:50%; margin-top:-50px; left:55%;justify-content:center;">	 -->
			<div v-show="showSpinner" style="position:fixed; top:50%; left:50%;">	
				<semipolar-spinner  :animation-duration="2000"  :size="90"  color="rgb(74,227,135)"/>
			</div>
			<div class="row" style="margin-top:20px; min-height:50vh;"> 				     
				<div v-show="graphData.length > 0 && !showSpinner" class="col-12"  style="margin-top:20px;">
					<!-- <div v-show="loadingGraph" style="position:absolute;height:100px; top:50%; margin-top:-50px; left:50%;justify-content:center;">	
						<atom-spinner  :animation-duration="2000"  :size="100"  color="rgb(74,227,135)" />		
					</div> -->
					<h3>AWS services used in the {{simpleSelectModel}}</h3>		  
					<div style="position: relative; height:50vh;" id="canva">     
						<canvas id="myChart"></canvas>    								
					</div>
				</div>
				<div v-show="graphData_result.length > 0  && !showSpinner" class="col-12"  style="margin-top:20px;">
					<!-- <div v-show="loadingGraph" style="position:absolute;height:100px; top:50%; margin-top:-50px; left:40%;justify-content:center;">	
						<atom-spinner  :animation-duration="2000"  :size="100"  color="rgb(74,227,135)" />		
					</div> -->
					<h3>Users who have used AWS services in the {{simpleSelectModel}}</h3>								    
					<div style="position: relative; height:50vh;min-width" id="canva2">  					   
						<canvas id="myChart2"></canvas> 					
					</div>
				
				</div>
			</div>
			
			<div v-show="graphData.length > 0 && !showSpinner" class="row" style="margin-bottom:40px;">
				<div id="accordion-dashboard" class="col-md-12">
					<div>
						<div id="headingOne">
							<h5 class="mb-0">
							<button class="btn btn-primary" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
								Details
							</button>
							</h5>
						</div>
						<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion-dashboard">
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
import { AtomSpinner  } from 'epic-spinners'
import { SemipolarSpinner  } from 'epic-spinners'
import api from "../../api.js"
import DashboardInfoWidgets from './DashboardInfoWidgets'

export default {
  name: "dashboard",
  components: {
	AtomSpinner,
	SemipolarSpinner,
	DashboardInfoWidgets,    
  },
  data() {
		return {
		token: "Loading token..",
		user: {},			
		all_data: [],
		all_data_user: [],
		max: 0,
		simpleSelectModel:"last hour",
		all_services: [],
		start_date: "",
		end_date: "",
		graphData: [],	
		graphData_result: [],		
		no_result: false,						
		showSpinner: false,						
		processing: false,
		table: "",	
		loading: true,		
		simpleOptions : [
			'last hour',
			"last six hours",			
			"last day",
			"last week",
			"last fifteen days",
		]
		};
  },
  created() {    		
		
		var _this = this;		
		axios.get(api.url.general + "services")
		.then(function(resp) {			
			for (var i in resp.data) {
				_this.all_services[resp.data[i]] = {
					name: resp.data[i],
					count: 0
				};
				_this.all_data_user[resp.data[i]] = {
					name: resp.data[i],
					count: 0
				};
			}
		}).catch(function (error) {
			if (error.response.status == 401){
				_this.$router.replace(_this.$route.query.redirect || "/logout");
				alert("Your Session has expired ");
			}
			
		});	
		
		$.extend( $.fn.dataTable.defaults, {
			responsive: true
		} );			
	},
 methods: {
	 	graphTime(){	
			$("#myChart").remove();
			$("#myChart2").remove();			
			this.no_result=false;
			this.showSpinner = true;
			var _this = this;
			if(this.simpleSelectModel=="last hour"){
				this.end_date = moment().add(-2, "hour");	 
				this.end_date = this.end_date.format("YYYY-MM-DDTHH:mm:ss");
				this.start_date = moment().add(-3, "hour");
				this.start_date = this.start_date.format("YYYY-MM-DDTHH:mm:ss");
					// axios.get("https://api.cursocloudaws.net/tracker/scan?from=" +this.start_date +"&to=" +this.end_date)
					// // axios.get("https://api.cursocloudaws.net/tracker/scan?from=2018-06-24T19:00:44&to=2018-06-24T19:30:44")
					// .then(function(resp) {						
					// 	_this.search(resp);
					// });
					//Total en una hora 					

				}else if(this.simpleSelectModel=="last six hours"){
				this.end_date = moment().add(-2, "hour");	 
				this.end_date = this.end_date.format("YYYY-MM-DDTHH:mm:ss");
				this.start_date = moment().add(-10, "hour");
				this.start_date = this.start_date.format("YYYY-MM-DDTHH:mm:ss");
					// axios.get("https://api.cursocloudaws.net/tracker/scan?from=" +this.start_date +"&to=" +this.end_date)
					// .then(function(resp) {
						
					// 	_this.search(resp);
					// });
				}else if(this.simpleSelectModel=="last day"){
					this.end_date = moment().format("YYYY-MM-DD");
					this.start_date = moment().add(-1, "day");
					this.start_date = this.start_date.format("YYYY-MM-DD");
					// axios.get("https://api.cursocloudaws.net/tracker/scan?from=" +this.start_date +"&to=" +this.end_date)
					// .then(function(resp) {						
					// 	_this.search(resp);
					// });
				}else if(this.simpleSelectModel=="last week"){
					this.end_date = moment().format("YYYY-MM-DD");
					this.start_date = moment().add(-7, "day");
					this.start_date = this.start_date.format("YYYY-MM-DD");
					// axios.get("https://api.cursocloudaws.net/tracker/scan?from=" +this.start_date +"&to=" +this.end_date)
					// .then(function(resp) {
					// 	_this.search(resp);
					// });
				}else if(this.simpleSelectModel=="last fifteen days"){
					this.end_date = moment().format("YYYY-MM-DD");
					this.start_date = moment().add(-15, "day");
					this.start_date = this.start_date.format("YYYY-MM-DD");
					
					
				}

				axios.get( api.url.general + "scan?from=" +this.start_date +"&to=" +this.end_date)
					.then(function(resp) {
						_this.search(resp);
					});

				var generalInfo={};
					axios.get(api.url.general+"scan?from=" +this.start_date +"&to=" +this.end_date + "&count=True")					
					.then(function(resp) {						
						// _this.search(resp);
						_this.$eventHub.$emit("generalInfo",{'type': 'total', 'value': resp.data});
					});
					//Run Instances en una hora 
					axios.get(api.url.general+"scan?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=RunInstances&count=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["runInstances"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'runInstances', 'value': resp.data})
					});
					//CreateDBInstace
					axios.get(api.url.general+"scan?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateDBInstance&count=True&begin_with=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["createDBInstance"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'createDBInstance', 'value': resp.data})
					});
					axios.get(api.url.general+"scan?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateFunction&count=True&begin_with=True")					
					.then(function(resp) {						
						// _this.search(resp);
						generalInfo["createFunction"]=resp.data;
						_this.$eventHub.$emit("generalInfo",{'type': 'createFunction', 'value': resp.data})
					});
					axios.get(api.url.general+"scan?from=" +this.start_date +"&to=" +this.end_date + "&params=['awsRegion']&value=['us-east-1']&eventName=CreateLoadBalancer&count=True")					
					.then(function(resp) {	
						generalInfo["createLoadBalancer"]=resp.data;						
						_this.$eventHub.$emit("generalInfo",{'type': 'createLoadBalancer', 'value': resp.data})					
					});
					
		 },
		search(resp) {
		
		this.graphData = [];
		this.graphData_result = [];
		this.all_data = [];
		this.all_data_user = [];
		
		for (var i in resp.data) {		
			var datatime = resp.data[i].eventTime;
			var time = moment(datatime,'YYYY-MM-DDTHH:mm:ssZ').format('HH:mm:ss DD-MM-YYYY');
			this.all_data.push([i,resp.data[i].userIdentity_userName,resp.data[i].eventName,time]);	
			
			this.all_data_user[resp.data[i].userIdentity_userName] = {
					name: resp.data[i].userIdentity_userName,
					count: 0
				};					
		}
		// console.log(this.all_data_user)
		for (var i in this.all_services) {
			this.all_services[i].count = 0;
		}
		
		for (var i in resp.data) {
			var data2 = resp.data[i].eventSource;
			var service = data2.split(".");
			this.all_services[service[0]].count =this.all_services[service[0]].count + 1;
			this.all_data_user[resp.data[i].userIdentity_userName].count =this.all_data_user[resp.data[i].userIdentity_userName].count + 1;			
		}
		

		for (var i in this.all_services) {
			if (this.all_services[i].count > 0) {
				this.graphData.push([this.all_services[i].name,this.all_services[i].count]);
			}
		}
		for (var i in this.all_data_user) {
			if (this.all_data_user[i].count > 0) {				
				this.graphData_result.push([this.all_data_user[i].name,this.all_data_user[i].count]);
				
			}
		}
		
		if (this.graphData.length > 0 && this.graphData_result.length > 0) {
			this.no_result = false;		
			// this.showSpinner = true;		
			this.drawGraph();
			this.drawGraph_result();
			var _this = this;
			this.$nextTick(function() {
				
				$("#table-details").dataTable().fnClearTable();
				if (_this.all_data.length != 0){			
					$("#table-details").dataTable().fnAddData(_this.all_data);
				}
				$("#table-details").dataTable().fnDraw();	
			});
			
		} else {
			this.no_result = true;			
		}
		this.processing = false;
		this.loading=false;		
		this.showSpinner = false;
		// setTimeout(function () {
		// 		this.loading = false;
		// },50);
		
		},
		drawGraph() {
			//finding max value of array
			this.max = 0;
			for (var i in this.graphData) {
				if (this.max < this.graphData[i][1]) {
				this.max = this.graphData[i][1];
				}
			}	
			
			$("#canva").append('<canvas id="myChart"></canvas>');
			// console.log(this.graphData.length)
			
			var ctx = $("#myChart");
			var myChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: this.graphData.map(graphData => graphData[0]),
					datasets: [
						{
						label: "#Services",
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
							// display : false,
							display: function(){
								
								if ($('#canva').width() < 300){
									return false
								}else{
									return true
								}
							},
							align: "end",
							anchor: "top",
							backgroundColor: null,
							borderColor: null,
							borderRadius: 4,
							borderWidth: 1,
							color: "#000",					
							font: {
								size:10,
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
								// fontSize: 16
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
								// fontSize: 16
							},
							ticks: {
								callback: function(value, index, values) {									
									 if ($('#canva').width() < 300){									
										return null
									}else {
										return value
									}
                    			},
								//display: true,
								autoSkip: false,							
								fontColor: "#000"
							},
							maxBarThickness: 50
						}
						],
						hover: {
							intersect: false
						}
					},
					
				}			
			});
		},
		drawGraph_result() {			
			//finding max value of array
			this.max = 0;
			for (var i in this.graphData_result) {
				if (this.max < this.graphData_result[i][1]) {
				this.max = this.graphData_result[i][1];
				}
			}	

			$("#canva2").append('<canvas id="myChart2"></canvas>');
			var ctx = $("#myChart2");
			var myChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: this.graphData_result.map(graphData_result => graphData_result[0]),
					datasets: [
						{
						label: "Used services",
						backgroundColor: "rgba(74,227,135,0.2)",
						borderColor: "rgba(0,102,0,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(204, 255, 51,0.5)",
						hoverBorderColor: "rgba(0,102,0,1)",
						data: this.graphData_result.map(graphData => graphData[1])
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
								
								if ($('#canva2').width() < 300){
									return false
								}else{
									return true
								}
							},
							align: "end",
							anchor: "top",
							backgroundColor: null,
							borderColor: null,
							borderRadius: 4,
							borderWidth: 1,
							color: "#000",					
							font: {
								size:10,
								weight: "bold"
							},
							offset: 4,
							padding: 0,
							formatter: Math.round					
						}
					},
					
					tooltips: {
						position: "nearest",
						titleFontSize: 12,
						bodyFontSize: 12
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
								// fontSize: 16
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
								max: this.max + Math.ceil(this.max/4)
							}
						}
						],
						xAxes: [
						{
							display : true,
							gridLines: { display: false },
							scaleLabel: {
								display: true,
								labelString: "Users",
								fontColor: "#000",
								fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
								// fontSize: 16
							},
							ticks: {
								callback: function(value, index, values) {									
									 if ($('#canva2').width() < 300){									
								
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
 
 mounted() {
	 
		var _this = this;

		// $("#table-details").DataTable().responsive.recalc();
		$.extend( $.fn.dataTable.defaults, {
			responsive: true
		} );
		$("#table-details").DataTable({
			data: _this.all_data,       		
			columns: [
				{ title: "#" },
				{ title: "User" },
				{ title: "Event" },
				{ title: "Timestamp (UTC)" }
			],
			
		});

		$('#accordion-dashboard').on('shown.bs.collapse', function(){
			$("#table-details").DataTable().columns.adjust();
		});
		
		
		// $('#table-details').DataTable().columns.adjust().responsive.recalc();
		// $(window).trigger('resize');	
		// $(window).resize(function () {
        //     $("#table-details").resize();
		// });
	}
};
</script>
<style lang="scss" scoped>
@import "../../sass/_variables.scss";
// #canva{
//         width: 100% !important;
//         max-width: 800px;
//         height: auto !important;
//     }
// table{
		
// th.dt-center, td.dt-center { text-align: center; }
// }
</style>
