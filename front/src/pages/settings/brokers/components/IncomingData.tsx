import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/features/api';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { useQuery } from 'react-query';

function IncomingData() {

    const { data: devices } = useQuery('devices', () => fetchDevices(), { initialData: [], refetchInterval: 2000 });


    const fetchDevices = async () => {
        try {
            const response = await apiClient.get('/device');
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return [];
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Incoming Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-2'>
                    <Select>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select a Device" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    devices.map((device: { name: string }) => {
                                        return (
                                            <SelectItem value={device.name}>{device.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Textarea
                        className="font-mon
                    o text-sm"
                        value=""
                        readOnly
                        rows={20}
                    />
                </div>

            </CardContent>
        </Card>
    )
}

export default IncomingData