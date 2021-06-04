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

        <!-- label -->
        <b-form-group
          :label="$t('navigation.label')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-input
            v-model="record.label" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['label']"
            @input.capture="$checkValidity('label', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- url -->
        <b-form-group
          :label="$t('navigation.url')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-input
            v-model="record.url" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['url']"
            @input.capture="$checkValidity('url', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- target -->
        <b-form-group
          :label="$t('navigation.target')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 8 })"
        >
          <b-form-select
            v-model="record.target" :options="extra.targets" required
            :disabled="disabled"
          ></b-form-select>
        </b-form-group>

        <!-- position -->
        <b-form-group
          :label="$t('navigation.position')"
          :invalid-feedback="$t('common.lenFeedback', { min: 1, max: 50 })"
        >
          <b-form-input
            v-model="record.position" type="number"
            minlength="1" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['position']"
            @input.capture="$checkValidity('position', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- isActive -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isActive"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('navigation.isActive')"></span>
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
        { key: 'id', label: this.$t('navigation.id') },
        { key: 'label', label: this.$t('navigation.label') },
        { key: 'url', label: this.$t('navigation.url') },
        { key: 'target', label: this.$t('navigation.target') },
        { key: 'position', label: this.$t('navigation.position') },
        {
          key: 'isActive',
          label: this.$t('navigation.isActive'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'createdAt',
          label: this.$t('navigation.createdAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'updatedAt',
          label: this.$t('navigation.updatedAt'),
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
        targets: [
          { value: '_blank', text: this.$t('navigation.targets.blank') },
          { value: '_self', text: this.$t('navigation.targets.self') }
        ]
      }
    }
  },
  methods: {
    /** 请求部分 */
    // 格式化记录
    formatRecord (record) {
      return {
        label: record.label,
        url: record.url,
        target: record.target,
        position: parseInt(record.position),
        isActive: record.isActive || false
      }
    },
    // 获取记录列表
    listRecords (limit, page) {
      return this.$axios.get(`/navigations?limit=${limit}&page=${page}`)
    },
    // 获取记录
    getRecord (id) {
      return this.$axios.get(`/navigations/${id}`)
    },
    // 创建记录
    createRecord (record) {
      return this.$axios.post('/navigations', this.formatRecord(record))
    },
    // 更新记录
    updateRecord (id, record) {
      return this.$axios.put(`/navigations/${id}`, this.formatRecord(record))
    },
    // 删除记录
    deleteRecord (id) {
      return this.$axios.delete(`/navigations/${id}`)
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
