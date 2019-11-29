<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <json-schema-editor :schema="schema"></json-schema-editor>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data () {
    return {
      schema: {
        'type': 'object',
        'properties': {
          'field_2': {
            'type': 'string',
            'mock': {
              'mock': '@string'
            }
          },
          'field_3': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'field_4': {
                  'type': 'string'
                },
                'field_2': {
                  'type': 'object',
                  'properties': {}
                }
              },
              'required': [
                'field_4',
                'field_2'
              ],
              'description': 'haha'
            },
            'description': '我擦'
          },
          'field_1': {
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'required': [
          'field_2',
          'field_3',
          'field_1'
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
