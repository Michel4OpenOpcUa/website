// Screenshots and demo videos for project pages, keyed by project id.
// Screenshots live in src/assets/projects/<id>/ so Astro optimizes them;
// videos and their posters live in public/videos/.
import type { ImageMetadata } from 'astro';
import sunspecExplorer from '../assets/projects/sunspec-explorer/inverter.png';
import modbusTraceExplorer from '../assets/projects/modbus-trace-explorer/timeline.png';

export interface ProjectMedia {
	screenshot?: { src: ImageMetadata; alt: string; caption?: string };
	video?: { src: string; poster?: string; caption?: string };
}

export const projectMedia: Record<string, ProjectMedia> = {
	'sunspec-explorer': {
		screenshot: {
			src: sunspecExplorer,
			alt: 'SunSpec Explorer connected to a three-phase inverter, showing model 103 with every point decoded: label, value with units, type, scale factor, raw value and register address.',
			caption: 'Model 103 of a three-phase inverter, every point decoded with units, scale factors, raw values and register addresses.',
		},
		video: {
			src: '/videos/sunspec-explorer-demo.mp4',
			poster: '/videos/sunspec-explorer-demo.jpg',
			caption: 'One minute with SunSpec Explorer: connect, browse decoded models, poll, record and export, against a device simulated with sunspecctl serve.',
		},
	},
	'modbus-trace-explorer': {
		screenshot: {
			src: modbusTraceExplorer,
			alt: 'Modbus Trace Explorer with a ten-minute trace of six devices open: the timeline lists each transaction with time, client, server, unit, transaction ID, function and summary, and the detail pane decodes the selected Read Holding Registers response field by field with its byte ranges.',
			caption: 'The timeline: one row per transaction, request and response together, with the selected response decoded field by field down to the bytes.',
		},
		video: {
			src: '/videos/modbus-trace-explorer-demo.mp4',
			poster: '/videos/modbus-trace-explorer-demo.jpg',
			caption: 'Two minutes with Modbus Trace Explorer on a synthetic site trace: find slow devices, poll problems and wrong registers, then export a device for replay.',
		},
	},
};
