<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Editor :schema="schema" :style="{width: '1474px'}"></Editor>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import Editor from './components/Editor.vue'

export default {
  name: 'app',
  components: {
    Editor
  },
  data () {
    return {
      schema: {
        'type': 'object',
        'properties': {
          'field_1': {
            'type': 'string',
            'mock': {
              'mock': '@string'
            }
          },
          'field_2': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'field_3': {
                  'type': 'string'
                },
                'field_4': {
                  'type': 'object',
                  'properties': {}
                }
              },
              'required': [
                'field_3',
                'field_4'
              ],
              'description': 'haha'
            },
            'description': '我擦'
          },
          'field_5': {
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'required': [
          'field_1',
          'field_2',
          'field_5'
        ]
      }
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
