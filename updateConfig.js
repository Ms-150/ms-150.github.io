import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import config from "./.vitepress/config.js";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSidebar(dir, basePath = "") {
    const items = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file === "public" || file === "utils") {
                return;
            }
            items.push({
                text: file.toUpperCase(),
                collapsed: true,
                items: generateSidebar(fullPath, `${basePath}/${file}`),
            });
        } else if (file.endsWith(".md")) {
            items.push({
                text: file.replace(".md", ""),
                link: `${basePath}/${file.replace(".md", "")}`,
            });
        }
    });

    return items;
}

function generateSidebarConfig() {
    const sidebar = {};
    const sections = fs.readdirSync(path.join(__dirname, "src"));

    sections.forEach((section) => {
        if (section === "public" || section === "utils") {
            return;
        }

        const sectionPath = path.join(__dirname, "src", section);
        if (fs.statSync(sectionPath).isDirectory()) {
            sidebar[`/${section}/`] = [
                {
                    text: section,
                    collapsed: false,
                    items: generateSidebar(sectionPath, `/${section}`),
                },
            ];
        }
    });

    return sidebar;
}

const sidebar = generateSidebarConfig();

const configPath = path.join(__dirname, ".vitepress", "config.js");

// 清除原有的 sidebar 内容
config.themeConfig.sidebar = {};

// 更新 sidebar 内容
config.themeConfig.sidebar = sidebar;

// 将更新后的配置写回 .js 文件
const updatedConfigContent = `
    import { defineConfig } from "vitepress";
    export default defineConfig(${JSON.stringify(config, null, 4)});
`;

fs.writeFileSync(configPath, updatedConfigContent, "utf-8");

console.log(
    new Date().toLocaleTimeString() +
    "config.js has been updated with the new sidebar."
);
