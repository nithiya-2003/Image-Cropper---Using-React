import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Slider } from '@mui/material';
import { Upload, Download, Image as ImageIcon, Crop } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCrop = async () => {
    if (image && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {!image && (
        <div className="w-full max-w-md mx-auto text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload an Image</h3>
            <p className="text-gray-500 text-sm">Click to select or drag and drop your image here</p>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          <div className="w-full">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Original Image
              </h3>
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-6">
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Zoom Level</p>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, zoom) => setZoom(zoom as number)}
                    className="text-indigo-600"
                  />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCrop}
                  startIcon={<Crop />}
                  fullWidth
                  style={{ backgroundColor: '#4F46E5' }}
                >
                  Crop Image
                </Button>
              </div>
            </div>
          </div>

          {croppedImage && (
            <div className="w-full">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Crop className="w-5 h-5" />
                  Cropped Result
                </h3>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-white shadow-inner">
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-6">
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = 'cropped-image.jpg';
                      link.href = croppedImage;
                      link.click();
                    }}
                  >
                    Download Cropped Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCropper;