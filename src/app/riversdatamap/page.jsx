"use client";
import { useState } from "react";
import Layout from "../components/layout";
import RiversMap from "./LineDiagram.jpg";
import Image from "next/image";

export default function RiversDataMap() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const newScale = e.deltaY < 0 
            ? Math.min(scale + zoomFactor, 3)  // Zoom in (max 3x)
            : Math.max(scale - zoomFactor, 1); // Zoom out (min 1x)

        // Calculate the mouse position relative to the image container
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / rect.width; // % of width
        const offsetY = (e.clientY - rect.top) / rect.height; // % of height

        // Adjust the position based on zooming focus
        setPosition({
            x: offsetX * 100, 
            y: offsetY * 100
        });

        setScale(newScale);
    };


    return (
        <Layout>
            <div className="flex justify-center overflow-hidden">
                <div
                    className="cursor-zoom-in"
                    onWheel={handleWheel}
                    style={{
                        transformOrigin: `${position.x}% ${position.y}%`, // Zoom at cursor position
                        transform: `scale(${scale})`,
                        transition: "transform 0.1s ease-in-out",
                    }}
                >
                    <Image src={RiversMap} width={450} height={700} alt="riversmap" />
                </div>
            </div>
        </Layout>
    );
}