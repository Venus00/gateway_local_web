import { Link } from "react-router-dom";
import Dashboards from "../../../assets/images/dashboards.png";
import { Button } from "@/components/ui/button";

export default function TextImageSection() {
  return (
    <section className="section  dark:bg-gray-900 py-20  max-w-screen-lg mx-auto">
      <div className="flex  gap-[2rem] ">
        <div className={`w-full  mb-6 md:mb-0 `}>
          <div className="overflow-hidden group h-full ">
            <img
              src={Dashboards}
              height={480}
              width={872}
              alt={"title"}
              className="transition-transform duration-300 h-full object-center w-full ease-out group-hover:scale-105 cursor-zoom-in"
            />
          </div>
        </div>
        {/* Text */}
        <div className={`w-full h-full flex flex-col space-y-8`}>
          {/* Title */}
          <h2 className="mb-1 text-5xl text-white ">
            End-to-End IoT Operating System
          </h2>

          {/* Subtitle */}

          <p className="mb-4 text-2xl font-bold underline text-white">
            From Sensor to Cloud in just a few minutes.
          </p>

          {/* Description */}
          <p className="mb-6 text-white text-2xl">
            Digital Sense is a multi-purpose, low-code IoT platform that
            requires no programming skills and minimal time to create custom IoT
            applications that can be brought into a white label IoT solution at
            the push of a button.
          </p>

          {/* Feature list */}

          {/* CTA */}
          <Link to={"/pricing"}>
            <Button className="p-6 text-lg hover:bg-white bg-[#DF4D07] hover:text-black rounded-lg">
              Start Now!
            </Button>
          </Link>
          <p className="mb-4 text-2xl font-bold underline text-white">
            Your first 2 devices are free!
          </p>
        </div>
      </div>
    </section>
  );
}
