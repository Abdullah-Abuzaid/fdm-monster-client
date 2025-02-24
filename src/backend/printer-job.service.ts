import { ServerApi } from "@/backend/server.api";
import { BaseService } from "@/backend/base.service";

export class PrinterJobService extends BaseService {
  static async stopPrintJob(printerId: string) {
    const path = ServerApi.printerStopJobRoute(printerId);
    return await this.postApi(path);
  }

  static async pausePrintJob(printerId: string) {
    const path = ServerApi.printerPauseJobRoute(printerId);
    return await this.postApi(path);
  }

  static async resumePrintJob(printerId: string) {
    const path = ServerApi.printerResumeJobRoute(printerId);
    return await this.postApi(path);
  }
}
