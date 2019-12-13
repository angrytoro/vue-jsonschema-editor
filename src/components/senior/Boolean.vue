<template>
  <div>
    <h1>基础设置</h1>
    <el-form>
      <el-form-item label="默认值">
        <el-select v-model="extra.default" placeholder="请选择默认值">
          <el-option label="true" :value="true"></el-option>
          <el-option label="false" :value="false"></el-option>
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
      extra: {
        default: this.schema.default || ''
      }
    }
  },
  mounted () {
    this.jsoneditor = new JSONEditor(this.$el.querySelector('jsoneditor'))
    this.jsoneditor.set(_.cloneDeep(this.schema))
  }
}
</script>
