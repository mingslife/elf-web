<template>
  <b-modal
    ref="uploadModal"
    :ok-title="$t('common.ok')" :cancel-title="$t('common.cancel')"
    @hidden="reset" @ok="upload"
    no-close-on-backdrop
    :busy="busy" scrollable
  >
    <template #modal-title>
      <div>
        <font-awesome-icon icon="upload" />
        <span v-text="$t('uploader.upload')"></span>
      </div>
    </template>
    <b-form-file
      v-model="file" :accept="accept"
      :state="Boolean(file)"
      :browse-text="$t('uploader.browse')"
      :placeholder="$t('uploader.placeholder')"
      :drop-placeholder="$t('uploader.dropPlaceholder')"
      v-show="!busy"
    ></b-form-file>
    <b-progress :value="value" :max="max" v-show="busy"></b-progress>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      file: null,
      accept: '',
      busy: false,
      value: 0,
      max: 100,
      options: {}
    }
  },
  methods: {
    show (accept, options) {
      this.accept = accept || ''
      this.url = this.accept.startsWith('image/') ? '/upload/image' : '/upload/file'
      this.options = options || {}
      this.$refs.uploadModal.show()
    },
    hide () {
      this.$refs.uploadModal.hide()
    },
    reset () {
      this.file = null
      this.accept = ''
      this.busy = false
    },
    upload (e) {
      e.preventDefault()
      this.busy = true

      let formData = new FormData()
      formData.append('file', this.file)
      for (let k in this.options) {
        formData.append(k, this.options[k])
      }
      this.$axios({
        url: this.url,
        method: 'post',
        data: formData,
        onUploadProgress: e => {
          if (e.loaded) this.value = e.loaded
          if (e.total) this.max = e.total
        }
      }).then(res => {
        this.$bvToast.toast(this.$t('uploader.uploadTips'), {
          variant: 'success', autoHideDelay: 3000, solid: true
        })
        this.busy = false
        this.$emit('uploaded', res.data)
        this.hide()
      })
    }
  }
}
</script>
