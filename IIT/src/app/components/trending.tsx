import { motion } from "framer-motion";
import Image from "next/image";

const SquishyCard = () => {
  return (
    <section className="px-4 py-12 bg-black rounded">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* First Card */}
        <Card
          bgImage="/images/apparel.jpg"
          color="indigo"
          title="Apparel Section"
          price="$299/month"
          description="Discover the latest trends in fashion for every season."
        />

        {/* Second Card */}
        <Card
          bgImage="/images/beauty.jpg"
          color="green"
          title="Beauty and Personal Care"
          price="$99/month"
          description="Discover premium beauty and personal care products for a radiant and confident you."
        />

        {/* Third Card */}
        <Card
          bgImage="/images/sports.jpg"
          color="red"
          title="Sports and Outdoor"
          price="$499/month"
          description="Gear up for adventure with high-performance sports and outdoor essentials."
        />
      </div>
    </section>
  );
};

const Card = ({ color, title, price, description, bgImage }: any) => {
  return (
    <motion.div
      whileHover="hover"
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      variants={{
        hover: {
          scale: 1.05,
        },
      }}
      className={`relative h-96 md:w-full w-64 overflow-hidden rounded-xl bg-${color}-500 p-8`}
    >
      <div className="relative z-10 text-white bg-slate-600  p-2 rounded">
        <span className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light text-white">
          {title}
        </span>
        <motion.span
          initial={{ scale: 0.85 }}
          variants={{
            hover: {
              scale: 1,
            },
          }}
          transition={{
            duration: 1,
            ease: "backInOut",
          }}
          className="my-2 block origin-top-left font-mono text-4xl md:text-6xl font-black leading-[1.2]"
        >
          {price}
        </motion.span>
        <p>{description}</p>
      </div>
      <button className="absolute bottom-4 left-4 right-4 z-20 rounded border-2 border-white 0 py-2 text-center font-mono font-black uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white">
        Get it now
      </button>
      <Background bgImage={bgImage} />
    </motion.div>
  );
};

const Background = ({ bgImage }: any) => {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      variants={{
        hover: {
          scale: 1.5,
        },
      }}
      transition={{
        duration: 1,
        ease: "backInOut",
      }}
    >
      <motion.img
        src={bgImage}
        alt="Background Image"
        className="w-full h-full object-cover rounded-xl"
        initial={{ scaleY: 1 }}
        variants={{
          hover: {
            scaleY: 0.5,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
      />
    </motion.div>
  );
};

export default SquishyCard;
