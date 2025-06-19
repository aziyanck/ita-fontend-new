import smartHomeMain from "../../assets/carousel/smart-home.jpg";
import smartLivingMain from "../../assets/carousel/smart-living.jpg";
import smartOfficeMain from "../../assets/carousel/smart-office.jpg";

import cctv from "../../assets/carousel/cctv.png";
import lock from "../../assets/carousel/lock.png";
import tv from "../../assets/carousel/tv.png";
import fireAl from "../../assets/carousel/fire-alarm.png";
import gate from "../../assets/carousel/gate.png";
import garden from "../../assets/carousel/smart-garden.png";
import kitchen from "../../assets/carousel/kitchen.png";

import lift from "../../assets/carousel/lift.png"
import hvac from "../../assets/carousel/hvac.png"
import gym from "../../assets/carousel/gym.png"
import curtain from "../../assets/carousel/curtain.png"
import energy from "../../assets/carousel/energy.png"
import fireSafety from "../../assets/carousel/fire-safe.png"
import visitor from "../../assets/carousel/visit.png"

import admin from "../../assets/carousel/admin.png"
import cabine from "../../assets/carousel/cabine.png"
import confRoom from "../../assets/carousel/conf.png"
import secuMonit from "../../assets/carousel/secuMonitor.png"

const featuresData = [
  {
    title: "Smart Home",
    mainImage: smartHomeMain,
    carouselImages: [cctv, lock, tv, garden, gate, fireAl, kitchen],
  },
  {
    title: "Smart Living",
    mainImage: smartLivingMain,
    carouselImages: [lift, hvac, gym, curtain, energy, fireSafety, visitor],
  },
  {
    title: "Smart Office",
    mainImage: smartOfficeMain,
    carouselImages: [admin, cabine, confRoom, secuMonit, lift, gate, hvac],
  },
];

export default featuresData;
