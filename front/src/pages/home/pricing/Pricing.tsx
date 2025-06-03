import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PricingTable from "./PricingTable";

const docsUrl = `${import.meta.env.VITE_DOCS_URL}`;
export default function Pricing() {
  return (
    <section className="w-full gap-0 relative  py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="relative ">
        <div className="max-w-screen-xl pb-64 mx-auto w-full px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-4 max-w-[90%] flex flex-col">
              <h1 className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                First 2 Devices Free
              </h1>
              <p className="mx-auto  text-white  md:text-2xl dark:text-gray-400">
                Trying out the Digisense platform is risk-free and building IoT
                applications has never been easier. It includes every feature
                plus unlimited users, unlimited workspaces and no per user fees.
              </p>
              <p className="mx-auto max-w-[400px] !mt-10  text-primary/60  md:text-xl dark:text-gray-400">
                LoRaWAN Network Server and Unlimited Gateways always included at
                no extra charge!
              </p>
              <div className="flex items-center gap-4 max-w-[400px] mx-auto">
                <Link to={"/signup"}>
                  <Button className="p-6 text-lg hover:bg-white hover:text-black rounded-lg">
                    Sign up for free
                  </Button>
                </Link>
                <Link to={docsUrl} target="_blank">
                  <Button
                    variant={"outline"}
                    className="p-6 bg-transparent text-lg rounded-lg text-white"
                  >
                    Read Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-shape-divider-bottom-1747835536 ">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
      <div className="bg-[#1c2a39] text-white flex-1 relative">
        <PricingTable />
      </div>
    </section>
  );
}
