<template>
    <div  style="height:70vh;">
      <div style="margin-top:50px">
        <div class="col-sm-6 offset-3 col-lg-4 offset-lg-4 custom-box-shadow">
          <h3 class="text-center text">Confirm Account</h3>
          <p class="text center" style="font-size:13px;color: #6c757d;">
            Enter your confirmation code which was emailed to you.
          </p>
          <div v-if="error" class="alert alert-danger">
            {{error_message_text}}
           </div>
          <form @submit.prevent="confirm">
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-name">Username</label>
                <input type="text" class="form-control" v-model="username"  tabindex="1" placeholder="Enter username" v-bind:class="{'is-invalid' : errors.username}" autofocus autocomplete="off">
                <span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
            </fieldset>
            <fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
                <label for="user-code">Confirmation Code</label>
                <input type="text" class="form-control" v-model="code"  tabindex="1" placeholder="Enter your confirmation code" v-bind:class="{'is-invalid' : errors.code}" autocomplete="off">
                <span v-show="errors.code" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
            </fieldset>
            
            <div class="text-right" style="margin-top:15px;">
                <button type="submit" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
                    <i v-if="!processing" class="ft-unlock"></i> 
                    <i v-if="processing" class="fa fa-spinner spinner"></i>
                    Confirm 
                </button>
            </div>
          </form>
          <div class="row marketing">
          </div>
        </div>
      </div>
    </div>  
</template>

<script>
export default {
  data () {
    return {
      username: this.$route.query.username,
      code: '',
      error: false,
      error_message_text:'',
      processing:false,
      errors:{
        username:false,
        code:false,
      }
    }
  },
  methods: {
    confirm () {
      this.error=false;
      if (this.username == '') {
        this.errors.username = true;
      } else {
        this.errors.username = false;
      }
      if (this.code == '') {
        this.errors.code = true;
      } else {
        this.errors.code = false;
      }
      if (!this.errors.username && !this.errors.code){
        this.processing=true;
        this.$cognitoAuth.confirmRegistration(this.username, this.code, (err, result) => {
          if (err) {
            this.error = true;
            this.error_message_text = err.message;
            console.error(err)
          } else {
            this.$router.replace('/login')
          }
        })
      }
    }
  }
}
</script>
