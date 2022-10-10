import { Footer } from "@components/footer";
import { Feature, HeroBanner, LastFeature } from "@components/home";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <HeroBanner />
      <Feature
        imageLeft
        imagePath="/images/feature-1.svg"
        name="Create an invite&#8209;only place where you belong"
        description={`Discord servers are organized into topic-based channels where you
        can collaborate, share, and just talk about your day without
        clogging up a group chat.`}
      />
      <Feature
        imagePath="/images/feature-2.svg"
        name="Where hanging out is easy"
        description={`Grab a seat in a voice channel when you're free. Friends in your
        server can see you're around and instantly pop in to talk
        without having to call.`}
      />
      <Feature
        imageLeft
        imagePath="/images/feature-3.svg"
        name="From few to a fandom"
        description={`Get any community running with moderation tools and custom member
        access. Give members special powers, set up private channels, and
        more.`}
      />
      <LastFeature
        imagePath="/images/feature-4.svg"
        name="RELIABLE TECH FOR STAYING CLOSE"
        description={`Get any community running with moderation tools and custom member
            access. Give members special powers, set up private channels, and
            more.`}
      />
      <Footer />
    </div>
  );
};

export default Home;
