<template>
  <div class="delegate-pool-modal position-relative">
    <i class="modal-back-icon" @click="$emit('back')"></i>
    <div class="delegate-pool-modal-content d-flex flex-column">
      <div class="mt-4 mb-4 modal-title">Create {{delegateType}} delegate pool</div>
      <div class="custom-form col-lg-8 mx-auto mt-5">
        <div class="mb-2 font14">Your {{delegateType}} delegatee account</div>
        <div class="c-input-group c-input-group-bg-dark c-input-group-border">
          <b-input-group class="d-flex flex-between-center">
            <b-input :placeholder="$t('placeHolder.inputDelegatee')" class="flex-full" v-model.trim="delegatee"></b-input>
          </b-input-group>
        </div>
        <div class="col-md-6 mx-auto mt-5">
          <button class="primary-btn" @click="$emit('confirm', delegatee)">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StakingDelegatePool',
  props: {
    delegateType: String
  },
  data() {
    return {
      delegatee: ''
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.delegate-pool-modal-content {
  min-height: 60vh;
}
</style>
