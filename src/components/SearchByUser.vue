<template>
<div>
    <div class="row" style="margin-top:50px; min-height:70vh;margin-left:20px;margin-right:20px;">
      <div class="col-12 col-lg-10 offset-lg-1">
        <!-- <h2>Dashboard</h2>
        <p>Yay you made {{ user.username }} it!</p>
        <blockquote>{{ token }}</blockquote>  -->
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
             <!-- <button class="btn btn-primary" @click="graficar()">Graficar</button> -->
          </div>
        </div>      
      </div>
      <div v-if="no_result" class="col-12 text-center">
        <h3>{{user_search}} haven't used any service.</h3>
      </div>
      <!-- <div v-show="graphData.length > 0" class="col-12 text-center" style="margin-top:20px;">
        <div class="chart" id="chart_div"></div>
      </div> -->
      <div v-show="graphData.length > 0" class="col-12 col-md-10 offset-md-1"  style="margin-top:20px;" id="canva">
        <!-- <label class="text text-left" for="">Services used by '+this.user_name</label> -->
        <h3>Services used by {{user_search}}</h3>
        <canvas id="myChart" style="height:10vh; width:20vw"></canvas>
      </div>
    </div>
    <div v-show="graphData.length > 0" class="row" style="margin-bottom:40px;">
      <div id="accordion" class="col-md-10 offset-md-1">
        <div >
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
      <!-- <div class="col-10 offset-1">
        <table id="table-details" class="stripe" style="width:100%">
        </table>
      </div>             -->
    </div>
</div>    
</template>

<script>
import jwtDecode from 'jwt-decode'
import vSelect from 'vue-select'

