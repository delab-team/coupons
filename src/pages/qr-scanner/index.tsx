import { FC, useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

import { MainTitle } from '../../components/main-title';
import { Link } from '../../components/link';

import QR from '../../assets/images/qr/qr.svg';

import s from './qr-scanner.module.scss';

interface QrScannerPageProps {}

export const QrScannerPage: FC<QrScannerPageProps> = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [qrResult, setQRResult] = useState<string>('link');

  useEffect(() => {
    const initializeScanner = async () => {
      const videoElement = videoRef.current;

      if (!videoElement) {
        console.error("Video element not found");
        return;
      }

      try {
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          console.error("No camera found");
          return;
        }

        const scanner = new QrScanner(videoElement, (result: string) => {
          setQRResult(result);
        });

        scanner.start();

        return () => {
          scanner.stop();
        };
      } catch (error) {
        console.error("Error initializing QR scanner:", error);
      }
    };

    initializeScanner();
  }, []);

  useEffect(() => {
    const scanQRCodeFromImage = async () => {
      try {
        const result = await QrScanner.scanImage(QR);
        if (result) {
          setQRResult(result);
        } else {
          console.error("QR code not found in the image");
        }
      } catch (error) {
        console.error("Error scanning QR code from image:", error);
      }
    };

    scanQRCodeFromImage();
  }, []);

  return (
    <section>
      <MainTitle title="Scan QR code" />
      <div className={s.qrContent}>
        <div className={s.qr}>
          <video className={s.qrCamera} ref={videoRef} autoPlay playsInline />
          <img src={QR} alt="qr img" className={s.qrImage} />
        </div>
      </div>
      <Link text={qrResult} href={qrResult} />
    </section>
  );
};