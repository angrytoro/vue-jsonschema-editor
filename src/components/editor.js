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
    const renderSchema = function (result, schema) {
      let properties
      if (schema.type === 'object') {
        properties = schema.properties
      } else if (schema.items.type === 'object') {
        properties = schema.items.properties
      }
      return properties.forEach(property => {
        result.push(<Item schema={property} parentSchema={schema}></Item>)
        if (property.type === 'array') {
          let arrayItems = Object.assign({ name: 'items' }, property.items)
          result.push(<Item schema={arrayItems} parentSchema={property}></Item>)
          if (property.items.type === 'object') {
            renderSchema(result, property)
          }
        } else if (property.type === 'object') {
          renderSchema(result, property)
        }
      })
    }
    renderSchema(result, Object.assign({}, this.schema, { properties: this.properties }))
    return (
      <div>
        {result}
      </div>
    )
  }
})
