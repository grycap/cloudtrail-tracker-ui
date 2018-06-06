<template>
<div>
    <div class="row" style="margin-top:50px; min-height:70vh;margin-left:20px;margin-right:20px;">
      <div class="col-12 col-lg-10 offset-lg-1">
        <div class="row">
			<div class="col-12 col-md-5 col-lg-4" style="margin-top:10px;">      
				<v-select  v-model="user_name" ref="select" label="first_name" :options="all_users" placeholder="Users" v-bind:class="{'is-invalid' : errors.username}"></v-select>
				<span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Please, select a username.</b></span>
			</div>
			<div v-show="show_dates" class="col-12 col-md-4 col-lg-4" style="margin-top:10px;">   
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text" id="basic-addon1"><i class="fas fa-calendar-alt"></i></span>
					</div>
				<input id="date-range" type="text" class="form-control text-center" aria-label="dates" aria-describedby="basic-addon1">
				</div>   
			</div>
			<div class="col-12 col-md-3 col-lg-4" style="margin-top:10px;">
				<fieldset style="display:inline-block;padding-right:10px;">
					<input type="checkbox" id="enable-date">
					<label for="enable-date">Search by Dates</label>
				</fieldset>
				<button class="btn btn-primary" @click="search()">
				<i v-if="processing" class="fas fa-spinner fa-pulse"></i> Search</button>
			</div>
		</div>      
    </div>
	<div v-if="no_result" class="col-12 text-center">
		<h3>{{user_search}} haven't used any service in the last seven days.</h3>
	</div>
		
	<div v-show="graphData.length > 0" class="col-12 col-md-10 offset-md-1"  style="margin-top:20px;">
		<h3>Services used by {{user_search}}</h3>
		<div style="position: relative; height:70vh; width:80vw" id="canva">
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
	components: {
		"v-select": vSelect
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
		all_services: {},
		start_date: "",
		end_date: "",
		graphData: [],
		show_dates: false,
		no_result: false,
		errors: {
			username: false
		},
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
		// this.$cognitoAuth.getIdToken((err, jwtToken) => {
		// if (err) {
		// 	console.log("Dashboard: Couldn't get the session:", err, err.stack);
		// 	return;
		// }
		// this.token = jwtDecode(jwtToken);
		// this.user = this.$cognitoAuth.getCurrentUser();
		// document.getElementsByName("token")["0"].content = jwtToken;
		// //console.log(jwtToken)
		// });
		var _this = this;
		axios.get(" https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users")
		.then(function(resp) {        
			_this.all_users = resp.data;        
		});
		axios.get(" https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/services")
		.then(function(resp) {
			for (var i in resp.data) {
			_this.all_services[resp.data[i]] = {
				name: resp.data[i],
				count: 0
			};
			}
		});
	},

	methods: {
		search_callback(resp) {
			this.all_data = [];
			this.user_search = this.user_name;
			for (var i in resp.data) {				
				var datatime = resp.data[i].eventTime;				
				var time = moment(datatime,'YYYY-MM-DDTHH:mm:ssZ').format('HH:mm:ss DD-MM-YYYY');
				this.all_data.push([i,resp.data[i].eventName,time]);
			}

			for (var i in this.all_services) {
				this.all_services[i].count = 0;
			}
		
			for (var i in resp.data) {
				var data2 = resp.data[i].eventSource;
				var service = data2.split(".");
				this.all_services[service[0]].count =this.all_services[service[0]].count + 1;
			}

			for (var i in this.all_services) {
				if (this.all_services[i].count > 0) {
					this.graphData.push([this.all_services[i].name,this.all_services[i].count]);
				}
			}
		
			if (this.graphData.length > 0) {
				this.no_result = false;				
				this.drawGraph();
				var _this = this;
				this.$nextTick(function() {
				$("#table-details").dataTable().fnClearTable();
				$("#table-details").dataTable().fnAddData(_this.all_data);
				$("#table-details").dataTable().fnDraw();				
				});
			} else {
				this.no_result = true;
			}
			this.processing = false;
		},
		search() {
			this.graphData = [];

			if (this.user_name != "") {
				this.errors.username = false;
				this.processing = true;
				var _this = this;
				if (!this.show_dates) {
				axios.get(" https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users/" +this.user_name)
					.then(function(resp) {
					_this.search_callback(resp);
					});
				} else {
				axios.get(" https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users/" +this.user_name +"?from=" +this.start_date +	"&to=" +this.end_date)
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
					// animation: {
					// 	duration: 2000
					// },
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
							size: 14,
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
		var maxDate = moment().format("DD/MM/YYYY");
		$("#date-range").daterangepicker(
			{
				opens: "left",
				maxDate: maxDate,
				locale: {
					format: "DD/MM/YYYY"
				}			
			},
			function(start, end, label) {
				_this.start_date = start.format("YYYY-MM-DD");
				_this.end_date = end.format("YYYY-MM-DD");
			}
		);
		$("#enable-date").iCheck({
			checkboxClass: "icheckbox_square-blue",
			radioClass: "iradio_square-blue"
		});

		$("#enable-date").on("ifClicked", function(event) {
			if (_this.show_dates) {
				_this.show_dates = false;
			} else {
				_this.show_dates = true;
			}
		});
		$("#table-details").DataTable({
			data: _this.all_data,
			columns: [{ title: "#" }, { title: "Event" }, { title: "Timestamp" }]
		});
	}
};
</script>
<style>

</style>

