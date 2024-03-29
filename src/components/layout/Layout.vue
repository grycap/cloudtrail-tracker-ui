<template>
  <div class="layout" :class="classObject" v-resize>
    <navbar></navbar>
    <sidebar></sidebar>
    <div class="content-wrap" id="content-wrap">
      <main id="content" class="content" role="main">
        <!-- <vuestic-breadcrumbs :breadcrumbs="breadcrumbs"/> -->
        <vuestic-pre-loader v-show="isLoading" ref="preLoader" class="pre-loader"></vuestic-pre-loader>
        <router-view v-show="!isLoading"></router-view>
      </main>
    </div>
    <div class="made-by-footer">
      <h6> © 2018-2023, <a href="https://www.grycap.upv.es">GRyCAP-I3M-UPV</a>, Universitat Politècnica de València, Spain.</h6>   

      <div style="padding-left:50px">
      <a href="https://github.com/grycap/cloudtrail-tracker">
          <i class="fab fa-github fa-2x"></i>
      </a>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import Navbar from './navbar/Navbar'
  import Sidebar from './sidebar/Sidebar'
  import Resize from 'directives/ResizeHandler'

  export default {
    name: 'layout',

    components: {
      Navbar,
      Sidebar
    },
    directives: {
      resize: Resize
    },
    props: {
      fixed: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      ...mapGetters([
        'sidebarOpened',
        'toggleWithoutAnimation',
        'isLoading'
      ]),
      classObject: function () {
        return {
          'layout-fixed': this.fixed,
          'sidebar-hidden': !this.toggleWithoutAnimation && !this.sidebarOpened,
          'sidebar-hidden sidebar-hidden_without-animation': this.toggleWithoutAnimation && !this.sidebarOpened
        }
      },
      breadcrumbs () {
        return this.$store.getters.breadcrumbs(this.$route.name)
      },
    }
  }
</script>

<style lang="scss">
  @import "../../sass/_variables.scss";
  @import "~bootstrap/scss/mixins/breakpoints";
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";

  .layout {
    &-fixed {
      .content-wrap {
        padding-right: $layout-padding-right;
        padding-top: $sidebar-top;

        @include media-breakpoint-down(md) {
          padding: $content-mobile-wrap-fixed-layout;
          margin-left: 0;

        }
      }
    }
  }

  .content-wrap {
    margin-left: $content-wrap-ml;
    transition: margin-left 0.3s ease;
    padding-right: $layout-padding-right;
    padding-top: $layout-padding;

    padding-bottom: $content-wrap-pb;

    .pre-loader {
      position: absolute;
      left: $vuestic-preloader-left;
      top: $vuestic-preloader-top;
    }

    .sidebar-hidden & {
      margin-left: $sidebar-left;
    }

    @include media-breakpoint-down(md) {
      padding: $content-mobile-wrap;
      margin-left: 0;

      .sidebar-hidden & {
        margin-left: 0;
        padding-top: $content-mobile-wrap-sb-top;
      }
    }
  }

  .made-by-footer {
    padding-top:25px;
    padding-left: 20px;
    padding-right: 20px;
    position: absolute;
    bottom: 0;
    padding-bottom: $made-by-footer-pb;
    height: calc(#{$layout-padding} + #{$widget-mb});
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