export default {
  components:{
    'v-select': vSelect,
  },
  data () {
    return {
      token: 'Loading token..',
      user: {},
      options: [],
      all_users:[],
      all_data:[],  
      max:0,   
      user_name:'',
      user_search:'',
      all_services:[],
      start_date:'',
      end_date:'',
      graphData:[],
      show_dates: false,
      no_result: false,
      errors:{
        username: false
      },
      processing: false,
      table:''
    }
  },
  watch:{
    '$route'(val){
        for(let i in this.itemNavs){
            this.itemNavs[i].selected = (val.fullPath == this.itemNavs[i].path);
        }
    }
  },
  created () {
    this.$cognitoAuth.getIdToken((err, jwtToken) => {
      if (err) {
        console.log("Dashboard: Couldn't get the session:", err, err.stack)
        return
      }
      this.token = jwtDecode(jwtToken)
      this.user = this.$cognitoAuth.getCurrentUser()
      document.getElementsByName('token')['0'].content = jwtToken
      //console.log(jwtToken)
    })
    var _this = this; 
    axios.get(' https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users')
      .then (function (resp) {   
        // console.log(resp.data);              
        _this.all_users = resp.data;
        // _this.all_users.splice(0,0, 'General');        
      }); 
     axios.get(' https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/services')
      .then (function (resp) {   
        for(var i in resp.data){
          _this.all_services[resp.data[i]]={
            name:resp.data[i],
            count:0,
             
          }
          
        }   
      });            
  },
  
  methods: {
    search_callback(resp) {
      this.all_data=[];
      this.user_search=this.user_name;
      for (var i in resp.data){
        // console.log(this.all_data[i],resp.data[i]);
        var datatime=resp.data[i].eventTime;       
        var time1= datatime.replace('Z',' ');
        var time=time1.split('T');                  
        this.all_data.push([i, resp.data[i].eventName,time[0]+' '+time[1]])           
      }  
     
      for(var i in this.all_services){ 
          this.all_services[i].count=0;       
                           
        }   
        console.log(this.all_services);
      for (var i in resp.data){
        var data2=resp.data[i].eventSource;
       
        var service=data2.split('.');           
        this.all_services[service[0]].count=this.all_services[service[0]].count + 1;
        
      }   

      for(var i in this.all_services){
        if(this.all_services[i].count >0){
          this.graphData.push([this.all_services[i].name, this.all_services[i].count]);
        }
      }
      console.log(this.graphData.length);
      if(this.graphData.length >0){
        this.no_result = false;
        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(this.drawGraph);
        
        var _this = this;
        this.$nextTick(function(){
          $('#table-details').dataTable().fnClearTable();
          $('#table-details').dataTable().fnAddData(_this.all_data);
          $('#table-details').dataTable().fnDraw();
          // $('#table-details').dataTable().fn
        });
        
      }else{
        this.no_result = true;
      }
      this.processing = false;      
    },
    search(){       
      this.graphData=[];
      
      console.log(this.graphData);
      if(this.user_name != ''){
        this.errors.username = false;
        this.processing = true;
        var _this = this;       
        if(!this.show_dates){
          axios.get(' https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users/' + this.user_name)
          .then (function (resp) {          
              _this.search_callback(resp);             
          });
        }else{
          axios.get(' https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users/' + this.user_name + '?from=' + this.start_date + '&to=' + this.end_date)
          .then (function (resp) {          
              _this.search_callback(resp); 
                          
          });
        }
      }else{
        this.errors.username = true;
      }
      
       
    },
    drawGraph(){
      // var data = new google.visualization.DataTable();
      // // data.addColumn('date', 'Service Date');
      // data.addColumn('string', 'Services');
      // data.addColumn('number', 'Uses of the service');

      // data.addRows(this.graphData);

      // var view = new google.visualization.DataView(data);
      // view.setColumns([0, 1,
      //                  { calc: "stringify",
      //                    sourceColumn: 1,
      //                    type: "string",
      //                    role: "annotation" },
      //                  ]);

      // var options = {
      //   title: 'Services used by '+this.user_name,
      //   hAxis: {
      //     title: 'Services',
      //   },
      //   vAxis: {
      //     title: '# times'
      //   },
      //   legend: { position: "none" },
      //   height: 400,
      //   bar: {groupWidth: "40"},
      // };
      

      // var chart = new google.visualization.ColumnChart(
      //   document.getElementById('chart_div'));
      
      //   // chart.clearChart();     
      //   chart.draw(view, options);    

    //////testing chart.js 
    console.log(this.graphData)  
    ///finding max value of arreglo
    this.max=0;
    for (var i in this.graphData){
      if(this.max < this.graphData[i][1]){
        this.max=this.graphData[i][1];
      }
    }
    console.log(this.max);
    // myChart.destroy();
    // if (window.myChart != undefined || window.myChart !=null) {
    //   // myChart.clear();
    //     window.myChart.destroy();
    //   };
    $('#myChart').remove();
    $('#canva').append('<canvas id="myChart" style="height:10vh; width:20vw"></canvas>');
    var ctx=$('#myChart');
    var myChart=new Chart(ctx, {
      type:'bar',
      data:{
        labels:this.graphData.map((graphData)=> graphData[0]),
        datasets:[{
          label:'Services',
          backgroundColor: 'rgba(128,164,237, 0.8)',
          borderColor: 'rgba(5,71,212,1)',
          borderWidth: 4,
          hoverBackgroundColor: "rgba(72,126,240,1)",
          hoverBorderColor: "rgba(212,52,5,1)",
          // datalabels: {
					// 	align: 'end',
          //   anchor: 'top',
          //   offset:4,
            
					// },
          data:this.graphData.map((graphData) => graphData[1])}],
      },
      options: {     
        animation:{
          duration:0
        },
        responsive: true,
        maintainAspectRatio:true,  
        maxBarThickness:10,        
        legend:{
          display:false,
        },
        plugins: {
                  datalabels: {
                    // align: function(context) {
                    //   var index = context.dataIndex;
                    //   var value = context.dataset.data[index];
                    //   var invert = Math.abs(value) <= 1;
                    //   var max = Math.max(value);
                    //   console.log(index);
                    //   return max = value ? 'start' : 'end'
                    //   // return value <= 1 ? 'top' : 'start'
                    // },
                    align:'end',
                    anchor: 'top',
                    backgroundColor: null,
                    borderColor: null,
                    borderRadius: 4,
                    borderWidth: 1,
                    color: '#000',
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    offset: 4,
                    padding: 0,
                    formatter: Math.round
                    // formatter: function(value) {
                    //   return Math.round(value * 10) / 10
                    // }
                  },
                    
                },

        title:{
          display:false,  
          fontSize:20,
          fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          fontColor:'#000',
          fontStyle:'normal',
          text: 'Services used by '+this.user_name,
          
        },
        tooltips:{
          position:'nearest',
          titleFontSize:18,
          bodyFontSize:18
        },
        scales: {
            yAxes: [{
                display:true,
                scaleLabel:{
                  display:true,
                  labelString:'# times',
                  fontColor:'#000',
                  fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                  fontSize:18,                  

                },
                callback: function (value) { if (Number.isInteger(value)) { return value; } },
                 gridLines: {
                      display: true,
                      color: "rgba(220,227,241,1)"
                    },
                ticks: {
                    beginAtZero:true,
                    fontSize:16,
                    fontColor:'#000',
                    min: 0,
                    stepSize: Math.ceil(this.max/2),
                    max: this.max + Math.ceil(this.max/2),              
                    
                    // max:function (graphData) {
                    //   for (var i in graphData) {
                    //     if ()
                        
                    //   }
                    // }
                },
                
            }],
            xAxes: [{
              display:true,
              gridLines:{display:false},
              scaleLabel:{
                display:true,
                labelString:'Services',
                fontColor:'#000',
                fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                fontSize:18,
                
              },
              ticks: {
                autoSkip: false,
                fontSize:16,
                fontColor:'#000',
               
              },
              // maxBarThickness:50,
              barThickness:50,
              // barPercentage: 0.4,
            }],
            hover:{
              intersect:false,
            }
        },
        
    }
    })
       
    },
  },
  mounted(){
    var _this = this;
    var maxDate = moment().format('DD/MM/YYYY');
    $('#date-range').daterangepicker({
      opens: 'left',
      maxDate: maxDate,
      locale: {
      format: 'DD/MM/YYYY'
       }
      // autoApply: true
    }, function(start, end, label) {
      _this.start_date = start.format('YYYY-MM-DD');
      _this.end_date = end.format('YYYY-MM-DD');
    });
    $('#enable-date').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    });

    $('#enable-date').on('ifClicked', function(event){
      if(_this.show_dates){
        _this.show_dates = false;
      }else{
        _this.show_dates = true;
      }
    });
    // $(window).resize(function(){
    //   _this.drawGraph();
    // });
    // this.table = $('#table-details').DataTable( {
    //         "pagingType": "full_numbers",
    //       });

    
          // if (this.table != " ") {
          //   this.table.destroy();            
          // }
          // console.log(_this.all_data);
          
          $('#table-details').DataTable( {
            data: _this.all_data,
            columns: [
                { title: "#" },
                { title: "Event" },
                { title: "Timestamp" },
            ]
        } );
  }
}

</script>
<style>
.chart {
    width: 100%;
    min-height: 450px;
}
</style>

