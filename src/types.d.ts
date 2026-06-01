export {};
declare global {
  interface Window {
    electronAPI: {
      db: {
        getProfile: () => Promise<any>;
        saveProfile: (profile: any) => Promise<{ success: boolean; error?: string }>;
      };
      dialog: {
        selectFolder: () => Promise<string | null>;
        selectFile: (filters: any) => Promise<string[]>;
      };
      pdf: {
        openExternal: (filePath: string) => Promise<{ success: boolean; error?: string }>;
      };
      app: {
        getPath: (name: string) => Promise<string>;
        getHelpPath: () => Promise<string>;
      };
      ocr: {
        processFile: (filePath: string) => Promise<any>;
      };
    };
  }
}
