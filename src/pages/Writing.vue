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
import ElfMarkdown from '@/components/ElfMarkdown'

export default {
  components: { ElfMarkdown },
  data () {
    return {
      postId: null,
      sourceType: 'markdown',
      source: ''
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
      // this.getAllCategories().then(res => {
      //   this.extra.categories = res.data.map(row => {
      //     return { value: row.id, text: row.categoryName }
      //   })
      // })
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
  }
}
</script>
