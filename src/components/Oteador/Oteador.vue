<template>
  <div class="oteador">
    <info-widgets-oteador
      v-show="lastService != '' && !showSpinner"
    ></info-widgets-oteador>

    <div v-show="loading" style="position:fixed; top:50%; left:50%;">
      <atom-spinner
        :animation-duration="2000"
        :size="100"
        color="rgb(74,227,135)"
      />
    </div>
    <vuestic-widget
      v-show="loading == false"
      class="no-padding no-v-padding"
      style="width:102%"
    >
      <div class="row">
        <div class="col-md-12" style="margin-top:20px;">
          <h6>Select an option to search in the</h6>
        </div>
      </div>
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3"
          style="margin-top:5px;"
        >
          <fieldset>
            <vuestic-simple-select
              v-model="simpleSelectModel_service"
              v-bind:options="simpleOptions_service"
              @input="graphTime"
            ></vuestic-simple-select>
          </fieldset>
        </div>
        <div
          class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3"
          style="margin-top:5px;"
        >
          <fieldset>
            <vuestic-simple-select
              v-model="simpleSelectModel_region"
              v-bind:options="simpleOptions_regions"
              @input="graphTime"
            ></vuestic-simple-select>
          </fieldset>
        </div>
      </div>
      <div v-if="noResult" class="col-12 text-center">
        <h3>No instances of {{ simpleSelectModel_service }}.</h3>
      </div>
      <!-- <div v-show="showSpinner" style="position:absolute;height:100px; top:50%; margin-top:-50px; left:55%;justify-content:center;">	 -->
      <div v-show="showSpinner" style="position:fixed; top:50%; left:50%;">
        <semipolar-spinner
          :animation-duration="2000"
          :size="90"
          color="rgb(74,227,135)"
        />
      </div>
      <div class="row" style="margin-top:20px; min-height:50vh;">
        <div
          v-show="graphDataServices.length > 0 && !showSpinner"
          class="col-12"
          style="margin-top:20px;"
        >
          
          <h3>States in the {{ simpleSelectModel_service }}</h3>
          <div style="position: relative; height:50vh;" id="canva">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>

      <div class="row" style="margin-bottom:40px;" v-show="graphDataServices.length > 0 && !showSpinner">
        <div id="accordion-dashboard" class="col-md-12">
          <div> 
            <div id="headingOne">
              <h5 class="mb-0">
                <button
                  class="btn btn-primary"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                  style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;"
                >
                  Details
                </button>
              </h5>
            </div>
            <div
              id="collapseOne"
              class="collapse"
              aria-labelledby="headingOne"
              data-parent="#accordion-dashboard"
            >
              <div class="card-body col-12">
                <table
                  id="table-details"
                  class="stripe"
                  style="width:100%"
                ></table>
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
import { AtomSpinner } from "epic-spinners";
import { SemipolarSpinner } from "epic-spinners";
import api from "../../api.js";
import InfoWidgetsOteador from "./InfoWidgetsOteador";
import {CognitoIdentityCredentials} from 'aws-sdk'

