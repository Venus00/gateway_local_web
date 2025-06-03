import { apiClient } from '@/features/api';
import { toast } from '@/hooks/use-toast';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Server, Share2Icon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BrokerDto } from './Broker.dto';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/auth/store';

function BrokerFormDialog() {
    const { tenant } = useSelector((state: RootState) => state.auth);

    const [broker, setBroker] = useState<BrokerDto>({
        tenantId: tenant.id,
        clientId: '',
        host: '',
        name: '',
        password: '',
        port: 1883,
        ip: '',
        username: '',
        topic: '',
    })
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await apiClient.post(`broker`, broker);
            toast({
                title: 'Broker Creation  Status',
                description: 'broker has been succefully added',
                variant: 'default'
            })
            setBroker({
                tenantId: tenant.id,
                clientId: '',
                host: '',
                name: '',
                password: '',
                port: 1883,
                ip: '',
                username: '',
                topic: '',
            })

        } catch (error) {
            console.log(error)
            toast({
                description: 'Error in Borker Creation ',
                variant: 'destructive'
            })
        } finally {
            console.log("finnaly")
            //setIsLoading(false)
        }
    };
    return (
        <Card className="w-full  dark:bg-neutral-800 mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Share2Icon className="h-6 w-6" />
                    Mqtt Connectivity
                </CardTitle>
                <CardDescription>Configure New Mqtt Broker Connection</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className=' flex gap-2'>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. --"
                                    value={broker.name}
                                    onChange={(e) => setBroker({ ...broker, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="ip-address">Host Address</Label>
                                <Input
                                    id="ip-address"
                                    placeholder="e.g. 192.168.1.100"
                                    value={broker.ip}
                                    onChange={(e) => setBroker({ ...broker, ip: e.target.value })}
                                    required
                                />
                            </div>


                        </div>

                        <div className=' flex gap-2'>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="ip-address">clientId</Label>
                                <Input
                                    id="clientId"
                                    placeholder="e.g. clientId"
                                    value={broker.clientId}
                                    onChange={(e) => setBroker({ ...broker, clientId: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="port">port</Label>
                                <Input
                                    id="port"
                                    placeholder="e.g. 1883"
                                    value={broker.port}
                                    onChange={(e) => setBroker({ ...broker, port: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                        </div>
                        <div className=' flex gap-2'>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="gateway-address">username</Label>
                                <Input
                                    id="username"
                                    placeholder="e.g. username"
                                    value={broker.username}
                                    onChange={(e) => setBroker({ ...broker, username: e.target.value })}

                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="ip-address">password</Label>
                                <Input
                                    id=""
                                    placeholder="password"
                                    value={broker.password}
                                    onChange={(e) => setBroker({ ...broker, password: e.target.value })}

                                />
                            </div>

                        </div>
                        <div className=' flex gap-2'>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="topic_event">Event Topic</Label>
                                <Input
                                    id=""
                                    placeholder="e.g. /nxt/devices/+/event"
                                    value={broker.topic}
                                    onChange={(e) => setBroker({ ...broker, topic: e.target.value })}
                                    required
                                />
                            </div>


                        </div>
                    </div>

                    <Button type="submit" className="justify-center">
                        <Server className="mr-2 h-4 w-4" />
                        Add Connection
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default BrokerFormDialog