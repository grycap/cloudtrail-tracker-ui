<template>
	<div class="dashboard">
		<vuestic-widget class="no-padding no-v-padding">
			<div class="row" style="padding-top:40px;">
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
					<button class="btn btn-primary" @click="search()" :disabled="processing == true" style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
					<i v-if="processing" class="fas fa-spinner fa-pulse"></i><i v-if="!processing" class="fas fa-search d-lg-none" ></i><span v-if="!processing" class="d-none d-lg-block">Search</span></button>				
				</div>
				
				<div class="row" style="padding-left:40px;" >
					
					<fieldset style="padding-right:20px;display:inline-block">
						 <vuestic-radio-button
							:label="'CursoCloudAWS'"
							id="radio1"
							value="option1"
							:name="'radio'"
							v-model="check"
							/>
							
					</fieldset>						
					<fieldset style="padding-right:20px;">
						<vuestic-radio-button
							:label="'MBDA-CGDNGB'"
							id="radio2"
							:value="'option2'"
							:name="'radio'"		
							v-model="check"					
							/>						
					</fieldset>		
					<fieldset style="padding-right:20px;">
						<vuestic-radio-button
							:label="'MBDA-MEGBD'"
							id="radio3"
							value="option3"
							:name="'radio'"	
							v-model="check"						
							/>						
					</fieldset>		
					<fieldset style="padding-right:20px;">	
						<vuestic-radio-button
							:label="'MUCPD-ICP'"
							id="radio4"
							value="option4"	
							:name="'radio'"	
							v-model="check"					
							/>							
					</fieldset>		
					<fieldset style="padding-right:20px;">
						<vuestic-radio-button
							:label="'MUCPD-CBD'"
							id="radio5"
							value="option5"	
							:name="'radio'"	
							v-model="check"					
							/>								
					</fieldset>		
					<fieldset style="padding-right:20px;">	
						<vuestic-radio-button
							:label="'MUGI-SEN'"
							id="radio6"
							value="option6"
							:name="'radio'"	
							v-model="check"						
							/>										
					</fieldset>
																		
				</div>
				
			</div> 
			<div class="row" style=" padding-bottom:40px;">
				<fieldset style = "width: 500px; margin:  0px auto;">					 				
					<span v-show="select_subject" style="color: #cc3300; font-size: 12px;"><b>Please, select the subject that it belongs to</b></span>
				</fieldset>
			</div>
				
			 
			<div v-if="no_result" class="col-12 text-center">
				<h3>{{user_search}} has not used any service.</h3>
			</div>
		
			<div v-show="graphData.length > 0" class="col-12" style="margin-top:20px;padding-left:0;padding-right:0;">
				<h3>Percentage of compliance with the laboratory practices of the {{user_search}}</h3>
				<div style="position: relative; height:50vh;" id="canva">
					<canvas id="myChart"></canvas>
				</div>
			</div>
		
			<div v-show="graphData.length > 0" class="row" style="margin-bottom:40px;">
				<div id="accordion-dashboard" class="col-md-12">
					<div>
						<div id="headingOne">
							<h5 class="mb-0">
							<button id="openbtn" class="btn btn-primary" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
							style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
								Details
							</button>
							</h5>
						</div>

						<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion-dashboard">
							<div class="card-body">
								<table id="table-details" class="stripe" style="width:100%">
								</table>
								<span style="color: #cc3300; display:block; text-align:center;font-size: 12px; width:100%; height:100%; margin: 0 auto;">For further information about each event go to: <a id="docs" target="_blank" href="https://docs.aws.amazon.com/">https://docs.aws.amazon.com/</a></span>
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
import envprac from "../envprac.js";
import api from "../api.js";
import { install } from 'vuex';

