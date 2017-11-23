import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang_fr from 'element-ui/lib/locale/lang/fr'
import lang_en from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import 'moment/locale/fr'

Object.defineProperty(Vue.prototype, '$moment', { value: moment })

Vue.filter('formatDate', (value, format) => {
  return moment(value).format(format || 'YYYY.MM.DD') //  hh:mm:ss
})

Vue.config.lang = 'fr'

const messages = {
  en: {
    title: {
      users: 'Users',
      messaging: 'Messaging',
      settings: 'Settings'
    },
    menus: {
      deleteAllSelected: 'Delete all selected documents',
      reloadAllDatas: 'Reload all datas'
    },
    button: {
      cancel: 'Cancel',
      close: 'Close',
      edit: 'Edit',
      newUser: 'New Entry',
      submit: 'Submit',
      loginGithub: 'SignIn',
      logout: 'SignOut',
      unlink: 'Unlink Provider',
      profile: 'Profile',
      confirmDelete: 'Confirm',
      reconnect: 'Reconnect',
      disconnect: 'Disconnect',
    },
    column: {
      name: 'FullName',
      email: 'Email',
      country: 'Country',
      posts: 'Posts',
      created: 'Created',
      enable: 'Enable',
    },
    dialog: {
      deleteConfirm: 'This will delete. Continue ?',
      deleteConfirmMultiple: 'This will delete {count} document(s). Continue ?',
    },
  },
  fr: {
    title: {
      users: 'Utilisateurs',
      messaging: 'Messagerie',
      settings: 'Configuration'
    },
    menus: {
      deleteAllSelected: 'Supprimer les documents sélectionnés',
      reloadAllDatas: 'Recharger les données'
    },
    button: {
      cancel: 'Annuler',
      close: 'Fermer',
      edit: 'Editer',
      newUser: 'Nouvelle Entrée',
      submit: 'Enregistrer',
      loginGithub: 'Login',
      logout: 'Logout',
      unlink: 'Unlink Provider',
      profile: 'Profil',
      confirmDelete: 'Confirmer',
      reconnect: 'Se reconnecter',
      disconnect: 'Se déconnecter',
    },
    column: {
      name: 'Nom',
      email: 'Email',
      country: 'Pays',
      created: 'Créé le',
      posts: 'Posts',
      enable: 'Actif',
    },
    dialog: {
      deleteConfirm: 'Confirmez-vous la suppression ?',
      deleteConfirmMultiple: 'Confirmez-vous la suppression de {count} document(s) ?',
    },
  }
}

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: Vue.config.lang,
  fallbackLocale: 'en',
  messages
})

Vue.use(ElementUI, { locale: lang_fr })

/*
Vue.use(ElementUI, {
  locale: lang_fr,
  i18n: (key, value) => i18n.t(key, value)
})
locale.use(lang_fr)
*/

new Vue({
  el: '#app',
  i18n,
  render: h => h(App)
})
