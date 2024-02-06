const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const mongoose = require("mongoose");  




const createProduct = asyncHandler(async(req,res) => {
    const {name,
       sku,
       category,
       brand,
       quantity,
       description,
       image,
       regularPrice,
       price,
       color,} = req.body

       if(!name || !category || !brand || !quantity || !price || !description){
        res.status(400);
        throw new Error("Please fill in all fields")
       } 

       //Create Product
       const product = await Product.create({
        name,
       sku,
       category,
       brand,
       quantity,
       description,
       image,
       regularPrice,
       price,
       color,
       })

       res.status(201).json(product);
});

//Get Products
const getProducts = asyncHandler(async (req,res) => {
   const products = await Product.find().sort("-createdAt");
    res.status(200).json(products);
});

//Get Single Product
const getProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(404);
        throw new Error("Product Not Found");
    }
    res.status(200).json(product);
 });

 // Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        res.status(404).json({ message: "Product Not Found" });
      } else {
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product Deleted" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  //Update product
  const updateProduct = asyncHandler(async(req,res) => {
    const{
        name,
        category,
        brand,
        quantity,
        description,
        image,
        regularPrice,
        price,
        color,
    }= req.body;

    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }
    // update
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id: req.params.id},
        {
         name,
        category,
        brand,
        quantity,
        description,
        image,
        regularPrice,
        price,
        color,
        },
        {
            new: true,
            runValidators: true,
        }
    )
    res.status(200).json(updatedProduct)
  });

  //Review Product
  const reviewProduct = asyncHandler(async(req,res) => {
    const {star, review , reviewDate} = req.body
    const{id} = req.params

    //Validation
    if( star < 1 || !review){
        res.status(400);
        throw new Error("Please add a star and review");
    }

    const product = await Product.findById(id)

    if(!product){
        res.status(400);
        throw new Error("Product not found");
    }

    //Update Rating
    product.ratings.push(
        {
            star,
            review,
            reviewDate,
            name: req.user.name,
            userID: req.user._id,
        }
    )
    product.save()
    res.status(200).json({message: "Product review added"})
  });

  //Delete Review
  const deleteReview = asyncHandler(async(req,res)=> {
    const {userID} = req.body
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(400);
        throw new Error("Product not found");
    }

    const newratings = product.ratings.filter((ratings) => {
        return ratings.userID.toString() !== userID.toString()
    })
    product.ratings = newratings
    product.save()
    res.status(200).json({message: "Product review deleted"})
  })
  //update Review
  const updateReview = asyncHandler(async (req, res) => {
    const { star, review, reviewDate, userID } = req.body;
    const { id } = req.params;

    // Validation
    if (star < 1 || !review) {
        res.status(400);
        throw new Error("Please add a star and review");
    }

    try {
        const updatedReview = await Product.findOneAndUpdate(
            { _id: id, "ratings.userID": mongoose.Types.ObjectId(userID) },
            {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.review": review,
                    "ratings.$.reviewDate": reviewDate,
                },
            },
            { new: true }
        );

        if (updatedReview) {
            res.status(200).json({ message: "Product Review Updated", updatedReview });
        } else {
            res.status(400).json({ message: "Product Review Not Updated" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    // ... other exports
    updateReview,
};

  
  module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
  };
  
module.exports = {
    createProduct,getProducts,getProduct,deleteProduct,updateProduct,reviewProduct,deleteReview,updateReview
}