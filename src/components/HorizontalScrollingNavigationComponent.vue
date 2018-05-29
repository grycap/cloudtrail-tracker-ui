<template>
    <div class="horizontal-scrolling-nav-wrapper">
        <nav ref="horizontalScrollingNav" class="horizontal-scrolling-nav">
            <div ref="horizontalScrollingNavContents" class="horizontal-scrolling-nav-contents">
				<router-link v-for="(itemNav, key) in  itemNavs" :key="key" :to="itemNav.path" class="horizontal-scrolling-nav-link" :aria-selected="itemNav.selected">{{itemNav.title}} <span v-if="itemNav.badge > 0" class="badge badge-pill badge-secondary" style="margin-left: 5px; margin-top: -5px;">{{itemNav.badge}}</span></router-link>
                <span ref="horizontalScrollingNavIndicator" class="horizontal-scrolling-nav-indicator"></span>
            </div>
        </nav>
        <button ref="horizontalScrollingNavAdvancerLeft" class="horizontal-scrolling-nav-advancer horizontal-scrolling-nav-advancer-left" type="button">
            <svg class="horizontal-scrolling-nav-advancer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M445.44 38.183L-2.53 512l447.97 473.817 85.857-81.173-409.6-433.23v81.172l409.6-433.23L445.44 38.18z"/></svg>
        </button>
        <button ref="horizontalScrollingNavAdvancerRight" class="horizontal-scrolling-nav-advancer horizontal-scrolling-nav-advancer-right" type="button">
            <svg class="horizontal-scrolling-nav-advancer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M105.56 985.817L553.53 512 105.56 38.183l-85.857 81.173 409.6 433.23v-81.172l-409.6 433.23 85.856 81.174z"/></svg>
        </button>
    </div>
</template>

