import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = ["Light", "Standard", "Plus", "Enterprise"];
const details = [
  {
    title: "Devices",
    values: ["up to 10", "up to 50", "up to 200", "Unlimited"],
  },
  {
    title: "Entities",
    values: ["up to 10", "up to 20", "up to 50", "Custom Entities"],
  },
  {
    title: "Brokers",
    values: ["up to 10", "up to 20", "up to 50", "Custom Brokers"],
  },
  {
    title: "Connections",
    values: ["up to 10", "up to 20", "up to 50", "Custom Connections"],
  },
];

const features = [
  {
    title: "Dashboard Builder",
    values: [true, true, true, true],
  },
  {
    title: "Basic Rules",
    values: [true, true, true, true],
  },
  {
    title: "Reporting Engine",
    values: [false, true, true, true],
  },
  {
    title: "Advanced Rules",
    values: [false, false, true, true],
  },
];

const whiteLabel = [
  {
    title: "White Label",
    values: [true, true, true, true],
  },
];

const PricingTable = () => {
  return (
    <div className=" p-6 md:p-12 overflow-x-auto max-w-screen-lg mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-10">Plans</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left py-2"></th>
            {plans.map((plan) => (
              <th key={plan} className="text-center text-lg font-semibold py-2">
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {details.map((row) => (
            <tr key={row.title} className="border-t  border-gray-600">
              <td className="py-2 text-left text-sm ">{row.title}</td>
              {row.values.map((val, i) => (
                <td key={i} className="text-center py-2">
                  {val}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-gray-600">
            <td colSpan={5} className="py-4 text-left font-bold">
              Features
            </td>
          </tr>
          {features.map((row) => (
            <tr key={row.title} className="border-t border-gray-600">
              <td className="py-2 text-left">{row.title}</td>
              {row.values.map((hasFeature, i) => (
                <td key={i} className="text-center py-2">
                  {hasFeature && (
                    <Check className="inline w-5 h-5 text-green-400" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-gray-600">
            <td colSpan={5} className="py-4 text-left font-bold">
              -
            </td>
          </tr>
          {whiteLabel.map((row) => (
            <tr key={row.title} className="border-t border-gray-600">
              <td className="py-2 text-left">{row.title}</td>
              {row.values.map((hasFeature, i) => (
                <td key={i} className="text-center py-2">
                  {hasFeature && (
                    <Check className="inline w-5 h-5 text-green-400" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className=" ">
            <td></td>
            <td className="space-y-2 text-center ">
              <p className="opacity-0 text-xs mt-4">No invoice</p>
              <p className="text-2xl font-bold">150€</p>
              <p className="text-sm text-gray-300">per month</p>
              <Link to={"https://digisense.es/contact"}>
                <button className="mt-3 bg-primary hover:bg-primay/30 text-white px-4 py-2 rounded">
                  Contact
                </button>
              </Link>
            </td>
            <td className="text-center space-y-2">
              <p className="text-xs text-gray-300 italic mt-4">
                *Invoice only for annual payment
              </p>
              <p className="text-2xl font-bold mt-1">375€</p>
              <p className="text-sm text-gray-300">per month</p>
              <Link to={"https://digisense.es/contact"}>
                <button className="mt-3 bg-primary hover:bg-primay/30 text-white px-4 py-2 rounded">
                  Contact
                </button>
              </Link>
            </td>
            <td className="text-center space-y-2">
              <p className="text-xs text-gray-300 italic mt-4">
                *Invoice only for annual payment
              </p>
              <p className="text-2xl font-bold mt-1">625€</p>
              <p className="text-sm text-gray-300">per month</p>
              <Link to={"https://digisense.es/contact"}>
                <button className="mt-3 bg-primary hover:bg-primay/30 text-white px-4 py-2 rounded">
                  Contact
                </button>
              </Link>
            </td>
            <td className="text-center space-y-2">
              <p className="opacity-0 text-xs mt-4">No invoice</p>
              <p className="text-2xl font-bold">Custom</p>
              <p className="text-sm text-gray-300">Individual</p>
              <Link to={"https://digisense.es/contact"}>
                <button className="mt-3 bg-primary hover:bg-primay/30 text-white px-4 py-2 rounded">
                  Contact us
                </button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
