<template>
	<div class="row">
		<div class="col-10 offset-1 col-md-6 offset-md-3 col-xl-4 offset-xl-4">		
			<h2>Change Password</h2>
			<div v-if="error" class="alert alert-danger">
				{{error_message_text}}
			</div>
			<form @submit.prevent="login">
				<div class="form-group">
					<div class="input-group">
					<input type="password" id="username" v-bind:class="{'is-invalid' : mistake.oldpassword}" v-model="oldpass"/>
					<label class="control-label" for="username">Current Password</label><i class="bar"></i>
					<span v-show="mistake.oldpassword" style="color: #cc3300; font-size: 12px;"><b>Current Password is required</b></span>
					</div>
				</div>
				<div class="form-group">
					<div class="input-group">
					<input type="password" id="password" v-bind:class="{'is-invalid' : mistake.newpassword}" v-model="newpass"/>
					<label class="control-label" for="password">New Password</label><i class="bar"></i>
					<span v-show="mistake.newpassword" style="color: #cc3300; font-size: 12px;"><b>Password is required</b></span>
					</div>
				</div>
				
				<div class="d-flex flex-column  align-items-center justify-content-between down-container">
					<button tabindex="3" class="btn btn-primary custom-button" type="submit" style="margin-top:5px;" :disable="processing">
					<i v-if="!processing" class="fas fa-unlock-alt fa-sm"></i> 
					<i v-if="processing" class="fas fa-spinner fa-pulse"></i>			
					Confirm New Password
					</button>	
					
				</div>
			</form>
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
		mistake: {
			oldpassword: false,
			newpassword: false
		}
		};
	},
	methods: {
		passwordChange() {
			this.error = false;
			if (this.oldpass == "") {
				this.mistake.oldpassword = true;
			} else {
				this.mistake.oldpassword = false;
			}
			if (this.newpass == "") {
				this.mistake.newpassword = true;
			} else {
				this.mistake.newpassword = false;
			}
			if (!this.mistake.oldpassword && !this.mistake.newpassword) {
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
  }

  h2 {
    text-align: center;
  }
 width: 21.375rem;
}
  

.error {
  color: red;
}
</style>
