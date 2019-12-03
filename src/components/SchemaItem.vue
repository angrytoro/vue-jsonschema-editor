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
              <el-checkbox slot="append" v-model="checked" @change="handleRequiredChange"></el-checkbox>
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
        <el-select size="small" v-model="schema.type" placeholder="请选择">
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
          <el-button size="small" type="text" icon="el-icon-setting"></el-button>
        </el-tooltip>
        <el-tooltip v-if="showDelete" effect="dark" content="删除节点" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete"></el-button>
        </el-tooltip>
        <el-tooltip v-if="plusType === 0 || plusType === 3" effect="dark" :content="plusContent" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddNode(plusType)"></el-button>
        </el-tooltip>
        <el-dropdown v-if="plusType === 1" @command="handleCommand" :style="{'margin-left': '10px'}">
          <el-tooltip effect="dark" :content="plusContent" placement="top-start" :open-delay="400">
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
      <Schema-Item v-for="item in schema.properties" :key="item.name" :schema="item" :parent-schema="schema" :level="level + 1"></Schema-Item>
    </div>
    <div class="child" v-if="schema.type === 'array'">
      <Schema-Item :schema="schema.items" :parent-schema="schema" :level="level + 1" :show-delete="false"></Schema-Item>
    </div>
  </div>
</template>

<script>
const PLUS_TYPE = Object.freeze({
  CHILD: 0,
  BOTH: 1,
  NONE: 2,
  BROTHER: 3
})
const generateFieldName = function (brothers) {
  let fieldNames = brothers.map(brother => {
    return brother.name
  })
  let i = 1
  while (true) {
    let name = `field_${i}`
    if (fieldNames.indexOf(name) < 0) {
      return name
    }
    i++
  }
}
export default {
  name: 'Schema-Item',
  props: {
    root: { // 根节点
      type: Boolean,
      default () {
        return false
      }
    },
    showDelete: {
      type: Boolean,
      default () {
        return true
      }
    },
    schema: {
      type: Object,
      default () {
        return {}
      }
    },
    parentSchema: {
      type: Object
    },
    level: {
      type: Number,
      default () {
        return 1
      }
    }
  },
  data () {
    return {
      unfold: true,
      checked: true
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
    parentType () {
      return this.parentSchema.type
    },
    plusContent () {
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
      if ((this.schema.type === 'object' && this.parentType === 'array') || this.root) {
        return PLUS_TYPE.CHILD // 新增子节点
      }
      if (this.schema.type === 'object' && this.parentType === 'object') {
        return PLUS_TYPE.BOTH // 新增子节点或者新增兄弟节点
      }
      if (this.parentType === 'array') {
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
    handleFoldClick () {
      this.unfold = !this.unfold
      this.$el.parentElement.querySelector('.child').style.display = this.unfold ? 'block' : 'none'
    },
    handleRequiredChange (value) {
      console.log(value)
    },
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
    text-align: left
  }
</style>