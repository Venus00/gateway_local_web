import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/features/api";
import { ArrowDownToLine, ArrowUpFromLine, Workflow } from "lucide-react"
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function MachineState() {
    const { serial } = useParams();
    const { data: machine } = useQuery('machinesState', () => fetchMachines(), {
        initialData: {

        }, refetchInterval: 1000
    });

    const fetchMachines = async () => {
        try {
            const response = await apiClient.get(`/machine/${serial}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const submitOutput = async (e: any,deviceOutputId:number) => {
        const data = {
            machineId: machine.id,
            value: e,
            deviceOutputId,
        }
        try {
            await apiClient.post('/connection/action', data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">Machine {serial} State</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <ArrowDownToLine className="mr-2" />
                        Inputs
                    </h2>
                    {
                        machine?.connection?.machineInput?.split(',').map((element:string, key:number) => {
                            return (

                                <div key={key} className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <Workflow className="text-white" size={20} />
                                        </div>
                                        <span className="ml-2 font-medium">{element}</span>
                                        <span className="ml-2 font-medium">{machine.event.find((event: any) => event.element === element)?.value || '--'}</span>

                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <ArrowUpFromLine className="mr-2" />
                        Outputs
                    </h2>
                {
                    machine?.connection?.machineOutput?.split(',').map((element:string, key:number) => {
                        return (
                            <div key={key} className="bg-indigo-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center mb-2 justify-between">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <Workflow className="text-white" size={20} />
                                    </div>
                                    <span className="ml-2 font-medium">{element}</span>
                                    <Switch onCheckedChange={(e)=>submitOutput(e,machine?.connection?.deviceOutput[key].id)}/>
                                </div>

                            </div>
                        )
                    }
                )}
                </div>
            </div>
        </main>
    )
}