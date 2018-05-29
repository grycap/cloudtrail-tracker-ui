<template>
  <div>
     <div class="row" style="margin-top:50px; min-height:70vh;margin-left:20px;margin-right:20px;">

     </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
data(){
  return {
      // token: 'Loading token..',
      // token2:'',
      // user: {},
  }

},
created () {
    // this.$cognitoAuth.getIdToken((err, jwtToken) => {
    //   if (err) {
    //     console.log("Dashboard: Couldn't get the session:", err, err.stack)
    //     return
    //   }
    //   this.token = jwtDecode(jwtToken)
    //   this.token2=jwtToken;
    //   this.user = this.$cognitoAuth.getCurrentUser()
    //   document.getElementsByName('token')['0'].content = jwtToken
    //   console.log(jwtToken)
    // })
    // var _this = this; 
    // this.token2=document.getElementsByName('token')['0'].content;
    
    // const auth = {
    //     headers: {Authorization: this.token2} 
    // }
   
    // axios.get('https://7m8d8ynr58.execute-api.us-east-1.amazonaws.com/dev/pets',auth)
    // axios.get('https://7m8d8ynr58.execute-api.us-east-1.amazonaws.com/dev/pets')    
      // .then (function (resp) {   
      //    console.log(resp.data);              
        // _this.all_users = resp.data;
        // _this.all_users.splice(0,0, 'General');        
//       });
              
//   },
  
  }
}
</script>

<style>

</style>


