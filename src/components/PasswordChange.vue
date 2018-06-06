<template>
	<div  style="height:70vh;">
		<div style="margin-top:50px;">
			<div class="col-sm-6 offset-3 col-lg-4 offset-lg-4 custom-box-shadow">
				<h3 class="text-center text">Change Password</h3>				
				<div v-if="error" class="alert alert-danger">
					{{error_message_text}}
				</div>
				<form @submit.prevent="passwordChange">
					<fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
						<label for="user-password">Current Password</label>
						<input type="password" class="form-control" v-model="oldpass"  tabindex="1" placeholder="Enter your current password" v-bind:class="{'is-invalid' : errors.oldpassword}" autofocus autocomplete="off">
						<span v-show="errors.oldpassword" style="color: #cc3300; font-size: 12px;"><b>Current Password is required</b></span>
					</fieldset>
					<fieldset class="form-group floating-label-form-group" style="margin-top:15px;">
						<label for="user-passwordold">New Password</label>
						<input type="password" class="form-control" v-model="newpass"  tabindex="1" placeholder="Enter your new password" v-bind:class="{'is-invalid' : errors.newpassword}"  autocomplete="off">
						<span v-show="errors.newpassword" style="color: #cc3300; font-size: 12px;"><b>New Password is required</b></span>
					</fieldset>
				
				    <div class="text-right" style="margin-top:15px;">
						<button type="submit" class="btn btn-primary custom-button" style="min-width:40%; margin-top:5px;" :disabled="processing">
							<i v-if="!processing" class="ft-unlock"></i> 
							<i v-if="processing" class="fa fa-spinner spinner"></i>
							Confirm New Password
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
		oldpass: "",
		newpass: "",
		error: false,
		error_message_text: "",
		processing: false,
		errors: {
			oldpassword: false,
			newpassword: false
		}
		};
	},
	methods: {
		passwordChange() {
			this.error = false;
			if (this.oldpass == "") {
				this.errors.oldpassword = true;
			} else {
				this.errors.oldpassword = false;
			}
			if (this.newpass == "") {
				this.errors.newpassword = true;
			} else {
				this.errors.newpassword = false;
			}
			if (!this.errors.oldpassword && !this.errors.newpassword) {
				this.proccessing = true;
				this.$cognitoAuth.changePassword(
					this.oldpass,
					this.newpass,
					(err, result) => {
						if (err) {
						this.error = true;
						this.error_message_text = err.message;
						console.error(err);
						} else {
						console.log("Password change successful:", result);
						this.$router.replace("/");
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
