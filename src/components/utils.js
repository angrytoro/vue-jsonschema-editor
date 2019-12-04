export const SCHEMA_TYPE = {
  ARRAY: 'array',
  OBJECT: 'object',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  INTEGER: 'integer'
}
export const PLUS_TYPE = Object.freeze({
  CHILD: 0,
  BOTH: 1,
  NONE: 2,
  BROTHER: 3
})
export const getDefaultConfig = function (type, schema) {
  let { name, description } = schema
  let config
  if (type === SCHEMA_TYPE.ARRAY) {
    config = {
      name,
      type,
      items: {
        type: SCHEMA_TYPE.STRING
      }
    }
  } else if (type === SCHEMA_TYPE.OBJECT) {
    config = {
      name,
      type,
      properties: [],
      required: []
    }
  } else {
    config = {
      name,
      type
    }
  }
  if (description) {
    config.description = description
  }
  return config
}
export const generateFieldName = function (brothers) {
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
