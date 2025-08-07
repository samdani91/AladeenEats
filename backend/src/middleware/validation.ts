import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


export const validatePromotionRequest = [
  body("code").isString().notEmpty().withMessage("Promo code must be a string"),
  body("discount").isFloat({ min: 0, max: 100 }).withMessage("Discount must be a percentage between 0 and 100"),
  body("validUntil").isISO8601().toDate().withMessage("Valid until must be a valid date"),
  handleValidationErrors,
];

export const validateReviewRequest = [
  body("restaurantId").isMongoId().withMessage("Restaurant ID must be a valid Mongo ID"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
  body("menuItemId").optional().isMongoId().withMessage("Menu item ID must be a valid Mongo ID"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice").isFloat({ min: 0 }).withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime").isInt({ min: 0 }).withMessage("Estimated delivery time must be a positive integer"),
  body("cuisines").isArray().not().isEmpty().withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price").isFloat({ min: 0 }).withMessage("Menu item price is required and must be a positive number"),
  body("menuItems.*.description").optional().isString().withMessage("Menu item description must be a string"), // Added
  handleValidationErrors,
];


// export const validateMyRestaurantRequest = [
//   body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
//   body("city").notEmpty().withMessage("City is required"),
//   body("country").notEmpty().withMessage("Country is required"),
//   body("deliveryPrice")
//     .isFloat({ min: 0 })
//     .withMessage("Delivery price must be a positive number"),
//   body("estimatedDeliveryTime")
//     .isInt({ min: 0 })
//     .withMessage("Estimated delivery time must be a postivie integar"),
//   body("cuisines")
//     .isArray()
//     .withMessage("Cuisines must be an array")
//     .not()
//     .isEmpty()
//     .withMessage("Cuisines array cannot be empty"),
//   body("menuItems").isArray().withMessage("Menu items must be an array"),
//   body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
//   body("menuItems.*.price")
//     .isFloat({ min: 0 })
//     .withMessage("Menu item price is required and must be a postive number"),
//   handleValidationErrors,
// ];
