<template>
  <div>
    <el-row class="row" :data-level="level">
      <el-col :span="10" :style="{'padding-left': level * 10 + 'px'}">
        <el-row>
          <el-col :span="2">
            <el-button type="text" size="small" :style="foldVisiable" :icon="foldIcon" @click="handleFoldClick"></el-button>
          </el-col>
          <el-col v-if="schema.name" :span="22">
            <el-input size="small" placeholder="请输入内容" v-model="schema.name">
              <el-checkbox slot="append" :value="checked" @change="handleRequiredChange"></el-checkbox>
            </el-input>
          </el-col>
          <el-col v-else :span="22">
            <el-input size="small" placeholder="请输入内容" :value="root? 'root' : 'items'" :disabled="true">
              <el-checkbox slot="append" :disabled="true"></el-checkbox>
            </el-input>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <el-select size="small" v-model="schema.type" placeholder="请选择" @change="handleTypeChange">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="small" v-model="schema.ui" placeholder="请选择">
          <el-option
            v-for="item in uiComOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input size="small" placeholder="description" v-model="schema.description">
          <template slot="append"><el-button type="info" size="small" icon="el-icon-edit"></el-button></template>
        </el-input>
      </el-col>
      <el-col :span="2" class="operator-container">
        <el-tooltip effect="dark" content="高级设置" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-setting" @click="handleSettingClick"></el-button>
        </el-tooltip>
        <el-tooltip v-if="showDelete" effect="dark" content="删除节点" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete"></el-button>
        </el-tooltip>
        <el-tooltip v-if="plusType === 0 || plusType === 3" effect="dark" :content="plusTip" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddNode(plusType)"></el-button>
        </el-tooltip>
        <el-dropdown v-if="plusType === 1" @command="handleCommand" :style="{'margin-left': '10px'}">
          <el-tooltip effect="dark" :content="plusTip" placement="top-start" :open-delay="400">
            <el-button size="small" type="text" icon="el-icon-plus"></el-button>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="3">兄弟节点</el-dropdown-item>
            <el-dropdown-item :command="0">子节点</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <div class="child" v-if="schema.type === 'object'">
      <Schema-Item v-for="(item, index) in schema.properties" :key="item.name" :index="index" :schema="item" :parent-schema="schema" :level="level + 1"></Schema-Item>
    </div>
    <div class="child" v-if="schema.type === 'array'">
      <Schema-Item :schema="schema.items" :parent-schema="schema" :level="level + 1" :show-delete="false"></Schema-Item>
    </div>
  </div>
</template>

