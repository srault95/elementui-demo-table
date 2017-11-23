<template lang="html">
<div>
  <!--
  <pre v-if="paginated.data">
    page: {{ paginated.page }}
    offset: {{ paginated.offset }}
    offset_end: {{ paginated.offset_end }}
    per_page: {{ paginated.per_page }}
    total: {{ paginated.total }}
    total_pages: {{ paginated.total_pages }}
    data length: {{ paginated.data.length }}
  </pre>
  -->
  <el-dialog
    v-if="currentRowEdit"
    :visible.sync="centerDialogVisible"
    width="80%"
    @close="cancelDialog"
    center>
    <el-card class="box-card">
      <div slot="header">
          <h3>{{ $t('title.users') }}</h3>
      </div>

      <el-alert
          v-if="dialogErrors && dialogErrors.length > 0"
          title=""
          type="error"
          :description="error"
          show-icon>
          <ul>
              <li v-for="(err,index) in dialogErrors" :key="index">{{err}}</li>
          </ul>
      </el-alert>

      <el-form
          ref="form"
          status-icon
          :model="currentRowEdit"
          :rules="rules"
          size="medium"
          label-width="80px"
          >
          <el-form-item :label="$t('column.enable')" prop="enable">
              <el-switch v-model="currentRowEdit.enable" :disabled="!editMode"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('column.name')" prop="name">
              <el-input size="medium" v-model.trim.lazy="currentRowEdit.name" :disabled="!editMode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('column.email')" prop="email">
              <el-input auto-complete="on" size="medium" v-model.trim.lazy="currentRowEdit.email" :disabled="!editMode"></el-input>
          </el-form-item>
      </el-form>
    </el-card>
    <!--
    // TODO: fullname ou new utilisateur
    <span slot="title" class="dialog-title">
      <h3>{{ $t('title.users') }}</h3>
    </span>
    -->

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click.prevent="onSubmit" round v-if="editMode">
          {{ $t("button.submit") }}
      </el-button>
      <el-button type="danger" size="small" @click.prevent="cancelDialog" round v-if="editMode">
          {{ $t("button.cancel") }}
      </el-button>
      <el-button type="success" size="small" @click.prevent="editItem" round v-if="!editMode">
          {{ $t("button.edit") }}
      </el-button>
      <el-button type="primary" size="small" @click.prevent="cancelDialog" round v-if="!editMode">
          {{ $t("button.close") }}
      </el-button>
    </span>
  </el-dialog>

  <div style="margin-bottom: 20px;">
      <el-dropdown trigger="click" split-button type="primary" @command="actionsTable">
          Actions
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete" :disabled="selection.length == 0">
                  {{ $t('menus.deleteAllSelected') }}
              </el-dropdown-item>
              <el-dropdown-item command="reloadItems" >
                  {{ $t('menus.reloadAllDatas') }}
              </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      <el-button
          type="primary"
          icon="el-icon-edit"
          @click.prevent="createItem">
          {{ $t("button.newUser") }}
      </el-button>
  </div>

  <div class="block" v-if="items">
      <el-pagination
          ref="paginate"
          :page-sizes="[10, 25, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.page"
          :page-size="pagination.perPage"
          :page-count="paginated.total_pages"
          :total="paginated.total">
      </el-pagination>
  </div>

  <el-table
      :data="paginated.data"
      :default-sort = "{prop: options.sortField, order: options.sortOrder}"
      :current-row-key="1"
      @sort-change="sortChange"
      ref="table"
      highlight-current-row
      stripe
      border
      tooltip-effect="dark"
      size="medium"
      max-height="800"
      style="width: 100%"
      class="table"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column
        sortable
        resizable
        prop="name"
        :label="$t('column.name')">
      </el-table-column>
      <el-table-column
        sortable
        resizable
        column-key="email"
        prop="email"
        :label="$t('column.email')">
      </el-table-column>

      <el-table-column
        align="center"
        width="80"
        prop="enable"
        :label="$t('column.enable')"
        :filters="[{ text: 'Actif', value: true }, { text: 'Inactif', value: false }]"
        :filter-method="filterEnable"
        filter-placement="bottom-end"
        >
        <template slot-scope="scope">
            <el-tag hit type="success" size="mini" v-if="scope.row.enable">Actif</el-tag>
            <el-tag hit type="danger" size="mini" v-if="!scope.row.enable">Inactif</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="options.buttonColumn"
          label=""
          fixed="right"
          width="200"
          >
          <template slot-scope="scope">
              <div>
                  <el-button-group>
                      <el-button @click.prevent="detailItem(scope.$index, scope.row)"
                          round type="success" icon="el-icon-view" size="mini" title="Detail">
                      </el-button>
                      <el-button @click.prevent="editItem(scope.$index, scope.row)"
                          round type="primary" icon="el-icon-edit" size="mini" title="Edit">
                      </el-button>
                      <el-button @click.prevent="deleteItem(scope.$index, scope.row)"
                          round type="danger" icon="el-icon-delete" size="mini" title="Delete">
                      </el-button>
                  </el-button-group>
              </div>
          </template>
      </el-table-column>
  </el-table>
