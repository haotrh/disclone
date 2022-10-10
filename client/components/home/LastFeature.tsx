import { FadeIn, SlideUp } from "@components/common";
import React from "react";

interface LastFeatureProps {
  imagePath: string;
  name: string;
  description: string;
}

const LastFeature: React.FC<LastFeatureProps> = ({ imagePath, name, description }) => {
  return (
    <div className="bg-gray-100 py-8 md:py-20 flex-center flex-col">
      <div className="p-2 xs:p-4 md:p-0">
        <SlideUp>
          <h2 className="text-4xl md:text-5xl font-bold md:text-center leading-[60px] px-2 md:px-6">
            {name}
          </h2>
        </SlideUp>
        <SlideUp duration={0.8}>
          <div className="text-lg md:text-xl max-w-4xl md:text-center p-2 md:px-6">
            {description}
          </div>
        </SlideUp>
      </div>
      <FadeIn>
        <img alt="" className="max-w-screen" src={imagePath} />
      </FadeIn>
    </div>
  );
};

export default LastFeature;
