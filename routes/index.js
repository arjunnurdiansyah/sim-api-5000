import express from "express";

import { verifyToken } from "../middleware/VerifyTokenMiddleware.js";
import { accessToken } from "../controllers/Jwt/RefreshToken.js";

import {
  getUsers,
  Login,
  Logout,
  LoginWithUUID,
  getSession,
} from "../controllers/Users/UsersController.js";

import {
  getNationSales,
  getOutstandingSalesOrder,
  getSalesAchievement,
  getCountDays,
} from "../controllers/Sales/SalesDashboardController.js";

import {
  getDataCustomer,
  getDataParentCustomer,
  getDataChildCustomer,
  getDataCustomerSO,
} from "../controllers/Customers/CustomerContoller.js";

import {
  insertDataAttendance,
  getListFilesAttendance,
  getListFilesAttendanceByName,
} from "../controllers/Attendance/AttendanceController.js";

import {
  insertDataVisitPlan,
  getListFilesVisitPlan,
  getListFilesVisitPlanByName,
} from "../controllers/VisitPlan/VisitPlanController.js";

import {
  insertDataTest,
  getDataTest,
} from "../controllers/Test/TestController.js";

import {
  getDataLastCheckIn,
  getDataRefNumberSORequest,
  insertHeaderSORequest,
  insertDetailSORequest,
  insertAttachmentSORequest,
  getDataFGSORequest,
  getHeaderSORequest,
  getDetailSORequest,
  getAttachmentSORequest,
} from "../controllers/SalesVisit/SalesVisitContoller.js";

import {
  getDataPiutangCustomer,
  getDataInvoiceCustomer,
  generatePrintPaymentReceipt,
  getPrintPaymentReceipt,
  getDataBPPCode,
  insertHeaderPaymentReceipt,
  insertDetailPaymentReceipt,
  getHeaderPaymentReceipt,
  getDetailPaymentReceipt,
} from "../controllers/SalesVisit/PaymentReceiptContoller.js";

import { postingSalesVisit } from "../controllers/SalesVisit/PostingSalesVisitController.js";

import { getNationalSalesRevenue } from "../controllers/Sales/SalesRevenueDashboardController.js";

// import {
//   getListTimeSheet,
//   getDataCustomerTime,
// } from "../controllers/ListTimeSheet/ListTimeSheetController.js";

import { insertHeaderTimeSheet } from "../controllers/ListTimeSheet/InsertTimeSheetController.js";

import {
  insertHeaderCheckIn,
  insertAttachmentCheckIn,
} from "../controllers/CheckIn/CheckInController.js";

import { getDataAtt } from "../controllers/ListAtt/ListAttController.js";
import {
  getDataCheck,
  updateIsEditChekcIn,
} from "../controllers/ListCheck/ListCheckController.js";
import {
  getDataOPRV,
  getDataOCTY,
  getDataOSDT,
  getDataOVIL,
  getDataOARA,
} from "../controllers/ListAll/ListAll.js";

// import { insertDataProspectiveCustomer } from "../controllers/ProspectiveCustomer/ProspectiveCustomerController.js";

import {
  getListTimeSheet,
  getDataCustomerTime,
} from "../controllers/ListTimeSheet/ListTimeSheetController.js";

// import { insertDataTimeSheet } from "../controllers/ListTimeSheet/InsertTimeSheetController.js";

import { insertDataProspectiveCustomer } from "../controllers/ProspectiveCustomer/ProspectiveCustomerController.js";

import {
  insertHeaderMaterialPromotion,
  insertDetailMaterialPromotion,
  getDataItemMaterialPromotion,
  getDataDraftMaterialPromotion,
  insertAttachmentMaterialPromotion,
} from "../controllers/SalesVisit/MaterialPromotionController.js";

import {
  insertHeaderCustomerFeedBack,
  insertDetailCustomerFeedBack,
  getDraftFeedback,
  insertAttachmentCustomerFeedBack,
} from "../controllers/SalesVisit/CustomerFeedbackController.js";

