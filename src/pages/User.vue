<template>
  <div>
    <b-table
      hover bordered responsive class="text-nowrap"
      :fields="fields" :items="rows"
    >
      <template #cell(actions)="row">
        <b-button
          pill size="sm" variant="success"
          @click="disabled = true; recordId = row.item.id; openModal()"
        >
          <font-awesome-icon icon="eye" />
          <span v-text="$t('common.view')"></span>
        </b-button>
        <b-button
          pill size="sm" variant="primary"
          @click="recordId = row.item.id; openModal()"
        >
          <font-awesome-icon icon="pen" />
          <span v-text="$t('common.edit')"></span>
        </b-button>
        <b-button
          pill size="sm" variant="danger"
          @click="recordId = row.item.id; openRemoveModal()"
        >
          <font-awesome-icon icon="trash" />
          <span v-text="$t('common.del')"></span>
        </b-button>
      </template>
    </b-table>
    <div class="mx-3">
      <p
        class="float-left text-muted"
        v-text="$t('common.paginationInfo', { limit, total })"
      ></p>
      <b-pagination
        align="right" :total-rows="total" v-model="page" :per-page="limit"
      ></b-pagination>
    </div>

    <b-modal
      ref="modal"
      :ok-title="$t(disabled ? 'common.edit' : 'common.save')"
      :cancel-title="$t(disabled ? 'common.close' : 'common.cancel')"
      @hidden="resetModal" @ok="disabled ? switchToEdit($event) : save($event)"
      :ok-disabled="!$refs.form || !$refs.form.checkValidity()"
      no-close-on-backdrop scrollable
    >
      <template #modal-title>
        <div v-if="recordId === null">
          <font-awesome-icon icon="plus" />
          <span v-text="$t('common.new')"></span>
        </div>
        <div v-if="recordId !== null && !disabled">
          <font-awesome-icon icon="pen" />
          <span v-text="$t('common.edit')"></span>
        </div>
        <div v-if="recordId !== null && disabled">
          <font-awesome-icon icon="eye" />
          <span v-text="$t('common.view')"></span>
        </div>
      </template>
      <form ref="form" @submit.stop.prevent="save">
        <!-- id -->
        <b-form-group :label="$t('user.id')" v-if="recordId !== null">
          <b-form-input v-model="recordId" type="text" disabled></b-form-input>
        </b-form-group>

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
        <b-form-group v-if="recordId != null" v-show="!disabled">
          <b-form-checkbox
            v-model="extra.resetPassword"
            :value="true" :unchecked-value="false"
            v-if="recordId != null"
          >
            <span v-text="$t('user.resetPassword')"></span>
          </b-form-checkbox>
        </b-form-group>
        <b-form-group
          :label="$t('user.password')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
          v-if="recordId == null || extra.resetPassword"
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
            v-model="record.birthday" value-as-date
            :locale="$t('locale.datepicker')"
            :disabled="disabled"
          ></b-form-datepicker>
        </b-form-group>

        <!-- isActive -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isActive"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('user.isActive')"></span>
          </b-form-checkbox>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      ref="removeModal" ok-variant="danger"
      :ok-title="$t('common.ok')" :cancel-title="$t('common.cancel')"
      @hidden="resetModal" @ok="remove"
      no-close-on-backdrop scrollable
    >
      <template #modal-title>
        <div>
          <font-awesome-icon icon="trash" />
          <span v-text="$t('common.del')"></span>
        </div>
      </template>
      <span v-text="$t('common.delTips')"></span>
    </b-modal>

    <elf-uploader ref="uploader" @uploaded="uploaded"></elf-uploader>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import ElfUploader from '@/components/ElfUploader'

export default {
  components: { ElfUploader },
  data () {
    return {
      /** 基础部分 */
      fields: [
        { key: 'id', label: this.$t('user.id') },
        { key: 'username', label: this.$t('user.username') },
        { key: 'nickname', label: this.$t('user.nickname') },
        { key: 'email', label: this.$t('user.email') },
        { key: 'phone', label: this.$t('user.phone') },
        {
          key: 'isActive',
          label: this.$t('user.isActive'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'activeAt',
          label: this.$t('user.activeAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'gender',
          label: this.$t('user.gender'),
          formatter: (v) => this.$t(v ? 'user.genders.female' : 'user.genders.male')
        },
        {
          key: 'role',
          label: this.$t('user.role'),
          formatter: (v) => this.$t({0: 'user.roles.admin', 1: 'user.roles.author'}[v])
        },
        {
          key: 'createdAt',
          label: this.$t('user.createdAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'updatedAt',
          label: this.$t('user.updatedAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        { key: 'actions', label: this.$t('common.action') }
      ],
      rows: [],
      total: 0,
      limit: 20,
      page: 1,
      record: {},
      recordId: null,
      disabled: false,

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
        isActive: record.isActive || false,
        avatar: record.avatar,
        gender: record.gender,
        birthday: record.birthday
      }
    },
    // 获取记录列表
    listRecords (limit, page) {
      return this.$axios.get(`/users?limit=${limit}&page=${page}`)
    },
    // 获取记录
    getRecord (id) {
      return this.$axios.get(`/users/${id}`)
    },
    // 创建记录
    createRecord (record) {
      return this.$axios.post('/users', this.formatRecord(record))
    },
    // 更新记录
    updateRecord (id, record) {
      return this.$axios.put(`/users/${id}`, this.formatRecord(record))
    },
    // 删除记录
    deleteRecord (id) {
      return this.$axios.delete(`/users/${id}`)
    },

    /** 交互部分 */
    // 刷新表格
    refreshTable () {
      this.listRecords(this.limit, this.page).then(res => {
        if (this.page > 1 && res.data.rows.length === 0) {
          // 若该页不是第一页且该页无数据则跳回上一页（该页数据全被删除会自动跳回上一页）
          this.page = 1
        } else {
          this.rows = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 重置模态框
    resetModal () {
      this.disabled = false
      this.recordId = null
      this.record = {}
      this.extra.resetPassword = false
      this.$clearValidity()
    },
    // 打开编辑和新建模态框
    openModal () {
      if (this.recordId !== null) {
        this.getRecord(this.recordId).then(res => {
          this.record = res.data
          this.extra.tags = res.data.tags.split(',')
        })
      }
      this.$refs.modal.show()
    },
    // 打开删除模态框
    openRemoveModal () {
      this.$refs.removeModal.show()
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

      if (this.recordId !== null) {
        this.updateRecord(this.recordId, this.record).then(res => {
          this.$bvToast.toast(this.$t('common.updateTips'), {
            variant: 'success', autoHideDelay: 3000, solid: true
          })
          this.refreshTable()
          this.$refs.modal.hide()
        })
      } else {
        this.createRecord(this.record).then(res => {
          this.$bvToast.toast(this.$t('common.createTips'), {
            variant: 'success', autoHideDelay: 3000, solid: true
          })
          this.refreshTable()
          this.$refs.modal.hide()
        })
      }
    },
    // 删除
    remove () {
      this.deleteRecord(this.recordId).then(res => {
        this.$bvToast.toast(this.$t('common.deleteTips'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        this.refreshTable()
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
    },

    // 初始化数据
    initData () {
      // 加载表格
      this.refreshTable()
    }
  },
  mounted () {
    // 更新应用菜单
    this.$parent.setMenu([{
      icon: 'sync-alt',
      text: this.$t('common.refresh'),
      action: (() => () => {
        this.initData()
      })()
    }, {
      icon: 'plus',
      text: this.$t('common.new'),
      action: (() => () => {
        this.openModal()
      })()
    }])

    // 初始化
    this.initData()
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
