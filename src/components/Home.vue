<template>
  <!-- <div>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"> -->
      <!-- <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol> -->
      <!-- <div class="carousel-inner"> -->
        <!-- <div class="carousel-item active">
          <img class="d-block w-100" src="static/banner/banner1_white.jpg" alt="First slide">
          <div class="carousel-caption d-none d-sm-block d-md-block">
              <h3 class="text text-center" style="color:black;">CLOUD TRAIL TRACKER</h3>
              <p class="text-justify" style="color:black">Esta herramienta permite al docente conocer el grado de realización de prácticas para un alumno
                  concreto, así como obtener información agregada sobre el uso de recursos en AWS de diferentes
                  alumnos a lo largo de los cursos académicos. 
              </p>
              <p class="text-justify" style="color:black">
                El uso de este tipo de herramientas permite la recopilación de evidencias de realización de actividades en la nube, 
                conducentes a la evaluación automática de las mismas.
              </p>
          </div>
        </div> -->
        <!-- <div class="carousel-item active">
          <img class="d-block w-100" src="static/banner/banner2_white.jpg" alt="Second slide">
           <div class="carousel-caption d-none d-sm-block d-md-block">
              <h3 class="text text-center" style="color:black;">CLOUD TRAIL TRACKER</h3>
              <p class="text-justify" style="color:black">Esta herramienta permite al docente conocer el grado de realización de prácticas para un alumno
                  concreto, así como obtener información agregada sobre el uso de recursos en AWS de diferentes
                  alumnos a lo largo de los cursos académicos. 
              </p>
              <p class="text-justify" style="color:black">
                El uso de este tipo de herramientas permite la recopilación de evidencias de realización de actividades en la nube, 
                conducentes a la evaluación automática de las mismas.
              </p>
          </div>
        </div> -->
        <!-- <div class="carousel-item">
          <img class="d-block w-100" src="static/banner/banner3_white.jpg" alt="Third slide">
           <div class="carousel-caption d-none d-sm-block d-md-block">
              <h3 class="text text-center" style="color:black;">CLOUD TRAIL TRACKER</h3>
              <p class="text-justify" style="color:black">Esta herramienta permite al docente conocer el grado de realización de prácticas para un alumno
                  concreto, así como obtener información agregada sobre el uso de recursos en AWS de diferentes
                  alumnos a lo largo de los cursos académicos. 
              </p>
              <p class="text-justify" style="color:black">
                El uso de este tipo de herramientas permite la recopilación de evidencias de realización de actividades en la nube, 
                conducentes a la evaluación automática de las mismas.
              </p>
          </div>
        </div> -->
      <!-- </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div> -->
  <div class="header" style="background-image: url('static/banner/banner1_white.jpg')!important; height:80vh">
    <div class="text-header-wrapper" style="text-align: center;">
        <div style="font-family: DKHoney; color: #000;
             letter-spacing: 2px;font-weight:bold;"> 
             CLOUD TRAIL TRACKER
              <!-- <p class="text-center sub-text" style="color:black;">Herramienta docente para la recopilación de información
                como evidencias de realización de actividades en la nube, 
                conducentes a la evaluación automática de las mismas.
              </p> -->
        </div>
    </div>
  </div>
  
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted(){
    // $('.carousel').carousel('cycle');
    // $('.carousel').carousel({
    //   interval: 2000
    // })
  }
}
  
  // props: ['loggedIn'],
  // created: function () {
  //   this.$cognitoAuth.isAuthenticated((err, loggedIn) => {
  //     if (err) {
  //       console.err("Home: Couldn't get the session:", err, err.stack)
  //       return
  //     }
  //     this.loggedIn = loggedIn
  //   })
  // }
// }
</script>
<style>
.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse farthest-corner at center center, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.85) 100%) repeat scroll 0% 0%;
}
.carousel-caption {
    top: 80px;
    bottom: auto;
}
.header {
    /*    background-image: url('../images/john-matychuk-284377.jpg') !important; */
    /*background-image: url('../images/main-bg.jpg') !important;*/
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    padding-top: 1px;
    /*    filter: grayscale(80%)*/
}
.text-header-wrapper {
    margin-top: 30px;
}
.header {
    padding: 40px;
    padding-top: 10px;
}
</style>
