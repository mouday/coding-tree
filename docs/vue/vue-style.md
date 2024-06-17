# Vue项目风格指南

## 一、必要

1、组件名应该始终是多个单词
```js
Vue.component('todo-item', {
  // ...
})

export default {
  name: 'TodoItem',
  // ...
}
```

2、组件的 data 必须是一个函数
```js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})

export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

3、Prop 定义应该尽量详细，至少需要指定其类型
```js
props: {
  status: String
}
```

4、总是用 key 配合 v-for
```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

5、永远不要把 v-if 和 v-for 同时用在同一个元素上
```html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

6、为组件样式设置作用域
```html
<template>
  <button class="button button-close">X</button>
</template>

<!-- 使用 `scoped` 特性 -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

7、私有属性名使用 $_ 前缀
```js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}

```
## 二、强烈推荐（增强可读性）
1、只要有能够拼接文件的构建系统，就把每个组件单独分成文件
```
components/
|- TodoList.vue
|- TodoItem.vue
```

2、单文件组件的文件名应该要么始终是单词大写开头 (PascalCase)
```
components/
|- MyComponent.vue
```

3、应用特定样式和约定的基础组件应该全部以一个特定的前缀开头，比如 Base、App 或 V。
```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

4、只应该拥有单个活跃实例的组件应该以 The 前缀命名，以示其唯一性。
```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

5、和父组件紧密耦合的子组件应该以父组件名作为前缀命名
```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

6、组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。
```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
```

7、在单文件组件、字符串模板和 JSX 中没有内容的组件应该是自闭合的——但在 DOM 模板里永远不要这样做。
```html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent/>

<!-- 在 DOM 模板中 -->
<my-component></my-component>
```

8、对于绝大多数项目来说，在单文件组件和字符串模板中组件名应该总是 PascalCase 的——但是在 DOM 模板中总是 kebab-case 的。
```html
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>

<!-- 在 DOM 模板中 -->
<my-component></my-component>
```

9、JS/JSX 中的组件名应该始终是 PascalCase 的
```js
Vue.component('MyComponent', {
  // ...
})

import MyComponent from './MyComponent.vue'

export default {
  name: 'MyComponent',
  // ...
}
```

10、组件名应该倾向于完整单词而不是缩写
```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

11、在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板和 JSX 中应该始终使用 kebab-case
```html
props: {
  greetingText: String
}

<WelcomeMessage greeting-text="hi"/>
```

12、多个特性的元素应该分多行撰写，每个特性一行。
```html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>

<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

13、组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。

```html
<!-- 在模板中 -->
{{ normalizedFullName }}

<script>
// 复杂表达式已经移入一个计算属性
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
</script>
```

14、应该把复杂计算属性分割为尽可能多的更简单的属性。
```js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```

15、非空 HTML 特性值应该始终带引号 (单引号或双引号，选你 JS 里不用的那个)。
```html
<input type="text">

<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

16、指令缩写 (用 : 表示 v-bind: 、用 @ 表示 v-on: 和用 # 表示 v-slot:) 应该要么都用要么都不用。
```html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>

<input
  @input="onInput"
  @focus="onFocus"
>

<template #header>
  <h1>Here might be a page title</h1> 
</template>

```

## 三、推荐（将选择和认知成本最小化）
1、组件/实例的选项应该有统一的顺序。
```
1、副作用 (触发组件外的影响)
el

2、全局感知 (要求组件以外的知识)
name
parent

3、组件类型 (更改组件的类型)
functional

4、模板修改器 (改变模板的编译方式)
delimiters
comments

5、模板依赖 (模板内使用的资源)
components
directives
filters

6、组合 (向选项里合并属性)
extends
mixins

7、接口 (组件的接口)
inheritAttrs
model
props/propsData

8、本地状态 (本地的响应式属性)
data
computed

9、事件 (通过响应式事件触发的回调)
watch

10、生命周期钩子 (按照它们被调用的顺序)
beforeCreate
created
beforeMount
mounted
beforeUpdate
updated
activated
deactivated
beforeDestroy
destroyed

11、非响应式的属性 (不依赖响应系统的实例属性)
methods

12、渲染 (组件输出的声明式描述)
template/render
renderError
```

2、元素 (包括组件) 的特性应该有统一的顺序。
```
1、定义 (提供组件的选项)
is

2、列表渲染 (创建多个变化的相同元素)
v-for

3、条件渲染 (元素是否渲染/显示)
v-if
v-else-if
v-else
v-show
v-cloak

4、渲染方式 (改变元素的渲染方式)
v-pre
v-once

5、全局感知 (需要超越组件的知识)
id

6、唯一的特性 (需要唯一值的特性)
ref
key

7、双向绑定 (把绑定和事件结合起来)
v-model

8、其它特性 (所有普通的绑定或未绑定的特性)

9、事件 (组件事件监听器)
v-on

10、内容 (覆写元素的内容)
v-html
v-text
```

3、你可能想在多个属性之间增加一个空行，特别是在这些选项一屏放不下，需要滚动才能都看到的时候。
```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

4、单文件组件顺序因为另外两个标签至少要有一个。
```html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

## 四、谨慎使用 (有潜在危险的模式)
1、如果一组 v-if + v-else 的元素类型相同，最好使用 key (比如两个 div 元素)。
```html
<div
  v-if="error"
  key="search-status"
>
  错误：{{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

2、元素选择器应该避免在 scoped 中出现，应该使用类选择器。

```html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

3、应该优先通过 prop 和事件进行父子组件之间的通信，而不是 this.$parent 或改变 prop。
```js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

4、应该优先通过 Vuex 管理全局状态，而不是通过 this.$root 或一个全局事件总线。
```js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```
```html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```

原文：https://cn.vuejs.org/v2/style-guide/