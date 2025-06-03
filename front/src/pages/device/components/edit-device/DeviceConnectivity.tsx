/* eslint-disable @typescript-eslint/no-unused-vars */
import { QrCode, RadioTower } from "lucide-react";
import { useEditDeviceStore } from "./device-store";
import { ConnectionType } from "../../device.dto";
import MQTTImage from "@/assets/images/mqttImage.png";
const connectionOptions = [
  {
    id: "MQTT",
    name: "MQTT",
    description: "Appareil avec prise en charge de la connectivité MQTT",
    icon: <img src={MQTTImage} alt="MQTT" width={40} height={40} />,
  },
  {
    id: "API",
    name: "API",
    description:
      "Appareil API générique avec prise en charge de la connectivité MQTT et HTTP",
    icon: (
      <img
        src="data:image/png;base64,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"
        alt="Dragino"
        width={40}
        height={40}
      />
    ),
    disabled: true,
  },
  {
    id: "lorawan",
    name: "LoRaWAN",
    description: "Choisissez parmi 16 Réseaux LoRaWAN",
    icon: <RadioTower className="w-12 h-12" />,
    disabled: true,
  },
  {
    id: "particle",
    name: "Particle",
    description: "Connectez vos appareils Particle",
    icon: (
      <img
        src="https://app.datacake.de/assets/particle-0ab38bc8.svg"
        alt="Particle"
        width={40}
        height={40}
      />
    ), // Replace with real logo path
    disabled: true,
  },

  {
    id: "claim-code",
    name: "Réclamation de code pin",
    description: "Réclamer un appareil existant par code pin",
    icon: <QrCode className="w-12 h-12" />,
    disabled: true,
  },
  {
    id: "dragino",
    name: "Dragino NB-IoT",
    description: "Connecter les appareils Dragino NB-IoT",
    icon: (
      <img
        src="https://app.datacake.de/assets/1nce-381292fa.svg"
        alt="Dragino"
        width={40}
        height={40}
      />
    ), // Replace with real logo path
    disabled: true,
  },
  {
    id: "1nce",
    name: "1NCE",
    description: "Connecter les appareils 1NCE",
    icon: (
      <img
        src="https://app.datacake.de/assets/dragino-3cbc2739.svg"
        alt="1NCE"
        width={40}
        height={40}
      />
    ), // Replace with real logo path
    disabled: true,
  },
];

export default function DeviceConnectivity() {
  const { data, setConnectionType } = useEditDeviceStore();

  return (
    <div className=" rounded-lg border  border-gray-300">
      {connectionOptions.map((option) => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-4 cursor-pointer ${
            data.connectionType === option.id
              ? "bg-primary/20"
              : "hover:bg-gray-50 dark:hover:bg-neutral-700"
          }`}
        >
          <input
            type="radio"
            name="connection"
            checked={data.connectionType === option.id}
            onChange={() => setConnectionType(option.id as ConnectionType)}
            className="form-radio accent-blue-600"
            disabled={option.disabled}
          />
          <div className="flex items-center gap-3 ">
            {option.icon}
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-500">
                {option.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-50">
                {option.description}
              </p>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
