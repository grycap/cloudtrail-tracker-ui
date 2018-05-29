<template>

    <div id="app">
    <!-- <div class="header clearfix" style="border-bottom:none;padding:0px;margin-bottom:0px;"> -->
      <nav class="navbar navbar-expand-lg navbar-light " style="background: linear-gradient(to right bottom, rgb(200, 198, 210), rgb(255, 253, 253));">
        <a class="navbar-brand" href="/">
          <img alt="logo" src="static/logo_1.png" height="38px" class="brand-logo account-picture-url" style="vertical-align: middle;">
          <h5 class="brand-text text-blue topbar-link" style="font-weight: 800;display:inline;">CloudTrail-Tracker</h5>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto" >
            <li class="nav-item active">
              <router-link class="nav-link topbar-link" to="/" href="#"><a style="padding:15px;"><i class="fas fa-home" style="padding-right:5px;"></i>Home</a></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link topbar-link" v-if="!loggedIn" to="/login"><a style="padding:15px;"><i class="fas fa-sign-in-alt" style="padding-right:5px;"></i>Log in</a></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link topbar-link" v-if="!loggedIn" to="/signup"><a style="padding:15px;"><i class="fas fa-user fa-sm" style="padding-right:5px;"></i>Sign Up</a></router-link>
            </li>
           
            <li class="nav-item">
              <router-link class="nav-link topbar-link" v-if="loggedIn" to="/dashboard"><a style="padding:15px;"><i class="fas fa-cloud" style="padding-right:5px;"></i>Dashboard</a></router-link>
            </li>
            
           
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle topbar-link" v-show="loggedIn" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <span class="users-dropdown"></span>
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <router-link  v-if="loggedIn" to="/search_by_user"><a class="dropdown-item"><i class="fas fa-users" style="padding-right:5px;"></i>Search by User</a></router-link>
                <router-link  v-if="loggedIn" to="/curso_cloud_aws"><a class="dropdown-item"><i class="fas fa-graduation-cap" style="padding-right:5px;"></i>Curso Cloud AWS</a></router-link>
                <router-link  v-if="loggedIn" to="/change_password"><a class="dropdown-item"><i class="fas fa-key" style="padding-right:5px;"></i>Change Password</a></router-link>
                <router-link  v-if="loggedIn" to="/logout"><a class="dropdown-item"><i class="fas fa-sign-out-alt" style="padding-right:5px;"></i>Log out</a></router-link>
                     
              </div>
            </li>
          </ul>
        </div>
      </nav>  
      
    <!-- </div> -->

    <!-- <div>
      <template> -->
        <router-view :loggedIn="loggedIn"></router-view>
      <!-- </template>
    </div> -->
     <footer id="_footer" style="padding:25px;background: linear-gradient(to right bottom, rgb(200, 198, 210), rgb(255, 253, 253));">
      <div class="row">
      
        <div class="col-md-12 hidden-xs hidden-sm">
          <div class="row">
            <div class="col-12 col-md-6" style="text-align: center">
              <li class="footer-list">
                  <ul style="text-align: left;margin:0;">
                      <div class="row">
                        <div>
                          <p style="margin:0;font-weight: 700;font-size:13px;"><i class="fas fa-map-marker"></i> Camino de Vera Road, Building 8B, Door N, 1st Floor.
                          Valencia City, Valencia 46022, Spain.</p>  
                        </div>
                      </div>
                  </ul>
              </li>
            </div>
            <div class="col-12 col-md-6" style="text-align: center">
              <li class="footer-list">
                  <ul style="text-align: left;margin:0;">
                    <div class="row">
                      <a href="/#" style="font-weight: 700;font-size:13px;"><i class="fas fa-phone"></i> Tel:(+34)963877007 Ext. 88254</a>
                    </div>
                  </ul>
                  <!-- <ul style="text-align: left;margin:0;">
                      <a href="/#" style="font-weight: 700;"><i class="fas fa-at"></i> Email:</a>
                  </ul> -->
                  <ul style="text-align: left;margin:0;">
                      <!-- <a href="#" style="margin:0;font-weight: 700;"><i class="fas fa-envelope"></i> Connect with Us</a> -->
                      <div class="row">
                      <a href="https://github.com/grycap/cloudtrail-tracker" style="margin:0;font-weight: 700;font-size:13px;">Connect with us on <i class="fab fa-github fa-lg"></i></a>
                  </div>
                  </ul>
                  <!-- <ul style="text-align: left;margin:0;">
                      <a href="#" style= "margin:0;font-weight: 700"><i class="fab fa-github"></i></a>
                  </ul> -->
              </li>
            </div>
          </div>
        </div>
      </div>
      <hr style="border-top: 1px solid #3e3d3d; margin-top: 20px">
      <div class="text-center" style="margin-top: 20px">
          <div style="color: #000; font-size: 12px"><span >&copy;</span><span>2018 - Company, Inc. </span></div>
      </div>
    </footer>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false
    };
  },
  created() {
    this.$cognitoAuth.isAuthenticated((err, loggedIn) => {
      if (err) {
        console.err("App: Couldn't get the session:", err, err.stack);
        return;
      }
      this.loggedIn = loggedIn;
    });
    this.$cognitoAuth.onChange = loggedIn => {
      this.loggedIn = loggedIn;
    };
  },
  mounted() {
    if (typeof localStorage.getItem("session") != "undefined") {
      var session = JSON.parse(localStorage.getItem("session"));
      if (typeof session.user != "undefined") {
        console.log(session.user.username);
        $(".users-dropdown").text(session.user.username);
      }
    }
  }
};
</script>

