<template>
  <div class="elf-markdown">
    <div class="elf-markdown__editor">
      <mavon-editor
        ref="editor" :language="$t('locale.mavonEditor')"
        :boxShadow="false" :tabSize="2"
        :toolbars="toolbars" :subfield="subfield"
        :placeholder="placeholder"
        :value="markdown" @change="change"
        @imgAdd="imgAdd" @imgDel="imgDel" @save="$emit('save')"
      ></mavon-editor>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    markdown: String
  },
  data () {
    return {
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        // fullscreen: true, // 全屏编辑
        // readmodel: true, // 沉浸式阅读
        // htmlcode: true, // 展示html源码
        // help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        // trash: true, // 清空
        // save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        // navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        // subfield: true, // 单双栏模式
        preview: true // 预览
      },
      clientWidth: null,
      subfield: true
    }
  },
  methods: {
    change (val) {
      this.$emit('update:markdown', val)
    },
    imgAdd (filename, file) {
      this.$emit('imgAdd', filename, file)
    },
    imgDel (filename) {
      this.$emit('imgDel', filename)
    },
    img2Url (filename, url) {
      this.$refs.editor.$img2Url(filename, url)
    }
  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth
    window.onresize = () => {
      this.clientWidth = document.documentElement.clientWidth
    }

    const defaultRender = this.$refs.editor.markdownIt.renderer.rules.image
    this.$refs.editor.markdownIt.renderer.rules.image = (tokens, idx, options, env, self) => {
      for (let i in tokens) {
        if (tokens[i].type === 'image') {
          for (let j in tokens[i].attrs) {
            if (tokens[i].attrs[j][0] === 'src') {
              if (!(tokens[i].attrs[j][1].startsWith('http://') || tokens[i].attrs[j][1].startsWith('https://'))) {
                tokens[i].attrs[j][1] = this.$env.ROOT_URL + tokens[i].attrs[j][1]
              }
              break
            }
          }
        }
      }
      return defaultRender(tokens, idx, options, env, self)
    }
  },
  beforeRouteLeave (to, from, next) {
    window.onresize = null
    next()
  },
  watch: {
    clientWidth (val) {
      this.subfield = val >= 992

      this.toolbars.bold = this.subfield // 粗体
      this.toolbars.italic = this.subfield // 斜体
      this.toolbars.header = this.subfield // 标题
      this.toolbars.underline = this.subfield // 下划线
      this.toolbars.strikethrough = this.subfield // 中划线
      this.toolbars.mark = this.subfield // 标记
      this.toolbars.superscript = this.subfield // 上角标
      this.toolbars.subscript = this.subfield // 下角标
      this.toolbars.quote = this.subfield // 引用
      this.toolbars.ol = this.subfield // 有序列表
      this.toolbars.ul = this.subfield // 无序列表
      // this.toolbars.link = this.subfield // 链接
      // this.toolbars.imagelink = this.subfield // 图片链接
      // this.toolbars.code = this.subfield // code
      // this.toolbars.table = this.subfield // 表格
      // this.toolbars.undo = this.subfield // 上一步
      // this.toolbars.redo = this.subfield // 下一步
      // this.toolbars.trash = this.subfield // 清空
      // this.toolbars.save = this.subfield // 保存（触发events中的save事件）
      this.toolbars.alignleft = this.subfield // 左对齐
      this.toolbars.aligncenter = this.subfield // 居中
      this.toolbars.alignright = this.subfield // 右对齐
      // this.toolbars.preview = this.subfield// 预览
    }
  }
}
</script>

<style lang="less">
.elf {
  &-markdown {
    &__editor {
      .v-note-wrapper {
        height: calc(100vh - 68px);
        z-index: 1000;
        // mavonEditor css hack
        .op-icon.dropdown-wrapper.dropdown {
          .dropdown-item {
            line-height: 18px !important;
          }
        }
      }
    }
  }
}
</style>
