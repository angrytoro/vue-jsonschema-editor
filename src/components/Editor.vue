<template>
  <div>
    <SchemaItem :schema="diySchema" :parent-schema="{}" :level="0" :root="true" :show-delete="false"></SchemaItem>
    <el-dialog
      title="高级设置"
      :visible.sync="dialogVisible"
      class="dialog-form">
      <component :is="currentView" :schema="currentSchema"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import SchemaItem from './SchemaItem'
import { eventBus } from './utils'
import seniorComponents from './senior'

const convertSchema = function (properties) {
  return Object.keys(properties).map(key => {
    let config = properties[key]
    config.name = key
    if (config.type === 'object') {
      config.properties = convertSchema(config.properties)
    } else if (config.type === 'array' && config.items.type === 'object') {
      config.items.properties = convertSchema(config.items.properties)
    }
    return config
  })
}
export default {
  components: {
    SchemaItem
  },
  props: {
    schema: {
      type: Object,
      default () {
        return {
          type: 'object',
          properties: {}
        }
      }
    }
  },
  data () {
    return {
      diySchema: Object.assign({}, this.schema, { properties: convertSchema(_.cloneDeep(this.schema.properties)) }),
      dialogVisible: false,
      currentSchema: {},
      currentView: null
    }
  },
  created () {
    eventBus.$on('setting', (schema) => {
      this.dialogVisible = true
      this.currentSchema = schema
      this.currentView = seniorComponents[schema.type]
    })
  },
  methods: {
    handleConfirm () {
      console.log('confirm')
    }
  }
}
</script>

<style lang="less" scoped>
  .dialog-form {
    /deep/.el-input {
      max-width: 300px;
    }
  }
</style>
