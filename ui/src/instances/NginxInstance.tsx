import React, {useEffect, useState} from 'react';
import {InstancesService} from "./InstancesService";
import {render} from "react-dom";
import {Simulate} from "react-dom/test-utils";
import loadedData = Simulate.loadedData;
import load = Simulate.load;

export function NginxInstance() {
    const [instances, setResponse] = useState<any>([]);
    const [loading, setTest] = useState<any>(true);
    const instanceService: any = new InstancesService()

    useEffect(() => {
        const instancePromise = async() => {
            instanceService.getInstances().then( (data: any) => {
                // add to the component\
                const instancesArray: Array<any> = []
                data.map(async(inst: any, index: number) => {
                  const container = await Promise.resolve(inst.promise).catch((error) => {})
                    // Refactoring needed here!
                    if  (container != undefined && !container.code) {
                        instancesArray.push({id: inst.container, out: container.stderr })
                        setResponse([...instances, ...instancesArray])
                    }
                });
            });
        }

        instancePromise().catch(console.error)
    }, []);

        return (
            <>
                Nginx Instances
                {instances.map((inst: any, index: number) => (
                    <ul>
                      <li key={index}>
                          {inst.id}
                          {inst.out}
                      </li>
                    </ul>
                ))}
            </>
        );
}
