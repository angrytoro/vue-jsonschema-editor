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
    const renderSchema = function (schema, paddingLeft) {
      let result = []
      let properties
      if (schema.type === 'object') {
        properties = schema.properties
      } else if (schema.items.type === 'object') {
        properties = schema.items.properties
      }
      properties.forEach(property => {
        result.push(<Item schema={property} parentSchema={schema} paddingLeft={paddingLeft}></Item>)
        if (property.type === 'array') {
          let arrayItems = Object.assign({ name: 'items' }, property.items)
          result.push(<Item schema={arrayItems} parentSchema={property} paddingLeft={paddingLeft + 20}></Item>)
          if (property.items.type === 'object') {
            result.push(renderSchema(property, paddingLeft + 40))
          }
        } else if (property.type === 'object') {
          result.push(renderSchema(property, paddingLeft + 20))
        }
      })
      return <div>{result}</div>
    }
    return renderSchema(Object.assign({}, this.schema, { properties: this.properties }), 20)
  }
})
