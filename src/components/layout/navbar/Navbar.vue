<template>
	<nav class="navbar app-navbar navbar-toggleable-md">
		<div class="navbar-brand-container d-flex align-items-center justify-content-start">
			<div class="navbar-brand">
      <h2>CloudTrail-Tracker</h2>				
			</div>
		</div>

		<div class="row navbar-container">

			<div class="menu-icon-container d-flex align-items-center justify-content-lg-start col">
				<a class="menu-icon i-menu-expanded" href="#" @click.prevent="toggleSidebar(false)" v-if="sidebarOpened"></a>
				<a class="menu-icon i-menu-collapsed" href="#" @click.prevent="toggleSidebar(true)" v-else></a>
			</div>

			<div class="nav-item dropdown navbar-dropdown d-flex align-items-center" style="justify-content:flex-end;" v-dropdown > 
				<a class="nav-link dropdown-toggle d-flex align-items-center justify-content" href="#" 
				@click.prevent="closeMenu">
				<span class="avatar-container">
			
					<img v-bind:src="url" />
				</span>
				</a>
				<div class="dropdown-menu last">
					<div class="dropdown-menu-content">
						
						<div class="dropdown-item plain-link-item">						
							<router-link class="plain-link" to="/changepassword"><i class="fas fa-key" style="padding-right:5px;"></i>Change Password</router-link>           
						</div>
						<div class="dropdown-item plain-link-item">              
							<router-link class="plain-link"  to="/logout"><i class="fas fa-sign-out-alt" style="padding-right:5px;"></i>Log Out</router-link>             
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	import LanguageSelector from './LanguageSelector'

	export default {
		name: 'navbar',

		components: {
		LanguageSelector
		},

		data () {
		return {
			langs: [
			{
				code: 'gb',
				name: 'english'
			},
			{
				code: 'es',
				name: 'spanish'
			}
			],
      loggedIn:false,
      url : ""
		}
		},
		created(){
			this.$eventHub.$on('check-login', function(value){
				this.loggedIn=value;
      }.bind(this));
   
		},
		beforeDestroy() {
				this.$eventHub.$off('check-login');
			},

		computed: {
		...mapGetters([
			'sidebarOpened',
			'toggleWithoutAnimation'
		])
		},

		methods: {
		...mapActions([
			'closeMenu',
			'toggleSidebar',
			'isToggleWithoutAnimation'
    ]),
    
    },
    mounted (){
    var session = JSON.parse(localStorage.getItem("session"))
    // console.log(session.user.username)
    if (session.user.username == 'admin'){      
      this.url = 'static/avatar/admin.png'
    }else if (session.user.username == 'amcaar'){
     this.url = 'static/avatar/amanda.jpg'
    }
    else if (session.user.username == 'gmolto'){
     this.url = 'static/avatar/gmolto.jpg'
    }else 
    {
      this.url = 'static/avatar/students.jpeg'
    }
    }
	}
</script>

<style lang="scss">
  @import "../../../sass/_variables.scss";
  @import "~bootstrap/scss/mixins/breakpoints";
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";

@media (min-width: 576px) { 
  h2 {
    font-size: 24px;
    margin-top: 30px;
    color: #4ae387;
  } 
  }

// Medium devices (tablets, 768px and up)
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
  ////////////////////////////////////////////////////////////
  .navbar {
    .layout-fixed & {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1;
    }
  }

  .navbar.app-navbar {
    .navbar-container {
      width: 100%;
      height: 100%;
      margin: 0;
    }

    height: $top-nav-height;
    padding-left: $nav-padding-left;
    padding-right: $nav-padding-right;
    background-color: $top-nav-bg;

    .avatar-container {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-color: white;
      border-radius: 50%;
      border: 2px solid $lighter-gray;
      overflow: hidden;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .menu-icon-container {
      padding: 0;
      font-size: $font-size-base;
    }

    .navbar-brand-container {
      position: absolute;
      z-index: 3;
      height: 100%;
      left: $navbar-brand-container-left;
      top: 0;
    }

    .nav-item {
      padding: 0;
      height: 100%;
    }

    .dropdown.navbar-dropdown {
      .dropdown-toggle {
        padding: 0;
        &:after {
          display: none;
        }
      }

      &.show {
        @include media-breakpoint-up(lg) {
          .dropdown-menu {
            left: auto;
            right: 0;
          }
        }
        &:after {
          position: absolute;
          bottom: -$dropdown-show-b;
          right: calc(50% - 10px);
          width: 0;
          height: 0;
          display: block;
          content: '';
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid $darkest-gray;
        }
      }

      .dropdown-menu {
        margin-top: $dropdown-show-b;
        padding-top: 0;
        width: 100%;
      }

      .dropdown-item {
        height: $navbar-dd-item-height;
        cursor: pointer;
        font-size: $font-size-base;

        &:hover, &:active, &:focus, &.active {
          outline: none;
        }

        &.plain-link-item {
          color: $brand-primary;

          &:hover, &:active, &:focus {
            background: $dropdown-background;
          }

          .plain-link {
            text-decoration: none;
          }
        }
      }
    }

    .notify {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: -6px;
        background-color: $brand-primary;
        height: 12px;
        width: 12px;
        border-radius: 50%;
      }
    }

    .i-nav-notification.notify::after {
      right: -4px;
      top: 0;
    }

    @include media-breakpoint-down(md) {
      height: $top-mobile-nav-height;
      padding: $nav-mobile-pt $nav-mobile-padding-h $nav-mobile-pb $nav-mobile-padding-h;

      .navbar-brand-container {
        width: $nav-mobile-brand-width;
        top: $nav-mobile-brand-top;
        left: calc(50% - 5.5rem);
        height: auto;
        .navbar-brand {
          height: $font-size-smaller;
          padding: 0;
          font-size: $font-size-smaller;
        }
      }

      .dropdown.navbar-dropdown {
        &.show {
          display: flex;
          &:after {
            bottom: -$dropdown-mobile-show-b;
            z-index: 2;
          }
          .dropdown-menu {
            margin-top: $dropdown-mobile-show-b;
            left: auto;
            &.last {
              right: 0;
            }
          }
        }
      }
    }
  }
</style>
