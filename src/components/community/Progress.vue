<template>
  <div class="c-progress" :class="(progressData && progressData.length>0) ? 'mt-5' : 'mt-3'">
    <span class="progress-num-min text-grey-7" v-b-tooltip.hover :title="min">{{formatNum(min)}}</span>
    <span class="progress-num-max text-grey-7" v-b-tooltip.hover :title="max">{{formatNum(max)}}</span>
    <span v-if="blockNum && blockPosition > 0 && blockPosition < 1"
          class="current-block text-grey-7" v-show="(progressData && progressData.length > 0) && blockNum>progressData[0].startHeight"
          :style="{left: `${(blockPosition)*100}%`}">{{blockNum}}</span>
    <div class="c-progress-container" :style="{background: trackColor}">
      <div class="c-progress-bar" v-for="(data, index) of (progressData ? progressData : [])" :key="index"
           :style="{ flex: 1,  background: data.background || `rgba(255, 149, 0, ${(index+1) / progressData.length})`}" >
        <span class="progress-tooltip"
              :style="{color: (blockNum >= data.startHeight && blockNum < data.stopHeight) ? '#FF5000' : '#50BF00'}">
          {{data.amount}}</span>
        <span class="progress-num"  v-b-tooltip.hover :title="data.stopHeight"
              v-if="index<progressData.length-1">{{formatNum(data.stopHeight)}}</span>
      </div>
    </div>
    <i v-if="isEdit" class="delete-icon" @click="$emit('delete')"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MaxBlockNum } from '@/constant'

export default {
  name: 'Progress',
  props: {
    trackColor: {
      type: String,
      default: 'transparent'
    },
    progressData: {
      type: Array,
      default: []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('web3', ['blockNum']),
    min () {
      if (!this.progressData || this.progressData.length === 0) return 0
      return this.progressData[0].startHeight
    },
    max () {
      if (!this.progressData || this.progressData.length === 0 || this.progressData[this.progressData.length - 1].stopHeight >= MaxBlockNum) return this.$t('commen.max')
      return this.progressData[this.progressData.length - 1].stopHeight
    },
    blockPosition () {
      if (!this.progressData || this.progressData.length === 0) {
        return
      }
      let block = this.blockNum
      let index = 0
      for (let i = 0; i < this.progressData.length; i++) {
        const p = this.progressData[i]
        if (block > parseInt(p.startHeight) && block < parseInt(p.stopHeight)) {
          index = i
          break
        }
      }
      const totalField = this.progressData.length
      let position = index / parseFloat(totalField)
      position = position + parseFloat(block - this.progressData[index].startHeight) / parseFloat(this.progressData[index].stopHeight - this.progressData[index].startHeight) / totalField
      return position
    }
  },
  methods: {
    formatNum (num) {
      if (!this.isNumeric(num)) return 'Max'
      num = parseFloat(num).toFixed(2)
      if (num < 1e5) {
        return num
      }
      if (num < 1e6) {
        return `${(parseFloat(num) / 1e3).toFixed(2)}K`
      }
      if (num < 1e9) {
        return `${(parseFloat(num) / 1e6).toFixed(2)}M`
      }
      return `${(parseFloat(num) / 1e9).toFixed(2)}G`
    },
    isNumeric (val) {
      return val !== null && val !== '' && !isNaN(val)
    }
  }
}
</script>

<style scoped lang="scss">
.c-progress {
  position: relative;
  margin-bottom: 1.5rem;
}
.c-progress-container {
  @include c-flex-between-center;
  height: 1.2rem;
  border-radius: 1rem;
  border: 1px solid var(--card-broder);
  position: relative;
  .c-progress-bar {
    height: 100%;
    position: relative;
    border-right: 2px solid transparent;
  }
  .c-progress-bar:nth-of-type(1) {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  .c-progress-bar:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border: none;
  }
}
.progress-tooltip {
  position: absolute;
  top: -2.4rem;
  left: 20%;
  transform: translateX(-50%);
  background: var(--block-bg);
  font-size: .6rem;
  line-height: .8rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px 4px rgba(0, 0, 0, 0.05);
  padding: .4rem .8rem;
  min-width: 2rem;
  text-align: center;
  &::before {
    content: '';
    bottom: -.4rem;
    border-width: .4rem .5rem 0;
    border-top-color: var(--block-bg);
    position: absolute;
    border-style: solid;
    left: 20%;
    color: transparent;
  }
}
.current-block {
  position: absolute;
  top: 2.2rem;
  font-size: .6rem;
  line-height: .6rem;
  transform: translateX(-50%);
  &::before {
    display: block;
    content: '';
    width: 10px;
    height: 6px;
    background-color: #FF5000;
    clip-path: polygon(0 100%, 50% 0, 100% 100%);
    margin: .3rem auto;
  }
}
.progress-num-min, .progress-num-max, .progress-num {
  cursor: default;
  font-size: .6rem;
  line-height: .6rem;
  opacity: .6;
}
.progress-num-min {
  position: absolute;
  top: 1.8rem;
  left: 0;
}
.progress-num-max {
  position: absolute;
  top: 1.8rem;
  right: 0;
}
.progress-num {
  position: absolute;
  top: 1.2rem;
  right: 0;
  transform: translateX(50%);
}
.delete-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/circle-close.png");
  position: absolute;
  right: -.4rem;
  top: -.8rem;
}
</style>
