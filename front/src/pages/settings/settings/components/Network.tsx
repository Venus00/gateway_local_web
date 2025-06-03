import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { apiClient } from '@/features/api'
import { toast } from '@/hooks/use-toast'
import { Server, Wifi } from 'lucide-react'
import { useState } from 'react'

function Network() {

    const [isDhcp, setIsDhcp] = useState(true)
    const [ipAddress, setIpAddress] = useState("")
    const [gatewayAddress, setGatewayAddress] = useState("")
    const [dnsServer, setDnsServer] = useState("")

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        console.log({
            isDhcp,
            ipAddress: isDhcp ? null : ipAddress,
            gatewayAddress: isDhcp ? null : gatewayAddress,
            dnsServer: isDhcp ? null : dnsServer,
        })
        try {

            const response = await apiClient.post(`network/ethernet`, {
                isDhcp,
                ipAddress: isDhcp ? null : ipAddress,
                gatewayAddress: isDhcp ? null : gatewayAddress,
                dnsServer: isDhcp ? null : dnsServer,
            });
            if (response.data.includes('connection succes')) {
                toast({
                    description: 'Configuration Updated',
                    variant: 'default'
                })

            } else {
                toast({
                    description: 'Error Updating Configuration ',
                    variant: 'destructive'
                })
            }


        } catch (error) {
            toast({
                description: 'Error Updating Configuration ',
                variant: 'destructive'
            })
        } finally {
            //setIsLoading(false)
        }
    };



    return (
        <div className=" bg-gray-100 dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
            <Card className="w-full mx-auto dark:bg-neutral-800">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Wifi className="h-6 w-6" />
                        Network Configuration
                    </CardTitle>
                    <CardDescription>Configure your Ethernet connection settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dhcp-toggle" className="text-sm font-medium">
                                Use DHCP
                            </Label>
                            <Switch
                                id="dhcp-toggle"
                                checked={isDhcp}
                                onCheckedChange={setIsDhcp}
                            />
                        </div>

                        {!isDhcp && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ip-address">IP Address</Label>
                                    <Input
                                        id="ip-address"
                                        placeholder="e.g. 192.168.1.100"
                                        value={ipAddress}
                                        onChange={(e) => setIpAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gateway-address">Gateway Address</Label>
                                    <Input
                                        id="gateway-address"
                                        placeholder="e.g. 192.168.1.1"
                                        //value={gatewayAddress}
                                        //onChange={(e) => setGatewayAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dns-server">DNS Server</Label>
                                    <Input
                                        id="dns-server"
                                        placeholder="e.g. 8.8.8.8"
                                        //   value={dnsServer}
                                        //   onChange={(e) => setDnsServer(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="justify-center">
                            <Server className="mr-2 h-4 w-4" />
                            Apply Configuration
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Network