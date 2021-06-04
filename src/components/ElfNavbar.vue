<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="elf-navbar" sticky>
    <b-navbar-brand>
      <font-awesome-icon icon="ghost" ref="logo" @click="surprise" />
      <!-- <span>Elf</span> -->
    </b-navbar-brand>
    <!-- <b-nav-form>
      <b-form-input size="sm" class="mr-sm-2" placeholder="Title"></b-form-input>
    </b-nav-form> -->
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <!-- <b-nav-item to="/home" :active="$route.path === '/home'">
          <font-awesome-icon icon="home" />
          <span v-text="$t('nav.home')"></span>
        </b-nav-item> -->
        <b-nav-item to="/post" :active="$route.path === '/post'">
          <font-awesome-icon icon="book" />
          <span v-text="$t('nav.post')"></span>
        </b-nav-item>
        <b-nav-item to="/category" :active="$route.path === '/category'">
          <font-awesome-icon icon="archive" />
          <span v-text="$t('nav.category')"></span>
        </b-nav-item>
        <b-nav-item to="/user" :active="$route.path === '/user'" v-if="admin">
          <font-awesome-icon icon="user" />
          <span v-text="$t('nav.user')"></span>
        </b-nav-item>
        <b-nav-item to="/navigation" :active="$route.path === '/navigation'" v-if="admin">
          <font-awesome-icon icon="anchor" />
          <span v-text="$t('nav.navigation')"></span>
        </b-nav-item>
        <b-nav-item to="/setting" :active="$route.path === '/setting'" v-if="admin">
          <font-awesome-icon icon="cog" />
          <span v-text="$t('nav.setting')"></span>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-item disabled v-if="loading">
          <i class="fa fa-spinner fa-pulse"></i>
        </b-nav-item> -->
        <!-- <b-nav-item-dropdown right no-caret>
          <template slot="button-content">
            <i class="fa fa-language"></i>
          </template>
          <b-dropdown-item
            v-for="(locale, index) in $i18n.availableLocales" :key="index" @click="$i18n.locale = locale" :active="$i18n.locale === locale"
          >
            {{ locale }}
          </b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item-dropdown right no-caret>
          <template slot="button-content">
            <font-awesome-icon icon="bars" />
          </template>
          <b-dropdown-item
            v-for="(item, index) in menu" :key="index" @click="item.action"
          >
            <font-awesome-icon :icon="item.icon" fixed-width />
            <span v-text="item.text"></span>
          </b-dropdown-item>
          <b-dropdown-divider v-if="menu.length > 0"></b-dropdown-divider>
          <b-dropdown-item @click="$parent.showProfileModal">
            <font-awesome-icon icon="id-card" fixed-width />
            <span v-text="$t('menu.profile')"></span>
          </b-dropdown-item>
          <b-dropdown-item @click="logout">
            <font-awesome-icon icon="sign-out-alt" fixed-width />
            <span v-text="$t('menu.signOut')"></span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import store from 'store'

export default {
  props: {
    toolbar: Array,
    menu: Array
  },
  data () {
    return {
      admin: false
    }
  },
  methods: {
    logout () {
      store.clearAll()
      this.$router.push('/login')
    },
    // An Easter egg, surprise!
    surprise () {
      let animation = 'animate__swing'
      this.$refs.logo.classList.add('animate__animated', animation)
      let animationend = () => {
        this.$refs.logo.classList.remove('animate__animated', animation)
        this.$refs.logo.removeEventListener('animationend', animationend)
      }
      this.$refs.logo.addEventListener('animationend', animationend)
    },
    refreshMenu (admin) {
      this.admin = admin
    }
  }
}
</script>

<style lang="less">
.elf {
  &-navbar {
    .dropdown-menu {
      z-index: 1501;
    }
  }
}
</style>
