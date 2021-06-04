<template>
  <div class="elf">
    <elf-navbar ref="navbar" :toolbar="toolbar" :menu="menu" :loading="loading" v-if="showNavbar"></elf-navbar>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <elf-profile ref="profileModal"></elf-profile>
  </div>
</template>

<script>
import store from 'store'

import ElfNavbar from '@/components/ElfNavbar'
import ElfProfile from '@/components/ElfProfile'

export default {
  name: 'App',
  components: { ElfNavbar, ElfProfile },
  data () {
    return {
      toolbar: [],
      menu: [],
      loading: false,
      showNavbar: true
    }
  },
  methods: {
    loadAllPublicSettings () {
      return this.$axios.get('/auth/settings')
    },
    loadInfo () {
      return this.$axios.get('/auth/info')
    },

    setToolbar (toolbar) {
      this.toolbar = toolbar
    },
    setMenu (menu) {
      this.menu = menu
    },
    setLoading (loading) {
      this.loading = loading
    },
    ajustNavbar () {
      switch (this.$route.name) {
        case 'Login': case 'Register': this.showNavbar = false; break
        default: this.showNavbar = true
      }
    },
    showProfileModal () {
      this.$refs.profileModal.openModal()
    },
    applySettings () {
      let settings = store.get('elf:settings')
      this.$settings = settings
      if (settings && settings['app.language']) {
        this.$i18n.locale = settings['app.language']
      } else {
        this.refreshSettings()
      }
    },
    refreshSettings () {
      this.loadAllPublicSettings().then(res => {
        if (res.data) {
          store.set('elf:settings', res.data)
        }
        this.applySettings()
      })
    },
    refreshInfo () {
      this.loadInfo().then(res => {
        this.$refs.navbar.refreshMenu(Boolean(res.data && res.data.userRole === 0))
      })
    }
  },
  mounted () {
    this.ajustNavbar()
  },
  created () {
    this.$settings = {}
    this.$info = {}
    this.applySettings()
    this.refreshInfo()
  },
  watch: {
    '$route.name' (val) {
      this.ajustNavbar()
    }
  }
}
</script>

<style lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.b-form-datepicker {
  height: 40px !important;
  > .btn {
    padding: 6px 12px;
  }
  > label.form-control {
    padding-left: 0 !important;
    text-align: left;
  }
}
</style>
