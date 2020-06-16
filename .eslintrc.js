module.exports = {
  root         : true,
  env          : {
    node: true
  },
  extends      : [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules        : {
    'no-console'                 : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger'                : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 允许多个空格
    'no-multi-spaces'            : 0,
    // 允许关键字后存在空格
    'key-spacing'                : 0,
    // 缩进4个空格(关闭)
    'indent'                     : 'off',
    // 方法参数之前有空格，关闭
    'space-before-function-paren': 0,
    'object-curly-spacing'       : 0,
    'vue/no-parsing-warn'        : [
      0, {
        'x-invalid-end-tag': false
      }
    ],
    // 声明之后，必须加上封号
    'semi'                       : ['warn', 'always'],
    'camelcase'                  : 0,

    /* ____________________________________________________________________________ .
    |                                                                               |
    |                                                                               |
    |                                                                               |
    |  以下都来自于 "plugin:vue/recommended" "plugin:vue/strongly-recommended"        |
    |  参考：https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html              |
    |                                                                               |
    |                                                                               |
    | ############################################################################# */


    /* ____________________________________________________________________________ .
    |                                                                               |
    |                      Priority B: Strongly Recommended                         |
    | ____________________________________________________________________________ */
    // 强制html自定义属性命名采用 kebab-case
    'vue/attribute-hyphenation'        : [
      'off', {
        'ignore': []
      }],
    // 强制html-tag封闭
    'vue/html-end-tags'                : 'warn',
    // 强制html双引号
    'vue/html-quotes'                  : ['warn', 'double'],
    // 强制prop命名采用camelCase
    'vue/prop-name-casing'             : ['warn', 'camelCase'],
    // 强制去除html标签内多个连续空格
    'vue/no-multi-spaces'              : 'warn',
    // 强制prop有默认值
    'vue/require-default-prop'         : 'warn',
    // 强制prop类型必填
    'vue/require-prop-types'           : 'warn',
    'vue/require-prop-type-constructor': 0,
    // 强制用 : 代替  v-bind:
    'vue/v-bind-style'                 : ['warn', 'shorthand'],
    // 强制用 @ 代替  v-on:
    'vue/v-on-style'                   : ['warn', 'shorthand'],

    /* ____________________________________________________________________________ .
    |                                                                               |
    |                           Priority C: Recommended                             |
    | ____________________________________________________________________________ */

    // 强制vue属性排序
    'vue/attributes-order'   : [
      'warn', {
        'order': [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ]
      }
    ],
    // 强制不存在v-html标签，防止收到XSS攻击
    'vue/no-v-html'          : 0,
    // 强制vue组件内排序
    'vue/order-in-components': [
      'warn', {
        'order': [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError'
        ]
      }
    ],
    // 强制禁止template中含有this关键字
    'vue/this-in-template'   : 'warn',

    /* ____________________________________________________________________________ .
    |                                                                               |
    |                                Uncategorized                                  |
    | ____________________________________________________________________________ */
    // 逗号检测，关闭
    'vue/comma-dangle'                     : 0,
    // template中的组件名，采用PascalCase方式。 e.g: <HelloWorld></HelloWorld>
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase', {
        'registeredComponentsOnly': true,
        'ignores'                 : []
      }],
    // 让组件名与其文件名，同名
    'vue/match-component-file-name'        : [
      'warn', {
        'extensions'     : ['vue'],
        'shouldMatchCase': true
      }],
    'vue/no-parsing-error'                 : 0
  }
};
