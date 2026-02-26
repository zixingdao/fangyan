declare module '@cloudbase/js-sdk' {
  interface CloudbaseConfig {
    env: string;
    region?: string;
  }

  interface UploadFileOptions {
    cloudPath: string;
    filePath: File;
  }

  interface UploadFileResult {
    fileID: string;
    requestId: string;
  }

  interface CloudbaseApp {
    uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  }

  function init(config: CloudbaseConfig): CloudbaseApp;

  export default {
    init,
  };
}
