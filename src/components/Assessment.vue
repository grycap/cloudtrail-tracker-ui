<template>
	<div class="dashboard">
		<vuestic-widget class="no-padding no-v-padding">
			<div class="row" style="padding-top:40px;">
				<div class="col-12 col-md-5 col-lg-4" style="margin-top:10px;">
					<v-select  v-model="selected_users" multiple persistent-hint ref="select" label="first_name" :options="all_users" placeholder="Users" v-bind:class="{'is-invalid' : errors.selected_users}"></v-select>
					<span v-show="errors.selected_users" style="color: #cc3300; font-size: 12px;"><b>Please, select a username at least.</b></span>
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
				<div class="row col-12 col-md-3 col-lg-4">
					<div class="col-6" style="padding-top:5px;">
						<button class="btn btn-primary" @click="search()" :disabled="processing == true" style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;">
						<i v-if="processing" class="fas fa-spinner fa-pulse"></i><i v-if="!processing" class="fas fa-search d-lg-none" ></i><span v-if="!processing" class="d-none d-lg-block">Download</span></button>
					</div>
				</div>
      		</div>

      <div class="row" style="padding-left:40px;" >

        <fieldset class="col-12 col-md-3" style="padding-right:20px;display:inline-block">
            <vuestic-radio-button
            :label="'CursoCloudAWS'"
            id="radio1"
            value="option1"
            :name="'radio'"
            v-model="check"
            />

        </fieldset>
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MBDA-CGDNGB'"
            id="radio2"
            :value="'option2'"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MBDA-MEGBD'"
            id="radio3"
            value="option3"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>

        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MUCNAP-ICP'"
            id="radio4"
            value="option4"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
      </div>

      <div class="row" style="padding-left:40px;" >
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MUCNAP-CBD'"
            id="radio5"
            value="option5"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MUGI-SEN'"
            id="radio6"
            value="option6"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'GII-LPP'"
            id="radio7"
            value="option7"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'GCD-IPD'"
            id="radio8"
            value="option8"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>

      </div>
      <div class="row" style="padding-left:40px;" >
        <fieldset class="col-12 col-md-3" style="padding-right:20px;">
          <vuestic-radio-button
            :label="'MUCC-DDS'"
            id="radio9"
            value="option9"
            :name="'radio'"
            v-model="check"
            />
        </fieldset>
      </div>
			<div class="row" style=" padding-bottom:40px;">
				<fieldset style = "width: 500px; margin:  0px auto;">
					<span v-show="select_subject" style="color: #cc3300; font-size: 12px;"><b>Please, select the subject that it belongs to</b></span>
				</fieldset>
			</div>
			<div v-if="no_result" class="col-12 text-center">
				<h3>{{user_search}} has not used any service.</h3>
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
import JsonExcel from 'vue-json-excel';
import { jsPDF } from "jspdf"; 

