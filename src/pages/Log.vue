<template>
  <div class="mx-3 elf-log">
    <div class="my-2">
      <b-form-datepicker
        v-model="date"
        :locale="$t('locale.datepicker')"
        :date-disabled-fn="dateDisabled"
        @context="changeContext"
      ></b-form-datepicker>
      <!-- <b-input-group>
        <b-form-datepicker v-model="date" :locale="$t('locale.datepicker')"></b-form-datepicker>
        <b-input-group-append>
          <b-button variant="primary" class="elf-log__go" @click="loadLog">
            <font-awesome-icon icon="arrow-right" />
          </b-button>
        </b-input-group-append>
      </b-input-group> -->
    </div>
    <pre class="elf-log__log" v-html="log"></pre>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      date: '',
      log: '',
      months: [null],
      dates: []
    }
  },
  methods: {
    getDates (month) {
      return this.$axios.get(`/log/dates?month=${month}`)
    },
    getRawLog (date) {
      return this.$axios.get(`/log/raw?date=${date}`)
    },
    dateDisabled (ymd, date) {
      return this.dates.indexOf(ymd) === -1
    },
    async changeContext (context) {
      let date = context.activeDate
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      let months = [dayjs(date).format('YYYY-MM')]
      if (firstDay.getDay() !== 0) {
        months.push(dayjs(firstDay.getTime() - 86400000).format('YYYY-MM'))
      }
      if (lastDay.getDay() !== 6) {
        months.push(dayjs(lastDay.getTime() + 86400000).format('YYYY-MM'))
      }

      // fix bug of infinite loops
      months.sort()
      if (months.length === this.months.length && months[0] === this.months[0]) {
        return
      }

      this.months = months
      this.dates = []
      for (let month of months) {
        let res = await this.getDates(month)
        if (res.data && res.data.dates) {
          this.dates.push(...res.data.dates)
        }
      }
    },
    loadLog () {
      this.getRawLog(this.date).then(res => {
        this.log = res.data
      })
    },
    init () {
      // this.loadLog()
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    date (v) {
      this.loadLog()
    }
  }
}
</script>

<style lang="less">
.elf {
  &-log {
    &__log {
      height: calc(100vh - 138px);
    }
    &__go {
      height: 40px;
    }
  }
}
</style>
