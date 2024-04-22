import path from "path";
import * as vscode from "vscode";
import { ComponentName } from "../types";

function getCurrentFileName(componentName: ComponentName, newFileName: string) {
  // 1. 如果没有传入新的文件名，就获取当前打开的文件名

  let fileName: string;
  if (!newFileName) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active text editor found.");
      return "null";
    }
    const document = editor.document;

    //   获取文件名
    const baseName = path.basename(document.fileName);

    //   去除文件扩展名
    fileName = path.parse(baseName).name;
  } else {
    fileName = path.parse(path.basename(newFileName)).name;
  }
  let kebabCaseName: string;
  if (!componentName.isHump) {
    //   将驼峰式命名转换为减号连接形式
    kebabCaseName = fileName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  } else {
    kebabCaseName = fileName;
  }
  return kebabCaseName;
}


// 是否是引用类型，具体指使用typeof类型为object，并且不是null的值
function isObjectLike(value:any) {
  return typeof value === "object" && value !== null;
}
const toString = Object.prototype.toString;
function getTag(value:any) {
  return toString.call(value);
}
function isPlainObject(value:any) {
  if (!isObjectLike(value) || getTag(value) != "[object Object]") {
    return false;
  }
  // 例如：Object.create(null)
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  // 循环遍历对象，如果是自定义构造器实例化的object则返回false
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

function deepMerge(obj1:any, obj2:any) {
  let isPlain1 = isPlainObject(obj1);
  let isPlain2 = isPlainObject(obj2);
  if (!isPlain1) {
    return obj2;
  }
  if (!isPlain2) {
    return obj1;
  }
  [...Object.keys(obj2), ...Object.getOwnPropertySymbols(obj2)].forEach(
    (key) => {
      //与浅拷贝区别之处
      obj1[key] = deepMerge(obj1[key], obj2[key]);
    }
  );
  return obj1;
}
export { getCurrentFileName, deepMerge };
