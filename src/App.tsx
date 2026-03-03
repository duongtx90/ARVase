/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, Info } from 'lucide-react';

declare global {
  interface Window {
    AFRAME: any;
  }
}

const AScene = 'a-scene' as any;
const AMarker = 'a-marker' as any;
const AEntity = 'a-entity' as any;

export default function App() {
  const [showMarker, setShowMarker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [arReady, setArReady] = useState(false);
  const [markerFound, setMarkerFound] = useState(false);
  const markerRef = useRef<any>(null);

  useEffect(() => {
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

    const onMarkerFound = () => setMarkerFound(true);
    const onMarkerLost = () => setMarkerFound(false);

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
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* AR Scene — fills entire screen */}
      <AScene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true"
        vr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <AMarker preset="hiro" ref={markerRef}>
          <AEntity
            gltf-model="/models/porcelain_china_vase.glb"
            position="0 0 0"
            scale="0.1 0.1 0.1"
          ></AEntity>
        </AMarker>
        <AEntity camera></AEntity>
      </AScene>

      {/* Top bar — two small pill buttons */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-safe pt-4 pointer-events-none">
        {/* App label */}
        <span className="text-white text-sm font-semibold drop-shadow-lg select-none">
          AR Vase
        </span>

        {/* Action buttons */}
        <div className="flex gap-2 pointer-events-auto">
          {/* Info button — only visible when marker found */}
          {markerFound && (
            <button
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-lg"
            >
              <Info className="w-4 h-4" />
              Info
            </button>
          )}

          {/* Show marker button */}
          <button
            onClick={() => setShowMarker(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-lg"
          >
            <QrCode className="w-4 h-4" />
            Marker
          </button>
        </div>
      </div>

      {/* Scan hint — shown when marker not found */}
      {!markerFound && (
        <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs">
            Point camera at Hiro marker to start
          </div>
        </div>
      )}

      {/* Vase Info Sheet — slides up from bottom when marker found and info button tapped */}
      {showInfo && (
        <div
          className="fixed inset-0 z-40 flex items-end pointer-events-auto"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.25s ease-out' }}
          >
            <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-indigo-600" />
              Vase Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-100 pb-3">
                <span className="text-zinc-500 font-medium">Origin</span>
                <span className="text-zinc-900 font-semibold">China</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-3">
                <span className="text-zinc-500 font-medium">Material</span>
                <span className="text-zinc-900 font-semibold">Porcelain</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500 font-medium">Era</span>
                <span className="text-zinc-900 font-semibold">Ming Dynasty</span>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-zinc-900 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AR Marker Modal */}
      {showMarker && (
        <div className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setShowMarker(false)}
              className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </button>
            <h2 className="text-xl font-bold text-zinc-900 mb-1">AR Marker</h2>
            <p className="text-zinc-500 mb-5 text-xs leading-relaxed">
              Scan this with another device or print it out. The 3D vase will appear on this marker.
            </p>
            <div className="aspect-square w-full bg-white border-2 border-zinc-100 rounded-2xl flex items-center justify-center p-4 shadow-inner">
              <img
                src="https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg"
                alt="Hiro Marker"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-center text-zinc-400 mt-3">Standard Hiro Marker for AR.js</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
