import React, {useState} from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css'

function ImageUpload({username}) {

    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress)
            },
            (error) => {
                // Error function ... 
                console.log(error);
                alert(error.message)
            },
            () => {
                // complete functoin ... 
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image insite db ... 
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("")
                        setImage(null)

                    })
            }
        )
    }

    return (
        <div className='imageupload'>

            <progress className='image__upload' value={progress} max='100' />
            <input
                type='text' 
                value={caption} 
                className='enter_caption'
                placeholder="Enter a caption..."
                onChange={(e) => setCaption(e.target.value)}
            />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>

        </div>
    )
}

export default ImageUpload
