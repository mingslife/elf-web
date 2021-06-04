<template>
  <div class="elf-login">
    <b-card class="elf-login__card" body-class="text-center" ref="card">
      <h1 class="py-3 text-primary">
        <font-awesome-icon icon="ghost" ref="logo" @click="surprise" />
      </h1>

      <b-form @submit.stop.prevent="login">
        <b-form-group>
          <b-form-input :placeholder="$t('login.username')" v-model="userpass.account" trim autofocus></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input type="password" :placeholder="$t('login.password')" v-model="userpass.password" trim></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" block @click="login" v-text="$t('login.login')"></b-button>
        <b-button block @click="toRegister" v-text="$t('login.register')" v-if="$parent.$settings['app.register'] === 'true'"></b-button>
      </b-form>
    </b-card>
    <p class="text-center text-muted font-weight-light">&copy; ELF</p>
  </div>
</template>

<script>
import store from 'store'

export default {
  data () {
    return {
      userpass: {}
    }
  },
  methods: {
    /** 请求部分 */
    formatUserpass (userpass) {
      return {
        account: userpass.account,
        password: userpass.password
      }
    },
    userpassAuth (userpass) {
      this.loading = true
      return this.$axios.post(
        '/auth/login', this.formatUserpass(userpass)
      ).finally(() => { this.loading = false })
    },

    /** 交互部分 */
    login (e) {
      e.preventDefault()

      this.userpassAuth(this.userpass).then(res => {
        store.set('elf:token', res.data.token)
        // this.$router.push('/home')
        this.$parent.refreshInfo()
        this.$router.push('/post') // 直接进到文章页
      }).catch(() => {
        let animation = 'animate__shakeX'
        this.$refs.card.classList.add('animate__animated', animation, 'animate__fast')
        let animationend = () => {
          this.$refs.card.classList.remove('animate__animated', animation, 'animate__fast')
          this.$refs.card.removeEventListener('animationend', animationend)
        }
        this.$refs.card.addEventListener('animationend', animationend)
      })
    },
    toRegister () {
      this.$router.push('/register')
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
    }
  }
}
</script>

<style lang="less">
.elf {
  &-login {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #efefef;
    overflow: auto;
    &__card {
      margin: 0 auto 35px;
      width: 100%;
      @media (min-width: 576px) {
        margin: 50px auto 35px;
        width: 300px;
      }
    }
  }
}
</style>
