<template>
  <div>
    <b-table
      hover bordered responsive class="text-nowrap"
      :fields="fields" :items="rows"
    >
      <template #cell(actions)="row">
        <b-button
          pill size="sm" variant="light"
          @click="disabled = true; recordId = row.item.id; openWriting()"
        >
          <font-awesome-icon icon="pencil-alt" />
          <span v-text="$t('post.write')"></span>
        </b-button>
        <b-button
          pill size="sm" variant="light"
          @click="disabled = true; recordId = row.item.id; openComment()"
        >
          <font-awesome-icon icon="comment" />
          <span v-text="$t('post.comment')"></span>
        </b-button>
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
        <b-form-group :label="$t('post.id')" v-if="recordId !== null">
          <b-form-input v-model="recordId" type="text" disabled></b-form-input>
        </b-form-group>

        <!-- title -->
        <b-form-group
          :label="$t('post.title')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.title" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['title']"
            @input.capture="$checkValidity('title', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- keywords -->
        <b-form-group
          :label="$t('post.keywords')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <!-- <b-form-input
            v-model="record.keywords" type="text"
            minlength="2" maxlength="255" trim
            :state="$validity['keywords']"
            @input.capture="$checkValidity('keywords', $event)"
            :disabled="disabled"
          ></b-form-input> -->
          <b-form-tags
            v-model="extra.keywords"
            separator=" ,;，；" remove-on-delete placeholder=""
            tag-variant="primary" size="sm"
            :state="$validity['keywords']"
            @input.capture="$checkValidity('keywords', $event)"
            :disabled="disabled"
          ></b-form-tags>
        </b-form-group>

        <!-- description -->
        <b-form-group
          :label="$t('post.description')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-form-textarea
            v-model="record.description" type="text"
            minlength="2" maxlength="255" trim rows="3" no-resize
            :state="$validity['description']"
            @input.capture="$checkValidity('description', $event)"
            :disabled="disabled"
          ></b-form-textarea>
        </b-form-group>

        <!-- categoryId -->
        <b-form-group
          :label="$t('post.categoryId')"
        >
          <b-form-select
            v-model="record.categoryId" :options="extra.categories" required
            :disabled="disabled"
          ></b-form-select>
        </b-form-group>

        <!-- cover -->
        <b-form-group
          :label="$t('post.cover')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 255 })"
        >
          <b-input-group>
            <b-form-input
              v-model="record.cover" type="text"
              minlength="2" maxlength="255" trim
              :state="$validity['cover']"
              @input.capture="$checkValidity('cover', $event)"
              :disabled="disabled"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary" @click="openUploader" :disabled="disabled"
              >
                <font-awesome-icon icon="upload" />
                <span v-text="$t('common.upload')"></span>
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-img
            class="mt-3" :src="`${$env.ROOT_URL}${record.cover}`"
            rounded fluid
            v-if="Boolean(record.cover)"
          ></b-img>
        </b-form-group>

        <!-- sourceType -->
        <!-- <b-form-group
          :label="$t('post.sourceType')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.sourceType" type="text"
            minlength="2" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['sourceType']"
            @input.capture="$checkValidity('sourceType', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group> -->

        <!-- route -->
        <b-form-group
          :label="$t('post.route')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
        >
          <b-form-input
            v-model="record.route" type="text"
            minlength="1" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['route']"
            @input.capture="$checkValidity('route', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- isPublished -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isPublished"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('post.isPublished')"></span>
          </b-form-checkbox>
        </b-form-group>

        <!-- isPrivate -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isPrivate"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('post.isPrivate')"></span>
          </b-form-checkbox>
        </b-form-group>

        <!-- password -->
        <b-form-group
          :label="$t('post.password')"
          :invalid-feedback="$t('common.lenFeedback', { min: 2, max: 50 })"
          v-if="Boolean(record.isPrivate)"
        >
          <b-form-input
            v-model="record.password" type="text"
            minlength="1" maxlength="50" required trim
            :placeholder="$t('common.required')"
            :state="$validity['password']"
            @input.capture="$checkValidity('password', $event)"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <!-- isCommentShown -->
        <b-form-group>
          <b-form-checkbox
            v-model="record.isCommentShown"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('post.isCommentShown')"></span>
          </b-form-checkbox>
        </b-form-group>

        <!-- isCommentEnabled -->
        <b-form-group v-if="record.isCommentShown">
          <b-form-checkbox
            v-model="record.isCommentEnabled"
            :value="true" :unchecked-value="false"
            :disabled="disabled"
          >
            <span v-text="$t('post.isCommentEnabled')"></span>
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
        { key: 'id', label: this.$t('post.id') },
        { key: 'title', label: this.$t('post.title') },
        { key: 'user.username', label: this.$t('post.userId') },
        { key: 'category.categoryName', label: this.$t('post.categoryId') },
        { key: 'sourceType', label: this.$t('post.sourceType') },
        // { key: 'route', label: this.$t('post.route') },
        {
          key: 'isPublished',
          label: this.$t('post.isPublished'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'publishedAt',
          label: this.$t('post.publishedAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'isPrivate',
          label: this.$t('post.isPrivate'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'isCommentShown',
          label: this.$t('post.isCommentShown'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'isCommentEnabled',
          label: this.$t('post.isCommentEnabled'),
          formatter: (v) => v ? this.$t('common.yes') : this.$t('common.no')
        },
        {
          key: 'createdAt',
          label: this.$t('post.createdAt'),
          formatter: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          key: 'updatedAt',
          label: this.$t('post.updatedAt'),
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
        categories: [],
        keywords: []
      }
    }
  },
  methods: {
    /** 请求部分 */
    // 格式化记录
    formatRecord (record) {
      return {
        title: record.title,
        keywords: record.keywords,
        description: record.description,
        categoryId: record.categoryId,
        cover: record.cover,
        sourceType: record.sourceType || 'markdown',
        route: record.route,
        isPublished: record.isPublished || false,
        isPrivate: record.isPrivate || false,
        password: record.password,
        isCommentEnabled: record.isCommentEnabled || false,
        isCommentShown: record.isCommentShown || false
      }
    },
    // 获取记录列表
    listRecords (limit, page) {
      return this.$axios.get(`/posts?limit=${limit}&page=${page}`)
    },
    // 获取记录
    getRecord (id) {
      return this.$axios.get(`/posts/${id}`)
    },
    // 创建记录
    createRecord (record) {
      return this.$axios.post('/posts', this.formatRecord(record))
    },
    // 更新记录
    updateRecord (id, record) {
      return this.$axios.put(`/posts/${id}`, this.formatRecord(record))
    },
    // 删除记录
    deleteRecord (id) {
      return this.$axios.delete(`/posts/${id}`)
    },
    // 获取所有分类
    getAllCategories () {
      return this.$axios.get('/categories/all')
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
          this.extra.keywords = res.data.keywords.split(',')
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
      this.$refs.uploader.show('image/*')
    },
    // 上传后
    uploaded (data) {
      this.$set(this.record, 'cover', data.path)
      // 修复this.record.cover发生改变之后this.$validity未相应改变的bug
      this.$set(this.$validity, 'cover', true)
    },
    // 打开写作页
    openWriting () {
      this.$router.push(`/post/${this.recordId}`)
    },
    // 打开评论页
    openComment () {
      this.$router.push(`/post/${this.recordId}/comment`)
    },

    // 初始化数据
    initData () {
      // 加载表格
      this.refreshTable()

      // 加载其他数据
      this.getAllCategories().then(res => {
        this.extra.categories = res.data.map(row => {
          return { value: row.id, text: row.categoryName }
        })
      })
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
    'extra.keywords' (val) {
      this.record.keywords = val.join(',')
    },
    'record.isCommentShown' (val) {
      if (!val) {
        this.record.isCommentEnabled = false
      }
    }
  }
}
</script>
