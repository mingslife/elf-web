<template>
  <div>
    <b-modal
      ref="modal"
      :ok-title="$t(disabled ? 'common.edit' : 'common.save')"
      :cancel-title="$t(disabled ? 'common.close' : 'common.cancel')"
      @hidden="resetModal" @ok="disabled ? switchToEdit($event) : save($event)"
      :ok-disabled="!$refs.form || !$refs.form.checkValidity()"
      no-close-on-backdrop scrollable
    >
      <template #modal-title>
        <div>
          <font-awesome-icon icon="id-card" />
          <span v-text="$t('menu.profile')"></span>
        </div>
      </template>
      <form ref="form" @submit.stop.prevent="save">
        <!-- id -->
        <!-- <b-form-group :label="$t('user.id')">
          <b-form-input v-model="record.id" type="text" disabled></b-form-input>
        </b-form-group> -->

        <!-- username -->
        <b-form-group
          :label="$t('user.username')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.username" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['username']"
            @input.capture="$checkValidity('username', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- password -->
        <b-form-group v-show="!disabled">
          <b-form-checkbox
            v-model="extra.resetPassword"
            :value="true" :unchecked-value="false"
          >
            <span v-text="$t('user.resetPassword')"></span>
          </b-form-checkbox>
        </b-form-group>
        <b-form-group
          :label="$t('user.password')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
          v-if="extra.resetPassword"
        >
          <b-form-input
            v-model="record.password" type="password"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['password']"
            @input.capture="$checkValidity('password', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- nickname -->
        <b-form-group
          :label="$t('user.nickname')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.nickname" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['nickname']"
            @input.capture="$checkValidity('nickname', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- email -->
        <b-form-group
          :label="$t('user.email')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.email" type="email"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['email']"
            @input.capture="$checkValidity('email', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- phone -->
        <b-form-group
          :label="$t('user.phone')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.phone" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['phone']"
            @input.capture="$checkValidity('phone', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- tags -->
        <b-form-group
          :label="$t('user.tags')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <!-- <b-form-input
            v-model="record.tags" type="text"
            minlength="2" maxlength="255" trim
            :state="$validity['tags']"
            @input.capture="$checkValidity('tags', $event)"
            :disabled="disabled"
          ></b-form-input> -->
          <b-form-tags
            v-model="extra.tags"
            separator=" ,;，；" remove-on-delete placeholder=""
            tag-variant="primary" size="sm"
            :state="$validity['tags']"
            @input.capture="$checkValidity('tags', $event)"
            :disabled="disabled"
          ></b-form-tags>
        </b-form-group>

        <!-- introduction -->
        <b-form-group
          :label="$t('user.introduction')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-textarea
            v-model="record.introduction" type="text"
            minlength="2" maxlength="255" trim rows="3" no-resize
            :state="$validity['introduction']"
            @input.capture="$checkValidity('introduction', $event)"
            :disabled="disabled"
          ></b-form-textarea>
        </b-form-group>

        <!-- avatar -->
        <b-form-group
          :label="$t('user.avatar')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <!-- <b-form-input
            v-model="record.avatar" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['avatar']"
            @input.capture="$checkValidity('avatar', $event)"
            :disabled="disabled"
          ></b-form-input> -->
          <b-input-group>
            <b-form-input
              v-model="record.avatar" type="text"
              minlength="2" maxlength="255" required trim
              :placeholder="$t('common.required')"
              :state="$validity['avatar']"
              @input.capture="$checkValidity('avatar', $event)"
              :disabled="disabled"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary" @click="openUploader" :disabled="disabled"
              >
                <span v-text="$t('common.upload')"></span>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-img
            class="mt-3" :src="`${$env.ROOT_URL}${record.avatar}`"
            rounded fluid
            v-if="Boolean(record.avatar)"
          ></b-img>
        </b-form-group>

        <!-- gender -->
        <b-form-group
          :label="$t('user.gender')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-select
            v-model="record.gender" :options="extra.genders"
            :disabled="disabled"
          ></b-form-select>
        </b-form-group>

        <!-- birthday -->
        <b-form-group
          :label="$t('user.birthday')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-datepicker
            v-model="record.birthday" size="sm" value-as-date
            :locale="$t('locale.datepicker')"
            :disabled="disabled"
          ></b-form-datepicker>
        </b-form-group>

        <!-- isActive -->
        <!-- <b-form-group>
          <b-form-checkbox
            v-model="record.isActive"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('user.isActive')"></span>
          </b-form-checkbox>
        </b-form-group> -->
      </form>
    </b-modal>

    <elf-uploader ref="uploader" @uploaded="uploaded"></elf-uploader>
  </div>
</template>

<script>
import ElfUploader from '@/components/ElfUploader'

export default {
  components: { ElfUploader },
  data () {
    return {
      record: {},
      disabled: true,

      /** 附加部分 */
      extra: {
        genders: [
          { value: 0, text: this.$t('user.genders.male') },
          { value: 1, text: this.$t('user.genders.female') }
        ],
        resetPassword: false,
        tags: []
      }
    }
  },
  methods: {
    /** 请求部分 */
    // 格式化记录
    formatRecord (record) {
      return {
        username: record.username,
        password: record.password,
        nickname: record.nickname,
        email: record.email,
        phone: record.phone,
        tags: record.tags,
        introduction: record.introduction,
        // isActive: record.isActive || false,
        avatar: record.avatar,
        gender: record.gender,
        birthday: record.birthday
      }
    },
    // 获取记录
    getRecord () {
      return this.$axios.get('/auth/profile')
    },
    // 更新记录
    updateRecord (record) {
      return this.$axios.put('/auth/profile', this.formatRecord(record))
    },

    /** 交互部分 */
    // 重置模态框
    resetModal () {
      this.disabled = false
      this.record = {}
      this.extra.resetPassword = false
      this.$clearValidity()
    },
    // 打开编辑和新建模态框
    openModal () {
      this.getRecord().then(res => {
        this.record = res.data
        this.extra.tags = res.data.tags.split(',')
      })
      this.$refs.modal.show()
    },
    // 切换到编辑模式
    switchToEdit (e) {
      e.preventDefault()
      this.disabled = false
    },
    // 更新和创建
    save (e) {
      // Prevent modal from closing
      e.preventDefault()

      if (!this.$refs.form.checkValidity()) {
        this.$bvToast.toast(this.$t('common.incorrectTips'), {
          variant: 'danger', autoHideDelay: 3000, solid: true
        })
        return
      }

      this.updateRecord(this.record).then(res => {
        this.$bvToast.toast(this.$t('common.updateTips'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        this.$refs.modal.hide()
      })
    },
    // 打开上传模态框
    openUploader () {
      this.$refs.uploader.show('image/*', { width: 512, height: 512 })
    },
    // 上传后
    uploaded (data) {
      this.$set(this.record, 'avatar', data.path)
      // 修复this.record.avatar发生改变之后this.$validity未相应改变的bug
      this.$set(this.$validity, 'avatar', true)
    }
  },
  watch: {
    'extra.resetPassword' (val) {
      if (!val) {
        this.record.password = null
        this.$validity['password'] = null
      }
    },
    'extra.tags' (val) {
      this.record.tags = val.join(',')
    }
  }
}
</script>
