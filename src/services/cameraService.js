import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const handleCapture = async () => {
  try {
    // 1. Open the camera
    const photo = await Camera.getPhoto({
      quality: 80, // Reduced slightly to keep the payload size safe
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    // 2. JUST return the base64 string.
    // Do NOT call getMultiPageSummary here!
    return photo.base64String;
  } catch (error) {
    console.error("User cancelled or camera failed", error);
    return null;
  }
};
