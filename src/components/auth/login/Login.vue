<template>
	<div class="login">
		<h2>{{'auth.welcome' | translate}}</h2>
		<div v-if="error" class="alert alert-danger">
			{{error_message_text}}
		</div>
		<form @submit.prevent="login" name="login">
			<div class="form-group">
				<div class="input-group">
				<input type="text" id="username" v-bind:class="{'is-invalid' : mistake.username}" v-model="username" />
				<label class="control-label" for="username">{{'auth.username' | translate}}</label><i class="bar"></i>
				<span v-show="mistake.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
				<input type="password" id="password" v-bind:class="{'is-invalid' : mistake.password}" v-model="pass" />
				<label class="control-label" for="password">{{'auth.password' | translate}}</label><i class="bar"></i>
				<span v-show="mistake.password" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
				</div>
			</div>
			<div class="form-group" style="justify-content:flex-end;">
				<router-link to="/resetpass" class="link">Reset Password</router-link>
			</div>
			<div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
				<button tabindex="3" class="btn btn-primary custom-button" type="submit" style="min-width:40%; margin-top:5px;" :disable="processing">
				<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
				<i v-if="processing" class="fas fa-spinner fa-pulse"></i>			
				{{'auth.login' | translate}}
				</button>	
				<router-link to="/signup" class="link"><i class="far fa-user fa-sm"></i>{{'auth.createAccount' | translate}}</router-link>		
			</div>
		</form>
	</div>
</template>

<script>
import jwtDecode from "jwt-decode";
export default {
  	name: "login",
	data() {
		return {
		username: "",
		pass: "",
		error: false,
		error_message_text: "",
		processing: false,
		mistake: {
				username: false,
				password: false
			}
		};
	},
	methods: {
		login() {
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
			if (!this.mistake.username && !this.mistake.password) {
				this.processing = true;
				this.$cognitoAuth.signin(this.username, this.pass, (err, result) => {
					if (err) {
					this.processing = false;
					this.error = true;
					this.error_message_text = err.message;
					} else {
					$(".users-dropdown").text(this.username);
					localStorage.setItem("session",JSON.stringify({ user: { username: this.username } }));
					this.$cognitoAuth.getIdToken((err, jwtToken) => {
						if (err) {
						console.log(
							"Dashboard: Couldn't get the session:",
							err,
							err.stack
						);
						return;
						}
						this.token = jwtDecode(jwtToken);
						this.token2 = jwtToken;
						this.user = this.$cognitoAuth.getCurrentUser();
						document.getElementsByName("token")["0"].content = jwtToken;
					});
					this.$router.replace(this.$route.query.redirect || "/dashboard");
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
