/* * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the NOTICE
file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses this file
to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance with *
the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless required
by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific language
governing permissions and * limitations under the License. */
<template>
  <div class="user-info-model">
    <ListBoxF>
      <template slot="name">{{ $t('User Name') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.userName }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">{{ $t('Email') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.email }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">{{ $t('Phone') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.phone }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">{{ $t('Permission') }}</template>
      <template slot="content">
        <span class="sp1">{{
          userInfo.userType === 'GENERAL_USER' ? `${$t('Ordinary users')}` : `${$t('Administrator')}`
        }}</span>
      </template>
    </ListBoxF>
    <ListBoxF v-ps="['GENERAL_USER']">
      <template slot="name">{{ $t('Tenant') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.tenantCode }}</span>
      </template>
    </ListBoxF>
    <ListBoxF v-ps="['GENERAL_USER']">
      <template slot="name">{{ $t('Queue') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.queueName }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">{{ $t('Create Time') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.createTime | formatDate }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">{{ $t('Update Time') }}</template>
      <template slot="content">
        <span class="sp1">{{ userInfo.updateTime | formatDate }}</span>
      </template>
    </ListBoxF>
    <ListBoxF>
      <template slot="name">&nbsp;</template>
      <template slot="content">
        <el-button type="primary" size="small" round @click="_edit()">{{ $t('Edit') }}</el-button>
        <el-dialog
          :title="item ? $t('Edit User') : $t('Create User')"
          v-if="createUserDialog"
          :visible.sync="createUserDialog"
          width="auto"
        >
          <m-create-user :item="item" @onUpdate="onUpdate" @close="close"></m-create-user>
        </el-dialog>
      </template>
    </ListBoxF>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import ListBoxF from '@/components/listBoxF/ListBoxF'
import mCreateUser from '@/view/security/pages/users/_source/createUser'

export default {
  name: 'user-info',
  data() {
    return {
      createUserDialog: false,
      item: {},
    }
  },
  props: {},
  methods: {
    ...mapMutations('user', ['setUserInfo']),
    /**
     * edit
     */
    _edit() {
      this.item = this.userInfo
      this.createUserDialog = true
    },
    onUpdate(param) {
      this.setUserInfo({
        userName: param.userName,
        userPassword: param.userPassword,
        email: param.email,
        phone: param.phone,
      })
      this.createUserDialog = false
    },

    close() {
      this.createUserDialog = false
    },
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {
    ...mapState('user', ['userInfo']),
  },
  components: { ListBoxF, mCreateUser },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.user-info-model {
  padding-top: 30px;
  .list-box-f {
    .text {
      font-size: 14px;
      color: #888;
    }
    .cont {
      margin-left: 10px;
      .sp1 {
        font-size: 14px;
        color: #333;
        display: inline-block;
        padding-top: 6px;
      }
    }
  }
}
</style>