import {
  insertHeaderCompetitorData,
  insertDetailCompetitorData,
  getDataSize,
  getDataDraftCompetitorData,
  insertAttachmentCompetitorData,
} from "../controllers/SalesVisit/CompetitorDataController.js";

import {
  insertHeaderProgramPromo,
  insertDetailProgramPromo,
  insertAttachmentProgramPromo,
  getDataDraftProgramPromo,
} from "../controllers/SalesVisit/ProgramPromoController.js";

const router = express.Router();

// AUTH
router.get("/users", verifyToken, getUsers);
router.get("/user", getUsers);
// router.post('/users', Register);
router.post("/login", Login);
router.post("/login2", LoginWithUUID);
router.post("/token", accessToken);
router.delete("/logout", Logout);
router.get("/session", verifyToken, getSession);

// SALES - DASHBOARD
router.get("/sales/dashboard/national-sales", verifyToken, getNationSales);
router.get(
  "/sales/dashboard/outstanding-so",
  verifyToken,
  getOutstandingSalesOrder
);
router.get(
  "/sales/dashboard/sales-achievement",
  verifyToken,
  getSalesAchievement
);
router.get("/sales/dashboard/sales-achievement-count-days", getCountDays);
router.get("/sales/dashboard/sales-revenue", getNationalSalesRevenue);

// CUSTOMER
router.get("/customer", getDataCustomer);
router.get("/customer/parent", getDataParentCustomer);
router.get("/customer/child", getDataChildCustomer);
router.get("/customer/sales-order-history", getDataCustomerSO);

// SALES VISIT
router.get("/sales-visit/last-checkin", getDataLastCheckIn);
router.get("/sales-visit/so-request/code", getDataRefNumberSORequest);
router.post("/sales-visit/so-request/header", insertHeaderSORequest);
router.post("/sales-visit/so-request/detail", insertDetailSORequest);
router.post("/sales-visit/so-request/attachment", insertAttachmentSORequest);
router.get("/sales-visit/so-request/item", getDataFGSORequest);
router.get("/sales-visit/so-request/header", getHeaderSORequest);
router.get("/sales-visit/so-request/detail", getDetailSORequest);
router.get("/sales-visit/so-request/attachment", getAttachmentSORequest);
router.post("/sales-visit/posting", postingSalesVisit);

// PAYMENT RECEIPT
router.get("/sales-visit/pay-receipt/piutang", getDataPiutangCustomer);
router.get("/sales-visit/pay-receipt/invoice", getDataInvoiceCustomer);
router.get("/sales-visit/pay-receipt/print", generatePrintPaymentReceipt);
router.get("/sales-visit/pay-receipt/print/:name", getPrintPaymentReceipt);
router.get("/sales-visit/pay-receipt/code", getDataBPPCode);
router.post("/sales-visit/pay-receipt/header", insertHeaderPaymentReceipt);
router.post("/sales-visit/pay-receipt/detail", insertDetailPaymentReceipt);
router.get("/sales-visit/pay-receipt/header", getHeaderPaymentReceipt);
router.get("/sales-visit/pay-receipt/detail", getDetailPaymentReceipt);

// SALES VISIT
router.get("/sales-visit/last-checkin", getDataLastCheckIn);
router.get("/sales-visit/so-request/code", getDataRefNumberSORequest);
router.post("/sales-visit/so-request/header", insertHeaderSORequest);
router.post("/sales-visit/so-request/detail", insertDetailSORequest);
router.post("/sales-visit/so-request/attachment", insertAttachmentSORequest);
router.get("/sales-visit/so-request/item", getDataFGSORequest);
router.get("/sales-visit/so-request/header", getHeaderSORequest);
router.get("/sales-visit/so-request/detail", getDetailSORequest);
router.get("/sales-visit/so-request/attachment", getAttachmentSORequest);
router.post("/sales-visit/posting", postingSalesVisit);

