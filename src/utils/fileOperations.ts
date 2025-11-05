import { invoke } from "@tauri-apps/api/tauri";

/**
 * File Operations Utility Class
 */
export class FileOperations {
  /**
   * Read file content
   */
  static async readFile(filePath: string): Promise<string | null> {
    return await invoke<string | null>("read_file", {
      filePath,
    });
  }

  /**
   * Write file content
   */
  static async writeFile(filePath: string, content: string): Promise<string> {
    return await invoke<string>("write_file", {
      filePath,
      content,
    });
  }

  /**
   * Get user home directory
   */
  static async getHomeDir(): Promise<string> {
    return await invoke<string>("get_home_dir");
  }

  /**
   * Read Claude settings file
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
   * Write Claude settings file
   */
  static async writeClaudeSettings(settings: any): Promise<string> {
    const homeDir = await this.getHomeDir();
    const settingsPath = `${homeDir}/.claude/settings.json`;

    const content = JSON.stringify(settings, null, 2);
    return await this.writeFile(settingsPath, content);
  }

  /**
   * Clear environment variables from Claude settings, keep other fields
   */
  static async clearClaudeEnvironment(): Promise<void> {
    const existingSettings = await this.readClaudeSettings();

    let newSettings = {};

    if (existingSettings && typeof existingSettings === "object") {
      // Keep all fields except env
      newSettings = { ...existingSettings };
      delete (newSettings as any).env;
    }

    await this.writeClaudeSettings(newSettings);
  }

  /**
   * Apply environment variables to Claude settings
   */
  static async applyClaudeEnvironment(
    envVars: Array<{ key: string; value: string }>
  ): Promise<void> {
    const envRecord: Record<string, any> = {};

    envVars.forEach((envVar) => {
      if (envVar.key.trim()) {
        const key = envVar.key.trim();
        let value: any = envVar.value;

        // Special handling for CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC field, convert to number
        if (key === "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC") {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            value = numValue;
          }
        }

        envRecord[key] = value;
      }
    });

    // Read existing settings
    const existingSettings = (await this.readClaudeSettings()) || {};

    // Merge settings
    const newSettings = {
      ...existingSettings,
      env: envRecord,
    };

    await this.writeClaudeSettings(newSettings);
  }

  /**
   * Read environment manager cache file
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
   * Write environment manager cache file
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
