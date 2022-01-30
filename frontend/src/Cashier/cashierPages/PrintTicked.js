
import React, { useCallback } from 'react';
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;
export const PrintTicked = () => {

    const print = useCallback(async () => {
        let printer = new ThermalPrinter({
            type: 'printer',
            interface: '/dev/usb/lp0',
        });

        printer.alignCenter();
        printer.println("Hello world");
        // await printer.printImage('./assets/olaii-logo-black.png')
        printer.cut();

        try {
            let execute = printer.execute()
            console.error("Print done!");
        } catch (error) {
            console.log("Print failed:", error);
        }
    }, [])




    return (
        <button onClick={print} > Print </button>
    )
};
