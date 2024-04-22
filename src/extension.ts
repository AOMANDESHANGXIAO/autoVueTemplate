import * as vscode from "vscode";
import { getCurrentFileName, deepMerge } from "./utils/tool";
import { generateTemplate } from "./utils/index";
import { Params, allTemplates, TemplateConfig } from "./types/index";

let auto: boolean;

let allTemplates: allTemplates; // 数组中存放的所有模板
// let allOptions: Array<string>; // 显示给用户看的所有模板名称，便于选择
let templateConfig: TemplateConfig;

function getTemplate(newFileName: string = "") {
  const params: Params = {
    ...templateConfig,
    name: getCurrentFileName(templateConfig.componentName, newFileName),
  };
  return generateTemplate(params);
}

// 注册命令，用户输入v3t时就会生成Vue3的模板
const vt = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found.");
    return;
  }
  editor.insertSnippet(
    new vscode.SnippetString(getTemplate()),
    editor.selection.active
  );
};

// 模板继承
function extendTemplate(allTemplates: any) {
  // 解决继承问题
  // let parentTemplate: allTemplates;
  // 1. 用来保存所有应该继承的模板
  let extendsTemplates: any = [];
  let currentConfig: any = templateConfig;
  // 2. 找到应该继承的父亲
  let i = 0;
  while (true) {
    // console.log("=====>", i++);
    let extendFrom = currentConfig?.extend;
    if (!extendFrom) {
      break;
    }
    // console.log('allTemplates===>', allTemplates);
    let parent = null;
    allTemplates.forEach((item: any) => {
      if (item.key === extendFrom) {
        parent = item;
        return;
      }
    });
    // console.log("parent ===>", parent);

    if (parent) {
      // 找到父亲
      console.log("found it");
      extendsTemplates.push(parent);
      // 找到父亲的父亲
    }
    currentConfig = parent;
  }
  // 3. 遍历这个列表将其与templateConfig进行合并
  let j = 0;
  extendsTemplates.forEach((parent: any) => {
    // console.log(j, "parent===>", parent);
    // console.log(j++, "templateConfig===>", templateConfig);
    templateConfig = deepMerge(parent, templateConfig);
  });
  // console.log("templateConfig========>", templateConfig);
}

function updateConfig(selectOption: any = null) {
  const config = vscode.workspace.getConfiguration("autoVueTemplate");
  let allTemplates = config.get("allTemplates") as allTemplates;
  if (selectOption) {
    // vscode.window.showInformationMessage(">>>选择模板成功<<<")
    const config = vscode.workspace.getConfiguration("autoVueTemplate");
    templateConfig = selectOption;
    if (templateConfig.extend !== "") {
      extendTemplate(allTemplates);
    }
    // 把设置中的选项也更新
    config.update("option", selectOption.key, true);
    return;
  }
  let option = config.get("option") as string;
  auto = config.get("auto") as boolean;
  // 根据key来查找allTemplates中对应的模板配置
  let flag = false;
  for (let i = 0; i < allTemplates.length; i++) {
    if (allTemplates[i].key === option) {
      templateConfig = allTemplates[i];
      flag = true;
      break;
    }
  }
  if (!flag) {
    // 也就是说用户错误输入了模板名称
    vscode.window.showErrorMessage(`模板${option}不存在`);
    return;
  }
  if (!templateConfig.extend) {
    return;
  }
  //  继承
  extendTemplate(allTemplates);
}

function listenCreateFiles() {
  // vscode.window.showInformationMessage("监听文件创建事件");
  vscode.workspace.onDidCreateFiles((event: vscode.FileCreateEvent) => {
    // vscode.window.showInformationMessage("created a file!");
    if (auto) {
      for (const file of event.files) {
        const fileName = file.fsPath.split("/").pop();
        const fileExtension = fileName?.split(".").pop();
        if (fileExtension === "vue") {
          // vscode.window.showInformationMessage("created a Vue file!");
          vscode.workspace.fs.writeFile(
            vscode.Uri.file(file.fsPath),
            Buffer.from(getTemplate(fileName))
          );
        }
      }
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  // 初始化配置项
  updateConfig();
  listenCreateFiles();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("autoVueTemplate")) {
        updateConfig();
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("autovuetemplate.vt", vt)
  );
  let disposable = vscode.commands.registerCommand(
    "autovuetemplate.quickSelector",
    () => {
      const config = vscode.workspace.getConfiguration("autoVueTemplate");
      let allTemplates = config.get("allTemplates") as allTemplates;
      const names = allTemplates.map((template) => {
        return template.name + ` [key=${template.key}]`;
      });
      vscode.window.showQuickPick(names).then((selectName) => {
        let option: TemplateConfig | undefined = allTemplates.find(
          (template) => template.name + ` [key=${template.key}]` === selectName
        );
        if (!option) {
          // vscode.window.showErrorMessage(`模板${selectName}不存在`);
          return;
        }
        updateConfig(option);
        vt();
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