</div>
</template>

<script>

/**
 * Composant de démonstration d'une table Element-ui avec CRUD
 */
export default {
  name: 'elementui-demo-table',
  props: {
    /*
    columns: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    */
    rules: {
      type: Object,
      required: true,
      default: function () {
        return {}
      }
    },
    items: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    options: {
      type: Object,
      default: function () {
        return {
          buttonColumn: true,
          sortField: '_id',
          sortOrder: 'descending'
        }
      }
    },
    pagination: {
      type: Object,
      default: function () {
        return {
          perPage: 10,
          page: 1
        }
      }
    }
  },
  data () {
    return {
      currentRowEdit: null,
      editMode: false,
      createMode: false,
      centerDialogVisible: false,
      dialogErrors: [],
      selection: [],
      sortField: '_id',
      sortOrder: 'descending'
    }
  },
  computed: {
    paginated () {
      // FIXME: filter enable
      let per_page = this.pagination.perPage || 10
      let pagination = {
        page: this.pagination.page || 1,
        per_page: per_page,
        offset: 0,
        offset_end: 0,
        total: this.items.length,
        total_pages: 0,
        data: []
      }
      try {
        pagination.offset = (pagination.page - 1) * per_page
        pagination.offset_end = pagination.offset + per_page
        pagination.data = this.items.slice(pagination.offset, pagination.offset_end)
        pagination.total_pages = Math.ceil(this.items.length / per_page)
        return pagination
      }
      catch (e) {
        return pagination
      }
    }
  },
  methods: {
    afterSubmitSuccess () {
      this.error = null
      this.$message({
        type: 'success',
        message: 'Form submited' //TODO: translation
      })
      this.changePending()
      this.cancelDialog()
      // this.loadAllItems()
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        } else {
          // Remonte au parent le soin de remplacer l'entrée modifié
          this.changePending()
          if (this.createMode) {
            this.$emit('addItemEvent', this.currentRowEdit)
          } else {
            this.$emit('replaceItemEvent', this.currentRowEdit)
          }
          this.afterSubmitSuccess()
        }
      })
    },
    createItem () {
      // TODO: replace with vue json-form schema
      let card = faker.helpers.createCard()
      this.currentRowEdit = {
        _id: faker.random.uuid(),
        name: '',
        email: '',
        enable: faker.random.boolean(),
        avatar: faker.image.avatar(),
        posts: card.posts,
        address: {
          city: card.address.city,
          country: card.address.country,
          geo: card.address.geo
        }
      }
      this.editMode = true
      this.createMode = true
      this.centerDialogVisible = true
    },
    detailItem (index, row) {
      this.currentRowEdit = row
      this.editMode = false
      this.centerDialogVisible = true
    },
    editItem (index, row) {
      if (row) {
        this.currentRowEdit = Object.assign({}, row)
      }
      this.editMode = true
      this.centerDialogVisible = true
    },
    deleteItem (index, row) {
      this.$confirm(this.$t("dialog.deleteConfirm"), 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel', // TODO: translation
        type: 'warning'
      }).then(() => {
        this.$emit('deleteItemEvent', row, true)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    changePending () {
      this.$emit('changePendingEvent')
    },
    actionsTable (command) {
      if (command === 'reloadItems') {
        this.$emit('reloadItemsEvent')
        return
      }
      if (command === 'delete') {
        this.$confirm(this.$t("dialog.deleteConfirmMultiple", {count: this.selection.length}), 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .then(() => {
          this.selection.forEach((item, index, array) => {
            this.$emit('deleteItemEvent', item, false)
          })
          this.$message({
            type: 'info',
            message: `${this.selection.length} objects deleted.` //TODO: translation
          })
        })
        .catch((error) => {
          // error = 'cancel'
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })
      }
    },
    filterEnable(value, row) {
      /* Filtre interractif sur la colonne enable */
      return row.enable === value
    },
    cancelDialog () {
      this.currentRowEdit = null
      this.editMode = false
      this.createMode = false
      this.centerDialogVisible = false
    },
    sortChange ({column, prop, order}) {
      this.options.sortField = prop
      this.options.sortOrder = order
    },
    handleSizeChange (val) {
      this.pagination.perPage = val
    },
    handleCurrentChange (val) {
      this.pagination.page = val
    },
    handleSelectionChange (val) {
      this.selection = val
    }
  }
}
</script>

<style scoped>
/* Remplacement des icônes par défaut pour le tri des colonnes du tableau */
.el-icon-sort-down:before {
    /*content: "\e630"; */
    content: "\e60b"; /* .el-icon-caret-bottom:before */
}

.el-icon-sort-up:before {
    /*content: "\e631";*/
    content: "\e60c"; /* .el-icon-caret-top:before */
}

#panel-table .el-card__body {
    padding: 0px;
}
</style>
