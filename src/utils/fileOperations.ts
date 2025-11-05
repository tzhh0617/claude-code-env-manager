import { invoke } from "@tauri-apps/api/tauri";

/**
 * 文件操作工具类
 */
export class FileOperations {
  /**
   * 读取文件内容
   */
  static async readFile(filePath: string): Promise<string | null> {
    return await invoke<string | null>("read_file", {
      filePath,
    });
  }

  /**
   * 写入文件内容
   */
  static async writeFile(filePath: string, content: string): Promise<string> {
    return await invoke<string>("write_file", {
      filePath,
      content,
    });
  }

  /**
   * 获取用户主目录
   */
  static async getHomeDir(): Promise<string> {
    return await invoke<string>("get_home_dir");
  }

  /**
   * 读取Claude设置文件
   */
  static async readClaudeSettings(): Promise<any> {
    const homeDir = await this.getHomeDir();
    const settingsPath = `${homeDir}/.claude/settings.json`;

    const content = await this.readFile(settingsPath);

    if (!content) {
      return null;
    }

    return JSON.parse(content);
  }

  /**
   * 写入Claude设置文件
   */
  static async writeClaudeSettings(settings: any): Promise<string> {
    const homeDir = await this.getHomeDir();
    const settingsPath = `${homeDir}/.claude/settings.json`;

    const content = JSON.stringify(settings, null, 2);
    return await this.writeFile(settingsPath, content);
  }

  /**
   * 清除Claude设置中的环境变量，保留其他字段
   */
  static async clearClaudeEnvironment(): Promise<void> {
    const existingSettings = await this.readClaudeSettings();

    let newSettings = {};

    if (existingSettings && typeof existingSettings === "object") {
      // 保留除 env 外的所有字段
      newSettings = { ...existingSettings };
      delete (newSettings as any).env;
    }

    await this.writeClaudeSettings(newSettings);
  }

  /**
   * 应用环境变量到Claude设置
   */
  static async applyClaudeEnvironment(
    envVars: Array<{ key: string; value: string }>
  ): Promise<void> {
    const envRecord: Record<string, any> = {};

    envVars.forEach((envVar) => {
      if (envVar.key.trim()) {
        const key = envVar.key.trim();
        let value: any = envVar.value;

        // 特殊处理 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC 字段，转换为数字
        if (key === "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC") {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            value = numValue;
          }
        }

        envRecord[key] = value;
      }
    });

    // 读取现有设置
    const existingSettings = (await this.readClaudeSettings()) || {};

    // 合并设置
    const newSettings = {
      ...existingSettings,
      env: envRecord,
    };

    await this.writeClaudeSettings(newSettings);
  }

  /**
   * 读取环境管理器缓存文件
   */
  static async readEnvironmentCache(): Promise<any> {
    const homeDir = await this.getHomeDir();
    const cacheFilePath = `${homeDir}/.claude-code-env-manager.json`;

    const content = await this.readFile(cacheFilePath);

    if (!content) {
      return null;
    }

    return JSON.parse(content);
  }

  /**
   * 写入环境管理器缓存文件
   */
  static async writeEnvironmentCache(data: any): Promise<string> {
    const homeDir = await this.getHomeDir();
    const cacheFilePath = `${homeDir}/.claude-code-env-manager.json`;

    const cacheData = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      ...data,
    };

    const content = JSON.stringify(cacheData, null, 2);
    return await this.writeFile(cacheFilePath, content);
  }
}
