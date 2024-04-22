// import * as vscode from "vscode";
import { Params } from "../types/index";

function generateVue2(params: Params): string {
  const tagDict = new Map();
  const templateTem = [
    "<template>", // 0
    "	<div></div>", // 1
    "</template>", // 2]
  ];
  let scriptTem = [
    `<script${params.script.lang ? ` lang="${params.script.lang}"` : ""}>`, //0
    "export default {", //1
    `${params.componentName.isExist ? "    name: '" + params.name + "'," : ""}`, // 2
    "    props: {",
    "",
    "    },",
    "    data() {",
    "        return {",
    "",
    "        }",
    "    },",
    "    computed: {",
    "",
    "    },",
    "    created() {",
    "",
    "    },",
    "    mounted() {",
    "",
    "    },",
    "    methods: {",
    "",
    "    },",
    "}",
    "</script>",
  ];
  const styleTem = [
    `<style${params.style.lang ? ` lang="${params.style.lang}"` : ""}${
      params.style.scoped ? " scoped" : ""
    }>`,
    "",
    "</style>",
  ];
  // 如果用户不需要给组件取名，则将取名这一行从scriptTem删除
  if (!params.componentName.isExist) {
    scriptTem.splice(2, 1);
  }
  tagDict.set("template", templateTem);
  tagDict.set("script", scriptTem);
  tagDict.set("style", styleTem);

  let vue2TemplateLines: string[] = [];

  // 遍历sequence列表
  for (let i = 0; i < params.sequence.length; i++) {
    const tag = params.sequence[i];
    if (tagDict.has(tag)) {
      vue2TemplateLines = [...vue2TemplateLines, ...tagDict.get(tag), ""];
    }
  }
  return vue2TemplateLines.join("\n");
}

function generateVue3(params: Params): string {
  const tagDict = new Map();
  const templateTem = [
    "<template>", // 0
    "	<div></div>", // 1
    "</template>", // 2
  ];
  const name = `defineOptions({\n    name: '${params.name}'\n})`;
  let scriptTem = [
    `<script${params.script.lang ? ` lang="${params.script.lang}"` : ""}${
      params.script.setup ? " setup" : ""
    }>`, // 0
    `${params.componentName.isExist ? name : ""}`, // 1
    "</script>",
  ];
  const styleTem = [
    `<style${params.style.lang ? ` lang="${params.style.lang}"` : ""}${
      params.style.scoped ? " scoped" : ""
    }>`,
    "",
    "</style>",
  ];
  tagDict.set("template", templateTem);
  tagDict.set("script", scriptTem);
  tagDict.set("style", styleTem);
  let vue3TemplateLines: string[] = [];
  // 遍历sequence列表
  for (let i = 0; i < params.sequence.length; i++) {
    const tag = params.sequence[i];
    if (tagDict.has(tag)) {
      vue3TemplateLines = [...vue3TemplateLines, ...tagDict.get(tag), ""];
    }
  }
  return vue3TemplateLines.join("\n");
}
function generateTemplate(params: Params): string {
  if (params.vueVersion === "2") {
    return generateVue2(params);
  } else {
    return generateVue3(params);
  }
}

export { generateTemplate };
