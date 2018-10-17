<template>
  <div id="app" class="app">
    <layout v-if="loggedIn"></layout>
    <auth-layout v-else></auth-layout>
  </div>
</template>

<script>
	import Layout from 'components/layout/Layout'
	import AuthLayout from 'components/layout/AuthLayout'
	import VuesticPreLoader from 'vuestic-components/vuestic-preloader/VuesticPreLoader.vue'
  import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';
 	 export default {
    name: 'app',
    components: {
		VuesticPreLoader,
		AuthLayout,
    Layout,
    ChartJsPluginDataLabels,
    },
    computed: {
      isAuth () {
        return this.loggedIn
      }
    }, 
    data(){
		return {
      		loggedIn: false
    	}
	},
	created() {
		this.$cognitoAuth.isAuthenticated((err, loggedIn) => { 
			if (err) {
				console.err("App: Couldn't get the session:", err, err.stack);
				return;
			} 
			this.loggedIn = loggedIn;
			this.$eventHub.$emit('check-login',this.loggedIn);
		});
		this.$cognitoAuth.onChange = loggedIn => {
        this.loggedIn = loggedIn;        
		this.$eventHub.$emit('check-login',this.loggedIn);	
		};			
	},
	mounted() {
		if (typeof localStorage.getItem("session") != "undefined") {
			var session = JSON.parse(localStorage.getItem("session"));
			if (session != null && typeof session.user != "undefined") {
        this.loggedIn = true;
				//console.log(session.user.username);
				// $(".users-dropdown").text(session.user.username);
			}
		}
	}
}   
  
</script>

<style lang="scss">
  @import "sass/main";

  body {
    height: 100%;
    #app {
      height: 100%;
    }
  }
  .v-select input[type=search], .v-select input[type=search]{
    width: 5rem!important;
  }
  .v-select li > a {
    display: block;
    padding: 3px 20px;
    clear: both;
    color: #333!important; /* Overrides most CSS frameworks */
    white-space: nowrap;
  }
  .v-select li:hover {
    cursor: pointer;
  }
  .v-select .dropdown-menu .active > a {
    color: #333;
    background: rgba(50, 50, 50, .1);
  }
  .v-select .dropdown-menu > .highlight > a {
    /*
     * required to override bootstrap 3's
     * .dropdown-menu > li > a:hover {} styles
     */
    background: #4ae387;
    color: #fff!important;
  }
  .v-select .highlight:not(:last-child) {
    margin-bottom: 0; /* Fixes Bulma Margin */
  }
  

      /* Responsive: Portrait tablets and up */
    @media (max-width: 576px) {
      h3{
        font-size: 18px;
      }
      // h2{
      //   font-size: 24px;
      //   color: #4ae387;
        
      // }
      h6{
        font-size: 12px;
      }
    }

    /*Small devices (landscape phones, 576px and up)*/

    @media (min-width: 576px) {
     h3{
        font-size: 20px;
      }
      // h2{
      //   font-size: 32px;
      //   color: #4ae387;
      // }
      
    }

    @media (min-width: 768px) {
      h3{
        font-size: 24px;
      }
    }

    /* Medium devices (desktops, 992px and up) */

    @media (min-width: 992px) {
      h3{
        font-size: 24px;
      }
    }

    /* Large devices (large desktops, 1200px and up) */

    @media (min-width: 1200px) {
     h3{
        font-size: 26px;
      }
    }
</style>