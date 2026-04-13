import axios from 'axios';

const cloudname = 'dzadw7z7l';
const api_key = '257985899384859';
const api_secret = 'AInj9EwaIM9D1q2363jSwjR6W54';

export const uploadImage = async (uri: string) => {
  const formData = new FormData();
  // React Native requires a specific object for file uploads
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  
  formData.append('upload_preset', 'auto_rickshaw');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary Error:", error.response?.data || error.message);
    throw error;
  }
};