<script>
	export default {
		props:{
			colors:{
				type: Array,
				default:[]
			},
			itemNavs:{
				type: Array,
				default:[]
			}
		},
		data() {
				return {					
					SETTINGS: {
						navBarTravelling: false,
						navBarTravelDirection: "",
						navBarTravelDistance: 150
					}, 
					horizontalScrollingNavAdvancerLeft:'',
					horizontalScrollingNavAdvancerRight:'',
					horizontalScrollingNavIndicator: '',
					horizontalScrollingNav:'',
					horizontalScrollingNavContents:'',
					last_known_scroll_position: 0,
					ticking: false
				};
		},
		watch:{
			itemNavs:function(){
				setTimeout(() => {
					this.moveIndicator(this.horizontalScrollingNav.querySelector("a[aria-selected=\"true\"]"), this.colors[Helpers.getRandomInt(0,this.colors.length - 1)]);		
				}, 50);
			},
			// conversations:function(){
			// 	this.updateItemNavs();
			// }
		},
		computed:{
			conversations(){
				return Global.state.conversations;
			}
		},
		methods: {
			updateItemNavs(){
				for(let i  in  this.itemNavs){
					this.itemNavs[i].badge = this.getCount(this.itemNavs[i].title);
				}
			},
			getCount(title){
				let count = 0;
				title = title.toLowerCase();
				let conversation = Storage.get('conversation');
				switch (title) {
					case 'leads':
						for(let i in this.conversations){
							if(this.conversations[i]['type'] == 'lead'){
								count += this.conversations[i]['unread'] * 1;
							}
						}
						break;
					case 'coworkers':
						for(let i in this.conversations){
							if(this.conversations[i]['type'] == 'coworkers'){
								count += this.conversations[i]['unread'] * 1;
							}
						}
						break;
					case 'open':
						for(let i in this.conversations){
							count += this.conversations[i]['unread'] * 1;
						}
						break;
					case 'active':
						
						if(conversation){
							for(let i in this.conversations){
								if(this.conversations[i]['conversation_id'] == conversation['id'] && conversation['status'] != 'active'){
									count += this.conversations[i]['unread'] * 1;
									break;
								}
							}
						}
						
						break;
				}
				return count;
			},
			doSomething(scroll_pos) {
				this.horizontalScrollingNav.setAttribute("data-overflowing", this.determineOverflow(this.horizontalScrollingNavContents, this.horizontalScrollingNav));
			},// var count = 0;
			moveIndicator(item, color) {
				var textPosition = item.getBoundingClientRect();
				var container = this.horizontalScrollingNavContents.getBoundingClientRect().left;
				var distance = textPosition.left - container;
				var scroll = this.horizontalScrollingNavContents.scrollLeft;
				this.horizontalScrollingNavIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
				// count = count += 100;
				// this.horizontalScrollingNavIndicator.style.transform = "translateX(" + count + "px)";
				
				if (color) {
					this.horizontalScrollingNavIndicator.style.backgroundColor = color;
				}
			},
			determineOverflow(content, container) {
				var containerMetrics = container.getBoundingClientRect();
				var containerMetricsRight = Math.floor(containerMetrics.right);
				var containerMetricsLeft = Math.floor(containerMetrics.left);
				var contentMetrics = content.getBoundingClientRect();
				var contentMetricsRight = Math.floor(contentMetrics.right);
				var contentMetricsLeft = Math.floor(contentMetrics.left);
				if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
					return "both";
				} else if (contentMetricsLeft < containerMetricsLeft) {
					return "left";
				} else if (contentMetricsRight > containerMetricsRight) {
					return "right";
				} else {
					return "none";
				}
			}
			
		},
		created(){
			// this.updateItemNavs();
		},
		mounted(){
			document.documentElement.classList.remove("no-js");
			document.documentElement.classList.add("js");

			// Out advancer buttons
			this.horizontalScrollingNavAdvancerLeft = this.$refs["horizontalScrollingNavAdvancerLeft"];
			this.horizontalScrollingNavAdvancerRight = this.$refs["horizontalScrollingNavAdvancerRight"];

			// the indicator
			this.horizontalScrollingNavIndicator = this.$refs["horizontalScrollingNavIndicator"];

			this.horizontalScrollingNav = this.$refs["horizontalScrollingNav"];
			this.horizontalScrollingNavContents = this.$refs["horizontalScrollingNavContents"];

			this.horizontalScrollingNav.setAttribute("data-overflowing", this.determineOverflow(this.horizontalScrollingNavContents, this.horizontalScrollingNav));

			// Handle the scroll of the horizontal container
			this.last_known_scroll_position = 0;
			this.ticking = false;

			var $this = this;

			// Set the indicator
			
			this.moveIndicator(this.horizontalScrollingNav.querySelector("[aria-selected=\"true\"]"), this.colors[Helpers.getRandomInt(0,this.colors.length - 1)]);	
			
			this.horizontalScrollingNav.addEventListener("scroll", function() {
				$this.last_known_scroll_position = window.scrollY;
				if (!$this.ticking) {
					window.requestAnimationFrame(function() {
						$this.doSomething($this.last_known_scroll_position);
						$this.ticking = false;
					});
				}
				$this.ticking = true;
			});

			this.horizontalScrollingNavAdvancerLeft.addEventListener("click", function() {
				// If in the middle of a move return
				if ($this.SETTINGS.navBarTravelling === true) {
					return;
				}
				// If we have content overflowing both sides or on the left
				if ($this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav) === "left" || $this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav) === "both") {
					// Find how far this panel has been scrolled
					var availableScrollLeft = $this.horizontalScrollingNav.scrollLeft;
					// If the space available is less than two lots of our desired distance, just move the whole amount
					// otherwise, move by the amount in the settings
					if (availableScrollLeft < $this.SETTINGS.navBarTravelDistance * 2) {
						$this.horizontalScrollingNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
					} else {
						$this.horizontalScrollingNavContents.style.transform = "translateX(" + $this.SETTINGS.navBarTravelDistance + "px)";
					}
					// We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
					$this.horizontalScrollingNavContents.classList.remove("horizontal-scrolling-nav-contents-no-transition");
					// Update our settings
					$this.SETTINGS.navBarTravelDirection = "left";
					$this.SETTINGS.navBarTravelling = true;
				}
				// Now update the attribute in the DOM
				$this.horizontalScrollingNav.setAttribute("data-overflowing", $this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav));
			});

			this.horizontalScrollingNavAdvancerRight.addEventListener("click", function() {
				// If in the middle of a move return
				if ($this.SETTINGS.navBarTravelling === true) {
					return;
				}
				// If we have content overflowing both sides or on the right
				if ($this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav) === "right" || $this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav) === "both") {
					// Get the right edge of the container and content
					var navBarRightEdge = $this.horizontalScrollingNavContents.getBoundingClientRect().right;
					var navBarScrollerRightEdge = $this.horizontalScrollingNav.getBoundingClientRect().right;
					// Now we know how much space we have available to scroll
					var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
					// If the space available is less than two lots of our desired distance, just move the whole amount
					// otherwise, move by the amount in the settings
					if (availableScrollRight < $this.SETTINGS.navBarTravelDistance * 2) {
						$this.horizontalScrollingNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
					} else {
						$this.horizontalScrollingNavContents.style.transform = "translateX(-" + $this.SETTINGS.navBarTravelDistance + "px)";
					}
					// We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
					$this.horizontalScrollingNavContents.classList.remove("horizontal-scrolling-nav-contents-no-transition");
					// Update our settings
					$this.SETTINGS.navBarTravelDirection = "right";
					$this.SETTINGS.navBarTravelling = true;
				}
				// Now update the attribute in the DOM
				$this.horizontalScrollingNav.setAttribute("data-overflowing", $this.determineOverflow($this.horizontalScrollingNavContents, $this.horizontalScrollingNav));
			});

			this.horizontalScrollingNavContents.addEventListener(
				"transitionend",
				function() {
					// get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
					var styleOfTransform = window.getComputedStyle($this.horizontalScrollingNavContents, null);
					var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
					// If there is no transition we want to default to 0 and not null
					var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
					$this.horizontalScrollingNavContents.style.transform = "none";
					$this.horizontalScrollingNavContents.classList.add("horizontal-scrolling-nav-contents-no-transition");
					// Now lets set the scroll position
					if ($this.SETTINGS.navBarTravelDirection === "left") {
						$this.horizontalScrollingNav.scrollLeft = $this.horizontalScrollingNav.scrollLeft - amount;
					} else {
						$this.horizontalScrollingNav.scrollLeft = $this.horizontalScrollingNav.scrollLeft + amount;
					}
					$this.SETTINGS.navBarTravelling = false;
				},
				false
			);

			// Handle setting the currently active link
			this.horizontalScrollingNavContents.addEventListener("click", function(e) {
				let target = e.target;
				if(e.target.classList.contains("badge")){
					target = e.target.parentNode
				}
				var links = [].slice.call(document.querySelectorAll(".horizontal-scrolling-nav-link"));
				links.forEach(function(item) {
					item.setAttribute("aria-selected", "false");
				})
				target.setAttribute("aria-selected", "true");
				// Pass the clicked item and it's colour to the move indicator function
				$this.moveIndicator(target, $this.colors[Helpers.getRandomInt(0,$this.colors.length - 1)]);
			});

			/**
			 * @fileoverview dragscroll - scroll area by dragging
			 * @version 0.0.8
			 * 
			 * @license MIT, see https://github.com/asvd/dragscroll
			 * @copyright 2015 asvd <heliosframework@gmail.com> 
			 */

			(function (root, factory) {
				if (typeof define === 'function' && define.amd) {
					define(['exports'], factory);
				} else if (typeof exports !== 'undefined') {
					factory(exports);
				} else {
					factory((root.dragscroll = {}));
				}
			}(this, function (exports) {
				var _window = window;
				var _document = document;
				var mousemove = 'mousemove';
				var mouseup = 'mouseup';
				var mousedown = 'mousedown';
				var EventListener = 'EventListener';
				var addEventListener = 'add'+EventListener;
				var removeEventListener = 'remove'+EventListener;
				var newScrollX, newScrollY;

				var dragged = [];
				var reset = function(i, el) {
					for (i = 0; i < dragged.length;) {
						el = dragged[i++];
						el = el.container || el;
						el[removeEventListener](mousedown, el.md, 0);
						_window[removeEventListener](mouseup, el.mu, 0);
						_window[removeEventListener](mousemove, el.mm, 0);
					}

					// cloning into array since HTMLCollection is updated dynamically
					dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
					for (i = 0; i < dragged.length;) {
						(function(el, lastClientX, lastClientY, pushed, scroller, cont){
							(cont = el.container || el)[addEventListener](
								mousedown,
								cont.md = function(e) {
									if (!el.hasAttribute('nochilddrag') ||
										_document.elementFromPoint(
											e.pageX, e.pageY
										) == cont
									) {
										pushed = 1;
										lastClientX = e.clientX;
										lastClientY = e.clientY;

										e.preventDefault();
									}
								}, 0
							);

							_window[addEventListener](
								mouseup, cont.mu = function() {pushed = 0;}, 0
							);

							_window[addEventListener](
								mousemove,
								cont.mm = function(e) {
									if (pushed) {
										(scroller = el.scroller||el).scrollLeft -=
											newScrollX = (- lastClientX + (lastClientX=e.clientX));
										scroller.scrollTop -=
											newScrollY = (- lastClientY + (lastClientY=e.clientY));
										if (el == _document.body) {
											(scroller = _document.documentElement).scrollLeft -= newScrollX;
											scroller.scrollTop -= newScrollY;
										}
									}
								}, 0
							);
						})(dragged[i++]);
					}
				}

				
				if (_document.readyState == 'complete') {
					reset();
				} else {
					_window[addEventListener]('load', reset, 0);
				}

				exports.reset = reset;
			}));
		}
	};
</script>

<style>
.horizontal-scrolling-nav-wrapper {
    position: relative;
    padding: 0 11px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.horizontal-scrolling-nav {
	/* Make this scrollable when needed */
	overflow-x: auto;
	/* We don't want vertical scrolling */
	overflow-y: hidden;
	/* For WebKit implementations, provide inertia scrolling */
	-webkit-overflow-scrolling: touch;
	/* We don't want internal inline elements to wrap */
	white-space: nowrap;
	/* If JS present, let's hide the default scrollbar */
	/* positioning context for advancers */
	position: relative;
	font-size: 0;
}
.js .horizontal-scrolling-nav {
	/* Make an auto-hiding scroller for the 3 people using a IE */
	-ms-overflow-style: -ms-autohiding-scrollbar;
	/* Remove the default scrollbar for WebKit implementations */
}
.js .horizontal-scrolling-nav::-webkit-scrollbar {
	display: none;
}

.horizontal-scrolling-nav-contents {
	float: left;
	-webkit-transition: -webkit-transform 0.2s ease-in-out;
	transition: -webkit-transform 0.2s ease-in-out;
	transition: transform 0.2s ease-in-out;
	transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
	position: relative;
}

.horizontal-scrolling-nav-contents-no-transition {
	-webkit-transition: none;
	transition: none;
}

.horizontal-scrolling-nav-link {
	text-decoration: none;
	color: #888;
	font-size: 1.2rem;
	font-family: -apple-system, sans-serif;
	display: -webkit-inline-box;
	display: -ms-inline-flexbox;
	display: inline-flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	min-height: 44px;
	border: 1px solid transparent;
	padding: 0 11px;
}
.horizontal-scrolling-nav-link + .horizontal-scrolling-nav-link {
	border-left-color: #eee;
}
.horizontal-scrolling-nav-link[aria-selected="true"] {
	color: #111;
}

.horizontal-scrolling-nav-advancer {
	/* Reset the button */
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background: transparent;
	padding: 0;
	border: 0;
	/* Now style it as needed */
	position: absolute;
	top: 0;
	bottom: 0;
	/* Set the buttons invisible by default */
	opacity: 0;
	-webkit-transition: opacity 0.3s;
	transition: opacity 0.3s;
}
.horizontal-scrolling-nav-advancer:focus {
	outline: 0;
}
.horizontal-scrolling-nav-advancer:hover {
	cursor: pointer;
}

.horizontal-scrolling-nav-advancer-left {
	left: 0;
}
[data-overflowing="both"] ~ .horizontal-scrolling-nav-advancer-left,
[data-overflowing="left"] ~ .horizontal-scrolling-nav-advancer-left {
	opacity: 1;
}

.horizontal-scrolling-nav-advancer-right {
	right: 0;
}
[data-overflowing="both"] ~ .horizontal-scrolling-nav-advancer-right,
[data-overflowing="right"] ~ .horizontal-scrolling-nav-advancer-right {
	opacity: 1;
}

.horizontal-scrolling-nav-advancer-icon {
	width: 20px;
	height: 44px;
	fill: #bbb;
}

.horizontal-scrolling-nav-indicator {
	position: absolute;
	bottom: 0;
	left: 0;
	height: 4px;
	width: 100px;
	background-color: transparent;
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	-webkit-transition: background-color 0.2s ease-in-out,
		-webkit-transform 0.2s ease-in-out;
	transition: background-color 0.2s ease-in-out,
		-webkit-transform 0.2s ease-in-out;
	transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
	transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out,
		-webkit-transform 0.2s ease-in-out;
}
</style>