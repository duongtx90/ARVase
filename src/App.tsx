/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, QrCode, Info } from 'lucide-react';

declare global {
  interface Window {
    AFRAME: any;
  }
}

const AScene = 'a-scene' as any;
const AMarker = 'a-marker' as any;
const AEntity = 'a-entity' as any;
const ASphere = 'a-sphere' as any;
const ACylinder = 'a-cylinder' as any;
const ATorus = 'a-torus' as any;

export default function App() {
  const [showMarker, setShowMarker] = useState(false);
  const [arReady, setArReady] = useState(false);
  const [markerFound, setMarkerFound] = useState(false);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Ensure A-Frame is loaded before rendering the scene
    const checkAframe = () => {
      if (window.AFRAME) {
        setArReady(true);
      } else {
        setTimeout(checkAframe, 100);
      }
    };
    checkAframe();
  }, []);

  useEffect(() => {
    if (!arReady) return;

    const marker = markerRef.current;
    if (!marker) return;

    const onMarkerFound = () => {
      setMarkerFound(true);
    };

    const onMarkerLost = () => {
      setMarkerFound(false);
    };

    marker.addEventListener('markerFound', onMarkerFound);
    marker.addEventListener('markerLost', onMarkerLost);

    return () => {
      marker.removeEventListener('markerFound', onMarkerFound);
      marker.removeEventListener('markerLost', onMarkerLost);
    };
  }, [arReady]);

  if (!arReady) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-zinc-900 text-white">
        <p>Loading AR Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      {/* AR Scene */}
      <AScene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true"
        vr-mode-ui="enabled: false"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <AMarker preset="hiro" ref={markerRef}>
          {/* Ceramic Vase */}
          <AEntity position="0 0 0" scale="0.8 0.8 0.8">
            {/* Base of the vase */}
            <ASphere 
              position="0 0.6 0" 
              radius="0.6" 
              scale="1 1.3 1" 
              material="color: #F8F9FA; roughness: 0.1; metalness: 0.1;"
            ></ASphere>
            
            {/* Neck of the vase */}
            <ACylinder 
              position="0 1.5 0" 
              radius="0.22" 
              height="0.8" 
              material="color: #F8F9FA; roughness: 0.1; metalness: 0.1"
            ></ACylinder>
            
            {/* Lip of the vase */}
            <ATorus 
              position="0 1.9 0" 
              radius="0.22" 
              radius-tubular="0.05" 
              rotation="90 0 0" 
              material="color: #F8F9FA; roughness: 0.1; metalness: 0.1"
            ></ATorus>

            {/* Decorative bands (Blue) */}
            <ACylinder
              position="0 1.0 0"
              radius="0.52"
              height="0.15"
              material="color: #1E3A8A; roughness: 0.2; metalness: 0.1"
            ></ACylinder>
            <ACylinder
              position="0 0.4 0"
              radius="0.58"
              height="0.05"
              material="color: #1E3A8A; roughness: 0.2; metalness: 0.1"
            ></ACylinder>
            <ACylinder
              position="0 1.5 0"
              radius="0.23"
              height="0.05"
              material="color: #1E3A8A; roughness: 0.2; metalness: 0.1"
            ></ACylinder>
          </AEntity>
        </AMarker>

        <AEntity camera></AEntity>
      </AScene>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex flex-col justify-between items-start z-10 pointer-events-none h-full">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl max-w-sm pointer-events-auto border border-white/20">
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2 mb-2">
            <Camera className="w-6 h-6 text-indigo-600" />
            AR Ceramic Vase
          </h1>
          <p className="text-sm text-zinc-600 mb-5 leading-relaxed">
            Point your camera at the AR marker to see the 3D ceramic vase appear in the real world.
          </p>
          <button
            onClick={() => setShowMarker(true)}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <QrCode className="w-5 h-5" />
            Show AR Marker
          </button>
        </div>

        {/* Vase Information Overlay */}
        {markerFound && (
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl max-w-sm pointer-events-auto border border-white/20 mt-auto animate-in slide-in-from-bottom-4 fade-in duration-300 self-center md:self-start">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-indigo-600" />
              Vase Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500 font-medium">Origin</span>
                <span className="text-zinc-900">Ancient Greece</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500 font-medium">Material</span>
                <span className="text-zinc-900">Terracotta</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500 font-medium">Artist</span>
                <span className="text-zinc-900">Unknown</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marker Modal */}
      {showMarker && (
        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowMarker(false)}
              className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </button>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">AR Marker</h2>
            <p className="text-zinc-600 mb-6 text-sm">
              Scan this marker with another device's camera, or print it out. The 3D vase will anchor to this image.
            </p>
            <div className="aspect-square w-full bg-white border-2 border-zinc-100 rounded-2xl flex items-center justify-center p-4 shadow-inner">
              <img 
                src="https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg" 
                alt="Hiro Marker"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-center text-zinc-400 mt-4">
              Standard Hiro Marker for AR.js
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