export default {
	name: "dashboard",
	components: {
		"v-select": vSelect,		
	},
	data() {
		return {
			token: "Loading token..",
			user: {},
			name1: "Hello",
			options: [],
			all_users: [],
			all_data: [],			
			max: 0,
			array: [],
			user_name: "",
			user_search: "",
			all_services: [],			
			start_date: "",
			end_date: "",
			graphData: [],
			show_dates: true,
			select_subject: false,
			no_result: false,
			processing: false,
			validated: 0,
			check: "",
			table: "",
			activeBars: "",
			datepicker:{
				range:''
			},
			initData:[],	
			referData:[],	
			
		};
		
	},
	created() {				
		var dmy = new Date();
		   var currDay = dmy.getDay();
           var currMonth = dmy.getMonth();
           var currYear = dmy.getFullYear();
           var currYearEnd = dmy.getFullYear() + 1;
		   var end = new Date(currYearEnd, 6, 31);

			if (currMonth == 8){
			  var  start = new Date(currYear, 8, 1);
			  var  end = new Date(currYearEnd, 6, 31);
		   }
		   else{
			  var start = new Date(currYear - 1, 8, 1);
			  var end = new Date(currYearEnd - 1, 6, 31);
		   }	  			

		   this.start_date = moment(start).format("YYYY-MM-DD");
		   this.end_date = moment(end).format("YYYY-MM-DD"); 
		   
		
		var _this = this;
		//console.log(api.url)
		axios.get(api.url.general+ "/users")		
		.then(function(resp) {
			var session = JSON.parse(localStorage.getItem("session"))			
			
			if (session.user.username == "gmolto" || session.user.username == "admin"){
				_this.all_users = resp.data;
				_this.user_name = "";
					
			}else {
				_this.all_users = [];
				for (var i in resp.data){					
					if (session.user.username == resp.data[i]){
						_this.all_users.push(resp.data[i])
					}		
				}
				_this.user_name = _this.all_users[0]
			} 
		});	
		this.initData = envprac.INITDATA;
		this.referData = envprac.REFERDATA;
		
	},

	watch: {
		"check"(val){
			if(val != "" ){
				this.search()
			}
		}
	},
	  
	methods: {
		search_callback(resp) {
			
			this.all_data = []			
			
			this.user_search = this.user_name;			
			for (var i in resp.data) {		
				
				var event_data= resp.data[i].eventName
				if( typeof this.all_services[event_data] == 'undefined'){
					this.all_services[event_data] = 1;					
				}else{
					this.all_services[resp.data[i].eventName] = this.all_services[resp.data[i].eventName] + 1
				}							
			}
			
			
			if(this.check == "option4"){							
				this.referData = envprac.REFERDATA1;
			}else {
				this.referData = envprac.REFERDATA;
			}
			
			
			var totalref=0
			for(var i in this.referData){
				this.initData[i]["total"]=0	
				this.referData[i]["totalref"]=0	
								
				for(var j in this.referData[i]){					
					if(typeof this.all_services[j] != 'undefined' && this.all_services[j] > 0){						
						if(this.all_services[j] >= this.referData[i][j]){
							var value = this.referData[i][j]
							this.initData[i][j] = value;
							this.all_services[j] = this.all_services[j] - this.referData[i][j];
						}else{
							this.initData[i][j] = this.all_services[j];
							if(j != "totalref"){							
								this.all_data.push([i,j,this.referData[i][j]-this.all_services[j]]);
							}
							this.all_services[j] = 0;
						}
						this.initData[i].total = this.initData[i].total + this.initData[i][j]
					}else{
						if(j != "totalref"){
							this.all_data.push([i,j,this.referData[i][j]]);

						}
					}
				
				totalref = totalref + this.referData[i][j]				
				}
				
				this.referData[i]["totalref"]=totalref	
				this.graphData.push([i,((this.initData[i].total * 100/(this.referData[i].totalref)).toFixed(2))*1]);
				totalref = 0
			}			
				
				if (this.check == "option1"){
					//  this.graphData.splice(6,1)
					 this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EMR"
					})
					 this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EMR"
					})					
				}
				if (this.check == "option2"){
					//var removeValIndex = [5,6]
					// for (var i = removeValIndex.length -1; i >= 0; i--){
					// 	   this.graphData.splice(removeValIndex[i],1);
					// }
					this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC"
					})
					this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC"
					})
				}
				if (this.check == "option3"){
					var removeValIndex = [0,1,2,3,4,5,7]
					// for (var i = removeValIndex.length -1; i >= 0; i--){
					// 	   this.graphData.splice(removeValIndex[i],1);
					// }
					this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_SERVERLESS" 						
					})
					this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_SERVERLESS" 
					})
				}
				if (this.check == "option4"){
					// this.graphData.splice(6,1)
					this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EMR"
					})
					this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EMR"
					})
				}
				if (this.check == "option5"){
					// var removeValIndex = [0,1,2,3,4,5,7]
					// for (var i = removeValIndex.length -1; i >= 0; i--) {  	
					// 	this.graphData.splice(removeValIndex[i],1);		
					// }
					this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_SERVERLESS" 						
					})
					this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_SERVERLESS" 
					})			
				}
				if (this.check == "option6"){
					// var removeValIndex = [5,6]
					// for (var i = removeValIndex.length -1; i >= 0; i--)   {
					// 	this.graphData.splice(removeValIndex[i],1);			
					// }
					this.graphData = this.graphData.filter(function(obj){
						return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC"
					})
					this.all_data = this.all_data.filter(function(obj){
						return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC"
					})		
				}									

			if (this.graphData.length > 0) {							
				this.no_result = false;
				// google.charts.load("current", { packages: ["corechart", "bar"] });
				// google.charts.setOnLoadCallback(this.drawGraph);
				this.drawGraph();
				var _this = this;
				this.$nextTick(function() {
				$("#table-details")	.dataTable().fnClearTable();
				 if (_this.all_data.length != 0){				 
					$("#table-details").dataTable().fnAddData(_this.all_data);
				}
				$("#table-details").dataTable().fnDraw();
				// $('#table-details').dataTable().fn
				});
			} else {
				this.no_result = true;
			}
			this.processing = false;
		},
		search() {			
			$(".collapse").collapse('hide');
			this.graphData = [];
			
			var checkboxchecked = $("#radio1")
			if ($("input[name='radio']:checked").is(':checked')){
				
				this.select_subject = false
			}else {
				this.select_subject = true
				
			}
			
			if (this.user_name == "" || this.user_name == null) {
				this.errors.username = true;
			}else {
				this.errors.username = false;
			}

			if (this.user_name != "" && this.user_name != null && this.select_subject == false) {
				this.errors.username = false;
				this.processing = true;
				var _this = this;
				if (!this.show_dates) {
				axios.get(api.url.general  + "users/" + this.user_name)
					.then(function(resp) {						
					_this.search_callback(resp);
					});
				} else {
				axios.get(api.url.general +	"users/" + this.user_name +"?from=" +this.start_date +	"&to=" +this.end_date)
					.then(function(resp) {					
					_this.all_services=[];			

					_this.search_callback(resp);
					});
				}
			} 
			
			
		
			
		},
		drawGraph() {				
		
		this.max = 100;		
		
		var myColors = []
		var borderColor = []
		
		for (var i in this.graphData){					
			if(50 < this.graphData[i][1] <= 100 ){
				myColors[i]="rgba(74,227,135,0.2)"
				borderColor[i]="rgba(0,102,0,5)"
			}if(this.graphData[i][1] == 50){
				myColors[i]="rgba(204,255,51,0.5)"
				borderColor[i]="rgba(255, 102, 0,1)"
			}if(this.graphData[i][1] < 50){
				myColors[i]="rgba(255,51,0,0.2)"
				borderColor[i]="rgba(255, 51, 0,1)"
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
					label: "%",
					// backgroundColor: "rgba(74,227,135,0.2)",
					backgroundColor: myColors,
					borderColor: borderColor,
					borderWidth: 1,
					hoverBackgroundColor: "rgba(0, 153, 255,0.5)",
					hoverBorderColor: "rgba(0,255,255,1)",
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
								
							if ($('#canva').width() < 350){
								return false
							}else{
								return true
							}
						},		
						align : function (context){							
							
							var index = context.dataIndex;
							var value = context.dataset.data[index];							
							return value > 90 ? 'bottom' : 'top'

							
						},		
						
						anchor: "end",
						backgroundColor: null,
						borderColor: null,
						borderRadius: 4,
						borderWidth: 1,
						//color: "black",
						color: function(context) {
							var index = context.dataIndex;
							var value = context.dataset.data[index];
							return value < 50 ? 'red' :  "black" // draw negative values in red								
						},
						font: {
							size: 12,
							weight: "bold"
						},
						offset: 4,
						padding: 0,
						formatter: function(value, context) {
   							 return value + '%';
						}
						//formatter: Math.round					
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
						labelString: "%",
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
							max :this.max
							//stepSize: Math.ceil(this.max / 4),
							//max: this.max + Math.ceil(this.max / 4)								
							}
					}
					],
					xAxes: [
						{
						display: true,
						gridLines: { display: false },
						scaleLabel: {
							display: true,
							labelString: "Laboratory practices",
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
			
			$("#myChart").click(function(e) {
				 this.activeBars = myChart.getElementAtEvent(e); 				
				var find = this.activeBars["0"]._model.label				
				$(".collapse").collapse('show');
				$("#table-details").DataTable().search(find).draw();
				
			});
		},
		
	},
	mounted() {
		var d = new Date();
		   var currDay = d.getDay();
           var currMonth = d.getMonth();
           var currYear = d.getFullYear();
		   var currYearEnd = d.getFullYear() + 1;	
		   
			

		   if (currMonth == 8){
			  var  startDateDefault = new Date(currYear, 8, 1);
			  var  endDateDefault = new Date(currYearEnd, 6, 31);
		   }
		   else{
			  var startDateDefault = new Date(currYear -1, 8, 1);
			  var  endDateDefault = new Date(currYearEnd - 1, 6, 31);
		   }
		   var start_date = moment(startDateDefault).format("DD/MM/YYYY");
		   var end_date = moment(endDateDefault).format("DD/MM/YYYY"); 
			

		var _this = this;
		var maxDate = moment().format("DD/MM/YYYY");
		$("#date-range").daterangepicker(
		{
			opens: "left",
			startDate: start_date,
			endDate : end_date,
			// maxDate: maxDate,
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
		columns: [{ title: "#" }, { title: "Event" }, { title: "Number of missing events" }],
		"columnDefs": [
        		{className: "dt-center", "targets": "_all"}
   			 ]
		});
		$('#accordion-dashboard').on('shown.bs.collapse', function(){
			$("#table-details").DataTable().columns.adjust();
		});
	}	
}
</script>
<style lang="scss" scoped>
@import "../sass/_variables.scss";

#docs {
	color:#090909;
}
#docs:hover {
	color:blue;
	text-decoration: underline;
}
</style>
