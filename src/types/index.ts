interface Params {
  vueVersion: string; // 使用的vue.js版本是什么
  name: string; // 根据文件名填写组件的名称
  script: Script;
  style: Style;
  componentName: ComponentName;
  sequence: Sequence;
}
interface Script {
  lang: string;
  setup: boolean;
}
interface Style {
  lang: string;
  scoped: boolean;
}
interface ComponentName {
  isExist: boolean;
  isHump: boolean;
}
type Sequence = ("script" | "template" | "style")[];

interface templateOption {
  name: string;
  option: string;
  extend: string;
}
type allTemplates = Array<TemplateConfig>;

interface TemplateConfig {
  name: string,
  key: string,
  extend: string,
  vueVersion: ("3"|"2"),
  script: Script,
  style: Style,
  componentName: ComponentName,
  sequence: Sequence,
}
export {
  Params,
  Script,
  Style,
  ComponentName,
  Sequence,
  allTemplates,
  templateOption,
  TemplateConfig
};
