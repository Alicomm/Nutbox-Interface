<template>
  <div class="scroll-content">
    <div class="c-card">
      <div class="custom-form text-left col-md-9">
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon twitter">Twitter</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.twitter" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon discord">Discord</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.discord" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon telegram">Telegram</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.telegram" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon facebook">Facebook</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.facebook" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon github">Github</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.github" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon document">{{ $t('commen.docs') }}</div>
            <div class="c-input-group c-input-group-bg">
              <b-form-input v-model="socialForm.document" :placeholder="$t('commen.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="0" content-cols-md="12" label="">
          <div class="text-center mt-4">
            <button class="primary-btn col-md-6" @click="checkInput() && (showSignatureTip = true)">
              {{ $t("operation.update") }}
            </button>
          </div>
        </b-form-group>
      </div>
    </div>
    <b-modal
      v-model="showSignatureTip"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="position-relative">
        <i class="modal-close-icon-right" @click="showSignatureTip=false"></i>
        <div class="pt-5 font20 line-height28 mb-3">
          {{ $t("tip.editTip") }}
        </div>
        <div class="d-flex justify-content-between" style="gap: 2rem">
          <button
            class="dark-btn"
            @click="showSignatureTip = false"
            :disabled="uploading"
          >
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn" @click="onConfirm" :disabled="uploading">
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("operation.sign") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMyCommunityInfo, udpateSocialInfo } from '@/utils/web3/community'
import Login from '@/components/common/Login'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: 'SocialSetting',
  data () {
    return {
      showSignatureTip: false,
      uploading: false,
      newBlogTag: '',
      state: '',
      socialForm: {
        twitter: '',
        discord: '',
        telegram: '',
        facebook: '',
        github: '',
        document: ''
      }
    }
  },
  components: {
    Login,
  },
  computed: {
    ...mapState("web3", ["communityBalance", "userBalances", "ctokenApprovement", "devAddress", "devRatio"]),
    ...mapState("steem", ['steemAccount']),
    ...mapState('community', ['communityInfo']),
  },
  watch: {
    steemAccount(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.state = 'create'
      }
    }
  },
  methods: {
    checkInput() {
        if (this.socialForm.github && this.socialForm.github.indexOf('https://github.com') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'Github'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.socialForm.discord && this.socialForm.discord.indexOf('https://discord') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'Discord'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.socialForm.telegram && this.socialForm.telegram.indexOf('https://t.me') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'Telegram'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.socialForm.facebook && this.socialForm.facebook.indexOf('https://facebook.com') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'Facebook'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.socialForm.twitter && this.socialForm.twitter.indexOf('https://twitter.com') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'Twitter'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.socialForm.document && this.socialForm.document.indexOf('https://') === -1){
          this.$bvToast.toast(this.$t('tip.wrongSocialInfo', {type:'document'}), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        return true
    },
    async onConfirm() {
      try{
        this.uploading = true
        const res = await udpateSocialInfo(this.socialForm)
        this.$bvToast.toast(this.$t('tip.updateSocialSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        await getMyCommunityInfo(true)
        this.fixNullOfSocial()
        this.showSignatureTip = false
      }catch(e){
        handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      }finally{
        this.uploading = false
      }
    },
    fixNullOfSocial(){
      this.socialForm = {...this.communityInfo}
      if (!this.socialForm) return;
      for (let key of Object.keys(this.socialForm)){
        if(this.socialForm[key] === 'null' || this.socialForm[key] === 'undefined'){
          this.socialForm[key] = null
        }
      }
    }
  },
  async mounted () {
    getMyCommunityInfo().then().catch();
    this.fixNullOfSocial()
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem, var(--card-bg-primary), hidden, fit-content);
}
.link-info-icon {
  padding-left: 2rem;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 1.6rem 1.6rem;
  width: 6.8rem;
  font-size: .8rem;
  font-weight: bold;
  height: 2rem;
  line-height: 2rem;
}
.twitter {
  background-image: url("~@/static/images/twitter-icon.svg");
}
.medium {
  background-image: url("~@/static/images/medium-icon.svg");
}
.discord {
  background-image: url("~@/static/images/Discord.svg");
}
.telegram {
  background-image: url("~@/static/images/telegram.svg");
}
.github {
  background-image: url("~@/static/images/GitHub.svg");
}
.document {
  background-image: url("~@/static/images/docs.svg");
}
.audition {
  background-image: url("~@/static/images/GitHub.svg");
}
.facebook {
  background-image: url("~@/static/images/facebook.png")
}
</style>
