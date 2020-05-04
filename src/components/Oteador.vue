<template>
  <div class="oteador">

    <vuestic-widget class="no-padding no-v-padding">
      <div class="row" style="padding-top:40px; padding-bottom:40px;">
        <div class="col-12 col-md-5 col-lg-4" style="margin-top:10px;">
          <v-select
            v-model="service_name"
            id="selectc"
            ref="select"
            label="first_service"
            :options="all_services"
            placeholder="Servicios"
            v-bind:class="{'is-invalid' : errors.username}"
          ></v-select>
          <span v-show="errors.username" style="color: #cc3300; font-size: 12px;">
            <b>Please, select a service.</b>
          </span>
        </div>

        <div class="col-12 col-md-5 col-lg-4" style="margin-top:10px;">
          <v-select
            v-model="region_name"
            id="selectc2"
            ref="select2"
            label="first_service"
            :options="all_regions"
            placeholder="Regions"
            v-bind:class="{'is-invalid' : errors.username}"
          ></v-select>
          <span v-show="errors.username" style="color: #cc3300; font-size: 12px;">
            <b>Please, select a service.</b>
          </span>
        </div>

        <div class="col-12 col-md-3 col-lg-4">
          <button
            class="btn btn-primary"
            id="searchButton"
            @click="search()"
            :disabled="processing == true"
            style="padding: 0.8rem 1.0rem!important;letter-spacing: normal;"
          >
            <i v-if="processing" class="fas fa-spinner fa-pulse"></i>
            <i v-if="!processing" class="fas fa-search d-lg-none"></i>
            <span v-if="!processing" class="d-none d-lg-block">Search</span>
          </button>
        </div>
      </div>
      <div v-if="no_result" class="col-12 text-center">
        <h3>{{service_search}} has not used.</h3>
      </div>

      <div v-show="graphData.length > 0" class style="margin-top:20px;">
          <h3 id="numberOf">Number of states in {{service_search}}</h3>
      
        <div style="position: relative; height:50vh;" id="canva">
          <canvas id="myChartOteador"></canvas>
        </div>
      </div>

      <div v-show="graphData.length > 0" class="row" style="margin-bottom:40px;">
        <div id="accordion-search" class="col-md-12">
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
                  id=detailsButton
                >Details</button>
              </h5>
            </div>

            <div
              id="collapseOne"
              class="collapse"
              aria-labelledby="headingOne"
              data-parent="#accordion-search"
            >
              <div class="card-body col-12">
                <table id="table-details" class="stripe" style="width:100%"></table>
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
import api from "../api.js";


