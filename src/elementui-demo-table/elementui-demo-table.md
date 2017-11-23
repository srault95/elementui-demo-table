## example/index.js

```js
import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import lang_fr from "element-ui/lib/locale/lang/fr";
import lang_en from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import VueI18n from "vue-i18n";
import moment from "moment";
import "moment/locale/fr";
const lodash = require("lodash");

Object.defineProperty(Vue.prototype, "$moment", { value: moment });
Object.defineProperty(Vue.prototype, "$lodash", { value: lodash });

Vue.filter("formatDate", (value, format) => {
  return moment(value).format(format || "YYYY.MM.DD"); //  hh:mm:ss
});

Vue.config.lang = "fr";

const messages = {
  en: {
    title: {
      users: "Users",
      messaging: "Messaging",
      settings: "Settings"
    },
    menus: {
      deleteAllSelected: "Delete all selected documents",
      reloadAllDatas: "Reload all datas"
    },
    button: {
      cancel: "Cancel",
      close: "Close",
      edit: "Edit",
      newUser: "New Entry",
      submit: "Submit",
      loginGithub: "SignIn",
      logout: "SignOut",
      unlink: "Unlink Provider",
      profile: "Profile",
      confirmDelete: "Confirm",
      reconnect: "Reconnect",
      disconnect: "Disconnect"
    },
    column: {
      name: "FullName",
      email: "Email",
      country: "Country",
      posts: "Posts",
      created: "Created",
      enable: "Enable"
    },
    dialog: {
      deleteConfirm: "This will delete. Continue ?",
      deleteConfirmMultiple: "This will delete {count} document(s). Continue ?"
    }
  },
  fr: {
    title: {
      users: "Utilisateurs",
      messaging: "Messagerie",
      settings: "Configuration"
    },
    menus: {
      deleteAllSelected: "Supprimer les documents sélectionnés",
      reloadAllDatas: "Recharger les données"
    },
    button: {
      cancel: "Annuler",
      close: "Fermer",
      edit: "Editer",
      newUser: "Nouvelle Entrée",
      submit: "Enregistrer",
      loginGithub: "Login",
      logout: "Logout",
      unlink: "Unlink Provider",
      profile: "Profil",
      confirmDelete: "Confirmer",
      reconnect: "Se reconnecter",
      disconnect: "Se déconnecter"
    },
    column: {
      name: "Nom",
      email: "Email",
      country: "Pays",
      created: "Créé le",
      posts: "Posts",
      enable: "Actif"
    },
    dialog: {
      deleteConfirm: "Confirmez-vous la suppression ?",
      deleteConfirmMultiple:
        "Confirmez-vous la suppression de {count} document(s) ?"
    }
  }
};

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: Vue.config.lang,
  fallbackLocale: "en",
  messages
});

Vue.use(ElementUI, { locale: lang_fr });

vue = new Vue({
  el: "#app",
  i18n,
  render: h => h(App)
});
```

## example/App.vue

```html
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
                :rules="rules"
                :options="options"
                :items="items">
            </elementui-demo-table>
            </el-main>
        </el-container>
    </div>
    </template>
```

```js
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
        eventReplaceItem (row) {
        let newItems = this.$lodash.map(this.items, (item) => {
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
        this.updateLang()
    }
    }
    </script>
```

## index.ejs
