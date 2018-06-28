<template>
  <div class="auth-layout">
    <div class="nav d-lg-none"><h2>CloudTrail-Tracker</h2></div>
    <div class="main row">
      <div class="auth-content col-lg-6 col-12">
        <router-view></router-view>
      </div>
      <div class="auth-wallpaper col-6 d-none d-lg-flex" style="padding:0;">
        <img src="static/login/dashboard4.jpg" style="height: 100%;width: 100%;" alt="">
        <!-- <div class="oblique"></div>
        <router-link class="i-vuestic" :to="{path: '/'}"></router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthLayout'
  }
</script>

<style lang="scss">
  @import '../../sass/variables';
  @import '~bootstrap/scss/mixins/breakpoints';
  @import "~bootstrap/scss/functions";
  @import '~bootstrap/scss/variables';
  .auth-layout {
    height: 100vh;
    margin: 0;
    .nav {
      display: flex;
      align-items: center;
      justify-content: center;
      height: $top-mobile-nav-height;
      background-color: $top-nav-bg;
      // .i-vuestic {
      //   height: $auth-mobile-nav-ivuestic-h;
      //   width: 100%;
      // }
    }
    .main {
      margin: 0;
      height: 100%;
      .auth-content {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
      }
      .auth-wallpaper {
        // background-color: $top-nav-bg;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        // .i-vuestic {
        //   // z-index: 2;
        //   height: 100%;
        //   // height: $auth-wallpaper-ivuestic-h;
        //   width: 100%;
        // }
        // .oblique {
        //   position: absolute;
        //   background-color: $auth-wallpaper-oblique-line;
        //   left: calc(50% - 27%/2);
        //   transform: rotate(15deg);
        //   width: 27%;
        //   height: 115%;
        // }
      }
    }
    // Medium devices (tablets, 768px and up)
    @media (min-width: 576px) { 
      h2 {
        font-size: 24px;
        margin-top: 30px;
        color: #4ae387;
      } 
      }
    @media (min-width: 768px) { 
      h2 {
        font-size: 26px;
        margin-top: 30px;
        color: #4ae387;
      }  
      }

    // Large devices (desktops, 992px and up)
    @media (min-width: 992px) { 
      h2 {
        font-size: 28px;
        margin-top: 30px;
        color: #4ae387;
      }  
      }

      @media (max-width: 575.98px) { 
        h2 {
          font-size: 22px;
          margin-top: 30px;  
          color: #4ae387;    
        }
      }
    @include media-breakpoint-down(md) {
      .main {
        height: $auth-mobile-main-h;
        .auth-content {
          align-items: flex-start;
          padding-top: $auth-content-padding-t;
        }
      }
    }
  }
</style>
