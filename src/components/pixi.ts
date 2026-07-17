import { extend } from "@pixi/react";
import { Container, Graphics, Text, CanvasTextMetrics } from "pixi.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);
extend({ Container, Graphics, Text, CanvasTextMetrics });
