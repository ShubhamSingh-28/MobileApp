import { Platform } from "react-native";

export const API_URL =Platform.OS=="android"?'http://192.168.128.254:3000':'http://localhost:3000';

export const CLOUDINARY_CLOUD_NAME="shubham28";
export const CLOUDINARY_UPLOAD_PRESET="images";