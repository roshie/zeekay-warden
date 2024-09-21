"use client";

import { DynamicWidget, useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import React from 'react';
import MacOSClassicUI from '../../app/mac-os-classic-ui';
import styles from './MainLayout.module.css';  // Create this CSS module file

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.mainLayout}>
      <MacOSClassicUI />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default MainLayout;