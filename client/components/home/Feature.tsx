import { FadeInUp, Reveal } from "@components/common";
import classNames from "classnames";

interface FeatureProps {
  imageLeft?: boolean;
  imagePath: string;
  name: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ imageLeft, imagePath, name, description }) => {
  return (
    <div className={classNames({ "bg-gray-100": !imageLeft })}>
      <div
        className={classNames(
          "py-12 md:py-24 mx-auto max-w-6xl flex gap-4 md:flex-row flex-col lg:gap-20 flex-center px-2 sm:px-4 lg:px-0",
          { "md:flex-row-reverse": !imageLeft, "md:flex-row": imageLeft }
        )}
      >
        <FadeInUp className="md:w-3/5 h-full flex-shrink-0">
          <img alt="" className="w-full" src={imagePath} />
        </FadeInUp>
        <div className="p-2 md:px-0 md:flex-1">
          <Reveal from="bottom-right">
            <h2 className="text-2xl md:text-5xl font-semibold sm:font-bold mb-2 md:mb-8 max-w-3xl md:leading-[60px]">
              {name}
            </h2>
          </Reveal>
          <Reveal>
            <div className="text-base md:text-xl">{description}</div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Feature;
