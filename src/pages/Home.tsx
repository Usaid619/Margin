import React from 'react';
import { HeroWrite } from '../components/home/HeroWrite';
import { NoticeSection } from '../components/home/NoticeSection';
import { ExploreModes } from '../components/home/ExploreModes';
import { MetaphorSection } from '../components/home/MetaphorSection';
import { HomeClosing } from '../components/home/HomeClosing';

export function Home() {
  return (
    <>
      <HeroWrite />
      <NoticeSection />
      <ExploreModes />
      <MetaphorSection />
      <HomeClosing />
    </>);

}