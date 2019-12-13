<template>
  <div>
    <h1>基础设置</h1>
    <el-form size="medium" label-width="100px">
      <el-form-item label="默认值：">
        <el-input v-model="extra.default" placeholder="默认值"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最小长度：">
            <el-input-number v-model="extra.minLength" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最大长度：">
            <el-input-number v-model="extra.maxLength" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="校验规则：">
        <el-input v-model="extra.default" placeholder="校验规则"></el-input>
      </el-form-item>
      <el-form-item label="枚举：">
        <el-switch
          v-model="enableEnum">
        </el-switch>
        <el-select
          v-if="enableEnum"
          v-model="extra.enum"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请设置枚举">
        </el-select>
      </el-form-item>
      <el-form-item label="format：">
        <el-select v-model="extra.format" placeholder="请选择">
          <el-option
            v-for="item in formatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <h1>编辑源码</h1>
    <div class="jsoneditor"></div>
  </div>
</template>

<script>
import _ from 'lodash'
import JSONEditor from 'jsoneditor'
export default {
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      enableEnum: this.schema.enum,
      extra: {
        minLength: this.schema.minLength,
        maxLength: this.schema.maxLength,
        pattern: this.schema.pattern,
        format: this.schema.format,
        default: this.schema.default,
        enum: this.schema.enum
      },
      formatOptions: [
        {
          key: 'date-time',
          label: 'date-time',
          value: 'date-time'
        },
        {
          key: 'time',
          label: 'time',
          value: 'time'
        },
        {
          key: 'date',
          label: 'date',
          value: 'date'
        },
        {
          key: 'email',
          label: 'email',
          value: 'email'
        },
        {
          key: 'hostname',
          label: 'hostname',
          value: 'hostname'
        },
        {
          key: 'ipv4',
          label: 'ipv4',
          value: 'ipv4'
        },
        {
          key: 'ipv6',
          label: 'ipv6',
          value: 'ipv6'
        },
        {
          key: 'uri',
          label: 'uri',
          value: 'uri'
        }
      ]
    }
  },
  mounted () {
    this.jsoneditor = new JSONEditor(this.$el.querySelector('jsoneditor'))
    this.jsoneditor.set(_.cloneDeep(this.schema))
  }
}
</script>