<style>
/* Space out content a bit */
body {
  margin: 0;
  padding: 0;
}

/* Customize container */
@media (min-width: 768px) {
  .container {
    max-width: 730px;
  }
}

/* Responsive: Portrait tablets and up */
@media (max-width: 576px) {
  h3 {
    font-size: 15px;
  }
  .header {
    height: 400px;
  }
  .text-header-wrapper {
    /*margin: 50px auto auto auto;*/
    font-size: 25px;
    color: #000152;
  }
  .sub-text {
    /*margin: 50px auto auto auto;*/
    font-size: 20px;
    color: #000152;
  }
}

/*Small devices (landscape phones, 576px and up)*/

@media (min-width: 576px) {
  h3 {
    font-size: 20px;
  }
  .header {
    height: 400px;
  }
  .text-header-wrapper {
    /*margin: 80px auto auto auto;*/
    font-size: 40px;
    color: #000152;
  }
  .sub-text {
    /*margin: 50px auto auto auto;*/
    font-size: 25px;
    color: #000152;
  }
}

@media (min-width: 768px) {
  h3 {
    font-size: 25px;
  }
  .text-header-wrapper {
    /*margin: 80px auto auto auto;*/
    font-size: 40px;
    color: #000152;
  }
  .header {
    height: 450px;
  }
  .sub-text {
    /*margin: 50px auto auto auto;*/
    font-size: 25px;
    color: #000152;
  }
}

/* Medium devices (desktops, 992px and up) */

@media (min-width: 992px) {
  h3 {
    font-size: 25px;
  }
  .text-header-wrapper {
    /*margin: 110px auto auto auto;*/
    font-size: 50px;
    color: #000152;
  }
  .sub-text {
    /*margin: 50px auto auto auto;*/
    font-size: 25px;
    color: #000152;
  }
}

/* Large devices (large desktops, 1200px and up) */

@media (min-width: 1200px) {
  .text-header-wrapper {
    /*margin: 120px auto auto auto;*/
    font-size: 55px;
    color: #000152;
    font-family: Arial;
  }
  .sub-text {
    /*margin: 50px auto auto auto;*/
    font-size: 30px;
    color: #000152;
  }
}

/********************************************************/

.custom-button {
  background-color: rgba(0, 122, 247, 0.95);
  border: 1px solid rgba(0, 122, 247, 0.95);
}

.btn-primary.focus,
.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 122, 247, 0.95);
}
.custom-box-shadow {
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 30px 20px 20px;
}
label {
  color: #6c757d;
}

.footer-list {
  list-style-type: none;
}

.footer-list a {
  color: #000;
}

.fixed_main_bar_orange {
  top: 0;
  width: 100%;
  max-height: 50px;
  position: fixed;
  z-index: 700;
  /* background-color: #eb770e; */
  border-radius: 0px;
  transition: top 0.1s;
}
</style>
