import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import PrinterGridView from "@/components/PrinterGrid/PrinterGridView.vue";
import PrintersView from "@/components/PrinterList/PrintersView.vue";
import Settings from "../components/Settings/SettingsView.vue";
import AboutHelp from "../components/AboutHelp/AboutView.vue";
import PrintStatisticsView from "@/components/PrintStatistics/PrintStatisticsView.vue";
import OctoPrintSettings from "@/components/Settings/OctoPrintSettings.vue";
import EmergencyCommands from "../components/Settings/EmergencyCommands.vue";
import UserManagementSettings from "@/components/Settings/UserManagementSettings.vue";
import FloorSettings from "@/components/Settings/FloorSettings.vue";
import GridSettings from "../components/Settings/GridSettings.vue";
import SoftwareUpgradeSettings from "../components/Settings/SoftwareUpgradeSettings.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: PrinterGridView,
  },
  {
    path: "/printers",
    name: "PrintersView",
    component: PrintersView,
  },
  {
    path: "/settings",
    component: Settings,
    children: [
      {
        path: "",
        redirect: "grid",
      },
      {
        path: "grid",
        component: GridSettings,
      },
      {
        path: "floors",
        component: FloorSettings,
      },
      {
        path: "user-management",
        component: UserManagementSettings,
      },
      {
        path: "octoprint",
        component: OctoPrintSettings,
      },
      {
        path: "emergency-commands",
        component: EmergencyCommands,
      },
      {
        path: "software-upgrade",
        component: SoftwareUpgradeSettings,
      },
    ],
  },
  {
    path: "/statistics",
    name: "Print Statistics",
    component: PrintStatisticsView,
  },
  {
    path: "/about",
    name: "About",
    component: AboutHelp,
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "about" */ "../views/NotFoundView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
