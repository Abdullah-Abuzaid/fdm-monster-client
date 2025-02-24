<template>
  <div>
    <HomeToolbar />

    <v-banner v-drop-upload="{ printers: selectedPrinters }">
      <v-row style="margin-bottom: -5px">
        <v-col style="padding: 5px 0 0 15px">
          <v-chip-group class="d-inline-block">
            <v-chip v-if="selectedPrinters.length === 0" small>No selected printers</v-chip>
            <v-chip
              v-for="selectedPrinter in selectedPrinters"
              :key="selectedPrinter.id"
              close
              color="primary"
              small
              @click="openPrinter(selectedPrinter)"
              @click:close="deselectPrinter(selectedPrinter)"
            >
              {{ selectedPrinter.printerName }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col align="right" style="padding: 0">
          <v-chip-group v-if="selectedFile" class="float-end">
            <v-chip close @click:close="deselectFile()">
              {{ selectedFile.name }}
              <strong class="pl-1">{{ formatBytes(selectedFile.size) }}</strong>
            </v-chip>
          </v-chip-group>
          <br />
          <v-btn
            v-if="isBatchReprintFeatureAvailable"
            :disabled="!hasPrintersSelected"
            color="primary"
            x-small
            @click="batchReprintFiles()"
          >
            <v-icon class="pr-2" small>refresh</v-icon>
            Batch reprint
          </v-btn>
          <v-btn
            :color="hasPrintersSelected ? 'primary' : 'secondary'"
            class="ml-2"
            x-small
            @click="clearSelectedPrinters()"
          >
            <v-icon class="pr-2" small>delete</v-icon>
            Clear all ({{ selectedPrinters.length }})
          </v-btn>
          <v-btn class="ml-2" color="primary" x-small @click="$refs.fileUpload.click()">
            Select gcode file
          </v-btn>
          <v-btn
            :disabled="!selectedFile"
            class="ml-2 mr-5"
            color="green"
            x-small
            @click="uploadFile()"
          >
            Upload gcode file
          </v-btn>
          <input
            ref="fileUpload"
            :multiple="false"
            accept=".gcode"
            style="display: none"
            type="file"
            @change="filesSelected()"
          />
        </v-col>
      </v-row>
    </v-banner>

    <PrinterGrid class="ma-2" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PrinterGrid from "@/components/PrinterGrid/PrinterGrid.vue";
import { Printer } from "@/models/printers/printer.model";
import { PrintersService } from "@/backend";
import { formatBytes } from "@/utils/file-size.util";
import { infoMessageEvent } from "../../shared/alert.events";
import { convertMultiPrinterFileToQueue } from "@/utils/uploads-state.utils";
import HomeToolbar from "@/components/PrinterGrid/HomeToolbar.vue";
import { usePrinterStore } from "../../store/printer.store";
import { useUploadsStore } from "@/store/uploads.store";
import { useFeatureStore } from "../../store/features.store";
import { usePrinterStateStore } from "../../store/printer-state.store";

export default defineComponent({
  name: "PrinterGridView",
  components: { PrinterGrid, HomeToolbar },
  setup: () => {
    return {
      printersStore: usePrinterStore(),
      printerStateStore: usePrinterStateStore(),
      uploadsStore: useUploadsStore(),
      featureStore: useFeatureStore(),
    };
  },
  async created() {},
  async mounted() {},
  props: {},
  data(): {
    selectedFile?: File;
    viewedPrinter?: Printer;
  } {
    return {
      selectedFile: undefined,
      viewedPrinter: undefined,
    };
  },
  computed: {
    isBatchReprintFeatureAvailable(): boolean {
      return this.featureStore.hasFeature("batchReprintCalls");
    },
    hasPrintersSelected(): boolean {
      return this.selectedPrinters?.length > 0;
    },
    selectedPrinters() {
      return this.printersStore.selectedPrinters;
    },
    fileUpload() {
      return this.$refs.fileUpload as InstanceType<typeof HTMLInputElement>;
    },
  },
  methods: {
    deselectFile() {
      (this.$refs.fileUpload as InstanceType<typeof HTMLInputElement>)!.value = "";
      this.selectedFile = undefined;
    },
    formatBytes: formatBytes,
    clearSelectedPrinters() {
      this.printersStore.clearSelectedPrinters();
    },
    async batchReprintFiles() {
      await this.printersStore.batchReprintFiles();
    },
    async uploadFile() {
      const selectedPrinters = this.selectedPrinters;
      const accessiblePrinters = selectedPrinters.filter((p) =>
        this.printerStateStore.isApiResponding(p.id)
      );

      if (!this.selectedFile) return;

      // Checking and informing user
      const incompleteListCount = selectedPrinters.length - accessiblePrinters.length;
      if (incompleteListCount > 0) {
        this.$bus.emit(
          infoMessageEvent,
          `${incompleteListCount} printers were skipped as they are not accessible or disabled (now).`
        );
      }

      const uploads = convertMultiPrinterFileToQueue(accessiblePrinters, this.selectedFile);
      this.uploadsStore.queueUploads(uploads);

      this.fileUpload!.value = "";
      this.clearSelectedPrinters();
    },
    filesSelected() {
      if (!this.fileUpload.files) return (this.selectedFile = undefined);

      this.selectedFile = this.fileUpload.files[0];
    },
    deselectPrinter(printer: Printer) {
      this.printersStore.toggleSelectedPrinter(printer);
    },
    openPrinter(printer: Printer) {
      PrintersService.openPrinterURL(printer.printerURL);
    },
  },
});
</script>
