import 'dotenv/config';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function resize(file: File) {
	const input = Buffer.from(await file.arrayBuffer());

	return await sharp(input).resize(400, 400, { fit: 'cover' }).webp({ quality: 80 }).toBuffer();
}

export function upload(buffer: Buffer): Promise<string> {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: 'profilepictures' },
			(error, result) => {
				if (error || !result) return reject(error);
				resolve(result.secure_url);
			}
		);
		Readable.from(buffer).pipe(stream);
	});
}
