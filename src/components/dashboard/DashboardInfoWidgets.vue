<template>
  <div class="row dashboard-info-widgets">
    <div class="col-md-6 col-xl-3">
      <vuestic-widget class="info-widget brand-danger">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">             
              <i class="fas fa-2x fa-desktop text-primary stats-icon icon-wide"></i>
             {{data.runInstances}}             
            </div>
            <div class="stats-title">RunInstances</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-3">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">             
              <i class="fas fa-database text-danger stats-icon icon-wide"></i>
              {{data.createDBInstance}}
            </div>
            <div class="stats-title">CreateDBInstance</div>
          </div>          
        </div>
      </vuestic-widget>
    </div>   
    <div class="col-md-6 col-xl-3">
      <vuestic-widget class="info-widget">   
        <div class="info-widget-inner">
          <div class="info-widget-inner">
            <div class="stats">
              <div class="stats-number">
              <i class="fas fa-clipboard stats-icon icon-wide" style="color: #004b89"></i>
           
               {{data.createFunction}}
              </div>
              <div class="stats-title">CreateFunction</div>
            </div>            
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-3">
      <vuestic-widget class="info-widget brand-info">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="fas fa-angle-double-up stats-icon icon-wide"></i>
              {{data.createLoadBalancer}}
            </div>
            <div class="stats-title">CreateLoadBalancer</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboard-info-widgets',
    data(){
      return{
        data:{
          total:0,
          runInstances:0,
          createDBInstance:0,
          createFunction:0,
          createLoadBalancer:0
        },
        dbper:0
      }
    },    

    mounted () {
     this.$eventHub.$on('generalInfo', function(data){                
            if(data){
                this.data[data.type] = data.value;
            };
           }.bind(this));
    },
    beforeDestroy() {
        this.$eventHub.$off('generalInfo');
        
    }, 
  }
</script>

<style lang="scss" scoped>
  @import "../../sass/_variables.scss";

  .stats-number, .stats-title {
    line-height: 1;
  }

  .info-widget-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;

    &.has-chart {
      justify-content: space-between;
    }

    .stats {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }

  .stats-number {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 2.625rem;
    margin-bottom: 0.5rem;

    .stats-icon {
      // font-size: 1.5625rem;
      font-size: 1.5rem;
      position: absolute;
      top: 0.625rem;
      left: -1.25rem;

      &.icon-wide {
        left: -1.875rem;
      }
    }
  }

</style>
