# Vue中父组件与子组件之间的通信


prop  父组件向子组件传递数据, 单向绑定
$ref  父组件调用子组件里的属性和方法
$emit 子组件向父组件传递消息


新建项目
```
$ vue create demo
$ cd demo
$ npm run serve
```

## 父组件引用子组件

components/Child.vue
```vue
<template>
  <h2>子组件</h2>
</template>
```

App.vue
```vue
<template>
  <div id="app">
    <h2>父组件</h2>

    <!-- 3、使用子组件 -->
    <Child></Child>

  </div>
</template>

<script>
// 1、导入子组件
import Child from "@/components/Child.vue";

export default {
  name: "app",

  // 2、注册组件
  components: {
    Child // 键名与变量名相同， 等价于 Child: Child
  }
};
</script>
```

## 父组件给子组件传值

components/Child.vue
```vue
<template>
    <div>
        <h2>子组件</h2>
        <p>{{message}}</p>
    </div>
</template>

<script>
export default {
    name: "child",

    // 子组件属性，用于接收父组件数据, props是单向绑定
    props:[
        "message"
    ]
}
</script>
```

App.vue
```vue
<template>
  <div id="app">
    <h2>父组件</h2>
    
    <!-- 父组件通过属性给子组件传值 -->

    <!-- 静态绑定-->
    <Child message="hello"></Child>

    <!-- 动态绑定 -->
    <Child v-bind:message="message"></Child>

  </div>
</template>

<script>
import Child from "@/components/Child.vue";

export default {
  name: "app",

  data() {
    return {
      message: "hello child"
    };
  },
  
  components: {
    Child
  }
};
</script>
```

## 父组件操作子组件数据，方法

components/Child.vue

```vue
<template>
    <div>
        <h2>子组件</h2>
        
        <p>{{message}}</p>
        
    </div>
</template>

<script>
export default {
    name: "child",
    
    // 子组件属性
    data(){
        return {
            message: "",
        }
    },

    // 子组件方法
    methods:{
        setMessage(msg){
            this.message = msg;
        }
    }
}
</script>
```

App.vue
```vue
<template>
  <div id="app">
    <h2>父组件</h2>

    <!-- 注册子组件引用信息 -->
    <Child ref="child"></Child>

    <button @click="setChildMessage">修改子组件数据</button>

    <button @click="callChildMessage">调用子组件方法</button>

  </div>
</template>

<script>
import Child from "@/components/Child.vue";

export default {
  name: "app",

  components: {
    Child
  },

  methods: {
    setChildMessage() {
      this.$refs.child.message = "设置子组件属性"
    },

    callChildMessage(){
      this.$refs.child.setMessage("调用子组件方法");
    }
  }
};
</script>
```

## 子组件给父组件传值

components/Child.vue
```vue
<template>
  <div>
    <h2>子组件</h2>

    <!-- 点击按钮将会给父组件传值 -->
    <button @click="clickButton">子组件按钮</button>

  </div>
</template>

<script>
export default {
  name: "child",

  methods: {
    clickButton() {
      // 向父组件发送信号  vm.$emit(event, args)
      this.$emit("clickButton", "子组件的按钮被点击");
    }
  }
};
</script>
```

App.vue
```vue
<template>
  <div id="app">
    <h2>父组件</h2>

    <!-- 处理子组件的按钮点击事件 -->
    <Child @clickButton="childClickButton"></Child>

  </div>
</template>

<script>
import Child from "@/components/Child.vue";

export default {
  name: "app",

  components: {
    Child
  },

  methods: {
    // 接收处理子组件传递过来的数据
    childClickButton(message) {
      console.log(message);
    }
  }
};
</script>
```

