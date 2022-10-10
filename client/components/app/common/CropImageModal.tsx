import { ImageDimension, resizeCropImage } from "@utils/image";
import classNames from "classnames";
import { motion } from "framer-motion";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoMdImage } from "react-icons/io";
import { Button } from "./button";
import { ModalCancelButton, ModalFormFooter } from "./modal";
import Slider from "./Slider";

export interface CropImageModalProps {
  image: string;
  onClose: () => any;
  onSelect: (base64: string) => any;
  round?: boolean;
  ratio?: number;
}

const CropImageModal = ({ image, onClose, onSelect, round, ratio = 1.77 }: CropImageModalProps) => {
  const constraintsRef = useRef(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageNaturalSize, setImageNaturalSize] = useState<ImageDimension>({
    width: 0,
    height: 0,
  });
  const [imageSize, setImageSize] = useState<ImageDimension>({
    width: 0,
    height: 0,
  });
  const [overlaySize, setOverlaySize] = useState<ImageDimension | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const cropRatio = useMemo(() => {
    if (round) return 1;
    let cropRatio = +ratio.toFixed(2);
    return cropRatio;
  }, [round, ratio]);

  //Crop image using canvas
  const onSubmit = () => {
    if (overlaySize) {
      setLoading(true);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = overlaySize.width;
      canvas.height = overlaySize.height;

      var img = new Image();
      img.onload = function () {
        if (ctx) {
          var style = window.getComputedStyle(imageRef.current as Element);
          var matrix = new WebKitCSSMatrix(style.transform);
          ctx.translate(matrix.m41, matrix.m42);
          if (imageSize) {
            ctx.drawImage(
              img,
              canvas.width / 2 - imageSize.width / 2,
              canvas.height / 2 - imageSize.height / 2,
              imageSize.width,
              imageSize.height
            );
          }
          const base64 = canvas.toDataURL();
          onSelect(base64);
          onClose();
        }
      };

      img.src = image;
    }
  };

  //Get natural size
  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      setImageNaturalSize({ width: imgWidth, height: imgHeight });
    };
  }, []);

  //Set image size and overlay
  useEffect(() => {
    if (imageNaturalSize.width !== 0 && cropContainerRef.current) {
      const imgWidth = imageNaturalSize.width;
      const imgHeight = imageNaturalSize.height;
      const containerWidth = cropContainerRef.current.clientWidth;
      const containerHeight = cropContainerRef.current.clientHeight;

      const { width, height } = resizeCropImage({
        imgHeight,
        imgWidth,
        zoom,
        cropRatio,
        maxWidth: containerWidth,
        maxHeight: containerHeight,
      });
      setImageSize({ width, height });
      if (_.isNull(overlaySize)) {
        let overlayWidth = 0,
          overlayHeight = 0;
        if (width / height < cropRatio) {
          overlayWidth = Math.min(containerWidth, width);
          overlayHeight = overlayWidth / cropRatio;
        } else {
          overlayHeight = Math.min(containerHeight, height);
          overlayWidth = overlayHeight * cropRatio;
        }
        setOverlaySize({ width: overlayWidth, height: overlayHeight });
      }
    }
  }, [image, zoom, imageNaturalSize]);

  return (
    <div className="w-[600px] rounded-lg relative bg-background-primary select-none">
      <div className="p-4">
        <h1 className="font-semibold text-[22px] mb-4">Edit Image</h1>
        <div
          ref={cropContainerRef}
          className="bg-black rounded-md h-[400px] flex-center relative overflow-hidden"
        >
          <motion.img
            ref={imageRef}
            style={{
              width: imageSize?.width,
              height: imageSize?.height,
              maxWidth: imageSize?.width,
            }}
            drag
            dragConstraints={constraintsRef}
            className="h-full w-auto"
            src={image}
            dragElastic={false}
            dragMomentum={false}
          />
          {!_.isEmpty(image) && (
            <motion.div
              ref={constraintsRef}
              style={{
                width: overlaySize?.width ?? 0,
                height: overlaySize?.height ?? 0,
              }}
              className={classNames(
                "bg-transparent absolute border-[5px]",
                "border-white pointer-events-none ring-[9999px] ring-zinc-800/60",
                {
                  "rounded-full": round,
                }
              )}
            />
          )}
        </div>
        <div className="flex px-12 pt-2 items-center space-x-6">
          <IoMdImage size={16} />
          <Slider
            className="flex-1"
            onChange={(v) => {
              setZoom(1 + v / 100);
            }}
          />
          <IoMdImage size={32} />
        </div>
      </div>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button loading={loading} onClick={onSubmit} grow size="small">
          Apply
        </Button>
      </ModalFormFooter>
    </div>
  );
};

export default CropImageModal;
