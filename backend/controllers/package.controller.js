import Package from "../models/package.model.js";
import braintree from "braintree";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";
dotenv.config();

//payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,  // braintree.Environment.Production
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create package
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages,
    } = req.body;

    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      !packageOffer === "" ||
      !packageImages
    ) {
      return res.status(200).send({
        success: false,
        message: "All fields are required!",
      });
    }
    if (packagePrice < packageDiscountPrice) {
      return res.status(200).send({
        success: false,
        message: "Regular price should be greater than discount price!",
      });
    }
    if (packagePrice <= 0 || packageDiscountPrice < 0) {
      return res.status(200).send({
        success: false,
        message: "Price should be greater than 0!",
      });
    }
    if (packageDays <= 0 && packageNights <= 0) {
      return res.status(200).send({
        success: false,
        message: "Provide days and nights!",
      });
    }

    const newPackage = await Package.create(req.body);
    if (newPackage) {
      return res.status(201).send({
        success: true,
        message: "Package created successfully",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Soemthing went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get all packages
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;  // Default limit is set to 9
    const page = parseInt(req.query.page) || 1;    // Current page number
    const startIndex = (page - 1) * limit;          // Calculate starting index for pagination

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] }; // Default to include all offers if not specified
    }

    const sort = req.query.sort || "createdAt"; // Default sorting by creation date
    const order = req.query.order === "asc" ? 1 : -1; // Ascending or descending order

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order }) // Sort packages based on the provided sort order
      .limit(limit)            // Limit the number of packages returned
      .skip(startIndex);       // Skip the first 'startIndex' packages

    // Count total packages to calculate total pages for pagination
    const totalPackages = await Package.countDocuments({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    });

    const totalPages = Math.ceil(totalPackages / limit); // Calculate total pages

    return res.status(200).send({
      success: true,
      packages,
      totalPages,          // Send total pages for pagination
      currentPage: page,   // Send current page information
      totalPackages,       // Send total packages count
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching packages",
    });
  }
};


//get package data
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req?.params?.id);
    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });
    }
    return res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.log(error);
  }
};

//update package
export const updatePackage = async (req, res) => {
  try {
    const findPackage = await Package.findById(req.params.id);
    if (!findPackage)
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete package
export const deletePackage = async (req, res) => {
  try {
    const deletePackage = await Package.findByIdAndDelete(req?.params?.id);
    return res.status(200).send({
      success: true,
      message: "Package Deleted!",
    });
  } catch (error) {
    cnsole.log(error);
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
