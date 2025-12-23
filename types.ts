// Fix: Added missing import for THREE to resolve namespace errors in the OrnamentData interface
import * as THREE from 'three';

export enum TreeState {
  DISPERSED = 'DISPERSED',
  FORMED = 'FORMED'
}

export enum OrnamentType {
  SPHERE = 0,
  BOX = 1,
  GEM = 2,
  USER = 3,
  HEPTAGRAM = 4
}

export interface OrnamentData {
  id: number;
  tPos: THREE.Vector3;
  cPos: THREE.Vector3;
  type: OrnamentType;
  color: THREE.Color;
  scale: THREE.Vector3;
  textureIndex: number;
  localIndex: number;
  phase: number;
  rotSpeed: number;
  rotationAxis: THREE.Vector3;
  alwaysVisible: boolean;
}
