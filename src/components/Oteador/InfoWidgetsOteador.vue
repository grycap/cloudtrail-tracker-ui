<template>
  <div class="row dashboard-info-widgets">
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget brand-danger">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">             
              <i class="fas fa-2x fa-desktop text-primary stats-icon icon-wide"></i>
             {{data.ec2}}
            </div>
            <div class="stats-title">EC2 instances running</div>
            <div class="stats-USD">{{prices.ec2}} USD/h</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">             
              <i class="fas fa-database text-danger stats-icon icon-wide"></i>
              {{data.rds}}
            </div>
            <div class="stats-title">RDS instances running</div>
            <div class="stats-USD">{{prices.rds}} USD/h</div>
          </div>          
        </div>
      </vuestic-widget>
    </div>   
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget brand-info2">   
        <div class="info-widget-inner">
          <div class="info-widget-inner">
            <div class="stats">
              <div class="stats-number">
              <i class="fas fa-angle-double-up stats-icon icon-wide" style="color: #004b89"></i>
               {{data.autoscaling}}
              </div>
              <div class="stats-title">Auto Scaling Groups</div>
              <!-- <div class="stats-USD2">{{prices.autoscaling}} USD/h</div> -->
              <div class="stats-USD2"></div>
            </div>            
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget brand-info">   
        <div class="info-widget-inner">
          <div class="info-widget-inner">
            <div class="stats">
              <div class="stats-number">
              <i class="fas fa-tasks stats-icon icon-wide" style="color: #004b89"></i>
               {{data.elb}}
              </div>
              <div class="stats-title">Elastic Load Balancers</div>
              <div class="stats-USD">{{prices.elb}} USD/h</div>
            </div>            
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="fas fa-share-alt stats-icon icon-wide"></i>
              {{data.elasticIP}}
            </div>
            <div class="stats-title">Unattached Elastic IPs</div>
            <div class="stats-USD2"></div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="col-md-6 col-xl-2">
      <vuestic-widget class="info-widget brand-info3">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="fas fa-folder stats-icon icon-wide"></i>
              {{data.lamb}}
            </div>
            <div class="stats-title">Lambda Functions</div>
            <div class="stats-USD">{{prices.lamb}} USD/h</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    
  </div>
  
</template>

<script>
  export default {
    name: 'info-widgets-oteador',
    data(){
      return{
        data:{
          ec2:0,
          rds:0,
          lamb:0,
          elasticIP:0,
          autoscaling:0,
          elb:0
        },
        prices:{
          ec2:0,
          rds:0,
          lamb:0,
          elasticIP:0,
          autoscaling:0,
          elb:0
        },
        dbper:0
      }
    },    

    mounted () {
      this.$eventHub.$on('generalServices', function(data){                
            if(data){
                this.data[data.type] = data.value;
            };
           }.bind(this));
      this.$eventHub.$on('generalPrice', function(prices){                
            if(prices){
                this.prices[prices.type] = prices.price;
            };
           }.bind(this));
    },
    beforeDestroy() {
        this.$eventHub.$off('generalServices');
        this.$eventHub.$off('generalPrice');
    }, 
  }
</script>

<style lang="scss" scoped>
  @import "../../sass/_variables.scss";

  .stats-number, .stats-title {
    line-height: 1;
  }

  /*.stats-title {
    margin-top:0.6rem;
  } */

  .stats-USD {
    line-height: 1;
    color: #0b1d14;
    margin-top: 0.9rem;

  }

  .stats-USD2 {
    line-height: 1;
    color: #0b1d14;
    margin-top: 1.6rem;
  }

  .info-widget {
    width: 115%;
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
      height: 100px;
    }
  }

  .stats-number {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 2.125rem;
    margin-bottom: 0.2rem;

    .stats-icon {
      // font-size: 1.5625rem;
      font-size: 1.3rem;
      position: absolute;
      top: 0.625rem;
      left: -1.25rem;

      &.icon-wide {
        left: -1.875rem;
      }
    }
  }

</style>
