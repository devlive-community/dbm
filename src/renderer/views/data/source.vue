<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" @click="dialogFormVisible = true">
        <font-awesome-icon :icon="['fa', 'plus']"></font-awesome-icon> Add New
      </el-button>
    </el-row>
    <el-table
      :data="tableDatas"
      style="width: 100%">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="host" label="Host"></el-table-column>
      <el-table-column prop="port" label="Port"></el-table-column>
      <el-table-column
        fixed="right"
        label="Action"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handlerEdit(scope.row)">Edit</el-button>
          <el-button type="text" size="small" @click="handlerDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <!-- DataSource Dialog -->
    <el-dialog title="Add New DataSource" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Alias Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Host" :label-width="formLabelWidth">
          <el-input v-model="form.host" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Port" :label-width="formLabelWidth">
          <el-input v-model="form.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="User Name" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="User Password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" size="mini" @click="handlerSave()">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableDatas: [],
      listLoading: true,
      dialogFormVisible: false,
      form: {
        name: '',
        host: '',
        port: '',
        userName: '',
        password: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.tableDatas = JSON.parse(localStorage.getItem('DataSources'))
    },
    handlerSave() {
      let dataSources = JSON.parse(localStorage.getItem('DataSources'))
      dataSources = dataSources === null ? [] : dataSources
      const dataSource = dataSources.filter(item => item.name === this.form.name)
      console.log(dataSource)
      if (dataSource !== null && dataSource.length > 0) {
        this.$notify({
          title: 'Notification',
          type: 'error',
          message: 'DataSouece ' + this.form.name + ' Save Error, exists!'
        })
      } else {
        dataSources.push(this.form)
        localStorage.setItem('DataSources', JSON.stringify(dataSources))
        this.dialogFormVisible = false
        this._initialize()
        this.$notify({
          title: 'Notification',
          type: 'success',
          message: 'DataSouece ' + this.form.name + ' Save Success!'
        })
      }
    },
    handlerDelete(row) {
      const dataSources = JSON.parse(localStorage.getItem('DataSources')).filter(item => item.name !== row.name)
      localStorage.setItem('DataSources', JSON.stringify(dataSources))
      this._initialize()
    }
  }
}
</script>
