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
          @click="parentId = row.item.id; openModal()"
        >
          <font-awesome-icon icon="reply" />
          <span v-text="$t('comment.reply')"></span>
        </b-button>
        <b-button
          pill size="sm" :variant="row.item.isBlocked ? 'info' : 'danger'"
          @click="block(row.item.id, !row.item.isBlocked)"
        >
          <font-awesome-icon icon="ban" v-if="!row.item.isBlocked" />
          <font-awesome-icon icon="check" v-if="row.item.isBlocked" />
          <span v-text="$t(row.item.isBlocked ? 'comment.unblock' : 'comment.block')"></span>
        </b-button>
        <!-- <b-button
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
        </b-button> -->
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
        <b-form-group :label="$t('comment.id')" v-if="recordId !== null">
          <b-form-input v-model="recordId" type="text" disabled></b-form-input>
        </b-form-group>

        <!-- nickname -->
        <b-form-group
          :label="$t('comment.nickname')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
          v-if="Boolean(recordId)"
        >
          <b-form-input
            v-model="record.nickname" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['nickname']"
            @input.capture="$checkValidity('nickname', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- email -->
        <b-form-group
          :label="$t('comment.email')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
          v-if="Boolean(recordId)"
        >
          <b-form-input
            v-model="record.email" type="email"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['email']"
            @input.capture="$checkValidity('email', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- ip -->
        <b-form-group
          :label="$t('comment.ip')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
          v-if="Boolean(recordId)"
        >
          <b-form-input
            v-model="record.ip" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['ip']"
            @input.capture="$checkValidity('ip', $event)"
            disabled
          ></b-form-input>
        </b-form-group>

        <!-- userAgent -->
        <b-form-group
          :label="$t('comment.userAgent')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
          v-if="Boolean(recordId)"
        >
          <b-form-input
            v-model="record.userAgent" type="text"
            minlength="2" maxlength="255" required trim
            :placeholder="$t('common.required')"
            :state="$validity['userAgent']"
            @input.capture="$checkValidity('userAgent', $event)"
            disabled
          ></b-form-input>
        </b-form-group>

        <!-- content -->
        <b-form-group
          :label="$t('comment.content')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-textarea
            v-model="record.content" type="text"
            minlength="2" maxlength="255" trim rows="6" no-resize
            :state="$validity['content']"
            @input.capture="$checkValidity('content', $event)"
            :disabled="disabled"
          ></b-form-textarea>
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
      postId: null,
      parentId: null,
      /** 基础部分 */
      fields: [
        { key: 'id', label: this.$t('comment.id') },
        {
          key: 'level',
          label: this.$t('comment.level'),
          formatter: (v) => '#' + v
        },
        { key: 'parentId', label: this.$t('comment.parentId') },
        { key: 'nickname', label: this.$t('comment.nickname') },
        { key: 'email', label: this.$t('comment.email') },
        // { key: 'ip', label: this.$t('comment.ip') },
        // { key: 'userAgent', label: this.$t('comment.userAgent') },
        { key: 'content', label: this.$t('comment.content') },
        {
          key: 'commentedAt',
          label: this.$t('comment.commentedAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'isBlocked',
          label: this.$t('comment.isBlocked'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        { key: 'userId', label: this.$t('comment.userId') },
        {
          key: 'createdAt',
          label: this.$t('comment.createdAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'updatedAt',
          label: this.$t('comment.updatedAt'),
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
        postId: this.postId,
        parentId: this.parentId,
        // nickname: record.nickname,
        // email: record.email,
        content: record.content
      }
    },
    // 获取记录列表
    listRecords (limit, page) {
      return this.$axios.get(`/comments?postId=${this.postId}&limit=${limit}&page=${page}`)
    },
    // 获取记录
    getRecord (id) {
      return this.$axios.get(`/comments/${id}`)
    },
    // 创建记录
    createRecord (record) {
      return this.$axios.post('/comments', this.formatRecord(record))
    },
    // 更新记录
    updateRecord (id, record) {
      return this.$axios.put(`/comments/${id}`, this.formatRecord(record))
    },
    // 删除记录
    deleteRecord (id) {
      return this.$axios.delete(`/comments/${id}`)
    },
    blockComment (id, isBlocked) {
      return this.$axios.put(`/comments/${id}/block`, { isBlocked })
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
      this.parentId = null
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
    block (id, isBlocked) {
      this.blockComment(id, isBlocked).then(res => {
        this.$bvToast.toast(this.$t('common.updateTips'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        this.refreshTable()
      })
    },

    // 初始化数据
    initData () {
      this.postId = parseInt(this.$route.params.id)

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