export default {
  name: "oteador",
  components: {
    AtomSpinner,
    SemipolarSpinner,
    InfoWidgetsOteador
  },
  data() {
    return {
      token: "Loading token..",
      all_data_services: [],
      maxValue: 0,
      simpleSelectModel_service: "EC2 instances",
      simpleSelectModel_region: "us-east-1",
      _all_services: [],
      graphDataServices: [],
      graphDataServicesPrev : [],
      noResult: false,
      showSpinner: false,
      processing: false,
      loading: true,
      simpleOptions_service: [
        "EC2 instances",
        "RDS instances",
        "Auto Scaling Groups",
        "Elastic IPs",
        "Buckets S3",
        "Elastic Load Balancers",
        "Lambda Functions"
      ],
      simpleOptions_regions: ["us-east-1", "us-west-1"],
      myLoop: "",
      generalServices: [],
      generalPrice: [],
      sumPrices: [],
      lastFind: "",
      lastService: "",
      cargaInicial: true
    };
  },
  beforeDestroy () {
    clearInterval(this.myLoop);
  },
  created() {
    var _this = this;
    
    $.extend($.fn.dataTable.defaults, {
      responsive: true
    });
  },
  methods: {
    graphTime() {
      $("#myChart").remove();

      this.noResult = false;
      this.showSpinner = true;
      var _this = this;

      var ec2 = { name: "ec2", count: 0, state: "" };
      var rds = { name: "rds", count: 0, state: "" };
      var s3 = { name: "s3", count: 0, state: "" };
      var autoscaling = { name: "autoscaling", count: 0, state: "" };
      var elasticIP = { name: "elasticIP", count: 0, state: "" };
      var elb = { name: "elb", count: 0, state: "" };
      var lambda = { name: "lambda", count: 0, state: "" };

      this._all_services = { ec2, rds, s3, autoscaling, elasticIP, elb, lambda };
    
      this.cargaInicial = true;

      if (_this.myLoop == "") {
        _this.myLoop = setInterval(function() {
          if (_this.lastService != _this.simpleSelectModel_service)
            _this.lastFind = "";
            _this.lastService = _this.simpleSelectModel_service        
          _this.getInformationService();
          _this.getInformationRegions();
          _this.getInformationWidgets();
        }, 12000);
      }
    },
    search(resp) {
      this.graphDataServices = [];
      this.all_data_services = [];
      
      for (var i in resp.data) {
        var datatime = resp.data[i].timestart_service;
        var timeStart = "";
        if (datatime != "") {
          timeStart = moment(datatime, "YYYY-MM-DDTHH:mm:ssZ").format(
            "DD-MM-YYYY HH:mm:ss"
          );
          
        }
        var datatime2 = resp.data[i].timemodified_service;
        var timeModified = "";
        if (datatime2 != "") {
          timeModified = moment(datatime2, "YYYY-MM-DDTHH:mm:ssZ").format(
            "DD-MM-YYYY HH:mm:ss"
          );
          
        }

        var urlEC2 =
          "https://console.aws.amazon.com/ec2/v2/home?region=" +
          this.simpleSelectModel_region +
          "#Instances:search=" +
          resp.data[i].id_service +
          ";sort=instanceId";

        var urlELB =
          "https://console.aws.amazon.com/ec2/v2/home?region=" +
          this.simpleSelectModel_region +
          "#LoadBalancers:search=" +
          resp.data[i].id_service +
          ";sort=loadBalancerName";
        var urlAUTOSCALING =
          "https://console.aws.amazon.com/ec2/autoscaling/home?region=" +
          this.simpleSelectModel_region +
          "#AutoScalingGroups:id=" +
          resp.data[i].id_service +
          ";filter=" +
          resp.data[i].id_service +
          ";view=details";

        var urlRDS =
          "https://console.aws.amazon.com/rds/home?region=" +
          this.simpleSelectModel_region +
          "#database:id=" +
          resp.data[i].id_service +
          ";is-cluster=false";

        var urlELASTICIP =
          "https://console.aws.amazon.com/ec2/v2/home?region=" +
          this.simpleSelectModel_region +
          "#Addresses:search=" +
          resp.data[i].ip_service;

        var urlLAMBDA =
          "https://console.aws.amazon.com/lambda/home?region=" +
          this.simpleSelectModel_region +
          "#/functions/" +
          resp.data[i].id_service +
          "?tab=configuration";

        var urlS3 =
          "https://s3.console.aws.amazon.com/s3/buckets/" +
          resp.data[i].id_service +
          "/?region=" +
          this.simpleSelectModel_region;

        var url = "";
        switch (this.simpleSelectModel_service) {
          case this.simpleOptions_service[0]:
            url = urlEC2;
            break;
          case this.simpleOptions_service[1]:
            url = urlRDS;
            break;
          case this.simpleOptions_service[2]:
            url = urlAUTOSCALING;
            break;
          case this.simpleOptions_service[3]:
            url = urlELASTICIP;
            break;
          case this.simpleOptions_service[4]:
            url = urlS3;
            break;
          case this.simpleOptions_service[5]:
            url = urlELB;
            break;
        }
        
        this.all_data_services.push([
          i,
          "<a href=" +
            url +
            ' target="_blank">' +
            resp.data[i].ip_service +
            "</a>",
          "<a href=" +
            url +
            ' target="_blank">' +
            resp.data[i].id_service +
            "</a>",
          resp.data[i].desired_service,
          resp.data[i].min_service,
          resp.data[i].max_service,
          resp.data[i].owner_service,
          resp.data[i].type_service,
          resp.data[i].state_service,
          resp.data[i].code_service,
          resp.data[i].memory_service,
          timeStart,
          timeModified,
          resp.data[i].private_address
        ]);

      }

      for (var i in this._all_services) {
        this._all_services[i].count = 0;
      }

      if (this.simpleSelectModel_service == this.simpleOptions_service[5]) {
        var types = {};
        for (var i in resp.data) {
          var service = resp.data[i].name_service;
          var type = resp.data[i].type_service;
      
          if (type in types) {
            types[type] = types[type] + 1;
          } else {
            types[type] = 1;
          }

          this._all_services[service].count = this._all_services[service].count + 1;
        }
          for (var i in types) {
            if (types[i] > 0) {
              this.graphDataServices.push([i, types[i]]);
            }
          }

      } else {
      
        var states = {};
        for (var i in resp.data) {
          var service = resp.data[i].name_service;
          var state = resp.data[i].state_service;

          if (state in states) {
            states[state] = states[state] + 1;
          } else {
            states[state] = 1;
          }

          this._all_services[service].count = this._all_services[service].count + 1;
        }

        
        for (var i in states) {
          if (states[i] > 0) {
            this.graphDataServices.push([i, states[i]]);
          }
        }
      }
      
      var noDraw = false;
      if (!this.cargaInicial && JSON.stringify(this.graphDataServices) === JSON.stringify(this.graphDataServicesPrev)) {
        noDraw = true;
      }
      this.graphDataServicesPrev = [];
      for (var i in states) {
        if (states[i] > 0) {
          this.graphDataServicesPrev.push([i, states[i]]);
        }
      }

      if (this.graphDataServices.length > 0) {
        this.noResult = false;
        if (!noDraw) {
          this.drawGraph();
          this.cargaInicial = false;
          var _this = this;
          this.$nextTick(function() {
            $("#table-details")
              .dataTable()
              .fnClearTable();
            if (_this.all_data_services.length != 0) {
              $("#table-details")
                .dataTable()
                .fnAddData(_this.all_data_services);
            }
            $("#table-details")
              .dataTable()
              .fnDraw();
            switch (_this.simpleSelectModel_service) {
              case _this.simpleOptions_service[0]:
                _this.myTable.columns([2, 6, 7, 8, 11]).visible(true);
                _this.myTable.columns([1, 3, 4, 5, 9, 10,12,13]).visible(false);
                break;
              case _this.simpleOptions_service[1]:
                _this.myTable.columns([2, 6, 7, 8, 11]).visible(true);
                _this.myTable.columns([1, 3, 4, 5, 9, 10,12,13]).visible(false);
                break;
              case _this.simpleOptions_service[2]:
                _this.myTable.columns([2, 3, 4, 5, 11]).visible(true);
                _this.myTable.columns([1, 6, 7, 8, 9, 10,12,13]).visible(false);
                break;
              case _this.simpleOptions_service[3]:
                _this.myTable.columns([3, 4, 5, 6, 7, 8, 9, 10, 11,12]).visible(false);
                _this.myTable.columns([1,2,13]).visible(true);
                break;
              case _this.simpleOptions_service[4]:
                _this.myTable.columns([1, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13]).visible(false);
                _this.myTable.columns([2]).visible(true);
                break;
              case _this.simpleOptions_service[5]:
                _this.myTable.columns([2, 7, 8, 11]).visible(true);
                _this.myTable.columns([1, 3, 4, 5, 6, 9, 10,12,13]).visible(false);
                break;
              case _this.simpleOptions_service[6]:
                _this.myTable.columns([2, 7, 9, 10, 12]).visible(true);
                _this.myTable.columns([1, 3, 4, 5, 6, 8,11,13]).visible(false);
                break;
            }
          });
        }
      } else {
        this.noResult = true;
      }
      this.processing = false;
      this.loading = false;
      this.showSpinner = false;
    },
    drawGraph() {
      var _this = this;
      //finding max value of array
      this.maxValue = 0;
      for (var i in this.graphDataServices) {
        if (this.maxValue < this.graphDataServices[i][1]) {
          this.maxValue = this.graphDataServices[i][1];
        }
      }

      $("#canva").append('<canvas id="myChart"></canvas>');

      var xLabel = "States";
      if (this.simpleSelectModel_service == this.simpleOptions_service[5]) xLabel = "Types";
      else if (this.simpleSelectModel_service == this.simpleOptions_service[2] || 
      this.simpleSelectModel_service == this.simpleOptions_service[3] ||
      this.simpleSelectModel_service == this.simpleOptions_service[4]) xLabel = "Number";

      var ctx = $("#myChart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.graphDataServices.map(graphDataServices => graphDataServices[0]),
          datasets: [
            {
              label: "#Services",
              backgroundColor: "rgba(74,227,135,0.2)",
              borderColor: "rgba(0,102,0,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(204, 255, 51,0.5)",
              hoverBorderColor: "rgba(0,102,0,1)",
              data: this.graphDataServices.map(graphDataServices => graphDataServices[1])
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
              display: function() {
                if ($("#canva").width() < 300) {
                  return false;
                } else {
                  return true;
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
                size: 10,
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
                  fontFamily:
                    "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
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
                  stepSize: Math.ceil(this.maxValue / 10),
                  max: this.maxValue + Math.ceil(this.maxValue / 10)
                }
              }
            ],
            xAxes: [
              {
                display: true,
                gridLines: { display: false },
                scaleLabel: {
                  display: true,
                  labelString: xLabel,
                  fontColor: "#000",
                  fontFamily:
                    "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                  // fontSize: 16
                },
                ticks: {
                  callback: function(value, index, values) {
                    if ($("#canva").width() < 300) {
                      return null;
                    } else {
                      return value;
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
          }
        }
      });
      
      $("#myChart").click(function(e) {
        this.activeBars = myChart.getElementAtEvent(e);
        
        var find = this.activeBars["0"]._model.label;
        $(".collapse").collapse("show");
        _this.lastFind = find;
        $("#table-details")
          .DataTable()
          .search(find)
          .draw();
      });
      $("#table-details")
        .DataTable()
        .search(_this.lastFind)
        .draw();
      
    },
    getInformationService() {
      var specificUrl = "";
      var _this = this;
      switch (this.simpleSelectModel_service) {
        case this.simpleOptions_service[0]:
          specificUrl =
            "services/AllInstancesEC2/region/" + this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "ec2",
                id_service: resp.data[i]["Id"],
                timestart_service: resp.data[i]["Launch time"],
                owner_service: resp.data[i]["Owner"],
                type_service: resp.data[i]["Type"],
                state_service: resp.data[i]["State"],
                desired_service: "",
                min_service: "",
                max_service: "",
                ip_service: "",
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[1]:
          specificUrl =
            "services/AllInstancesRDS/region/" + this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "rds",
                id_service: resp.data[i]["DBInstanceIdentifierId"],
                timestart_service: resp.data[i]["Intance Create Time"],
                owner_service: resp.data[i]["MasterUsername"],
                type_service: resp.data[i]["DBInstanceClass"],
                state_service: resp.data[i]["DBInstanceStatus"],
                desired_service: "",
                min_service: "",
                max_service: "",
                ip_service: "",
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[2]:
          specificUrl =
            "services/AutoScalingGroups/region/" +
            this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "autoscaling",
                id_service: resp.data[i]["AutoScalingGroupName"],
                timestart_service: resp.data[i]["CreatedTime"],
                desired_service: resp.data[i]["DesiredCapacity"],
                min_service: resp.data[i]["MinSize"],
                max_service: resp.data[i]["MaxSize"],
                owner_service: "",
                type_service: "",
                state_service: "",
                ip_service: "",
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[3]:
          specificUrl =
            "services/ElasticIP/region/" + this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "elasticIP",
                ip_service: resp.data[i]["PublicIp"],
                timestart_service: "",
                owner_service: "",
                type_service: "",
                state_service: "",
                desired_service: "",
                min_service: "",
                max_service: "",
                id_service: resp.data[i]["InstanceId"],
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: resp.data[i]["PrivateIpAddress"],
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[4]:
          specificUrl =
            "services/AllBuckets/region/" + this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "s3",
                id_service: resp.data[i],
                timestart_service: "",
                owner_service: "",
                type_service: "",
                state_service: "",
                desired_service: "",
                min_service: "",
                max_service: "",
                ip_service: "",
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[5]:
          specificUrl =
            "services/ElasticLoadBalancing/region/" +
            this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "elb",
                id_service: resp.data[i]["LoadBalancerName"],
                timestart_service: resp.data[i]["CreatedTime"],
                owner_service: "",
                type_service: resp.data[i]["Type"],
                state_service: resp.data[i]["State"],
                desired_service: "",
                min_service: "",
                max_service: "",
                ip_service: "",
                code_service: "",
                memory_service: "",
                timemodified_service: "",
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        case this.simpleOptions_service[6]:
          specificUrl =
            "services/Lambda/region/" +
            this.simpleSelectModel_region;
          axios.get(api.url.oteador + specificUrl).then(function(resp) {
            var data = [];
            for (var i in resp.data) {
              var aux = {
                name_service: "lambda",
                id_service: resp.data[i]["FunctionName"],
                timestart_service: "",
                timemodified_service: resp.data[i]["LastModified"],
                owner_service: "",
                type_service: resp.data[i]["Runtime"],
                state_service: "",
                desired_service: "",
                min_service: "",
                max_service: "",
                ip_service: "",
                code_service: resp.data[i]["CodeSize"],
                memory_service: resp.data[i]["MemorySize"],
                private_address: ""
              };
              data.push(aux);
            }
            var response = { data };
            _this.search(response);
          }).catch(function (error) {
            if (error.response == undefined || error.response.status == 401){
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired ");
            }
            
          });
          break;
        default:
      }
    },
    getInformationRegions() {
      var _this = this;
      switch(this.simpleSelectModel_service) {

        case this.simpleOptions_service[0]:
        case this.simpleOptions_service[2]:
        case this.simpleOptions_service[3]:
        case this.simpleOptions_service[4]:
        case this.simpleOptions_service[5]:
        case this.simpleOptions_service[6]:
          if (window.localStorage.getItem(this.simpleOptions_service[0]+"_regions") == null) {
            this.getRegionsEC2().then((regions) => {
              _this.simpleOptions_regions = regions;
              window.localStorage.setItem(this.simpleOptions_service[0]+"_regions",
              JSON.stringify(regions));
            });
          } else {
            var regions = JSON.parse(window.localStorage.getItem(this.simpleOptions_service[0]+"_regions"));
            _this.simpleOptions_regions = regions;
          }

          break;
        case this.simpleOptions_service[1]:

          this.getRegionsRDS().then((regions) => {
            _this.simpleOptions_regions = [];
            regions.forEach(function myFunction(region) {
              _this.simpleOptions_regions.push(region);
            });
          });
          break;
      }

    },
    getInformationWidgets() {
      var _this = this;
      axios
        .get(
          api.url.oteador + "services/region/" + this.simpleSelectModel_region
        )
        .then(function(resp2) {
          let promises = [];

          for (var service in resp2.data) {
            _this.generalServices[service] = resp2.data[service].number;
            _this.sumPrices[service] = 0.0;

            switch (service) {
              case "ec2":
                let valores = [];
                var listInstances = resp2.data[service].info;
                for (var instance in listInstances) {
                  var type_service = listInstances[instance]["Type"];
                  var locationDescription =
                    listInstances[instance]["Region name"];
                  valores.push(type_service + "_" + locationDescription);
                }
                var valores2 = {};
                valores.forEach(function(i) {
                  valores2[i] = (valores2[i] || 0) + 1;
                });

                for (var type in valores2) {
                  if (window.localStorage.getItem(type) == null) {
                    promises.push(
                      _this.getPriceEC2(
                        service,
                        type.split("_")[0],
                        locationDescription,
                        valores2[type]
                      )
                    );
                  } else {
                    var result = JSON.parse(window.localStorage.getItem(type));
                    promises.push(
                      new Promise(resolve => {
                        resolve([service, result["price"] * valores2[type]]);
                      })
                    );
                  }
                }
                break;
              case "rds":
                let valoresRDS = [];
                var listInstances = resp2.data[service].info;
                for (var instance in listInstances) {
                  var type_service = listInstances[instance]["DBInstanceClass"];
                  var locationDescription =
                    listInstances[instance]["Region name"];
                  valoresRDS.push(type_service + "_" + locationDescription);
                }
                var valores2 = {};
                valoresRDS.forEach(function(i) {
                  valores2[i] = (valores2[i] || 0) + 1;
                });

                for (var type in valores2) {
                  if (
                    window.localStorage.getItem(
                      type_service + "_" + locationDescription
                    ) == null
                  ) {
                    promises.push(
                      _this.getPriceRDS(
                        service,
                        type.split("_")[0],
                        locationDescription,
                        valores2[type]
                      )
                    );
                  } else {
                    var result = JSON.parse(
                      window.localStorage.getItem(
                        type_service + "_" + locationDescription
                      )
                    );
                    promises.push(
                      new Promise(resolve => {
                        resolve([service, result["price"] * valores2[type]]);
                      })
                    );
                  }
                }
                break;
              case "autoscaling":
                break;
              case "elb":
                let valoresElb = [];
                var listInstances = resp2.data[service].info;
                for (var instance in listInstances) {
                  var locationDescription =
                    listInstances[instance]["Region name"];
                  var typeElb = listInstances[instance]["Type"];
                  valoresElb.push(typeElb + "_" + locationDescription);
                }
                var valores2 = {};
                valoresElb.forEach(function(i) {
                  valores2[i] = (valores2[i] || 0) + 1;
                });
                for (var type in valores2) {
                  if (window.localStorage.getItem(type) == null) {
                    promises.push(
                      _this.getPriceELB(
                        service,
                        type.split("_")[0],
                        locationDescription,
                        valores2[type]
                      )
                    );
                  } else {
                    var result = JSON.parse(window.localStorage.getItem(type));
                    promises.push(
                      new Promise(resolve => {
                        resolve([service, result["price"] * valores2[type]]);
                      })
                    );
                  }
                }

                break;
              case "lamb":
                let valoresLambda = [];
                var listInstances = resp2.data[service].info;
                for (var instance in listInstances) {
                  var locationDescription =
                    listInstances[instance]["Region name"];
                  var memorySize = listInstances[instance]["MemorySize"];
                  valoresLambda.push(memorySize + "_" + locationDescription);
                }
                var valores2 = {};
                valoresLambda.forEach(function(i) {
                  valores2[i] = (valores2[i] || 0) + 1;
                });
                for (var type in valores2) {
                  if (window.localStorage.getItem(type) == null) {
                    promises.push(
                      _this.getPriceLambda(
                        service,
                        locationDescription,
                        type.split("_")[0],
                        valores2[type]
                      )
                    );
                  } else {
                    var result = JSON.parse(window.localStorage.getItem(type));
                    promises.push(
                      new Promise(resolve => {
                        resolve([service, result["price"] * valores2[type]]);
                      })
                    );
                  }
                }
                break;
              case "elasticIP":
                break;
            }
            
            Promise.all(promises).then(results => {
              for (var i in results) {
                _this.sumPrices[results[i][0]] =
                  parseFloat(_this.sumPrices[results[i][0]]) +
                  parseFloat(results[i][1]);
              }
              _this.$eventHub.$emit("generalPrice", {
                type: results[i][0],
                price: _this.sumPrices[results[i][0]].toFixed(4)
              });
            });
            _this.$eventHub.$emit("generalServices", {
              type: service,
              value: resp2.data[service].number
            });
          }
        })
        .catch(function(error) {
          if (error.response == undefined || error.response.status == 401) {
            _this.$router.replace(_this.$route.query.redirect || "/logout");
            alert("Your Session has expired ");
          }
        });
    },
    getPriceEC2(service, type_service, locationDescription, numberInstances) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        
        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;
        
        AWS.config.region = 'us-east-1';

        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })
        
        var Pricing = require("aws-sdk/clients/pricing");

        var pricing = new Pricing({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });

        var params = {
          Filters: [
            {
              Field: "instanceType",
              Type: "TERM_MATCH",
              Value: type_service
            },
            {
              Field: "location",
              Type: "TERM_MATCH",
              Value: locationDescription
            },
            {
              Field: "operatingSystem",
              Type: "TERM_MATCH",
              Value: "Linux"
            },
            {
              Field: "tenancy",
              Type: "TERM_MATCH",
              Value: "Shared"
            },
            {
              Field: "capacitystatus",
              Type: "TERM_MATCH",
              Value: "Used"
            },
            {
              Field: "preInstalledSw",
              Type: "TERM_MATCH",
              Value: "NA"
            }
          ],
          FormatVersion: "aws_v1",
          MaxResults: 1,
          ServiceCode: "AmazonEC2"
        };
        var price = 0;

        pricing.getProducts(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else {
            var priceList = data["PriceList"];
            var priceOnDemand = priceList[0]["terms"]["OnDemand"];
            var priceDimensions = Object.values(priceOnDemand)[0][
              "priceDimensions"
            ];
            var pricePerUnit = Object.values(priceDimensions)[0][
              "pricePerUnit"
            ];
            const aux = {
              type: type_service,
              location: locationDescription,
              price: pricePerUnit["USD"]
            };
            window.localStorage.setItem(
              type_service + "_" + locationDescription,
              JSON.stringify(aux)
            );
            resolve([service, pricePerUnit["USD"] * numberInstances]);
          }
        });
      });
    },
    getPriceRDS(service, type_service, locationDescription, numberInstances) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        
        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;
        
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })

        var Pricing = require("aws-sdk/clients/pricing");

        var pricing = new Pricing({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });

        var params = {
          Filters: [
            {
              Field: "instanceType",
              Type: "TERM_MATCH",
              Value: type_service
            },
            {
              Field: "databaseEngine",
              Type: "TERM_MATCH",
              Value: "MySQL"
            },
            {
              Field: "location",
              Type: "TERM_MATCH",
              Value: locationDescription
            }
          ],
          FormatVersion: "aws_v1",
          MaxResults: 1,
          ServiceCode: "AmazonRDS"
        };
        pricing.getProducts(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else {
            var priceList = data["PriceList"];
            var priceOnDemand = priceList[0]["terms"]["OnDemand"];
            var priceDimensions = Object.values(priceOnDemand)[0][
              "priceDimensions"
            ];
            var pricePerUnit = Object.values(priceDimensions)[0][
              "pricePerUnit"
            ];
            const aux = {
              type: type_service,
              location: locationDescription,
              price: pricePerUnit["USD"]
            };
            window.localStorage.setItem(
              type_service + "_" + locationDescription,
              JSON.stringify(aux)
            );
            resolve([service, pricePerUnit["USD"] * numberInstances]);
          }
        });
      });
    },
    getPriceELB(service, type_service, locationDescription) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        
        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;
        
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })

        var Pricing = require("aws-sdk/clients/pricing");

        var pricing = new Pricing({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });

        var params = {
          Filters: [
            {
              Field: "location",
              Type: "TERM_MATCH",
              Value: locationDescription
            },
            {
              Field: "usagetype",
              Type: "TERM_MATCH",
              Value: "LoadBalancerUsage"
            }
          ],
          FormatVersion: "aws_v1",
          MaxResults: 1,
          ServiceCode: "AWSELB"
        };

        switch (type_service) {
          case "classic":
            params.Filters.push({
              Field: "operation",
              Type: "TERM_MATCH",
              Value: "LoadBalancing"
            });
            break;
          case "application":
            params.Filters.push({
              Field: "operation",
              Type: "TERM_MATCH",
              Value: "LoadBalancing:Application"
            });
            break;
          case "network":
            params.Filters.push({
              Field: "operation",
              Type: "TERM_MATCH",
              Value: "LoadBalancing:Network"
            });
            break;
          default:
        }

        pricing.getProducts(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else {
            var priceList = data["PriceList"];
            var priceOnDemand = priceList[0]["terms"]["OnDemand"];
            var priceDimensions = Object.values(priceOnDemand)[0][
              "priceDimensions"
            ];
            var pricePerUnit = Object.values(priceDimensions)[0][
              "pricePerUnit"
            ];

            const aux = {
              type: type_service,
              location: locationDescription,
              price: pricePerUnit["USD"]
            };
            window.localStorage.setItem(
              type_service + "_" + locationDescription,
              JSON.stringify(aux)
            );
            resolve([service, pricePerUnit["USD"]]);
          }
        });
      });
    },
    getPriceLambda(service, locationDescription, memorySize, numberInstances) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        
        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;
        
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })

        var Pricing = require("aws-sdk/clients/pricing");

        var pricing = new Pricing({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });

        var params = {
          Filters: [
            {
              Field: "location",
              Type: "TERM_MATCH",
              Value: locationDescription
            },
            {
              Field: "usagetype",
              Type: "TERM_MATCH",
              Value: "Lambda-GB-Second"
            }
          ],
          FormatVersion: "aws_v1",
          MaxResults: 1,
          ServiceCode: "AWSLambda"
        };
        pricing.getProducts(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else {
            var priceList = data["PriceList"];
            var priceOnDemand = priceList[0]["terms"]["OnDemand"];
            var priceDimensions = Object.values(priceOnDemand)[0][
              "priceDimensions"
            ];
            var pricePerUnit = Object.values(priceDimensions)[0][
              "pricePerUnit"
            ];
            var calculate = (1 / (1024 / memorySize)) * pricePerUnit["USD"];
            const aux = {
              type: service,
              memory: memorySize,
              location: locationDescription,
              price: calculate
            };
            window.localStorage.setItem(
              memorySize + "_" + locationDescription,
              JSON.stringify(aux)
            );
            resolve([service, calculate]);
          }
        });
      });
    },
    getRegionsEC2 () {
      var _this = this;
      return new Promise(function(resolve, reject) {
        

        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;

        AWS.config.update({ region: "us-east-1" });
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })

        var EC2 = require("aws-sdk/clients/ec2");
        var ec2 = new EC2({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });

        var params = {};
        ec2.describeRegions(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            var regions = [];
            var regionsArray = data['Regions'];
            for (var i in regionsArray) {
              regions.push(regionsArray[i]['RegionName'])
            };
            resolve(regions);
          }    
        });
      });

    },
    getRegionsRDS () {
      var _this = this;
      return new Promise(function(resolve, reject) {

        var token = JSON.parse(window.localStorage.getItem("session")).user.token;
        var logins = {};
        var login_id = 'cognito-idp.' + _this.$cognitoAuth.options.region + '.amazonaws.com/' + _this.$cognitoAuth.options.UserPoolId;
        logins[login_id] = token;

        AWS.config.update({ region: "us-east-1" });
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: _this.$cognitoAuth.options.IdentityPoolId,
          Logins: logins,
          LoginId: login_id
        })

        var RDS = require("aws-sdk/clients/rds");
        var rds = new RDS({
          region: "us-east-1",
          credentials: AWS.config.credentials
        });
        var params = {};
        rds.describeSourceRegions(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            var regions = [];
            var regionsArray = data['SourceRegions'];
            for (var i in regionsArray) {
              regions.push(regionsArray[i]['RegionName'])
            };
            resolve(regions);
          }    
        });
      });

    }
  },
  mounted() {
    var _this = this;
    this.lastFind = "";
    
    $.extend($.fn.dataTable.defaults, {
      responsive: true
    });
    this.myTable = $("#table-details").DataTable({
      data: _this.all_data_services,
      columns: [
        { title: "#" },
        { title: "Public IP" },
        { title: "Name" },
        { title: "Desired" },
        { title: "Min" },
        { title: "Max" },
        { title: "User" },
        { title: "Type" },
        { title: "State" },
        { title: "Code Size"},
        { title: "Memory Size"},
        { title: "Timestamp (UTC)" },
        { title: "Last Modified"},
        { title: "Private address"}
      ]
    });

    $("#accordion-dashboard").on("shown.bs.collapse", function() {
      $("#table-details")
        .DataTable()
        .columns.adjust();
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../sass/_variables.scss";
</style>
