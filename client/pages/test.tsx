import ImageContainer from "@app/common/media/ImageWrapper";
import useMount from "@hooks/useMount";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const mounted = useMount();

  return (
    <div className="theme-dark">
      asdasd
      <div className="bg-input-background p-2">
        <ImageContainer
          imgWidth={320}
          imgHeight={240}
          src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mov-file.mov"
        />
      </div>
    </div>
  );
};

export default Home;
