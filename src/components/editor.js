import Vue from 'vue'
import _ from 'lodash'
import Item from './Item'

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

Vue.component('json-schema-editor', {
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
      properties: convertSchema(_.cloneDeep(this.schema.properties))
    }
  },
  render (h) {
    let result = []
    const renderSchema = function (result, schema, level) {
      let properties
      if (schema.type === 'object') {
        properties = schema.properties
      } else if (schema.items.type === 'object') {
        properties = schema.items.properties
      }
      properties.forEach(property => {
        result.push(<Item schema={property} parentSchema={schema} level={level}></Item>)
        if (property.type === 'array') {
          let arrayItems = Object.assign({ name: 'items' }, property.items)
          result.push(<Item schema={arrayItems} parentSchema={property} level={level + 1}></Item>)
          if (property.items.type === 'object') {
            renderSchema(result, property, level + 2)
          }
        } else if (property.type === 'object') {
          renderSchema(result, property, level + 1)
        }
      })
    }
    renderSchema(result, Object.assign({}, this.schema, { properties: this.properties }), 1)
    return (<div>{result}</div>)
  }
})
