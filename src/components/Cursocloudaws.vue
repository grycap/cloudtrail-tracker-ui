
<template>
  <div>
     <div class="row" style="margin-top:50px; min-height:70vh;margin-left:20px;margin-right:20px;">

     </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
    all_services:{},
    }
  },
  created(){
    var _this=this;
    axios.get("https://355vsl2h09.execute-api.us-east-1.amazonaws.com/dev/users/alucloud121?from=2018-02-01&to=2018-05-25")
          .then (function (resp) { 
          console.log(resp.data);   
          console.log(_this.all_services) 
          _this.all_services={};
          for (var i in resp.data){
            var event_data=resp.data[i].eventName;
            if (typeof _this.all_services[event_data]!='undefined') {
              _this.all_services[event_data]={event:resp.data[i].eventName,count:_this.all_services[event_data].count + 1}              
            }else{
              _this.all_services[event_data]={event:resp.data[i].eventName,count:1}              
            }
            
          }  
        
          console.log(_this.all_services);
                          
          });
  },
    
}
</script>

<style>

</style>

