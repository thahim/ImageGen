export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  hasReference: boolean;
}

export interface GenerationRequest {
  prompt: string;
  referenceImageBase64?: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}