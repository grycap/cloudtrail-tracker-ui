<template>
	<div  style="height:70vh;">
		<div style="margin-top:50px;">
			<div class="col-6 offset-3 col-lg-4 offset-lg-4 custom-box-shadow">
				<h3 class="text-center text"><span>Password Reset</span></h3>
				<div v-if="error" class="alert alert-danger">
					{{error_message_text}}
				</div>
				<form @submit.prevent="passwordReset">
					<fieldset class="form-group floating-label-form-group" style="margin-top:20px;">
						<input type="text" class="form-control" v-model="username"  tabindex="1" placeholder="Enter username" v-bind:class="{'is-invalid' : errors.username}" autofocus autocomplete="off">
						<span v-show="errors.username" style="color: #cc3300; font-size: 12px;"><b>Username is required</b></span>
					</fieldset>
					<div class="text-right" style="margin-top:20px;">
						<button type="submit" tabindex="3" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
							<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
							<i v-if="processing" class="fa fa-spinner spinner"></i>
							Recover Password
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
		error: false,
		error_message_text: "",
		processing: false,
		errors: {
			username: false
		}
		};
	},
	methods: {
		passwordReset() {
			this.error = false;
			if (this.username == "") {
				this.errors.username = true;
			} else {
				this.errors.username = false;
			}
			if (!this.errors.username) {
				this.processing = true;
				this.$cognitoAuth.forgotPassword(this.username, (err, result) => {
					if (err) {
						this.processing = false;
						this.error = true;
						this.error_message_text = err.message;
					} else {
						console.log("Password reset successful:", result);
						this.$router.replace("/confirm_reset_password");
					}
				});
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
