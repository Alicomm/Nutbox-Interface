<template>
  <div class="asset-detail-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="asset-detail-modal-content d-flex flex-column overflow-hidden">
      <div class="text-center modal-title">Your Asset Detail</div>
      <div class="h-line mt-2"></div>
      <div class="d-flex justify-content-between align-items-center my-4">
        <span>Total Asset Value</span>
        <span>{{totalValue | formatPrice}}</span>
      </div>
      <div class="asset-list flex-fill overflow-auto">
        <b-table :fields="fields" :items="tokens"
                 thead-tr-class="asset-tr text-grey-7"
                 tbody-tr-class="asset-tr tr-hover-dark-bg"
                 details-td-class="p-0"
                 class="text-white border-0 font12" borderless>
          <template #table-colgroup="scope">
            <col v-for="field in scope.fields" :key="field.key"
                 :style="{ width: field.key === 'icon' ? '1.6rem' : '' }">
          </template>
          <template #cell(balance)="row">
            <span>
              {{row.item.balance | amountForm}}
            </span>
          </template>
           <template #cell(value)="row">
            <span>
              {{row.item.balance * row.item.price | formatPrice}}
            </span>
          </template>
          <template #cell(icon)="row">
            <img v-if="row.item.icon"
                 style="width:1.6rem;height: 1.6rem"
                 :src="row.item.icon || './default.png'" alt="">
            <empty-img v-else width="1.6rem" height="1.6rem" class="rounded-circle"></empty-img>
          </template>
          <template #cell(actions)="row">
            <button @click="addToWallet(row.item)" class="symbol-btn symbol-btn-24 symbol-btn-outline mx-auto asset-add-btn">
              <i class="add-icon add-icon-primary"></i>
            </button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { addAssetToWallet } from '@/utils/web3/web3'
export default {
  name: 'AssetDetailModal',
  props: {
    totalValue: {
      type: Number,
      default: 0
    },
    tokens: {
      type: Array,
      default: () => {
        return [
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
        ]
      }
    }
  },
  data () {
    return {
      fields: [
        { key: 'icon', label: '' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'balance', label: 'Balance', class: 'text-center' },
        { key: 'value', label: 'Value', class: 'text-right' },
        { key: 'actions', label: 'Add to wallet', class: 'w-60px' }
      ]
    }
  },
  methods: {
    async addToWallet(item) {
      console.log(item);
      await addAssetToWallet(item.address, item.symbol, item.decimal, item.icon)
    }
  },
}
</script>

<style scoped lang="scss">
.asset-detail-modal-content {
  max-height: 80vh;
}
.asset-tr td{
  vertical-align: middle;
}
</style>
