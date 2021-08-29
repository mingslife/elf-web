<template>
  <div class="elf-writing">
    <elf-markdown
      ref="markdownEditor"
      :placeholder="$t('writing.editorPlaceholder')"
      :markdown.sync="source"
      @imgAdd="imgAdd" @imgDel="imgDel" @save="save"
    ></elf-markdown>
  </div>
</template>

<script>
import _ from 'lodash'

import ElfMarkdown from '@/components/ElfMarkdown'

export default {
  components: { ElfMarkdown },
  data () {
    return {
      postId: null,
      sourceType: 'markdown',
      source: '',
      contentReady: false,
      autoSaveDuration: 0,
      autoSaveTimer: null
    }
  },
  methods: {
    getInfo () {},
    updateInfo () {},
    getContent (id) {
      return this.$axios.get(`/posts/${id}/content`)
    },
    updateContent (id, source) {
      return this.$axios.put(`/posts/${id}/content`, { source })
    },

    refreshData () {
      this.getContent(this.postId).then(res => {
        this.sourceType = res.data.sourceType
        this.source = res.data.source
        this.$nextTick(() => {
          this.contentReady = true
        })
      })
    },
    imgAdd (filename, file) {
      let formData = new FormData()
      formData.append('file', file)
      // formData.append('compress', false)
      this.$axios({
        url: '/upload/image',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        this.$refs.markdownEditor.img2Url(filename, res.data.path)
      })
    },
    imgDel (filename) {
    },
    save () {
      this.updateContent(this.postId, this.source).then(res => {
        this.$bvToast.toast(this.$t('writing.saveTips'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        // this.refreshData()
      })
    },
    // 初始化数据
    initData () {
      this.postId = parseInt(this.$route.params.id)

      // 加载数据
      this.refreshData()

      // 加载其他数据
      if ('app.autoSave' in this.$parent.$settings) {
        this.autoSaveDuration = parseInt(this.$parent.$settings['app.autoSave'])
      }
    }
  },
  mounted () {
    this.$parent.setMenu([{
      icon: 'save',
      text: this.$t('writing.save'),
      action: (() => {
        return () => {
          this.save()
        }
      })()
    }])

    this.initData()
  },
  watch: {
    // 触发自动保存
    source () {
      if (!this.contentReady) {
        return
      }

      if (this.autoSaveDuration > 0) {
        if (this.autoSaveTimer) {
          this.autoSaveTimer()
          return
        }
        // 防抖
        this.autoSaveTimer = _.debounce(() => {
          this.save()
        }, this.autoSaveDuration)
        this.autoSaveTimer()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.autoSaveTimer) {
      this.autoSaveTimer.cancel()
    }
    next()
  }
}
</script>
