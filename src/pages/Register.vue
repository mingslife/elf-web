<template>
  <div class="elf-register">
    <b-card class="elf-register__card" body-class="text-center" ref="card">
      <h1 class="py-3 text-primary">
        <font-awesome-icon icon="ghost" ref="logo" @click="surprise" />
      </h1>

      <b-form @submit.stop.prevent="register">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group>
              <b-form-input :placeholder="$t('register.username')" v-model="user.username" trim autofocus></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input type="password" :placeholder="$t('register.password')" v-model="user.password" trim></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input type="password" :placeholder="$t('register.retypePassword')" v-model="user.retypePassword" trim></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input :placeholder="$t('register.nickname')" v-model="user.nickname" trim></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group>
              <b-form-input type="email" :placeholder="$t('register.email')" v-model="user.email" trim></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input :placeholder="$t('register.phone')" v-model="user.phone" trim></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-select
                v-model="user.gender" :options="genders"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled v-text="$t('register.gender')"></b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <b-form-datepicker
                v-model="user.birthday" value-as-date
                :locale="$t('locale.datepicker')"
                :placeholder="$t('register.birthday')"
              ></b-form-datepicker>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group>
              <b-form-input :placeholder="$t('register.inviteCode')" v-model="inviteCode" trim></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-button type="submit" variant="primary" block @click="register" :disabled="!checkUser" v-text="$t('register.register')"></b-button>
        <b-button @click="toLogin" block v-text="$t('register.login')"></b-button>
      </b-form>
    </b-card>
    <p class="text-center text-muted font-weight-light">&copy; ELF</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        gender: null
      },
      genders: [
        { value: 0, text: this.$t('user.genders.male') },
        { value: 1, text: this.$t('user.genders.female') }
      ],
      inviteCode: ''
    }
  },
  methods: {
    /** 请求部分 */
    formatUser (user) {
      return {
        username: user.username,
        password: user.password,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday
      }
    },
    registerUser (user) {
      this.loading = true
      return this.$axios.post(
        `/auth/register?inviteCode=${this.inviteCode}`, this.formatUser(user)
      ).finally(() => { this.loading = false })
    },

    /** 交互部分 */
    register (e) {
      e.preventDefault()

      this.registerUser(this.user).then(res => {
        this.$bvToast.toast(this.$t('register.success'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        setTimeout(() => {
          this.toLogin()
        }, 3000)
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
    toLogin () {
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
    }
  },
  computed: {
    checkUser () {
      return Boolean(this.user.password) && this.user.password === this.user.retypePassword
    }
  }
}
</script>

<style lang="less">
.elf {
  &-register {
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
        width: 570px;
      }
    }
  }
}
</style>