// PAYMENT RECEIPT
router.get("/sales-visit/pay-receipt/piutang", getDataPiutangCustomer);
router.get("/sales-visit/pay-receipt/invoice", getDataInvoiceCustomer);
router.get("/sales-visit/pay-receipt/print", generatePrintPaymentReceipt);
router.get("/sales-visit/pay-receipt/print/:name", getPrintPaymentReceipt);
router.get("/sales-visit/pay-receipt/code", getDataBPPCode);
router.post("/sales-visit/pay-receipt/header", insertHeaderPaymentReceipt);
router.post("/sales-visit/pay-receipt/detail", insertDetailPaymentReceipt);
router.get("/sales-visit/pay-receipt/header", getHeaderPaymentReceipt);
router.get("/sales-visit/pay-receipt/detail", getDetailPaymentReceipt);

// VISIT PLAN
router.post("/visit-plan", insertDataVisitPlan);
router.get("/visit-plan/files", getListFilesVisitPlan);
router.get("/visit-plan/files/:name", getListFilesVisitPlanByName);

// TEST
router.post("/test", insertDataTest);
router.get("/test", getDataTest);

// MATERIAL PROMOTION
router.post(
  "/sales-visit/material-promotion/header",
  insertHeaderMaterialPromotion
);
router.post(
  "/sales-visit/material-promotion/detail",
  insertDetailMaterialPromotion
);
router.get(
  "/sales-visit/material-promotion/getdatamp",
  getDataItemMaterialPromotion
);
router.get(
  "/sales-visit/material-promotion/getdrafmp",
  getDataDraftMaterialPromotion
);
router.post(
  "/sales-visit/material-promotion/attachment",
  insertAttachmentMaterialPromotion
);

// CUSTOMER FEEDBACK
router.post(
  "/sales-visit/customer-feedback/header",
  insertHeaderCustomerFeedBack
);
router.post(
  "/sales-visit/customer-feedback/detail",
  insertDetailCustomerFeedBack
);
router.post(
  "/sales-visit/customer-feedback/attachment",
  insertAttachmentCustomerFeedBack
);
router.get("/sales-visit/customer-feedback/getold", getDraftFeedback);

// COMPETITOR DATA
router.post("/sales-visit/competitor-data/header", insertHeaderCompetitorData);
router.post("/sales-visit/competitor-data/detail", insertDetailCompetitorData);
router.get("/sales-visit/competitor-data/getsize", getDataSize);
router.get("/sales-visit/competitor-data/getold", getDataDraftCompetitorData);
router.post(
  "/sales-visit/competitor-data/attachment",
  insertAttachmentCompetitorData
);

// PROGRAM AND PROMO
router.post("/sales-visit/program-promo/header", insertHeaderProgramPromo);
router.post("/sales-visit/program-promo/detail", insertDetailProgramPromo);
router.post(
  "/sales-visit/program-promo/attachment",
  insertAttachmentProgramPromo
);
router.get("/sales-visit/program-promo/getold", getDataDraftProgramPromo);

// ATTENDANCE
router.post("/attendance", insertDataAttendance);
router.get("/attendance/files", getListFilesAttendance);
router.get("/attendance/files/:name", getListFilesAttendanceByName);

// ATTENDANCE
router.post("/checkin/header", insertHeaderCheckIn);
router.post("/checkin/attachment", insertAttachmentCheckIn);

// Menu Attendance List
router.get("/attendance/customer", getDataAtt);

// Menu Check List
router.get("/checkin/customer", getDataCheck);
router.post("/checkin/visit-list/do-add-edit", updateIsEditChekcIn);

// Menu Time Sheet
router.post("/timesheet/header", insertHeaderTimeSheet);
router.get("/timesheet/customer", getListTimeSheet);
router.get("/timesheet/customertime", getDataCustomerTime);

// Menu Prospective Customer
router.post("/prospectivecustomer", insertDataProspectiveCustomer);
router.get("/getAll/province", getDataOPRV);
router.get("/getAll/city", getDataOCTY);
router.get("/getAll/sub", getDataOSDT);
router.get("/getAll/village", getDataOVIL);
router.get("/getAll/area", getDataOARA);

export default router;
