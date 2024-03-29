<template>
  <div class="profile-page">
    <div class="scroll-content">
      <div class="container">
        <div class="row">
          <!-- header -->
          <div class="col-md-5 mb-3 mb-md-0 text-left d-flex flex-column justify-content-center">
            <img v-if="user.avatar" @click="avatarModalVisible=true" class="user-avatar hover rounded-circle"
                 :src="user.avatar" alt="">
            <img v-else @click="avatarModalVisible=true" class="user-avatar hover rounded-circle"
                 src="~@/static/images/avatars/default.png" alt="">
            <div class="d-flex align-items-center mt-3">
              <b-input class="text-white name-input text-center"
                       :class="isEditName?'edit':''"
                       :disabled="!isEditName"
                       placeholder="Input name"
                       v-model="user.name"></b-input>
              <i v-if="!isEditName" class="edit-icon hover" @click="isEditName=true"></i>
              <span class="hover" v-else @click="updateUser">Save</span>
            </div>
          </div>
          <!-- token list -->
          <div class="col-md-7">
            <div class="asset-card">
              <div class="row h-100">
                <div class="col-sm-6 d-flex user-asset justify-content-between">
                  <div class="mb-3 font20 line-height28 font-bold">
                    <div class="">Total Asset Value</div>
                    <div class="mt-2">{{ totalValue | formatPrice }}</div>
                  </div>
                  <button class="primary-btn mb-2 px-4 mx-0" @click="assetModalVisible=true">Detail</button>
                </div>
                <div class="col-sm-6 position-relative">
                  <PoolRatio class="asset-chart"
                             :pools-data="chartToken"
                             :animation="false"
                             :show-data-label="true"
                             :show-legend-info="false"/>
                </div>
              </div>
              <div class="c-loading c-loading-bg c-loading-absolute" v-if="loadingBalance"></div>
            </div>
          </div>
        </div>
        <!-- community -->
        <div class="font-bold mt-5 mb-3 font20 line-height32">Joined Communities</div>
        <div class="row" v-if="joinedCommunity && joinedCommunity.length > 0">
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="(community, index) of joinedCommunity" :key="index">
            <CommunityCard :card-info="community"/>
          </div>
        </div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('community.noJoinedCommunity') }} </p>
          <router-link to="/community" style="text-decoration: none;">
            <button class="primary-btn w-auto px-4">
              {{ $t('community.exploreCommunity') }}
            </button>
          </router-link>
        </div>
        <div class="c-loading" v-show="loadingCommunity"></div>
        <!-- pools -->
        <div class="font-bold mt-4 mb-3 font20 line-height32">Staked Pools</div>
          <StakedPools class="mb-3"/>
        </div>
    </div>
    <!-- token list -->
    <b-modal
      v-model="assetModalVisible"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <AssetDetailModal :tokens="balances" :totalValue="totalValue" @close="assetModalVisible=false"/>
    </b-modal>
    <!-- avatat modal -->
    <b-modal
      v-model="avatarModalVisible"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <AvatarOptionsModal @close="closeAvatar"/>
    </b-modal>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'
import StakedPools from '@/components/profile/StakedPools'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import CommunityCard from '@/components/community/CommunityCard'
import { getUserBaseInfo, updateUserInfo } from '@/utils/web3/account'
import { mapState, mapGetters } from 'vuex'
import AssetDetailModal from '@/components/profile/AssetDetailModal'
import AvatarOptionsModal from '@/components/profile/AvatarOptionsModal';
import { getCtokenBalance } from '@/utils/web3/asset'
import { rollingFunction } from '@/utils/helper'

