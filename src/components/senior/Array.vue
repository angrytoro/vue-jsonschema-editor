<template>
  <div>
    <h1>基础设置</h1>
    <el-form>
      <el-form-item label="最小元素个数：">
        <el-input-number v-model="extra.minItems" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="最大元素个数：">
        <el-input-number v-model="extra.maxItems" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="uniqueItems">
        <el-switch
          v-model="extra.uniqueItems">
        </el-switch>
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
      extra: {
        minItems: this.schema.minItems,
        maxItems: this.schema.maxItems,
        uniqueItems: this.schema.uniqueItems
      }
    }
  },
  mounted () {
    this.jsoneditor = new JSONEditor(this.$el.querySelector('jsoneditor'))
    this.jsoneditor.set(_.cloneDeep(this.schema))
  }
}
</script>
