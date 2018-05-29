<template>
  <div  style="height:75vh;">
    <div class="" style="margin-top:50px;">
      <div class="col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4 custom-box-shadow">
        <h3 class="text-center text"><span class="custom-title">Login</span></h3>
        <div v-if="error" class="alert alert-danger">
            {{error_message_text}}
        </div>
        <form @submit.prevent="login">
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-name">Username</label>
                <input type="text" class="form-control" v-model="username"  tabindex="1" placeholder="User name" v-bind:class="{'is-invalid' : errors.username}" autofocus autocomplete="off">
                <span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
            </fieldset>
            <fieldset class="form-group floating-label-form-group mb-1" style="margin-top:15px;">
                <label for="user-password">Password</label>
                <div style="font-size:12px; float:right;"><router-link to="/reset_password" class="card-link text" tabindex="4">Reset Password</router-link></div>
                <input type="password" tabindex="2" class="form-control" v-model="pass" placeholder="Enter Password" v-bind:class="{'is-invalid' : errors.password}" autocomplete="off">
                <span v-show="errors.password" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
            </fieldset>
            <div class="text-right" style="margin-top:15px;">
                <button type="submit" tabindex="3" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
                    <i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
                    <i v-if="processing" class="fas fa-spinner fa-pulse"></i>
                    Log In
                </button>
            </div>
        </form>
        <p class="card-subtitle line-on-side text-muted text-center  mx-2 my-1"><span><strong>or</strong></span></p>
        <div class="card-body">
            <router-link to="/signup" class="btn btn-primary btn-block custom-button"><i class="far fa-user fa-sm"></i> Create Account</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      pass: '',
      error:false,
      error_message_text:'',
      processing: false,
      errors:{
        username: false,
        password: false
      }
    }
  },
  methods: {
    login () {
      this.error = false;      
      if(this.username == ''){
        this.errors.username = true;
      }else{
        this.errors.username = false;
      }
      if(this.pass == ''){
        this.errors.password = true;
      }else{
        this.errors.password = false;
      }
      if(!this.errors.username && !this.errors.pass){
        this.processing = true;
        this.$cognitoAuth.signin(this.username, this.pass, (err, result) => {
          if (err) {
            this.processing = false;
            this.error = true;
            this.error_message_text = err.message;
          } else {
            $(".users-dropdown").text(this.username);
            localStorage.setItem('session', JSON.stringify({'user':{'username': this.username}}));
            this.$router.replace(this.$route.query.redirect || '/dashboard')
          }
        })
      }
    }
  }
}
</script>
<style>
.error {
  color: red;
}

</style>