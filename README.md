# 自动生成Vue模板插件( Auto Vue Template Generator-- A extension for Visual Code)

## 1. 简介：

本项目为Vscode的一款插件。旨在为使用Vue2或者3的前端开发者提供快速生成可自定义的组件模板的功能。

## 2. 如何使用

### 2.1 简单使用

默认的快捷键为`ctrl`+`shift`+`t`(t表示template)。按下即可根据配置项生成模板。

我们为`vue2`和`vue3`分别预设了一套模板。

按下快捷键时默认生成`vue3`的模板。如下：

```vue
<script setup>
defineOptions({
    name: 'vue3-template'
})
</script>

<template>
    <div></div>
</template>

<style scoped>

</style>

```

如何使用我们为你预设的`vue2`模板呢？

按下`ctrl`+`shift`+`p`。你就会在vscode中看到一个下拉列表选项。


之后，你再使用快捷键就会生成`vue2`的模板。如下。

```vue
<template>
    <div></div>
</template>

<script>
export default {
    name: 'vue2-Template',
    props: {

    },
    data() {
        return {

        }
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
}
</script>

<style scoped>

</style>

```

### 2.2 自动生成模板

当你创建一个`vue`文件时，我们的插件可以自动生成模板(根据你的配置项)。如果你不想在创建文件后自动生成模板，可以在配置项中进行配置将其关闭。

**配置项：**

```json
{
	"autoVueTemplate.auto": true // 设置为false即可关闭
}
```

### 2.3 自定义模板

本插件允许你自定义多套模板，你可以根据不同的开发场景选择合适的模板。

那么如何自定义模板呢？可以通过配置`autoVueTemplate.allTemplates`来实现。

这是默认的`autoVueTemplate.allTemplates`选项。我以注释的形式详细解释了每个参数的意义。

```json
"autoVueTemplate.allTemplates":[ 
    {
      "name": "默认vue3模板", // 名称，显示在下拉菜单中
      "key": "defaultVue3", // key值，控制选择哪一套模板作为生成的模板
      "extend": "",
      "vueVersion": "3", // 生成vue2还是vue3
      "script": { // 控制生成的script标签中的属性
        "lang": "", // 是否加上lang属性，例如：将lang设置为ts，则生成的script标签为<script lang="ts"></script>
        "setup": true // 是否加上setup属性，例如：将setup设置为true，则生成的script标签为<script setup></script>,仅对生成vue3代码有效
      },
      "style": { // 控制生成的style标签中的属性
        "lang": "", // 是否加上lang属性，例如：将lang设置为scss，则生成的script标签为<style lang="scss"></script>
        "scoped": true // 是否加上scoped属性，例如：将scoped设置为true，则生成的script标签为<style scoped></script>
      },
      "componentName": { // 组件名字选项
        "isExist": true, // 是否为组件取一个名字，根据你的文件名生成        
         "isHump": false // 是否采用驼峰命名法， 如果为false，则生成的组件名会以 - 连接。将你已驼峰命名法命名的文件自动转换为以-相连。例如：你的文件名为testTemplate, 则生成的组件名为，test-template
      },
      "sequence": ["script", "template", "style"] // 生成的标签顺序
    },
    {
      "name": "默认vue2模板",
      "key": "defaultVue2",
      "extend": "",
      "vueVersion": "2",
      "script": {
        "lang": ""
      },
      "style": {
        "lang": "",
        "scoped": true
      },
      "componentName": {
        "isExist": true,
        "isHump": false
      },
      "sequence": ["template", "script", "style"]
    }
]
```

如果要自定义自己的模板，很简单。你只需要在`autoVueTemplate.allTemplates`中进行追加即可。例如我在项目中使用了`ts`和`less`，那么我可以在配置项中追加一个元素。

```json
  "autoVueTemplate.allTemplates": [
  	// ...
    {
      "name": "ts+less",
      "key": "zidingyi",
      "extend": "",
      "vueVersion": "3",
      "script": {
        "lang": "ts",
        "setup": true
      },
      "style": {
        "lang": "less",
        "scoped": true
      },
      "componentName": {
        "isExist": true,
        "isHump": true
      },
      "sequence": [
        "script",
        "template",
        "style"
      ]
    }
  ],
```

这样你就可以按下`ctrl`+`shift`+`p`,在下拉列表中看到自定义的模板了。


最后，如何设置自定义的模板为你按下`ctrl`+`shift`+`t`以及文件创建时的默认模板呢？只需要新增一条配置项。将`autoVueTemplate.option`设置为你自定义模板的`key`属性值即可。注意，使用下拉列表选择模板后该配置项会自动更改为你选择的模板的`key`。

```json
{
	"autoVueTemplate.option": "your template key"
}
```

### 2.4 模板继承

觉得完整写自定义配置项很麻烦？我提供了一个模板继承的功能来简化操作。

例如，当你只需要在默认的vue3模板的基础上在`script`标签中添加`lang = ts`以及在`style`标签中添加`lang = less`的功能时，你可以在`autoVueTemplate.allTemplates`配置列表中这么写。

```json
{
  "name":"extend Test",
  "key":"extendTest",
  "extend":"defaultVue3", // 添加模板继承，会继承来自父级的所有参数。
  "style": {
    "lang": "less", // 覆盖来自父级的参数
  },
  "script": {
    "lang": "ts", // 覆盖来自父级的参数
  }
},
```

这样一来，我们自定义的模板就会继承来自父级的所有配置项。另外，模板继承支持继承链。举个例子，`extendTest`模板继承自我们提供的默认`Vue3模板`。`extendTest2`继承自`extendTest`这一模板。这样一来`extendTest2`首先会使用`默认vue3`模板的配置项，再使用`extendTest`的配置项来替换`vue3默认模板`的配置项，最后使用自身的配置项。

```json
{
  "name":"extend Test",
  "key":"extendTest",
  "extend":"defaultVue3",
  "style": {
    "lang": "less",
  },
  "script": {
    "lang": "ts",
  }
},
{
  "name":"extend Test2",
  "key":"extendTest2",
  "extend":"extendTest",
  "style": {
    "lang": "sass",
  }
}
```

## 3. 结语

enjoy!😊