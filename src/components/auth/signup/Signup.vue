<template>
	<div class="signup">
		<h2>{{'auth.createNewAccount' | translate}}</h2>
		<div v-if="error" class="alert alert-danger">
			{{error_message_text}}
		</div>
		<form @submit.prevent="signup">
			<div class="form-group">
				<div class="input-group">						
					<input type="text" id="username" v-model="username" autofocus autocomplete="off" v-bind:class="{'is-invalid' : mistake.username}"/>
					<label class="control-label" for="username">{{'auth.username' | translate}}</label><i class="bar"></i>	
					<span v-show="mistake.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span> 					
				</div>
				</div>
			<div class="form-group">
				<div class="input-group">
					<input type="text" id="email" v-model="email" autocomplete="off" v-bind:class="{'is-invalid' : mistake.email.invalid}"/>
					<label class="control-label" for="email">{{'auth.email' | translate}}</label><i class="bar"></i>
					<span v-show="mistake.email.invalid" style="color: #cc3300; font-size: 12px;"><b>{{mistake.email.message}}</b></span>

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
					{{'auth.signUp' | translate}}
				</button>
				<router-link class='link' to='/'>{{'auth.alreadyJoined' | translate}}</router-link>
			</div>
		</form> 
	</div>
</template>

<script>
export default {
  	name: "signup",
	data() {
		return {
		username: "",
		email: "",
		pass: "",
		error: false,
		error_message_text: "",
		processing: false,
		mistake: {
			username: false,
			password: false,
			email: {
			invalid: false,
			message: ""
			}
		}
		};
	},
	methods: {
		//Make sign up
		signup() {
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
			//Validate email
			var regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (!regex_email.test(this.email) || this.email == "") {
				this.mistake.email.invalid = true;
				if (this.email == "") {
				this.mistake.email.message = "Email is required";
				} else {
				this.mistake.email.message = "Email is invalid";
				}
			} else {
				this.mistake.email.invalid = false;
			}
			if (
				!this.mistake.username &&
				!this.mistake.password &&
				!this.mistake.email.invalid
			) 
			{
				this.processing = true;
				this.$cognitoAuth.signup(
				this.username,
				this.email,
				this.pass,
				(err, result) => {
					if (err) {
					this.processing = false;
					this.error = true;
					this.error_message_text = err.message;
					} else {
						console.log("Signup successful:", result);
						this.$router.replace({
							path: "/confirm",
							query: { username: this.username }
						});
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

.signup {
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
    margin-top: 2.6875rem;
  }
}
</style>
