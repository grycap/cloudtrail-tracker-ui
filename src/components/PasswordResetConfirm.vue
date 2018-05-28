<template>
  <div  style="height:70vh;">
    <div style="margin-top:50px;">
        <div class="col-sm-6 offset-3 col-lg-4 offset-lg-4 custom-box-shadow">
          <h3 class="text-center text">Confirm Password Reset</h3>
          <p class="text-center " style="font-size:13px;color: #6c757d;">Enter your confirmation code which was emailed to you and a new password.</p>
           <div v-if="error" class="alert alert-danger">
            {{error_message_text}}
           </div>
          <form @submit.prevent="passwordResetConfirm">
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-name">Username</label>
                <input type="text" class="form-control" v-model="username"  tabindex="1" placeholder="Enter username" v-bind:class="{'is-invalid' : errors.username}" autofocus autocomplete="off">
                <span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
            </fieldset>
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-code">Confirmation Code</label>
                <input type="text" class="form-control" v-model="code"  tabindex="1" placeholder="Enter you confirmation code" v-bind:class="{'is-invalid' : errors.code}"  autocomplete="off">
                <span v-show="errors.code" style="color: #cc3300; font-size: 12px;"><b>Confirmation code is required</b></span>
            </fieldset>
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-password">Password</label>
                <input type="password" class="form-control" v-model="pass"  tabindex="1" placeholder="Enter password here" v-bind:class="{'is-invalid' : errors.password}"  autocomplete="off">
                <span v-show="errors.password" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
            </fieldset> 
            
            <div class="text-right" style="margin-top:15px;">
                <button type="submit" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
                    <i v-if="!processing" class="ft-unlock"></i> 
                    <i v-if="processing" class="fa fa-spinner spinner"></i>
                    Confirm Password Reset
                </button>
            </div>
          </form>
        </div>
     </div>   
  </div> 
</template>

<script>
export default {
  data () {
    return {
      username: '',
      code: '',
      pass: '',
      error: false,
      error_message_text:'',
      processing:false,
      errors:{
        username:false,
        password:false,
        code:false
      }
    }
  },
  methods: {
    passwordResetConfirm () {
      this.error = false;
      if(this.username == ''){
        this.errors.username = true;
      }else {
        this.errors.username = false;
      }
      if(this.pass == ''){
        this.errors.password = true;
      }else {
        this.errors.password = false;
      }      
      if(this.code == ''){
        this.errors.code = true;
      }else {
        this.errors.code = false;
      }
      if(!this.errors.username && !this.errors.pass && !this.errors.code){      
        this.proccessing = true;
        this.$cognitoAuth.confirmPassword(this.username, this.code, this.pass, (err, result) => {
          if (err) {
            this.error = true;
            this.error_message_text=err.message;
            console.error(err)
          } else {
            console.log('Signup successful:', result)
            this.$router.replace('/')
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
