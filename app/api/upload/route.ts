import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { User } from '@/models/User';

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

// Helper to parse form data
async function parseForm(req: Request): Promise<{ files: any }> {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    // @ts-ignore
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files });
    });
  });
}

export async function POST(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { files } = await parseForm(request);
    
    // The key 'file' is hardcoded in EditableImage.tsx and Upload.tsx
    const file = files.file[0];
    
    // Read file from temporary path
    const fileData = fs.readFileSync(file.path);
    const contentType = mime.lookup(file.path) || 'application/octet-stream';
    const ext = file.originalFilename.split('.').pop();
    const newFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: newFilename,
      Body: fileData,
      ContentType: contentType,
      ACL: 'public-read',
    }));

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;

    // Check if this is a profile image/cover update
    const type = (request.headers.get('upload-type')); // We'll add this in the component
    
    if (type === 'cover' || type === 'image') {
      await User.findByIdAndUpdate(session.user.id, { [type]: fileUrl });
    }

    return NextResponse.json({ src: fileUrl });

  } catch (error) {
    console.error("Upload Error: ", error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}