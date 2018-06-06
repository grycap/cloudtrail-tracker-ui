<template>
	<div  style="height:80vh;">
		<div style="margin-top:50px;">
			<div class="col-6 offset-3 col-lg-4 offset-lg-4 custom-box-shadow">
				<h3 class="text-center text"><span class="custom-title">Sign Up</span></h3>
				<div v-if="error" class="alert alert-danger">
					{{error_message_text}}
				</div>
				<form @submit.prevent="signup">
					<fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
						<label for="user-name">Username</label>
						<input type="text" class="form-control" v-model="username"  tabindex="1" placeholder="Enter username" v-bind:class="{'is-invalid' : errors.username}" autofocus autocomplete="off">
						<span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
					</fieldset>
					<fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
						<label for="user-name">Email</label>
						<input type="text" class="form-control" v-model="email"  tabindex="1" placeholder="Enter email" v-bind:class="{'is-invalid' : errors.email.invalid}" autocomplete="off">
						<span v-show="errors.email.invalid" style="color: #cc3300; font-size: 12px;"><b>{{errors.email.message}}</b></span>
					</fieldset>
					<fieldset class="form-group floating-label-form-group mb-1" style="margin-top:15px;">
						<label for="user-password">Password</label>
						<div style="font-size:12px; float:right;"></div>
						<input type="password" tabindex="2" class="form-control" v-model="pass" placeholder="Enter Password" v-bind:class="{'is-invalid' : errors.password}" autocomplete="off">
						<span v-show="errors.password" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
					</fieldset>
					<div class="text-right" style="margin-top:15px;">
						<button type="submit" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
							<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
							<i v-if="processing" class="fas fa-spinner fa-pulse"></i>
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
		username: "",
		email: "",
		pass: "",
		error: false,
		error_message_text: "",
		processing: false,
		errors: {
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
		signup() {
			this.error = false;
			if (this.username == "") {
				this.errors.username = true;
			} else {
				this.errors.username = false;
			}
			if (this.pass == "") {
				this.errors.password = true;
			} else {
				this.errors.password = false;
			}
			//Validate email
			var regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (!regex_email.test(this.email) || this.email == "") {
				this.errors.email.invalid = true;
				if (this.email == "") {
				this.errors.email.message = "Email is required";
				} else {
				this.errors.email.message = "Email is invalid";
				}
			} else {
				this.errors.email.invalid = false;
			}

			//Make sign up
			if (
				!this.errors.username &&
				!this.errors.pass &&
				!this.errors.email.invalid
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
					}
				);
			}
		}
	}
};
</script>

<style>
.error {
  color: red;
}
</style>