<script>
import { SCHEMA_TYPE, PLUS_TYPE, getDefaultConfig, generateFieldName, eventBus } from './utils'
export default {
  name: 'Schema-Item',
  props: {
    root: { // 根节点
      type: Boolean,
      default () {
        return false
      }
    },
    index: {
      type: Number,
      default () {
        return 0
      }
    },
    showDelete: { // 是否显示删除按钮
      type: Boolean,
      default () {
        return true
      }
    },
    schema: { // 当前schema-item的配置
      type: Object,
      default () {
        return {}
      }
    },
    parentSchema: { // 父schema配置
      type: Object
    },
    level: { // 层级
      type: Number,
      default () {
        return 1
      }
    }
  },
  data () {
    return {
      unfold: true
    }
  },
  computed: {
    foldIcon () {
      return this.unfold ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
    },
    foldVisiable () {
      let visibility = this.schema.type === 'object' ? 'visible' : 'hidden'
      return { visibility }
    },
    /**
     * 字段是否是必须
     */
    checked () {
      return this.parentSchema.required && this.parentSchema.required.indexOf(this.schema.name) > -1
    },
    /**
     * 新增按钮的提示
     */
    plusTip () {
      switch (this.plusType) {
        case PLUS_TYPE.CHILD:
          return '新增子节点'
        case PLUS_TYPE.BOTH:
          return '新增兄弟点/子节点'
        default:
          return '新增兄弟节点'
      }
    },
    /**
     * 新增按钮类型，分为：新增子节点，新增兄弟节点，或者两者
     */
    plusType () {
      const parentType = this.parentSchema.type
      const type = this.schema.type
      if ((type === SCHEMA_TYPE.OBJECT && parentType === SCHEMA_TYPE.ARRAY) || this.root) {
        return PLUS_TYPE.CHILD // 新增子节点
      }
      if (type === SCHEMA_TYPE.OBJECT && parentType === SCHEMA_TYPE.OBJECT) {
        return PLUS_TYPE.BOTH // 新增子节点或者新增兄弟节点
      }
      if (parentType === SCHEMA_TYPE.ARRAY) {
        return PLUS_TYPE.NONE // 没有新增功能
      }
      return PLUS_TYPE.BROTHER // 新增兄弟节点
    },
    typeOptions () {
      return [
        {
          key: 'string',
          value: 'string',
          label: 'string'
        }, {
          key: 'number',
          value: 'number',
          label: 'number'
        }, {
          key: 'object',
          value: 'object',
          label: 'object'
        }, {
          key: 'array',
          value: 'array',
          label: 'array'
        }, {
          key: 'boolean',
          value: 'boolean',
          label: 'boolean'
        }, {
          key: 'integer',
          value: 'integer',
          label: 'integer'
        }
      ]
    },
    uiComOptions () {
      return [
        {
          key: 'ui:input',
          value: 'ui:input',
          label: '文字输入框'
        }, {
          key: 'ui:number',
          value: 'ui:number',
          label: '数字输入框'
        }, {
          key: 'ui:date',
          value: 'ui:date',
          label: '日历'
        }, {
          key: 'ui:checkbox',
          value: 'ui:checkbox',
          label: '复选框'
        }, {
          key: 'ui:radiobox',
          value: 'ui:radiobox',
          label: '单选框'
        }
      ]
    }
  },
  methods: {
    /**
     * 处理类型转换
     */
    handleTypeChange (type) {
      if (this.schema.name) {
        let newConfig = getDefaultConfig(type, this.schema)
        this.parentSchema.properties.splice(this.index, 1, newConfig)
      } else if (!this.root) {
        let newConfig
        if (type === SCHEMA_TYPE.OBJECT) {
          newConfig = {
            type,
            properties: []
          }
        } else if (type === SCHEMA_TYPE.ARRAY) {
          newConfig = {
            type,
            items: {
              type: SCHEMA_TYPE.STRING
            }
          }
        } else {
          newConfig = {
            type
          }
        }
        if (this.schema.description) {
          newConfig.description = this.schema.description
        }
        this.parentSchema.items = newConfig
      }
    },
    /**
     * 处理展开折叠
     */
    handleFoldClick () {
      this.unfold = !this.unfold
      this.$el.parentElement.querySelector('.child').style.display = this.unfold ? 'block' : 'none'
    },
    /**
     * 处理required点击
     */
    handleRequiredChange (checked) {
      if (checked) {
        this.parentSchema.required.push(this.schema.name)
      } else {
        this.parentSchema.required = this.parentSchema.required.filter(name => {
          return name !== this.schema.name
        })
      }
    },
    /**
     * 新增子节点或者兄弟节点
     */
    handleCommand (command) {
      this.handleAddNode(command)
    },
    /**
     * 新增节点
     */
    handleAddNode (type) {
      if (type === PLUS_TYPE.CHILD) {
        let name = generateFieldName(this.schema.properties)
        this.schema.properties.push({
          name,
          type: 'string'
        })
        if (!this.schema.required) {
          this.schema.required = []
        }
        this.schema.required.push(name)
      } else {
        let name = generateFieldName(this.parentSchema.properties)
        this.parentSchema.properties.push({
          name,
          type: 'string'
        })
        this.parentSchema.required.push(name)
      }
    },
    /**
     * 删除节点
     */
    handleDelete () {
      this.parentSchema.properties = this.parentSchema.properties.filter(property => {
        return property.name !== this.schema.name
      })
      this.parentSchema.required = this.parentSchema.required.filter(name => {
        return name !== this.schema.name
      })
    },
    handleSettingClick () {
      eventBus.$emit('setting', this.schema)
    }
  }
}
</script>

<style lang="less" scoped>
  .row {
    margin-bottom: 8px
  }
  .operator-container {
    padding-left: 20px;
    // text-align: left
  }
</style>
