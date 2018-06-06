<template>  
	<div class="header" style="background-image: url('static/banner/banner1_white.jpg')!important; height:80vh">
		<div class="text-header-wrapper" style="text-align: center;">
			<div style="font-family: DKHoney; color: #000;
				letter-spacing: 2px;font-weight:bold;"> 
				CLOUD TRAIL TRACKER				
			</div>
		</div>
	</div>
  
</template>

<script>
export default {
	data() {
		return {};
	},
	mounted() {
		
	}
};
</script>
<style>
	.background-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			ellipse farthest-corner at center center,
			rgba(0, 0, 0, 0.5) 20%,
			rgba(0, 0, 0, 0.85) 100%
			)
			repeat scroll 0% 0%;
	}
	.carousel-caption {
		top: 80px;
		bottom: auto;
	}
	.header {
	
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
