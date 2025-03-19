// import express from "express";
// import {
//   createSupplier,
//   getSuppliers,
//   getSupplierById,
//   updateSupplier,
//   deleteSupplier,
// } from "../controllers/supplier.controller";
// import { authenticateJWT } from "../middleware/auth.middleware";
// import { authorizeRole } from "../middleware/authorizeRole.middleware";

// const router = express.Router();

// router.get("/", authenticateJWT, getSuppliers); // Everyone can view suppliers

// router.get("/:id", authenticateJWT, getSupplierById); // Everyone can view a supplier

// router.post("/", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), createSupplier); // Only Admins & Managers

// router.put("/:id", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), updateSupplier); // Only Admins & Managers

// router.delete("/:id", authenticateJWT, authorizeRole(["ADMIN"]), deleteSupplier); // Only Admins

// export default router;


import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";

const router = express.Router();

router.get("/", authenticateJWT, getCustomers); // Everyone can view customers

router.get("/:id", authenticateJWT, getCustomerById); // Everyone can view a customer

router.post("/", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), createCustomer); // Only Admins & Managers

router.put("/:id", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), updateCustomer); // Only Admins & Managers

router.delete("/:id", authenticateJWT, authorizeRole(["ADMIN"]), deleteCustomer); // Only Admins

export default router;