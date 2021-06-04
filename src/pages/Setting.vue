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
        <b-form-group :label="$t('category.id')" v-if="recordId !== null">
          <b-form-input v-model="recordId" type="text" disabled></b-form-input>
        </b-form-group>

        <!-- settingKey -->
        <b-form-group
          :label="$t('setting.settingKey')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 64 })"
        >
          <b-form-input
            v-model="record.settingKey" type="text"
            minlength="2" maxlength="64" required trim
            :placeholder="$t('common.required')"
            :state="$validity['settingKey']"
            @input.capture="$checkValidity('settingKey', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- settingValue -->
        <b-form-group
          :label="$t('setting.settingValue')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-input
            v-model="record.settingValue" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['settingValue']"
            @input.capture="$checkValidity('settingValue', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- settingTag -->
        <b-form-group
          :label="$t('setting.settingTag')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.settingTag" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['settingTag']"
            @input.capture="$checkValidity('settingTag', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- isPublic -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isPublic"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('setting.isPublic')"></span>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      /** 基础部分 */
      fields: [
        { key: 'id', label: this.$t('setting.id') },
        { key: 'settingKey', label: this.$t('setting.settingKey') },
        { key: 'settingValue', label: this.$t('setting.settingValue') },
        { key: 'settingTag', label: this.$t('setting.settingTag') },
        {
          key: 'isPublic',
          label: this.$t('setting.isPublic'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'createdAt',
          label: this.$t('setting.createdAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'updatedAt',
          label: this.$t('setting.updatedAt'),
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
      extra: {}
    }
  },
  methods: {
    /** 请求部分 */
    // 格式化记录
    formatRecord (record) {
      return {
        settingKey: record.settingKey,
        settingValue: record.settingValue,
        settingTag: record.settingTag,
        isPublic: record.isPublic || false
      }
    },
    // 获取记录列表
    listRecords (limit, page) {
      return this.$axios.get(`/settings?limit=${limit}&page=${page}`)
    },
    // 获取记录
    getRecord (id) {
      return this.$axios.get(`/settings/${id}`)
    },
    // 创建记录
    createRecord (record) {
      return this.$axios.post('/settings', this.formatRecord(record))
    },
    // 更新记录
    updateRecord (id, record) {
      return this.$axios.put(`/settings/${id}`, this.formatRecord(record))
    },
    // 删除记录
    deleteRecord (id) {
      return this.$axios.delete(`/settings/${id}`)
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
      this.$clearValidity()
    },
    // 打开编辑和新建模态框
    openModal () {
      if (this.recordId !== null) {
        this.getRecord(this.recordId).then(res => {
          this.record = res.data
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

          this.$parent.refreshSettings()
        })
      } else {
        this.createRecord(this.record).then(res => {
          this.$bvToast.toast(this.$t('common.createTips'), {
            variant: 'success', autoHideDelay: 3000, solid: true
          })
          this.refreshTable()
          this.$refs.modal.hide()

          this.$parent.refreshSettings()
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

        this.$parent.refreshSettings()
      })
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
  }
}
</script>
