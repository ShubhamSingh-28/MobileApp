import { Platform } from "react-native";

export const API_URL =Platform.OS=="android"?'https://bubbly-backend.onrender.com':'https://bubbly-backend.onrender.com';

export const CLOUDINARY_CLOUD_NAME="shubham28";
export const CLOUDINARY_UPLOAD_PRESET="images";