export default {
	name: "dashboard",
	components: {
		"v-select": vSelect,
		'downloadExcel': JsonExcel,
	},
	data() {
		return {
			json_fields: {
				'alucloud': 'user',
				'PL_EC2': 'ec2',
				'PL_EC2_S3': 's3',
				'PL_RDS': 'rds',
				'PL_APP': 'app',
				'PL_CF': 'cf',
				'PL_VPC': 'vpc',
				'PL_LAMBDA_SQS': 'sr',
			},
			json_data: [],
			graphData2: [],

			token: "Loading token..",
			user: {},
			name1: "Hello",
			options: [],
			all_users: [],
			all_data: [],
			all_practices_percentage: [],
			pdf_data: [],
			selected_subject: "",
			max: 0,
			array: [],
			user_name: "",
			selected_users: [],
			user_search: "",
			all_services: [],
			start_date: "",
			end_date: "",
			start: '',
			end : '',
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
			res : [],

		};

	},
	created() {

		var _this = this;
		axios.get(api.url.general+ "users")
		.then(function(resp) {
			var session = JSON.parse(localStorage.getItem("session"))

			if (session.user.username == "gmolto" || session.user.username == "admin" || session.user.username=="alucloud187"){
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
		}).catch(function (error) {
			if (error.response.status == 401){
				_this.$router.replace(_this.$route.query.redirect || "/logout");
				console.log("Your Session has expired ");
			}

		});
		this.initData = envprac.INITDATA;
		this.referData = envprac.REFERDATA;
	},

	watch: {
		"check"(val){
			if(val != "" ){
				var dmy = new Date();
				var currDay = dmy.getDay();
				var currMonth = dmy.getMonth();
				var currYear = dmy.getFullYear();
        var currYearEnd = dmy.getFullYear() + 1;

				if (this.check == "option6"){
					this.start = new Date(currYear, 1, 1)
					this.end = new Date (currYear,6, 1)

				}else if(this.check == "option9"){
          	this.start = new Date(currYear, 1, 1)
					  this.end = new Date (currYear,5, 30)
        }else{
				   if (currMonth >= 8){
					this.start = new Date(currYear, 8, 1);
					this.end = new Date(currYearEnd, 6, 31);
					}
					else{
						this.start = new Date(currYear - 1, 8, 1);
						this.end = new Date(currYearEnd - 1, 6, 31);
					}
        }
				this.start_date = moment(this.start).format("YYYY-MM-DD");
				this.end_date = moment(this.end).format("YYYY-MM-DD");
				$('#date-range').data('daterangepicker').setStartDate(moment(this.start).format("DD/MM/YYYY"));
        $('#date-range').data('daterangepicker').setEndDate(moment(this.end).format("DD/MM/YYYY"));
				this.search()
			}
		}
	},

	methods: {
		search_callback(resp) {
			this.all_data = []
			this.graphData = [];
			this.user_search = this.user_name;
			for (var i in resp.data) {

				var event_data= resp.data[i].eventName
				if( typeof this.all_services[event_data] == 'undefined'){
					this.all_services[event_data] = 1;
				}else{
					this.all_services[resp.data[i].eventName] = this.all_services[resp.data[i].eventName] + 1
				}
			}

			if(this.check == "option4" || this.check == "option9"){						// Opcion 4 and 9 VPC after PL_EC2_S3
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
					this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EMR"
				})
					this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EMR"
				})
			}
			if (this.check == "option2"){

				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option3"){
				var removeValIndex = [0,1,2,3,4,5,7]
				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option4"){
				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option5"){
				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EC2" && obj["0"]!=="PL_EC2_S3" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option6"){
				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_EMR" && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_EMR"  && obj["0"]!=="PL_VPC" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option7"){

				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS"  && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS"  && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option8"){

				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS"  && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_VPC" && obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_RDS" && obj["0"]!=="PL_APP" && obj["0"]!=="PL_CF" && obj["0"]!=="PL_LAMBDA_SQS"  && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}
			if (this.check == "option9"){

				this.graphData = this.graphData.filter(function(obj){
					return obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
				this.all_data = this.all_data.filter(function(obj){
					return obj["0"]!=="PL_DYNAMODB" && obj["0"]!=="PL_EMR" && obj["0"]!=="PL_SERVERLESS_APP"
				})
			}

			//Calcular media
			var practices_percentage = 0;
			for (let i=0; i < this.graphData.length;i++){
				practices_percentage+=this.graphData[i][1];
			}
			practices_percentage = practices_percentage / this.graphData.length;
			practices_percentage = practices_percentage.toFixed(2);
			let percentage = {idAlumno:this.user_name, percentage: practices_percentage};
			this.all_practices_percentage.push(percentage);	

			if (this.graphData.length > 0) {
				this.no_result = false;	
				var _this = this;
			} else {
				this.no_result = true;
			}
			this.processing = false;
		},
		async search() {
				$(".collapse").collapse('hide');
				this.all_practices_percentage = [];
				var checkboxchecked = $("#radio1")
				if ($("input[name='radio']:checked").is(':checked')){

					this.select_subject = false
				}else {
					this.select_subject = true
				}

				if (this.selected_users == "" || this.selected_users == null) {
					this.errors.selected_users = true;
				}else {
					this.errors.selected_users = false;
				}

				if (this.selected_users != "" && this.selected_users != null && this.select_subject == false) {
					this.errors.selected_users = false;
					this.processing = true;
					var _this = this;
					for (let i = 0; i < this.selected_users.length;i++){
						this.user_name = this.selected_users[i];
						await axios.get(api.url.general +	"users/" + this.user_name +"?from=" +this.start_date +	"&to=" +this.end_date)
							.then(function(resp) {
							_this.all_services=[];

							_this.search_callback(resp);
						});
					}
					this.downloadFile();
				}
		},
		isMobileDevice(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		},
		downloadFile(){
			this.pdf_data = [];

			if (this.check == "option1"){
				this.selected_subject = "CursoCloudAWS";
			}
			if (this.check == "option2"){
				this.selected_subject = "MBDA-CGDNGB";
			}
			if (this.check == "option3"){
				this.selected_subject = "MBDA-MEGBD";
			}
			if (this.check == "option4"){
				this.selected_subject = "MUCNAP-ICP";
			}
			if (this.check == "option5"){
				this.selected_subject = "MUCNAP-CBD";
			}
			if (this.check == "option6"){
				this.selected_subject = "MUGI-SEN";
			}
			if (this.check == "option7"){
				this.selected_subject = "GII-LPP";
			}
			if (this.check == "option8"){
				this.selected_subject = "GCD-IPD";
			}
			if (this.check == "option9"){
				this.selected_subject = "MUCC-DDS";
			}

			this.pdf_data = {
				subject: this.selected_subject,
				start_date: this.start_date,
				end_date: this.end_date,
				students: this.all_practices_percentage
			};

			var text = this.pdf_data.subject + ": " + this.pdf_data.start_date + " / " + this.pdf_data.end_date + "\n\nID\t\tPercentage\n";
			for (let i=0; i < this.pdf_data.students.length;i++){
				text = text + this.pdf_data.students[i].idAlumno + "\t" + this.pdf_data.students[i].percentage + "\n";
			}

			console.log(text);

			var doc = new jsPDF();
			doc.text(text, 10, 10);
			doc.save("alu_data.pdf");

			console.log(this.pdf_data);
		}
	},
	mounted() {
    	console.log(!this.isMobileDevice())
		var d = new Date();
		   var currDay = d.getDay();
           var currMonth = d.getMonth();
           var currYear = d.getFullYear();
		   var currYearEnd = d.getFullYear() + 1;
		   if (currMonth >= 8){
			  var  startDateDefault = new Date(currYear, 8, 1);
			  var  endDateDefault = new Date(currYearEnd, 6, 31);
		   }
		   else{
			  var startDateDefault = new Date(currYear -1, 8, 1);
			  var  endDateDefault = new Date(currYearEnd - 1, 6, 31);
		   }

		   var start_date_default = moment(startDateDefault).format("DD/MM/YYYY");
		   var end_date_default = moment(endDateDefault).format("DD/MM/YYYY");

		var _this = this;
		var maxDate = moment().format("DD/MM/YYYY");
		$("#date-range").daterangepicker(
		{
			opens: "left",
			startDate: start_date_default,
			endDate : end_date_default,
			locale: {
			format: "DD/MM/YYYY"
			}
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
