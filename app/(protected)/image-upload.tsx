'use client';

import { useState } from "react";
import Image from 'next/image'
import { UploadDropzone } from "@/utils/uploadthing";
import { color } from "framer-motion";

const ImageUpload = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    return (
        <div>

        <UploadDropzone
            appearance={{
                label: {
                   color: 'white',
                },
                allowedContent: {
                    color: 'white',
                 },
                container: {
                    border: '1px dotted white',
                },
                uploadIcon: {
                    color: 'white',
                },
                button: {
                    background: 'red',
                }
            }}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                setImageUrl(res[0].url)
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
        {imageUrl.length ? <div>
            <Image src={imageUrl} alt="my image" width={500} height={500}/>
        </div> : null}
        </div>
    );
};

export default ImageUpload;