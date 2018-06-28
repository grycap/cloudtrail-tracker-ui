<template>
    <div class="login">
        <h2>Confirm Account</h2>
        <div v-if="error" class="alert alert-danger">
            {{error_message_text}}
        </div>
        <form @submit.prevent="confirm">
            <div class="form-group">
                <div class="input-group">						
                    <input type="text" id="username" v-model="username" autofocus autocomplete="off" v-bind:class="{'is-invalid' : mistake.username}"/>
                    <label class="control-label" for="username">{{'auth.username' | translate}}</label><i class="bar"></i>		
                    <span v-show="mistake.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>				
                </div>
            </div>
            <div class="form-group">
                <div class="input-group">
                    <input type="text" id="code" v-model="code" autocomplete="off" v-bind:class="{'is-invalid' : mistake.code}"/>
                    <label class="control-label" for="email">Confirmation Code</label><i class="bar"></i>
                    <span v-show="mistake.code" style="color: #cc3300; font-size: 12px;"><b>Confirmation Code is required</b></span>

                </div>
            </div>                    
            <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
                <button class="btn btn-primary" type="submit" :disabled="processing">
                    <i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
                    <i v-if="processing" class="fas fa-spinner fa-pulse"></i>
                    Confirm
                </button>                
            </div>
        </form> 
    </div>
</template>

<script>
export default {
	data() {
		return {
		username: this.$route.query.username,
        code: "",	
        error: false,	
		error_message_text: "",
        processing: false,
        mistake: {
			username: false,
			code: false
		}
		
		};
	},
	methods: {
		confirm() {		
            this.error = false;
            if (this.username == "") {
                this.mistake.username = true;
            } else {
                this.mistake.username = false;
            }
            if (this.code == "") {
                this.mistake.code = true;
            } else {
                this.mistake.code = false;
            }
            if (!this.mistake.username && !this.mistake.code) {
                this.processing = true;
                this.$cognitoAuth.confirmRegistration(
                this.username,
                this.code,
                (err, result) => {
                    if (err) {
                    this.error = true;
                    this.error_message_text = err.message;
                    console.log(err);
                    } else {
                    this.$router.replace("/");
                    }
                });
            }
		}
	}
};
</script>

<style lang="scss">
@import "../../../sass/variables";
@import "~bootstrap/scss/mixins/breakpoints";
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
.login {
  @include media-breakpoint-down(md) {
    width: 100%;
    padding-right: 2rem;
    padding-left: 2rem;
    .down-container {
      .link {
        margin-top: 2rem;
      }
    }
  }

  h2 {
    text-align: center;
  }
  width: 21.375rem;

  .down-container {
    margin-top: 3.125rem;
  }
}
</style>
