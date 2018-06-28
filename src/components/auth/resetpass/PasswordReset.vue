<template>
	<div class="login">
		<h2>Password Reset</h2>
		<div v-if="error" class="alert alert-danger">
				{{error_message_text}}
		</div>
		<form @submit.prevent="passwordReset" name="passreset">
		<div class="form-group">
			<div class="input-group">
				<input type="text" v-model="username" autofocus autocomplete="off" v-bind:class="{'is-invalid' : mistake.username}">			
				<label class="control-label" for="username">{{'auth.username' | translate}}</label><i class="bar"></i>
				<span v-show="mistake.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>

			</div>
		</div>		
		<div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
			<button tabindex="3" class="btn btn-primary custom-button" type="submit" style="min-width:40%; margin-top:5px;" :disable="processing">
			<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
			<i v-if="processing" class="fas fa-spinner fa-pulse"></i>			
			Recover Password
			</button>				
		</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
		username: "",
		error: false,
		error_message_text: "",
		processing: false,
		mistake: {
			username: false
		}		
		};
	},
	methods: {
		passwordReset() {
			this.error = false;
			if (this.username == "") {
				this.mistake.username = true;
			} else {
				this.mistake.username = false;
			}
			if (!this.mistake.username) {
				this.processing = true;
				this.$cognitoAuth.forgotPassword(this.username, (err, result) => {
					if (err) {
						this.processing = false;
						this.error = true;
						this.error_message_text = err.message;
					} else {
						console.log("Password reset successful:", result);
						this.$router.replace("/confirmpassreset");
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