export default {
  name: 'Profile',
  components: { PoolRatio, StakedPools, CommunityCard, AssetDetailModal, AvatarOptionsModal },
  data () {
    return {
      user:{},
      userName: 'AAA',
      isEditName: false,
      assetModalVisible: false,
      avatarModalVisible: false,
      loadingBalance: true,
      loadingCommunity: true,
      balances: [],
      chartToken: []
    }
  },
  computed: {
    ...mapState('web3', ['account', 'allTokens']),
    ...mapState('user', ['userGraphInfo']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapGetters('web3', ['tokenByKey']),
    joinedCommunity() {
      if (!this.userGraphInfo || !this.userGraphInfo.inCommunities) return [];
      if (!this.allCommunityInfo || this.allCommunityInfo.length === 0) return [];
      let communities = []
      for (let i = 0; i < this.userGraphInfo.inCommunities.length; i++) {
        const community = this.userGraphInfo.inCommunities[i]
        if (this.allCommunityInfo[community.id]){
          communities.push({
            ...community,
            ...this.allCommunityInfo[community.id]
          })
        }
      }
      return communities
    },
    totalValue() {
      if (!this.balances) return 0;
      let value = 0;
      for (let i = 0; i < this.balances.length; i++){
        const t = this.balances[i]
        if (t.balance == 0 || t.price == 0 || !t.price){
          continue;
        }
        value += t.balance * t.price
      }
      return value
    }
  },
  methods: {
    async updateUser () {
      console.log(this.user);
      try {
        await updateUserInfo(this.user);
        this.$bvToast.toast(this.$t('tip.success'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e) {
        console.log(e)
      }finally{
        this.isEditName = false;
      }
    },
    closeAvatar (avatar) {
      if (avatar) {
        this.user.avatar = avatar
      }
      this.avatarModalVisible=false
    }
  },
  async mounted () {
    getUserBaseInfo(this.account).then(user => {
      console.log('get my user info', user);
      if (user) {
        this.user = user
      }
    }).catch(err => {
      console.log('get my user info fail:', err)
    })
    getMyJoinedCommunity().then(res => this.loadingCommunity = false);
    const interval = rollingFunction(getCtokenBalance, null, 3, res => {
      if(!this.allTokens) return;
      let ctokens = []
      Object.keys(res).forEach(address => {
        const token = this.tokenByKey(address)
        if (token){
          ctokens.push({
            ...token,
            balance: res[address]
          })
        }
      })
      this.balances = ctokens.sort((a, b) => b.balance - a.balance)
      let tem = this.balances.filter(t => t.balance > 0)
      const sum = tem.reduce((a, b) => a + b.balance, 0) / 100
      tem = tem.map(t => ({
        name: t.symbol,
        ratio: t.balance / sum
      }))
      if (tem.length === this.chartToken.length){
        for(let i = 0; i < tem.length; i++) {
          const t1 = tem[i]
          const t2 = this.chartToken[i]
          if (t1.name != t2.name || t1.ratio != t2.ratio){
            this.chartToken = tem
            break;
          }
        }
      }else{
        this.chartToken = tem
      }
      this.loadingBalance = false
    })
    interval.start();
    this.$once('hook:beforeDestroy', () => {
      interval.stop();
    })
  },
}
</script>

<style scoped lang="scss">
.profile-page {
  overflow: hidden;
  height: 100%;
}
.user-avatar {
  width: 6rem;
  height: 6rem;
  &:hover {
    box-shadow: 0 0 8px 2px var(--primary-custom);
  }
}
.name-input {
  width: 8rem;
  border-color: transparent;
  border-radius: .8rem;
  background-color: var(--nav-tab-bg);
  &.edit {
    border-bottom: 1px solid var(--dividers);
  }
}
.edit-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/edit-icon.svg");
}
.asset-card {
  @include card();
  height: 12rem;
  .asset-chart {
    position: absolute;
    width: 100%;
    max-width: 14rem;
    top: -2rem;
    right: 1.2rem;
  }
  .user-asset {
    flex-direction: column;
    .primary-btn {
      width: fit-content;
    }
  }
}
@media (max-width: 576px) {
  .asset-card {
    height: 24rem;
    .asset-chart {
      position: relative;
      margin: auto;
      top: 0;
      right: 0;
      width: 16rem;
    }
    .user-asset {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}
@media (min-width: 577px) and (max-width: 991px) {
  .asset-card {
    height: 11rem;
  }
}
</style>
