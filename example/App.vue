<template>
  <div id="app">
    <el-container>
        <el-header>
            <el-menu
                :default-active="activeIndex"
                mode="horizontal">

                <el-menu-item index="1" v-if="!isLogged" style="float: right;">
                    <el-button @click.prevent="isLogged=true" icon="fa fa-github">
                        {{ $t("button.loginGithub") }}
                    </el-button>
                </el-menu-item>

                <el-menu-item index="1" v-if="isLogged" style="float: right;">
                    <el-dropdown size="mini" split-button @command="actionsUser">
                        <span>{{user.displayName}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="logout">
                                <i class="fa fa-sign-out"></i> {{ $t("button.logout") }}
                            </el-dropdown-item>
                            <el-dropdown-item command="profile">
                                <i class="fa fa-sign-out"></i> {{ $t("button.profile") }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>

                <el-menu-item
                  v-for="(language,index) of languages"
                  :key="index"
                  v-if="language.code!==lang"
                  index="2"
                  style="float: right;">
                    <span
                        @click.prevent="changeLang(language.code)"
                        :disabled="lang===language.code"
                        :title="language.title"
                        :class="language.icon"
                        style="width: 20px; height: 20px">
                    </span>
                </el-menu-item>
            </el-menu>
        </el-header>

        <el-main>
          <div v-loading.fullscreen.lock="pending"
              element-loading-text="Loading..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
          </div>

          <elementui-demo-table
            @deleteItemEvent="eventDeleteItem"
            @reloadItemsEvent="eventReloadItems"
            @changePendingEvent="eventPending"
            @replaceItemEvent="eventReplaceItem"
            @addItemEvent="eventAddItem"
            :rules="rules"
            :options="options"
            :items="items">
          </elementui-demo-table>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementuiDemoTable from '../src/elementui-demo-table/elementui-demo-table.vue'

export default {
  components: {
    ElementuiDemoTable
  },
  data () {
    return {
      activeIndex: '1',
      itemsLimit: 101,
      pending: false,
      isLogged: false,
      user: {
        displayName: 'My Name'
      },
      lang: Vue.config.lang,
      languages: [
        {
          code: 'fr',
          title: 'Français',
          icon: 'flag-icon flag-icon-fr flag-icon-squared'
        },
        {
          code: 'en',
          title: 'US English',
          icon: 'flag-icon flag-icon-us flag-icon-squared'
        },
      ],
      options: {
        buttonColumn: true,
        sortField: 'name',
      },
      rules: {
        name: [
            { required: true, message: 'Required field', trigger: 'blur' },
            { min: 3, max: 255, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        email: [
            { required: true, message: 'Required field', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
        ],
      },
      /*
      columns: [
        {
          name: 'name',
          label: this.$t('column.name')
        },
        {
          name: 'email',
          label: this.$t('column.email')
        },
        {
          name: 'address.country',
          label: this.$t('column.country')
        },
        {
          name: 'enable',
          label: this.$t('column.enable')
        },
        {
          name: 'posts',
          label: this.$t('column.posts'),
          width: '100',
          formatter: function (row, column, cellValue) {
            return row.posts.length
          }
        },
      ],
      */
      items: []
    }
  },
  watch: {
    lang (newVal, oldValue) {
      this.updateLang()
    }
  },
  methods: {
    changeLang (newLang) {
      Vue.config.lang = newLang
      this.lang = Vue.config.lang
    },
    updateLang () {
      this.$i18n.locale = this.lang
      this.$moment.locale(this.lang)
      //FIXME: ElementUI.i18n(langs[newLang])
    },
    logout () {
      this.isLogged = false
    },
    eventPending () {
      this.pending = !this.pending
    },
    eventDeleteItem (row, notify) {
      this.items.splice(this.items.indexOf(row), 1)
      if (notify) {
        this.$message({
          type: 'info',
          message: 'Object deleted.'
        })
      }
    },
    eventAddItem (row) {
      this.items.push(this.currentRowEdit)
      this.$message({
        type: 'info',
        message: 'Object added.'
      })
    },
    eventReplaceItem (row) {
      let newItems = this.items.map((item) => {
        if (item._id === row._id) {
          return row
        }
        return item
      })
      this.items = newItems
    },
    eventReloadItems () {
      this.loadItems()
    },
    actionsUser (command) {
      switch(command) {
        case 'logout':
          this.logout()
          break
        case 'profile':
          //this.displayProfile = !this.displayProfile
          break
      }
    },
    loadItems () {
      this.items = []
      for (var i = 1; i <= this.itemsLimit; i++) {
        let card = faker.helpers.createCard()
        this.items.push({
          _id: faker.random.uuid(),
          enable: faker.random.boolean(),
          avatar: faker.image.avatar(),
          email: card.email,
          name: card.name,
          posts: card.posts,
          address: {
            city: card.address.city,
            country: card.address.country,
            geo: card.address.geo
          }
        })
      }
    }
  },
  created () {
    this.loadItems()
    //this.changeLang('fr')
    this.updateLang()
  }
}
</script>
