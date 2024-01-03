// utils/imageUtils.js
// import fs from 'fs';
// const fs = require('fs');
const imageSize = require('image-size');
const base64Img = require('base64-img');

export const optimizeAndEncodeImage =  async (inputImagePath, targetSizeInBytes)=> {
  try {
    // Get the dimensions of the original image
    const dimensions = imageSize(inputImagePath);

    // Calculate the initial quality (adjust as needed)
    let quality = 80;

    // Encode the image to Base64 with the initial quality
    let base64Image = base64Img.base64Sync(inputImagePath);

    // Continue reducing quality until the image size is within the target
    while (Buffer.from(base64Image, 'base64').length > targetSizeInBytes && quality >= 10) {
      quality -= 10;
      base64Image = base64Img.base64Sync(inputImagePath, '', quality);
    }

    // If the image is now smaller than the target size, return it as Base64
    if (Buffer.from(base64Image, 'base64').length <= targetSizeInBytes) {
      return base64Image;
    }

    // If after reducing quality, the image is still too large, return an error
    throw new Error('Image cannot be optimized to the target size.');
  } catch (error) {
    throw error;
  }
}

module.exports = { optimizeAndEncodeImage };
