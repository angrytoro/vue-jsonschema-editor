<template>
  <el-row class="row" :data-level="level">
    <el-col :span="10" :style="{'padding-left': level * 10 + 'px'}">
      <el-row>
        <el-col :span="2">
          <el-button type="text" size="small" :style="foldVisiable" :icon="foldIcon" @click="handleFoldClick(level)"></el-button>
        </el-col>
        <el-col :span="22">
          <el-input size="small" placeholder="请输入内容" v-model="schema.name">
            <el-checkbox slot="append" v-model="checked" @change="handleRequiredChange"></el-checkbox>
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
    <el-col :span="2">
      <el-tooltip effect="dark" content="高级设置" placement="top-start" :open-delay="400">
        <el-button size="small" type="text" icon="el-icon-setting"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除节点" placement="top-start" :open-delay="400">
        <el-button size="small" type="text" icon="el-icon-delete"></el-button>
      </el-tooltip>
      <el-tooltip v-if="plusType !== 1" effect="dark" :content="plusContent" placement="top-start" :open-delay="400">
        <el-button size="small" type="text" icon="el-icon-plus"></el-button>
      </el-tooltip>
      <el-dropdown v-else @command="handleCommand">
        <el-tooltip effect="dark" :content="plusContent" placement="top-start" :open-delay="400">
          <el-button size="small" type="text" icon="el-icon-plus"></el-button>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="0">兄弟节点</el-dropdown-item>
          <el-dropdown-item :command="1">子节点</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
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
        case 0:
          return '新增子节点'
        case 1:
          return '新增兄弟点/子节点'
        default:
          return '新增兄弟节点'
      }
    },
    /**
     * 新增按钮类型，分为：新增子节点，新增兄弟节点，或者两者
     */
    plusType () {
      if (this.schema.type === 'object' && this.parentType === 'array') {
        return 0 // 新增子节点
      }
      if (this.schema.type === 'object' && this.parentType === 'object') {
        return 1 // 新增子节点或者新增兄弟节点
      }
      if (this.parentType === 'array') {
        return 2 // 没有新增功能
      }
      return 3 // 新增兄弟节点
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
    handleFoldClick (level) {
      this.unfold = !this.unfold
      let start = false
      let brothers = this.$el.parentElement.children
      for (let len = brothers.length, i = 0; i < len; i++) {
        if (brothers[i] === this.$el) {
          start = true
          continue
        }
        if (start) {
          if (brothers[i].dataset.level > level) {
            brothers[i].style.display = this.unfold ? 'block' : 'none'
          } else {
            return
          }
        }
      }
    },
    handleRequiredChange (value) {
      console.log(value)
    },
    handleCommand (command) {
      if (command) {
        // 如果是新增子节点
      } else {}
    }
  }
}
</script>

<style lang="less" scoped>
  .row {
    margin-bottom: 8px
  }
</style>