export default {
  name: "oteador",
  components: {
    "v-select": vSelect
  },
  data() {
    return {
      token: "Loading token..",
      user: {},
      options: [],
      dis: true,
      all_services: [],
      all_regions: [],
      all_data: [],
      max: 0,
      service_name: "",
      region_name: "",
      service_search: "",
      myLoop: "",
      all_states: [],
      start_date: "",
      end_date: "",
      graphData: [],
      show_dates: true,
      no_result: false,
      processing: false,
      table: "",
      datepicker: {
        range: ""
      }
    };
  },
  methods: {
    search_callback(resp) {
      this.all_data = [];
      this.service_search = this.service_name;
      console.log(resp);

      var response = resp.data.body.response;
      for (var i in response) {
        switch (this.service_name) {
          case this.all_services[0]:
            this.all_data.push([i, response[i], "-", "-", "-"]);

            var start = false;
            for (var j in this.graphData) {
              if (this.graphData[j][0] == "Buckets") {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
              }
              start = true;
            }
            if (start == false) this.graphData.push(["Buckets", 1]);
            $("#numberOf").text("Number of Buckets");

            break;
          case this.all_services[1]:
            var time = moment(
              response[i]["Launch time"],
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("HH:mm:ss DD-MM-YYYY");
            this.all_data.push([
              i,
              response[i]["Id:"],
              response[i]["Owner"],
              response[i]["State"],
              time
            ]);

            var found = false;
            for (var j in this.graphData) {
              if (this.graphData[j][0] == response[i]["State"]) {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
                var found = true;
              }
            }
            if (found == false) this.graphData.push([response[i]["State"], 1]);

            $("#numberOf").text("Number of states in " + this.service_search);

            break;
          case this.all_services[2]:
            var time = moment(
              response[i]["Intance Create Time"],
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("HH:mm:ss DD-MM-YYYY");
            this.all_data.push([
              i,
              response[i]["DBInstanceIdentifierId:"],
              "-",
              response[i]["DBInstanceStatus"],
              time
            ]);

            var found = false;
            for (var j in this.graphData) {
              if (this.graphData[j][0] == response[i]["DBInstanceStatus"]) {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
                var found = true;
              }
            }
            if (found == false)
              this.graphData.push([response[i]["DBInstanceStatus"], 1]);
              
            $("#numberOf").text("Number of states in " + this.service_search);

            break;
          case this.all_services[3]:
            var time = moment(
              response[i]["CreatedTime"],
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("HH:mm:ss DD-MM-YYYY");
            this.all_data.push([
              i,response[i]["LoadBalancerName:"],"-",response[i]["State"],time
            ])
          var found = false;
          
            for (var j in this.graphData) {
              if (this.graphData[j][0] == response[i]["State"]) {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
                var found = true;
              }
            }
            if (found == false)
              this.graphData.push([response[i]["State"], 1]);

            $("#numberOf").text("Number of states in " + this.service_search);

            break;
          case this.all_services[4]:
            var time = moment(
              response[i]["CreatedTime"],
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("HH:mm:ss DD-MM-YYYY");
            this.all_data.push([i, response[i]["AutoScalingGroupName"], "-", "-", time]);

            var start = false;
            for (var j in this.graphData) {
              if (this.graphData[j][0] == "Auto Scalling Groups") {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
              }
              start = true;
            }
            if (start == false) this.graphData.push(["Auto Scalling Groups", 1]);
            $("#numberOf").text("Number of Auto Scalling Groups");
            break;
          case this.all_services[5]:
            this.all_data.push([i, response[i]["PublicIp"], "-", "-", "-"]);
            
            var start = false;
            for (var j in this.graphData) {
              if (this.graphData[j][0] == "Elastic IPs") {
                var count = this.graphData[j][1];
                this.graphData[j][1] = count + 1;
              }
              start = true;
            }
            if (start == false) this.graphData.push(["Elastic IPs", 1]);
            $("#numberOf").text("Number of Elastic IPs");


            break;          

          default:
        }
        
      }

      if (this.graphData.length > 0) {
        this.no_result = false;

        this.drawGraph();
        var _this = this;
        this.$nextTick(function() {
          $("#table-details")
            .dataTable()
            .fnClearTable();
          if (_this.all_data.length != 0) {
            $("#table-details")
              .dataTable()
              .fnAddData(_this.all_data);
          }
          $("#table-details")
            .dataTable()
            .fnDraw();
        });
      } else {
        this.no_result = true;
      }
      this.processing = false;
    },
    search() {
      this.graphData = [];
      if (this.service_name != "") {
        this.errors.username = false;
        this.processing = true;
        var _this = this;
        var generalInfo = {};

        var specificUrl = "";
        console.log(this.service_name);
        switch (this.service_name) {
          case this.all_services[0]:
            specificUrl = "services/AllBuckets/region/" + this.region_name;
            break;
          case this.all_services[1]:
            specificUrl = "services/AllInstancesEC2/region/" + this.region_name;
            break;
          case this.all_services[2]:
            specificUrl = "services/AllInstancesRDS/region/" + this.region_name;
            break;
          case this.all_services[3]:
            specificUrl = "services/ElasticLoadBalancing/region/" + this.region_name;
            break;
          case this.all_services[4]:
            specificUrl = "services/AutoScallingGroups/region/" + this.region_name;
            break;
          case this.all_services[5]:
            specificUrl = "services/ElasticIP/region/" + this.region_name;
            break;
          default:
        }
        axios.get(api.url.oteador + specificUrl)
          .then(function(resp) {
            _this.search_callback(resp);
          })
          .catch(function(error) {
            console.log(error);
            if (error.response.status == 401) {
              _this.$router.replace(_this.$route.query.redirect || "/logout");
              alert("Your Session has expired");
            }
          });
      } else {
        this.errors.username = true;
      }
      if (this.myLoop == "") {
        this.myLoop = setInterval(function(){
          document.getElementById("searchButton").click();
        }, 12000);
      }
    },
    drawGraph() {
      //finding max value of array
      this.max = 0;
      for (var i in this.graphData) {
        if (this.max < this.graphData[i][1]) {
          this.max = this.graphData[i][1];
        }
      }

      $("#canva").append('<canvas id="myChartOteador"></canvas>');
      

      var ctx = $("#myChartOteador");
      var myChartOteador = new Chart(ctx, {
        type: "bar",
        id: "barChartOteador",
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
    }
  },
  created() {
    var dmy = new Date();
    var currDay = dmy.getDay();
    var currMonth = dmy.getMonth();
    var currYear = dmy.getFullYear();
    var currYearEnd = dmy.getFullYear() + 1;

    if (currMonth == 8) {
      var start = new Date(currYear, 8, 1);
      var end = new Date(currYearEnd, 6, 31);
    } else {
      var start = new Date(currYear - 1, 8, 1);
      var end = new Date(currYearEnd - 1, 6, 31);
    }

    this.start_date = moment(start).format("YYYY-MM-DD");
    this.end_date = moment(end).format("YYYY-MM-DD");

    var _this = this;
    _this.all_services.push("Buckets");
    _this.all_services.push("Instances of EC2");
    _this.all_services.push("Instances of RDS");
    _this.all_services.push("Elastic load balancers");
    _this.all_services.push("Auto Scalling Groups");
    _this.all_services.push("Elastic IP (not connected)");

    _this.all_regions.push("us-east-1");
    _this.all_regions.push("us-east-2");
    _this.all_regions.push("us-east-1");
    

    //var session = JSON.parse(localStorage.getItem("session"));
  },
  mounted() {
    var d = new Date();
    var currDay = d.getDay();
    var currMonth = d.getMonth();
    var currYear = d.getFullYear();
    var currYearEnd = d.getFullYear() + 1;
    if (currMonth == 8) {
      var startDateDefault = new Date(currYear, 8, 1);
      var endDateDefault = new Date(currYearEnd, 6, 31);
    } else {
      var startDateDefault = new Date(currYear - 1, 8, 1);
      var endDateDefault = new Date(currYearEnd - 1, 6, 31);
    }
    var startdate = moment(startDateDefault).format("DD/MM/YYYY");
    var enddate = moment(endDateDefault).format("DD/MM/YYYY");

    var _this = this;
    var maxDate = moment().format("DD/MM/YYYY");
    $("#date-range").daterangepicker(
      {
        opens: "left",
        startDate: startdate,
        endDate: enddate,
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

    $.extend($.fn.dataTable.defaults, {
      responsive: true
    });
    $("#table-details").DataTable({
      data: _this.all_data,
      columns: [
        { title: "#" },
        { title: "Id" },
        { title: "Owner" },
        { title: "State" },
        { title: "Date and Time" }
      ],
      columnDefs: [{ className: "dt-center", targets: "_all" }]
    });
    $("#accordion-search").on("shown.bs.collapse", function() {
      $("#table-details")
        .DataTable()
        .columns.adjust();
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../sass/_variables.scss";
</style>
