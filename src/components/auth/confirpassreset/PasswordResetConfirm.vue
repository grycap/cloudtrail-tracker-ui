<template>
	<div class="login">
		<h2>Confirm Password Reset</h2>
		<div v-if="error" class="alert alert-danger">
			{{error_message_text}}
		</div>
		<form @submit.prevent="passwordResetConfirm">
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
					<span v-show="mistake.code" style="color: #cc3300; font-size: 12px;"><b>Confirmation code is required</b></span>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
					<input type="password" id="password" v-model="pass" autocomplete="off" v-bind:class="{'is-invalid' : mistake.password}"/>
					<label class="control-label" for="password">{{'auth.password' | translate}}</label><i class="bar"></i>
					<span v-show="mistake.password" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
				</div>
			</div>        
			<div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
				<button class="btn btn-primary" type="submit" :disabled="processing">
					<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
					<i v-if="processing" class="fas fa-spinner fa-pulse"></i>
					Confirm Password Reset
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
		code: "",
		pass: "",
		error: false,
		error_message_text: "",
		processing: false,
		mistake: {
			username: false,
			password: false,
			code: false
			}
		};
	},
	methods: {
		passwordResetConfirm() {
			this.error = false;
			if (this.username == "") {
				this.mistake.username = true;
			} else {
				this.mistake.username = false;
			}
			if (this.pass == "") {
				this.mistake.password = true;
			} else {
				this.mistake.password = false;
			}
			if (this.code == "") {
				this.mistake.code = true;
			} else {
				this.mistake.code = false;
			}
			if (!this.mistake.username && !this.mistake.password && !this.mistake.code) {	
				this.proccessing = true;
				this.$cognitoAuth.confirmPassword(
					this.username,
					this.code,
					this.pass,
					(err, result) => {
					if (err) {
						this.error = true;
						this.error_message_text = err.message;
						console.log(err);
					} else {
						console.log("Signup successful:", result);
						this.$router.replace("/");
					}
					}
				);
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
